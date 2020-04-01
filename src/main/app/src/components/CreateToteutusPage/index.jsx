import React from 'react';
import queryString from 'query-string';

import FormPage, {
  OrganisaatioInfo,
  KoulutusInfo,
  TopInfoContainer,
} from '../FormPage';
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

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByOid,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const selectBase = useSelectBase(history, { kopioParam: 'kopioToteutusOid' });
  const { t } = useTranslation();

  const koulutustyyppi =
    koulutus && koulutus.koulutustyyppi
      ? koulutus.koulutustyyppi
      : KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS;

  return (
    <>
      <Title>{t('sivuTitlet.uusiToteutus')}</Title>
      <FormPage
        header={<CreateToteutusHeader />}
        steps={<CreateToteutusSteps />}
        footer={
          koulutus ? (
            <CreateToteutusFooter
              koulutustyyppi={koulutustyyppi}
              organisaatioOid={organisaatioOid}
              koulutusOid={koulutusOid}
            />
          ) : null
        }
      >
        <TopInfoContainer>
          <KoulutusInfo organisaatioOid={organisaatioOid} koulutus={koulutus} />
          <OrganisaatioInfo organisaatioOid={organisaatioOid} />
        </TopInfoContainer>
        {koulutus ? (
          <CreateToteutusForm
            koulutus={koulutus}
            koulutusKoodiUri={koulutus.koulutusKoodiUri}
            koulutusNimi={koulutus.nimi}
            koulutusKielet={koulutus.kielivalinta}
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
