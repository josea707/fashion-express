import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/user';
import { ReactComponent as CloseMenu } from '../../assets/SVGs/x.svg';
import { ReactComponent as MenuIcon } from '../../assets/SVGs/menu.svg';
import Logo from '../../assets/e-commerce-logo.png';
import AdminNav from '../admin/layout/AdminNav';
import { Link } from 'react-router-dom';
const NavBar = ({
  auth: { isAuthenticated, loading, isAdmin },
  cart: { cart },
  logout,
  history,
}) => {
  useEffect(() => {
    closeMobileMenu();
  }, [isAuthenticated]);
  const [searchValue, setSearchValue] = useState('');
  const [click, setClick] = useState(false);
  const [clickAuthMobile, setClickAuthMobile] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const handleClickAuth = () => setClickAuthMobile(!clickAuthMobile);
  const handleSearch = (e) => {
    if (searchValue !== '') history.push(`/products/${searchValue}`);
  };
  const authLinksMobile = () => {
    return (
      <div className='link' onClick={handleClickAuth}>
        <i className='fas fa-user light'></i>

        <ul
          className={
            clickAuthMobile ? 'dropdown-items display' : 'dropdown-items hidden'
          }
        >
          <li className='dropdown-item' onClick={closeMobileMenu}>
            <Link to={'/accounts'} className='link light'>
              {' '}
              Account{' '}
            </Link>{' '}
          </li>

          <li className='dropdown-item'>
            <Link
              to={`/orders`}
              className='link light'
              onClick={closeMobileMenu}
            >
              {' '}
              Order History{' '}
            </Link>
          </li>
          <li className='dropdown-item'>
            <Link to={'/'} className='link light' onClick={logout}>
              {' '}
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  const authLinks = () => {
    return (
      <div className='dropdown-trigger link'>
        <i className='fas fa-user light'></i>
        <ul className='dropdown-items'>
          <li className='dropdown-item'>
            <Link to={'/accounts'} className='link light'>
              {' '}
              Account{' '}
            </Link>{' '}
          </li>

          <li className='dropdown-item'>
            <Link to={`/orders`} className='link light'>
              {' '}
              Order History{' '}
            </Link>
          </li>
          <li className='dropdown-item'>
            <Link to={'/'} className='link light' onClick={logout}>
              {' '}
              Sign out
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  const guestLinks = (type) => (
    <Fragment>
      <Link
        to={'/login'}
        className='link light'
        onClick={type ? closeMobileMenu : null}
      >
        {' '}
        Sign in
      </Link>
    </Fragment>
  );
  return (
    <header>
      {isAdmin && <AdminNav />}
      <div className='navbar-wrapper content-wrapper '>
        <div className='logo-container'>
          <Link to={'/'} className='link light'>
            <img src={Logo} alt='logo' className='logo' />
          </Link>

          <ul className={click ? 'nav-options active' : 'nav-options'}>
            <li className='option mobile-option' onClick={closeMobileMenu}>
              <Link to={'/products'} className='link light'>
                Products
              </Link>
            </li>
            <li className='option mobile-option'>
              {!loading && isAuthenticated
                ? authLinksMobile()
                : guestLinks(true)}
            </li>
            <li className='option mobile-option' onClick={closeMobileMenu}>
              <Link to={'/carts'} className='link cart-container'>
                {' '}
                <i className='fas fa-shopping-cart'></i>
                <span className='cart-container__notification'>
                  {' '}
                  {cart.length}{' '}
                </span>
              </Link>
            </li>
          </ul>
        </div>

        <ul className='desktop-view'>
          <li className='option' onClick={closeMobileMenu}>
            <Link to={'/products'} className='link light'>
              Products
            </Link>
          </li>

          <li className='option' onClick={closeMobileMenu}>
            {!loading && isAuthenticated ? authLinks() : guestLinks(false)}
          </li>
          <li className='option' onClick={closeMobileMenu}>
            <Link to={'/carts'} className='link cart-container light'>
              {' '}
              <i className='fas fa-shopping-cart light'></i>
              <span className='cart-container__notification'>
                {' '}
                {cart.length}{' '}
              </span>
            </Link>
          </li>
        </ul>
        <div className='mobile-menu' onClick={handleClick}>
          {click ? (
            <CloseMenu className='menu-icon' />
          ) : (
            <MenuIcon className='menu-icon' />
          )}
        </div>
      </div>
      <div className='navbar-wrapper__search'>
        <form className='search-container center' onSubmit={handleSearch}>
          <input
            type='text'
            className='search-bar navigation'
            onChange={(e) => setSearchValue(e.target.value)}
            name='searchValue'
            placeholder=' Search Fashion Express'
            value={searchValue}
          />
        </form>
      </div>
    </header>
  );
};

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.user,
  cart: state.cart,
});
export default connect(mapStateToProps, { logout })(NavBar);
