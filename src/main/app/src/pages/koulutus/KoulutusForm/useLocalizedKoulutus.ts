import { useEffect, useState } from 'react';

import _fp from 'lodash/fp';

import {
  useBoundFormActions,
  useIsDirty,
  useFieldValue,
  useSelectedLanguages,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import useKoodi from '#/src/hooks/useKoodi';

export const useLocalizedKoulutus = ({
  koulutusFieldName,
  nimiFieldName,
  language,
}) => {
  const languages = useSelectedLanguages();
  const koulutusValue = useFieldValue(koulutusFieldName)?.value;
  const koulutusKoodi = useKoodi(koulutusValue);
  const koodi = koulutusKoodi?.koodi;
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = _fp.find(
        ({ kieli }) => _fp.toLower(kieli) === language,
        metadata
      )?.nimi;

      if (localizedNimi) {
        change(`${koulutusFieldName}.label`, localizedNimi);
      }
    }
  }, [language, koodi, koulutusFieldName, isDirty, change]);

  const koulutusHasChanged = useHasChanged(koulutusValue);
  const [nimiShouldUpdate, setNimiShouldUpdate] = useState(false);

  useEffect(() => {
    if (koulutusHasChanged) {
      setNimiShouldUpdate(true);
    }
  }, [koulutusHasChanged]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)

  useEffect(() => {
    if (nimiFieldName && nimiShouldUpdate && isDirty && koodi) {
      const newNimiFieldValue = {};
      _fp.each(({ kieli, nimi }) => {
        const lang = _fp.toLower(kieli);
        if (languages.includes(lang)) {
          newNimiFieldValue[lang] = nimi;
        }
      }, koodi?.metadata);
      change(nimiFieldName, newNimiFieldValue);
      setNimiShouldUpdate(false);
    }
  }, [
    change,
    nimiFieldName,
    koodi,
    language,
    isDirty,
    languages,
    nimiShouldUpdate,
  ]);
};
