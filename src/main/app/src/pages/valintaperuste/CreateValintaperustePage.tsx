import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import FormHeader from '#/src/components/FormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig, useFieldValue } from '#/src/hooks/form';
import useSelectBase from '#/src/hooks/useSelectBase';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import ValintaperusteForm, { initialValues } from './ValintaperusteForm';

const getCopyValues = valintaperusteId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteId },
  },
});

const getInitialValues = (valintaperuste, kieliValinnat) => {
  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');
  return valintaperuste && valintaperuste.id
    ? {
        ...getCopyValues(valintaperuste.id),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues(kieliValinnatLista);
};

const CreateValintaperustePage = props => {
  const {
    match: {
      params: { organisaatioOid: luojaOrganisaatioOid, kieliValinnat },
    },
    location: { search },
    history,
  } = props;

  const { kopioValintaperusteOid } = queryString.parse(search);

  const selectBase = useSelectBase(history, {
    kopioParam: 'kopioValintaperusteOid',
  });

  const { t } = useTranslation();

  const { data: valintaperuste } = useValintaperusteById(
    kopioValintaperusteOid
  );

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste, kieliValinnat);
  }, [valintaperuste, kieliValinnat]);

  const FORM_NAME = 'valintaperusteForm';

  const koulutustyyppi = useFieldValue('perustiedot.tyyppi', FORM_NAME);

  const config = useEntityFormConfig(ENTITY.VALINTAPERUSTE, koulutustyyppi);

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiValintaperuste')}</Title>
      <FormConfigContext.Provider value={config}>
        <FormPage
          header={<FormHeader>{t('yleiset.valintaperuste')}</FormHeader>}
          steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
          footer={
            <ValintaperusteFooter
              formMode={FormMode.CREATE}
              organisaatioOid={luojaOrganisaatioOid}
            />
          }
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={luojaOrganisaatioOid} />
          </RelationInfoContainer>
          <ValintaperusteForm
            steps
            organisaatioOid={luojaOrganisaatioOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default CreateValintaperustePage;
