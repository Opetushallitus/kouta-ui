import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import useApiAsync from '#/src/hooks/useApiAsync';
import Spin from '#/src/components/Spin';
import getHakuByOid from '#/src/utils/haku/getHakuByOid';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByHaku from '#/src/utils/haku/getFormValuesByHaku';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useEntityFormConfig } from '#/src/hooks/form';
import EditHakuFooter from './EditHakuFooter';
import HakuForm from '#/src/pages/haku/HakuForm';

const EditHakuPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { hakuUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, hakuUpdatedAt]);

  const { data: haku = null } = useApiAsync({
    promiseFn: getHakuByOid,
    oid,
    watch,
  });

  const { t } = useTranslation();
  const initialValues = useMemo(() => {
    return haku && getFormValuesByHaku(haku);
  }, [haku]);

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

  const config = useEntityFormConfig(ENTITY.HAKU);

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.haunMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
        <FormPage
          readOnly={!canUpdate}
          header={<EntityFormHeader entityType={ENTITY.HAKU} entity={haku} />}
          steps={<FormSteps activeStep={ENTITY.HAKU} />}
          footer={
            haku ? <EditHakuFooter haku={haku} canUpdate={canUpdate} /> : null
          }
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          {haku ? (
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
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default EditHakuPage;
