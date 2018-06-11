import { PureComponent } from 'react';
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

class CrypkoNode extends PureComponent {
  componentWillMount = () => {
    console.log(`mount: ${this.props.id}`);
  };
  componentWillReceiveProps = (nextProps) => {
    const prev = this.props;
    const next = nextProps;
    console.log(`update: ${this.props.id}`, prev, next);
  };
  componentWillUnmount = () => {
    console.log(`unmount :${this.props.id}`);
  };

  render() {
    const { id, cache, addCache, fetchCache } = this.props;
    const { ax, ay, baseSize, padding, edgeTo } = this.props;

    const detail = cache[id];
    if (!detail) {
      if (detail === null) {
        // console.log(`fetching ${id}`);
      }
      if (typeof detail === 'undefined') {
        console.log(`fetch ${id}`);
        fetchCache(id);
        fetchDetail(id, fetchCache).then((json) => {
          addCache(id, json);
        });
      }
    }

    const cx = ax - baseSize / 2;
    const cy = ay - baseSize / 2;
    let edge = null;
    if (edgeTo) {
      const edgePath = `M ${edgeTo.x},${edgeTo.y} v ${(ay - edgeTo.y) /
        2} h ${ax - edgeTo.x} v ${(ay - edgeTo.y) / 2}`;
      edge = (
        <path
          d={edgePath}
          stroke="gray"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0,10"
          fill="none"
        />
      );
    }

    return (
      <>
        {edge}
        <Link href={{ pathname: '/crypko', query: { id } }} as={`/c/${id}`}>
          <svg x={cx} y={cy} style={{ overflow: 'visible', cursor: 'pointer' }}>
            <CrypkoImage detail={detail} baseSize={baseSize} />
        <text
              x={0}
              y={baseSize + padding * 2}
          fill="gray"
          style={{ cursor: 'text' }}
        >
          {(detail && detail.name) || `(${id})`}{' '}
          {detail && `Iter${detail.iteration}`}
        </text>
          </svg>
        </Link>
      </>
    );
  }
}

CrypkoNode.propTypes = {
  id: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  addCache: types.func.isRequired,
  fetchCache: types.func.isRequired,
  ax: types.number.isRequired,
  ay: types.number.isRequired,
  baseSize: types.number.isRequired,
  padding: types.number.isRequired,
  edgeTo: types.point,
};
CrypkoNode.defaultProps = {
  edgeTo: null,
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
