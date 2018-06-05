import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

export default function CrypkoNodes({ cache, target, addCache }) {
  const ids = [target];
  const detail = cache[target];

  if (detail && detail.matron && detail.sire) {
    ids.push(detail.matron.id);
    ids.push(detail.sire.id);
  }

  const nodes = ids
    .map((id, k) => ({
      id,
      key: id,
      cache,
      addCache,
      x: 0,
      y: k * 200,
    }))
    .map((props) => <CrypkoNode {...props} />);

  return <g>{nodes}</g>;
}
CrypkoNodes.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  addCache: types.func.isRequired,
};
