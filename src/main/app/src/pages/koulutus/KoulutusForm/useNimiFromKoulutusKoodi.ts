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

  // Set flags to indicate if koulutus or languages have potential changes that may trigger
  // copying of koulutus-field value to nimi field.
  useEffect(() => {
    if (isDirty) {
      setKoulutusChanged(true);
    }
  }, [koulutusValue]);

  useEffect(() => {
    if (isDirty) {
      setLanguagesChanged(true);
    }
  }, [languages]);

  // When koulutus field value has changed to a defined value (koodi exists) or selected languages (kielivalinta) has changed
  // change the language versioned nimi fields accordingly
  useEffect(() => {
    if (
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
        // Only overwrite existing nimi values when koulutus-field changes.
        // When selected languages change, set only language versioned nimi fields that are empty.
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
