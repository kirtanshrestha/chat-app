import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: '2024-12-18.acacia',
        });
    }

    /**
     * Create a Checkout Session
     * @param priceId The Price ID of the product (configured in Stripe Dashboard)
     */
    async createCheckoutSession(receiver: string, amount: number): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'npr',
                        product_data: {
                            name: `Payment to ${receiver}`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/users/updatePayment/${receiver}/${amount}`,
            cancel_url: 'http://localhost:3000/cancel',
        });
    }


    /**
     * Retrieve Session Details (Optional)
     * @param sessionId The ID of the session
     */
    async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        return this.stripe.checkout.sessions.retrieve(sessionId);
    }
}
