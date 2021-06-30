import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import PoolArtifact from '../contracts/Pool.json';
import contractAddress from '../contracts/contract-address.json';
import { createSlice } from '@reduxjs/toolkit';

// // Define a thunk that dispatches those action creators
//  const fetchUsers = () => async (dispatch) => {
//     dispatch(usersLoading())
//     const response = await usersAPI.fetchAll()
//     dispatch(loggedIn(response.data))
//   };

  // This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
const HARDHAT_NETWORK_ID = '31337';

const initialState = {
    status: 'idle',
     users: [],
   };
  // First, define the reducer and action creators via `createSlice`
const dappSlice = createSlice({
    name: 'users',
    initialState, 
    reducers: {
      walletLoading(state, action) {
        // Use a "state machine" approach for loading state instead of booleans
        if (state.status === 'idle') {
          state.status = 'pending'
        }
      },
      walletReceived(state, action) {
        if (state.status === 'pending') {
          state.status = 'success'
        }
      },
      setUserAddress(state, action) {
          state.selectedAddress = action.payload;
      },
      setToken(state,action) {
          state.token = action.payload;
      },
      setProvider(state,action) {
        state.provider = action.payload;
      },
      setBalance(state,action) {
        state.balance = action.payload;
      },
      setTokenData(state,action) {
        state.tokenData = action.payload;
      },
      setError(state, action) {
        state.error = action.payload;
        state.status = 'error';
      },
      resetState(state) {
        state = initialState;
      }
    },
  })
  
  export const { actions: { 
      walletLoading, setToken, setProvider, setBalance, setTokenData, setError, resetState, setUserAddress, setEthers  
    } , reducer } = dappSlice;

 const _initialize = () => async (dispatch, getState) => {
     const selectedAddress = getState().dapp.selectedAddress;
    // This method initializes the dapp
    dispatch(_initializeEthers());
    const name = await getState().dapp.token.name();
    const symbol = await getState().dapp.token.symbol();

    console.log(name, symbol);
    dispatch(setTokenData({ tokenData: { name, symbol }}));

    const balance = await getState().dapp.token.balanceOf(selectedAddress);
    dispatch(setBalance(balance));
  };


 const _initializeEthers = () => async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setProvider(provider));

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const token = new ethers.Contract(
      contractAddress.Token,
      PoolArtifact.abi,
      provider.getSigner(0)
    );

    console.log(setToken);
    dispatch(setToken(token));
  };

 const _getTokenData = () => async (dispatch) => {
    const name = await this._token.name();
    const symbol = await this._token.symbol();

    dispatch(setTokenData({tokenData: { name, symbol }} ));
  };

 const _updateBalance = () => async (dispatch, getState) => {
    const selectedAddress = getState().selectedAddress;
    const balance = await this._token.balanceOf(selectedAddress);
    // DO THIS AIDA
    console.log({ balance });
  }

  const _checkNetwork = () => async (dispatch) => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    else {
        dispatch(setError({
            networkError: 'Please connect Metamask to Localhost:8545'
          }));
          return false;
    }
  };

  
 export const connectWallet = () => async (dispatch, getState) => {
    dispatch(walletLoading());

    // First we check the network
    const isConnected = dispatch(_checkNetwork());
    if (!isConnected) {
        return;
    }

    const [selectedAddress] = await window.ethereum.enable();

    dispatch(setUserAddress(selectedAddress));
    dispatch(_initialize());
  
    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // UNCOMMENT THIS @AIDA
      //   if (newAddress === undefined) {
    //     return this._resetState();
    //   }
        _initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
    //   this._stopPollingData();
      dispatch(resetState());
    });
  };
  

  
  // Destructure and export the plain action creators
//   export const { usersLoading, usersReceived } = usersSlice.actions
  
 
  