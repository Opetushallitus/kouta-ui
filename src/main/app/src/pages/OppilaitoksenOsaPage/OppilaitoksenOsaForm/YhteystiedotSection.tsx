import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldInput,
  FormFieldPostinumeroSelect,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import { Box, Typography } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

const YhteystiedotSection = ({ name, language }) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography mb={2} as="div">
        {t('oppilaitoksenOsaLomake.yhteystiedotInfo')}
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
          component={FormFieldUrlInput}
          name={`${name}.verkkosivu.${language}`}
          label={t('yleiset.verkkosivu')}
        />
      </Box>
    </>
  );
};

export default YhteystiedotSection;
