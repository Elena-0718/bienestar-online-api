import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CredentialMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string) {
    // El link que llevará al usuario a tu pantalla de Angular
    const url = `http://localhost:4200/#/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de Contraseña - Bienestar Online',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #5e72e4; text-align: center;">Bienestar Online</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background-color: #5e72e4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <hr style="border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">Este enlace es de un solo uso por seguridad.</p>
        </div>
      `,
    });
  }
}