import React from 'react';

import FormPage from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';
import OrganisaatioInfo from './OrganisaatioInfo';

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  return (
    <FormPage
      header={<CreateKoulutusHeader />}
      steps={<CreateKoulutusSteps />}
      footer={<CreateKoulutusFooter />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateKoulutusForm organisaatioOid={oid} />
    </FormPage>
  );
};

export default CreateKoulutusPage;
