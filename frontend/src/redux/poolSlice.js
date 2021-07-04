
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import PoolFactoryArtifact from '../contracts/PoolFactory.json';
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
      setPoolMap(state, action) {
        state.poolMap = action.payload;
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
      walletLoading, setToken, setProvider, setBalance, setTokenData, setError, resetState, setUserAddress, setPoolMap, setEthers  
    } , reducer } = dappSlice;

 const _initialize = () => async (dispatch, getState) => {
    dispatch(_initializeEthers());
    dispatch(createDefaultPools());
    dispatch(getPoolsList());
  };


 const _initializeEthers = () => async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setProvider(provider));

    const token = new ethers.Contract(
      contractAddress.PoolFactory,
      PoolFactoryArtifact.abi,
      provider.getSigner(0)
    );

    dispatch(setToken(token));
  };

  export const createDefaultPools = () => async (dispatch, getState) => {
    // await getState().pool.token.createPool("Ethiopian Farmers", ['0x70997970C51812dc3A010C7d01b50e0d17dc79C8']);
    // await getState().pool.token.createPool("BitCoin Birr Donation", ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC']);
    // await getState().pool.token.createPool("Accra Credit Union", ['0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC']);
  }

  export const createPool = (poolName, admins) => async (dispatch, getState) => {
    console.log('creating pool ', poolName, ' with admins ', admins);
    await getState().pool.token.createPool(poolName, [...admins]);
 }

  const getPoolsList = () => async (dispatch, getState) => {
    const selectedAddress = getState().pool.selectedAddress;
    console.log({ selectedAddress });


    //To access pool metadata
    // poolMap['xerandomadress'].name()
    // poolMap['xerandomadress'].isAdmin(address)
    const poolMap = new Map()

    
    //list pool addresses first
    const poolAddresses = await getState().pool.token.listPools();
    for (var i = 0; i < poolAddresses.length; i++) {
      let poolGen = await new ethers.ContractFactory(
        PoolArtifact.abi,
        PoolArtifact.bytecode, 
        getState().pool.provider.getSigner(0)
      );

      let pool = await poolGen.attach(poolAddresses[i]);
      poolMap[poolAddresses[i]] = pool;     

    }

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

    const isConnected = dispatch(_checkNetwork());
    if (!isConnected) {
        return;
    }

    const [selectedAddress] = await window.ethereum.enable();

    dispatch(setUserAddress(selectedAddress));
    dispatch(_initialize());
  
    window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (newAddress === undefined) {
          dispatch(resetState());
        }
        _initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
    //   this._stopPollingData();
      dispatch(resetState());
    });
  };

  
 
  