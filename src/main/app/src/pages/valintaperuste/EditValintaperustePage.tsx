import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';
import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import FullSpin from '#/src/components/FullSpin';
import ValintaperusteForm from './ValintaperusteForm';
import { ValintaperusteFooter } from './ValintaperusteFooter';

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
