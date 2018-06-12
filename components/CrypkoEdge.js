import { pure } from 'recompose';
import * as types from '../util/types';

function CrypkoEdge(props) {
  const { fromX, fromY, toX, toY } = props;

  const edgePath = [
    `M ${fromX},${fromY}`,
    `v ${(toY - fromY) / 2}`,
    `h ${toX - fromX}`,
    `v ${(toY - fromY) / 2}`,
  ];
  return (
    <path
      d={edgePath.join(' ')}
      stroke="gray"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="0,10"
      fill="none"
    />
  );
}

CrypkoEdge.propTypes = {
  fromX: types.number.isRequired,
  fromY: types.number.isRequired,
  toX: types.number.isRequired,
  toY: types.number.isRequired,
};

export default pure(CrypkoEdge);
