import React from 'react';

import useOrganisaatio from '../useOrganisaatio';
import FormPage from '../FormPage';
import OppilaitosPageForm from './OppilaitosPageForm';
import OppilaitosFormSteps from '../OppilaitosFormSteps';
import OppilaitosPageHeader from './OppilaitosPageHeader';
import OppilaitosPageFooter from './OppilaitosPageFooter';
import useApiAsync from '../useApiAsync';
import getOppilaitos from '../../utils/kouta/getOppilaitos';

const Steps = () => <OppilaitosFormSteps activeStep="oppilaitos" />;

const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { oppilaitosUpdatedAt } = state;

  const { data: oppilaitos, isLoading: oppilaitosIsLoading } = useApiAsync({
    promiseFn: getOppilaitos,
    watch: JSON.stringify([organisaatioOid, oppilaitosUpdatedAt]),
  });

  return (
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
      <OppilaitosPageForm organisaatioOid={organisaatioOid} />
    </FormPage>
  );
};

export default OppilaitosPage;
