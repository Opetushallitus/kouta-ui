import React, { useCallback } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateSoraKuvausHeader from './CreateSoraKuvausHeader';
import CreateSoraKuvausSteps from './CreateSoraKuvausSteps';
import CreateSoraKuvausForm from './CreateSoraKuvausForm';
import CreateSoraKuvausFooter from './CreateSoraKuvausFooter';

const CreateSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioSoraKuvausOid = null } = queryString.parse(search);

  const onCreateNew = useCallback(() => {
    history.replace({ search: '' });
  }, [history]);

  return (
    <FormPage
      header={<CreateSoraKuvausHeader />}
      steps={<CreateSoraKuvausSteps />}
      footer={<CreateSoraKuvausFooter />}
    >
      <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      <CreateSoraKuvausForm
        organisaatioOid={organisaatioOid}
        kopioSoraKuvausOid={kopioSoraKuvausOid}
        onCreateNew={onCreateNew}
      />
    </FormPage>
  );
};

export default CreateSoraKuvausPage;
