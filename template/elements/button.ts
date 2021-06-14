/* tslint:disable:max-line-length */
export function buttonEmailElement(
  content: string,
  href: string,
  textColor = '#ffffff',
): string {
  return `<div style="margin: 40px 0 20px 0; text-align: center;">
<a href="${href}" style="background-color: #7a4d99; color: ${textColor}; padding: 15px; border-radius: 5px; text-decoration: none; font-weight: bold; text-align: center;">${content}</a>
</div>`;
}
