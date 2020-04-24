import React from 'react';
import { Field } from 'redux-form';

import { FormFieldInput, FormFieldPostinumeroSelect } from '../formFields';
import { useTranslation } from 'react-i18next';
import Typography from '../Typography';
import Box from '../Box';
import { getTestIdProps } from '../../utils';

const YhteystiedotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography mb={2} as="div">
        {t('oppilaitoslomake.yhteystiedotInfo')}
      </Typography>

      <Box mb={2} {...getTestIdProps('osoite')}>
        <Field
          component={FormFieldInput}
          name={`${name}.osoite.${language}`}
          label={t('yleiset.osoite')}
        />
      </Box>

      <Box mb={2} {...getTestIdProps('postinumero')}>
        <Field
          component={FormFieldPostinumeroSelect}
          name={`${name}.postinumero`}
          label={t('yleiset.postinumero')}
        />
      </Box>

      <Box mb={2} {...getTestIdProps('sahkoposti')}>
        <Field
          component={FormFieldInput}
          name={`${name}.sahkoposti.${language}`}
          label={t('yleiset.sahkoposti')}
        />
      </Box>

      <Box mb={2} {...getTestIdProps('puhelinnumero')}>
        <Field
          component={FormFieldInput}
          name={`${name}.puhelinnumero.${language}`}
          label={t('yleiset.puhelinnumero')}
        />
      </Box>

      <Box {...getTestIdProps('verkkosivu')}>
        <Field
          component={FormFieldInput}
          name={`${name}.verkkosivu.${language}`}
          label={t('yleiset.verkkosivu')}
        />
      </Box>
    </>
  );
};

export default YhteystiedotSection;
