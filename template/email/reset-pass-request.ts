import { mainEmailLayout } from './main';
import { buttonEmailElement } from '../elements/button';
import {Config} from "../../src/config/config";

export function resetPassRequestLayout(
    name: string,
    userId: number,
    updateToken: string,
    __: (text: string, args?: any) => string,
): string {
    return mainEmailLayout(
        `${__('reset_pass_request')}`,
        `
<div style="text-align: left;">
<p>${__('dear')} ${name},</p>
<p>
${__('we_have_received_a_request_to_reset_your_password_in')} Wykaż-Się
</p>
<p>
${__('if_you_did_not_send_such_a_request_please_ignore_it')}:
</p>
<p>
${__(
'if_you_receive_similar_messages_from_us',
)}
</p>
<p>
${__(
'if_you_really_want_to_reset_you_pass_you_have_24_h_for_it',
)}
</p>
${buttonEmailElement(
    __('reset_password'),
    Config.URL + 'auth/restore-pass' + '/' + userId + '/' + updateToken,
)}
<p>
${__('best_regards')}
</p>
<p>
${__('team')} Shooter
</p>
</div>
`);
}
