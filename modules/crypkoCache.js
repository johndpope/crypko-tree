// action type
const FETCH = 'CACHE_FETCH';
const ADD = 'CACHE_ADD';

// action creator
export function fetch(crypkoId) {
  return {
    type: FETCH,
    payload: {
      id: crypkoId,
      data: null,
    },
  };
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

const initialState = {
  details: {},
  fetching: {},
};
export default function reducer(state = initialState, action) {
  const { details, fetching } = state;
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        fetching: { ...fetching, [action.payload.id]: true },
        details: { ...details, [action.payload.id]: action.payload.data },
      };
    case ADD:
      return {
        ...state,
        fetching: { ...fetching, [action.payload.id]: false },
        details: { ...details, [action.payload.id]: action.payload.data },
      };
    default:
      break;
  }

  return state;
}
