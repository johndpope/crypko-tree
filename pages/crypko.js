import { Component } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-unfetch';

import * as cacheModule from '../modules/crypkoCache';
import Layout from '../components/Layout';
import CrypkoNodes from '../components/CrypkoNodes';
import CrypkoTree from '../components/CrypkoTree';
import * as types from '../util/types';
import { URI_API } from '../util/common';

function makeGraph({ id, cache, min, max }, depth = 0, from = 0) {
  const detail = cache[id];

  const originRange = () => depth >= 0 && depth < max;
  const derivativeRange = () => depth <= 0 && depth > min;

  if (!detail) {
    return {
      id,
      depth,
    };
  }
  return {
    id,
    depth,
    detail,
    matron:
      originRange() && detail.matron && detail.matron.id !== from
        ? makeGraph({ id: detail.matron.id, cache, min, max }, depth + 1, id)
        : null,
    sire:
      originRange() && detail.sire && detail.sire.id !== from
        ? makeGraph({ id: detail.sire.id, cache, min, max }, depth + 1, id)
        : null,
    derivatives: derivativeRange()
      ? detail.derivatives
          .filter((derivative) => derivative.id !== from)
          .map((derivative) =>
            makeGraph({ id: derivative.id, cache, min, max }, depth - 1, id)
          )
      : [],
  };
}

function blanks(graph) {
  const _ = blanks;
  if (graph) {
    if (graph.detail) {
      return [
        ..._(graph.matron),
        ..._(graph.sire),
        ...graph.derivatives.reduce((prev, d) => [...prev, ..._(d)], []),
      ];
    }
    return [graph.id];
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
    const unfetch = blanks(this.state.graph).filter(
      (id) => !this.props.fetching[id]
    );
    this.props.fetchCache(unfetch).then();
  };

  static async getInitialProps({ query }) {
    const { id } = query;

    return {
      id: Number(id),
      min: -2,
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

async function apiDetail(crypkoId) {
  const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
  const json = await res.json();
  return json;
}

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
