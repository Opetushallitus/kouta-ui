import React from 'react';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateValintaperusteetHeader from './CreateValintaperusteetHeader';
import CreateValintaperusteetSteps from './CreateValintaperusteetSteps';
import CreateValintaperusteetForm from './CreateValintaperusteetForm';
import CreateValintaperusteetFooter from './CreateValintaperusteetFooter';

const CreateValintaperusteetPage = props => {
  const {
    match: {
      params: { oid },
    },
  } = props;

  return (
    <FormPage
      header={<CreateValintaperusteetHeader />}
      steps={<CreateValintaperusteetSteps />}
      footer={<CreateValintaperusteetFooter />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateValintaperusteetForm organisaatioOid={oid} />
    </FormPage>
  );
};

export default CreateValintaperusteetPage;
