
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import PoolFactoryArtifact from '../contracts/PoolFactory.json';
import PoolArtifact from '../contracts/Pool.json';
import LibTokenArtifact from '../contracts/LibToken.json';
import skLibTokenArtifact from '../contracts/StkLibToken.json';
import usdcArtifact from '../contracts/USDC.json';
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
const HARDHAT_NETWORK_ID = '1337';

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
      setStakingStatus(state, action) {
        state.stakeStatus = action.payload;
      },
      setUserAddress(state, action) {
          state.selectedAddress = action.payload;
      },
      setToken(state,action) {
          state.token = action.payload;
      },
      setStakedAmt(state,action) {
        state.stakedAmt = action.payload;
      },
      setLibToken(state, action ) {
          state.libToken = action.payload;
      },
      setUSDCToken(state, action ) {
        state.usdc = action.payload;
     },
      setskLibToken(state, action) {
        state.skLibToken = action.payload;
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
      },
      setUsdcBalance(state, action) {
        state.usdcBalance = action.payload
      }
    },
  })
  
  export const { actions: { 
    walletLoading, setToken, setUsdcBalance, setStakedAmt, setLibToken, setStakingStatus, setskLibToken, setUSDCToken, setProvider, setBalance, setTokenData, setError, resetState, setUserAddress, setPoolMap, setEthers  
    } , reducer } = dappSlice;

 const _initialize = () => async (dispatch, getState) => {
  dispatch(_initializeEthers());
 // await dispatch( getLendRequests

  // await dispatch(stakeLibTokens(ethers.BigNumber.from("1000000000000000000000000000")));
  dispatch(createDefaultPools());


  dispatch(getPoolsList());
  dispatch(getStakedAmount());
};

  const getStakedAmount = () => async (dispatch, getState) => {
    const stakedAmt = await getState().pool.libToken.totalSupply();
    dispatch(setStakedAmt(stakedAmt));
  };


 const _initializeEthers = () => async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch(setProvider(provider));

    const token = new ethers.Contract(
      contractAddress.PoolFactory,
      PoolFactoryArtifact.abi,
      provider.getSigner(0)
    );

    const libToken = new ethers.Contract(
      contractAddress.libToken,
      LibTokenArtifact.abi,
      provider.getSigner(0)
    );

    const skLibToken = new ethers.Contract(
      contractAddress.skLibToken,
      skLibTokenArtifact.abi,
      provider.getSigner(0)
    );

    const usdc = new ethers.Contract(
      contractAddress.usdcAdress,
      usdcArtifact.abi,
      provider.getSigner(0)
    );
    console.log("USDC address ",usdc);


    dispatch(setUSDCToken(usdc));
    dispatch(setLibToken(libToken));
    dispatch(setToken(token));
    dispatch(setskLibToken(skLibToken));
  };

  export const createDefaultPools = () => async (dispatch, getState) => {

    const selectedAddress = await getState().pool.selectedAddress;

     const usdc = await getState().pool.usdc.balanceOf(selectedAddress);
      console.log("USDC balance    ", usdc.toNumber());
      console.log("address/sele", usdc.address, await getState().pool.selectedAddress);
    await getState().pool.token.createPool("Family Pool", ['0x64e6e757a83a35b0842d8638f4a09d7558b0f541', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0']);
    await getState().pool.token.createPool("Ethiopian Farmers B", ['0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0']);
  }

  export const stakeLibTokens = (amount) => async (dispatch, getState) => {
    // dispatch(setStakingStatus('loading'));
    // try {
      await console.log("Attempting to stake ", amount)
      // initialize approval before actual staking
      await getState().pool.libToken.approve(contractAddress.skLibToken, amount);
      const tx = await getState().pool.skLibToken.stake(amount);
      dispatch(setStakingStatus('success'));
      dispatch(getStakedAmount());
      
    // } catch (e) {
    //   dispatch(setStakingStatus('error'));
    // }
 }

  export const createPool = (poolName, admins) => async (dispatch, getState) => {
    console.log('creating pool ', poolName, ' with admins ', admins);
    await getState().pool.token.createPool(poolName, admins);
    // dispatch(getPoolsList());
 }

  const getPoolsList = () => async (dispatch, getState) => {
    const selectedAddress = await getState().pool.selectedAddress;
    await console.log("Your address ", selectedAddress);

    //To access pool metadata
    // poolMap['xerandomadress'].name()
    // poolMap['xerandomadress'].isAdmin(address)
    const poolMap = {};
    //list pool addresses first

    const poolAddresses = await getState().pool.token.listPools();
    const signer = await getState().pool.provider.getSigner(0);
    let poolGen = await new ethers.ContractFactory(
      PoolArtifact.abi,
      PoolArtifact.bytecode, 
      signer
    );

    for (var i = 0; i < poolAddresses.length; i++) {
      let pool = await poolGen.attach(poolAddresses[i]);
      const poolName = await pool.name();
      const isAdmin = await pool.isOwner(selectedAddress);
      const owners = await pool.getOwners();
      const totalLiquidity = await pool.getTotalReserveBalance()
      const transactionCount = await pool.transactionCount();
      
      // // get all pending transaction counts
      const transactionIds = await pool.getTransactionIds(0, transactionCount, true, false);

      pool.poolName = poolName;
      pool.isUserAdmin = isAdmin;
      pool.admins = owners;
      pool.totalLiquidity = totalLiquidity.toNumber();
      pool.transactionCounter = transactionCount.toNumber();
      pool.transactionIds = transactionIds;
      
      poolMap[poolAddresses[i]] = pool;   

      // DONOT Remove. Place-holder for demonstration
      // console.log(`${i} ${poolName} ${isAdmin} ${totalLiquidity} ${transactionIds} ${transactionIds}`);
    }
    console.log({ poolMap });  
    dispatch(setPoolMap(poolMap));
  }


  // Send out a request to loan money out to external users
  export const lendOutMoneyFromPool = (requestName, poolAddress, receiverAddress, amount) => async (dispatch, getState) => {
    let poolMap = await getState().pool.poolMap;
    const pool = poolMap[poolAddress];

    const callData = await pool.interface.encodeFunctionData("lend(address,uint256)", [receiverAddress, amount]);
    const transactionId = await pool.submitTransaction(poolAddress, requestName, 0, callData);
        console.log("Transaction ID  ", transactionId);
  }



  // // Vote on a transaction to lend money
  // export const confimLendRequest = (transactionId) => async (dispatch, getState) => {
  //   const selectedAddress = getState().pool.selectedAddress;

  //   pool = PoolMap[selectedAddress];
  //   await pool.confirmTransaction(transactionId);

  // }


  const _checkNetwork = () => async (dispatch) => {
    console.log("Hardhat net ID ",HARDHAT_NETWORK_ID);
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

  export const getUsdcBalance = () => async (dispatch, getState) => {
    const selectedAddress = await getState().pool.selectedAddress;
    const usdc = await getState().pool.usdc.balanceOf(selectedAddress);
    console.log("USDC balance    ", usdc.toNumber())
    dispatch(setUsdcBalance(usdc));
  }

  export const depositToPool = (poolAddress, amount) => async (dispatch, getState) => {
    const pool = await getState().pool.poolMap[poolAddress];
    await pool.setUsdcAddress(contractAddress.usdcAdress);
    dispatch(getUsdcBalance());
    console.log({ poolAddress, pool });
    await getState().pool.usdc.approve(poolAddress, 10);
    await getState().pool.poolMap[poolAddress].deposit(10);
  }

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

  
 
  