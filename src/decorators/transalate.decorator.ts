import { createParamDecorator } from '@nestjs/common';
import { favouriteLang, Translate } from '../../utils/translate';
export const TransFn = createParamDecorator(async (data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const lang = await favouriteLang(req);
  const { __ } = Translate(lang);
  return __;
});
export const TransLang = createParamDecorator(async (data, req) => {
  const lang = await favouriteLang(req);
  const { myLang } = Translate(lang);
  return myLang;
});
