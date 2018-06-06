import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

function calcWidth(graph, baseSize, padding) {
  if (!graph) return 0;
  const upper = [];
  if (graph.sire) upper.push(calcWidth(graph.sire, baseSize, padding));
  if (graph.matron) upper.push(calcWidth(graph.matron, baseSize, padding));

  const lower =
    graph.derivatives && graph.derivatives.length
      ? graph.derivatives.map((derivative) =>
          calcWidth(derivative, baseSize, padding)
        )
      : [];

  const sumWithPadding = (array) =>
    array.reduce((prev, cur) => prev + padding + cur, 0);

  const upperWidth = sumWithPadding(upper);
  const lowerWidth = sumWithPadding(lower);
  const selfWidth = baseSize;

  return Math.max(upperWidth, lowerWidth, selfWidth);
}

function calcOriginX({ align, baseSize, x }) {
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
  const { x, y, align, baseSize, padding } = props;
  const { graph } = props;
  const subNodeProps = [];
  const dx =
    padding +
    (1 / 2) *
      Math.max(
        calcWidth(graph.sire, baseSize, padding),
        calcWidth(graph.matron, baseSize, padding)
      );
  const dy = baseSize + padding * 4;

  if (graph.sire) {
    subNodeProps.push({
      key: 'sire',
      x: dx,
      y: -dy,
      align: align !== 'justify' ? align : 'left',
      graph: graph.sire,
    });
  }
  if (graph.matron) {
    subNodeProps.push({
      key: 'matron',
      x: -dx,
      y: -dy,
      align: align !== 'justify' ? align : 'right',
      graph: graph.matron,
    });
  }

  if (graph.derivatives) {
    const pos = [];
    let sum = 0;
    for (let i = 0; i < graph.derivatives.length; i += 1) {
      const d = graph.derivatives[i];
      const w = calcWidth(d, baseSize, padding);
      sum += w + padding;
      pos.push(sum - w / 2);
    }

    subNodeProps.push(
      ...graph.derivatives.map((derivative, i) => ({
        key: derivative.id,
        x: pos[i] - sum / 2,
        y: dy,
        align,
        graph: derivative,
      }))
    );
  }

  const ox = calcOriginX(props);
  const oy = 0;
  const subNodes = subNodeProps.map((p) => <CrypkoNodes {...p} />);
  const edges = subNodeProps.map((p) => {
    const d = `M ${ox},${oy} v ${(p.y - oy) / 2} h ${p.x - ox} v ${(p.y - oy) /
      2}`;
    return (
      <path
        d={d}
        stroke="gray"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0,10"
        fill="none"
      />
    );
  });

  return (
    <svg x={x} y={y} style={{ overflow: 'visible' }}>
      {edges}
      {subNodes}
      <CrypkoNode
        x={ox}
        y={oy}
        id={graph.id}
        baseSize={baseSize}
        padding={padding}
      />
      {props.debug ? <circle cx="0" cy="0" r="5" /> : null}
    </svg>
  );
}
CrypkoNodes.propTypes = {
  x: types.number.isRequired,
  y: types.number.isRequired,
  graph: types.graph.isRequired,
  align: types.string,
  baseSize: types.number,
  padding: types.number,
  debug: types.bool,
};
CrypkoNodes.defaultProps = {
  align: 'center',
  padding: 10,
  baseSize: 192,
  debug: false,
};
