import React from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import Typography from '../Typography';
import Select from '../Select';
import ApiAsync from '../ApiAsync';
import { getKoutaValintaperusteet } from '../../apiUtils';
import { getFirstLanguageValue } from '../../utils';

const nop = () => {};

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
  <Select {...input} {...props} onBlur={nop} />
);

const KuvausSection = ({ haku, organisaatio }) => {
  const hakuOid = get(haku, 'oid');
  const organisaatioOid = get(organisaatio, 'oid');
  const watch = [hakuOid, organisaatioOid].join(',');

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Valitse kuvaus
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
