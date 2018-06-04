import { PureComponent } from 'react';
import fetch from 'isomorphic-unfetch';
import sha1 from 'sha1';
import PropTypes from 'prop-types';
import Link from 'next/link';

const URI_CRIPKO_API = 'https://api.crypko.ai';
const URI_CRIPKO_STATIC = 'https://img.crypko.ai/daisy/';
const URI_CRIPKO_GOOGLE = 'https://storage.googleapis.com/img.crypko.ai/daisy/';
const HASH_SECRET = 'asdasd3edwasd';

const detailMemo = {};
async function fetchDetail(crypkoId) {
  if (!detailMemo[crypkoId]) {
    const res = await fetch(`${URI_CRIPKO_API}/crypkos/${crypkoId}/detail`);
    const json = await res.json();
    detailMemo[crypkoId] = json;
  }
  return detailMemo[crypkoId];
}

function getImageUri(crypko, size) {
  let base;
  switch (size) {
    case 'sm':
    case 'lg':
      base = URI_CRIPKO_STATIC;
      break;
    case 'xsm':
      base = URI_CRIPKO_GOOGLE;
      break;
    default:
      throw new Error(`getImageUri: unknown size "${size}"`);
  }

  const hash = sha1(`${crypko.noise}${HASH_SECRET}${crypko.attrs}`);
  return `${base}${hash}_${size}.jpg`;
}

class Crypko extends PureComponent {
  static async getInitialProps({ query }) {
    const { id } = query;
    const crypkoProps = await fetchDetail(id);
    return crypkoProps;
  }

  render() {
    const { id, name, matron, sire } = this.props;
    let matronLink;
    let sireLink;

    if (matron && sire) {
      matronLink = (
        <Link
          href={{ pathname: '/crypko', query: { id: matron.id } }}
          as={`/c/${matron.id}`}
          prefetch
        >
          <a href=".">{matron.name || `(${matron.id})`}</a>
        </Link>
      );
      sireLink = (
        <Link href={{ pathname: '/crypko', query: { id: sire.id } }} as={`/c/${sire.id}`} prefetch>
          <a href=".">{sire.name || `(${sire.id})`}</a>
        </Link>
      );
    } else {
      matronLink = '(no matron)';
      sireLink = '(no sire)';
    }

    return (
      <div>
        <p>Crypko: {name || `(${id})`}</p>
        <p>Matron: {matronLink}</p>
        <p>Sire: {sireLink}</p>
        <img src={getImageUri(this.props, 'lg')} alt="" />
      </div>
    );
  }
}

Crypko.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  matron: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
  sire: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  }),
};
Crypko.defaultProps = {
  name: '',
  matron: null,
  sire: null,
};

export default Crypko;
