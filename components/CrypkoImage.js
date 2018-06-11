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
  const { detail, img, baseSize } = props;

  getImageActualSize(img);

  const circle = (
    <circle
      cx={baseSize / 2}
      cy={baseSize / 2}
      r={baseSize / 2}
      fill="transparent"
      stroke="url(#linear)"
    />
  );

  return detail ? (
    <g filter="url(#f1)">
      <image
        x={0}
        y={0}
        width={baseSize}
        height={baseSize}
        xlinkHref={getImageUri(detail, img)}
        alt=""
        clipPath="url(#clip-circle)"
      />
      {circle}
    </g>
  ) : (
    circle
  );
}

CrypkoImage.propTypes = {
  img: types.string,
  detail: types.crypko,
  x: types.number,
  y: types.number,
  baseSize: types.number.isRequired,
};

CrypkoImage.defaultProps = {
  detail: null,
  img: 'sm',
  x: 0,
  y: 0,
};
