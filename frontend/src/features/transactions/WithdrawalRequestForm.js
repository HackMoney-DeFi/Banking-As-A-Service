import React from 'react';
import { useDispatch } from 'react-redux';
import { closeSidePanel } from '../../redux/viewSlice';

const WidthdrawalRequestForm = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeSidePanel());
  };

  return (
    <div>
      <h3>Request Withdrawal</h3>
        <form>
          <label for="amt">Amount:</label>
          <input type="number" id="lname" name="lname" />
        </form>
        <button>Submit</button>
        <button onClick={handleClose}>Close</button>
    </div>
  );
};
 
export default WidthdrawalRequestForm;