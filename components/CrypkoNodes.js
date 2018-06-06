import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

const padding = 10;
const baseSize = 192;

function calcWidth(graph) {
  const upper = [];
  if (graph.sire) upper.push(calcWidth(graph.sire));
  if (graph.matron) upper.push(calcWidth(graph.matron));

  const lower =
    graph.derivatives && graph.derivatives.length
      ? graph.derivatives.map((derivative) => calcWidth(derivative))
      : [];

  const sumWithPadding = (array) =>
    array.reduce((prev, cur) => prev + padding + cur, 0);

  const upperWidth = sumWithPadding(upper);
  const lowerWidth = sumWithPadding(lower);
  const selfWidth = baseSize;

  return Math.max(upperWidth, lowerWidth, selfWidth);
}

function calcOriginX({ align, x }) {
  switch (align) {
    case 'left':
      return -Math.abs(x) + baseSize / 2;
    case 'right':
      return Math.abs(x) - baseSize / 2;
    case 'couple':
      return x ? (Math.abs(x) / x) * (baseSize / 2 - Math.abs(x)) : 0;
    case 'justify':
      return 0;
    case 'center':
    default:
      return 0;
  }
}

export default function CrypkoNodes(props) {
  const { x, y, align } = props;
  const { graph } = props;

  const originX = calcOriginX(props);
  const originNode = <CrypkoNode x={originX} y={0} id={graph.id} />;
  const sireNode = graph.sire ? (
    <CrypkoNodes
      x={calcWidth(graph.sire) / 2}
      y={-220}
      align={align !== 'justify' ? align : 'left'}
      graph={graph.sire}
    />
  ) : null;
  const matronNode = graph.matron ? (
    <CrypkoNodes
      x={-calcWidth(graph.matron) / 2}
      y={-220}
      align={align !== 'justify' ? align : 'right'}
      graph={graph.matron}
    />
  ) : null;
  const derivativeNodes =
    graph.derivatives && graph.derivatives.length
      ? graph.derivatives.map((derivative, i, a) => (
          <CrypkoNodes
            key={derivative.id}
            x={(i - (a.length - 1) / 2) * 200}
            y={220}
            align={align}
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
      {props.debug ? <circle cx="0" cy="0" r="5" /> : null}
    </svg>
  );
}
CrypkoNodes.propTypes = {
  x: types.number.isRequired,
  y: types.number.isRequired,
  graph: types.graph.isRequired,
  align: types.string,
  debug: types.bool,
};
CrypkoNodes.defaultProps = {
  align: 'center',
  debug: false,
};
