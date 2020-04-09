import React, { useMemo } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';

import CreateHakuHeader from './CreateHakuHeader';
import CreateHakuSteps from './CreateHakuSteps';
import CreateHakuFooter from './CreateHakuFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import HakuForm, { initialValues } from '#/src/components/HakuForm';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import useApiAsync from '#/src/components/useApiAsync';
import { POHJAVALINTA } from '#/src/constants';
import getFormValuesByHaku from '#/src/utils/getFormValuesByHaku';

const config = getHakuFormConfig();
const resolveFn = () => Promise.resolve();

const getCopyValues = hakuOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: hakuOid },
  },
});

const getInitialValues = haku => {
  return haku
    ? { ...getCopyValues(haku.oid), ...getFormValuesByHaku(haku) }
    : initialValues;
};

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

  const promiseFn = kopioHakuOid ? getHakuByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioHakuOid,
    watch: kopioHakuOid,
  });
  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="createHakuForm"
      enableReinitialize
      initialValues={initialValues}
    >
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
            <FormConfigContext.Provider value={config}>
              <HakuForm
                steps
                organisaatioOid={organisaatioOid}
                kopioHakuOid={kopioHakuOid}
                onSelectBase={selectBase}
                showArkistoituTilaOption={false}
              />
            </FormConfigContext.Provider>
          </FormPage>
        </>
      )}
    </ReduxForm>
  );
};

export default CreateHakuPage;
