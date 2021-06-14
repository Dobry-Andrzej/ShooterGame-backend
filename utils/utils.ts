import * as crypto from 'crypto';
import { Config } from '../src/config/config';

export const isCronMicroservice = (): boolean => {
  return (
    process &&
    process.env &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV.trim() === 'cron-ms'
  );
};

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac('sha256', Config.P_SALT);

  hmac.update(p);
  return hmac.digest('hex');
};

export const assignKnowFields = <D, R>(
  donor: D,
  recipient: R,
  fields?: string[],
) => {
  let keys: string[];
  if (fields) {
    keys = fields;
  } else {
    keys = Object.getOwnPropertyNames(donor);
  }

  keys.map((key) => {
    if (typeof donor[key] !== 'undefined') {
      recipient[key] = donor[key];
    }
  });
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const generateFourDigitCode = () => {
  const digits = new Array(9).fill(null).map((e, i) => i + 1);
  return new Array(4)
    .fill(null)
    .map(() => digits[~~(Math.random() * digits.length)])
    .join('');
};

export const sliceIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: T[] = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};
