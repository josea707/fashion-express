import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'react-slideshow-image/dist/styles.css';
import NavBar from './components/layout/NavBar';
import HomePage from './components/layout/HomePage';
import Footer from './components/layout/Footer';
import NonLandingPages from './NonLandingPages';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/user';
import { loadCart } from './actions/cart';
const App = () => {
  useEffect(() => {
    store.dispatch(loadCart());
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Fragment>
        <Router>
          <div className='grid-container'>
            <Route component={NavBar} />
            <main>
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route component={NonLandingPages} />
              </Switch>
            </main>
            <Footer />
          </div>
        </Router>
      </Fragment>
    </Provider>
  );
};

export default App;
