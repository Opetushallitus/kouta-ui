import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
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
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useUrls } from '#/src/contexts/contextHooks';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';
import { useToteutusByOid } from '#/src/utils/toteutus/getToteutusByOid';

import { ToteutusFooter } from './ToteutusFooter';
import ToteutusForm from './ToteutusForm';

const FORM_NAME = 'toteutusForm';

const EditToteutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;
  const apiUrls = useUrls();

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

  const initialValues = useMemo(
    () => (toteutus ? getFormValuesByToteutus(toteutus) : {}),
    [toteutus]
  );

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
          esikatseluControls={
            <EsikatseluControls
              esikatseluUrl={apiUrls.url('konfo-ui.toteutus', oid)}
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
