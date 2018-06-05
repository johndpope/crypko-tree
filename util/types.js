import PropTypes from 'prop-types';

export const parent = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
});

export const crypko = PropTypes.shape({
  id: PropTypes.number.isRequired,
  attrs: PropTypes.string.isRequired,
  noise: PropTypes.string.isRequired,
  name: PropTypes.string,
  matron: parent,
  sire: parent,
});

export const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);
export const crypkoCache = PropTypes.objectOf(crypko);
export const classes = PropTypes.objectOf(PropTypes.string);

export const { string, number, func } = PropTypes;
