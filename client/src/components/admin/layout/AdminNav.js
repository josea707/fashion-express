import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as CloseMenu } from '../../../assets/SVGs/x.svg';
import { ReactComponent as MenuIcon } from '../../../assets/SVGs/menu.svg';
const AdminNav = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const mobileLinks = () => {
    return (
      <div
        className={
          click
            ? 'sidebar sidebar-mobile sidebar-show'
            : 'sidebar sidebar-mobile'
        }
      >
        <ul className='sidebar-nav mobile'>
          <li className='sidebar-nav__item menu-opener'>
            <div onClick={handleClick}>
              {click ? (
                <CloseMenu className='sidebar-nav__item-link' />
              ) : (
                <MenuIcon className='sidebar-nav__item-link' />
              )}
            </div>
          </li>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/dashboard'
              className='sidebar-nav__item--link'
              activeClassName='active'
              onClick={handleClick}
            >
              <div>
                <i className='fas fa-tachometer-alt'></i>
              </div>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/products'
              className='sidebar-nav__item--link'
              activeClassName='active'
              onClick={handleClick}
            >
              <div>
                <i className='fab fa-accusoft'></i>
              </div>
              <span>Product Management</span>
            </NavLink>
          </li>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/orders'
              className='sidebar-nav__item--link'
              activeClassName='active'
              onClick={handleClick}
            >
              <div>
                <i className='fas fa-tasks'></i>
              </div>
              <span>Order Management</span>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  };
  const desktopLinks = () => {
    return (
      <div className='sidebar sidebar-desktop'>
        <ul className='sidebar-nav'>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/dashboard'
              className='sidebar-nav__item--link'
              activeClassName='active'
            >
              <div>
                <i className='fas fa-tachometer-alt'></i>
              </div>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/products'
              className='sidebar-nav__item--link'
              activeClassName='active'
            >
              <div>
                <i className='fab fa-accusoft'></i>
              </div>
              <span>Product Management</span>
            </NavLink>
          </li>
          <li className='sidebar-nav__item'>
            <NavLink
              to='/admins/orders'
              className='sidebar-nav__item--link'
              activeClassName='active'
            >
              <div>
                <i className='fas fa-tasks'></i>
              </div>
              <span>Order Management</span>
            </NavLink>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <div>
      {mobileLinks()}
      {desktopLinks()}
    </div>
  );
};
export default AdminNav;
