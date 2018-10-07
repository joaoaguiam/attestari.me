import * as types from './actionTypes';

export function setLoading() {
  return async (dispatch, getState) => {
    dispatch({ type: types.SET_LOADING });
  };
}
export function unsetLoading() {
  return async (dispatch, getState) => {
    dispatch({ type: types.UNSET_LOADING });
  };
}