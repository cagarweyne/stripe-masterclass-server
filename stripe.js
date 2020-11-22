const stripeAPI = require('stripe')(process.env.SECRET_KEY);

module.exports = stripeAPI;