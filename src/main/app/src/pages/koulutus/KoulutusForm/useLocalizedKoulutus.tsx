import { useState, useEffect } from 'react';
import _ from 'lodash';
import useKoodi from '#/src/hooks/useKoodi';
import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';

// How would this work as an xstate machine?
export const useLocalizedKoulutus = ({
  fieldName,
  language,
  koulutusValue,
}) => {
  const [changedKoulutus, setChangedKoulutus] = useState(null);
  const koulutusKoodi = useKoodi(koulutusValue?.value);
  const koodi = koulutusKoodi?.koodi;
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = _.find(
        metadata,
        ({ kieli }) => _.toLower(kieli) === language
      )?.nimi;

      if (localizedNimi) {
        change(`${fieldName}.koulutus.label`, localizedNimi);
      }
    }
  }, [language, koodi, fieldName, isDirty, change]);

  useEffect(() => {
    if (koulutusValue && isDirty) {
      setChangedKoulutus(koulutusValue.value);
    }
  }, [isDirty, koulutusValue, language]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (changedKoulutus && koodi) {
      _.each(koodi?.metadata, ({ kieli, nimi }) => {
        const lang = _.toLower(kieli);
        change(`${fieldName}.nimi.${lang}`, nimi);
      });
      setChangedKoulutus(null);
    }
  }, [change, changedKoulutus, fieldName, koodi, language]);
};
