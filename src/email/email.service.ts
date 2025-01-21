import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USERNAME'),
                pass: this.configService.get<string>('EMAIL_PASSWORD'),
            },
        });
    }

    async sendVerificationEmail(to: string, token: string, otp:number) {
        const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,  // Set your email address here
            to,
            subject: 'Email Verification',
            text: `Please verify your email by clicking the following link: ${verificationUrl}`,
            html: `<p>Please verify your email by clicking the following link:</p><a href="${verificationUrl}">${verificationUrl}
           </a> <p> Or enter the otp: ${otp} </p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
