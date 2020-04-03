import React from 'react';
import { get } from 'lodash';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditValintaperusteHeader from './EditValintaperusteHeader';
import EditValintaperusteSteps from './EditValintaperusteSteps';
import EditValintaperusteForm from './EditValintaperusteForm';
import EditValintaperusteFooter from './EditValintaperusteFooter';
import useApiAsync from '../useApiAsync';
import getValintaperusteByOid from '../../utils/kouta/getValintaperusteByOid';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';

const EditValintaperustePage = props => {
  const {
    match: {
      params: { organisaatioOid, id },
    },
    location: { state = {} },
  } = props;

  const { valintaperusteUpdatedAt = null } = state;
  const watch = JSON.stringify([id, valintaperusteUpdatedAt]);

  const { data: valintaperuste = null } = useApiAsync({
    promiseFn: getValintaperusteByOid,
    oid: id,
    watch,
  });

  const koulutustyyppi =
    get(valintaperuste, 'koulutustyyppi') ||
    KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  const { t } = useTranslation();

  return (
    <ReduxForm form="editValintaperusteForm">
      {() => (
        <>
          <Title>{t('sivuTitlet.valintaperusteenMuokkaus')}</Title>
          <FormPage
            header={
              <EditValintaperusteHeader valintaperuste={valintaperuste} />
            }
            steps={<EditValintaperusteSteps />}
            footer={
              valintaperuste ? (
                <EditValintaperusteFooter valintaperuste={valintaperuste} />
              ) : null
            }
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
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
        </>
      )}
    </ReduxForm>
  );
};

export default EditValintaperustePage;
