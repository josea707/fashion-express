import React from 'react';

const Steps = ({stepOne, stepTwo, stepThree}) => {
  return (
    <div className='row checkout-steps'>
      <div className={stepOne ? 'active' : ''}> Shipping</div>
      <div className={stepTwo ? 'active' : ''}> Payment</div>
      <div className={stepThree ? 'active' : ''}> Place Order</div>
    </div>
  );
};

export default Steps;
