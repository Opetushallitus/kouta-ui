import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditKoulutusHeader from './EditKoulutusHeader';
import EditKoulutusSteps from './EditKoulutusSteps';
import EditKoulutusForm from './EditKoulutusForm';
import EditKoulutusFooter from './EditKoulutusFooter';
import useApiAsync from '../useApiAsync';
import { getKoutaKoulutusByOid } from '../../apiUtils';
import Spin from '../Spin';

const EditKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search, state = {} },
  } = props;

  const { koulutusUpdatedAt = null } = state;
  const { scrollTarget = null, organisaatioOid: myOrganisaatioOid, liitos } = queryString.parse(search);
  const watch = JSON.stringify([oid, koulutusUpdatedAt]);
  const isLiitos = liitos === 'true';

  const { data: koulutus = null } = useApiAsync({
    promiseFn: getKoutaKoulutusByOid,
    oid,
    watch,
  });

  const organisaatioOid = koulutus ? koulutus.organisaatioOid : null;
  const headerOrganisaatioOid = myOrganisaatioOid || organisaatioOid;

  return (
    <FormPage
      header={<EditKoulutusHeader koulutus={koulutus} />}
      steps={<EditKoulutusSteps />}
      footer={koulutus ? <EditKoulutusFooter koulutus={koulutus} liitos={isLiitos} myOrganisaatioOid={myOrganisaatioOid} /> : null}
    >
      {headerOrganisaatioOid ? (
        <OrganisaatioInfo organisaatioOid={headerOrganisaatioOid} />
      ) : null}
      {koulutus ? (
        <EditKoulutusForm
          koulutus={koulutus}
          organisaatioOid={organisaatioOid}
          scrollTarget={scrollTarget}
          myOrganisaatioOid={myOrganisaatioOid}
          liitos={isLiitos}
        />
      ) : <Spin center />}
    </FormPage>
  );
};

export default EditKoulutusPage;
