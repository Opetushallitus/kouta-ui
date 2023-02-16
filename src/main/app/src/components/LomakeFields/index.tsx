import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import {
  FormFieldSelect,
  FormFieldRadioGroup,
  FormFieldEditor,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { HakuModel } from '#/src/types/domainTypes';

import { useAtaruLomakeUrl, useLomakeOptions } from './utils';

const Buttons = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`;

const HaunAsetuksetButton = ({ haku }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();

  return (
    <>
      {haku && haku.oid ? (
        <Button
          as="a"
          href={apiUrls.url('hakukohderyhmapalvelu.haun-asetukset', haku.oid)}
          target="_blank"
          variant="outlined"
          color="primary"
        >
          {t('yleiset.muokkaaAsetuksia')}
        </Button>
      ) : null}
    </>
  );
};

const LomakeSelect = ({ input, haku, getShowUrl, hakutapa, ...props }) => {
  const { value } = input;
  const url = useAtaruLomakeUrl(value);

  const { t } = useTranslation();

  const userLanguage = useUserLanguage();

  const ataruOptions = useLomakeOptions({
    language: userLanguage,
    hakutapa,
  });

  return (
    <>
      <FormFieldSelect
        value={value}
        options={ataruOptions}
        {...props}
        input={input}
      />
      <Box marginTop={2}>
        <Buttons>
          <HaunAsetuksetButton haku={haku} />
          {url ? (
            <>
              <Box marginRight={1} />
              <Button
                as="a"
                href={url}
                target="_blank"
                variant="outlined"
                color="primary"
              >
                {t('yleiset.avaaLomake')}
              </Button>
            </>
          ) : null}
        </Buttons>
      </Box>
    </>
  );
};

const AdditionalTyyppiFields = ({
  input: { value },
  baseName,
  haku,
  language,
  hakutapa,
}) => {
  const { t } = useTranslation();
  switch (value) {
    case HAKULOMAKETYYPPI.ATARU:
      return (
        <Field
          name={`${baseName}.lomake`}
          component={LomakeSelect}
          label={t('yleiset.valitseHakulomake')}
          haku={haku}
          required
          hakutapa={hakutapa}
        />
      );
    case HAKULOMAKETYYPPI.MUU:
      return (
        <>
          <Field
            name={`${baseName}.linkki.${language}`}
            component={FormFieldUrlInput}
            label={t('yleiset.linkki')}
            required
          />
          <Box marginTop={2}>
            <Buttons>
              <HaunAsetuksetButton haku={haku} />
            </Buttons>
          </Box>
        </>
      );
    case HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA:
      return (
        <>
          <Field
            name={`${baseName}.kuvaus.${language}`}
            component={FormFieldEditor}
            label={t('yleiset.kuvaus')}
            hideHeaderSelect
          />
          <Box marginTop={2}>
            <Buttons>
              <HaunAsetuksetButton haku={haku} />
            </Buttons>
          </Box>
        </>
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

const tyyppiToTranslationKey = {
  [HAKULOMAKETYYPPI.ATARU]: 'hakulomakeValinnat.ataru',
  [HAKULOMAKETYYPPI.HAKUAPP]: 'hakulomakeValinnat.hakuapp',
  [HAKULOMAKETYYPPI.MUU]: 'hakulomakeValinnat.muu',
  [HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA]: 'hakulomakeValinnat.eiSahkoistaHakua',
};

type LomakeFieldsProps = {
  name: string;
  haku?: HakuModel;
  tyypit?: Array<HAKULOMAKETYYPPI>;
  optionsLabel?: string;
  language?: LanguageCode;
  hakutapa?: string;
};

export const LomakeFields = ({
  name,
  haku,
  tyypit = defaultTyypit,
  optionsLabel,
  language: translationLanguage = 'fi',
  hakutapa,
}: LomakeFieldsProps) => {
  const { t } = useTranslation();

  const tyyppiName = `${name}.tyyppi`;

  const tyyppiOptions = useMemo(() => {
    return tyypit.map(tyyppi => ({
      value: tyyppi,
      label: t(tyyppiToTranslationKey[tyyppi]),
    }));
  }, [t, tyypit]);

  return (
    <Box display="flex">
      <Box flexGrow={0}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={tyyppiOptions}
          label={optionsLabel ?? t('yleiset.valitseMitaHakulomakettaKaytetaan')}
          required
        />
      </Box>
      <Box flexGrow={1} paddingLeft={3}>
        <Field
          baseName={name}
          name={tyyppiName}
          component={AdditionalTyyppiFields}
          language={translationLanguage}
          haku={haku}
          hakutapa={hakutapa}
        />
      </Box>
    </Box>
  );
};
