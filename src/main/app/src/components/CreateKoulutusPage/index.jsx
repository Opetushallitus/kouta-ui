import React from 'react';
import qs from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';
import useSelectBase from '../useSelectBase';

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const selectBase = useSelectBase(history, { kopioParam: 'kopioKoulutusOid' });

  const { kopioKoulutusOid = null, johtaaTutkintoon = 'true' } = qs.parse(
    search,
  );

  return (
    <FormPage
      header={<CreateKoulutusHeader />}
      steps={<CreateKoulutusSteps />}
      footer={<CreateKoulutusFooter organisaatioOid={oid} />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateKoulutusForm
        organisaatioOid={oid}
        kopioKoulutusOid={kopioKoulutusOid}
        johtaaTutkintoon={johtaaTutkintoon === 'true'}
        onSelectBase={selectBase}
      />
    </FormPage>
  );
};

export default CreateKoulutusPage;
