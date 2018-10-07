import * as types from './actionTypes';
import Immutable from 'seamless-immutable';


let initialState = Immutable({
    isLoading: false
});


export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.SET_LOADING:
            return state.merge({
                isLoading: true
            });
        case types.UNSET_LOADING:
            return state.merge({
                isLoading: false
            });
        default:
            return state;
    }
}

// selectors

export function isLoading(state) {
    return state.globalApp.isLoading;
}