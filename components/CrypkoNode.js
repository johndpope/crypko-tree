import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import CrypkoImage from './CrypkoImage';
import * as types from '../util/types';
import { URI_API } from '../util/common';

async function fetchDetail(crypkoId) {
  const res = await fetch(`${URI_API}/crypkos/${crypkoId}/detail`);
  const json = await res.json();
  return json;
}

export default function CrypkoNode(props) {
  const { id, cache, addCache } = props;
  const { x, y } = props;
  const detail = cache[id];
  if (!detail) {
    fetchDetail(id).then((json) => {
      addCache(id, json);
    });
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
        <text x="200" y="40">
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
  x: types.number.isRequired,
  y: types.number.isRequired,
};
