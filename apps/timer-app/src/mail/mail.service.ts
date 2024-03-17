import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { AllConfigType } from '../config/config.type';
import path from 'path';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }), // dev&test: 587,  prod: 465
      ignoreTLS: configService.get('mail.ignoreTLS', { infer: true }),
      secure: configService.get('mail.secure', { infer: true }),
      requireTLS: configService.get('mail.requireTLS', { infer: true }),
      auth: {
        user: configService.get('mail.user', { infer: true }),
        pass: configService.get('mail.password', { infer: true }),
      },
    });
  }

  async sendVerificationCode(data: {
    to: string;
    code: string | number;
  }): Promise<void> {
    const title = `This is an authentication code issued by ${this.configService.getOrThrow(
      'app.name',
      { infer: true },
    )}`;

    await this.sendMail({
      to: data.to,
      subject: title,
      text: title,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'apps',
        'timer-app',
        'src',
        'mail',
        'templates',
        'verify-code.hbs',
      ),
      context: {
        title: title,
        app_name: this.configService.get('app.name', { infer: true }),
        code: data.code,
      },
    });
  }

  async sendResetPasswordCode(data: {
    to: string;
    code: string | number;
  }): Promise<void> {
    const title = `${this.configService.getOrThrow('app.name', {
      infer: true,
    })}'s reset password verification code. `;

    await this.sendMail({
      to: data.to,
      subject: title,
      text: title,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'apps',
        'timer-app',
        'src',
        'mail',
        'templates',
        'forgot-password.hbs',
      ),

      context: {
        title: title,
        app_name: this.configService.get('app.name', { infer: true }),
        code: data.code,
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${this.configService.get('mail.defaultName', {
            infer: true,
          })}" <${this.configService.get('mail.defaultEmail', {
            infer: true,
          })}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
