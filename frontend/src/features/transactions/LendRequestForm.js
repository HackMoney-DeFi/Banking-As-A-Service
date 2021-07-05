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
  const [loanPurpose, setLoanPurpose] = useState();
  const [receiverAddress, setReceiverAddress] = useState();

  const handleSubmit = () => {
      console.log(address);
      dispatch(lendOutMoneyFromPool(loanPurpose, address, receiverAddress, loanAmount));
  }

  return (
    <div className="transaction mb-4">
      <h5>Request Loan</h5>
      <div>
      <form className="create-pool">
        <div>
            <input className="mb-1" onChange={(e) => setLoanPurpose(e.target.value)} placeholder="Loan Purpose" type="text" id="lname" name="lname" />
            <div className="input-group mt-2">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" onChange={(e) => setLoanAmount(e.target.value)}  aria-label="Enter Amount" />
                <span className="input-group-text">USDC</span>
            </div>
          <br />
            <ReceiverSelect id="receiver" setReceiverAddress={setReceiverAddress} />
          {
            loanAmount && (
              <button onClick={handleSubmit} type="button" class="w-100 mt-3 btn accent-btn">Submit</button>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default LendRequestForm;
