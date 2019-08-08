import React from 'react';
import { Field } from 'redux-form';

import FormConfigField from '../../FormConfigField';
import KoulutuksenTiedotSection from './KoulutuksenTiedotSection';
import KoulutusKoodiField from './KoulutuskoodiField';
import Box from '../../Box';
import OpintojenlaajuusField from './OpintojenlaajuusField';
import TutkintonimikeField from './TutkintonimikeField';
import KoulutusalatField from './KoulutusalatField';
import useTranslation from '../../useTranslation';
import { FormFieldInput } from '../../FormFields';
import { getTestIdProps } from '../../../utils';

const TiedotSection = ({ language, koulutustyyppi, koulutuskoodi, name }) => {
  const { t } = useTranslation();

  return (
    <Box mb={-2}>
      <FormConfigField name="koulutuskoodiTiedoilla">
        <Box mb={2}>
          <KoulutuksenTiedotSection
            language={language}
            koulutuskoodi={koulutuskoodi}
            name={name}
          />
        </Box>
      </FormConfigField>

      <FormConfigField name="koulutuskoodi">
        <Box mb={2}>
          <KoulutusKoodiField name={name} koulutustyyppi={koulutustyyppi} />
        </Box>
      </FormConfigField>

      <FormConfigField name="opintojenlaajuus">
        <Box mb={2}>
          <OpintojenlaajuusField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="tutkintonimike">
        <Box mb={2}>
          <TutkintonimikeField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="koulutusalat">
        <Box mb={2}>
          <KoulutusalatField name={name} />
        </Box>
      </FormConfigField>

      <FormConfigField name="nimi">
        <Box mb={2} {...getTestIdProps('nimiInput')}>
          <Field
            name={`${name}.nimi.${language}`}
            component={FormFieldInput}
            label={t('koulutuslomake.muokkaaKoulutuksenNimea')}
          />
        </Box>
      </FormConfigField>
    </Box>
  );
};

export default TiedotSection;
