import { Component } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-unfetch';

import * as cacheModule from '../modules/crypkoCache';
import Layout from '../components/Layout';
import CrypkoNodes from '../components/CrypkoNodes';
import CrypkoTree from '../components/CrypkoTree';
import * as types from '../util/types';
import { URI_API } from '../util/common';

async function apiDetail(crypkoId) {
  console.log(`fetch ${crypkoId}`);
  const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
  const json = await res.json();
  return json;
}

function makeGraph({ id, cache, min, max, base = null }, depth = 0, from = 0) {
  const detail = cache[id];
  const originRange = () => depth >= 0 && depth < max;
  const derivativeRange = () => depth <= 0 && depth > min;

  const graph = {
    id,
    depth,
    detail: detail || base,
    needFetch: originRange() || derivativeRange(),
    isCached: !!detail,
  };
  if (detail) {
    if (originRange() && detail.matron && detail.matron.id !== from) {
      graph.matron = makeGraph(
        { id: detail.matron.id, cache, min, max, base: detail.matron },
        depth + 1,
        id
      );
    }
    if (originRange() && detail.sire && detail.sire.id !== from) {
      graph.sire = makeGraph(
        { id: detail.sire.id, cache, min, max, base: detail.sire },
        depth + 1,
        id
      );
    }
    if (derivativeRange()) {
      graph.derivatives = detail.derivatives
        .filter((derivative) => derivative.id !== from)
        .map((derivative) =>
          makeGraph(
            { id: derivative.id, cache, min, max, base: derivative },
            depth - 1,
            id
          )
        );
    } else {
      graph.derivatives = [];
    }
  }
  return graph;
}

function needFetchNodes(graph) {
  const _ = needFetchNodes;
  if (graph) {
    if (graph.isCached) {
      return [
        ..._(graph.matron),
        ..._(graph.sire),
        ...graph.derivatives.reduce((prev, d) => [...prev, ..._(d)], []),
      ];
    } else if (graph.needFetch) {
      return [graph.id];
    }
  }
  return [];
}

class CrypkoPage extends Component {
  state = {
    graph: {},
  };
  static getDerivedStateFromProps = (props) => {
    const graphProps = {
      id: props.id,
      cache: props.cache,
      min: props.min,
      max: props.max,
    };
    return {
      graph: makeGraph(graphProps),
    };
  };
  componentDidMount = () => {
    this.componentDidUpdate();
  };
  shouldComponentUpdate = (nextProps) => {
    if (nextProps.id !== this.props.id) {
      return true;
    }
    if (Object.values(nextProps.fetching).every((v) => !v)) {
      return true;
    }
    return false;
  };
  componentDidUpdate = () => {
    const unfetchNodes = needFetchNodes(this.state.graph).filter(
      (id) => !this.props.fetching[id]
    );
    this.props.fetchCache(unfetchNodes).then();
  };

  static async getInitialProps({ query, store, isServer }) {
    const { id } = query;
    if (!isServer && !store.getState().details[id]) {
      const json = await apiDetail(id);
      store.dispatch(cacheModule.add(id, json));
    }
    return {
      id: Number(id),
      min: -1,
      max: 2,
    };
  }

  render() {
    console.warn('Page');
    const { graph } = this.state;

    return (
      <Layout>
        <CrypkoTree width={1200} height={800}>
          <CrypkoNodes graph={graph} />
        </CrypkoTree>
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  id: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  fetching: types.crypkoFetching.isRequired,
  fetchCache: types.func.isRequired,
};

export default connect(
  (state) => ({
    cache: state.details,
    fetching: state.fetching,
  }),
  (dispatch) => ({
    fetchCache: async (ids) => {
      ids.forEach((id) => dispatch(cacheModule.fetch(id)));
      const jsons = await Promise.all(ids.map(apiDetail));
      jsons.forEach((json, i) => dispatch(cacheModule.add(ids[i], json)));
    },
  })
)(CrypkoPage);
