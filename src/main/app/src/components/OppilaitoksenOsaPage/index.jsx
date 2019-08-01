import React from 'react';

import useOrganisaatio from '../useOrganisaatio';
import FormPage from '../FormPage';
import OppilaitoksenOsaPageForm from './OppilaitoksenOsaPageForm';
import OppilaitosFormSteps from '../OppilaitosFormSteps';
import OppilaitoksenOsaPageHeader from './OppilaitoksenOsaPageHeader';
import OppilaitoksenOsaPageFooter from './OppilaitoksenOsaPageFooter';

const Steps = () => <OppilaitosFormSteps activeStep="oppilaitoksenOsa" />;

const OppilaitoksenOsaPage = ({
  match: {
    params: { organisaatioOid },
  },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  return (
    <FormPage
      steps={<Steps />}
      header={<OppilaitoksenOsaPageHeader organisaatio={organisaatio} />}
      footer={
        <OppilaitoksenOsaPageFooter
          oppilaitoksenOsa={{}}
          oppilaitoksenOsaIsLoading={false}
        />
      }
    >
      <OppilaitoksenOsaPageForm organisaatioOid={organisaatioOid} />
    </FormPage>
  );
};

export default OppilaitoksenOsaPage;
