import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import FormPage, {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import FullSpin from '#/src/components/FullSpin';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';
import { useHakukohdeByOid } from '#/src/utils/hakukohde/getHakukohdeByOid';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import { HakukohdeForm } from './HakukohdeForm';

const FORM_NAME = 'hakukohdeForm';

export const EditHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;
  const apiUrls = useUrls();

  const { data: hakukohde, isFetching: hakukohdeLoading } =
    useHakukohdeByOid(oid);

  const {
    data: { toteutus, haku, koulutustyyppi, tarjoajat } = {},
    isFetching: pageDataLoading,
  } = useHakukohdePageData(
    {
      hakuOid: hakukohde?.hakuOid,
      toteutusOid: hakukohde?.toteutusOid,
    },
    { enabled: Boolean(hakukohde) }
  );

  const isLoading = hakukohdeLoading || pageDataLoading;

  const { t } = useTranslation();

  const canUpdate = useCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE,
    hakukohde?.organisaatioOid
  );

  const initialValues = useMemo(
    () => (hakukohde ? getFormValuesByHakukohde(hakukohde) : {}),
    [hakukohde]
  );

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form={FORM_NAME}
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.hakukohteenMuokkaus')}</Title>
      <FormPage
        readOnly={!canUpdate}
        header={
          <EntityFormHeader entityType={ENTITY.HAKUKOHDE} entity={hakukohde} />
        }
        steps={<FormSteps activeStep={ENTITY.HAKUKOHDE} />}
        footer={
          <HakukohdeFooter
            formMode={FormMode.EDIT}
            organisaatioOid={organisaatioOid}
            hakukohde={hakukohde}
            toteutus={toteutus}
            koulutustyyppi={
              koulutustyyppi || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
            }
            haku={haku}
            canUpdate={canUpdate}
          />
        }
        esikatseluControls={
          <EsikatseluControls
            esikatseluUrl={apiUrls.url(
              'konfo-ui.toteutus',
              hakukohde?.toteutusOid
            )}
          />
        }
      >
        <>
          <RelationInfoContainer>
            <HakuRelation organisaatioOid={organisaatioOid} haku={haku} />
            <ToteutusRelation
              organisaatioOid={organisaatioOid}
              toteutus={toteutus}
            />
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          <HakukohdeForm
            steps={false}
            organisaatioOid={organisaatioOid}
            haku={haku}
            toteutus={toteutus}
            tarjoajat={tarjoajat}
            koulutustyyppi={
              koulutustyyppi || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
            }
          />
        </>
      </FormPage>
    </ReduxForm>
  );
};
