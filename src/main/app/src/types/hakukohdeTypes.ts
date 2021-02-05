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

type ValintakokeetValues = {
  yleisKuvaus: TranslatedField<EditorState>;
  kokeetTaiLisanaytot: Array<{
    id?: string;
    tyyppi: { value: string };
    nimi: TranslatedField<string>;
    liittyyEnnakkovalmistautumista: Boolean;
    ohjeetEnnakkovalmistautumiseen: TranslatedField<EditorState>;
    erityisjarjestelytMahdollisia: Boolean;
    ohjeetErityisjarjestelyihin: TranslatedField<EditorState>;
    tietoaHakijalle: TranslatedField<EditorState>;
    tilaisuudet: Array<{
      osoite: TranslatedField<string>;
      postinumero: { value: string };
      alkaa: string;
      paattyy: string;
      lisatietoja: TranslatedField<EditorState>;
      jarjestamispaikka: TranslatedField<string>;
    }>;
  }>;
};

export type HakukohdeFormValues = {
  koulutustyyppi?: KOULUTUSTYYPPI;
  tila: JULKAISUTILA;
  muokkaaja?: string;
  kieliversiot: Array<LanguageCode>;
  ajankohta: AjankohtaFields & {
    kaytetaanHakukohteenAlkamiskautta: Boolean;
  };
  aloituspaikat: {
    aloituspaikkamaara: string;
    ensikertalaismaara: string;
  };
  hakuajat: {
    eriHakuaika: Boolean;
    hakuajat: Array<{
      alkaa: string;
      paattyy: string;
    }>;
  };
  perustiedot: {
    nimi: TranslatedField<string>;
    voiSuorittaaKaksoistutkinnon: Boolean;
  };
  pohjakoulutus: {
    pohjakoulutusvaatimus: Array<{ value: string }>;
    tarkenne: TranslatedField<EditorState>;
  };
  valintaperusteenKuvaus?: { value: string };
  valintakokeet: ValintakokeetValues;
  jarjestyspaikkaOid: string;
  liitteet: {
    toimitustapa: ToimitustapaFields;
    yhteinenToimituspaikka: Boolean;
    yhteinenToimitusaika: Boolean;
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
    eriHakulomake: Boolean;
  };
};
