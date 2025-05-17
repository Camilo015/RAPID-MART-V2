require('dotenv').config({ path: './stripe.env' });
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentRoutes = require('./routes/payment');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas
app.use('/api', paymentRoutes);

// Ruta para crear un intent de pago
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validar el monto
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    // Crear un PaymentIntent con el monto y la moneda
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // El monto ya viene en centavos desde el frontend
      currency: 'cop',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: Date.now().toString(),
      }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error al crear PaymentIntent:', error);
    res.status(500).json({ 
      error: 'Error al procesar el pago',
      details: error.message 
    });
  }
});

// Ruta para verificar el estado del pago
app.get('/api/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({ 
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convertir de centavos a la moneda base
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });
  } catch (error) {
    console.error('Error al verificar estado del pago:', error);
    res.status(500).json({ 
      error: 'Error al verificar el estado del pago',
      details: error.message 
    });
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
        // Por ejemplo, actualizar el estado de la orden en tu base de datos
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Pago fallido:', failedPayment.id);
        // Aquí puedes agregar lógica adicional para manejar el pago fallido
        // Por ejemplo, notificar al usuario o actualizar el estado de la orden
        break;

      default:
        console.log(`Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error en webhook:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 