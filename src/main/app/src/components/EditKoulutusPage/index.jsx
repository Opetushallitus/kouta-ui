import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditKoulutusHeader from './EditKoulutusHeader';
import EditKoulutusSteps from './EditKoulutusSteps';
import EditKoulutusForm from './EditKoulutusForm';
import EditKoulutusFooter from './EditKoulutusFooter';
import useApiAsync from '../useApiAsync';
import { getKoutaKoulutusByOid } from '../../apiUtils';

const EditKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search, state = {} },
  } = props;

  const { koulutusUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, koulutusUpdatedAt]);

  const { data: koulutus = null } = useApiAsync({
    promiseFn: getKoutaKoulutusByOid,
    oid,
    watch,
  });

  const organisaatioOid = koulutus ? koulutus.organisaatioOid : null;

  return (
    <FormPage
      header={<EditKoulutusHeader koulutus={koulutus} />}
      steps={<EditKoulutusSteps />}
      footer={koulutus ? <EditKoulutusFooter koulutus={koulutus} /> : null}
    >
      {organisaatioOid ? (
        <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      ) : null}
      {koulutus ? (
        <EditKoulutusForm
          koulutus={koulutus}
          organisaatioOid={organisaatioOid}
          scrollTarget={scrollTarget}
        />
      ) : null}
    </FormPage>
  );
};

export default EditKoulutusPage;
