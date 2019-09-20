import React from 'react';
import qs from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { search },
    history,
  } = props;

  const selectBase = useSelectBase(history, { kopioParam: 'kopioKoulutusOid' });
  const { t } = useTranslation();

  const { kopioKoulutusOid = null } = qs.parse(search);

  return (
    <>
      <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
      <FormPage
        header={<CreateKoulutusHeader />}
        steps={<CreateKoulutusSteps />}
        footer={<CreateKoulutusFooter organisaatioOid={oid} />}
      >
        <OrganisaatioInfo organisaatioOid={oid} />
        <CreateKoulutusForm
          organisaatioOid={oid}
          kopioKoulutusOid={kopioKoulutusOid}
          onSelectBase={selectBase}
          showArkistoituTilaOption={false}
        />
      </FormPage>
    </>
  );
};

export default CreateKoulutusPage;
