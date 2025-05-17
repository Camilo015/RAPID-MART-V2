const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51ROkIPQWQZ4ZSt9gIqrCo6YvbI8IQzm24SxPG7ecouL5bMJ7Nuf2MxBajxCHTabkT9NDrDRO8jj5qnV9Ksg8ApiU00gK5oNSqy');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta para crear un intent de pago
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Crear un PaymentIntent con el monto y la moneda
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'cop', // Moneda colombiana
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para verificar el estado del pago
app.get('/api/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para manejar webhooks de Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      'tu_webhook_secret' // Reemplaza con tu webhook secret de Stripe
    );

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Pago exitoso:', paymentIntent.id);
        // Aquí puedes agregar lógica adicional para manejar el pago exitoso
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Pago fallido:', failedPayment.id);
        // Aquí puedes agregar lógica adicional para manejar el pago fallido
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error en webhook:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 