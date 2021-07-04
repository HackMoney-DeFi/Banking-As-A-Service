import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";

const StakeForm = () => {
  const dispatch = useDispatch();
  const [stakeAmt, setStakeAmt] = useState();
  const [unstakeAmt, setUnstakeAmt] = useState();

  const handleClose = () => {
      dispatch(closeSidePanel());
  }
  return (
    <div>
      <div className="transaction">
        <h5>Stake</h5>
        <div className="transaction-form">
          <form>
            <div class="form-row align-items-center">
              <div class="col-auto">
                <label class="sr-only" for="lname">
                  I want to stake
                </label>
                <input
                  onChange={e => setStakeAmt(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                  id="lname"
                  name="lname"
                />
              </div>
              {stakeAmt && (
                <div class="col-auto">
                  <button class="btn btn-sm">Submit</button>
                </div>
              )}
            </div>
          </form>
        </div>
        <h5 className="mt-4">Unstake</h5>
        <div className="mt-2 transaction-form">
          <form>
            <div class="form-row align-items-center">
              <div class="col-auto">
                <label class="sr-only" for="lname">
                  I want to unstake
                </label>
                <input
                  onChange={e => setUnstakeAmt(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                  id="lname"
                  name="lname"
                />
              </div>
              {unstakeAmt && (
                <div class="col-auto">
                  <button class="btn btn-sm">Submit</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div>
        <button onClick={handleClose} className="btn w-100 btn-danger">Close</button>
      </div>
    </div>
  );
};

export default StakeForm;
