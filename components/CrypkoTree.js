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

export default function CrypkoTree(props) {
  const { cache, target } = props;

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

CrypkoTree.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
};
