import React, { useCallback } from 'react';
import { Field, FieldArray } from 'redux-form';

import useKoodistoOptions from '../../useKoodistoOptions';

import {
  FormFieldSelect,
  FormFieldAsyncKoodistoSelect,
} from '../../FormFields';

import Box from '../../Box';
import FieldArrayList from '../../FieldArrayList';
import { getTestIdProps } from '../../../utils';
import Button from '../../Button';
import useTranslation from '../../useTranslation';
import useLoadOptions from '../../useLoadOptions';

const TutkintoField = ({ options, ...props }) => {
  const loadOptions = useLoadOptions(options);

  return (
    <Field
      component={FormFieldAsyncKoodistoSelect}
      loadOptions={loadOptions}
      isClearable
      {...props}
    />
  );
};

const OsaamisalaField = props => {
  return <Field component={FormFieldSelect} isClearable {...props} />;
};

const TutkinnonOsatField = ({ options, ...props }) => {
  const loadOptions = useLoadOptions(options);

  return (
    <Field
      loadOptions={loadOptions}
      component={FormFieldAsyncKoodistoSelect}
      isClearable
      isMulti
      {...props}
    />
  );
};

const TutkinnonOsatArrayField = ({
  fields,
  t,
  tutkintoOptions,
  osaamisalaOptions,
  tutkinnonOsatOptions,
}) => {
  const onAddField = useCallback(() => {
    fields.push({});
  }, [fields]);

  return (
    <>
      <FieldArrayList fields={fields}>
        {({ field }) => (
          <>
            <Box mb={2} {...getTestIdProps('tutkinto')}>
              <TutkintoField
                name={`${field}.tutkinto`}
                options={tutkintoOptions}
                label={t('toteutuslomake.valitseTutkinto')}
              />
            </Box>

            <Box mb={2} {...getTestIdProps('osaamisala')}>
              <OsaamisalaField
                name={`${field}.osaamisala`}
                options={osaamisalaOptions}
                label={t('toteutuslomake.valitseOsaamisala')}
              />
            </Box>

            <TutkinnonOsatField
              name={`${field}.tutkinnonOsat`}
              options={tutkinnonOsatOptions}
              label={t('toteutuslomake.valitseTutkinnonOsat')}
            />
          </>
        )}
      </FieldArrayList>
      <Box
        display="flex"
        justifyContent="center"
        mt={fields.length > 0 ? 4 : 0}
      >
        <Button
          variant="outlined"
          color="primary"
          type="button"
          onClick={onAddField}
          {...getTestIdProps('lisaaTutkinnonOsaButton')}
        >
          {t('toteutuslomake.lisaaTutkinnonOsa')}
        </Button>
      </Box>
    </>
  );
};

export const TutkinnonOsatSection = ({ name, language = 'fi' }) => {
  const { t } = useTranslation();

  const { options: osaamisalaOptions } = useKoodistoOptions({
    koodisto: 'osaamisala',
  });

  const { options: tutkintoOptions } = useKoodistoOptions({
    koodisto: 'koulutus',
  });

  const { options: tutkinnonOsatOptions } = useKoodistoOptions({
    koodisto: 'tutkinnonosat',
  });

  return (
    <FieldArray
      tutkintoOptions={tutkintoOptions}
      osaamisalaOptions={osaamisalaOptions}
      tutkinnonOsatOptions={tutkinnonOsatOptions}
      name={name}
      component={TutkinnonOsatArrayField}
      t={t}
      language={language}
    />
  );
};

export default TutkinnonOsatSection;
