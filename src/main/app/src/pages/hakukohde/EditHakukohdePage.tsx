import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import { KOULUTUSTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useCanUpdateHakukohde } from '#/src/hooks/useCanUpdateHakukohde';
import useKoodi from '#/src/hooks/useKoodi';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';
import { useHakukohdeByOid } from '#/src/utils/hakukohde/getHakukohdeByOid';
import { arrayToTranslationObject } from '#/src/utils/languageUtils';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import { HakukohdeForm } from './HakukohdeForm';

const useInitialValues = hakukohde => {
  const hakukohdeKoodiUri = hakukohde?.hakukohdeKoodiUri;
  const hakukohdeKoodiQueryResult = useKoodi(hakukohdeKoodiUri);
  const { koodi: hakukohdeKoodi } = hakukohdeKoodiQueryResult;

  const nimiHakukohdeKoodista = useMemo(
    () => arrayToTranslationObject(hakukohdeKoodi?.metadata),
    [hakukohdeKoodi]
  );

  const initialValues = useMemo(
    () =>
      hakukohde
        ? getFormValuesByHakukohde(
            hakukohde,
            FormMode.EDIT,
            nimiHakukohdeKoodista
          )
        : {},
    [hakukohde, nimiHakukohdeKoodista]
  );

  return { initialValues, hakukohdeKoodiUri, hakukohdeKoodiQueryResult };
};

export const EditHakukohdePage = () => {
  const { organisaatioOid, oid } = useParams() as {
    organisaatioOid: string;
    oid: string;
  };

  const hakukohdeQueryResult = useHakukohdeByOid(oid);
  const { data: hakukohde } = hakukohdeQueryResult;

  const hakukohdePageDataQueryResult = useHakukohdePageData(
    {
      hakuOid: hakukohde?.hakuOid,
      toteutusOid: hakukohde?.toteutusOid,
    },
    { enabled: Boolean(hakukohde) }
  );

  const { data: { toteutus, haku, koulutustyyppi } = {} } =
    hakukohdePageDataQueryResult;

  const { t } = useTranslation();

  const { initialValues, hakukohdeKoodiUri, hakukohdeKoodiQueryResult } =
    useInitialValues(hakukohde);

  const resultObj = useCanUpdateHakukohde(
    haku?.hakukohteenMuokkaamisenTakaraja,
    hakukohde
  );

  const canUpdate = resultObj.canUpdate;
  const infoTextTranslationKey = canUpdate ? '' : resultObj.reasonKey;

  return (
    <FormPage
      title={t('sivuTitlet.hakukohteenMuokkaus')}
      entityType={ENTITY.HAKUKOHDE}
      formMode={FormMode.EDIT}
      queryResult={[
        hakukohdeQueryResult,
        hakukohdePageDataQueryResult,
        ...(hakukohdeKoodiUri ? [hakukohdeKoodiQueryResult] : []),
      ]}
      initialValues={initialValues}
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
          infoTextTranslationKey={infoTextTranslationKey}
        />
      }
    >
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
        koulutustyyppi={koulutustyyppi || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS}
      />
    </FormPage>
  );
};
