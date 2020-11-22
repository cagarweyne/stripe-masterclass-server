const stripeAPI = require('../stripe');
const firebase = require('../firebase');

async function createCustomer(userId) {
  const userSnapshot = await firebase.db.collection('users').doc(userId).get();

  const { email } = userSnapshot.data();

  const customer = await stripeAPI.customers.create({
    email,
    metadata: {
      firebaseUID: userId,
    }
  });

  await userSnapshot.ref.update({ stripeCustomerId: customer.id });
  return customer;
}

async function getCustomer(userId) {
  const userSnapshot = await firebase.db.collection('users').doc(userId).get();
  const { stripeCustomerId } = userSnapshot.data();
  if (!stripeCustomerId) {
    return createCustomer(userId);
  }
  
  const customer = await stripeAPI.customers.retrieve(stripeCustomerId);
  return customer;
}

module.exports = getCustomer;
