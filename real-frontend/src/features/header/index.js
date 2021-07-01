import { setSidePanel } from "../../redux/viewSlice";
import { useDispatch, useSelector } from 'react-redux';
import { connectWallet } from "../../redux/poolSlice";

function Header() {
  const dispatch = useDispatch();
  const userAddress = useSelector(state => state.pool.selectedAddress);

  const handleCreatePool = () => {
    dispatch(setSidePanel('createPool'));  
  }

  const handleLogin = () => {
    dispatch(connectWallet());  
  }

  return (
      <header>
          <h2>
              Poolio
          </h2>
          <div>
            {
              userAddress ? (
                <button className="btn accent-btn" onClick={() => handleCreatePool()}>Create Pool</button>
              ) :
              (
                <button className="btn accent-btn" onClick={() => handleLogin()}>Connect</button>
              )
            }
          </div>
      </header>
  );
}

export default Header;
