import Link from 'next/link';
import CrypkoImage from './CrypkoImage';
import * as types from '../util/types';

export default function Crypko(props) {
  const { crypko } = props;
  const { id, name, matron, sire } = crypko;
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
      <Link
        href={{ pathname: '/crypko', query: { id: sire.id } }}
        as={`/c/${sire.id}`}
        prefetch
      >
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
      <CrypkoImage crypko={crypko} />
    </div>
  );
}

Crypko.propTypes = {
  crypko: types.crypko.isRequired,
};
