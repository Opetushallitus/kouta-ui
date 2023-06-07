import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { Alert } from '#/src/components/Alert';
import FormButton from '#/src/components/FormButton';
import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { isToisenAsteenYhteishaku } from '#/src/utils/isToisenAsteenYhteishaku';
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
  const preventCreation =
    !useIsOphVirkailija() &&
    isToisenAsteenYhteishaku(haku?.hakutapaKoodiUri, koulutustyyppi);

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
        required={isToisenAsteenYhteishaku(
          haku?.hakutapaKoodiUri,
          koulutustyyppi
        )}
      />
      <Buttons>
        {valintaperusteOid && (
          <FormButton
            variant="outlined"
            color="primary"
            as="a"
            href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteOid}/muokkaus`}
            target="_blank"
          >
            {t('hakukohdelomake.avaaValintaperuste')}
          </FormButton>
        )}
        <FormButton
          variant="outlined"
          color="primary"
          as="a"
          target="_blank"
          disabled={preventCreation}
          {...(preventCreation
            ? {}
            : {
                href: `/kouta/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/${kieliValinnat}/koulutustyyppi/${koulutustyyppi}`,
              })}
        >
          {t('hakukohdelomake.luoUusiValintaperustekuvaus')}
        </FormButton>
      </Buttons>
      <Field
        name={`${name}.kynnysehto.${language}`}
        component={FormFieldEditor}
        label={t('hakukohdelomake.kynnysehto')}
      />
    </>
  );
};
