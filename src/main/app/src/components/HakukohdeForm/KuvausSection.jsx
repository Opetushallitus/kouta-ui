import React from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import Typography from '../Typography';
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getKoutaValintaperusteet } from '../../apiUtils';
import { getFirstLanguageValue, noop } from '../../utils';
import useTranslation from '../useTranslation';

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

const renderSelectField = ({ input, ...props }) => (
  <Select {...input} {...props} onBlur={noop} />
);

const KuvausSection = ({ haku, organisaatio }) => {
  const hakuOid = get(haku, 'oid');
  const organisaatioOid = get(organisaatio, 'oid');
  const watch = [hakuOid, organisaatioOid].join(',');
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('yleiset.valitseKuvaus')}
      </Typography>
      <ApiAsync
        promiseFn={getValintaperusteet}
        hakuOid={hakuOid}
        organisaatioOid={organisaatioOid}
        watch={watch}
      >
        {({ data }) => (
          <Field
            name="valintaperuste"
            component={renderSelectField}
            options={getValintaperusteetOptions(data || [])}
          />
        )}
      </ApiAsync>
    </>
  );
};

export default KuvausSection;
