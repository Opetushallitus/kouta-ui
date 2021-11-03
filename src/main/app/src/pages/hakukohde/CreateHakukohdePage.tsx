import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

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
import { KOULUTUSTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { canCreateHakukohde } from '#/src/utils/hakukohde/canUpdateHakukohde';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import {
  HakukohdeForm,
  initialValues as getInitialValues,
} from './HakukohdeForm';

export const CreateHakukohdePage = ({
  match: {
    params: { organisaatioOid, toteutusOid, hakuOid },
  },
}) => {
  const { t } = useTranslation();
  const isOphVirkailija = useIsOphVirkailija();

  const { data, isFetching } = useHakukohdePageData({
    hakuOid: hakuOid,
    toteutusOid: toteutusOid,
  });

  const haku = data?.haku;
  const toteutus = data?.toteutus;

  const initialValues = useMemo(
    () => data && getInitialValues(data?.koulutustyyppi, data?.toteutus),
    [data]
  );

  const koulutustyyppi =
    data?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  let canUpdate = true;
  if (haku?.hakukohteenLiittamisenTakaraja) {
    canUpdate = canCreateHakukohde(
      new Date(),
      new Date(haku.hakukohteenLiittamisenTakaraja)
    );
  }

  if (isOphVirkailija) {
    canUpdate = true;
  }

  const infoTextTranslationKey = !canUpdate
    ? 'muokkaamisenTakarajaYlittynyt'
    : '';
  return (
    <ReduxForm
      form="hakukohdeForm"
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
        {isFetching ? (
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
