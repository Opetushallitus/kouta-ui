import React, { useMemo } from 'react';
import { get } from 'lodash';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditValintaperusteHeader from './EditValintaperusteHeader';
import EditValintaperusteSteps from './EditValintaperusteSteps';
import ValintaperusteFormWrapper from './ValintaperusteFormWrapper';
import EditValintaperusteFooter from './EditValintaperusteFooter';
import useApiAsync from '../useApiAsync';
import getValintaperusteByOid from '../../utils/kouta/getValintaperusteByOid';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import Title from '../Title';
import { useTranslation } from 'react-i18next';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByValintaperuste from '#/src/utils/getFormValuesByValintaperuste';

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

  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return valintaperuste && getFormValuesByValintaperuste(valintaperuste);
  }, [valintaperuste]);

  return !valintaperuste ? (
    <Spin center />
  ) : (
    <ReduxForm form="editValintaperusteForm" initialValues={initialValues}>
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
              <ValintaperusteFormWrapper
                valintaperuste={valintaperuste}
                steps={false}
                canSelectBase={false}
                canEditTyyppi={false}
                organisaatioOid={organisaatioOid}
                koulutustyyppi={
                  get(valintaperuste, 'koulutustyyppi') ||
                  KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
                }
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
