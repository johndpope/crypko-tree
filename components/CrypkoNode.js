import { Component } from 'react';
import Link from 'next/link';
import { Motion, spring } from 'react-motion';
import { shallowEqualProps } from 'shallow-equal-props';

import CrypkoEdge from './CrypkoEdge';
import CrypkoImage from './CrypkoImage';
import * as types from '../util/types';

class CrypkoNode extends Component {
  shouldComponentUpdate = (nextProps) => {
    const curr = { ...this.props };
    const next = { ...nextProps };
    delete curr.detail;
    delete next.detail;
    if (
      shallowEqualProps(curr, next) &&
      shallowEqualProps(this.props.detail, nextProps.detail)
    ) {
      return false;
    }
    return true;
  };

  onMouseEnter = () => {
    this.timerId = setTimeout(() => {
      if (!this.props.isCached) {
        this.props.fetchCache([this.props.id]);
      }
    }, 200);
  };
  onMouseLeave = () => {
    clearTimeout(this.timerId);
  };

  render() {
    console.warn(`Node`);
    const {
      id,
      ax,
      ay,
      baseSize,
      padding,
      edgeX,
      edgeY,
      detail,
      isCached,
    } = this.props;

    const cx = ax - baseSize / 2;
    const cy = ay - baseSize / 2;
    return (
      <Motion
        defaultStyle={{ x: edgeX || 0, y: edgeY || 0 }}
        style={{ x: spring(cx), y: spring(cy) }}
      >
        {({ x, y }) => (
          <>
            {Number.isNaN(edgeX) || Number.isNaN(edgeY) ? null : (
              <CrypkoEdge
                fromX={edgeX}
                fromY={edgeY}
                toX={x + baseSize / 2}
                toY={y + baseSize / 2}
              />
            )}
            <Link href={{ pathname: '/crypko', query: { id } }} as={`/c/${id}`}>
              <svg
                x={x}
                y={y}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                style={{
                  overflow: 'visible',
                  cursor: 'pointer',
                }}
              >
                <CrypkoImage
                  detail={detail}
                  baseSize={baseSize}
                  isCached={isCached}
                />
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
        )}
      </Motion>
    );
  }
}

CrypkoNode.propTypes = {
  detail: types.crypkoBase,
  isCached: types.bool.isRequired,
  fetchCache: types.func.isRequired,
  id: types.number.isRequired,
  ax: types.number.isRequired,
  ay: types.number.isRequired,
  baseSize: types.number.isRequired,
  padding: types.number.isRequired,
  edgeX: types.number,
  edgeY: types.number,
};
CrypkoNode.defaultProps = {
  detail: null,
  edgeX: NaN,
  edgeY: NaN,
};

export default CrypkoNode;
