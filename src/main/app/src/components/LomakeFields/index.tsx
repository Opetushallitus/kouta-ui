import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import { isFunction } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldRadioGroup,
  FormFieldTextarea,
} from '#/src/components/formFields';

import { HAKULOMAKETYYPPI } from '#/src/constants';
import Spacing from '#/src/components/Spacing';
import useLanguage from '#/src/hooks/useLanguage';
import Flex, { FlexItem } from '#/src/components/Flex';
import Button from '#/src/components/Button';

import {
  createEnhancedGetTyyppiLabel,
  createEnhancedGetTyyppiShowUrl,
  useLomakeOptions,
} from './utils';
import { useUrls } from '#/src/contexts/contextHooks';

const LomakeSelect = ({ input, getShowUrl, t, ...props }) => {
  const { value } = input;
  const url = isFunction(getShowUrl) ? getShowUrl(value) : null;

  return (
    <>
      <FormFieldSelect value={value} {...props} input={input} />
      {url ? (
        <Spacing marginTop={2}>
          <Button
            as="a"
            href={url}
            target="_blank"
            variant="outlined"
            color="primary"
          >
            {t('yleiset.avaaLomake')}
          </Button>
        </Spacing>
      ) : null}
    </>
  );
};

const AdditionalTyyppiFields = ({
  input: { value },
  baseName,
  ataruOptions,
  getTyyppiShowUrl,
  apiUrls,
  language,
  t,
}) => {
  const getShowUrl = useMemo(() => {
    return option => getTyyppiShowUrl({ option, apiUrls, tyyppi: value });
  }, [getTyyppiShowUrl, apiUrls, value]);

  switch (value) {
    case HAKULOMAKETYYPPI.ATARU:
      return (
        <Field
          name={`${baseName}.lomake`}
          component={LomakeSelect}
          options={ataruOptions}
          label={t('yleiset.valitseHakulomake')}
          getShowUrl={getShowUrl}
          t={t}
        />
      );
    case HAKULOMAKETYYPPI.MUU:
      return (
        <Field
          name={`${baseName}.linkki.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkki')}
        />
      );
    case HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA:
      return (
        <Field
          name={`${baseName}.kuvaus.${language}`}
          component={FormFieldTextarea}
          label={t('yleiset.kuvaus')}
        />
      );
    default:
      return null;
  }
};

const defaultTyypit = [
  HAKULOMAKETYYPPI.ATARU,
  HAKULOMAKETYYPPI.MUU,
  HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA,
];

export const LomakeFields = ({
  name,
  tyypit = defaultTyypit,
  optionsLabel: optionsLabelProp,
  getTyyppiLabel,
  getTyyppiLomakkeet,
  getTyyppiShowUrl,
  language: translationLanguage = 'fi',
}) => {
  const { t } = useTranslation();
  const tyyppiName = `${name}.tyyppi`;

  const optionsLabel =
    optionsLabelProp === undefined
      ? t('yleiset.valitseMitaHakulomakettaKaytetaan')
      : optionsLabelProp;

  const language = useLanguage();
  const apiUrls = useUrls();

  const enhancedGetTyyppiLabel = useMemo(() => {
    return createEnhancedGetTyyppiLabel(getTyyppiLabel, t);
  }, [getTyyppiLabel, t]);

  const enhancedGetTyyppiShowUrl = useMemo(() => {
    return createEnhancedGetTyyppiShowUrl(getTyyppiShowUrl);
  }, [getTyyppiShowUrl]);

  const tyyppiOptions = useMemo(() => {
    return tyypit.map(tyyppi => ({
      value: tyyppi,
      label: enhancedGetTyyppiLabel(tyyppi),
    }));
  }, [tyypit, enhancedGetTyyppiLabel]);

  const { ataruOptions } = useLomakeOptions({
    getTyyppiLomakkeet,
    tyypit,
    language,
  });

  return (
    <Flex>
      <FlexItem grow={0}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={tyyppiOptions}
          label={optionsLabel}
        />
      </FlexItem>
      <FlexItem grow={1} paddingLeft={3}>
        <Field
          baseName={name}
          ataruOptions={ataruOptions}
          name={tyyppiName}
          getTyyppiShowUrl={enhancedGetTyyppiShowUrl}
          apiUrls={apiUrls}
          t={t}
          component={AdditionalTyyppiFields}
          language={translationLanguage}
        />
      </FlexItem>
    </Flex>
  );
};

export default LomakeFields;
