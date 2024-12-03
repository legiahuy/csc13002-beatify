import express from 'express';
import { createSession, myWebhook, successPayment, cancelPayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/session', createSession);
paymentRouter.post('/my-webhook', express.raw({type: 'application/json'}), myWebhook);
paymentRouter.get('/success', successPayment);
paymentRouter.get('/cancel', cancelPayment);


export default paymentRouter;
