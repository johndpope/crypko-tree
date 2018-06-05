import { PureComponent } from 'react';
import fetch from 'isomorphic-unfetch';
import { connect } from 'react-redux';
import * as cacheModule from '../modules/crypkoCache';

import { URI_API } from '../util/common';
import * as types from '../util/types';
import Layout from '../components/Layout';
import CrypkoTree from '../components/CrypkoTree';

const detailCache = {};
async function fetchDetail(crypkoId) {
  if (!detailCache[crypkoId]) {
    const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
    const json = await res.json();
    detailCache[crypkoId] = json;
  }
  return detailCache[crypkoId];
}

class CrypkoPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('constructor');
    console.log(props);
  }

  static async getInitialProps({ store, query }) {
    const { id } = query;
    const detail = await fetchDetail(id);
    console.log('getInitialProps');

    store.dispatch(cacheModule.add(id, detail));

    return {
      target: Number(id),
    };
  }

  render() {
    console.log('render');
    console.log(this.props);

    return (
      <Layout>
        <CrypkoTree target={this.props.target} cache={this.props.cache} />
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};

export default connect(
  (state) => ({
    cache: state,
  }),
  (dispatch) => ({
    addCache: (id, detail) => dispatch(cacheModule.add(id, detail)),
    fetchCache: (id) => dispatch(cacheModule.fetch(id)),
  })
)(CrypkoPage);
