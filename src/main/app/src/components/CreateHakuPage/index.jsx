import React, { useCallback } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuForm from './CreateHakuForm';
import CreateHakuFooter from './CreateHakuFooter';

const CreateHakuPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const { kopiohakuOid = null } = queryString.parse(search);

  const onCreateNew = useCallback(() => {
    history.replace({ search: '' });
  }, [history]);

  return (
    <FormPage
      header={<CreateHakuHeader />}
      steps={<CreateHakuSteps />}
      footer={<CreateHakuFooter />}
    >
      <OrganisaatioInfo organisaatioOid={oid} />
      <CreateHakuForm
        organisaatioOid={oid}
        kopiohakuOid={kopiohakuOid}
        onCreateNew={onCreateNew}
      />
    </FormPage>
  );
};

export default CreateHakuPage;
