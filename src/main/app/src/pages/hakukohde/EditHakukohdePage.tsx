import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useHakukohdeByOid } from '#/src/utils/hakukohde/getHakukohdeByOid';
import FullSpin from '#/src/components/FullSpin';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import HakukohdeForm from './HakukohdeForm';
import FormPage, {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useEntityFormConfig } from '#/src/hooks/form';
import { HakukohdeFooter } from './HakukohdeFooter';
import { useHakukohdePageData } from './getHakukohdePageData';

const EditHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;

  const { data: hakukohde, isFetching: hakukohdeLoading } = useHakukohdeByOid({
    oid,
  });

  const {
    data: { toteutus, haku, koulutustyyppi, tarjoajat } = {},
    isFetching: pageDataLoading,
  } = useHakukohdePageData(
    {
      hakuOid: hakukohde?.hakuOid,
      toteutusOid: hakukohde?.toteutusOid,
    },
    { enabled: hakukohde }
  );

  const isLoading = hakukohdeLoading || pageDataLoading;

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return hakukohde && getFormValuesByHakukohde(hakukohde);
  }, [hakukohde]);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE,
    hakukohde?.organisaatioOid
  );

  const config = useEntityFormConfig(ENTITY.HAKUKOHDE);

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm form="hakukohdeForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.hakukohteenMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
        <FormPage
          readOnly={!canUpdate}
          header={
            <EntityFormHeader
              entityType={ENTITY.HAKUKOHDE}
              entity={hakukohde}
            />
          }
          steps={<FormSteps activeStep={ENTITY.HAKUKOHDE} />}
          footer={
            <HakukohdeFooter
              formMode={FormMode.EDIT}
              hakukohde={hakukohde}
              toteutus={toteutus}
              haku={haku}
              canUpdate={canUpdate}
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
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default EditHakukohdePage;
