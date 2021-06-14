export const validateNip = (nip: string): boolean => {
  const nipWithoutDashes = nip.replace(/-/g, '');
  const reg = /^[0-9]{10}$/;
  if (reg.test(nipWithoutDashes) === false) {
    return false;
  } else {
    const digits = ('' + nipWithoutDashes).split('');
    const checksum =
      (6 * Number(digits[0]) +
        5 * Number(digits[1]) +
        7 * Number(digits[2]) +
        2 * Number(digits[3]) +
        3 * Number(digits[4]) +
        4 * Number(digits[5]) +
        5 * Number(digits[6]) +
        6 * Number(digits[7]) +
        7 * Number(digits[8])) %
      11;

    return Number(digits[9]) === checksum;
  }
};

export const isValidUrl = (s: string): boolean => {
  return s.trim().match(/^https?:\/\//) !== null;
};

export const isValidFourDigit = (s: string): boolean => {
  return s.trim().match(/^[0-9]{4}$/) !== null;
};

export const isPostCode = (s: string): boolean => {
  return s.trim().match(/^\d{2}-\d{3}$/) !== null;
};

export const isName = (s: string): boolean => {
  return s.trim().match(/^[A-ĆŚŁŻ][a-ząęóżźćńłś]+$/) !== null;
};

export const isCityOrLastName = (s: string): boolean => {
  return (
    s
      .trim()
      .match(/^[a-ząęóżźćńłśA-ZĆŚŁŻ]+(?:[\s-][a-ząęóżźćńłśA-ZĆŚŁŻ]+)*$/) !==
    null
  );
};

export const isValidDigit = (s: string): boolean => {
  return s.trim().match(/^[1-9][0-9]*$/) !== null;
};
