import React, { useCallback, useMemo } from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditHakuHeader from './EditHakuHeader';
import EditHakuSteps from './EditHakuSteps';
import EditHakuFooter from './EditHakuFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
import Title from '../Title';
import { useTranslation } from 'react-i18next';
import ReduxForm from '#/src/components/ReduxForm';
import getHakuFormConfig from '#/src/utils/getHakuFormConfig';
import getFormValuesByHaku from '#/src/utils/getFormValuesByHaku';
import HakuForm from '#/src/components/HakuForm';
import FormConfigContext from '#/src/components/FormConfigContext';

const config = getHakuFormConfig();

const EditHakuPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { search, state = {} },
  } = props;

  const { hakuUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, hakuUpdatedAt]);

  const { data: haku = null } = useApiAsync({
    promiseFn: getHakuByOid,
    oid,
    watch,
  });

  const { t } = useTranslation();
  const initialValues = useMemo(() => {
    return haku && getFormValuesByHaku(haku);
  }, [haku]);

  const onAttachHakukohde = useCallback(
    ({ toteutusOid }) => {
      if (toteutusOid) {
        history.push(
          `/organisaatio/${organisaatioOid}/toteutus/${toteutusOid}/haku/${haku.oid}/hakukohde`,
        );
      }
    },
    [history, organisaatioOid, haku],
  );

  return (
    <ReduxForm form="editHakuForm" initialValues={initialValues}>
      {() => (
        <>
          <Title>{t('sivuTitlet.haunMuokkaus')}</Title>
          <FormPage
            header={<EditHakuHeader haku={haku} />}
            steps={<EditHakuSteps />}
            footer={haku ? <EditHakuFooter haku={haku} /> : null}
          >
            <TopInfoContainer>
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            {haku ? (
              <FormConfigContext.Provider value={config}>
                <HakuForm
                  haku={haku}
                  organisaatioOid={organisaatioOid}
                  scrollTarget={scrollTarget}
                  steps={false}
                  initialValues={initialValues}
                  onAttachHakukohde={onAttachHakukohde}
                  canSelectBase={false}
                />
              </FormConfigContext.Provider>
            ) : (
              <Spin center />
            )}
          </FormPage>
        </>
      )}
    </ReduxForm>
  );
};

export default EditHakuPage;
