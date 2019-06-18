import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const {
    kopioKoulutusOid = null,
    johtaaTutkintoon = 'true',
  } = queryString.parse(search);

  return (
    <FormPage
      header={<CreateKoulutusHeader />}
      steps={<CreateKoulutusSteps />}
      footer={<CreateKoulutusFooter />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateKoulutusForm
        organisaatioOid={oid}
        kopioKoulutusOid={kopioKoulutusOid}
        johtaaTutkintoon={johtaaTutkintoon === 'true'}
        onCreateNew={() => {
          history.replace({ search: '' });
        }}
      />
    </FormPage>
  );
};

export default CreateKoulutusPage;
