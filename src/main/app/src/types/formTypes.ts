import { EditorState } from 'draft-js';
import { Alkamiskausityyppi } from '#/src/constants';

export type AjankohtaFields = {
  ajankohtaTyyppi: Alkamiskausityyppi;
  kausi?: string;
  vuosi?: SelectOption;
  tarkkaAlkaa?: string;
  tarkkaPaattyy?: string;
  henkilokohtaisenSuunnitelmanLisatiedot?: TranslatedField<EditorState>;
};
