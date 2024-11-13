import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail() {
        const message =
            'Olvidaste tu contraseña? Si no olvidaste tu contraseña, ignora este mensaje';
        console.log(process.env.EMAIL_PORT);

        try {
            const email = await this.mailerService.sendMail({
                from: 'pepe@gonza.com',
                to: ['mike471f8@gmail.com', 'jozefy67@gmail.com'],
                subject: 'Recuperar contraseña',
                text: message,
            });
            console.log(email);
            return 'Mail sent successfully';
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
