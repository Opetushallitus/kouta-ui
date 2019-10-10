import React, { useEffect } from 'react';
import get from 'lodash/get';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditSoraKuvausHeader from './EditSoraKuvausHeader';
import EditSoraKuvausSteps from './EditSoraKuvausSteps';
import EditSoraKuvausForm from './EditSoraKuvausForm';
import EditSoraKuvausFooter from './EditSoraKuvausFooter';
import useSoraKuvaus from '../useSoraKuvaus';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import { isFunction } from '../../utils';
import Title from '../Title';
import useTranslation from '../useTranslation';

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
    soraKuvausUpdatedAt && isFunction(reload) && reload();
  }, [soraKuvausUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const koulutustyyppi =
    get(soraKuvaus, 'koulutustyyppi') || KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  return (
    <>
      <Title>{t('sivuTitlet.soraKuvauksenMuokkaus')}</Title>
      <FormPage
        header={<EditSoraKuvausHeader soraKuvaus={soraKuvaus} />}
        steps={<EditSoraKuvausSteps />}
        footer={
          soraKuvaus ? <EditSoraKuvausFooter soraKuvaus={soraKuvaus} /> : null
        }
      >
        {organisaatioOid ? (
          <OrganisaatioInfo organisaatioOid={organisaatioOid} />
        ) : null}
        {soraKuvaus ? (
          <EditSoraKuvausForm
            soraKuvaus={soraKuvaus}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default EditSoraKuvausPage;
