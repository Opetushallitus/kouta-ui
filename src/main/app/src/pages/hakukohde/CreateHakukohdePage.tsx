import React, { useMemo } from 'react';

import { merge } from 'lodash/fp';
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
import { useCanCreateHakukohde } from '#/src/hooks/useCanCreateHakukohde';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import { checkHasHakukohdeKoodiUri } from '#/src/pages/hakukohde/HakukohdeForm/PerustiedotSection';
import { toSelectValue } from '#/src/utils';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import {
  HakukohdeForm,
  initialValues as getInitialValues,
} from './HakukohdeForm';

const getCopyValues = (oid, isNimiKoodi, hakukohde) => {
  const { nimi, hakukohdeKoodiUri } = hakukohde;
  return merge(getFormValuesByHakukohde(hakukohde), {
    perustiedot: {
      nimi: isNimiKoodi ? null : nimi,
      hakukohdeKoodiUri: isNimiKoodi ? toSelectValue(hakukohdeKoodiUri) : null,
    },
  });
};

export const CreateHakukohdePage = () => {
  const { organisaatioOid, toteutusOid, hakuOid } = useParams();
  const { t } = useTranslation();

  const pageDataQueryResult = useHakukohdePageData({
    hakuOid: hakuOid,
    toteutusOid: toteutusOid,
  });

  const { data } = pageDataQueryResult;

  const haku = data?.haku;
  const toteutus = data?.toteutus;

  const { data: hakukohde } = usePohjaEntity(ENTITY.HAKUKOHDE);

  const koulutustyyppi =
    data?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const isNimiKoodi = checkHasHakukohdeKoodiUri(koulutustyyppi, haku);

  const initialValues = useMemo(
    () => ({
      ...getInitialValues(
        data?.koulutustyyppi,
        data?.toteutus,
        data?.haku,
        hakukohde?.oid
      ),
      ...(hakukohde
        ? getCopyValues(hakukohde?.oid, isNimiKoodi, hakukohde)
        : {}),
    }),
    [data, hakukohde, isNimiKoodi]
  );

  const canUpdate = useCanCreateHakukohde(haku?.hakukohteenLiittamisenTakaraja);

  const infoTextTranslationKey = canUpdate
    ? ''
    : 'muokkaamisenTakarajaYlittynyt';

  return (
    <FormPage
      title={t('sivuTitlet.uusiHakukohde')}
      entityType={ENTITY.HAKUKOHDE}
      formMode={FormMode.CREATE}
      queryResult={pageDataQueryResult}
      initialValues={initialValues}
      header={<EntityFormHeader entityType={ENTITY.HAKUKOHDE} />}
      steps={<FormSteps activeStep={ENTITY.HAKUKOHDE} />}
      footer={
        <HakukohdeFooter
          formMode={FormMode.CREATE}
          organisaatioOid={organisaatioOid}
          koulutustyyppi={koulutustyyppi}
          haku={haku}
          toteutus={toteutus}
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
        steps
        organisaatioOid={organisaatioOid}
        haku={haku}
        toteutus={toteutus}
        tarjoajat={data?.tarjoajat}
        koulutustyyppi={koulutustyyppi}
      />
    </FormPage>
  );
};
