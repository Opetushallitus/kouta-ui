import React, { useMemo, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
import Heading from '#/src/components/Heading';
import { Typography } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';

export const TietoaOpiskelustaSection = ({ name, language }) => {
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
          <Heading hasDivider mt={3}>
            {label}
          </Heading>
          <Field
            name={`${name}.tiedot.${value}.${language}`}
            component={FormFieldEditor}
          />
        </Fragment>
      ))}
    </>
  );
};
