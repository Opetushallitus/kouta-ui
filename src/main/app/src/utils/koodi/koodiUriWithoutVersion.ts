export const koodiUriWithoutVersion = koodiUri =>
  koodiUri?.slice(0, koodiUri.lastIndexOf('#'));
