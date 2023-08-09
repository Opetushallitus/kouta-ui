import { TFunction } from 'i18next';
import { EditorState } from 'lexical';
import { ValueType } from 'react-select';

import { TableInputRows } from '#/src/components/TableInput/utils';
import { Alkamiskausityyppi } from '#/src/constants';

export type SelectValue = ValueType<{ label: string; value: string }, false>;

export type AjankohtaFields = {
  ajankohtaTyyppi: Alkamiskausityyppi;
  kausi?: string;
  vuosi?: SelectOption;
  tarkkaAlkaa?: string;
  tarkkaPaattyy?: string;
  henkilokohtaisenSuunnitelmanLisatiedot?: TranslatedField<EditorState>;
  ajankohtaKaytossa?: boolean;
};

export type FormError = {
  field: string;
  errorKey: string | ((t: TFunction) => string) | null;
};

type KoutaErrorResponse = { errorType: string; msg: string; path: string };

export type RemoteErrorsToFormErrors = (
  response: KoutaErrorResponse
) => FormError | Array<FormError> | void;

export type Tilaisuus = {
  osoite?: TranslatedField<string>;
  postinumero?: { value: string };
  alkaa?: string;
  paattyy?: string;
  lisatietoja?: TranslatedField<EditorState>;
  jarjestamispaikka?: TranslatedField<string>;
};

export type ValintakokeetValues = {
  yleisKuvaus: TranslatedField<EditorState>;
  valintaperusteenValintakokeidenLisatilaisuudet?: Record<
    string,
    Array<Tilaisuus>
  >;
  kokeetTaiLisanaytot: Array<{
    id?: string;
    tyyppi?: { value: string };
    nimi?: TranslatedField<string>;
    liittyyEnnakkovalmistautumista?: boolean;
    ohjeetEnnakkovalmistautumiseen?: TranslatedField<EditorState>;
    erityisjarjestelytMahdollisia?: boolean;
    ohjeetErityisjarjestelyihin?: TranslatedField<EditorState>;
    tietoaHakijalle?: TranslatedField<EditorState>;
    tilaisuudet?: Array<Tilaisuus>;
    vahimmaispistemaara?: string;
  }>;
};

export type SisaltoTaulukkoValue = {
  tyyppi: 'taulukko';
  data?: {
    id: string;
    nimi: TranslatedField;
    rows: TableInputRows;
  };
};

export type SisaltoTekstiValue = {
  tyyppi: 'teksti';
  data?: TranslatedField<EditorState>;
};

export type SisaltoValues = Array<SisaltoTekstiValue | SisaltoTaulukkoValue>;

export type KieliversiotValues = Array<LanguageCode>;
