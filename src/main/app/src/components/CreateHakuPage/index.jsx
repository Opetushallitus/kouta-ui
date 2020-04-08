import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuForm from './CreateHakuForm';
import CreateHakuFooter from './CreateHakuFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioHakuOid = null } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase(history, { kopioParam: 'kopioHakuOid' });

  return (
    <ReduxForm form="createHakuForm" enableReinitialize>
      {() => (
        <>
          <Title>{t('sivuTitlet.uusiHaku')}</Title>
          <FormPage
            header={<CreateHakuHeader />}
            steps={<CreateHakuSteps />}
            footer={<CreateHakuFooter organisaatioOid={organisaatioOid} />}
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            <CreateHakuForm
              organisaatioOid={organisaatioOid}
              kopioHakuOid={kopioHakuOid}
              onSelectBase={selectBase}
              showArkistoituTilaOption={false}
            />
          </FormPage>
        </>
      )}
    </ReduxForm>
  );
};

export default CreateHakuPage;
