import React, { useMemo } from 'react';

import _ from 'lodash';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';

import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import FormHeader from '#/src/components/FormHeader';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import FormSteps from '#/src/components/FormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import {
  POHJAVALINTA,
  ENTITY,
  FormMode,
  DEFAULT_JULKAISUTILA,
} from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import useSelectBase from '#/src/hooks/useSelectBase';
import getFormValuesByKoulutus from '#/src/utils/koulutus/getFormValuesByKoulutus';
import { useKoulutusByOid } from '#/src/utils/koulutus/getKoulutusByOid';

import KoulutusFooter from './KoulutusFooter';
import { KoulutusForm } from './KoulutusForm';

const FORM_NAME = 'koulutusForm';

const INITIAL_VALUES = {
  tila: DEFAULT_JULKAISUTILA,
  esikatselu: false,
  pohja: {
    tapa: POHJAVALINTA.UUSI,
  },
  kieliversiot: ['fi', 'sv'],
  tarjoajat: { tarjoajat: [], kaytaPohjanJarjestajaa: true },
};

const config = { noFieldConfigs: true };

const getCopyValues = koulutus => ({
  pohja: {
    tarjoajat: koulutus.tarjoajat,
    tapa: POHJAVALINTA.KOPIO,
    valinta: { value: koulutus.oid },
  },
});

const getInitialValues = koulutus => {
  return koulutus
    ? {
        ...getFormValuesByKoulutus(_.omit(koulutus, ['tarjoajat'])),
        ...getCopyValues(koulutus),
      }
    : INITIAL_VALUES;
};

const CreateKoulutusPage = props => {
  const {
    match: {
      params: { oid: valittuOrganisaatioOid },
    },
    location: { search },
    history,
  } = props;

  const selectBase = useSelectBase(history, { kopioParam: 'kopioKoulutusOid' });
  const { t } = useTranslation();

  const { kopioKoulutusOid = null } = qs.parse(search);

  const { data } = useKoulutusByOid(kopioKoulutusOid);

  const initialValues = useMemo(() => {
    return getInitialValues(data);
  }, [data]);

  return (
    <ReduxForm form={FORM_NAME} initialValues={initialValues}>
      <Title>{t('sivuTitlet.uusiKoulutus')}</Title>
      <FormConfigContext.Provider value={config}>
        <FormPage
          header={<FormHeader>{t('yleiset.koulutus')}</FormHeader>}
          steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
          esikatseluControls={<EsikatseluControls />}
          footer={
            <KoulutusFooter
              formMode={FormMode.CREATE}
              organisaatioOid={valittuOrganisaatioOid}
            />
          }
        >
          <RelationInfoContainer>
            <OrganisaatioRelation organisaatioOid={valittuOrganisaatioOid} />
          </RelationInfoContainer>
          <KoulutusForm
            steps
            isNewKoulutus={true}
            organisaatioOid={valittuOrganisaatioOid}
            onSelectBase={selectBase}
          />
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default CreateKoulutusPage;
