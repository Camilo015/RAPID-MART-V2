import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// Inicializar Stripe con tu clave pública
const stripePromise = loadStripe('tu_clave_publica_de_stripe');

const PaymentGateway = () => {
  const [clientSecret, setClientSecret] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state || {};

  useEffect(() => {
    // Crear PaymentIntent cuando el componente se monte
    fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => {
        console.error('Error:', error);
        navigate('/error');
      });
  }, [amount, navigate]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#FF3131',
      colorBackground: '#ffffff',
      colorText: '#333333',
      colorDanger: '#df1b41',
      fontFamily: 'Arial, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  };

  return (
    <div className="payment-container">
      <h3>Completa tu pago</h3>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PaymentGateway; 