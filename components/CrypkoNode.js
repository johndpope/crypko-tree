import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import { connect } from 'react-redux';
import * as cacheModule from '../modules/crypkoCache';
import CrypkoImage from './CrypkoImage';
import * as types from '../util/types';
import { URI_API } from '../util/common';

async function fetchDetail(crypkoId) {
  const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
  const json = await res.json();
  return json;
}

function CrypkoNode(props) {
  const { id, cache, addCache, fetchCache } = props;
  const { x, y } = props;
  const detail = cache[id];
  if (!detail) {
    if (detail === null) {
      console.log(`fetching ${id}`);
    }
    if (typeof detail === 'undefined') {
      console.log(`fetch ${id}`);
      fetchCache(id);
      fetchDetail(id, fetchCache).then((json) => {
        addCache(id, json);
      });
    }
  }

  return (
    <Link href={{ pathname: '/crypko', query: { id } }} as={`/c/${id}`}>
      <svg x={x} y={y}>
        <CrypkoImage detail={detail} />
        <rect
          style={{ stroke: '#30abef', fill: 'transparent' }}
          x="0"
          y="0"
          width="192"
          height="192"
        />
        <text x="10" y="20">
          {(detail && detail.name) || `(${id})`}{' '}
          {detail && `Iter${detail.iteration}`}
        </text>
      </svg>
    </Link>
  );
}

CrypkoNode.propTypes = {
  id: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  addCache: types.func.isRequired,
  fetchCache: types.func.isRequired,
  x: types.number.isRequired,
  y: types.number.isRequired,
};

export default connect(
  (state) => ({
    cache: state,
  }),
  (dispatch) => ({
    addCache: (id, detail) => dispatch(cacheModule.add(id, detail)),
    fetchCache: (id) => dispatch(cacheModule.fetch(id)),
  })
)(CrypkoNode);
