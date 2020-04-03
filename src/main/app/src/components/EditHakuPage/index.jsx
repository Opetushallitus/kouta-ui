import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo, TopInfoContainer } from '../FormPage';
import EditHakuHeader from './EditHakuHeader';
import EditHakuSteps from './EditHakuSteps';
import EditHakuForm from './EditHakuForm';
import EditHakuFooter from './EditHakuFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import getHakuByOid from '../../utils/kouta/getHakuByOid';
import Title from '../Title';
import useTranslation from '../useTranslation';
import ReduxForm from '#/src/components/ReduxForm';

const EditHakuPage = props => {
  const {
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

  return (
    <ReduxForm form="editHakuForm">
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
              <EditHakuForm
                haku={haku}
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

export default EditHakuPage;
