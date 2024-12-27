import Stripe from 'stripe'
import  User  from "../models/userModel.js";


const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = new Stripe(STRIPE_SECRET_KEY);

const port = process.env.PORT || 4000;

const createSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{
                price: STRIPE_PRICE_ID,
                quantity: 1,
            }],
            metadata: {
                userId: req.body.userId
            },
            success_url: `http://localhost:${port}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:${port}/api/payment/cancel`,
        });
        
        return res.json({ url: session.url });

    } catch (error) {
        console.log("Error creating session", error);
    }
};

const myWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
        if (event.type === 'checkout.session.completed') { 
            console.log("Payment successful", event);
        }
        else {
            console.log("Unhandled event type", event);
        }
        return res.sendStatus(200);
    } catch (error) {
        console.log("Error in webhook", error);
        return res.sendStatus(400);
    }
};

const successPayment = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        
        const userId = session.metadata.userId;
        
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { 
                plan: "premium",
                planExpires: expirationDate
            },
            { new: true }
        );
        console.log("User updated", updatedUser);

        return res.redirect(`http://localhost:3000/premium?status=success`);
    } catch (error) {
        console.log("Error in success payment", error);
        return res.redirect('http://localhost:3000/premium?status=error');
    }
};

const cancelPayment = async (req, res) => {
    return res.redirect('http://localhost:3000/premium?status=cancelled');
};

export { createSession, myWebhook, successPayment, cancelPayment }

