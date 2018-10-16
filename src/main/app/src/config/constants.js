export const ENV_MOCK = 'ENV_MOCK';
export const ENV_DEV = 'ENV_DEV';
export const LANGUAGE = 'FI';

export const SERVICE_DOMAINS =  {
  [ENV_DEV]: "https://virkailija.hahtuvaopintopolku.fi",
  [ENV_MOCK]: "http://localhost:3001"
};

export const JULKAISUTILA = {
  TALLENNETTU: 'tallennettu',
  JULKAISTU: 'julkaistu'
};

export const REQUEST_STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  DISABLED: 'disabled',
  ENABLED: 'enabled'
}
