import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import ValintaperusteFormWrapper from './ValintaperusteFormWrapper';
import EditValintaperusteFooter from './EditValintaperusteFooter';
import useApiAsync from '#/src/components/useApiAsync';
import getValintaperusteByOid from '#/src/utils/kouta/getValintaperusteByOid';
import Spin from '#/src/components/Spin';
import { KOULUTUSTYYPPI, ENTITY } from '#/src/constants';
import Title from '#/src/components/Title';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByValintaperuste from '#/src/utils/getFormValuesByValintaperuste';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormSteps from '#/src/components/FormSteps';

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
      <Title>{t('sivuTitlet.valintaperusteenMuokkaus')}</Title>
      <FormPage
        header={
          <EntityFormHeader
            entityType={ENTITY.VALINTAPERUSTE}
            entity={valintaperuste}
          />
        }
        steps={<FormSteps activeStep={ENTITY.VALINTAPERUSTE} />}
        footer={
          valintaperuste ? (
            <EditValintaperusteFooter valintaperuste={valintaperuste} />
          ) : null
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {valintaperuste ? (
          <ValintaperusteFormWrapper
            valintaperuste={valintaperuste}
            steps={false}
            canSelectBase={false}
            canEditTyyppi={false}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={
              _.get(valintaperuste, 'koulutustyyppi') ||
              KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
            }
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default EditValintaperustePage;
