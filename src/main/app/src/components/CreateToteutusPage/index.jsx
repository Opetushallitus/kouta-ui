import React from 'react';

import ApiAsync from '../ApiAsync';
import FormPage, { OrganisaatioInfo } from '../FormPage';
import { getKoutaKoulutusByOid } from '../../apiUtils';

import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';

const getKoulutus = args => getKoutaKoulutusByOid(args);

const CreateToteutusFormAsync = ({ koulutusOid, organisaatioOid }) => (
  <>
    <OrganisaatioInfo organisaatioOid={organisaatioOid} />
    <ApiAsync promiseFn={getKoulutus} oid={koulutusOid} watch={koulutusOid}>
      {({ data }) =>
        data ? (
          <CreateToteutusForm
            koulutusKoodiUri={data.koulutusKoodiUri}
            organisaatioOid={organisaatioOid}
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
  } = props;

  return (
    <FormPage
      header={<CreateToteutusHeader />}
      steps={<CreateToteutusSteps />}
      footer={<CreateToteutusFooter />}
    >
      <CreateToteutusFormAsync
        koulutusOid={koulutusOid}
        organisaatioOid={organisaatioOid}
      />
    </FormPage>
  );
};

export default CreateToteutusPage;
