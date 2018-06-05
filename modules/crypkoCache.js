// action type
const FETCH = 'CACHE_FETCH';
const ADD = 'CACHE_ADD';

// action creator
export function fetch(crypkoId) {
  return { type: FETCH, payload: crypkoId };
}
export function add(crypkoId, crypkoDetail) {
  return {
    type: ADD,
    payload: {
      id: crypkoId,
      data: crypkoDetail,
    },
  };
}

const initialState = {};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH: // TODO
      return {
        ...state,
        [action.payload]: {},
      };
    case ADD:
      return {
        ...state,
        [action.payload.id]: action.payload.data,
      };
    default:
      break;
  }

  return state;
}
