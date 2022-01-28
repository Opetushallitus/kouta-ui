import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import useSelectBase from '#/src/hooks/useSelectBase';
import { getFormValuesByHaku } from '#/src/utils/haku/getFormValuesByHaku';
import { useHakuByOid } from '#/src/utils/haku/getHakuByOid';

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

const CreateHakuPage = props => {
  const {
    match: {
      params: { organisaatioOid },
    },
    location: { search },
  } = props;

  const { kopioHakuOid } = queryString.parse(search);
  const { t } = useTranslation();
  const selectBase = useSelectBase({ kopioParam: 'kopioHakuOid' });

  const { data } = useHakuByOid(kopioHakuOid, {
    enabled: Boolean(kopioHakuOid),
  });

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm
      form="hakuForm"
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
        <HakuForm
          steps
          organisaatioOid={organisaatioOid}
          onSelectBase={selectBase}
        />
      </FormPage>
    </ReduxForm>
  );
};

export default CreateHakuPage;
