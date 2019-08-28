import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateSoraKuvausHeader from './CreateSoraKuvausHeader';
import CreateSoraKuvausSteps from './CreateSoraKuvausSteps';
import CreateSoraKuvausForm from './CreateSoraKuvausForm';
import CreateSoraKuvausFooter from './CreateSoraKuvausFooter';
import useSelectBase from '../useSelectBase';

const CreateSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioSoraKuvausOid = null } = queryString.parse(search);

  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioSoraKuvausOid',
  });

  return (
    <FormPage
      header={<CreateSoraKuvausHeader />}
      steps={<CreateSoraKuvausSteps />}
      footer={<CreateSoraKuvausFooter organisaatioOid={organisaatioOid} />}
    >
      <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      <CreateSoraKuvausForm
        organisaatioOid={organisaatioOid}
        kopioSoraKuvausOid={kopioSoraKuvausOid}
        onSelectBase={selectBase}
        showArkistoituTilaOption={false}
      />
    </FormPage>
  );
};

export default CreateSoraKuvausPage;
