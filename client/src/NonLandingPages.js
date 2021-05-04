import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Products from './components/products/Products';
import ProductDetails from './components/products/ProductDetails';
import AccountManagement from './components/profile/AccountManagement';
import Cart from './components/checkout/Cart';
import PrivateRoute from './components/auth/PrivateRoute';
import Shipping from './components/checkout/Shipping';
import Submit from './components/checkout/Submit';
import orderConfirmation from './components/checkout/OrderConfirmation';
import OrderHistory from './components/orders/OrderHistory';
import OrderDetails from './components/orders/OrderDetails';
import NotFoundPage from './components/layout/NotFoundPage';
// Admin.
import AdminRoute from './components/auth/PrivateRoute';
import AdministrationProduct from './components/admin/products/AdministrationProduct';
import CreateProduct from './components/admin/products/CreateProduct';
import DeleteProduct from './components/admin/products/DeleteProduct';
import EditProducts from './components/admin/products/EditProducts';
import AdministrationOrder from './components/admin/orders/AdministrationOrder';
import EditOrder from './components/admin/orders/EditOrder';
import Admin from './components/admin/Admin';
const NonLandingPages = () => {
  return (
    <div className='content-wrapper'>
      <Switch>
        <Route exact path='/registration' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/products/:searchValue?' component={Products} />
        <Route exact path='/products/details/:id' component={ProductDetails} />
        <Route exact path='/carts' component={Cart} />
        <Route exact path='/checkout/shipping' component={Shipping} />

        <Route exact path='/checkout/payment' component={Submit} />
        <Route
          exact
          path='/checkout/confirmation'
          component={orderConfirmation}
        />

        <PrivateRoute exact path='/orders' component={OrderHistory} />
        <PrivateRoute exact path='/orders/:order_id' component={OrderDetails} />

        <PrivateRoute exact path='/accounts' component={AccountManagement} />
        <AdminRoute exact path='/admins/dashboard' component={Admin} />
        <AdminRoute
          exact
          path='/admins/products'
          component={AdministrationProduct}
        />
        <AdminRoute
          exact
          path='/admins/products/creation'
          component={CreateProduct}
        />
        <AdminRoute
          exact
          path='/admins/products/deletion/:id'
          component={DeleteProduct}
        />
        <AdminRoute
          exact
          path='/admins/products/editor/:id'
          component={EditProducts}
        />
        <AdminRoute
          exact
          path='/admins/orders'
          component={AdministrationOrder}
        />
        <AdminRoute exact path='/admins/orders/:id' component={EditOrder} />
        <Route path='*' component={NotFoundPage} />
      </Switch>
    </div>
  );
};

export default NonLandingPages;
