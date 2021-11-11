import { EditorState } from '#/src/components/Editor/Editor';
import {
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';

import { AjankohtaFields } from './formTypes';

export type HakukohdeModel = any;

type ToimitustapaFields = {
  tapa: string;
  paikka: {
    sahkoposti: TranslatedField<string>;
    osoite: TranslatedField<string>;
    postinumero?: {
      value: string;
    };
  };
};

type Tilaisuus = {
  osoite: TranslatedField<string>;
  postinumero: { value: string };
  alkaa: string;
  paattyy: string;
  lisatietoja: TranslatedField<EditorState>;
  jarjestamispaikka: TranslatedField<string>;
};

type ValintakokeetValues = {
  yleisKuvaus: TranslatedField<EditorState>;
  valintaperusteenValintakokeidenLisatilaisuudet: Record<
    string,
    Array<Tilaisuus>
  >;
  kokeetTaiLisanaytot: Array<{
    id?: string;
    tyyppi: { value: string };
    nimi: TranslatedField<string>;
    liittyyEnnakkovalmistautumista: boolean;
    ohjeetEnnakkovalmistautumiseen: TranslatedField<EditorState>;
    erityisjarjestelytMahdollisia: boolean;
    ohjeetErityisjarjestelyihin: TranslatedField<EditorState>;
    tietoaHakijalle: TranslatedField<EditorState>;
    tilaisuudet: Array<Tilaisuus>;
    vahimmaispistemaara: string;
  }>;
};

export type HakukohdeFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  uudenOpiskelijanUrl?: string;
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
