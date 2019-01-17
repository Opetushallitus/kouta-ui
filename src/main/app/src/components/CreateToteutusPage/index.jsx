import React from 'react';

import ApiAsync from '../ApiAsync';
import FormPage from '../FormPage';
import { getKoutaKoulutusByOid } from '../../apiUtils';

import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';

const getKoulutus = args => getKoutaKoulutusByOid(args);

const CreateToteutusFormAsync = ({ oid }) => (
  <ApiAsync promiseFn={getKoulutus} oid={oid} watch={oid}>
    {({ data }) =>
      data ? (
        <CreateToteutusForm koulutusKoodiUri={data.koulutusKoodiUri} />
      ) : null
    }
  </ApiAsync>
);

const CreateToteutusPage = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  return (
    <FormPage
      header={<CreateToteutusHeader />}
      steps={<CreateToteutusSteps />}
      footer={<CreateToteutusFooter />}
    >
      <CreateToteutusFormAsync oid={oid} />
    </FormPage>
  );
};

export default CreateToteutusPage;
