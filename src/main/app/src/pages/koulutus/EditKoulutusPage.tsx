import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import FullSpin from '#/src/components/FullSpin';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';

import { KoulutusFooter } from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

const FORM_NAME = 'koulutusForm';

export const EditKoulutusPage = () => {
  const history = useHistory();
  const { organisaatioOid, oid } = useParams();

  const { data: koulutus = null } = useKoulutusByOid(oid);

  const { t } = useTranslation();
  const initialValues = useMemo(() => {
    return koulutus && getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  const onAttachToteutus = useCallback(() => {
    organisaatioOid &&
      koulutus &&
      history.push(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/toteutus`
      );
  }, [history, koulutus, organisaatioOid]);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.KOULUTUS,
    CRUD_ROLES.UPDATE,
    koulutus?.organisaatioOid
  );

  const isJulkinen = useFieldValue('julkinen', FORM_NAME);

  return !koulutus ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form={FORM_NAME}
      mode={FormMode.EDIT}
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
      <FormPage
        readOnly={!canUpdate}
        header={
          <EntityFormHeader entityType={ENTITY.KOULUTUS} entity={koulutus} />
        }
        steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
        footer={
          koulutus ? (
            <KoulutusFooter
              formMode={FormMode.EDIT}
              koulutus={koulutus}
              organisaatioOid={organisaatioOid}
              canUpdate={canUpdate || isJulkinen}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {koulutus ? (
          <KoulutusForm
            isNewKoulutus={false}
            onAttachToteutus={onAttachToteutus}
            koulutus={koulutus}
            organisaatioOid={organisaatioOid}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};
