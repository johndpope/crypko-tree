import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

export default function CrypkoNodes(props) {
  const { x, y } = props;
  const { graph } = props;
  const originNode = <CrypkoNode x={0} y={0} id={graph.id} />;
  const sireNode = graph.sire ? (
    <CrypkoNodes x={200} y={-200} graph={graph.sire} />
  ) : null;
  const matronNode = graph.matron ? (
    <CrypkoNodes x={-200} y={-200} graph={graph.matron} />
  ) : null;
  const derivativeNodes =
    graph.derivatives && graph.derivatives.length
      ? graph.derivatives.map((derivative, i, a) => (
          <CrypkoNodes
            key={derivative.id}
            x={(i - (a.length - 1) / 2) * 200}
            y={200}
            graph={derivative}
          />
        ))
      : null;
  return (
    <svg x={x} y={y} style={{ overflow: 'visible' }}>
      {sireNode}
      {matronNode}
      {derivativeNodes}
      {originNode}
    </svg>
  );
}
CrypkoNodes.propTypes = {
  x: types.number.isRequired,
  y: types.number.isRequired,
  graph: types.graph.isRequired,
};
