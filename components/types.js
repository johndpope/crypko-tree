import PropTypes from 'prop-types';

export const parent = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
});

export const crypko = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  attrs: PropTypes.string.isRequired,
  noise: PropTypes.string.isRequired,
  matron: parent,
  sire: parent,
});

export const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const { string, number } = PropTypes;
