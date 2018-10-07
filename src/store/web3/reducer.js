// import _ from 'lodash';
import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import utils from 'ethereumjs-util';
import Web3 from 'web3';

const initialState = Immutable({
    accounts: [],
    selectedAccount: undefined,
    networkId: -1,
    balance: undefined,
    web3kLocked: true,
    web3Installed: false,
    lastTransation: undefined,
    web3Provider: undefined
});

export const TX_STATUS = {
    DRAFT: 0,
    SUBMITTED: 1,
    WAITING_MINING: 2,
    MINED: 3,
    FAILED: 4
}

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case types.ACCOUNTS_LOADED:
            return state.merge({
                accounts: action.accounts
            });
        case types.ACCOUNT_CHANGED:
            return state.merge({
                selectedAccount: action.selectedAccount,
                isLocked: action.selectedAccount !== undefined
            });
        case types.NETWORK_CHANGED:
            return state.merge({
                networkId: action.networkId
            });
        case types.BALANCE_UPDATED:
            return state.merge({
                balance: action.balance
            });
        case types.WEB3_LOCKED:
            return state.merge({
                web3kLocked: true,
            });
        case types.WEB3_UNLOCKED:
            return state.merge({
                web3kLocked: false,
            });
        case types.WEB3_INSTALLED:
            return state.merge({
                web3Installed: true,
            });
        case types.TX_STATUS_UPDATED:
            return state.merge({
                lastTransation: {
                    txHash: action.txHash,
                    txStatus: action.txStatus
                }
            })
        case types.RESET_LAST_TX:
            return state.merge({
                lastTransation: undefined
            })
        default:
            return state;
    }
}
export function getWeb3(state) {
    return state.web3.web3;
}
export function isLibraryInitialized(state) {
    return state.web3.libraryInitialized;
}
export function getSelectedAccount(state) {
    return state.web3.selectedAccount;
}
export function getBalance(state) {
    return state.web3.balance;
}
export function isWeb3Locked(state) {
    return state.web3.web3kLocked;
}
export function isWeb3Installed(state) {
    return state.web3.web3Installed;
}
export function getNetworkId(state) {
    return state.web3.networkId;
}
export function getLastTransaction(state) {
    return state.web3.lastTransation;
}
export function getWeb3Provider() {
    return window.web3.currentProvider
}

export function toEther(weiAmount) {
    if (window.web3) {
        return window.web3.fromWei(weiAmount, 'ether');
    }
    return -1;
}

export function toWei(etherAmount) {
    if (window.web3) {
        return window.web3.toWei(etherAmount, 'ether');
    }
    return -1;
}

export function getNetworkLabel(networkId) {
    switch (Number(networkId)) {
        case 1:
            return 'MAINNET';
        case 2:
            return 'MORDEN';
        case 3:
            return 'ROPSTEN';
        case 4:
            return 'RINKEBY';
        case 42:
            return 'KOVAN';
        default:
            return 'UNKNOWN';
    }
}

export function getEtherScanLinkAddress(networkId, address) {
    switch (Number(networkId)) {
        case 1:
            return `https://etherscan.io/address/${address}`;
        case 2:
            return '#';
        case 3:
            return `https://ropsten.etherscan.io/address/${address}`;
        case 4:
            return `https://rinkeby.etherscan.io/address/${address}`;
        case 42:
            return `https://kovan.etherscan.io/address/${address}`;
        default:
            return '#';
    }
}

export const verifySigner = async (message, signature, signer) => {
    try {
        let web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
        const signingAddress = await web3.eth.accounts.recover(message, signature);
        return signingAddress.toUpperCase() === signer.toUpperCase();
    }
    catch (error) {
        return false;
    }
    // window.web3.personal.ecRecover(message, signature, function (error, result) {
    //     if (!error)
    //         console.log(result)
    //     else
    //         console.error(error);
    // })

    // return;
    // // window.web3.personal.ecRecover(message, signature, function (error, result) {
    // //     console.log(result);
    // //     debugger;
    // // });
    // var msg = '0x' + Buffer.from(message, 'utf8').toString('hex')

    // // let r = utils.toBuffer(signature.slice(0, 64))
    // // let s = utils.toBuffer('0x' + signature.slice(64, 128))
    // // let v = utils.toBuffer('0x' + signature.slice(128, 130)+27)
    // // // let m = utils.toBuffer(message)
    // // let pub = utils.ecrecover(msg, v, r, s)
    // // let adr = '0x' + utils.pubToAddress(pub).toString('hex')


    // var messageBuffer = new Buffer(msg, 'hex');
    // // console.log('message: ', message);
    // signature = signature.split('x')[1];

    // var r = new Buffer(signature.substring(0, 64), 'hex')
    // var s = new Buffer(signature.substring(64, 128), 'hex')
    // var v = new Buffer((parseInt(signature.substring(128, 130)) + 27).toString());

    // // r = utils.toBuffer(sgn.slice(0,66))
    // // s = utils.toBuffer('0x' + sgn.slice(66,130))
    // // v = utils.toBuffer('0x' + sgn.slice(130,132))
    // // m = utils.toBuffer(msg)
    // // pub = utils.ecrecover(m, v, r, s)
    // // adr = '0x' + utils.pubToAddress(pub).toString('hex')

    // // console.log('r s v: ', r, s , v)

    // // console.log('v: ', v)

    // var pub = utils.ecrecover(messageBuffer, v, r, s);

    // var adr = '0x' + utils.pubToAddress(pub).toString('hex')

    // console.log('recoveredAddress: ', signingAddress);
    // console.log('signer: ', signer);
    // // return (signingAddress === signer);
}

