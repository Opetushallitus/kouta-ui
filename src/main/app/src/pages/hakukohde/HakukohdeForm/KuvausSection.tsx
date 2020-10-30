import React, { useMemo, useCallback } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

import getValintaperusteet from '#/src/utils/valintaperuste/getValintaperusteet';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useApiAsync from '#/src/hooks/useApiAsync';
import { FormFieldSelect } from '#/src/components/formFields';
import useLanguage from '#/src/hooks/useLanguage';
import { Box, Divider } from '#/src/components/virkailija';
import Button from '#/src/components/Button';
import Alert from '#/src/components/Alert';
import { useFieldValue } from '#/src/hooks/form';

const getValintaperusteetOptions = (valintaperusteet, language) =>
  valintaperusteet.map(({ nimi, id, tila }) => ({
    value: id,
    label: getFirstLanguageValue(nimi, language) + ` (${tila})`,
  }));

const KuvausSection = ({ haku, organisaatioOid, name, languages }) => {
  const language = useLanguage();
  const hakuOid = get(haku, 'oid');
  const kohdejoukkoKoodiUri = get(haku, 'kohdejoukkoKoodiUri');
  const watch = [hakuOid, organisaatioOid].join(',');
  const { t } = useTranslation();
  const valintaperuste = useFieldValue(name);
  const valintaperusteOid = get(valintaperuste, 'value');
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

  const options = useMemo(
    () => getValintaperusteetOptions(data || [], language),
    [data, language]
  );

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
