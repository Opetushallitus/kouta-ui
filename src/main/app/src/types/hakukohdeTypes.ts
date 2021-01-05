import {
  Ajankohtatyyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { EditorState } from '#/src/components/Editor/Editor';

export type HakukohdeModel = any;

type ToimitustapaFields = {
  tapa: string;
  paikka: {
    sahkoposti: string;
    osoite: TranslatedField<string>;
    postinumero?: {
      value: string;
    };
  };
};

type ValintakokeetValues = {
  yleisKuvaus: TranslatedField<typeof EditorState>;
  kokeetTaiLisanaytot: Array<{
    id: string;
    tyyppi: { value: string };
    nimi: TranslatedField<string>;
    liittyyEnnakkovalmistautumista: Boolean;
    ohjeetEnnakkovalmistautumiseen: TranslatedField<string>;
    erityisjarjestelytMahdollisia: Boolean;
    ohjeetErityisjarjestelyihin: TranslatedField<string>;
    tietoaHakijalle: TranslatedField<string>;
    tilaisuudet: Array<{
      osoite: TranslatedField<string>;
      postinumero: { value: string };
      alkaa: string;
      paattyy: string;
      lisatietoja: TranslatedField<typeof EditorState>;
      jarjestamispaikka: TranslatedField<string>;
    }>;
  }>;
};

export type HakukohdeFormValues = {
  koulutustyyppi?: KOULUTUSTYYPPI;
  tila: JULKAISUTILA;
  muokkaaja?: string;
  kieliversiot: Array<LanguageCode>;
  alkamiskausi: {
    eriAlkamiskausi: Boolean;
    kausi: string;
    vuosi?: {
      value: string;
    };
  };
  ajankohta: {
    eriAlkamiskausi: Boolean;
    ajankohtaTyyppi: Ajankohtatyyppi;
    kausi?: string;
    vuosi?: SelectOption;
    tiedossaTarkkaAjankohta?: boolean;
    tarkkaAlkaa?: string;
    tarkkaPaattyy?: string;
    henkilokohtaisenSuunnitelmanLisatiedot?: TranslatedField<
      typeof EditorState
    >;
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
    tarkenne: TranslatedField<typeof EditorState>;
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
      kuvaus: TranslatedField<string>;
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
