import PropTypes from 'prop-types';

export const crypkoBase = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
});

export const crypko = PropTypes.shape({
  id: PropTypes.number.isRequired,
  attrs: PropTypes.string.isRequired,
  noise: PropTypes.string.isRequired,
  name: PropTypes.string,
  matron: crypkoBase,
  sire: crypkoBase,
});

export const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);
export const crypkoCache = PropTypes.objectOf(crypko);
export const crypkoFetching = PropTypes.objectOf(PropTypes.bool);
export const graph = PropTypes.shape({
  id: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
});
export const point = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
});
export const classes = PropTypes.objectOf(PropTypes.string);
export const style = PropTypes.shape();

export const { string, number, func, bool } = PropTypes;
