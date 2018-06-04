import { PureComponent } from 'react';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';
import Link from 'next/link';

const URI_CRIPKO_API = 'https://api.crypko.ai';
async function fetchDetail(crypkoId) {
  return fetch(`${URI_CRIPKO_API}/crypkos/${crypkoId}/detail`);
}

class Crypko extends PureComponent {
  static async getInitialProps({ query }) {
    const { id } = query;
    const res = await fetchDetail(id);
    const crypkoProps = await res.json();
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
          {matron.name || `(${matron.id})`}
        </Link>
      );
      sireLink = (
        <Link
          href={{ pathname: '/crypko', query: { id: sire.id } }}
          as={`/c/${sire.id}`}
          prefetch
        >
          {sire.name || `(${sire.id})`}
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
