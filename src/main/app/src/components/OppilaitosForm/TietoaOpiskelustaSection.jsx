import React, { useMemo, Fragment } from 'react';
import { Field } from 'redux-form';

import { FormFieldTextarea, FormFieldSelect } from '../formFields';
import useTranslation from '../useTranslation';
import useFieldValue from '../useFieldValue';
import useKoodistoOptions from '../useKoodistoOptions';
import DividerHeading from '../DividerHeading';
import Typography from '../Typography';

const TietoaOpiskelustaSection = ({ name, language }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'organisaationkuvaustiedot',
  });

  const osiot = useFieldValue(`${name}.osiot`);

  const osiotWithLabels = useMemo(() => {
    return (osiot || []).map(({ value }) => ({
      label: null,
      ...(options.find(({ value: v }) => value === v) || {}),
      value,
    }));
  }, [osiot, options]);

  return (
    <>
      <Typography as="div" marginBottom={1}>
        {t('oppilaitoslomake.tietoaOpiskelustaOsiotInfo')}
      </Typography>

      <Field
        name={`${name}.osiot`}
        component={FormFieldSelect}
        options={options}
        label={t('oppilaitoslomake.valitseLisattavaOsio')}
        isMulti
      />

      {osiotWithLabels.map(({ value, label }) => (
        <Fragment key={value}>
          <DividerHeading marginTop={3}>{label}</DividerHeading>
          <Field
            name={`${name}.tiedot.${value}.${language}`}
            component={FormFieldTextarea}
          />
        </Fragment>
      ))}
    </>
  );
};

export default TietoaOpiskelustaSection;
