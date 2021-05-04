import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import MessageBox from '../layout/MessageBox';
const Checkout = ({ saveCard }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [validPayment, setValidPayment] = useState({ isValid: false, msg: '' });
  const { isValid, msg } = validPayment;
  const saveCardInfo = async (e) => {
    e.preventDefault();
    const cardElement = elements.getElement(CardElement);
    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setValidPayment({ isValid: false, msg: error.message });
      /* if the use changes a valid paymant method and a card is already saved, clear it.*/
      if (isValid) {
        saveCard(undefined);
        alert('Your previous payment method info has been deleted');
      }
    } else {
      saveCard(paymentMethod);
      setValidPayment({
        isValid: true,
        msg: 'Your payment method has been saved successfully',
      });
    }
  };
  return (
    <form onSubmit={saveCardInfo}>
      <div className='payment-container padding-top'>
        <CardElement />
        <div className='padding-top'>
          {msg !== '' && !isValid && <MessageBox msg={msg} type={'danger'} />}
          {msg !== '' && isValid && <MessageBox msg={msg} type={'success'} />}
          <button className='btn btn-dark light' disabled={!stripe}>
            Save Payment Method
          </button>
        </div>
      </div>
    </form>
  );
};

export default Checkout;
