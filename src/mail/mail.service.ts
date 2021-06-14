import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { sleep } from '../../utils/utils';
import slugify from 'slugify';
const nodemailer = require('nodemailer');
import { Config } from '../config/config';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail = async (to: string, subject: string, html: string) => {
    let lastRes;
    let again = true;
    let retries = 0;
    let lastError;

    let transporter = nodemailer.createTransport({
      name: 'emailpro-lm1230856-1',
      host: 'pro2.mail.ovh.net',
      port: 587,
      debug: false,
      logger: false,
      pool: true,
      requireTLS: false,
      tls: {
        rejectUnauthorized: false
      },
      secure: false,
      auth: {
        user: Config.EMAIL_USER,
        pass: Config.EMAIL_PASS,
      },
    });

    while (again && retries < 10) {
      try {
        lastRes = await transporter.sendMail({
          to,
          from: Config.EMAIL_FROM,
          subject,
          html,
          replyTo: Config.EMAIL_FROM,
        });
        again = false;
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(
          `Error sending mail to ${to} with subject "${subject}", retry #${retries}`,
          e,
        );
        lastError = e;
        retries++;
        await sleep(100 * retries);
      }
    }

    if (retries > 0) {
      if (!again) {
        // tslint:disable-next-line:no-console
        console.log(`After ${retries} retries mail successfully sent.`);
      } else {
        // tslint:disable-next-line:no-console
        console.error(`After ${retries} retries we still cannot sent mail!`);
      }
    }

    // if (rollbar) {
    //   rollbar.info(`Mail successfully sent.`, { to, subject, retries });
    // } else {
    //   rollbar.error(`MAIL CANNOT BE SENT!`, lastError, { to, subject, retries });
    // }

    return lastRes;
  };
}
