import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES } from '#/src/constants';
import getKoulutustyyppiByKoulutusOid from '#/src/utils/kouta/getKoulutustyyppiByKoulutusOid';
import getHakukohdeByOid from '#/src/utils/kouta/getHakukohdeByOid';
import useApiAsync from '#/src/components/useApiAsync';
import FullSpin from '#/src/components/FullSpin';
import getToteutusByOid from '#/src/utils/kouta/getToteutusByOid';
import Title from '#/src/components/Title';
import getHakuByOid from '#/src/utils/kouta/getHakuByOid';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByHakukohde from '#/src/utils/getFormValuesByHakukohde';
import FormConfigContext from '#/src/components/FormConfigContext';
import HakukohdeForm from '#/src/components/HakukohdeForm';
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
import EditHakukohdeFooter from './EditHakukohdeFooter';

const getData = async ({ httpClient, apiUrls, oid: hakukohdeOid }) => {
  const hakukohde = await getHakukohdeByOid({
    httpClient,
    apiUrls,
    oid: hakukohdeOid,
  });

  const { toteutusOid, hakuOid } = hakukohde;

  const [toteutus, haku] = await Promise.all([
    getToteutusByOid({ httpClient, apiUrls, oid: toteutusOid }),
    getHakuByOid({ httpClient, apiUrls, oid: hakuOid }),
  ]);

  const { koulutustyyppi, tarjoajat } = await (toteutus && toteutus.koulutusOid
    ? getKoulutustyyppiByKoulutusOid({
        oid: toteutus.koulutusOid,
        httpClient,
        apiUrls,
      })
    : null);

  return {
    hakukohde,
    toteutus,
    haku,
    koulutustyyppi,
    tarjoajat,
  };
};

const EditHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { hakukohdeUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, hakukohdeUpdatedAt]);

  const {
    data: { hakukohde, toteutus, haku, koulutustyyppi, tarjoajat } = {},
  } = useApiAsync({
    promiseFn: getData,
    oid,
    watch,
  });

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

  return !hakukohde ? (
    <FullSpin />
  ) : (
    <ReduxForm form="editHakukohdeForm" initialValues={initialValues}>
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
            <EditHakukohdeFooter
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
