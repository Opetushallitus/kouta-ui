import { useEffect, useState } from 'react';

import _ from 'lodash';
import { usePrevious } from 'react-use';

import {
  useBoundFormActions,
  useIsDirty,
  useFieldValue,
  useSelectedLanguages,
} from '#/src/hooks/form';
import useKoodi from '#/src/hooks/useKoodi';

function koulutusOrLanguageHasChanged(
  nimiFieldName,
  koulutusChanged: boolean,
  languagesChanged: boolean,
  koulutusKoodi
) {
  return (
    nimiFieldName && (koulutusChanged || languagesChanged) && koulutusKoodi
  );
}

function getNimiFromKoodistoResponse(
  languages: Array<any>,
  koulutusKoodi,
  koulutusChanged: boolean,
  nimiFieldValue
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

  return newNimiFieldValue;
}

function getKoulutusFromArray(koulutusValue) {
  // Jos enemmän kuin yksi koulutusKoodi valittuna, pitää käyttäjän syöttää itse koulutuksen nimi
  return koulutusValue.length > 1 ? null : koulutusValue[0]?.value;
}

function getKoulutusValue(koulutusValue) {
  return Array.isArray(koulutusValue)
    ? getKoulutusFromArray(koulutusValue)
    : koulutusValue?.value;
}

export const useNimiFromKoulutusKoodi = ({
  koulutusFieldName,
  nimiFieldName,
}) => {
  const languages = useSelectedLanguages();
  const koulutusValue = getKoulutusValue(useFieldValue(koulutusFieldName));
  const koulutusKoodi = useKoodi(koulutusValue)?.koodi;
  const nimiFieldValue = useFieldValue(nimiFieldName);
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  const [koulutusChanged, setKoulutusChanged] = useState(false);
  const [languagesChanged, setLanguagesChanged] = useState(false);
  const previousKoulutus = usePrevious(koulutusValue);
  const previousLanguages = usePrevious(languages);

  // Set flags to indicate if koulutus or languages have potential changes that may trigger
  // copying of koulutus-field value to nimi field.
  useEffect(() => {
    if (isDirty && previousKoulutus !== koulutusValue) {
      setKoulutusChanged(true);
    }
  }, [previousKoulutus, koulutusValue, isDirty]);

  useEffect(() => {
    if (isDirty && previousLanguages !== languages) {
      setLanguagesChanged(true);
    }
  }, [previousLanguages, languages, isDirty]);

  // When koulutus field value has changed to a defined value (koodi exists) or selected languages (kielivalinta) has changed
  // change the language versioned nimi fields accordingly
  useEffect(() => {
    if (
      koulutusOrLanguageHasChanged(
        nimiFieldName,
        koulutusChanged,
        languagesChanged,
        koulutusKoodi
      )
    ) {
      const newNimiFieldValue = getNimiFromKoodistoResponse(
        languages,
        koulutusKoodi,
        koulutusChanged,
        nimiFieldValue
      );
      setKoulutusChanged(false);
      setLanguagesChanged(false);
      change(nimiFieldName, newNimiFieldValue);
    }
  }, [
    change,
    nimiFieldName,
    koulutusKoodi,
    languages,
    languagesChanged,
    koulutusChanged,
    nimiFieldValue,
  ]);
};
