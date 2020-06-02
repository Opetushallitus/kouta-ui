import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ReduxForm from '#/src/components/ReduxForm';
import FormPage, {
  OrganisaatioRelation,
  RelationInfoContainer,
} from '#/src/components/FormPage';
import KoulutusFormWrapper from './KoulutusFormWrapper';
import EditKoulutusFooter from './EditKoulutusFooter';
import useApiAsync from '#/src/components/useApiAsync';
import getKoulutusByOid from '#/src/utils/kouta/getKoulutusByOid';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import UrlContext from '#/src/components/UrlContext';
import getFormValuesByKoulutus from '#/src/utils/getFormValuesByKoulutus';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { ENTITY } from '#/src/constants';
import FormSteps from '#/src/components/FormSteps';
import ToggleDraft from '#/src/components/ToggleDraft';

const EditKoulutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { state = {} },
  } = props;

  const { koulutusUpdatedAt = null } = state;
  const watch = JSON.stringify([oid, koulutusUpdatedAt]);

  const { data: koulutus = null } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid,
    watch,
  });

  const { t } = useTranslation();
  const apiUrls = useContext(UrlContext);
  const initialValues = useMemo(() => {
    return koulutus && getFormValuesByKoulutus(koulutus);
  }, [koulutus]);

  const onAttachToteutus = useCallback(() => {
    organisaatioOid &&
      koulutus &&
      history.push(
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/toteutus`
      );
  }, [history, koulutus, organisaatioOid]);

  return !koulutus ? (
    <Spin center />
  ) : (
    <ReduxForm form="editKoulutusForm" initialValues={initialValues}>
      <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
      <FormPage
        header={
          <EntityFormHeader entityType={ENTITY.KOULUTUS} entity={koulutus} />
        }
        steps={<FormSteps activeStep={ENTITY.KOULUTUS} />}
        draftUrl={apiUrls.url('konfo-ui.koulutus', oid) + '?draft=true'}
        toggleDraft={<ToggleDraft />}
        footer={
          koulutus ? (
            <EditKoulutusFooter
              koulutus={koulutus}
              organisaatioOid={organisaatioOid}
            />
          ) : null
        }
      >
        <RelationInfoContainer>
          <OrganisaatioRelation organisaatioOid={organisaatioOid} />
        </RelationInfoContainer>
        {koulutus ? (
          <KoulutusFormWrapper
            steps={false}
            isNewKoulutus={false}
            johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
            onAttachToteutus={onAttachToteutus}
            koulutus={koulutus}
            koulutusOrganisaatioOid={koulutus.organisaatioOid}
            organisaatioOid={organisaatioOid}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </ReduxForm>
  );
};

export default EditKoulutusPage;
