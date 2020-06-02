import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { KOULUTUSTYYPPI, ENTITY } from '#/src/constants';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import useSoraKuvaus from '#/src/components/useSoraKuvaus';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesBySoraKuvaus from '#/src/utils/getFormValuesBySoraKuvaus';
import SoraKuvausForm from '#/src/components/SoraKuvausForm';
import getSoraKuvausFormConfig from '#/src/utils/getSoraKuvausFormConfig';
import FormConfigContext from '#/src/components/FormConfigContext';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
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

  const config = useMemo(getSoraKuvausFormConfig, []);

  useEffect(() => {
    soraKuvausUpdatedAt && _.isFunction(reload) && reload();
  }, [soraKuvausUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const koulutustyyppi =
    _.get(soraKuvaus, 'koulutustyyppi') || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return soraKuvaus ? getFormValuesBySoraKuvaus(soraKuvaus) : {};
  }, [soraKuvaus]);

  return (
    <FormConfigContext.Provider value={config}>
      <ReduxForm
        form="editSoraKuvausForm"
        initialValues={initialValues}
        enableReinitialize
      >
        <Title>{t('sivuTitlet.soraKuvauksenMuokkaus')}</Title>
        <FormPage
          header={
            <EntityFormHeader
              entityType={ENTITY.SORA_KUVAUS}
              entity={soraKuvaus}
            />
          }
          steps={<FormSteps activeStep={ENTITY.SORA_KUVAUS} />}
          footer={
            soraKuvaus ? <EditSoraKuvausFooter soraKuvaus={soraKuvaus} /> : null
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
      </ReduxForm>
    </FormConfigContext.Provider>
  );
};

export default EditSoraKuvausPage;
