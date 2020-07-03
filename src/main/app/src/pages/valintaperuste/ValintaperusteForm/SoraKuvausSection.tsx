import React from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

import { FormFieldSoraKuvausSelect } from '#/src/components/formFields';
import Button from '#/src/components/Button';
import Divider from '#/src/components/Divider';
import Box from '#/src/components/Box';
import { useFieldValue } from '#/src/hooks/form';

const SoraKuvausSection = ({ name, organisaatioOid, languages }) => {
  const { t } = useTranslation();
  const soraKuvaus = useFieldValue(name);
  const soraKuvausId = get(soraKuvaus, 'value');
  const kieliValinnat = languages;

  return (
    <>
      <Field
        name={name}
        component={FormFieldSoraKuvausSelect}
        label={t('valintaperustelomake.valitseSoraKuvaus')}
        organisaatioOid={organisaatioOid}
        reloadOnFocus
      />
      {soraKuvausId ? (
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            as="a"
            href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvausId}/muokkaus`}
            target="_blank"
          >
            {t('valintaperustelomake.avaaSoraKuvaus')}
          </Button>
        </Box>
      ) : null}
      <Divider marginTop={4} marginBottom={4} />
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/${kieliValinnat}`}
          target="_blank"
        >
          {t('yleiset.luoUusi', { entity: t('yleiset.soraKuvaus') })}
        </Button>
      </Box>
    </>
  );
};

export default SoraKuvausSection;
