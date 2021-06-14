import { Config } from '../src/config/config';

export function storDir(): string {
  return Config.STOR_DIRECTORY.replace('__dirname', __dirname);
}

export function assetsDir(): string {
  return Config.ASSETS_DIRECTORY.replace('__dirname', __dirname);
}
