import React from 'react';

import useOrganisaatio from '../useOrganisaatio';
import FormPage from '../FormPage';
import OppilaitosPageForm from './OppilaitosPageForm';
import OppilaitosFormSteps from '../OppilaitosFormSteps';
import OppilaitosPageHeader from './OppilaitosPageHeader';
import OppilaitosPageFooter from './OppilaitosPageFooter';
import useApiAsync from '../useApiAsync';
import getOppilaitosByOid from '../../utils/kouta/getOppilaitosByOid';
import Spin from '../Spin';
import Title from '../Title';
import useTranslation from '../useTranslation';

const Steps = () => <OppilaitosFormSteps activeStep="oppilaitos" />;

const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
  history,
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
        steps={<Steps />}
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
