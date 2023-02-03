import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  ENTITY,
  FormMode,
  DEFAULT_JULKAISUTILA,
} from '#/src/constants';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import { KoulutusModel } from '#/src/types/koulutusTypes';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';

import { initialValues } from './initialToteutusValues';
import { ToteutusFooter } from './ToteutusFooter';
import ToteutusForm from './ToteutusForm';

const { AMMATILLINEN_KOULUTUS } = KOULUTUSTYYPPI;

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = ({
  toteutus,
  koulutus,
}: {
  toteutus?: ToteutusModel;
  koulutus: KoulutusModel;
}) => {
  return toteutus
    ? {
        ...getCopyValues(toteutus.oid),
        ...getFormValuesByToteutus(_.omit(toteutus, ['organisaatioOid'])),
        tila: DEFAULT_JULKAISUTILA,
      }
    : initialValues({ koulutus });
};

export const CreateToteutusPage = () => {
  const { organisaatioOid, koulutusOid } = useParams();
  const koulutusQueryResult = useKoulutusByOid(koulutusOid);
  const { data: koulutus } = koulutusQueryResult;

  const { t } = useTranslation();

  const koulutustyyppi = koulutus?.koulutustyyppi ?? AMMATILLINEN_KOULUTUS;

  const { data: toteutus } = usePohjaEntity(ENTITY.TOTEUTUS);

  const initialValues = useMemo(
    () =>
      getInitialValues({
        toteutus,
        koulutus,
      }),
    [toteutus, koulutus]
  );

  return (
    <FormPage
      title={t('sivuTitlet.uusiToteutus')}
      entityType={ENTITY.TOTEUTUS}
      formMode={FormMode.CREATE}
      queryResult={koulutusQueryResult}
      initialValues={initialValues}
      header={<EntityFormHeader entityType={ENTITY.TOTEUTUS} />}
      steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
      footer={
        <ToteutusFooter
          formMode={FormMode.CREATE}
          toteutus={toteutus}
          koulutus={koulutus}
          koulutustyyppi={koulutustyyppi}
          organisaatioOid={organisaatioOid}
          canUpdate={true}
        />
      }
    >
      <RelationInfoContainer>
        <KoulutusRelation
          organisaatioOid={organisaatioOid}
          koulutus={koulutus}
        />
        <OrganisaatioRelation organisaatioOid={organisaatioOid} />
      </RelationInfoContainer>
      <ToteutusForm
        steps
        koulutus={koulutus}
        organisaatioOid={organisaatioOid}
        koulutustyyppi={koulutustyyppi}
      />
    </FormPage>
  );
};
