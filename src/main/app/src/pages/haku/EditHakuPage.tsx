import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByHaku } from '#/src/utils/haku/getFormValuesByHaku';
import { useHakuByOid } from '#/src/utils/haku/getHakuByOid';

import { HakuFooter } from './HakuFooter';
import HakuForm from './HakuForm';

export const EditHakuPage = () => {
  const history = useHistory();
  const { organisaatioOid, oid } = useParams();
  const hakuQueryResult = useHakuByOid(oid);
  const { data: haku } = hakuQueryResult;
  const { t } = useTranslation();

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${haku?.oid}/hakukohde`
        );
      }
    },
    [history, organisaatioOid, haku]
  );

  const canUpdate = useCurrentUserHasRole(
    ENTITY.HAKU,
    CRUD_ROLES.UPDATE,
    haku?.organisaatioOid
  );

  const initialValues = useMemo(
    () => (haku ? getFormValuesByHaku(haku) : {}),
    [haku]
  );

  return (
    <FormPage
      title={t('sivuTitlet.haunMuokkaus')}
      entityType={ENTITY.HAKU}
      formMode={FormMode.EDIT}
      queryResult={hakuQueryResult}
      initialValues={initialValues}
      readOnly={!canUpdate}
      header={<EntityFormHeader entityType={ENTITY.HAKU} entity={haku} />}
      steps={<FormSteps activeStep={ENTITY.HAKU} />}
      footer={
        <HakuFooter
          haku={haku}
          organisaatioOid={organisaatioOid}
          formMode={FormMode.EDIT}
          canUpdate={canUpdate}
        />
      }
    >
      <RelationInfoContainer>
        <OrganisaatioRelation organisaatioOid={organisaatioOid} />
      </RelationInfoContainer>
      <HakuForm
        haku={haku}
        organisaatioOid={organisaatioOid}
        steps={false}
        onAttachHakukohde={onAttachHakukohde}
      />
    </FormPage>
  );
};
