import React, { Fragment } from 'react';
import Sp from '../../assets/loading-form.gif';
export const LoadingForm = () => {
  return (
    <Fragment>
      <img src={Sp} alt='Loading...' className='loading-form' />
    </Fragment>
  );
};

export default LoadingForm;
