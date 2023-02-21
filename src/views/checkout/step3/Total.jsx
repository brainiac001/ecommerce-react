import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import { CHECKOUT_STEP_2 } from '@/constants/routes';
import { useFormikContext } from 'formik';
import { displayMoney } from '@/helpers/utils';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setPaymentDetails } from '@/redux/actions/checkoutActions';
import { PaystackButton } from 'react-paystack';
import { useSelector } from 'react-redux';






const Total = ({ isInternational, subtotal }) => {

  //const profile = useSelector((state) => state.profile);
 
  const shipping = useSelector(state => state.checkout.shipping);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: shipping.email,
    amount: Math.ceil((subtotal + (isInternational ? 5000 : 3000) + (0.015 * (subtotal + (isInternational ? 5000 : 3000)))) * 100) + 10000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_test_0b2a1edcd0c06e9d6dfc1e4e34e5180299b44263',
    metadata: {
      fullname: shipping.fullname,
      address: shipping.address,
      phoneNumber: shipping.mobile.value,
    }
    
  };
  console.log(config);

  const { values, submitForm } = useFormikContext();
  const history = useHistory();
  const dispatch = useDispatch();

  const onClickBack = () => {
    // destructure to only select left fields omitting cardnumber and ccv
    const { cardnumber, ccv, ...rest } = values;

    dispatch(setPaymentDetails({ ...rest })); // save payment details
    history.push(CHECKOUT_STEP_2);
  };

//Paystack implementation starts her constants
  // you can call this function anything
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed')
  }

  const componentProps = {
      ...config,
      text: 'Confirm ',
      onSuccess: (reference) => handlePaystackSuccessAction(reference),
      onClose: handlePaystackCloseAction,
  };

  //passtack implementation constants ends here

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h2 className="basket-total-amount">
          {displayMoney(subtotal + (isInternational ? 5000 : 3000))}
        </h2>
        <h2 className="basket-total-amount">
          +
        </h2>
        <h2 className="basket-total-amount">
           <b>VAT:</b> {displayMoney((0.015 * (subtotal + (isInternational ? 5000 : 3000))) +100)}
        </h2>
      </div>
      <br />
      <div className="checkout-shipping-action">
        <button
          className="button button-muted"
          onClick={() => onClickBack(values)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp;
          Go Back
        </button>

        {/*
        //former confirm button code

        <button
          className="button"
          disabled={false}
          onClick={submitForm}
          type="button"
        >
          <CheckOutlined />
          &nbsp;
          Confirm
        </button>
*/}
        <PaystackButton className="button" {...componentProps} />

      </div>
    </>
  );
};

Total.propTypes = {
  isInternational: PropType.bool.isRequired,
  subtotal: PropType.number.isRequired
};

export default Total;
