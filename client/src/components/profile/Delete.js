import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteAccount, logout } from '../../actions/user';
import Spinner from '../layout/Spinner';
import MessageBox from '../layout/MessageBox';
import { ReactComponent as CloseMenu } from '../../assets/SVGs/x.svg';
const Delete = ({
  user: { loading },
  deleteAccount,
  logout,
  alert: { isError, msg, isSuccess },
  setLinkAccount,
}) => {
  // make it work like componentDidUpdate
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      if (isSuccess) startCounter();
    } else didMountRef.current = true;
    // eslint-disable-next-line
  }, [isSuccess]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const setModalIsOpenToFalse = () => {
    setLinkAccount('initialMessage');
    setModalIsOpen(false);
  };
  const handleDeleteAccount = () => {
    deleteAccount();
  };
  const startCounter = () => {
    setTimeout(function () {
      logout();
    }, 2000);
  };
  return (
    <div>
      {!modalIsOpen ? (
        <Redirect to='/accounts' />
      ) : (
        <Modal
          isOpen={modalIsOpen}
          className='modal-container'
          ariaHideApp={false}
        >
          <button onClick={setModalIsOpenToFalse} className='button-delete'>
            <CloseMenu className='menu-icon delete-x' />
          </button>
          {loading ? (
            <Spinner />
          ) : (
            <div className='modal-container__confirmation'>
              {isError && <MessageBox type={'danger'} msg={msg} />}
              {!isError && !isSuccess && (
                <div>
                  <p> Click on confirm to delete your account</p>
                  <div className='modal-container__confirmation--button'>
                    <button
                      onClick={handleDeleteAccount}
                      className='btn btn-danger'
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
              {isSuccess && (
                <div>
                  <MessageBox type={'success'} msg={msg} />
                  Redirecting you back to the home page...
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

Delete.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});

export default connect(mapStateToProps, { deleteAccount, logout })(Delete);
