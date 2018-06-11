import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import { Motion, spring } from 'react-motion';

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
  componentDidMount = () => {
    const { id, addCache, fetchCache } = this.props;
    // console.log(`mount: ${this.props.id}`);

    const detail = this.getDetail();
    if (!detail) {
      if (detail === null) {
        // console.log(`fetching ${id}`);
      }
      if (typeof detail === 'undefined') {
        // console.log(`fetch ${id}`);
        fetchCache(id);
        fetchDetail(id, fetchCache).then((json) => {
          addCache(id, json);
        });
      }
    }
  };

  componentWillUnmount = () => {
    // console.log(`unmount :${this.props.id}`);
  };

  getDetail = () => {
    const { id, cache } = this.props;
    return cache[id];
  };

  render() {
    const { id, ax, ay, baseSize, padding, edgeTo } = this.props;
    const detail = this.getDetail();

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
        <Motion style={{ x: spring(cx), y: spring(cy) }}>
          {({ x, y }) => (
            <Link href={{ pathname: '/crypko', query: { id } }} as={`/c/${id}`}>
              <svg
                x={x}
                y={y}
                style={{
                  overflow: 'visible',
                  cursor: 'pointer',
                }}
              >
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
          )}
        </Motion>
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
