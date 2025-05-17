const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Ruta de prueba para verificar que las rutas de pago funcionan
router.get('/test', (req, res) => {
  res.json({ message: 'Rutas de pago funcionando correctamente' });
});

router.post('/payment', async (req, res) => {
  try {
    const {
      cardholderName,
      cardNumber,
      expiryDate,
      cvc,
      amount,
      currency,
      items
    } = req.body;

    console.log('Datos recibidos:', {
      cardholderName,
      cardNumber: cardNumber.substring(0, 4) + '****',
      expiryDate,
      amount,
      currency,
      itemsCount: items.length
    });

    // Crear el token de la tarjeta
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: parseInt(expiryDate.split('/')[0]),
        exp_year: parseInt('20' + expiryDate.split('/')[1]),
        cvc: cvc,
        name: cardholderName
      }
    });

    // Crear el cargo
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency || 'usd',
      source: cardToken.id,
      description: `Compra de ${items.length} productos`,
      metadata: {
        items: JSON.stringify(items)
      }
    });

    // Aquí puedes guardar la transacción en tu base de datos
    const transaction = {
      id: charge.id,
      amount: amount,
      currency: currency,
      status: charge.status,
      items: items,
      date: new Date().toISOString()
    };

    console.log('Transacción completada:', {
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status
    });

    res.json({
      success: true,
      transactionId: charge.id,
      message: 'Pago procesado correctamente'
    });
  } catch (error) {
    console.error('Error en el procesamiento del pago:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error en el procesamiento del pago'
    });
  }
});

module.exports = router; 