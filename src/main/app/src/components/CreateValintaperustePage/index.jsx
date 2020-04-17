import React, { useMemo } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import CreateValintaperusteHeader from './CreateValintaperusteHeader';
import CreateValintaperusteSteps from './CreateValintaperusteSteps';
import ValintaperusteFormWrapper from './ValintaperusteFormWrapper';
import CreateValintaperusteFooter from './CreateValintaperusteFooter';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import { useTranslation } from 'react-i18next';
import ReduxForm from '#/src/components/ReduxForm';
import { POHJAVALINTA } from '#/src/constants';
import getFormValuesByValintaperuste from '#/src/utils/getFormValuesByValintaperuste';
import { initialValues } from '#/src/components/ValintaperusteForm';
import getValintaperusteByOid from '#/src/utils/kouta/getValintaperusteByOid';
import useApiAsync from '#/src/components/useApiAsync';

const resolveFn = () => Promise.resolve(null);

const getCopyValues = valintaperusteOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteOid },
  },
});

const getInitialValues = (valintaperuste, kieliValinnat) => {
  return valintaperuste && valintaperuste.oid
    ? {
        ...getCopyValues(valintaperuste.oid),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues(kieliValinnat);
};

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
  const promiseFn = kopioValintaperusteOid ? getValintaperusteByOid : resolveFn;

  const { data: valintaperuste } = useApiAsync({
    promiseFn,
    oid: kopioValintaperusteOid,
    watch: kopioValintaperusteOid,
  });

  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste, kieliValinnatLista);
  }, [valintaperuste, kieliValinnatLista]);

  return (
    <ReduxForm
      form="createValintaperusteForm"
      enableReinitialize
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiValintaperuste')}</Title>
      <FormPage
        header={<CreateValintaperusteHeader />}
        steps={<CreateValintaperusteSteps />}
        footer={<CreateValintaperusteFooter organisaatioOid={oid} />}
      >
        <TopInfoContainer>
          <OrganisaatioInfo organisaatioOid={oid} />
        </TopInfoContainer>
        <ValintaperusteFormWrapper
          steps
          organisaatioOid={oid}
          kopioValintaperusteOid={kopioValintaperusteOid}
          onSelectBase={selectBase}
          showArkistoituTilaOption={false}
          kieliValinnat={kieliValinnatLista}
        />
      </FormPage>
    </ReduxForm>
  );
};

export default CreateValintaperustePage;
