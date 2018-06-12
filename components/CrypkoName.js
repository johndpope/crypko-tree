import * as types from '../util/types';

export default function CrypkoName(props) {
  const { type, name, baseSize } = props;
  let pathName;
  let attr = {};

  switch (type) {
    case 'innerTop':
      attr = {
        textAnchor: 'middle',
        x: baseSize / 2 - 20,
        y: 0,
        fill: 'black',
        stroke: 'white',
        strokeWidth: 0.5,
      };
      pathName = '#curveInnerTop';
      break;
    default:
  }

  return (
    <text {...attr} style={{ cursor: 'text' }}>
      <textPath href={pathName}>{name}</textPath>
    </text>
  );
}

CrypkoName.propTypes = {
  type: types.string.isRequired,
  name: types.string.isRequired,
  baseSize: types.number.isRequired,
};
