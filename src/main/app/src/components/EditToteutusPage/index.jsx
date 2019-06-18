import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditToteutusHeader from './EditToteutusHeader';
import EditToteutusSteps from './EditToteutusSteps';
import EditToteutusForm from './EditToteutusForm';
import EditToteutusFooter from './EditToteutusFooter';
import useApiAsync from '../useApiAsync';
import { getKoutaToteutusByOid } from '../../apiUtils';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import Spin from '../Spin';

const getToteutusAndKoulutus = async ({ httpClient, apiUrls, oid }) => {
  const toteutus = await getKoutaToteutusByOid({ httpClient, apiUrls, oid });

  if (!toteutus || !toteutus.koulutusOid) {
    return { toteutus };
  }

  const koulutus = await getKoulutusByOid({
    httpClient,
    apiUrls,
    oid: toteutus.koulutusOid,
  });

  return { toteutus, koulutus };
};

const EditToteutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search, state = {} },
  } = props;

  const { toteutusUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, toteutusUpdatedAt]);

  const { data: { toteutus = null, koulutus = null } = {} } = useApiAsync({
    promiseFn: getToteutusAndKoulutus,
    oid,
    watch,
  });

  const organisaatioOid = toteutus ? toteutus.organisaatioOid : null;

  return (
    <FormPage
      header={<EditToteutusHeader toteutus={toteutus} />}
      steps={<EditToteutusSteps />}
      footer={toteutus ? <EditToteutusFooter toteutus={toteutus} /> : null}
    >
      {organisaatioOid ? (
        <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      ) : null}
      {toteutus ? (
        <EditToteutusForm
          toteutus={toteutus}
          organisaatioOid={organisaatioOid}
          koulutusKoodiUri={koulutus ? koulutus.koulutusKoodiUri : null}
          koulutustyyppi={koulutus ? koulutus.koulutustyyppi : null}
          scrollTarget={scrollTarget}
        />
      ) : (
        <Spin center />
      )}
    </FormPage>
  );
};

export default EditToteutusPage;
