import React, { useMemo } from 'react';
import qs from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import CreateKoulutusHeader from './CreateKoulutusHeader';
import CreateKoulutusSteps from './CreateKoulutusSteps';
import KoulutusFormWrapper from './KoulutusFormWrapper';
import CreateKoulutusFooter from './CreateKoulutusFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';
import { POHJAVALINTA } from '#/src/constants';
import getFormValuesByKoulutus from '#/src/utils/getFormValuesByKoulutus';
import { initialValues } from '#/src/components/KoulutusForm';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import useApiAsync from '../useApiAsync';

const resolveFn = () => Promise.resolve();

const getCopyValues = koulutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: koulutusOid },
  },
});

const getInitialValues = koulutus => {
  return koulutus
    ? { ...getCopyValues(koulutus.oid), ...getFormValuesByKoulutus(koulutus) }
    : initialValues;
};

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

  const promiseFn = kopioKoulutusOid ? getKoulutusByOid : resolveFn;
  const { data } = useApiAsync({
    promiseFn,
    oid: kopioKoulutusOid,
    watch: kopioKoulutusOid,
  });
  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="createKoulutusForm"
      enableReinitialize
      initialValues={initialValues}
    >
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
            <KoulutusFormWrapper
              steps
              isNewKoulutus={true}
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
