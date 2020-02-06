import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditKoulutusHeader from './EditKoulutusHeader';
import EditKoulutusSteps from './EditKoulutusSteps';
import EditKoulutusForm from './EditKoulutusForm';
import EditKoulutusFooter from './EditKoulutusFooter';
import useApiAsync from '../useApiAsync';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';

const EditKoulutusPage = props => {
  const {
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

  return (
    <>
      <Title>{t('sivuTitlet.koulutuksenMuokkaus')}</Title>
      <FormPage
        header={<EditKoulutusHeader koulutus={koulutus} />}
        steps={<EditKoulutusSteps />}
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
          <EditKoulutusForm
            koulutus={koulutus}
            organisaatioOid={organisaatioOid}
            scrollTarget={scrollTarget}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default EditKoulutusPage;
