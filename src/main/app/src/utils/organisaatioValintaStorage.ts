import _ from 'lodash';

// Valitun organisaation ja organisaatiosuosikkien tallennus localStorageen. Avaimet ovat
// kouta-etuliitteisiä, koska virkailija-origin on yhteinen usealle sovellukselle.
//
// migrateLegacyStorage lukee redux-persistin jättämät persist:-avaimet kerran
// käynnistyksessä ja kirjoittaa arvot uusiin avaimiin. Vanhoja avaimia ei poisteta, jotta
// julkaisun peruminen löytää datansa; vanhan muodon luvun poisto on erillinen jatkotyö.
//
// Ei välilehtien välistä synkkaa: viimeinen kirjoitus voittaa uudelleenlatauksessa.

export const ORGANISAATIO_OID_KEY = 'kouta.organisaatioOid';
export const ORGANISAATIO_FAVOURITES_KEY = 'kouta.organisaatioFavourites';

const LEGACY_SELECTION_KEY = 'persist:organisaatioSelection';
const LEGACY_FAVOURITES_KEY = 'persist:organisaatioFavourites';

// localStorage-property itsessään voi heittää (Safarin private mode, estetty tallennus),
// ei vain setItem, siksi koko käsittely on try/catchin sisällä.
const getItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setItem = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Tallennuksen epäonnistuminen ei saa kaataa sovellusta; arvo elää muistissa.
  }
};

// undefined tarkoittaa "ei kelvollista arvoa": avain puuttuu tai sisältö ei ole JSONia.
const parseJson = (raw: string | null): unknown => {
  if (raw === null) {
    return undefined;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

// Tyhjä merkkijono tarkoittaa "ei valintaa".
const isOid = (value: unknown): value is string =>
  _.isString(value) && value.length > 0;

const parseOids = (value: unknown): Array<string> =>
  Array.isArray(value) ? _.uniq(value.filter(isOid)) : [];

export const loadOrganisaatioOid = (): string | null => {
  const value = parseJson(getItem(ORGANISAATIO_OID_KEY));
  return isOid(value) ? value : null;
};

export const saveOrganisaatioOid = (oid: string) =>
  setItem(ORGANISAATIO_OID_KEY, oid);

export const loadOrganisaatioFavourites = (): Array<string> =>
  parseOids(parseJson(getItem(ORGANISAATIO_FAVOURITES_KEY)));

export const saveOrganisaatioFavourites = (oids: Array<string>) =>
  setItem(ORGANISAATIO_FAVOURITES_KEY, oids);

// redux-persistin muoto: ulompi olio, jonka jokainen kenttä on erikseen JSON-koodattu
// merkkijono, esim. {"oid":"\"1.2.3\"","_persist":"{...}"}.
const readLegacyField = (key: string, field: string): unknown => {
  const outer = parseJson(getItem(key));
  if (!_.isPlainObject(outer)) {
    return undefined;
  }
  const inner = (outer as Record<string, unknown>)[field];
  return _.isString(inner) ? parseJson(inner) : undefined;
};

// Kirjoittaa vanhan muodon arvot uusiin avaimiin, jos uutta avainta ei vielä ole.
// Kutsutaan kerran ennen renderöintiä (index.tsx), jotta load-funktiot pysyvät
// puhtaina lukuina.
export const migrateLegacyStorage = () => {
  if (getItem(ORGANISAATIO_OID_KEY) === null) {
    const oid = readLegacyField(LEGACY_SELECTION_KEY, 'oid');
    if (isOid(oid)) {
      saveOrganisaatioOid(oid);
    }
  }

  if (getItem(ORGANISAATIO_FAVOURITES_KEY) === null) {
    const byOid = readLegacyField(LEGACY_FAVOURITES_KEY, 'byOid');
    if (_.isPlainObject(byOid)) {
      const map = byOid as Record<string, unknown>;
      // Näyttöjärjestys oli avainten lisäysjärjestys. Oidit sisältävät pisteitä, joten ne
      // eivät ole kokonaislukuavaimia eikä JS järjestä niitä uudelleen.
      saveOrganisaatioFavourites(
        Object.keys(map).filter(oid => isOid(oid) && Boolean(map[oid]))
      );
    }
  }
};
