import React, { useCallback, useEffect, useMemo, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { FieldGroup } from '#/src/components/FieldGroup';
import { CheckboxGroup, Typography } from '#/src/components/virkailija';
import getKoodiNimiTranslation from '#/src/utils/getKoodiNimiTranslation';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import { getLanguageValue } from '#/src/utils/languageUtils';

type Osaamisala = { nimi: TranslatedField<string>; uri: string };

type UseSplitOptionsProps = {
  osaamisalat: Array<Osaamisala>;
  allSeenValues: Array<string>;
  language: LanguageCode;
  osaamisalatKoodistoData: Array<Koodi>;
};

const useSplitOptions = ({
  osaamisalat,
  allSeenValues,
  language,
  osaamisalatKoodistoData,
}: UseSplitOptionsProps) => {
  const validOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: getLanguageValue(nimi, language),
        value: uri,
      })),
    [osaamisalat, language]
  );

  const invalidOptions = useMemo(
    () =>
      _.difference(
        allSeenValues.map(koodiUriWithoutVersion),
        osaamisalat.map(({ uri }) => koodiUriWithoutVersion(uri))
      ).map(koodiUri => {
        const foundKoodi = _.find(
          osaamisalatKoodistoData,
          koodi =>
            koodiUriWithoutVersion(koodi.koodiUri) ===
            koodiUriWithoutVersion(koodiUri)
        );

        return {
          label: foundKoodi
            ? getKoodiNimiTranslation(foundKoodi, language)
            : koodiUri,
          value: koodiUri,
        };
      }),
    [allSeenValues, osaamisalat, osaamisalatKoodistoData, language]
  );

  return useMemo(
    () => ({
      validOptions: _.sortBy(validOptions, 'label'),
      invalidOptions: _.sortBy(invalidOptions, 'label'),
    }),
    [validOptions, invalidOptions]
  );
};

const useSplitValues = ({ osaamisalat, value }) =>
  useMemo(() => {
    const validValues: Array<string> = [];
    const invalidValues: Array<string> = [];

    value?.forEach(v => {
      if (
        _.find(
          osaamisalat,
          ({ uri }) => koodiUriWithoutVersion(uri) === koodiUriWithoutVersion(v)
        )
      ) {
        validValues.push(v);
      } else {
        invalidValues.push(v);
      }
    });

    return {
      validValues,
      invalidValues,
    };
  }, [osaamisalat, value]);

type OsaamisalatInputProps = {
  value: Array<string>;
  onChange?: (val: Array<string>) => void;
  ePeruste: { osaamisalat: Array<Osaamisala>; nimi: string };
  language: LanguageCode;
  disabled?: boolean;
  error?: boolean;
  osaamisalatKoodistoData: Array<Koodi>;
};

const EMTPY_ARRAY = [];

export const OsaamisalatInput = ({
  value = EMTPY_ARRAY,
  error = false,
  disabled = false,
  language,
  ePeruste,
  osaamisalatKoodistoData = [],
  onChange = _.noop,
}: OsaamisalatInputProps) => {
  const { t } = useTranslation();

  const { osaamisalat = [], nimi: ePerusteNimi } = ePeruste;

  console.log({ value });
  const [allSeenValues, setAllSeenValues] = useState(() => value);
  console.log({ allSeenValues });

  useEffect(() => {
    setAllSeenValues(allVals => _.uniq([...allVals, ...value]));
  }, [value]);

  const { validOptions, invalidOptions } = useSplitOptions({
    osaamisalat,
    allSeenValues,
    language,
    osaamisalatKoodistoData,
  });

  const { validValues, invalidValues } = useSplitValues({ osaamisalat, value });

  const validChangeHandler = useCallback(
    newValue => {
      onChange([...invalidValues, ...(newValue ?? [])].sort());
    },
    [onChange, invalidValues]
  );

  const invalidChangeHandler = useCallback(
    newValue => {
      onChange([...validValues, ...(newValue ?? [])].sort());
    },
    [onChange, validValues]
  );

  return (
    <>
      {validOptions?.length > 0 && (
        <FieldGroup title={t('toteutuslomake.valitseOsaamisalat')}>
          <Typography style={{ display: 'block', marginBottom: '8px' }}>
            {getLanguageValue(ePerusteNimi, language)}
          </Typography>
          <CheckboxGroup
            options={validOptions}
            value={validValues}
            onChange={validChangeHandler}
            disabled={disabled}
            error={error}
          />
        </FieldGroup>
      )}
      {invalidOptions?.length > 0 && (
        <FieldGroup title={t('toteutuslomake.virheellinenOsaamisalaValinta')}>
          <CheckboxGroup
            options={invalidOptions}
            error={true}
            value={invalidValues}
            onChange={invalidChangeHandler}
            disabled={disabled}
          />
        </FieldGroup>
      )}
    </>
  );
};
