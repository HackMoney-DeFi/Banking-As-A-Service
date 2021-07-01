import './home.css';
import PoolsContainer from './PoolsContainer';
import Header from '../header';
import SidePanel from '../sidepanel';
import 'react-sliding-side-panel/lib/index.css';
import Landing from '../landing/index';

function Home() {
  return (
    <div className="home">
      <Header />
      <SidePanel />
      <Landing />
      <PoolsContainer />
    </div>
  );
}

export default Home;
