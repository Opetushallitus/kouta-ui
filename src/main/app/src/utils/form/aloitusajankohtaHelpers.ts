import _fp from 'lodash/fp';
import {
  parseEditorState,
  serializeEditorState,
} from '#/src/components/Editor/utils';
import { maybeParseNumber, toSelectValue } from '#/src/utils';
import { AjankohtaFields } from '#/src/types/formTypes';

export const getAlkamiskausiData = (
  ajankohta: AjankohtaFields,
  pickTranslations
) => ({
  alkamiskausityyppi: ajankohta?.ajankohtaTyyppi || null,
  koulutuksenAlkamispaivamaara: ajankohta?.tarkkaAlkaa || null,
  koulutuksenPaattymispaivamaara: ajankohta?.tarkkaPaattyy || null,
  koulutuksenAlkamiskausiKoodiUri: ajankohta?.kausi || null,
  koulutuksenAlkamisvuosi: maybeParseNumber(ajankohta?.vuosi?.value),
  henkilokohtaisenSuunnitelmanLisatiedot: _fp.compose(
    _fp.mapValues(serializeEditorState),
    pickTranslations
  )(ajankohta?.henkilokohtaisenSuunnitelmanLisatiedot ?? {}),
});

export const getAjankohtaFields = (
  alkamiskausiData: any = {}
): AjankohtaFields => {
  const {
    alkamiskausityyppi,
    koulutuksenAlkamiskausiKoodiUri = null,
    koulutuksenAlkamispaivamaara = null,
    koulutuksenPaattymispaivamaara = null,
    koulutuksenAlkamisvuosi = '',
    henkilokohtaisenSuunnitelmanLisatiedot,
  } = alkamiskausiData;

  return {
    ajankohtaTyyppi: alkamiskausityyppi,
    kausi: koulutuksenAlkamiskausiKoodiUri,
    vuosi: toSelectValue(koulutuksenAlkamisvuosi),
    tarkkaAlkaa: koulutuksenAlkamispaivamaara,
    tarkkaPaattyy: koulutuksenPaattymispaivamaara,
    henkilokohtaisenSuunnitelmanLisatiedot: _fp.mapValues(parseEditorState)(
      henkilokohtaisenSuunnitelmanLisatiedot
    ),
  };
};
