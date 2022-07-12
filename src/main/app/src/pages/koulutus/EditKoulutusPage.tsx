import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';

import { KoulutusFooter } from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

export const EditKoulutusPage = () => {
  const history = useHistory();
  const { organisaatioOid, oid } = useParams();

  const koulutusQueryResult = useKoulutusByOid(oid);

  const { data: koulutus = null } = koulutusQueryResult;

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

  const isJulkinen = useFieldValue('julkinen', ENTITY.KOULUTUS);

  return (
    <FormPage
      title={t('sivuTitlet.koulutuksenMuokkaus')}
      entityType={ENTITY.KOULUTUS}
      formMode={FormMode.EDIT}
      queryResult={koulutusQueryResult}
      initialValues={initialValues}
      readOnly={!canUpdate}
      header={
        <EntityFormHeader entityType={ENTITY.KOULUTUS} entity={koulutus} />
      }
      steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
      footer={
        <KoulutusFooter
          formMode={FormMode.EDIT}
          koulutus={koulutus}
          organisaatioOid={organisaatioOid}
          canUpdate={canUpdate || isJulkinen}
        />
      }
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={organisaatioOid} />
      </RelationInfoContainer>
      <KoulutusForm
        isNewKoulutus={false}
        onAttachToteutus={onAttachToteutus}
        koulutus={koulutus}
        organisaatioOid={organisaatioOid}
      />
    </FormPage>
  );
};
