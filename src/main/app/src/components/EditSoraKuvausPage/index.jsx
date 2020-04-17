import React, { useEffect, useMemo } from 'react';
import { get, isFunction } from 'lodash';
import { useTranslation } from 'react-i18next';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditSoraKuvausHeader from './EditSoraKuvausHeader';
import EditSoraKuvausSteps from './EditSoraKuvausSteps';
import EditSoraKuvausFooter from './EditSoraKuvausFooter';
import useSoraKuvaus from '../useSoraKuvaus';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import Title from '../Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesBySoraKuvaus from '#/src/utils/getFormValuesBySoraKuvaus';
import SoraKuvausForm from '#/src/components/SoraKuvausForm';
import getSoraKuvausFormConfig from '#/src/utils/getSoraKuvausFormConfig';
import FormConfigContext from '../FormConfigContext';

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
    soraKuvausUpdatedAt && isFunction(reload) && reload();
  }, [soraKuvausUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const koulutustyyppi =
    get(soraKuvaus, 'koulutustyyppi') || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

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
          header={<EditSoraKuvausHeader soraKuvaus={soraKuvaus} />}
          steps={<EditSoraKuvausSteps />}
          footer={
            soraKuvaus ? <EditSoraKuvausFooter soraKuvaus={soraKuvaus} /> : null
          }
        >
          <TopInfoContainer>
            <OrganisaatioInfo organisaatioOid={organisaatioOid} />
          </TopInfoContainer>
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
