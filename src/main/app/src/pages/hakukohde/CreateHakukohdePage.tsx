import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage from '#/src/components/FormPage';
import {
  RelationInfoContainer,
  OrganisaatioRelation,
  HakuRelation,
  ToteutusRelation,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  ENTITY,
  FormMode,
  POHJAVALINTA,
} from '#/src/constants';
import { useCanCreateHakukohde } from '#/src/hooks/useCanCreateHakukohde';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import { getFormValuesByHakukohde } from '#/src/utils/hakukohde/getFormValuesByHakukohde';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import {
  HakukohdeForm,
  initialValues as getInitialValues,
} from './HakukohdeForm';

const getCopyValues = oid => ({
  pohja: {
    tapa: oid ? POHJAVALINTA.KOPIO : POHJAVALINTA.UUSI,
    valinta: oid ? { value: oid } : null,
  },
});

export const CreateHakukohdePage = () => {
  const { organisaatioOid, toteutusOid, hakuOid } = useParams();
  const { t } = useTranslation();

  const { data, isLoading: isPageDataLoading } = useHakukohdePageData({
    hakuOid: hakuOid,
    toteutusOid: toteutusOid,
  });

  const haku = data?.haku;
  const toteutus = data?.toteutus;

  const { data: hakukohde } = usePohjaEntity(ENTITY.HAKUKOHDE);

  const initialValues = useMemo(
    () => ({
      ...getInitialValues(data?.koulutustyyppi, data?.toteutus, data?.haku),
      ...(hakukohde ? getFormValuesByHakukohde(hakukohde) : {}),
      ...getCopyValues(hakukohde?.oid),
    }),
    [data, hakukohde]
  );

  const koulutustyyppi =
    data?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const canUpdate = useCanCreateHakukohde(haku?.hakukohteenLiittamisenTakaraja);

  const infoTextTranslationKey = !canUpdate
    ? 'muokkaamisenTakarajaYlittynyt'
    : '';

  return (
    <ReduxForm
      form={ENTITY.HAKUKOHDE}
      mode={FormMode.CREATE}
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiHakukohde')}</Title>
      <FormPage
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
        {isPageDataLoading ? (
          <Spin center />
        ) : (
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
              steps
              organisaatioOid={organisaatioOid}
              haku={haku}
              toteutus={toteutus}
              tarjoajat={data.tarjoajat}
              koulutustyyppi={koulutustyyppi}
            />
          </>
        )}
      </FormPage>
    </ReduxForm>
  );
};
