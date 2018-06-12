import { pure } from 'recompose';

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

function makeSubNodeProps(graph, baseSize, padding, align) {
  const dx =
    padding +
    (1 / 2) *
      Math.max(
        calcWidth(graph.sire, baseSize, padding),
        calcWidth(graph.matron, baseSize, padding)
      );
  const dy = baseSize + padding * 4;

  const subNodeProps = [];
  if (graph.sire) {
    subNodeProps.push({
      key: graph.sire.id,
      x: dx,
      y: -dy,
      align: align !== 'justify' ? align : 'left',
      graph: graph.sire,
    });
  }
  if (graph.matron) {
    subNodeProps.push({
      key: graph.matron.id,
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
      sum += w;
      pos.push(sum - w / 2);
      if (i < graph.derivatives.length - 1) {
        sum += padding;
      }
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

  return subNodeProps;
}

function makeNodes(props) {
  const { ax, ay, align, baseSize, padding, edgeX, edgeY } = props;
  const { graph } = props;

  const ox = calcOriginX(props);
  const oy = 0;
  const originNode = {
    x: ox,
    y: oy,
    ax: ax + ox,
    ay: ay + oy,
    id: graph.id,
    detail: graph.detail,
    isCached: graph.isCached,
    baseSize,
    padding,
    edgeX,
    edgeY,
  };
  const subNodes = makeSubNodeProps(graph, baseSize, padding, align)
    .map((p) =>
      makeNodes({
        ...p,
        ax: ax + p.x,
        ay: ay + p.y,
        baseSize,
        padding,
        edgeX: ax + ox,
        edgeY: ay + oy,
      })
    )
    .reduce((prev, cur) => [...prev, ...cur], []);

  return [...subNodes, originNode];
}

function addUniqueKey(nodes) {
  return nodes.map((node, i, a) => {
    const dupCount = a.slice(0, i).filter(({ id }) => id === node.id).length;
    const postfix = Array(dupCount + 1).join('_');
    return { ...node, key: `${node.id}${postfix}` };
  });
}

function CrypkoNodes(props) {
  console.warn('Nodes');
  const { fetchCache } = props;
  const nodes = makeNodes(props);
  const nodesWithKey = addUniqueKey(nodes);

  return nodesWithKey.map((node) => (
    <CrypkoNode {...node} fetchCache={fetchCache} />
  ));
}

CrypkoNodes.propTypes = {
  x: types.number,
  y: types.number,
  ax: types.number,
  ay: types.number,
  graph: types.graph.isRequired,
  align: types.string,
  baseSize: types.number,
  padding: types.number,
  edgeX: types.number,
  edgeY: types.number,
  useFade: types.bool,
};
CrypkoNodes.defaultProps = {
  x: 0,
  y: 0,
  ax: 0,
  ay: 0,
  align: 'center',
  padding: 10,
  baseSize: 192,
  edgeX: NaN,
  edgeY: NaN,
  useFade: false,
};

export default pure(CrypkoNodes);
