import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { AjankohtaFields } from '#/src/types/formTypes';
import { maybeParseNumber, toSelectValue } from '#/src/utils';

import { pickTranslationsForEditorField } from '../pickTranslations';

export const getAlkamiskausiData = (
  ajankohta: AjankohtaFields,
  kielivalinta: Array<LanguageCode>
) =>
  ajankohta?.ajankohtaTyyppi
    ? {
        alkamiskausityyppi: ajankohta?.ajankohtaTyyppi || null,
        koulutuksenAlkamispaivamaara: ajankohta?.tarkkaAlkaa || null,
        koulutuksenPaattymispaivamaara: ajankohta?.tarkkaPaattyy || null,
        koulutuksenAlkamiskausiKoodiUri: ajankohta?.kausi || null,
        koulutuksenAlkamisvuosi: maybeParseNumber(ajankohta?.vuosi?.value),
        henkilokohtaisenSuunnitelmanLisatiedot: pickTranslationsForEditorField(
          ajankohta?.henkilokohtaisenSuunnitelmanLisatiedot,
          kielivalinta
        ),
      }
    : null;

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
    ajankohtaKaytossa: Boolean(alkamiskausityyppi),
  };
};
