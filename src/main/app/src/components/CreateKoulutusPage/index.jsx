import React from 'react';
import qs from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import CreateKoulutusForm from './CreateKoulutusForm';
import CreateKoulutusFooter from './CreateKoulutusFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';

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
    <ReduxForm form="createKoulutusForm" enableReinitialize>
      {() => (
        <>
          <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
          <FormPage
            header={<CreateKoulutusHeader />}
            steps={<CreateKoulutusSteps />}
            footer={<CreateKoulutusFooter organisaatioOid={oid} />}
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={oid} />
            </TopInfoContainer>
            <CreateKoulutusForm
              organisaatioOid={oid}
              kopioKoulutusOid={kopioKoulutusOid}
              onSelectBase={selectBase}
            />
          </FormPage>
        </>
      )}
    </ReduxForm>
  );
};

export default CreateKoulutusPage;
