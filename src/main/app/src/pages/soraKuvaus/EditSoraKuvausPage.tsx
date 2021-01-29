import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { KOULUTUSTYYPPI, ENTITY, FormMode } from '#/src/constants';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import { Spin } from '#/src/components/virkailija';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';
import { useEntityFormConfig } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import SoraKuvausForm from './SoraKuvausForm';
import { SoraKuvausFooter } from './SoraKuvausFooter';
import { useSoraKuvausById } from '#/src/utils/soraKuvaus/getSoraKuvausById';

const EditSoraKuvausPage = props => {
  const {
    match: {
      params: { organisaatioOid, id },
    },
  } = props;

  const { data: soraKuvaus } = useSoraKuvausById(id);

  const koulutustyyppi =
    soraKuvaus?.koulutustyyppi ?? KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return soraKuvaus ? getFormValuesBySoraKuvaus(soraKuvaus) : {};
  }, [soraKuvaus]);

  const canUpdate = useIsOphVirkailija();

  const config = useEntityFormConfig(ENTITY.SORA_KUVAUS, koulutustyyppi);

  return (
    <ReduxForm form="soraKuvausForm" initialValues={initialValues}>
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
            <SoraKuvausFooter
              formMode={FormMode.EDIT}
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
