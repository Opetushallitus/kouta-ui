import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { Spin } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI, ENTITY, FormMode } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';
import { useSoraKuvausById } from '#/src/utils/soraKuvaus/getSoraKuvausById';

import { SoraKuvausFooter } from './SoraKuvausFooter';
import SoraKuvausForm from './SoraKuvausForm';

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

  const canUpdate = useIsOphVirkailija();

  const initialValues = useMemo(
    () => (soraKuvaus ? getFormValuesBySoraKuvaus(soraKuvaus) : {}),
    [soraKuvaus]
  );

  return (
    <ReduxForm
      form="soraKuvausForm"
      initialValues={initialValues}
      disabled={!canUpdate}
    >
      <Title>{t('sivuTitlet.soraKuvauksenMuokkaus')}</Title>
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
    </ReduxForm>
  );
};

export default EditSoraKuvausPage;
