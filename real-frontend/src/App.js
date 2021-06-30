import logo from './logo.svg';
import './App.css';
import Home from './features/home/index';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Home />
      </div>
    </Provider>
  );
}
                                                                                                                  
export default App;
