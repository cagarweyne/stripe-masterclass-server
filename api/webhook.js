const stripeAPI = require('../stripe');

const webHookHandlers = {
  'checkout.session.completed': (data) => {
    console.log('Checkout completed successfully', data);
    // other business logic
  },

  'payment_intent.succeeded': (data) => {
    console.log('Payment succeeded', data);
  },
  'payment_intent.payment_failed': (data) => {
    console.log('Payment Failed', data);
  }
}

function webhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeAPI.webhooks.constructEvent(
      req['rawBody'], sig, process.env.WEB_HOOK_SECRET);
  } catch(error) {
    return res.status(400).send(`Webhook error ${error.message}`);
  }

  if (webHookHandlers[event.type]) {
    webHookHandlers[event.type](event.data.object);
  }
}

module.exports = webhook;