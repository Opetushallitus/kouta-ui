import React, { useMemo } from 'react';

import queryString from 'query-string';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { POHJAVALINTA, ENTITY, FormMode } from '#/src/constants';
import useSelectBase from '#/src/hooks/useSelectBase';
import { getFormValuesByValintaperuste } from '#/src/utils/valintaperuste/getFormValuesByValintaperuste';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ValintaperusteFooter } from './ValintaperusteFooter';
import { ValintaperusteForm, initialValues } from './ValintaperusteForm';

const FORM_NAME = 'valintaperusteForm';

const getCopyValues = valintaperusteId => ({
  pohja: {
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: valintaperusteId },
  },
});

const getInitialValues = (valintaperuste, kieliValinnat, koulutustyyppi) => {
  const kieliValinnatLista =
    kieliValinnat == null ? [] : kieliValinnat.split(',');
  return valintaperuste && valintaperuste.id
    ? {
        ...getCopyValues(valintaperuste.id),
        ...getFormValuesByValintaperuste(valintaperuste),
      }
    : initialValues(kieliValinnatLista, koulutustyyppi);
};

export const CreateValintaperustePage = props => {
  const {
    match: {
      params: {
        organisaatioOid: luojaOrganisaatioOid,
        kieliValinnat,
        koulutustyyppi,
      },
    },
    location: { search },
  } = props;

  const { kopioValintaperusteOid } = queryString.parse(search);

  const selectBase = useSelectBase({
    kopioParam: 'kopioValintaperusteOid',
  });

  const { t } = useTranslation();

  const { data: valintaperuste } = useValintaperusteById(
    kopioValintaperusteOid
  );

  const initialValues = useMemo(() => {
    return getInitialValues(valintaperuste, kieliValinnat, koulutustyyppi);
  }, [valintaperuste, kieliValinnat, koulutustyyppi]);

  return (
    <ReduxForm
      form={FORM_NAME}
      mode={FormMode.CREATE}
      initialValues={initialValues}
    >
      <Title>{t('sivuTitlet.uusiValintaperuste')}</Title>
      <FormPage
        header={<EntityFormHeader entityType={ENTITY.VALINTAPERUSTE} />}
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
        />
      </FormPage>
    </ReduxForm>
  );
};
