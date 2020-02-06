import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
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
      params: { oid, kieliValinnat },
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
        <TopInfoContainer>
          <OrganisaatioInfo organisaatioOid={oid} />
        </TopInfoContainer>
        <CreateValintaperusteForm
          organisaatioOid={oid}
          kopioValintaperusteOid={kopioValintaperusteOid}
          onSelectBase={selectBase}
          showArkistoituTilaOption={false}
          kieliValinnat={kieliValinnat}
        />
      </FormPage>
    </>
  );
};

export default CreateValintaperustePage;
