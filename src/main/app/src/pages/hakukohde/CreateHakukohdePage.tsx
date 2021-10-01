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
