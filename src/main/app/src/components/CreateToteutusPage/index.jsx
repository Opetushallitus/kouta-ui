import React from 'react';
import queryString from 'query-string';

import FormPage, { OrganisaatioInfo } from '../FormPage';
import getKoulutusByOid from '../../utils/kouta/getKoulutusByOid';
import CreateToteutusHeader from './CreateToteutusHeader';
import CreateToteutusSteps from './CreateToteutusSteps';
import CreateToteutusForm from './CreateToteutusForm';
import CreateToteutusFooter from './CreateToteutusFooter';
import useApiAsync from '../useApiAsync';
import Spin from '../Spin';
import { KOULUTUSTYYPPI } from '../../constants';
import useSelectBase from '../useSelectBase';
import Title from '../Title';
import useTranslation from '../useTranslation';

const CreateToteutusPage = props => {
  const {
    match: {
      params: { organisaatioOid, koulutusOid },
    },
    location: { search },
    history,
  } = props;

  const { kopioToteutusOid = null } = queryString.parse(search);

  const { data } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const selectBase = useSelectBase(history, { kopioParam: 'kopioToteutusOid' });
  const { t } = useTranslation();

  const koulutustyyppi =
    data && data.koulutustyyppi
      ? data.koulutustyyppi
      : KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  return (
    <>
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormPage
        header={<CreateToteutusHeader />}
        steps={<CreateToteutusSteps />}
        footer={
          data ? (
            <CreateToteutusFooter
              koulutustyyppi={koulutustyyppi}
              organisaatioOid={organisaatioOid}
              koulutusOid={koulutusOid}
            />
          ) : null
        }
      >
        <OrganisaatioInfo organisaatioOid={organisaatioOid} />
        {data ? (
          <CreateToteutusForm
            koulutusKoodiUri={data.koulutusKoodiUri}
            organisaatioOid={organisaatioOid}
            koulutustyyppi={koulutustyyppi}
            kopioToteutusOid={kopioToteutusOid}
            onSelectBase={selectBase}
            showArkistoituTilaOption={false}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default CreateToteutusPage;
