import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import {
  POHJAVALINTA,
  ENTITY,
  FormMode,
  DEFAULT_JULKAISUTILA,
} from '#/src/constants';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';

import { initialKoulutusValues } from './initialKoulutusValues';
import KoulutusFooter from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

const getCopyValues = koulutus => ({
  pohja: {
    tarjoajat: koulutus.tarjoajat,
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: koulutus.oid },
  },
});

const getInitialValues = koulutus => {
  return koulutus
    ? {
        ...getFormValuesByKoulutus(
          _.omit(koulutus, ['tarjoajat', 'organisaatioOid'])
        ),
        ...getCopyValues(koulutus),
        tila: DEFAULT_JULKAISUTILA,
      }
    : initialKoulutusValues;
};

export const CreateKoulutusPage = () => {
  const { organisaatioOid: valittuOrganisaatioOid } = useParams();
  const { t } = useTranslation();

  const { data } = usePohjaEntity(ENTITY.KOULUTUS);

  const initialValues = useMemo(() => getInitialValues(data), [data]);

  return (
    <FormPage
      title={t('sivuTitlet.uusiKoulutus')}
      entityType={ENTITY.KOULUTUS}
      formMode={FormMode.CREATE}
      initialValues={initialValues}
      header={<EntityFormHeader entityType={ENTITY.KOULUTUS} />}
      steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
      footer={<KoulutusFooter organisaatioOid={valittuOrganisaatioOid} />}
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={valittuOrganisaatioOid} />
      </RelationInfoContainer>
      <KoulutusForm steps organisaatioOid={valittuOrganisaatioOid} />
    </FormPage>
  );
};
