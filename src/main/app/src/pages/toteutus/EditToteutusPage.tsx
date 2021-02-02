import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';
import { useToteutusByOid } from '#/src/utils/toteutus/getToteutusByOid';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import ReduxForm from '#/src/components/ReduxForm';
import { Spin } from '#/src/components/virkailija';
import Title from '#/src/components/Title';
import FormSteps from '#/src/components/FormSteps';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import FullSpin from '#/src/components/FullSpin';
import ToteutusForm from './ToteutusForm';
import { ToteutusFooter } from './ToteutusFooter';

const EditToteutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;

  const { data: toteutus, isFetching: isToteutusFetching } = useToteutusByOid(
    oid
  );

  const { data: koulutus, isFetching: isKoulutusFetching } = useKoulutusByOid(
    toteutus?.koulutusOid,
    {
      enabled: Boolean(toteutus),
    }
  );

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

  const canUpdate = useCurrentUserHasRole(
    ENTITY.TOTEUTUS,
    CRUD_ROLES.UPDATE,
    toteutus?.organisaatioOid
  );

  const config = useEntityFormConfig(ENTITY.TOTEUTUS, koulutustyyppi);

  return !toteutus ? (
    <FullSpin />
  ) : (
    <ReduxForm form="toteutusForm" initialValues={initialValues}>
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
              <ToteutusFooter
                formMode={FormMode.EDIT}
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
          {!isKoulutusFetching && !isToteutusFetching ? (
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
