import Link from 'next/link';
import CrypkoImage from './CrypkoImage';
import * as types from '../util/types';

export default function CrypkoNode(props) {
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
        <tspan>{matron.name || `(${matron.id})`}</tspan>
      </Link>
    );
    sireLink = (
      <Link
        href={{ pathname: '/crypko', query: { id: sire.id } }}
        as={`/c/${sire.id}`}
        prefetch
      >
        <tspan>{sire.name || `(${sire.id})`}</tspan>
      </Link>
    );
  } else {
    matronLink = '(no matron)';
    sireLink = '(no sire)';
  }

  return (
    <g>
      <CrypkoImage crypko={crypko} />
      <rect
        style={{ stroke: '#30abef', fill: 'transparent' }}
        x="0"
        y="0"
        width="192"
        height="192"
      />
      <text x="200" y="40">
        Crypko: {name || `(${id})`}
      </text>
      <text x="200" y="60">
        Matron: {matronLink}
      </text>
      <text x="200" y="80">
        Sire: {sireLink}
      </text>
    </g>
  );
}

CrypkoNode.propTypes = {
  crypko: types.crypko.isRequired,
};
