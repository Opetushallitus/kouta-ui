import React, { useMemo, Fragment } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import {
  FormFieldTextarea,
  FormFieldSelect,
} from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import DividerHeading from '#/src/components/DividerHeading';
import { Typography } from '#/src/components/virkailija';

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
