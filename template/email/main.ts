import { headerEmailElement } from '../elements/header';
import { Config } from '../../src/config/config';

export function mainEmailLayout(
  subtitle: string,
  alreadyStripedHtml: string,
): string {
  return `<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${subtitle} - Shooter</title>
</head>
<body style="color: #e3454b; text-align: center;">

  <div style="background-color: #fff;">
  <div style="height: 100px; text-align: center; margin-bottom: 20px">
    <img src="${
      Config.API_URL
    }assets/logo" style="margin-top:25px; height: 75px;" alt="shooter-logo">
  </div>
  <div style="border: 1px solid #ebebeb; border-radius: 5px overflow: hidden; margin-top: 20px; color: #000; text-align: center; max-width: 700px; margin-left: auto; margin-right: auto; background-color: #fff;">
    ${headerEmailElement(subtitle, 1)}
    <div style="padding: 20px; color: #000;">
  ${alreadyStripedHtml}
  </div>
  </div>
     <div style="padding: 15px; text-align: center; margin-top: 10px; font-size: 12px; color: #707070;">
     Shooter
  </div>
 
  </div>
</body>
</html>`;
}
