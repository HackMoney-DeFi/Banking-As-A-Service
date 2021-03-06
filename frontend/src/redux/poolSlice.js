
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import PoolFactoryArtifact from '../contracts/PoolFactory.json';
import PoolArtifact from '../contracts/Pool.json';
import LibTokenArtifact from '../contracts/LibToken.json';
import skLibTokenArtifact from '../contracts/StkLibToken.json';
import usdcArtifact from '../contracts/Token.json';
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
      }
    },
  })
  
  export const { actions: { 
    walletLoading, setToken, setStakedAmt, setLibToken, setStakingStatus, setskLibToken, setUSDCToken, setProvider, setBalance, setTokenData, setError, resetState, setUserAddress, setPoolMap, setEthers  
    } , reducer } = dappSlice;

 const _initialize = () => async (dispatch, getState) => {
  await dispatch(_initializeEthers());
 // await dispatch( getLendRequests

  // await dispatch(stakeLibTokens(ethers.BigNumber.from("1000000000000000000000000000")));
//  await dispatch(createDefaultPools());

  await dispatch(await getPoolsList());
  
  await dispatch(lendOutMoneyFromPool());
  await dispatch(getStakedAmount());
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


    await dispatch(await setUSDCToken(usdc));
    await console.log("acquired USDC token", usdc)
    await dispatch(await setLibToken(libToken));
    await dispatch(await setToken(token));
    await dispatch(await setskLibToken(skLibToken));
  };

  export const createDefaultPools = () => async (dispatch, getState) => {
    await getState().pool.token.createPool("Ethiopian Farmers B", ['0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0']);

  }

  export const stakeLibTokens = (amount) => async (dispatch, getState) => {
    // dispatch(setStakingStatus('loading'));
    // try {
      await console.log("Attempting to stake ", amount)
      // initialize approval before actual staking
      await getState().pool.libToken.approve(contractAddress.skLibToken, amount*1000);
      const tx = await getState().pool.skLibToken.stake(amount);
      dispatch(setStakingStatus('success'));
      dispatch(getStakedAmount());
      
    // } catch (e) {
    //   dispatch(setStakingStatus('error'));
    // }
 }

  export const createPool = (poolName, admins) => async (dispatch, getState) => {
    console.log('creating pool ', poolName, ' with admins ', admins);
    await getState().pool.token.createPool(poolName, [...admins]);
    dispatch(getPoolsList());
 }

  const getPoolsList = () => async (dispatch, getState) => {
    const selectedAddress = getState().pool.selectedAddress;
    await console.log("Your address ", selectedAddress);



    //To access pool metadata
    // poolMap['xerandomadress'].name()
    // poolMap['xerandomadress'].isAdmin(address)
    const poolMap = {};
    //list pool addresses first

    const poolAddresses = await getState().pool.token.listPools();
    for (var i = 0; i < poolAddresses.length; i++) {
      let poolGen = await new ethers.ContractFactory(
        PoolArtifact.abi,
        PoolArtifact.bytecode, 
        getState().pool.provider.getSigner(0)
      );

      let pool = await poolGen.attach(poolAddresses[i]);
      const poolName = await pool.name();
      const isAdmin = await pool.isOwner(selectedAddress);
 //     const owners = await pool.owners();
      const totalLiquidity = await pool.getTotalReserveBalance()

      const transactionCount = await pool.transactionCount();
      console.log('transaction count: ', transactionCount.toString());
  
      // // get all pending transaction counts
      const transactionIds = await pool.getTransactionIds(0, transactionCount, true, false);
      console.log('transaction idees: ', transactionIds);


      pool.poolName = poolName;
      pool.isUserAdmin = isAdmin;
      pool.totalLiquidity = totalLiquidity.toNumber();
      pool.transactionCounter = transactionCount.toNumber();

      
      pool.transactionIds = transactionIds;

      // How to list pending requests

      //
      //
      //


   

      poolMap[poolAddresses[i]] = pool;   
      console.log(poolMap)  

      // DONOT Remove. Place-holder for demonstration
      await console.log(`${i} ${poolName} ${isAdmin} ${totalLiquidity} ${transactionIds} ${transactionIds}`);
    }

    dispatch(setPoolMap(poolMap));
  }


  // Send out a request to loan money out to external users
  const lendOutMoneyFromPool = (name) => async (dispatch, getState) => {
    const selectedAddress = await getState().pool.selectedAddress;

    console.log('loooooo', await getState());

  // pool =  await getState();
   let poolMap = getState().pool.poolMap;
   let key = Object.keys(poolMap)[0] ;
   console.log(poolMap);
   console.log(await poolMap[key].getOwners());

    const samplePool = poolMap[key];


    const callData = samplePool.interface.encodeFunctionData("lend(address,uint256)", [selectedAddress, 2]); // Remove the hardcode
    const transactionId = await samplePool.submitTransaction(samplePool.address, name,  0, callData);
    console.log("Transaction ID  ", transactionId);
  }



  // // Vote on a transaction to lend money
  // const confimLendRequest = (transactionId) => async (dispatch, getState) => {
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

  
 
  