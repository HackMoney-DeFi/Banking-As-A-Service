import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel } from "../../../redux/viewSlice";
import { createPool } from "../../../redux/poolSlice";
import CreatableSelect from "react-select/creatable";

const options = userAddress => [
  { value: userAddress, label: `${userAddress} (that's you! 😎)` }
];

const AdminsSelect = ({ userAddress, setAdmins }) => {
  const handleChange = (newValue, actionMeta) => {
    setAdmins(newValue.map(v => v.value));
  };

  return (
    <CreatableSelect
      isClearable
      isMulti
      onChange={handleChange}
      options={options(userAddress)}
      placeholder="Enter at least 3 admins"
    />
  );
};

const CreatePool = () => {
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.pool.selectedAddress);
  const [poolName, setPoolName] = useState();
  const [admins, setAdmins] = useState();

  const handleClose = () => {
    dispatch(closeSidePanel());
  };

  const handleSubmit = () => {
    dispatch(createPool(poolName, admins));
    dispatch(closeSidePanel());
  };

  return (
    <div className="create-pool">
      <h3>Create New Pool</h3>
      <form className="create-pool-form">
        <label className="mr-1" for="pname">Pool Name</label>
        <br/>
        <input
          onChange={e => setPoolName(e.target.value)}
          type="text"
          id="pname"
          className="mb-2"
          placeholder="best pool ever!!"
          name="pname"
        />
        <br />
        <label className="mr-1" for="admins">Admins</label>
        <AdminsSelect id="admins" setAdmins={setAdmins} userAddress={userAddress} />
      </form>
      {
        poolName && admins && admins?.length > 2 && (
          <button type="button" className="btn btn-accent" onClick={handleSubmit}>Submit</button>
        )
      }
      <button type="button" className="btn btn-danger mt-1" onClick={handleClose}>Close</button>
    </div>
  );
};

export default CreatePool;
