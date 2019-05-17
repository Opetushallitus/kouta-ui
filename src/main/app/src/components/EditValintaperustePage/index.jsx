import React from 'react';
import get from 'lodash/get';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import EditValintaperusteHeader from './EditValintaperusteHeader';
import EditValintaperusteSteps from './EditValintaperusteSteps';
import EditValintaperusteForm from './EditValintaperusteForm';
import EditValintaperusteFooter from './EditValintaperusteFooter';
import useApiAsync from '../useApiAsync';
import { getKoutaValintaperusteByOid } from '../../apiUtils';
import Spin from '../Spin';
import { KOULUTUSTYYPPI_CATEGORY } from '../../constants';

const EditValintaperustePage = props => {
  const {
    match: {
      params: { oid },
    },
    location: { state = {} },
  } = props;

  const { valintaperusteUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, valintaperusteUpdatedAt]);

  const { data: valintaperuste = null } = useApiAsync({
    promiseFn: getKoutaValintaperusteByOid,
    oid,
    watch,
  });

  const organisaatioOid = valintaperuste
    ? valintaperuste.organisaatioOid
    : null;

  const koulutustyyppi =
    get(valintaperuste, 'koulutustyyppi') ||
    KOULUTUSTYYPPI_CATEGORY.AMMATILLINEN_KOULUTUS;

  return (
    <FormPage
      header={<EditValintaperusteHeader valintaperuste={valintaperuste} />}
      steps={<EditValintaperusteSteps />}
      footer={
        valintaperuste ? (
          <EditValintaperusteFooter valintaperuste={valintaperuste} />
        ) : null
      }
    >
      {organisaatioOid ? (
        <OrganisaatioInfo organisaatioOid={organisaatioOid} />
      ) : null}
      {valintaperuste ? (
        <EditValintaperusteForm
          valintaperuste={valintaperuste}
          organisaatioOid={organisaatioOid}
          koulutustyyppi={koulutustyyppi}
        />
      ) : (
        <Spin center />
      )}
    </FormPage>
  );
};

export default EditValintaperustePage;
