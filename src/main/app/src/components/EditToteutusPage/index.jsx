import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import getFormValuesByToteutus from '#/src/utils/getFormValuesByToteutus';
import getToteutusByOid from '#/src/utils/kouta/getToteutusByOid';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import ReduxForm from '#/src/components/ReduxForm';
import useApiAsync from '#/src/components/useApiAsync';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import FormSteps from '#/src/components/FormSteps';
import ToteutusFormWrapper from './ToteutusFormWrapper';
import EditToteutusFooter from './EditToteutusFooter';
import { ENTITY } from '#/src/constants';
import EntityFormHeader from '../EntityFormHeader';

const getToteutusAndKoulutus = async ({ httpClient, apiUrls, oid }) => {
  const toteutus = await getToteutusByOid({ httpClient, apiUrls, oid });

  if (!toteutus || !toteutus.koulutusOid) {
    return { toteutus };
  }

  const koulutus = await getKoulutusByOid({
    httpClient,
    apiUrls,
    oid: toteutus.koulutusOid,
  });

  return { toteutus, koulutus };
};

const EditToteutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { toteutusUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, toteutusUpdatedAt]);

  const { data: { toteutus = null, koulutus = null } = {} } = useApiAsync({
    promiseFn: getToteutusAndKoulutus,
    oid,
    watch,
  });

  const koulutustyyppi = koulutus ? koulutus.koulutustyyppi : null;
  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return toteutus && getFormValuesByToteutus(toteutus);
  }, [toteutus]);

  const onAttachHakukohde = useCallback(
    ({ hakuOid }) => {
      if (hakuOid && toteutus) {
        history.push(
          `/organisaatio/${toteutus.organisaatioOid}/toteutus/${toteutus.oid}/haku/${hakuOid}/hakukohde`
        );
      }
    },
    [history, toteutus]
  );

  return !toteutus ? (
    <Spin center />
  ) : (
    <ReduxForm form="editToteutusForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.toteutuksenMuokkaus')}</Title>
      <FormPage
        header={
          <EntityFormHeader entityType={ENTITY.TOTEUTUS} entity={toteutus} />
        }
        steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
        footer={
          toteutus ? (
            <EditToteutusFooter
              toteutus={toteutus}
              koulutus={koulutus}
              koulutustyyppi={koulutustyyppi}
              organisaatioOid={organisaatioOid}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <KoulutusRelation
            organisaatioOid={organisaatioOid}
            koulutus={koulutus}
          />
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {toteutus && koulutus ? (
          <ToteutusFormWrapper
            toteutus={toteutus}
            koulutus={koulutus}
            steps={false}
            canSelectBase={false}
            onAttachHakukohde={onAttachHakukohde}
            organisaatioOid={organisaatioOid}
            koulutusKoodiUri={koulutus ? koulutus.koulutusKoodiUri : null}
            koulutustyyppi={koulutustyyppi}
            ePerusteId={koulutus ? koulutus.ePerusteId : null}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default EditToteutusPage;
