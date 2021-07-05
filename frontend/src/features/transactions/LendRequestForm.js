import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";
import CreatableSelect from "react-select/creatable";
import { lendOutMoneyFromPool } from '../../redux/poolSlice';

const ReceiverSelect = ({ setReceiverAddress }) => {
    const handleChange = (newValue) => {
     setReceiverAddress(newValue.value);
    };
  
    return (
      <CreatableSelect 
      className="mt-2"
        onChange={handleChange}
        placeholder="Enter receiver address"
      />
    );
};

  
const LendRequestForm = ({ address }) => {
    const dispatch = useDispatch();
  const [loanAmount, setLoanAmount] = useState();
  const [receiverAddress, setReceiverAddress] = useState();

  const handleSubmit = () => {
      console.log(address);
      dispatch(lendOutMoneyFromPool(address, receiverAddress, loanAmount));
  }

  return (
    <div className="transaction mb-2">
      <h5>Request Loan</h5>
      <div>
      <form className="create-pool">
        <div>
            <label class="sr-only" for="lname">Loan Amount</label>
            <input onChange={(e) => setLoanAmount(e.target.value)} placeholder="Enter Loan Amount (USDC)" type="number" id="lname" name="lname" />
          <br />
            <ReceiverSelect id="receiver" setReceiverAddress={setReceiverAddress} />
          {
            loanAmount && (
              <button onClick={handleSubmit} type="button" class="btn accent-btn">Submit</button>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default LendRequestForm;
