import React from 'react';

import ReduxForm from '../ReduxForm';
import OppilaitoksenOsaForm from '../OppilaitoksenOsaForm';

const OppilaitoksenOsaPageForm = props => {
  return (
    <ReduxForm form="oppilaitoksenOsa">
      {() => <OppilaitoksenOsaForm steps {...props} />}
    </ReduxForm>
  );
};

export default OppilaitoksenOsaPageForm;
