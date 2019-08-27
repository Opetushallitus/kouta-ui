import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuForm from './CreateHakuForm';
import CreateHakuFooter from './CreateHakuFooter';
import useSelectBase from '../useSelectBase';

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioHakuOid = null } = queryString.parse(search);

  const selectBase = useSelectBase(history, { kopioParam: 'kopioHakuOid' });

  return (
    <FormPage
      header={<CreateHakuHeader />}
      steps={<CreateHakuSteps />}
      footer={<CreateHakuFooter organisaatioOid={organisaatioOid} />}
    >
      <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      <CreateHakuForm
        organisaatioOid={organisaatioOid}
        kopioHakuOid={kopioHakuOid}
        onSelectBase={selectBase}
        showArkistoituTilaOption={false}
      />
    </FormPage>
  );
};

export default CreateHakuPage;
