import { EditorState } from 'lexical';

import {
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';

import { AjankohtaFields, ValintakokeetValues } from './formTypes';

type ToimitustapaFields = {
  tapa: string;
  paikka: {
    sahkoposti: TranslatedField<string>;
    osoite: {
      rivi1: TranslatedField<string>;
      rivi2: TranslatedField<string>;
    };
    postinumero?: {
      value: string;
    };
    verkkosivu: string;
  };
};

export type HakukohdeFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  uudenOpiskelijanUrl?: TranslatedField<string>;
  koulutustyyppi?: KOULUTUSTYYPPI;
  tila: JULKAISUTILA;
  esikatselu?: boolean;
  muokkaaja?: string;
  kieliversiot: Array<LanguageCode>;
  ajankohta: AjankohtaFields & {
    kaytetaanHakukohteenAlkamiskautta: boolean;
  };
  aloituspaikat: {
    aloituspaikkamaara: string;
    ensikertalaismaara: string;
    aloituspaikkakuvaus: TranslatedField<EditorState>;
  };
  hakuajat: {
    eriHakuaika: boolean;
    hakuajat: Array<{
      alkaa: string;
      paattyy: string;
    }>;
  };
  perustiedot: {
    nimi: TranslatedField<string>;
    hakukohdeKoodiUri?: SelectOption;
    voiSuorittaaKaksoistutkinnon: boolean;
  };
  pohjakoulutus: {
    pohjakoulutusvaatimus: Array<{ value: string }>;
    tarkenne: TranslatedField<EditorState>;
  };
  valintaperusteenKuvaus: {
    valintaperuste?: { value: string };
    kynnysehto?: TranslatedField<EditorState>;
  };
  valintakokeet: ValintakokeetValues;
  jarjestyspaikkaOid: string;
  jarjestaaUrheilijanAmmKoulutusta: boolean;
  liitteet: {
    toimitustapa: ToimitustapaFields;
    yhteinenToimituspaikka: boolean;
    yhteinenToimitusaika: boolean;
    toimitusaika: string;
    liitteet: Array<{
      tyyppi: { value: string };
      nimi: TranslatedField<string>;
      kuvaus: TranslatedField<EditorState>;
      toimitusaika: string;
      toimitustapa: ToimitustapaFields;
    }>;
  };
  hakulomake: {
    tyyppi: HAKULOMAKETYYPPI;
    lomake?: { value?: string };
    linkki?: TranslatedField<string>;
    kuvaus?: TranslatedField<string>;
    eriHakulomake: boolean;
  };
  hakukohteenLinja?: {
    linja?: string; // NOTE: tyhjä on sama asia kuin yleislinja
    alinHyvaksyttyKeskiarvo: string;
    lisatietoa: TranslatedField<EditorState>;
    painotetutArvosanat: Array<{
      painotettuOppiaine: {
        value: string;
        label?: string;
      };
      painokerroin: string;
    }>;
  };
};
