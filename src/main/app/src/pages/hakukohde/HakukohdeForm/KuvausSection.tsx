import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Alert from '#/src/components/Alert';
import Button from '#/src/components/Button';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box, Divider } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useApiAsync from '#/src/hooks/useApiAsync';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import getValintaperusteet from '#/src/utils/valintaperuste/getValintaperusteet';

const KuvausSection = ({ haku, organisaatioOid, name, languages }) => {
  const hakuOid = haku?.oid;
  const kohdejoukkoKoodiUri = haku?.kohdejoukkoKoodiUri;
  const watch = [hakuOid, organisaatioOid].join(',');
  const { t } = useTranslation();
  const valintaperuste = useFieldValue(name);
  const valintaperusteOid = valintaperuste?.value;
  const kieliValinnat = languages;

  const { data, reload } = useApiAsync({
    promiseFn: getValintaperusteet,
    hakuOid,
    organisaatioOid,
    watch,
  });

  const onFocus = useCallback(() => {
    reload();
  }, [reload]);

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
        name={name}
        component={FormFieldSelect}
        options={options}
        onFocus={onFocus}
        label={t('hakukohdelomake.valitseValintaperustekuvaus')}
        helperText={t('hakukohdelomake.valintaperustekuvaustenListausperuste')}
      />
      {valintaperusteOid ? (
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            as="a"
            href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet/${valintaperusteOid}/muokkaus`}
            target="_blank"
          >
            {t('hakukohdelomake.avaaValintaperuste')}
          </Button>
        </Box>
      ) : null}
      <Divider marginTop={4} marginBottom={4} />
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/${kieliValinnat}`}
          target="_blank"
        >
          {t('hakukohdelomake.luoUusiValintaperustekuvaus')}
        </Button>
      </Box>
    </>
  );
};

export default KuvausSection;
