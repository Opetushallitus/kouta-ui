import React, { useMemo } from 'react';

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
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import { ValintaperusteForm } from './ValintaperusteForm';

const formConfig = { noFieldConfigs: true };

export const EditValintaperustePage = props => {
  const {
    match: {
      params: { organisaatioOid, id },
    },
  } = props;

  const { data: valintaperuste, isLoading } = useValintaperusteById(id);

  const { t } = useTranslation();

  const canUpdate = useCurrentUserHasRole(
    ENTITY.VALINTAPERUSTE,
    CRUD_ROLES.UPDATE,
    valintaperuste?.organisaatioOid
  );

  const apiUrls = useUrls();

  const initialValues = useMemo(
    () => (valintaperuste ? getFormValuesByValintaperuste(valintaperuste) : {}),
    [valintaperuste]
  );

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm form="valintaperusteForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.valintaperusteenMuokkaus')}</Title>
      <FormConfigContext.Provider
        value={{ ...formConfig, readOnly: !canUpdate }}
      >
        <FormPage
          readOnly={!canUpdate}
          header={
            <EntityFormHeader
              entityType={ENTITY.VALINTAPERUSTE}
              entity={valintaperuste}
            />
          }
          steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
          footer={
            valintaperuste ? (
              <ValintaperusteFooter
                formMode={FormMode.EDIT}
                organisaatioOid={organisaatioOid}
                valintaperuste={valintaperuste}
                canUpdate={canUpdate}
              />
            ) : null
          }
          esikatseluControls={
            <EsikatseluControls
              esikatseluUrl={apiUrls.url('konfo-ui.valintaperuste', id)}
            />
          }
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          {valintaperuste && (
            <ValintaperusteForm
              steps={false}
              canSelectBase={false}
              canEditTyyppi={false}
              organisaatioOid={organisaatioOid}
            />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};
