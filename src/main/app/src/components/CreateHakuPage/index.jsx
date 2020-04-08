import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import useCreateHakuFormInitialValues from './useCreateHakuFormInitialValues';
import CreateHakuFooter from './CreateHakuFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import HakuForm from '#/src/components/HakuForm';

const config = getHakuFormConfig();

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

  useCreateHakuFormInitialValues({ kopioHakuOid });
  return (
    <ReduxForm form="createHakuForm" enableReinitialize>
      {() => (
        <FormConfigContext.Provider value={config}>
          <Title>{t('sivuTitlet.uusiHaku')}</Title>
          <FormPage
            header={<CreateHakuHeader />}
            steps={<CreateHakuSteps />}
            footer={<CreateHakuFooter organisaatioOid={organisaatioOid} />}
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            <HakuForm
              steps
              organisaatioOid={organisaatioOid}
              kopioHakuOid={kopioHakuOid}
              onSelectBase={selectBase}
              showArkistoituTilaOption={false}
            />
          </FormPage>
        </FormConfigContext.Provider>
      )}
    </ReduxForm>
  );
};

export default CreateHakuPage;
