import { Component } from 'react';
// import Link from 'next/link';
import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

/*

CrypkoTree: contains cache
  CrypkoEdges
  CrypkoNodes
    CrypkoNode
      CrypkoImage
      CrypkoLabels

*/

function CrypkoEdges() {
  return null;
}
function CrypkoNodes(props) {
  const crypko = props.cache[props.target];
  return <CrypkoNode crypko={crypko} />;
}
CrypkoNodes.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};

export default class CrypkoTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target: props.target,
    };
  }

  moveTo(id) {
    this.setState({
      target: id,
    });
  }

  render() {
    const { cache } = this.props;
    const { target } = this.state;

    return (
      <svg
        width="800"
        height="800"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <CrypkoEdges />
        <CrypkoNodes target={target} cache={cache} />
      </svg>
    );
  }
}
CrypkoTree.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};
