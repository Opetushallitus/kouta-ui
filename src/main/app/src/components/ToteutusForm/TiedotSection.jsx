import React from 'react';
import { Field } from 'redux-form';

import { useTranslation } from 'react-i18next';
import {
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
} from '../formFields';
import Box from '../Box';
import FormConfigField from '../FormConfigField';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';

const LaajuusFields = ({ name }) => {
  const { t } = useTranslation();

  const { options } = useKoodistoOptions({
    koodisto: 'opintojenlaajuusyksikko',
  });

  return (
    <Box display="flex" mx={-1}>
      <Box px={1} flexGrow={1} {...getTestIdProps('laajuus')}>
        <Field
          name={`${name}.laajuus`}
          component={FormFieldInput}
          label={t('toteutuslomake.laajuus')}
          type="number"
        />
      </Box>

      <Box px={1} flexGrow={1} {...getTestIdProps('laajuusyksikko')}>
        <Field
          name={`${name}.laajuusyksikko`}
          component={FormFieldSelect}
          label={t('toteutuslomake.laajuusyksikko')}
          options={options}
          isClearable
        />
      </Box>
    </Box>
  );
};

const TiedotSection = ({ language, name }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormConfigField name="nimi">
        <Box mb={2} {...getTestIdProps('toteutuksenNimi')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('toteutuslomake.toteutuksenNimi')}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="toteutuksenKuvaus">
        <Box mb={2} {...getTestIdProps('toteutuksenKuvaus')}>
          <Field
            name={`${name}.toteutuksenKuvaus.${language}`}
            component={FormFieldTextarea}
            label={t('yleiset.toteutuksenKuvaus')}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="ilmoittautumislinkki">
        <Box mb={2} {...getTestIdProps('ilmoittautumislinkki')}>
          <Field
            name={`${name}.ilmoittautumislinkki.${language}`}
            component={FormFieldInput}
            label={t('toteutuslomake.ilmoittautumislinkki')}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="laajuus">
        <Box mb={2}>
          <LaajuusFields name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="aloituspaikat">
        <Box mb={2} {...getTestIdProps('aloituspaikat')}>
          <Field
            name={`${name}.aloituspaikat`}
            component={FormFieldInput}
            label={t('toteutuslomake.aloituspaikat')}
            type="number"
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="kesto">
        <Box mb={2} {...getTestIdProps('kesto')}>
          <Field
            name={`${name}.kesto.${language}`}
            component={FormFieldInput}
            label={t('toteutuslomake.suunniteltuKesto')}
          />
        </Box>
      </FormConfigField>
    </>
  );
};

export default TiedotSection;
