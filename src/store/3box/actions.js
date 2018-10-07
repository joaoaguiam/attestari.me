import * as types from './actionTypes';
import ThreeBox from '3box';
import * as web3Selectors from '../web3/reducer';
import * as profile3BoxSelectors from '../3box/reducer';
import * as globalAppActions from '../global-app/actions';

let box = undefined;

export function load3box(address) {
  return async (dispatch, getState) => {
    try {
      dispatch(globalAppActions.setLoading());
      box = await ThreeBox.openBox(address, web3Selectors.getWeb3Provider());
      let name = await box.public.get('name');
      let email = await box.private.get('email');
      let avatar = await box.public.get('avatar');
      let skills = await box.public.get('skills');
      let attestations = await box.public.get('attestations');
      let pendingAttestations = await box.private.get('pendingAttestations');


      name = name ? name : '';
      email = email ? email : '';
      avatar = avatar ? avatar : '';
      skills = skills ? skills : [];
      attestations = attestations ? attestations : {};
      pendingAttestations = pendingAttestations ? pendingAttestations : {};

      dispatch({ type: types.LOADED_3BOX, name, email, avatar, skills, address, attestations, pendingAttestations });
      dispatch(load3BoxSkills());
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}

export function update3BoxProfile(name, email, avatar) {
  return async (dispatch, getState) => {
    try {
      // debugger;
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      const address = profile3BoxSelectors.get3BoxProfile(getState()).address;
      await box.public.set('name', name);
      await box.public.set('avatar', avatar);
      await box.private.set('email', email);
      dispatch({ type: types.LOADED_3BOX, name, email, avatar, address });

      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}

export function update3BoxSkills(skills) {
  return async (dispatch, getState) => {
    try {

      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      await box.public.set('skills', skills);
      dispatch({ type: types.SKILLS_UPDATED, skills });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}


export function load3BoxSkills() {
  return async (dispatch, getState) => {
    try {
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      let skills = await box.public.get('skills');
      if (!skills) {
        skills = [];
      }
      dispatch({ type: types.SKILLS_UPDATED, skills });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}

export function load3BoxAttestations() {
  return async (dispatch, getState) => {
    try {
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      let attestations = await box.public.get('attestations');
      if (!attestations) {
        attestations = {};
      }
      dispatch({ type: types.ATTESTATIONS_UPDATED, attestations });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}
export function update3BoxAttestations(attestations) {
  return async (dispatch, getState) => {
    try {
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      await box.public.set('attestations', attestations);
      dispatch({ type: types.ATTESTATIONS_UPDATED, attestations });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}


export function load3BoxPendingAttestations() {
  return async (dispatch, getState) => {
    try {
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      let pendingAttestations = await box.private.get('pendingAttestations');
      if (!pendingAttestations) {
        pendingAttestations = {};
      }
      dispatch({ type: types.PENDING_ATTESTATIONS_UPDATED, pendingAttestations });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}
export function update3BoxPendingAttestations(pendingAttestations) {
  return async (dispatch, getState) => {
    try {
      if (box === undefined) {
        throw new Error("No 3Box available");
      }
      dispatch(globalAppActions.setLoading());
      await box.private.set('pendingAttestations', pendingAttestations);
      dispatch({ type: types.PENDING_ATTESTATIONS_UPDATED, pendingAttestations });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      throw error;
    }
  };
}

export function load3BoxPublicProfile(userAddress) {
  return async (dispatch, getState) => {
    try {
      dispatch(globalAppActions.setLoading());
      const publicProfile = await ThreeBox.getProfile(userAddress);
      dispatch({ type: types.PUBLIC_PROFILE_LOADED, publicProfile });
      dispatch(globalAppActions.unsetLoading());
    } catch (error) {
      dispatch(globalAppActions.unsetLoading());

      // throw error;
    }
  };
}