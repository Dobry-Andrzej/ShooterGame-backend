import { mainEmailLayout } from './main';
import { buttonEmailElement } from '../elements/button';
import {Config} from "../../src/config/config";

export function addedFirstSettingPassLayout(
  name: string,
  userId: number,
  updateToken: string,
  __: (text: string, args?: any) => string,
): string {
  return mainEmailLayout(
    `${__('added_as_moderator')}`,
    `
<div style="text-align: left;">
<p>${__('dear')} ${name},</p>
<p>
${__('you_have_been_added')} Shooter
</p>
<p>
${__('click_the_link_below_to_set_password')}:
</p>
${buttonEmailElement(
  __('set_password'),
        Config.URL + 'auth/set-password' + '/' + userId + '/' + updateToken,
)}
<p>
${__('more_details_on')}: <a href='www.shooter.pl'>www.shooter.pl</a>
</p>
<p>
${__(`if_you_dont_know_this_application_ignore_this_message`)}
</p>
<p>
${__('best_regards')}
</p>
<p>
${__('team')} Shooter
</p>
</div>
`);
}
