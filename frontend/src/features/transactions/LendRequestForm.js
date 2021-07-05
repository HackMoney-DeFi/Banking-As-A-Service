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
    <div className="transaction">
      <h5>Request Loan</h5>
      <div>
      <form className="create-pool">
        <div>
            <label class="sr-only" for="lname">Loan Amount</label>
            <input onChange={(e) => setLoanAmount(e.target.value)} placeholder="Enter Loan Amount" type="number" id="lname" name="lname" />
          <br />
            <label className="mt-2 mr-1" for="receiver">Receiver Address</label>
            <ReceiverSelect id="receiver" setReceiverAddress={setReceiverAddress} />
          {
            loanAmount && (
              <button onClick={handleSubmit} type="button" class="btn btn-sm mt-2">Submit</button>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default LendRequestForm;
