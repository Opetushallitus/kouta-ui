import React, { useCallback } from 'react';
import queryString from 'query-string';

import ApiAsync from '../ApiAsync';
import FormPage, { OrganisaatioInfo } from '../FormPage';
import { getKoutaHakuByOid } from '../../apiUtils';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuForm from './CreateHakuForm';
import CreateHakuFooter from './CreateHakuFooter';

const getHaku = args => getKoutaHakuByOid(args);

const CreateHakuFormAsync = ({ hakuOid, organisaatioOid, ...props }) => (
  <>
    <OrganisaatioInfo organisaatioOid={organisaatioOid} />
    <ApiAsync promiseFn={getHaku} oid={hakuOid} watch={hakuOid}>
      {({ data }) =>
        data ? (
          <CreateHakuForm
            organisaatioOid={organisaatioOid}
            {...props}
          />
        ) : null
      }
    </ApiAsync>
  </>
);

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
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
      <CreateHakuFormAsync
        organisaatioOid={organisaatioOid}
        kopiohakuOid={kopiohakuOid}
        onCreateNew={onCreateNew}
      />
    </FormPage>
  );
};

export default CreateHakuPage;
