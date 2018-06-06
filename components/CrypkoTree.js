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
        display: 'inline',
        width: '100%',
        height: '100%',
      }}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip-circle">
          <circle cx="96" cy="96" r="96" />
        </clipPath>
        <filter id="f1" x="-25%" y="-25%" width="150%" height="150%">
          <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="8" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>
      <CrypkoNodes x={width / 2} y={height / 2} align="center" graph={graph} />
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
  width: 1200,
  height: 1000,
  min: -1,
  max: 1,
};
