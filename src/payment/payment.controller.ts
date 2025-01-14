import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiExcludeEndpoint, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    //khalti
    @Post('create-payment-session')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a Khalti payment session' })
    @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number' }, receiver: { type: 'string' } } } })
    @ApiResponse({ status: 201, description: 'Payment session created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    async createPaymentSession(
        @Req() req,
        @Body('amount') amount: number,
        @Body('receiver') receiver: string,
    ) {
        // Create Khalti payment session and return session URL
        const session = await this.paymentService.createPaymentSession(req.user.username, amount, receiver);
        return session;
        // return res.redirect(session.checkoutUrl);
    }

    /**Stripe
     * Create a Checkout Session
     * @param priceId The Price ID of the product
     */
    @Post('Stripe')
    @ApiOperation({ summary: 'Create a Stripe checkout session' })
    @ApiBody({ schema: { type: 'object', properties: { amount: { type: 'number' }, receiver: { type: 'string' } } } })
    @ApiResponse({ status: 201, description: 'Checkout session created successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid input.' })
    async createCheckoutSession(@Req() req, @Body('receiver') receiver: string,
        @Body('amount') amount: number) {
        const session = await this.paymentService.createCheckoutSession(req.user.username, receiver, amount);
        return { id: session.id, url: session.url };
        // return res.redirect(session.url);
    }

    /**Stripe
     * Retrieve Session Details (Optional)
     * @param sessionId The ID of the session
     */
    @Post('retrieve-session')
    @ApiExcludeEndpoint()
    async retrieveSession(@Body('sessionId') sessionId: string) {
        return this.paymentService.retrieveSession(sessionId);
    }
}
