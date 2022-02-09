import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import FullSpin from '#/src/components/FullSpin';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useExtendedEPeruste from '#/src/utils/ePeruste/useExtendedEPeruste';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';
import { useToteutusByOid } from '#/src/utils/toteutus/getToteutusByOid';

import { ToteutusFooter } from './ToteutusFooter';
import ToteutusForm from './ToteutusForm';
const FORM_NAME = 'toteutusForm';

export const EditToteutusPage = () => {
  const history = useHistory();
  const { organisaatioOid, oid } = useParams();

  const { data: toteutus, isFetching: isToteutusFetching } =
    useToteutusByOid(oid);

  const { data: koulutus, isFetching: isKoulutusFetching } = useKoulutusByOid(
    toteutus?.koulutusOid,
    {
      enabled: Boolean(toteutus?.koulutusOid),
    }
  );

  const { ePerusteId } = koulutus || {};
  const { data: ePeruste, isLoading: isEPerusteFetching } =
    useExtendedEPeruste(ePerusteId);

  const koulutustyyppi = koulutus ? koulutus.koulutustyyppi : null;
  const { t } = useTranslation();

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

  const initialValues = useMemo(
    () =>
      toteutus && !isEPerusteFetching
        ? getFormValuesByToteutus(toteutus, ePeruste)
        : {},
    [toteutus, isEPerusteFetching, ePeruste]
  );

  return !toteutus ||
    (koulutustyyppi === KOULUTUSTYYPPI.OSAAMISALA && !ePeruste) ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form={FORM_NAME}
      mode={FormMode.EDIT}
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.toteutuksenMuokkaus')}</Title>
      <FormPage
        readOnly={!canUpdate}
        header={
          <EntityFormHeader entityType={ENTITY.TOTEUTUS} entity={toteutus} />
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
              peruste={ePeruste}
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
        {!isKoulutusFetching && !isToteutusFetching && !isEPerusteFetching ? (
          <ToteutusForm
            toteutus={toteutus}
            koulutus={koulutus}
            peruste={ePeruste}
            steps={false}
            onAttachHakukohde={onAttachHakukohde}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};
