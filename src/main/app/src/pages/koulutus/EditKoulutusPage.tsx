import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import FullSpin from '#/src/components/FullSpin';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import { useUrls } from '#/src/contexts/contextHooks';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useFieldValue, useEntityFormConfig } from '#/src/hooks/form';
import useApiAsync from '#/src/hooks/useApiAsync';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import getKoulutusByOid from '#/src/utils/koulutus/getKoulutusByOid';

import EditKoulutusFooter from './EditKoulutusFooter';
import KoulutusForm from './KoulutusForm';

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

  const apiUrls = useUrls();

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
          footer={
            koulutus ? (
              <EditKoulutusFooter
                koulutus={koulutus}
                organisaatioOid={organisaatioOid}
                canUpdate={canUpdate || isJulkinen}
              />
            ) : null
          }
          esikatseluControls={
            <EsikatseluControls
              esikatseluUrl={apiUrls.url('konfo-ui.koulutus', oid)}
            />
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
