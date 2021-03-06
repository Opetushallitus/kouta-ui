import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByHaku } from '#/src/utils/haku/getFormValuesByHaku';
import { useHakuByOid } from '#/src/utils/haku/getHakuByOid';

import { HakuFooter } from './HakuFooter';
import HakuForm from './HakuForm';

const FORM_NAME = 'hakuForm';

const EditHakuPage = ({
  history,
  match: {
    params: { organisaatioOid, oid },
  },
}) => {
  const { data: haku, isFetching } = useHakuByOid(oid);
  const { t } = useTranslation();

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${haku.oid}/hakukohde`
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
    <ReduxForm
      form={FORM_NAME}
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.haunMuokkaus')}</Title>
      <FormPage
        readOnly={!canUpdate}
        header={<EntityFormHeader entityType={ENTITY.HAKU} entity={haku} />}
        steps={<FormSteps activeStep={ENTITY.HAKU} />}
        footer={
          haku ? (
            <HakuFooter
              haku={haku}
              organisaatioOid={organisaatioOid}
              formMode={FormMode.EDIT}
              canUpdate={canUpdate}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {!isFetching && haku ? (
          <HakuForm
            haku={haku}
            organisaatioOid={organisaatioOid}
            steps={false}
            onAttachHakukohde={onAttachHakukohde}
            canSelectBase={false}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default EditHakuPage;
