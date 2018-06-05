import { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as cacheModule from '../modules/crypkoCache';

import * as types from '../util/types';
import Layout from '../components/Layout';
import CrypkoTree from '../components/CrypkoTree';
import CrypkoNodes from '../components/CrypkoNodes';
import CrypkoEdges from '../components/CrypkoEdges';

class CrypkoPage extends PureComponent {
  static async getInitialProps({ query }) {
    const { id } = query;

    return {
      target: Number(id),
    };
  }

  render() {
    return (
      <Layout>
        <CrypkoTree>
          <CrypkoEdges />
          <CrypkoNodes {...this.props} />
        </CrypkoTree>
      </Layout>
    );
  }
}

CrypkoPage.propTypes = {
  target: types.number.isRequired,
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
