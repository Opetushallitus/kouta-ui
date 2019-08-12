import React from 'react';
import { Field } from 'redux-form';

import { FormFieldInput } from '../FormFields';
import useTranslation from '../useTranslation';
import Typography from '../Typography';
import Box from '../Box';

const YhteystiedotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography mb={2} as="div">
        {t('oppilaitoslomake.yhteystiedotInfo')}
      </Typography>

      <Box mb={2}>
        <Field
          component={FormFieldInput}
          name={`${name}.osoite.${language}`}
          label={t('yleiset.osoite')}
        />
      </Box>

      <Box display="flex" mb={2}>
        <Box flexGrow={1} mr={1}>
          <Field
            component={FormFieldInput}
            name={`${name}.postinumero`}
            label={t('yleiset.postinumero')}
          />
        </Box>
        <Box flexGrow={1} ml={1}>
          <Field
            component={FormFieldInput}
            name={`${name}.postitoimipaikka.${language}`}
            label={t('yleiset.postitoimipaikka')}
          />
        </Box>
      </Box>

      <Box mb={2}>
        <Field
          component={FormFieldInput}
          name={`${name}.puhelinnumero`}
          label={t('yleiset.puhelinnumero')}
        />
      </Box>

      <Box>
        <Field
          component={FormFieldInput}
          name={`${name}.verkkosivu`}
          label={t('yleiset.verkkosivu')}
        />
      </Box>
    </>
  );
};

export default YhteystiedotSection;
