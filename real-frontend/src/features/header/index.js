import { setSidePanel } from "../../redux/viewSlice";
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../redux/userSlice";
import { connectWallet } from "../../redux/dappSlice";

function Header() {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);

  const handleCreatePool = () => {
    dispatch(setSidePanel('createPool'));  
  }

  const handleLogin = () => {
    dispatch(login());
    dispatch(connectWallet());  
  }

  return (
      <header>
          <div>
              Poolio
          </div>
          <div>
            {
              userId ? (
                <button className="btn accent-btn" onClick={() => handleCreatePool()}>Create Pool</button>
              ) :
              (
                <button className="btn accent-btn" onClick={() => handleLogin()}>Login</button>
              )
            }
          </div>
      </header>
  );
}

export default Header;
