import { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as cacheModule from '../modules/crypkoCache';

import * as types from '../util/types';
import Layout from '../components/Layout';
import CrypkoTree from '../components/CrypkoTree';

class CrypkoPage extends PureComponent {
  static async getInitialProps({ query }) {
    const { id } = query;

    return {
      id: Number(id),
    };
  }

  render() {
    return (
      <Layout>
        <CrypkoTree {...this.props} min={-2} max={2} />
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  id: types.number.isRequired,
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
