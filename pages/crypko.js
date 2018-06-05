import { PureComponent } from 'react';
import fetch from 'isomorphic-unfetch';

import { URI_API } from '../util/common';
import * as types from '../util/types';
import Layout from '../components/Layout';
import Crypko from '../components/Crypko';

const detailMemo = {};
async function fetchDetail(crypkoId) {
  if (!detailMemo[crypkoId]) {
    const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
    const json = await res.json();
    detailMemo[crypkoId] = json;
  }
  return detailMemo[crypkoId];
}

export default class CrypkoPage extends PureComponent {
  static async getInitialProps({ query }) {
    const { id } = query;
    const crypkoProps = await fetchDetail(id);
    return { crypko: crypkoProps };
  }

  render() {
    const { crypko } = this.props;
    return (
      <Layout>
        <Crypko crypko={crypko} />
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  crypko: types.crypko.isRequired,
};
