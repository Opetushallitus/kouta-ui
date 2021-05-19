import { EditorState } from 'draft-js';
import { TFunction } from 'i18next';
import { ValueType } from 'react-select';

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
  errorKey: string | ((t: TFunction) => string);
};

type KoutaErrorResponse = { errorType: string; msg: string; path: string };

export type RemoteErrorsToFormErrors = (
  response: KoutaErrorResponse
) => FormError | Array<FormError> | void;
