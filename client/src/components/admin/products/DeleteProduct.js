import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteProduct } from '../../../actions/product';
import { clearAlert } from '../../../actions/alert';
import Spinner from '../../layout/Spinner';
import { useParams } from 'react-router';
import { ReactComponent as CloseMenu } from '../../../assets/SVGs/x.svg';
import MessageBox from '../../layout/MessageBox';
const DeleteProduct = ({
  deleteProduct,
  history,
  clearAlert,
  loading,
  alert: { isError, msg, isSuccess },
}) => {
  const { id } = useParams();
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (isSuccess) startCounter();
    // eslint-disable-next-line
  }, [isSuccess]);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
  };
  const handleDeleteProduct = () => {
    deleteProduct(id);
  };
  const startCounter = () => {
    setTimeout(function () {
      history.push('/admins/products');
    }, 2000);
  };
  return (
    <div>
      {!modalIsOpen ? (
        <Redirect to='/admins/products' />
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
          ) : !isError && !isSuccess ? (
            <div className='modal-container__confirmation'>
              <p> Click on confirm to delete this product</p>
              <div className='modal-container__confirmation--button'>
                <button
                  onClick={handleDeleteProduct}
                  className='btn btn-dark light'
                >
                  {' '}
                  Confirm
                </button>
              </div>
            </div>
          ) : isError ? (
            <div className='modal-container__confirmation'>
              <MessageBox type={'danger'} msg={msg} />
            </div>
          ) : (
            <div className='modal-container__confirmation'>
              <MessageBox type={'success'} msg={msg} />
              Redirecting you back to the product list...
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

DeleteProduct.propTypes = {
  deleteProduct: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.productDetailsReducer.loading,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  deleteProduct,
  clearAlert,
})(DeleteProduct);
