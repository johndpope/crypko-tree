import * as types from '../util/types';
import CrypkoNodes from './CrypkoNodes';

// TODO: add rules to filter
function makeGraph(id, cache, depth = 0, from = 0) {
  const detail = cache[id];

  const originRange = () => depth >= 0 && depth <= 2;
  const derivativeRange = () => depth === 0;

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
        ? makeGraph(detail.matron.id, cache, depth + 1, id)
        : null,
    sire:
      originRange() && detail.sire && detail.sire.id !== from
        ? makeGraph(detail.sire.id, cache, depth + 1, id)
        : null,
    derivatives: derivativeRange()
      ? detail.derivatives
          .filter((derivative) => derivative.id !== from)
          .map((derivative) => makeGraph(derivative.id, cache, depth - 1, id))
      : [],
  };
}

export default function CrypkoTree(props) {
  const { width, height, target, cache } = props;
  const graph = makeGraph(target, cache);
  console.log(graph);
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
      <CrypkoNodes x={0} y={0} align="center" graph={graph} />
    </svg>
  );
}

CrypkoTree.propTypes = {
  width: types.number,
  height: types.number,
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};
CrypkoTree.defaultProps = {
  width: 800,
  height: 800,
};
