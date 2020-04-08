import React, { useCallback, useContext, useMemo } from 'react';
import queryString from 'query-string';
import ReduxForm from '../ReduxForm';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditKoulutusHeader from './EditKoulutusHeader';
import EditKoulutusSteps from './EditKoulutusSteps';
import KoulutusFormWrapper from './KoulutusFormWrapper';
import EditKoulutusFooter from './EditKoulutusFooter';
import useApiAsync from '../useApiAsync';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';
import UrlContext from '#/src/components/UrlContext';
import useAuthorizedUserRoleBuilder from '#/src/components/useAuthorizedUserRoleBuilder';
import { HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import useFieldValue from '#/src/components/useFieldValue';
import FormNameContext from '#/src/components/FormNameContext';
import { Field } from 'redux-form';
import { FormFieldCheckbox } from '../formFields';
import getFormValuesByKoulutus from '#/src/utils/getFormValuesByKoulutus';

const ToggleDraft = () => {
  const { t } = useTranslation();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const isOphVirkailija = useMemo(
    () =>
      roleBuilder
        .hasUpdate(HAKU_ROLE, OPETUSHALLITUS_ORGANISAATIO_OID)
        .result(),
    [roleBuilder],
  );
  const esikatselu = useFieldValue('esikatselu');

  return esikatselu !== undefined && isOphVirkailija ? (
    <Field name={'esikatselu'} component={FormFieldCheckbox}>
      {t('yleiset.salliEsikatselu')}
    </Field>
  ) : null;
};

const EditKoulutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { search, state = {} },
  } = props;

  const { koulutusUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
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
        `/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/toteutus`,
      );
  }, [history, koulutus, organisaatioOid]);

  return !koulutus ? (
    <Spin center />
  ) : (
    <ReduxForm form="editKoulutusForm" initialValues={initialValues}>
      {() => (
        <>
          <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
          <FormPage
            header={<EditKoulutusHeader koulutus={koulutus} />}
            steps={<EditKoulutusSteps />}
            draftUrl={apiUrls.url('konfo-ui.koulutus', oid) + '?draft=true'}
            toggleDraft={
              <FormNameContext.Provider value={'editKoulutusForm'}>
                <ToggleDraft />
              </FormNameContext.Provider>
            }
            footer={
              koulutus ? (
                <EditKoulutusFooter
                  koulutus={koulutus}
                  organisaatioOid={organisaatioOid}
                />
              ) : null
            }
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            {koulutus ? (
              <KoulutusFormWrapper
                steps={false}
                isNewKoulutus={false}
                johtaaTutkintoon={Boolean(koulutus.johtaaTutkintoon)}
                onAttachToteutus={onAttachToteutus}
                koulutus={koulutus}
                koulutusOrganisaatioOid={koulutus.organisaatioOid}
                organisaatioOid={organisaatioOid}
                scrollTarget={scrollTarget}
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

export default EditKoulutusPage;
