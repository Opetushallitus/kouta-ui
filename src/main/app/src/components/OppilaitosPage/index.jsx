import React from 'react';
import { useTranslation } from 'react-i18next';

import useOrganisaatio from '#/src/components/useOrganisaatio';
import FormPage from '#/src/components/FormPage';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import useApiAsync from '#/src/components/useApiAsync';
import getOppilaitosByOid from '#/src/utils/kouta/getOppilaitosByOid';
import Spin from '#/src/components/Spin';
import Title from '#/src/components/Title';
import { ENTITY } from '#/src/constants';
import OppilaitosPageForm from './OppilaitosPageForm';
import OppilaitosPageFooter from './OppilaitosPageFooter';
import OppilaitosPageHeader from './OppilaitosPageHeader';

const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { oppilaitosUpdatedAt } = state;

  const {
    data: oppilaitos,
    isLoading: oppilaitosIsLoading,
    isSettled: oppilaitosIsSettled,
  } = useApiAsync({
    promiseFn: getOppilaitosByOid,
    oid: organisaatioOid,
    silent: true,
    watch: JSON.stringify([organisaatioOid, oppilaitosUpdatedAt]),
  });

  const { t } = useTranslation();

  return (
    <>
      <Title>{t('sivuTitlet.oppilaitos')}</Title>
      <FormPage
        steps={<OppilaitosFormSteps activeStep={ENTITY.OPPILAITOS} />}
        header={<OppilaitosPageHeader organisaatio={organisaatio} />}
        footer={
          <OppilaitosPageFooter
            oppilaitos={oppilaitos}
            oppilaitosIsLoading={oppilaitosIsLoading}
            organisaatioOid={organisaatioOid}
          />
        }
      >
        {organisaatio && oppilaitosIsSettled ? (
          <OppilaitosPageForm
            organisaatio={organisaatio}
            oppilaitos={oppilaitos}
          />
        ) : (
          <Spin center />
        )}
      </FormPage>
    </>
  );
};

export default OppilaitosPage;
