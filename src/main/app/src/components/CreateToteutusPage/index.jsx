import React, { useCallback } from 'react';
import queryString from 'query-string';

import ApiAsync from '../ApiAsync';
import FormPage, { OrganisaatioInfo } from '../FormPage';
import { getKoutaKoulutusByOid } from '../../apiUtils';

import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';

const getKoulutus = args => getKoutaKoulutusByOid(args);

const CreateToteutusFormAsync = ({ koulutusOid, organisaatioOid, ...props }) => (
  <>
    <OrganisaatioInfo organisaatioOid={organisaatioOid} />
    <ApiAsync promiseFn={getKoulutus} oid={koulutusOid} watch={koulutusOid}>
      {({ data }) =>
        data ? (
          <CreateToteutusForm
            koulutusKoodiUri={data.koulutusKoodiUri}
            organisaatioOid={organisaatioOid}
            {...props}
          />
        ) : null
      }
    </ApiAsync>
  </>
);

const CreateToteutusPage = props => {
  const {
    match: {
      params: { organisaatioOid, koulutusOid },
    },
    location: {
      search,
    },
    history,
  } = props;

  const { kopioToteutusOid = null } = queryString.parse(search);

  const onCreateNew = useCallback(() => {
    history.replace({ search: '' });
  }, [history]);

  return (
    <FormPage
      header={<CreateToteutusHeader />}
      steps={<CreateToteutusSteps />}
      footer={<CreateToteutusFooter />}
    >
      <CreateToteutusFormAsync
        koulutusOid={koulutusOid}
        organisaatioOid={organisaatioOid}
        kopioToteutusOid={kopioToteutusOid}
        onCreateNew={onCreateNew}
      />
    </FormPage>
  );
};

export default CreateToteutusPage;
