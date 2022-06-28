import React, { useMemo } from 'react';

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
import { getFormValuesByHaku } from '#/src/utils/haku/getFormValuesByHaku';

import { HakuFooter } from './HakuFooter';
import HakuForm, { initialValues } from './HakuForm';

const getCopyValues = hakuOid => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: hakuOid },
  },
});

const getInitialValues = haku => {
  return haku
    ? { ...getCopyValues(haku.oid), ...getFormValuesByHaku(haku) }
    : initialValues;
};

export const CreateHakuPage = () => {
  const { organisaatioOid } = useParams();
  const { t } = useTranslation();

  const { data } = usePohjaEntity(ENTITY.HAKU);

  const initialValues = useMemo(() => getInitialValues(data), [data]);

  return (
    <ReduxForm
      form={ENTITY.HAKU}
      mode={FormMode.CREATE}
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiHaku')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.HAKU} />}
        steps={<FormSteps activeStep={ENTITY.HAKU} />}
        footer={
          <HakuFooter
            formMode={FormMode.CREATE}
            organisaatioOid={organisaatioOid}
          />
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        <HakuForm steps organisaatioOid={organisaatioOid} />
      </FormPage>
    </ReduxForm>
  );
};
