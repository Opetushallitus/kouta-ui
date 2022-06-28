import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  KoulutusRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import {
  KOULUTUSTYYPPI,
  POHJAVALINTA,
  ENTITY,
  FormMode,
} from '#/src/constants';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import { ToteutusModel } from '#/src/types/toteutusTypes';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';
import getFormValuesByToteutus from '#/src/utils/toteutus/getFormValuesByToteutus';

import { initialValues } from './initialToteutusValues';
import { ToteutusFooter } from './ToteutusFooter';
import ToteutusForm from './ToteutusForm';

const {
  AMMATILLINEN_KOULUTUS,
  TUTKINNON_OSA,
  OSAAMISALA,
  VAPAA_SIVISTYSTYO_OPISTOVUOSI,
  VAPAA_SIVISTYSTYO_MUU,
  MUU_AMMATILLINEN_KOULUTUS,
} = KOULUTUSTYYPPI;

const getCopyValues = toteutusOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: toteutusOid },
  },
});

const getInitialValues = ({
  toteutus,
  koulutustyyppi,
  koulutusNimi,
  koulutusKielet,
}: {
  toteutus: ToteutusModel;
  koulutustyyppi: KOULUTUSTYYPPI;
  koulutusNimi?: string;
  koulutusKielet?: Array<LanguageCode>;
}) => {
  return toteutus
    ? { ...getCopyValues(toteutus.oid), ...getFormValuesByToteutus(toteutus) }
    : initialValues({ koulutustyyppi, koulutusNimi, koulutusKielet });
};

export const CreateToteutusPage = () => {
  const { organisaatioOid, koulutusOid } = useParams();
  const { data: koulutus, isLoading: isKoulutusLoading } =
    useKoulutusByOid(koulutusOid);

  const { t } = useTranslation();

  const koulutustyyppi = koulutus?.koulutustyyppi ?? AMMATILLINEN_KOULUTUS;

  const koulutusNimi = koulutus?.nimi;
  const koulutusKielet = koulutus?.kielivalinta;

  const { data: toteutus } = usePohjaEntity(ENTITY.TOTEUTUS);

  const initialValues = useMemo(() => {
    return [
      AMMATILLINEN_KOULUTUS,
      TUTKINNON_OSA,
      OSAAMISALA,
      VAPAA_SIVISTYSTYO_OPISTOVUOSI,
      VAPAA_SIVISTYSTYO_MUU,
      MUU_AMMATILLINEN_KOULUTUS,
    ].includes(koulutustyyppi)
      ? getInitialValues({
          koulutustyyppi,
          toteutus,
          koulutusNimi,
          koulutusKielet,
        })
      : getInitialValues({ koulutustyyppi, toteutus, koulutusKielet });
  }, [toteutus, koulutustyyppi, koulutusNimi, koulutusKielet]);

  return (
    <ReduxForm
      form={ENTITY.TOTEUTUS}
      mode={FormMode.CREATE}
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.TOTEUTUS} />}
        steps={<FormSteps activeStep={ENTITY.TOTEUTUS} />}
        footer={
          koulutus ? (
            <ToteutusFooter
              formMode={FormMode.CREATE}
              toteutus={toteutus}
              koulutus={koulutus}
              koulutustyyppi={koulutustyyppi}
              organisaatioOid={organisaatioOid}
              canUpdate={true}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <KoulutusRelation
            organisaatioOid={organisaatioOid}
            koulutus={koulutus}
          />
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {isKoulutusLoading ? (
          <Spin center />
        ) : (
          <ToteutusForm
            steps
            koulutus={koulutus}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
          />
        )}
      </FormPage>
    </ReduxForm>
  );
};
