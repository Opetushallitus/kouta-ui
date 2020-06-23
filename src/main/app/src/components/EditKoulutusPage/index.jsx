import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ReduxForm from '#/src/components/ReduxForm';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import KoulutusForm from '#/src/components/KoulutusForm';
import useApiAsync from '#/src/components/useApiAsync';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import UrlContext from '#/src/components/UrlContext';
import getFormValuesByKoulutus from '#/src/utils/getFormValuesByKoulutus';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import FormSteps from '#/src/components/FormSteps';
import ToggleDraft from '#/src/components/ToggleDraft';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useFieldValue, useEntityFormConfig } from '#/src/hooks/form';
import FormConfigContext from '#/src/components/FormConfigContext';
import FullSpin from '#/src/components/FullSpin';
import EditKoulutusFooter from './EditKoulutusFooter';

const EditKoulutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { koulutusUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, koulutusUpdatedAt]);

  const { data: koulutus = null } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid,
    watch,
  });

  const { t } = useTranslation();
  const apiUrls = useContext(UrlContext);
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

  const FORM_NAME = 'editKoulutusForm';

  const selectedKoulutustyyppi = useFieldValue('koulutustyyppi', FORM_NAME);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.KOULUTUS,
    CRUD_ROLES.UPDATE,
    koulutus?.organisaatioOid
  );

  const config = useEntityFormConfig(ENTITY.KOULUTUS, selectedKoulutustyyppi);

  const isJulkinen = useFieldValue('julkinen', FORM_NAME);

  return !koulutus ? (
    <FullSpin />
  ) : (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
        <FormPage
          readOnly={!canUpdate}
          header={
            <EntityFormHeader entityType={ENTITY.KOULUTUS} entity={koulutus} />
          }
          steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
          draftUrl={apiUrls.url('konfo-ui.koulutus', oid) + '?draft=true'}
          toggleDraft={<ToggleDraft />}
          footer={
            koulutus ? (
              <EditKoulutusFooter
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
              steps={false}
              isNewKoulutus={false}
              johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
              onAttachToteutus={onAttachToteutus}
              koulutus={koulutus}
              organisaatioOid={organisaatioOid}
            />
          ) : (
            <Spin center />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default EditKoulutusPage;
