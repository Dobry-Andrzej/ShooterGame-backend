/* tslint:disable:max-line-length */
export function headerEmailElement(
  textContent: string,
  headerLevel = 2,
): string {
  const fontSize = headerLevel === 1 ? 'font-size: 20px;' : '';

  if (!textContent) return '';
  return `<h${headerLevel} style="background-color: #7a4d99; margin-top: 0px; color: #f5f6fa; padding: 15px; ${fontSize} font-weight: normal; text-align: center;">${textContent}</h${headerLevel}>`;
}
