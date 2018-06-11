import { PureComponent } from 'react';
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

export default class CrypkoTree extends PureComponent {
  constructor(props) {
    super(props);
    this.selectedElement = null;
    this.svgElement = null;
    this.startPos = null;
    this.startView = null;
    this.state = {
      viewX: 0,
      viewY: 0,
      viewScale: 0.5,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      graph: makeGraph({
        id: props.id,
        cache: props.cache,
        min: props.min,
        max: props.max,
      }),
    };
  }

  getMousePosition = (e) => {
    const CTM = this.svgElement.getScreenCTM();

    return {
      x: e.clientX / CTM.a,
      y: e.clientY / CTM.d,
    };
  };

  startDrag = (e) => {
    if (e.target.classList.contains('movable')) {
      this.selectedElement = e.target;
      this.startPos = this.getMousePosition(e);
      this.startView = {
        x: this.state.viewX,
        y: this.state.viewY,
      };
    }
  };

  drag = (e) => {
    if (this.selectedElement) {
      e.preventDefault();
      const pos = this.getMousePosition(e);

      this.setState({
        viewX: this.startView.x - pos.x + this.startPos.x,
        viewY: this.startView.y - pos.y + this.startPos.y,
      });
    }
  };

  endDrag = () => {
    this.selectedElement = null;
    this.startPos = null;
    this.startView = null;
  };

  zoomIntensity = 1.1;
  zoomIn = (x, y) => {
    this.setState((oldState) => {
      const oldScale = oldState.viewScale;
      const newScale = oldScale * this.zoomIntensity;
      const scaleDiff = newScale - oldScale;
      return {
        viewScale: newScale,
        viewX: oldState.viewX + (x * scaleDiff) / (newScale * oldScale),
        viewY: oldState.viewY + (y * scaleDiff) / (newScale * oldScale),
      };
    });
  };
  zoomOut = (x, y) => {
    this.setState((oldState) => {
      const oldScale = oldState.viewScale;
      const newScale = oldScale / this.zoomIntensity;
      const scaleDiff = newScale - oldScale;

      return {
        viewScale: newScale,
        viewX: oldState.viewX + (x * scaleDiff) / (newScale * oldScale),
        viewY: oldState.viewY + (y * scaleDiff) / (newScale * oldScale),
      };
    });
  };
  wheel = (e) => {
    e.preventDefault();
    const rect = this.svgElement.getBoundingClientRect();
    const center = {
      x: (rect.right - rect.left) / 2,
      y: (rect.bottom - rect.top) / 2,
    };
    const cursor = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (e.deltaY > 0) {
      this.zoomOut(cursor.x - center.x, cursor.y - center.y);
    } else if (e.deltaY < 0) {
      this.zoomIn(cursor.x - center.x, cursor.y - center.y);
    }
  };

  render() {
    const { width, height } = this.props;

    const { graph, viewScale, viewX, viewY } = this.state;
    const vw = width / viewScale;
    const vh = height / viewScale;
    const vx = viewX - vw / 2;
    const vy = viewY - vh / 2;
    return (
      <svg
        ref={(svg) => {
          this.svgElement = svg;
        }}
        style={{
          display: 'inline',
          cursor: 'move',
        }}
        width={width}
        height={height}
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={this.startDrag}
        onMouseMove={this.drag}
        onMouseUp={this.endDrag}
        onMouseLeave={this.endDrag}
        onWheel={this.wheel}
        className="movable"
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
          <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#666" />
          </linearGradient>
        </defs>
        <CrypkoNodes x={0} y={0} ax={0} ay={0} align="center" graph={graph} />
      </svg>
    );
  }
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
  height: 800,
  min: -1,
  max: 1,
};
