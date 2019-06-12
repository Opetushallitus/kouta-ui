import React, { useCallback } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import { getKoutaKoulutusByOid } from '../../apiUtils';

import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';

const CreateToteutusPage = props => {
  const {
    match: {
      params: { organisaatioOid, koulutusOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioToteutusOid = null } = queryString.parse(search);

  const onCreateNew = useCallback(() => {
    history.replace({ search: '' });
  }, [history]);

  const { data } = useApiAsync({
    promiseFn: getKoutaKoulutusByOid,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const koulutustyyppi =
    data && data.koulutustyyppi
      ? data.koulutustyyppi
      : KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  return (
    <FormPage
      header={<CreateToteutusHeader />}
      steps={<CreateToteutusSteps />}
      footer={
        data ? <CreateToteutusFooter koulutustyyppi={koulutustyyppi} /> : null
      }
    >
      <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      {data ? (
        <CreateToteutusForm
          koulutusKoodiUri={data.koulutusKoodiUri}
          organisaatioOid={organisaatioOid}
          koulutustyyppi={koulutustyyppi}
          kopioToteutusOid={kopioToteutusOid}
          onCreateNew={onCreateNew}
        />
      ) : (
        <Spin center />
      )}
    </FormPage>
  );
};

export default CreateToteutusPage;
