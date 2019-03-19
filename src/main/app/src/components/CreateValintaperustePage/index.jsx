import React, { useCallback } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateValintaperusteHeader from './CreateValintaperusteHeader';
import CreateValintaperusteSteps from './CreateValintaperusteSteps';
import CreateValintaperusteForm from './CreateValintaperusteForm';
import CreateValintaperusteFooter from './CreateValintaperusteFooter';

const CreateValintaperustePage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const { kopioValintaperusteOid = null } = queryString.parse(search);

  const onCreateNew = useCallback(() => {
    history.replace({ search: '' });
  }, [history]);

  return (
    <FormPage
      header={<CreateValintaperusteHeader />}
      steps={<CreateValintaperusteSteps />}
      footer={<CreateValintaperusteFooter />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateValintaperusteForm
        organisaatioOid={oid}
        kopioValintaperusteOid={kopioValintaperusteOid}
        onCreateNew={onCreateNew}
      />
    </FormPage>
  );
};

export default CreateValintaperustePage;
