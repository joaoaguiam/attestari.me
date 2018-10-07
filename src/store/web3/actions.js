// import Web3 from 'web3';
import * as types from './actionTypes';
import * as web3Selectors from './reducer';

const fetchAccounts = dispatch => {
  window.web3.eth.getAccounts((err, accounts) => {
    if (err) {
      console.log(err);
      dispatch({ type: types.ACCOUNTS_LOADED, accounts: [] });
    } else {
      if (accounts) {
        let selectedAccount = accounts.length > 0 ? accounts[0] : undefined;

        dispatch({ type: types.ACCOUNTS_LOADED, accounts });
        dispatch({ type: types.ACCOUNT_CHANGED, selectedAccount });
        if (selectedAccount) {
          dispatch({ type: types.WEB3_UNLOCKED });
          window.web3.eth.getBalance(selectedAccount, (err, balanceBigNumber) => {
            const balance = Number(balanceBigNumber);
            dispatch({ type: types.BALANCE_UPDATED, balance });
          });

        }
        else {
          dispatch({ type: types.WEB3_LOCKED });
        }
      }
      else {
        dispatch({ type: types.ACCOUNTS_LOADED, accounts: [] });
        dispatch({ type: types.WEB3_LOCKED });
      }
    }
  });
}

const fetchNetwork = dispatch => {
  // window.web3.version.getNetwork((err, networkId) => {
  //   if (err) {
  //     console.log(err);
  //     dispatch({ type: types.NETWORK_CHANGED, networkId: -1 });
  //     debugger;
  //   } else {
  //     dispatch({ type: types.NETWORK_CHANGED, networkId });
  //   }
  // });
}

export function initWeb3() {
  return async (dispatch, getState) => {
    try {

      if (window.web3) {
        // window.web3 = new Web3(window.web3.currentProvider);
        if (!web3Selectors.isLibraryInitialized(getState())) {
          fetchAccounts(dispatch);
          fetchNetwork(dispatch);
          dispatch({ type: types.WEB3_INSTALLED });

          window.web3.currentProvider.publicConfigStore.on('update', () => {
            fetchAccounts(dispatch);
            fetchNetwork(dispatch);
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
}

export function resetLastTransaction() {
  return async (dispatch, getState) => {
    dispatch({ type: types.RESET_LAST_TX });
  };
}

export const updateTxStatus = (txHash, txStatus) => {
  return async (dispatch, getState) => {
    dispatch({ type: types.TX_STATUS_UPDATED, txHash, txStatus });
  };
}

