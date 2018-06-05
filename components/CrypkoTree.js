import * as types from '../util/types';

export default function CrypkoTree({ width, height, children }) {
  return (
    <svg
      width={width}
      height={height}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

CrypkoTree.propTypes = {
  width: types.number,
  height: types.number,
  children: types.children.isRequired,
};
CrypkoTree.defaultProps = {
  width: 800,
  height: 800,
};
