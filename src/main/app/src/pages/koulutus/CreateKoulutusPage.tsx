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
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import { usePohjaEntity } from '#/src/hooks/usePohjaEntity';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';

import { initialKoulutusValues } from './initialKoulutusValues';
import KoulutusFooter from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

const FORM_NAME = 'koulutusForm';

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
        ...getFormValuesByKoulutus(_.omit(koulutus, ['tarjoajat'])),
        ...getCopyValues(koulutus),
      }
    : initialKoulutusValues;
};

export const CreateKoulutusPage = () => {
  const { organisaatioOid: valittuOrganisaatioOid } = useParams();
  const { t } = useTranslation();

  const { data } = usePohjaEntity(ENTITY.KOULUTUS);

  const initialValues = useMemo(() => getInitialValues(data), [data]);

  return (
    <ReduxForm
      mode={FormMode.CREATE}
      form={FORM_NAME}
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.KOULUTUS} />}
        steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
        footer={
          <KoulutusFooter
            formMode={FormMode.CREATE}
            organisaatioOid={valittuOrganisaatioOid}
          />
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={valittuOrganisaatioOid} />
        </RelationInfoContainer>
        <KoulutusForm
          steps
          isNewKoulutus={true}
          organisaatioOid={valittuOrganisaatioOid}
        />
      </FormPage>
    </ReduxForm>
  );
};
