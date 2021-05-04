import React, { Fragment } from 'react';
import Sp from '../../assets/spinner.gif';
export const Spinner = () => {
  return (
    <Fragment>
      <img
        src={Sp}
        alt='Loading...'
        style={{
          width: '50%',
          margin: '0 auto',
          display: 'block',
        }}
      />
    </Fragment>
  );
};

export default Spinner;
