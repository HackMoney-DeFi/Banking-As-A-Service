import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";
import { stakeLibTokens } from '../../redux/poolSlice';
import LoadingBtn from '../loading/LoadingBtn';

const StakeForm = () => {
  const dispatch = useDispatch();
  const stakeStatus = useSelector(state => state.pool.stakeStatus);
  const [stakeAmt, setStakeAmt] = useState();
  const [unstakeAmt, setUnstakeAmt] = useState();

  const handleClose = () => {
    dispatch(closeSidePanel());
  }

  const handleStake = () => {
    dispatch(stakeLibTokens(stakeAmt));
}
  return (
    <div>
      <div className="transaction">
        <div className="mb-4" style={{ fontSize: '12.5px' }}>
                   Stake KoloToken to get StakedKoloToken, which you can use to create pools.
               </div>
        
        <h5>Stake</h5>

        <div className="transaction-form">
        
          <form>
            <div>
                <div className="input-group mt-2">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control"  onChange={e => setStakeAmt(e.target.value)} aria-label="Enter Amount" />
                <span className="input-group-text">USDC</span>
              </div>
              {stakeAmt && 
                 
                    <div class="w-100 mt-1">
                        {
                             stakeStatus !== 'loading' ? 
                             ( 
                    <button type="button" onClick={handleStake} class="btn accent-btn w-100">Submit</button>
                             ) : (
                                 <LoadingBtn />
                             )
                        }
                    </div>
              }
            </div>
          </form>
        </div>
        <h5 className="mt-4">Unstake</h5>
        <div className="mt-2 transaction-form">
          <form>
            <div>
                  <div className="input-group mt-2">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control"  onChange={e => setUnstakeAmt(e.target.value)} aria-label="Enter Amount" />
                <span className="input-group-text">USDC</span>
              </div>
              {unstakeAmt && (
               <div class="w-100 mt-1">
                <button type="button" onClick={handleStake} class="accent-btn btn w-100">Submit</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div>
        <button onClick={handleClose} className="btn mt-4 w-100 btn-danger">Close</button>
      </div>
    </div>
  );
};

export default StakeForm;