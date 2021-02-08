import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Button from '#/src/components/Button';
import { FormFieldSoraKuvausSelect } from '#/src/components/formFields';
import { Box, Divider } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

const SoraKuvausSection = ({ name, organisaatioOid, languages }) => {
  const { t } = useTranslation();
  const soraKuvaus = useFieldValue(name);
  const soraKuvausId = soraKuvaus?.value;
  const kieliValinnat = languages;

  const isOphVirkailija = useIsOphVirkailija();

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
      {isOphVirkailija && (
        <>
          <Divider marginTop={4} marginBottom={4} />
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              as="a"
              href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/${kieliValinnat}`}
              target="_blank"
            >
              {t('yleiset.luoUusiSoraKuvaus')}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default SoraKuvausSection;
