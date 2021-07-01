import React from 'react';
import { useDispatch } from 'react-redux';
import { closeSidePanel } from '../../../redux/viewSlice';
 
const CreatePool = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeSidePanel());
  };

  return (
    <div className="create-pool-form">
      <h3>Create New Pool</h3>
        <form>
          <label for="pname">Pool Name:</label>
          <input type="text" id="pname" name="pname" />
          <br />
          <label for="amt">Amount:</label>
          <input type="number" id="lname" name="lname" />
        </form>
        <button>Submit</button>
        <button onClick={handleClose}>Close</button>
    </div>
  );
};
 
export default CreatePool;