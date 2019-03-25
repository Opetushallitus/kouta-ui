import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditHakuHeader from './EditHakuHeader';
import EditHakuSteps from './EditHakuSteps';
import EditHakuForm from './EditHakuForm';
import EditHakuFooter from './EditHakuFooter';
import useApiAsync from '../useApiAsync';
import { getKoutaHakuByOid } from '../../apiUtils';

const EditHakuPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search, state = {} },
  } = props;

  const { hakuUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, hakuUpdatedAt]);

  const { data: haku = null } = useApiAsync({
    promiseFn: getKoutaHakuByOid,
    oid,
    watch,
  });

  const organisaatioOid = haku ? haku.organisaatioOid : null;

  return (
    <FormPage
      header={<EditHakuHeader haku={haku} />}
      steps={<EditHakuSteps />}
      footer={haku ? <EditHakuFooter haku={haku} /> : null}
    >
      {organisaatioOid ? (
        <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      ) : null}
      {haku ? (
        <EditHakuForm
          haku={haku}
          organisaatioOid={organisaatioOid}
          scrollTarget={scrollTarget}
        />
      ) : null}
    </FormPage>
  );
};

export default EditHakuPage;
