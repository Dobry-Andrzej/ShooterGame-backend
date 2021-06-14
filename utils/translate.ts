import * as Polyglot from 'node-polyglot';
import * as fs from 'fs';
import * as path from 'path';
import { assetsDir } from './stor-dir';
import { NotFoundException } from '@nestjs/common';
const createPolyglot = (lang: string) => {
  const read = fs.readFileSync(
    path.resolve(`${assetsDir()}translation/${lang}.json`),
    'utf-8',
  );
  return new Polyglot(JSON.parse(read));
};

export enum Language {
  pl = 'pl',
  en = 'en',
}

export const Translate = (lang: string, args?: any) => {
  if (!Language[lang]) {
    throw new NotFoundException(`Language not found!`);
  }
  const polyglotEn: Polyglot = createPolyglot(lang);
  const __ = (text: string, args?: any): string => polyglotEn.t(text, args);
  const myLang = polyglotEn.locale();
  return { __, myLang };
};
export const favouriteLang = async (req: any) => {
  let lang = 'pl';
  const browserLang = req.acceptsLanguages(Object.keys(Language));
  if (req.user) {
    lang = req.user.language;
  } else if (req.cookies && req.cookies.lang) {
    lang = req.cookies.lang;
  } else if (typeof browserLang === 'string') {
    lang = browserLang;
  }
  return lang;
};
