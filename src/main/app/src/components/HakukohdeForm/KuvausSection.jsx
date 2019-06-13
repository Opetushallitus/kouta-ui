import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import { getKoutaValintaperusteet } from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import useApiAsync from '../useApiAsync';
import { FormFieldSelect } from '../FormFields';

const getValintaperusteet = async ({
  httpClient,
  apiUrls,
  organisaatioOid,
  hakuOid,
}) => {
  const valintaperusteet = await getKoutaValintaperusteet({
    httpClient,
    apiUrls,
    organisaatioOid,
    hakuOid,
  });

  return valintaperusteet;
};

const getValintaperusteetOptions = valintaperusteet =>
  valintaperusteet.map(({ nimi, id }) => ({
    value: id,
    label: getFirstLanguageValue(nimi),
  }));

const KuvausSection = ({ haku, organisaatio, name }) => {
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

  const options = useMemo(() => getValintaperusteetOptions(data || []), [data]);

  return (
    <Field
      name={name}
      component={FormFieldSelect}
      options={options}
      label={t('yleiset.valitseKuvaus')}
    />
  );
};

export default KuvausSection;
