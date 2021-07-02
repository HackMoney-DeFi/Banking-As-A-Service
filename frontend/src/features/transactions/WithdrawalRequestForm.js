import React from "react";
import { useDispatch } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";

const WidthdrawalRequestForm = () => {
  return (
    <div className="transaction">
      <h5>Deposit</h5>
      <div className="transaction-form">
        <form>
          <label for="amt">Amount:</label>
          <input type="number" id="lname" name="lname" />
        </form>
        <button className="btn btn-sm">Submit</button>
      </div>
    </div>
  );
};

export default WidthdrawalRequestForm;
