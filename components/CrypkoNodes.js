import CrypkoNode from './CrypkoNode';
import * as types from '../util/types';

export default function CrypkoNodes({ cache, target, addCache }) {
  const id = target;
  const detail = cache[target];
  const targetNode = (
    <CrypkoNode key={id} id={id} cache={cache} addCache={addCache} />
  );
  const nodes = [targetNode];

  if (detail && detail.matron && detail.sire) {
    const matronNode = (
      <CrypkoNode
        key={detail.matron.id}
        id={detail.matron.id}
        cache={cache}
        addCache={addCache}
      />
    );
    const sireNode = (
      <CrypkoNode
        key={detail.sire.id}
        id={detail.sire.id}
        cache={cache}
        addCache={addCache}
      />
    );

    nodes.push(matronNode);
    nodes.push(sireNode);
  }

  return <g>{nodes}</g>;
}
CrypkoNodes.propTypes = {
  target: types.number.isRequired,
  cache: types.crypkoCache.isRequired,
  addCache: types.func.isRequired,
};
