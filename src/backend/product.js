import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);

const product = await stripe.products.create({
    name: "Premium Plan",
    description: "Access to all premium features",
});

const price = await stripe.prices.create({ 
    product: product.id,
    unit_amount: 199,
    currency: "usd",
});

console.log(product, price);