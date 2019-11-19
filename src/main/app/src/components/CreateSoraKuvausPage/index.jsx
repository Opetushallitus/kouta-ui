import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateSoraKuvausHeader from './CreateSoraKuvausHeader';
import CreateSoraKuvausSteps from './CreateSoraKuvausSteps';
import CreateSoraKuvausForm from './CreateSoraKuvausForm';
import CreateSoraKuvausFooter from './CreateSoraKuvausFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';

const CreateSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid, kieliValinnat },
    },
    location: { search },
    history,
  } = props;

  const { kopioSoraKuvausOid = null } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioSoraKuvausOid',
  });

  return (
    <>
      <Title>{t('sivuTitlet.uusiSoraKuvaus')}</Title>
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
          kieliValinnat={kieliValinnat}
        />
      </FormPage>
    </>
  );
};

export default CreateSoraKuvausPage;
