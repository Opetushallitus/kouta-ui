import React, { useMemo } from 'react';
import { Field } from 'redux-form';

import {
  FormFieldSelect,
  FormFieldInput,
  FormFieldRadioGroup,
} from '../FormFields';

import { HAKULOMAKE_TYYPIT } from '../../constants';
import Spacing from '../Spacing';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';
import useLanguage from '../useLanguage';
import Flex, { FlexItem } from '../Flex';

import {
  getOptions,
  createEnhancedGetTyyppiLabel,
  createEnhancedGetTyyppiLomakkeet,
} from './utils';

const MuuFields = ({ baseName, t }) => {
  return (
    <>
      <Spacing marginBottom={2}>
        <Field
          name={`${baseName}.linkki`}
          component={FormFieldInput}
          label={t('yleiset.linkki')}
        />
      </Spacing>
      <Field
        name={`${baseName}.linkinOtsikko`}
        component={FormFieldInput}
        label={t('yleiset.linkinOtsikko')}
      />
    </>
  );
};

const AdditionalTyyppiFields = ({
  input: { value },
  baseName,
  lomakeName,
  ataruOptions,
  hakuappOptions,
  t,
}) => {
  if (value === HAKULOMAKE_TYYPIT.MUU) {
    return <MuuFields baseName={baseName} t={t} />;
  }

  if (value === HAKULOMAKE_TYYPIT.ATARU) {
    return (
      <Field
        name={`${lomakeName}.${value}`}
        component={FormFieldSelect}
        options={ataruOptions}
        label={t('yleiset.valitseHakulomake')}
      />
    );
  }

  if (value === HAKULOMAKE_TYYPIT.HAKUAPP) {
    return (
      <Field
        name={`${lomakeName}.${value}`}
        component={FormFieldSelect}
        options={hakuappOptions}
        label={t('yleiset.valitseHakulomake')}
      />
    );
  }

  return null;
};

const defaultTyypit = [
  HAKULOMAKE_TYYPIT.ATARU,
  HAKULOMAKE_TYYPIT.HAKUAPP,
  HAKULOMAKE_TYYPIT.MUU,
  HAKULOMAKE_TYYPIT.EI_SAHKOISTA_HAKUA,
];

const noopPromise = () => Promise.resolve([]);

export const LomakeFields = ({
  name,
  tyypit = defaultTyypit,
  getTyyppiLabel,
  getTyyppiLomakkeet,
}) => {
  const { t } = useTranslation();
  const tyyppiName = `${name}.tyyppi`;
  const lomakeName = `${name}.lomake`;

  const language = useLanguage();

  const enhancedGetTyyppiLabel = useMemo(() => {
    return createEnhancedGetTyyppiLabel(getTyyppiLabel, t);
  }, [getTyyppiLabel, t]);

  const tyyppiOptions = useMemo(() => {
    return tyypit.map(tyyppi => ({
      value: tyyppi,
      label: enhancedGetTyyppiLabel(tyyppi),
    }));
  }, [tyypit, enhancedGetTyyppiLabel]);

  const enhancedGetTyyppiLomakkeet = useMemo(
    () => createEnhancedGetTyyppiLomakkeet(getTyyppiLomakkeet),
    [getTyyppiLomakkeet],
  );

  const { data: ataruLomakkeet } = useApiAsync({
    promiseFn: tyypit.includes(HAKULOMAKE_TYYPIT.ATARU)
      ? enhancedGetTyyppiLomakkeet
      : noopPromise,
    tyyppi: HAKULOMAKE_TYYPIT.ATARU,
  });

  const { data: hakuappLomakkeet } = useApiAsync({
    promiseFn: tyypit.includes(HAKULOMAKE_TYYPIT.HAKUAPP)
      ? enhancedGetTyyppiLomakkeet
      : noopPromise,
    tyyppi: HAKULOMAKE_TYYPIT.HAKUAPP,
  });

  const ataruOptions = useMemo(
    () => getOptions(ataruLomakkeet || [], language),
    [ataruLomakkeet, language],
  );

  const hakuappOptions = useMemo(
    () => getOptions(hakuappLomakkeet || [], language),
    [hakuappLomakkeet, language],
  );

  return (
    <Flex>
      <FlexItem grow={0}>
        <Field
          name={tyyppiName}
          component={FormFieldRadioGroup}
          options={tyyppiOptions}
        />
      </FlexItem>
      <FlexItem grow={1} paddingLeft={3}>
        <Field
          baseName={name}
          lomakeName={lomakeName}
          ataruOptions={ataruOptions}
          hakuappOptions={hakuappOptions}
          name={tyyppiName}
          t={t}
          component={AdditionalTyyppiFields}
        />
      </FlexItem>
    </Flex>
  );
};

export default LomakeFields;
