import React, { useEffect } from 'react';
import get from 'lodash/get';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditSoraKuvausHeader from './EditSoraKuvausHeader';
import EditSoraKuvausSteps from './EditSoraKuvausSteps';
import EditSoraKuvausForm from './EditSoraKuvausForm';
import EditSoraKuvausFooter from './EditSoraKuvausFooter';
import useSoraKuvaus from '../useSoraKuvaus';
import Spin from '../Spin';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';
import { isFunction } from '../../utils';

const EditSoraKuvausPage = props => {
  const {
    match: {
      params: { id },
    },
    location: { state = {} },
  } = props;

  const { soraKuvausUpdatedAt = null } = state;
  const { soraKuvaus, reload } = useSoraKuvaus(id);

  useEffect(() => {
    soraKuvausUpdatedAt && isFunction(reload) && reload();
  }, [soraKuvausUpdatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const organisaatioOid = soraKuvaus ? soraKuvaus.organisaatioOid : null;

  const koulutustyyppi =
    get(soraKuvaus, 'koulutustyyppi') ||
    KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

  return (
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
  );
};

export default EditSoraKuvausPage;
