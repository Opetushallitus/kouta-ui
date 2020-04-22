import React, { useMemo } from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import FormPage, {
  OrganisaatioInfo,
  KoulutusInfo,
  TopInfoContainer,
} from '../FormPage';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import ToteutusFormWrapper from './ToteutusFormWrapper';
import CreateToteutusFooter from './CreateToteutusFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import { KOULUTUSTYYPPI, POHJAVALINTA } from '../../constants';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import { useTranslation } from 'react-i18next';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByToteutus from '#/src/utils/getFormValuesByToteutus';
import { initialValues } from '#/src/components/ToteutusForm';

const resolveFn = () => Promise.resolve();

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = (toteutus, koulutusNimi, koulutusKielet) => {
  return toteutus
    ? { ...getCopyValues(toteutus.oid), ...getFormValuesByToteutus(toteutus) }
    : initialValues(koulutusNimi, koulutusKielet);
};

const CreateToteutusPage = props => {
  const {
    match: {
      params: { organisaatioOid, koulutusOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioToteutusOid = null } = queryString.parse(search);

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const selectBase = useSelectBase(history, { kopioParam: 'kopioToteutusOid' });
  const { t } = useTranslation();

  const koulutustyyppi =
    koulutus && koulutus.koulutustyyppi
      ? koulutus.koulutustyyppi
      : KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const koulutusNimi = _.get(koulutus, 'nimi');
  const koulutusKielet = _.get(koulutus, 'kielivalinta');

  const promiseFn = kopioToteutusOid ? getToteutusByOid : resolveFn;

  const { data } = useApiAsync({
    promiseFn,
    oid: kopioToteutusOid,
    watch: kopioToteutusOid,
  });
  const initialValues = useMemo(() => {
    return koulutustyyppi === 'amm'
      ? getInitialValues(data, koulutusNimi, koulutusKielet)
      : getInitialValues(data, null, koulutusKielet);
  }, [data, koulutustyyppi, koulutusNimi, koulutusKielet]);

  return (
    <ReduxForm
      form="createToteutusForm"
      enableReinitialize
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormPage
        header={<CreateToteutusHeader />}
        steps={<CreateToteutusSteps />}
        footer={
          koulutus ? (
            <CreateToteutusFooter
              koulutustyyppi={koulutustyyppi}
              organisaatioOid={organisaatioOid}
              koulutusOid={koulutusOid}
            />
          ) : null
        }
      >
        <TopInfoContainer>
          <KoulutusInfo organisaatioOid={organisaatioOid} koulutus={koulutus} />
          <OrganisaatioInfo organisaatioOid={organisaatioOid} />
        </TopInfoContainer>
        {koulutus ? (
          <ToteutusFormWrapper
            steps
            koulutus={koulutus}
            ePerusteId={koulutus.ePerusteId}
            koulutusKoodiUri={koulutus.koulutusKoodiUri}
            koulutusNimi={koulutus.nimi}
            koulutusKielet={koulutus.kielivalinta}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
            kopioToteutusOid={kopioToteutusOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default CreateToteutusPage;
