import PropTypes from 'prop-types';
import sha1 from 'sha1';
import { URI_CRYPKO_STATIC, URI_CRYPKO_GOOGLE, HASH_SECRET } from './common';

function getImageUri(crypko, size) {
  let base;
  switch (size) {
    case 'sm':
    case 'lg':
      base = URI_CRYPKO_STATIC;
      break;
    case 'xsm':
      base = URI_CRYPKO_GOOGLE;
      break;
    default:
      throw new Error(`getImageUri: unknown size "${size}"`);
  }

  const hash = sha1(`${crypko.noise}${HASH_SECRET}${crypko.attrs}`);
  return `${base}${hash}_${size}.jpg`;
}

export default function CrypkoImage(props) {
  const { crypko, size } = props;

  return <img src={getImageUri(crypko, size)} alt="" />;
}

CrypkoImage.propTypes = {
  size: PropTypes.string,
  crypko: PropTypes.shape({
    id: PropTypes.number.isRequired,
    attrs: PropTypes.string.isRequired,
    noise: PropTypes.string.isRequired,
  }).isRequired,
};

CrypkoImage.defaultProps = {
  size: 'sm',
};
