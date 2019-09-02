import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateValintaperusteHeader from './CreateValintaperusteHeader';
import CreateValintaperusteSteps from './CreateValintaperusteSteps';
import CreateValintaperusteForm from './CreateValintaperusteForm';
import CreateValintaperusteFooter from './CreateValintaperusteFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';

const CreateValintaperustePage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const { kopioValintaperusteOid = null } = queryString.parse(search);

  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioValintaperusteOid',
  });

  const { t } = useTranslation();

  return (
    <>
      <Title>{t('sivuTitlet.uusiValintaperuste')}</Title>
      <FormPage
        header={<CreateValintaperusteHeader />}
        steps={<CreateValintaperusteSteps />}
        footer={<CreateValintaperusteFooter organisaatioOid={oid} />}
      >
        <OrganisaatioInfo organisaatioOid={oid} />
        <CreateValintaperusteForm
          organisaatioOid={oid}
          kopioValintaperusteOid={kopioValintaperusteOid}
          onSelectBase={selectBase}
          showArkistoituTilaOption={false}
        />
      </FormPage>
    </>
  );
};

export default CreateValintaperustePage;
