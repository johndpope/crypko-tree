import sha1 from 'sha1';
import * as types from '../util/types';
import { URI_IMG, URI_IMG2, HASH_SECRET } from '../util/common';

function getImageUri(crypko, size) {
  let base;
  switch (size) {
    case 'sm':
    case 'lg':
      base = URI_IMG;
      break;
    case 'xsm':
      base = URI_IMG2;
      break;
    default:
      throw new Error(`getImageUri: unknown size "${size}"`);
  }

  const hash = sha1(`${crypko.noise}${HASH_SECRET}${crypko.attrs}`);
  return `${base}${hash}_${size}.jpg`;
}

function getImageActualSize(size) {
  switch (size) {
    case 'xsm':
      return { width: 16, height: 16 };
    case 'sm':
      return { width: 192, height: 192 };
    case 'lg':
      return { width: 512, height: 512 };
    default:
      throw new Error(`getImageSize: unknown size "${size}"`);
  }
}

export default function CrypkoImage(props) {
  const { crypko, size, x, y } = props;
  let { width, height } = props;
  if (typeof width === 'undefined' || typeof height === 'undefined') {
    ({ width, height } = getImageActualSize(size));
  }

  return (
    <image
      x={x}
      y={y}
      width={width}
      height={height}
      xlinkHref={getImageUri(crypko, size)}
      alt=""
    />
  );
}

CrypkoImage.propTypes = {
  size: types.string,
  crypko: types.crypko.isRequired,
  x: types.number,
  y: types.number,
  width: types.number,
  height: types.number,
};

CrypkoImage.defaultProps = {
  size: 'sm',
  x: 0,
  y: 0,
  width: undefined,
  height: undefined,
};
