import React from 'react';
import { Field } from 'redux-form';

import { FormFieldSoraKuvausSelect } from '../FormFields';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import Button from '../Button';
import Divider from '../Divider';
import Flex from '../Flex';

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
      <Divider marginTop={4} marginBottom={4} />
      <Flex justifyCenter>
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus`}
          target="_blank"
        >
          {t('yleiset.luoUusiSoraKuvaus')}
        </Button>
      </Flex>
    </>
  );
};

export default SoraKuvausSection;
