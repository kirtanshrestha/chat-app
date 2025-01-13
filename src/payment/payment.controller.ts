import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    //khalti
    @Post('create-payment-session')
    async createPaymentSession(
        @Res() res,
        @Body('amount') amount: number,
        @Body('receiver') receiver: string,
    ) {
        // Create Khalti payment session and return session URL
        const session = await this.paymentService.createPaymentSession(amount, receiver);
        return session;
        // return res.redirect(session.checkoutUrl);
    }

    /**Stripe
     * Create a Checkout Session
     * @param priceId The Price ID of the product
     */
    @Post('Stripe')
    async createCheckoutSession(@Res() res, @Body('receiver') receiver: string,
        @Body('amount') amount: number) {
        const session = await this.paymentService.createCheckoutSession(receiver, amount);
        return { id: session.id, url: session.url };
        // return res.redirect(session.url);
    }

    /**Stripe
     * Retrieve Session Details (Optional)
     * @param sessionId The ID of the session
     */
    @Post('retrieve-session')
    async retrieveSession(@Body('sessionId') sessionId: string) {
        return this.paymentService.retrieveSession(sessionId);
    }
}
