import { useEffect, useState } from 'react';

import _ from 'lodash';

import {
  useBoundFormActions,
  useIsDirty,
  useFieldValue,
  useSelectedLanguages,
} from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';

export const useNimiFromKoulutusKoodi = ({
  koulutusFieldName,
  nimiFieldName,
}) => {
  const languages = useSelectedLanguages();
  const koulutusValue = useFieldValue(koulutusFieldName)?.value;
  const nimiFieldValue = useFieldValue(nimiFieldName);
  const koulutusKoodi = useKoodi(koulutusValue)?.koodi;
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  const [koulutusChanged, setKoulutusChanged] = useState(false);
  const [languagesChanged, setLanguagesChanged] = useState(false);

  useEffect(() => {
    if (koulutusValue) {
      setKoulutusChanged(true);
    }
  }, [koulutusValue]);

  useEffect(() => {
    if (languages) {
      setLanguagesChanged(true);
    }
  }, [languages]);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (
      isDirty &&
      nimiFieldName &&
      (koulutusChanged || languagesChanged) &&
      koulutusKoodi
    ) {
      const newNimiFieldValue = {};
      languages?.forEach(lang => {
        const koodiNimi = _.find(
          koulutusKoodi?.metadata,
          ({ kieli }) => _.toLower(kieli) === lang
        )?.nimi;
        if (
          koulutusChanged ||
          (!koulutusChanged && _.isEmpty(nimiFieldValue[lang]))
        ) {
          newNimiFieldValue[lang] = koodiNimi;
        } else {
          newNimiFieldValue[lang] = nimiFieldValue[lang];
        }
      });
      setKoulutusChanged(false);
      setLanguagesChanged(false);
      change(nimiFieldName, newNimiFieldValue);
    }
  }, [
    change,
    nimiFieldName,
    koulutusKoodi,
    isDirty,
    languages,
    languagesChanged,
    koulutusChanged,
    nimiFieldValue,
  ]);
};
