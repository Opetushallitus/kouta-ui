import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSoraKuvausSelect } from '../formFields';
import useTranslation from '../useTranslation';
import Button from '../Button';
import Divider from '../Divider';
import Box from '../Box';

const SoraKuvausSection = ({ name, organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <>
      <Field
        name={name}
        component={FormFieldSoraKuvausSelect}
        label={t('valintaperustelomake.valitseSoraKuvaus')}
        organisaatioOid={organisaatioOid}
        reloadOnFocus
      />
      <Divider marginTop={4} marginBottom={4} />
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus`}
          target="_blank"
        >
          {t('yleiset.luoUusiSoraKuvaus')}
        </Button>
      </Box>
    </>
  );
};

export default SoraKuvausSection;
