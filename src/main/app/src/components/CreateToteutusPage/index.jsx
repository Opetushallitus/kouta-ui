import React from 'react';

import FormPage from '../FormPage';

import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';

const CreateToteutusPage = () => (
  <FormPage
    header={<CreateToteutusHeader />}
    steps={<CreateToteutusSteps />}
    footer={<CreateToteutusFooter />}
  >
    <CreateToteutusForm />
  </FormPage>
);

export default CreateToteutusPage;
