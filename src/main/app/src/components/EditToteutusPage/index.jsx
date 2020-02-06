import React from 'react';
import queryString from 'query-string';

import FormPage, {
  OrganisaatioInfo,
  KoulutusInfo,
  TopInfoContainer,
} from '../FormPage';
import EditToteutusHeader from './EditToteutusHeader';
import EditToteutusSteps from './EditToteutusSteps';
import EditToteutusForm from './EditToteutusForm';
import EditToteutusFooter from './EditToteutusFooter';
import useApiAsync from '../useApiAsync';
import getToteutusByOid from '../../utils/kouta/getToteutusByOid';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';

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

  return (
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
          <KoulutusInfo organisaatioOid={organisaatioOid} koulutus={koulutus} />
          <OrganisaatioInfo organisaatioOid={organisaatioOid} />
        </TopInfoContainer>
        {toteutus && koulutus ? (
          <EditToteutusForm
            toteutus={toteutus}
            organisaatioOid={organisaatioOid}
            koulutusKoodiUri={koulutus ? koulutus.koulutusKoodiUri : null}
            koulutustyyppi={koulutustyyppi}
            scrollTarget={scrollTarget}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default EditToteutusPage;
