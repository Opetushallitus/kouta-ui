import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
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
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useKoodi from '#/src/hooks/useKoodi';
import { canUpdateHakukohde } from '#/src/utils/hakukohde/canUpdateHakukohde';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';
import { useHakukohdeByOid } from '#/src/utils/hakukohde/getHakukohdeByOid';
import { arrayToTranslationObject } from '#/src/utils/languageUtils';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import { HakukohdeForm } from './HakukohdeForm';

const FORM_NAME = 'hakukohdeForm';

const useInitialValues = hakukohde => {
  const { koodi: hakukohdeKoodi } = useKoodi(hakukohde?.hakukohdeKoodiUri);

  const nimiHakukohdeKoodista = arrayToTranslationObject(
    hakukohdeKoodi?.metadata
  );

  return useMemo(
    () =>
      hakukohde
        ? getFormValuesByHakukohde(hakukohde, nimiHakukohdeKoodista)
        : {},
    [hakukohde, nimiHakukohdeKoodista]
  );
};

export const EditHakukohdePage = props => {
  const {
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;

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

  const isOphVirkailija = useIsOphVirkailija();
  const hasRightToUpdate = useCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE,
    hakukohde?.organisaatioOid
  );

  const initialValues = useInitialValues(hakukohde);

  let canUpdate = true;
  if (haku?.hakukohteenMuokkaamisenTakaraja) {
    canUpdate = canUpdateHakukohde(
      new Date(),
      new Date(haku?.hakukohteenMuokkaamisenTakaraja)
    );
  }

  const infoTextTranslationKey = !canUpdate
    ? 'muokkaamisenTakarajaYlittynyt'
    : '';

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form={FORM_NAME}
      mode={FormMode.EDIT}
      initialValues={initialValues}
      disabled={!hasRightToUpdate}
    >
      <Title>{t('sivuTitlet.hakukohteenMuokkaus')}</Title>
      <FormPage
        readOnly={!hasRightToUpdate}
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
            canUpdate={(hasRightToUpdate && canUpdate) || isOphVirkailija}
            infoTextTranslationKey={infoTextTranslationKey}
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
            hakukohde={hakukohde}
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
