import React, { useCallback, useMemo } from 'react';
import queryString from 'query-string';

import FormPage, {
  OrganisaatioInfo,
  KoulutusInfo,
  TopInfoContainer,
} from '../FormPage';
import EditToteutusHeader from './EditToteutusHeader';
import EditToteutusSteps from './EditToteutusSteps';
import ToteutusFormWrapper from './ToteutusFormWrapper';
import EditToteutusFooter from './EditToteutusFooter';
import useApiAsync from '../useApiAsync';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';
import getFormValuesByToteutus from '#/src/utils/getFormValuesByToteutus';

const getToteutusAndKoulutus = async ({ httpClient, apiUrls, oid }) => {
  const toteutus = await getToteutusByOid({ httpClient, apiUrls, oid });

  if (!toteutus || !toteutus.koulutusOid) {
    return { toteutus };
  }

  const koulutus = await getKoulutusByOid({
    httpClient,
    apiUrls,
    oid: toteutus.koulutusOid,
  });

  return { toteutus, koulutus };
};

const EditToteutusPage = props => {
  const {
    history,
    match: {
      params: { organisaatioOid, oid },
    },
    location: { search, state = {} },
  } = props;

  const { toteutusUpdatedAt = null } = state;
  const { scrollTarget = null } = queryString.parse(search);
  const watch = JSON.stringify([oid, toteutusUpdatedAt]);

  const { data: { toteutus = null, koulutus = null } = {} } = useApiAsync({
    promiseFn: getToteutusAndKoulutus,
    oid,
    watch,
  });

  const koulutustyyppi = koulutus ? koulutus.koulutustyyppi : null;
  const { t } = useTranslation();

  const initialValues = useMemo(() => {
    return toteutus && getFormValuesByToteutus(toteutus);
  }, [toteutus]);

  const onAttachHakukohde = useCallback(
    ({ hakuOid }) => {
      if (hakuOid && toteutus) {
        history.push(
          `/organisaatio/${toteutus.organisaatioOid}/toteutus/${toteutus.oid}/haku/${hakuOid}/hakukohde`,
        );
      }
    },
    [history, toteutus],
  );

  return !toteutus ? (
    <Spin center />
  ) : (
    <ReduxForm form="editToteutusForm" initialValues={initialValues}>
      {() => (
        <>
          <Title>{t('sivuTitlet.toteutuksenMuokkaus')}</Title>
          <FormPage
            header={<EditToteutusHeader toteutus={toteutus} />}
            steps={<EditToteutusSteps />}
            footer={
              toteutus ? (
                <EditToteutusFooter
                  toteutus={toteutus}
                  koulutustyyppi={koulutustyyppi}
                  organisaatioOid={organisaatioOid}
                />
              ) : null
            }
          >
            <TopInfoContainer>
              <KoulutusInfo
                organisaatioOid={organisaatioOid}
                koulutus={koulutus}
              />
              <OrganisaatioInfo organisaatioOid={organisaatioOid} />
            </TopInfoContainer>
            {toteutus && koulutus ? (
              <ToteutusFormWrapper
                toteutus={toteutus}
                steps={false}
                canSelectBase={false}
                onAttachHakukohde={onAttachHakukohde}
                organisaatioOid={organisaatioOid}
                koulutusKoodiUri={koulutus ? koulutus.koulutusKoodiUri : null}
                koulutustyyppi={koulutustyyppi}
                ePerusteId={koulutus ? koulutus.ePerusteId : null}
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

export default EditToteutusPage;
