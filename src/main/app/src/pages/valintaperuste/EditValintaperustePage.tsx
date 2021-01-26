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
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useUrls } from '#/src/contexts/contextHooks';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import ValintaperusteForm from './ValintaperusteForm';

const EditValintaperustePage = props => {
  const {
    match: {
      params: { organisaatioOid, id },
    },
  } = props;

  const { data: valintaperuste, isLoading } = useValintaperusteById(id);

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return valintaperuste && getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.VALINTAPERUSTE,
    CRUD_ROLES.UPDATE,
    valintaperuste?.organisaatioOid
  );

  const config = useEntityFormConfig(
    ENTITY.VALINTAPERUSTE,
    valintaperuste?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
  );

  const apiUrls = useUrls();

  return isLoading ? (
    <FullSpin />
  ) : (
    <ReduxForm form="valintaperusteForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.valintaperusteenMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
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

export default EditValintaperustePage;
