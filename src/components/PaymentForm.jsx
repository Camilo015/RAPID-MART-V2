import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../styles/PaymentForm.css';

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Crear el intent de pago en el backend
      const { data: clientSecret } = await axios.post('http://localhost:3001/api/create-payment-intent', {
        amount: amount * 100, // Stripe usa centavos
      });

      // Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('Ocurrió un error al procesar el pago. Por favor, intente nuevamente.');
      console.error('Error:', err);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-row">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? 'Procesando...' : `Pagar $${amount}`}
      </button>
    </form>
  );
};

export default PaymentForm; 