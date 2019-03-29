import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import get from 'lodash/get';

import Spacing from '../Spacing';
import Typography from '../Typography';
import Textarea from '../Textarea';
import LanguageSelector from '../LanguageSelector';
import Select from '../Select';
import useTranslation from '../useTranslation';
import useKoodistoOptions from '../useKoodistoOptions';

const noop = () => {};

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} onBlur={noop} {...props} />
);

const renderTextareaField = ({ input, ...props }) => (
  <Textarea {...input} {...props} />
);

const OsiotFieldsBase = ({ osiot, language, osiotOptions }) => {
  const osiotArr = osiot || [];

  const osiotArrWithLabels = useMemo(() => {
    return osiotArr.map(({ value, label }) => ({
      value,
      label: label
        ? label
        : get(osiotOptions.find(({ value: v }) => v === value), 'label') ||
          null,
    }));
  }, [osiotArr, osiotOptions]);

  return osiotArrWithLabels.map(({ value, label }, index) => (
    <Spacing marginBottom={index !== osiot.length - 1 ? 2 : 0} key={value}>
      <Typography variant="h6" marginBottom={1}>
        {label}
      </Typography>
      <Field
        name={`osioKuvaukset.${value}.${language}`}
        component={renderTextareaField}
      />
    </Spacing>
  ));
};

const OsiotFields = formValues({ osiot: 'osiot' })(OsiotFieldsBase);

const LisatiedotSection = ({ languages = [] }) => {
  const { t } = useTranslation();
  const { options: osiotOptions } = useKoodistoOptions({ koodisto: 'koulutuksenjarjestamisenlisaosiot' });

  return (
    <LanguageSelector languages={languages} defaultValue="fi">
      {({ value: activeLanguage }) => (
        <>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              {t('yleiset.valitseLisattavaOsio')}
            </Typography>
            <Field
              name="osiot"
              component={renderSelectField}
              options={osiotOptions}
              isMulti
            />
          </Spacing>
          <OsiotFields language={activeLanguage} osiotOptions={osiotOptions} />
        </>
      )}
    </LanguageSelector>
  );
};

export default LisatiedotSection;
