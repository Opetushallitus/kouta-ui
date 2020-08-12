import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { KOULUTUSTYYPPI, ENTITY, CRUD_ROLES } from '#/src/constants';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import useSoraKuvaus from '#/src/hooks/useSoraKuvaus';
import { Spin } from '#/src/components/virkailija';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useEntityFormConfig } from '#/src/hooks/form';
import SoraKuvausForm from '../SoraKuvausForm';
import EditSoraKuvausFooter from './EditSoraKuvausFooter';

const EditSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid, id },
    },
    location: { state = {} },
  } = props;

  const { soraKuvausUpdatedAt = null } = state;
  const { soraKuvaus, reload } = useSoraKuvaus(id);

  useEffect(() => {
    soraKuvausUpdatedAt && _.isFunction(reload) && reload();
  }, [soraKuvausUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const koulutustyyppi =
    soraKuvaus?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return soraKuvaus ? getFormValuesBySoraKuvaus(soraKuvaus) : {};
  }, [soraKuvaus]);

  // SORA-kuvaus rights are the same as valintaperuste rights
  const canUpdate = useCurrentUserHasRole(
    ENTITY.VALINTAPERUSTE,
    CRUD_ROLES.UPDATE,
    soraKuvaus?.organisaatioOid
  );

  const config = useEntityFormConfig(ENTITY.SORA_KUVAUS, koulutustyyppi);

  return (
    <ReduxForm form="editSoraKuvausForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.soraKuvauksenMuokkaus')}</Title>
      <FormConfigContext.Provider value={{ ...config, readOnly: !canUpdate }}>
        <FormPage
          readOnly={!canUpdate}
          header={
            <EntityFormHeader
              entityType={ENTITY.SORA_KUVAUS}
              entity={soraKuvaus}
            />
          }
          steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
          footer={
            <EditSoraKuvausFooter
              soraKuvaus={soraKuvaus}
              canUpdate={canUpdate}
            />
          }
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={organisaatioOid} />
          </RelationInfoContainer>
          {soraKuvaus ? (
            <SoraKuvausForm
              {...props}
              organisaatioOid={organisaatioOid}
              koulutustyyppi={koulutustyyppi}
              soraKuvaus={soraKuvaus}
              steps={false}
              canSelectBase={false}
              canEditKoulutustyyppi={false}
            />
          ) : (
            <Spin center />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default EditSoraKuvausPage;
