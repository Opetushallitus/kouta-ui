import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSoraKuvausSelect } from '../FormFields';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import Button from '../Button';

const SoraKuvausSection = ({ name, organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <Field
          name={name}
          component={FormFieldSoraKuvausSelect}
          label={t('valintaperustelomake.valitseSoraKuvaus')}
          organisaatioOid={organisaatioOid}
          reloadOnFocus
        />
      </Spacing>
      <Button
        variant="outlined"
        color="primary"
        as="a"
        href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus`}
        target="_blank"
      >
        {t('yleiset.luoUusiSoraKuvaus')}
      </Button>
    </>
  );
};

export default SoraKuvausSection;
