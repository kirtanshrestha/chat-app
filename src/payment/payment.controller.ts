import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    /**
     * Create a Checkout Session
     * @param priceId The Price ID of the product
     */
    @Post('create-checkout-session')
    async createCheckoutSession(@Body('receiver') receiver: string,
        @Body('amount') amount: number) {
        const session = await this.paymentService.createCheckoutSession(receiver, amount);
        return { id: session.id, url: session.url };
    }

    /**
     * Retrieve Session Details (Optional)
     * @param sessionId The ID of the session
     */
    @Post('retrieve-session')
    async retrieveSession(@Body('sessionId') sessionId: string) {
        return this.paymentService.retrieveSession(sessionId);
    }
}
