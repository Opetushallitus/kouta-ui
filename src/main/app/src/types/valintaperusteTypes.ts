import { EditorState } from 'lexical';

import { JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';

import { SisaltoValues, ValintakokeetValues } from './formTypes';

export type Valintatapa = {
  nimi?: TranslatedField;
  sisalto?: SisaltoValues;
  valintatapaKoodiUri?: string;
  kynnysehto?: TranslatedField<EditorState>;
  enimmaispistemaara?: string;
  vahimmaispistemaara?: string;
};

export type ValintaperusteFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  tila?: JULKAISUTILA;
  perustiedot: {
    tyyppi?: KOULUTUSTYYPPI;
    hakutapa?: string | null;
    kieliversiot: Array<LanguageCode>;
    kohdejoukko?: SelectOption | null;
  };
  muokkaaja?: string;
  esikatselu?: boolean;
  esitysnimi?: string;
  julkinen: boolean;
  valintakokeet: ValintakokeetValues;
  kuvaus?: {
    nimi: TranslatedField<string>;
    kuvaus: TranslatedField<EditorState>;
    sisalto: SisaltoValues;
  };
  hakukelpoisuus: TranslatedField<EditorState>;
  lisatiedot: TranslatedField<EditorState>;
  valintatavat: Array<Valintatapa>;
};
