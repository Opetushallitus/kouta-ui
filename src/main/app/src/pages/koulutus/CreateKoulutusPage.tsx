import React, { useMemo } from 'react';

import _ from 'lodash';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormHeader from '#/src/components/FormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import useSelectBase from '#/src/hooks/useSelectBase';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';

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

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid: valittuOrganisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const selectBase = useSelectBase(history, { kopioParam: 'kopioKoulutusOid' });
  const { t } = useTranslation();

  const { kopioKoulutusOid = null } = qs.parse(search);

  const { data } = useKoulutusByOid(kopioKoulutusOid);

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
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
          onSelectBase={selectBase}
        />
      </FormPage>
    </ReduxForm>
  );
};

export default CreateKoulutusPage;
