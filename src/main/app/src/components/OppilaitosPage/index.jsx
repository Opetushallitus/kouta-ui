import React from 'react';

import useOrganisaatio from '../useOrganisaatio';
import FormPage from '../FormPage';
import OppilaitosPageForm from './OppilaitosPageForm';
import OppilaitosFormSteps from '../OppilaitosFormSteps';
import OppilaitosPageHeader from './OppilaitosPageHeader';
import OppilaitosPageFooter from './OppilaitosPageFooter';

const Steps = () => <OppilaitosFormSteps activeStep="oppilaitos" />;

const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  return (
    <FormPage
      steps={<Steps />}
      header={<OppilaitosPageHeader organisaatio={organisaatio} />}
      footer={
        <OppilaitosPageFooter
          oppilaitos={null}
          oppilaitosIsLoading={false}
          organisaatioOid={organisaatioOid}
        />
      }
    >
      <OppilaitosPageForm organisaatioOid={organisaatioOid} />
    </FormPage>
  );
};

export default OppilaitosPage;
