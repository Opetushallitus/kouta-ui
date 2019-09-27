import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import getValintaperusteet from '../../utils/kouta/getValintaperusteet';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';
import { FormFieldSelect } from '../formFields';
import useLanguage from '../useLanguage';
import Divider from '../Divider';
import Box from '../Box';
import Button from '../Button';

const getValintaperusteetOptions = (valintaperusteet, language) =>
  valintaperusteet.map(({ nimi, id }) => ({
    value: id,
    label: getFirstLanguageValue(nimi, language),
  }));

const KuvausSection = ({ haku, organisaatio, name }) => {
  const language = useLanguage();
  const hakuOid = get(haku, 'oid');
  const organisaatioOid = get(organisaatio, 'oid');
  const watch = [hakuOid, organisaatioOid].join(',');
  const { t } = useTranslation();

  const { data } = useApiAsync({
    promiseFn: getValintaperusteet,
    hakuOid,
    organisaatioOid,
    watch,
  });

  const options = useMemo(
    () => getValintaperusteetOptions(data || [], language),
    [data, language],
  );

  return (
    <>
      <Field
        name={name}
        component={FormFieldSelect}
        options={options}
        label={t('hakukohdelomake.valitseValintaperustekuvaus')}
      />
      <Divider marginTop={4} marginBottom={4} />
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          color="primary"
          as="a"
          href={`/kouta/organisaatio/${organisaatioOid}/valintaperusteet`}
          target="_blank"
        >
          {t('hakukohdelomake.luoUusiValintaperustekuvaus')}
        </Button>
      </Box>
    </>
  );
};

export default KuvausSection;
