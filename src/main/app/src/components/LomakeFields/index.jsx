import React, { useMemo, useContext } from 'react';
import { Field } from 'redux-form';

import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldRadioGroup,
  FormFieldTextarea,
} from '../FormFields';

import { HAKULOMAKETYYPPI } from '../../constants';
import Spacing from '../Spacing';
import useTranslation from '../useTranslation';
import useLanguage from '../useLanguage';
import Flex, { FlexItem } from '../Flex';
import UrlContext from '../UrlContext';
import Button from '../Button';
import { isFunction } from '../../utils';

import {
  createEnhancedGetTyyppiLabel,
  createEnhancedGetTyyppiShowUrl,
  useLomakeOptions,
} from './utils';

const MuuFields = ({ baseName, t, language }) => {
  return (
    <Field
      name={`${baseName}.linkki.${language}`}
      component={FormFieldInput}
      label={t('yleiset.linkki')}
    />
  );
};

const EiHakuaFields = ({ baseName, t, language }) => {
  return (
    <Field
      name={`${baseName}.kuvaus.${language}`}
      component={FormFieldTextarea}
      label={t('yleiset.kuvaus')}
    />
  );
};

const LomakeSelect = ({
  input: { value, onBlur, ...restInput },
  getShowUrl,
  ...props
}) => {
  const url = isFunction(getShowUrl) ? getShowUrl(value) : null;

  return (
    <>
      <FormFieldSelect value={value} {...restInput} {...props} />
      {url ? (
        <Spacing marginTop={2}>
          <Button
            as="a"
            href={url}
            target="_blank"
            variant="outlined"
            color="primary"
          >
            Avaa lomake
          </Button>
        </Spacing>
      ) : null}
    </>
  );
};

const AdditionalTyyppiFields = ({
  input: { value },
  baseName,
  lomakeName,
  ataruOptions,
  getTyyppiShowUrl,
  apiUrls,
  language,
  t,
}) => {
  const getShowUrl = useMemo(() => {
    return option => getTyyppiShowUrl({ option, apiUrls, tyyppi: value });
  }, [getTyyppiShowUrl, apiUrls, value]);

  if (value === HAKULOMAKETYYPPI.MUU) {
    return <MuuFields baseName={baseName} t={t} language={language} />;
  }

  if (value === HAKULOMAKETYYPPI.ATARU) {
    return (
      <Field
        name={`${lomakeName}.${value}`}
        component={LomakeSelect}
        options={ataruOptions}
        label={t('yleiset.valitseHakulomake')}
        getShowUrl={getShowUrl}
      />
    );
  }

  if (value === HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA) {
    return <EiHakuaFields baseName={baseName} t={t} language={language} />;
  }

  return null;
};

const defaultTyypit = [
  HAKULOMAKETYYPPI.ATARU,
  HAKULOMAKETYYPPI.HAKUAPP,
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
  const lomakeName = `${name}.lomake`;

  const optionsLabel =
    optionsLabelProp === undefined
      ? t('yleiset.valitseMitaHakulomakettaKaytetaan')
      : optionsLabelProp;

  const language = useLanguage();
  const apiUrls = useContext(UrlContext);

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
          lomakeName={lomakeName}
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
