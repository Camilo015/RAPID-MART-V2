import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';

const PaymentSuccess = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Recuperar el client_secret de la URL
    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      return;
    }

    // Recuperar el PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          // El pago fue exitoso
          break;
        case 'processing':
          // El pago está siendo procesado
          break;
        case 'requires_payment_method':
          // El pago falló, intenta de nuevo
          navigate('/payment');
          break;
        default:
          // Ocurrió un error
          navigate('/error');
          break;
      }
    });
  }, [stripe, searchParams, navigate]);

  return (
    <div className="payment-success">
      <h3>¡Pago Exitoso!</h3>
      <p>Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>
      <button
        className="btn-continuar"
        onClick={() => navigate('/')}
      >
        Continuar comprando
      </button>
    </div>
  );
};

export default PaymentSuccess; 