import { HandlebarsAdapter } from '@nest-modules/mailer';
import {Config} from './src/config/config';

/* tslint:disable:max-line-length */
export = {
  transport: `smtp${Config.EMAIL_IS_SECURE ? 's' : ''}://${Config.EMAIL_USER}:${Config.EMAIL_PASS}@${Config.EMAIL_HOST}/?secure=${Config.EMAIL_IS_SECURE}&ignoreTLS=${!Config.EMAIL_IS_SECURE}&pool=${Config.EMAIL_HOST_USE_POOLING}`,
  defaults: {
    from: Config.EMAIL_FROM,
  },
  template: {
    dir: './template/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
