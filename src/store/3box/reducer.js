import * as types from './actionTypes';
import Immutable from 'seamless-immutable';



let initialState = Immutable({
  isLoaded: false,
  address: '',
  name: '',
  email: '',
  avatar: '',
  // isLoaded: true,
  // address: "0xa265c90b5a2757ae15a07008f69b168a70691c42",
  // name: "Joao Aguiam",
  // email: "joaoaguiam@gmail.com",
  // avatar: "https://ipfs.infura.io/ipfs/QmXW5YqFB3juXno5iMVFcQtc4F3pGAGbT6BhMNmzAbfsy7",
  skills: [],
  attestations: {},
  pendingAttestations: {},
  publicProfile: {
    name: '',
    attestations: {},
    skills: {}
  }
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOADED_3BOX:


      return state.merge({
        name: action.name,
        email: action.email,
        avatar: action.avatar,
        address: action.address,
        skills: action.skills ? action.skills : state.skills,
        attestations: action.attestations ? action.attestations : state.attestations,
        pendingAttestations: action.pendingAttestations ? action.pendingAttestations : state.pendingAttestations,
        isLoaded: true
      });

    case types.SKILLS_UPDATED:
      return state.merge({
        skills: action.skills,
      });
    case types.ATTESTATIONS_UPDATED:
      return state.merge({
        attestations: action.attestations,
      });
    case types.PUBLIC_PROFILE_LOADED:
      return state.merge({
        publicProfile: action.publicProfile,
      });

    default:
      return state;
  }
}

export function is3BoxLoaded(state) {
  return state.profile3Box.isLoaded;
}

export function get3BoxProfile(state) {
  const { name, email, avatar, skills, address, attestations, pendingAttestations } = state.profile3Box;
  return {
    name,
    email,
    avatar,
    skills,
    address,
    attestations,
    pendingAttestations
  }
};
export function get3BoxPublicProfile(state) {
  return state.profile3Box.publicProfile;
}
