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
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';

import { KoulutusFooter } from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

const FORM_NAME = 'koulutusForm';

const EditKoulutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
  } = props;

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

  const formConfig = useMemo(() => ({ readOnly: !canUpdate }), [canUpdate]);

  const isJulkinen = useFieldValue('julkinen', FORM_NAME);

  const apiUrls = useUrls();

  return !koulutus ? (
    <FullSpin />
  ) : (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
      <FormConfigContext.Provider value={formConfig}>
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
              isNewKoulutus={false}
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
