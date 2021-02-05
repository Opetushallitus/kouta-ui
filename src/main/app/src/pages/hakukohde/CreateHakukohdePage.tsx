import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import FormHeader from '#/src/components/FormHeader';
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
import FormConfigContext from '#/src/contexts/FormConfigContext';
import getHakukohdeFormConfig from '#/src/utils/hakukohde/getHakukohdeFormConfig';

import { useHakukohdePageData } from './getHakukohdePageData';
import { HakukohdeFooter } from './HakukohdeFooter';
import HakukohdeForm, {
  initialValues as getInitialValues,
} from './HakukohdeForm';

const CreateHakukohdePage = ({
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
    () =>
      data &&
      getInitialValues(data?.toteutus?.nimi, data?.toteutus?.kielivalinta),
    [data]
  );

  const config = useMemo(getHakukohdeFormConfig, []);

  return (
    <ReduxForm form="hakukohdeForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiHakukohde')}</Title>
      <FormPage
        header={<FormHeader>{t('yleiset.hakukohde')}</FormHeader>}
        steps={<FormSteps activeStep={ENTITY.HAKUKOHDE} />}
        footer={
          <HakukohdeFooter
            formMode={FormMode.CREATE}
            organisaatioOid={organisaatioOid}
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
            <FormConfigContext.Provider value={config}>
              <HakukohdeForm
                steps
                organisaatioOid={organisaatioOid}
                haku={haku}
                toteutus={toteutus}
                tarjoajat={data.tarjoajat}
                koulutustyyppi={
                  data?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
                }
                showArkistoituTilaOption={false}
              />
            </FormConfigContext.Provider>
          </>
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default CreateHakukohdePage;
