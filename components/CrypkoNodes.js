import { pure } from 'recompose';
import { TransitionMotion, spring } from 'react-motion';

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
  const { ax, ay, align, baseSize, padding, edgeTo } = props;
  const { graph } = props;

  const ox = calcOriginX(props);
  const oy = 0;
  const originNode = {
    key: graph.id,
    x: ox,
    y: oy,
    ax: ax + ox,
    ay: ay + oy,
    id: graph.id,
    baseSize,
    padding,
    edgeTo,
  };
  const subNodes = makeSubNodeProps(graph, baseSize, padding, align)
    .map((p) =>
      makeNodes({
        ...p,
        ax: ax + p.x,
        ay: ay + p.y,
        baseSize,
        padding,
        edgeTo: { x: ax + ox, y: ay + oy },
      })
    )
    .reduce((prev, cur) => [...prev, ...cur], []);

  return [...subNodes, originNode];
}

function CrypkoNodes(props) {
  const nodes = makeNodes(props);

  if (props.useFade) {
    return (
      <TransitionMotion
        willLeave={() => ({ opacity: spring(0) })}
        styles={nodes.map((node) => ({
          key: node.key,
          style: { opacity: 1.0 },
          data: node,
        }))}
      >
        {(styles) => (
          <g>
            {styles.map((config) => (
              <CrypkoNode {...config.data} style={config.style} />
            ))}
          </g>
        )}
      </TransitionMotion>
    );
  }
  return nodes.map((node) => <CrypkoNode {...node} />);
}

CrypkoNodes.propTypes = {
  x: types.number.isRequired,
  y: types.number.isRequired,
  ax: types.number.isRequired,
  ay: types.number.isRequired,
  graph: types.graph.isRequired,
  align: types.string,
  baseSize: types.number,
  padding: types.number,
  edgeTo: types.point,
  useFade: types.bool,
};
CrypkoNodes.defaultProps = {
  align: 'center',
  padding: 10,
  baseSize: 192,
  edgeTo: null,
  useFade: false,
};

export default pure(CrypkoNodes);
