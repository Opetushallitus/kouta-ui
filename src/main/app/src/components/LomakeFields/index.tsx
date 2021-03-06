import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import { Flex, FlexItem } from '#/src/components/Flex';
import {
  FormFieldSelect,
  FormFieldRadioGroup,
  FormFieldEditor,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';

import {
  createEnhancedGetTyyppiLabel,
  createEnhancedGetTyyppiShowUrl,
  useLomakeOptions,
} from './utils';

const Buttons = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const LomakeSelect = ({ input, apiUrls, haku, getShowUrl, t, ...props }) => {
  const { value } = input;
  const url = _.isFunction(getShowUrl) ? getShowUrl(value) : null;

  return (
    <>
      <FormFieldSelect value={value} {...props} input={input} />
      {url ? (
        <Spacing marginTop={2}>
          <Buttons>
            <Button
              as="a"
              href={url}
              target="_blank"
              variant="outlined"
              color="primary"
            >
              {t('yleiset.avaaLomake')}
            </Button>
            <Spacing marginRight={1} />
            {haku && haku.oid ? (
              <Button
                as="a"
                href={apiUrls.url(
                  'hakukohderyhmapalvelu.haun-asetukset',
                  haku.oid
                )}
                target="_blank"
                variant="outlined"
                color="primary"
              >
                {t('yleiset.muokkaaAsetuksia')}
              </Button>
            ) : null}
          </Buttons>
        </Spacing>
      ) : null}
    </>
  );
};

const AdditionalTyyppiFields = ({
  input: { value },
  baseName,
  haku,
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
          apiUrls={apiUrls}
          haku={haku}
          t={t}
          required
        />
      );
    case HAKULOMAKETYYPPI.MUU:
      return (
        <Field
          name={`${baseName}.linkki.${language}`}
          component={FormFieldUrlInput}
          label={t('yleiset.linkki')}
          required
        />
      );
    case HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA:
      return (
        <Field
          name={`${baseName}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('yleiset.kuvaus')}
          hideHeaderSelect
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
  haku,
  tyypit = defaultTyypit,
  optionsLabel: optionsLabelProp,
  getTyyppiLabel,
  getTyyppiLomakkeet,
  getTyyppiShowUrl,
  language: translationLanguage = 'fi',
}) => {
  const { t, i18n } = useTranslation();
  const userLanguage = i18n.language;

  const tyyppiName = `${name}.tyyppi`;

  const optionsLabel =
    optionsLabelProp === undefined
      ? t('yleiset.valitseMitaHakulomakettaKaytetaan')
      : optionsLabelProp;

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
    language: userLanguage,
  });

  return (
    <Flex>
      <FlexItem grow={0}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={tyyppiOptions}
          label={optionsLabel}
          required
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
          haku={haku}
        />
      </FlexItem>
    </Flex>
  );
};
