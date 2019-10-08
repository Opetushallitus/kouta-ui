import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '../Typography';
import getKoulutuksenToteutukset from '../../utils/kouta/getKoulutuksenToteutukset';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Anchor from '../Anchor';

const getToteutukset = async ({
  httpClient,
  apiUrls,
  oid,
  organisaatioOid,
}) => {
  return oid
    ? getKoulutuksenToteutukset({ httpClient, apiUrls, oid, organisaatioOid })
    : [];
};

const ToteutuksetSection = ({ koulutus, organisaatioOid }) => {
  const { t } = useTranslation();
  const koulutusOid = koulutus ? koulutus.oid : null;

  const { data: toteutukset } = useApiAsync({
    promiseFn: getToteutukset,
    oid: koulutusOid,
    organisaatioOid,
    watch: JSON.stringify([koulutusOid, organisaatioOid]),
  });

  const toteutusLinks = toteutukset
    ? toteutukset.map(({ nimi, oid }) => (
        <Anchor
          as={Link}
          to={`/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`}
        >
          {getFirstLanguageValue(nimi) || '-'}
        </Anchor>
      ))
    : [];

  const toteutusLinksList = toteutusLinks.map((l, index) => (
    <>
      {l}
      {index < toteutusLinks.length - 1 ? ', ' : ''}
    </>
  ));

  return (
    <Typography>
      {toteutusLinks.length === 0 ? (
        t('koulutuslomake.koulutuksellaEiToteutuksia')
      ) : (
        <>
          {t('koulutuslomake.koulutukseenOnLiitettyToteutukset')}:{' '}
          {toteutusLinksList}
        </>
      )}
    </Typography>
  );
};

export default ToteutuksetSection;
