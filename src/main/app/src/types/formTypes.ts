import { EditorState } from 'draft-js';
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
