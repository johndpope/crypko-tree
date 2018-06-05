import { PureComponent } from 'react';
import fetch from 'isomorphic-unfetch';

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

export default class CrypkoPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static async getInitialProps({ query }) {
    const { id } = query;
    await fetchDetail(id);

    return {
      target: Number(id),
      cache: detailCache,
    };
  }

  render() {
    return (
      <Layout>
        <CrypkoTree {...this.props} />
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};
