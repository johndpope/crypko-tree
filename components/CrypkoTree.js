import * as types from '../util/types';
import CrypkoNodes from './CrypkoNodes';

// TODO: add rules to filter
function makeGraph({ id, cache, min, max }, depth = 0, from = 0) {
  const detail = cache[id];

  const originRange = () => depth >= 0 && depth < max;
  const derivativeRange = () => depth <= 0 && depth > min;

  if (!detail) {
    return {
      id,
      depth,
    };
  }
  return {
    id,
    depth,
    detail,
    matron:
      originRange() && detail.matron && detail.matron.id !== from
        ? makeGraph({ id: detail.matron.id, cache, min, max }, depth + 1, id)
        : null,
    sire:
      originRange() && detail.sire && detail.sire.id !== from
        ? makeGraph({ id: detail.sire.id, cache, min, max }, depth + 1, id)
        : null,
    derivatives: derivativeRange()
      ? detail.derivatives
          .filter((derivative) => derivative.id !== from)
          .map((derivative) =>
            makeGraph({ id: derivative.id, cache, min, max }, depth - 1, id)
          )
      : [],
  };
}

export default function CrypkoTree(props) {
  const { width, height } = props;
  const graph = makeGraph({
    id: props.id,
    cache: props.cache,
    min: props.min,
    max: props.max,
  });

  return (
    <svg
      style={{
        overflow: 'visible',
      }}
      width={width}
      height={height}
      viewBox={`${-width / 3} ${-height / 1.2} ${width} ${height}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip-circle">
          <circle cx="96" cy="96" r="96" />
        </clipPath>
        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="8" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      <CrypkoNodes x={0} y={0} align="center" graph={graph} />
    </svg>
  );
}

CrypkoTree.propTypes = {
  width: types.number,
  height: types.number,
  id: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  min: types.number,
  max: types.number,
};
CrypkoTree.defaultProps = {
  width: 800,
  height: 800,
  min: -1,
  max: 1,
};
