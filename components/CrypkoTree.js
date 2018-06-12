import { PureComponent } from 'react';
import * as types from '../util/types';

class CrypkoTree extends PureComponent {
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
    console.warn('Tree');
    const { children, width, height } = this.props;
    const { viewScale, viewX, viewY } = this.state;

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
          <linearGradient id="linearGray" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#666" />
          </linearGradient>
          <linearGradient id="linearBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#669" />
          </linearGradient>
        </defs>
        {children}
      </svg>
    );
  }
}

CrypkoTree.propTypes = {
  children: types.children.isRequired,
  width: types.number,
  height: types.number,
};
CrypkoTree.defaultProps = {
  width: 1200,
  height: 800,
};

export default CrypkoTree;
