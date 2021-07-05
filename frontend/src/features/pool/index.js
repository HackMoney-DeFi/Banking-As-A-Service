import "./pool.css";
import { useDispatch } from "react-redux";
import { setProps, setSidePanel } from "../../redux/viewSlice";
import Pool3D from './3dpool/index';

function Pool({ address, name, amount, admins, isAdmin }) {
  const dispatch = useDispatch();

  const viewPoolDetails = () => {
    dispatch(setProps({ name, amount, admins, isAdmin, address }));
    dispatch(setSidePanel('details'));
  }

  return (
    <div className="" onClick={viewPoolDetails}>
      <div className="pool">
        <div className="pool-left">
        <h5>{name}</h5>
        <h6><span className="mr-2">⛑ </span>{admins.length} Admins</h6>
        </div>
        <div className="pool-right">
          <h6>${amount}K</h6>
        </div>
      </div>
      <Pool3D />
    </div>
  );
}

export default Pool;