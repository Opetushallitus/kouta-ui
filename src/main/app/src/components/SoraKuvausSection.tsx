import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormButton } from '#/src/components/FormButton';
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
          <FormButton
            variant="outlined"
            color="primary"
            as="a"
            href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/${soraKuvausId}/muokkaus`}
            target="_blank"
          >
            {t('valintaperustelomake.avaaSoraKuvaus')}
          </FormButton>
        </Box>
      ) : null}
      {isOphVirkailija && (
        <>
          <Divider marginTop={4} marginBottom={4} />
          <Box display="flex" justifyContent="center">
            <FormButton
              variant="outlined"
              color="primary"
              as="a"
              href={`/kouta/organisaatio/${organisaatioOid}/sora-kuvaus/kielivalinnat/${kieliValinnat}`}
              target="_blank"
            >
              {t('yleiset.luoUusiSoraKuvaus')}
            </FormButton>
          </Box>
        </>
      )}
    </>
  );
};

export default SoraKuvausSection;
