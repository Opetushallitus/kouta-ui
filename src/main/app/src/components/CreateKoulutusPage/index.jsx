import React from 'react';

import FormPage from '../FormPage';

import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';

const CreateKoulutusPage = () => (
  <FormPage
    header={<CreateKoulutusHeader />}
    steps={<CreateKoulutusSteps />}
    footer={<CreateKoulutusFooter />}
  >
    <CreateKoulutusForm />
  </FormPage>
);

export default CreateKoulutusPage;
