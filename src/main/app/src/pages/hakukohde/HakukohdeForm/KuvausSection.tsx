import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Alert from '#/src/components/Alert';
import Button from '#/src/components/Button';
import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useValintaperusteet } from '#/src/utils/valintaperuste/getValintaperusteet';

const Buttons = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 12px 0 20px;
  *:not(:first-child) {
    padding-left: 8px;
  }
`;

export const KuvausSection = ({
  haku,
  organisaatioOid,
  name,
  language,
  languages,
  koulutustyyppi,
}) => {
  const hakuOid = haku?.oid;
  const kohdejoukkoKoodiUri = haku?.kohdejoukkoKoodiUri;
  const { t } = useTranslation();
  const kuvausValues = useFieldValue(name);
  const valintaperusteOid = kuvausValues?.valintaperuste?.value;
  const kieliValinnat = languages;

  const { data, refetch } = useValintaperusteet({
    hakuOid,
    koulutustyyppi,
    organisaatioOid,
  });

  const options = useEntityOptions(data);

  return (
    <>
      {!kohdejoukkoKoodiUri && (
        <Box mb={2}>
          <Alert status="info">
            {t('hakukohdelomake.haunKohdejoukkoPuuttuu')}
          </Alert>
        </Box>
      )}
      <Field
        name={`${name}.valintaperuste`}
        component={FormFieldSelect}
        options={options}
        onFocus={() => refetch()}
        label={t('hakukohdelomake.valitseValintaperustekuvaus')}
        helperText={t('hakukohdelomake.valintaperustekuvaustenListausperuste')}
      />
      <Buttons>
        {valintaperusteOid && (
          <Button
            variant="outlined"
            color="primary"
            as="a"
            href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteOid}/muokkaus`}
            target="_blank"
          >
            {t('hakukohdelomake.avaaValintaperuste')}
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/${kieliValinnat}/koulutustyyppi/${koulutustyyppi}`}
          target="_blank"
        >
          {t('hakukohdelomake.luoUusiValintaperustekuvaus')}
        </Button>
      </Buttons>
      <Field
        name={`${name}.kynnysehto.${language}`}
        component={FormFieldEditor}
        label={t('hakukohdelomake.kynnysehto')}
      />
    </>
  );
};
