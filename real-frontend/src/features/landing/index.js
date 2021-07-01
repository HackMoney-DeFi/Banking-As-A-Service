import "./landing.css";
import { useSelector } from 'react-redux';

function Landing() {
  const userAddress = useSelector(state => state.pool.selectedAddress);
  return (
    <div className="landing">
      {!userAddress ? (
        <>   
          <h3>Welcome to ___ 💧.</h3>
          <h5>Banks should belong to the people, not the other way around. </h5>
        </>
      ) : (
        <>
          <h3>Dive In 🏄‍♂️</h3>
          <h5>Make the world and your wallet a better place with group lending.</h5>
        </>
      )}
    </div>
  );
}

export default Landing;
