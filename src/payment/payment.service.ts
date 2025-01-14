import { Injectable, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import axios from 'axios';

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    private readonly khaltiSecretKey = process.env.KhaltiSecretKey // Your Khalti Secret Key
    private readonly khaltiPublicKey = process.env.KhaltiPublicKey; // Your Khalti Public Key
    private readonly khaltiUrl = 'https://a.khalti.com/api/v2/epayment/initiate/'; // Khalti's checkout API

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET, {
            apiVersion: '2024-12-18.acacia',
        });
    }

    //esewa

    //khalti
    async createPaymentSession(sender: string, amount: number, receiver: string) {
        const mobile = '9841234567';

        let payload = {
            website_url: "http://localhost:3000/",
            amount: amount * 100,
            mobile: mobile,
            purchase_order_id: receiver, // Product or service identifier
            purchase_order_name: 'Product Name', // Product Name
            return_url: `http://localhost:3000/users/updatePayment/${sender}/${receiver}/${amount}/balance-khalti`,
            //  // Success callback URL
        };

        try {
            // Call Khalti API to create a payment session
            const response = await axios.post(this.khaltiUrl, JSON.stringify(payload), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `key ${this.khaltiSecretKey}`,
                },
            });
            // Return the URL for the user to make the payment
            return response.data;
        } catch (error) {
            console.error('Khalti API Error:', error.response?.data || error.message);
            throw new Error('Error creating Khalti session');
        }
    }


    //stripe
    async createCheckoutSession(sender: string, receiver: string, amount: number): Promise<Stripe.Checkout.Session> {
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
            success_url: `http://localhost:3000/users/updatePayment/${sender}/${receiver}/${amount}/balance-stripe`,
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
