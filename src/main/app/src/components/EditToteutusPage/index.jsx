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
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import ToteutusForm from '#/src/components/ToteutusForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import FullSpin from '#/src/components/FullSpin';
import EditToteutusFooter from './EditToteutusFooter';

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

  const FORM_NAME = 'editToteutusForm';

  const canUpdate = useCurrentUserHasRole(
    ENTITY.TOTEUTUS,
    CRUD_ROLES.UPDATE,
    toteutus?.organisaatioOid
  );

  const config = useEntityFormConfig(ENTITY.TOTEUTUS, koulutustyyppi);

  return !toteutus ? (
    <FullSpin />
  ) : (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.toteutuksenMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
        <FormPage
          readOnly={!canUpdate}
          header={
            <EntityFormHeader
              entityType={ENTITY.TOTEUTUS}
              entity={toteutus}
              canUpdate={canUpdate}
            />
          }
          steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
          footer={
            toteutus ? (
              <EditToteutusFooter
                toteutus={toteutus}
                koulutus={koulutus}
                koulutustyyppi={koulutustyyppi}
                organisaatioOid={organisaatioOid}
                canUpdate={canUpdate}
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
            <ToteutusForm
              toteutus={toteutus}
              koulutus={koulutus}
              steps={false}
              canSelectBase={false}
              onAttachHakukohde={onAttachHakukohde}
              organisaatioOid={organisaatioOid}
              koulutustyyppi={koulutustyyppi}
            />
          ) : (
            <Spin center />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default EditToteutusPage;
