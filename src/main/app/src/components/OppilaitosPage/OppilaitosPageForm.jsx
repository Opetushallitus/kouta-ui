import React from 'react';

import ReduxForm from '../ReduxForm';
import OppilaitosForm from '../OppilaitosForm';

const OppilaitosPageForm = props => {
  return (
    <ReduxForm form="oppilaitos">
      {() => <OppilaitosForm steps {...props} />}
    </ReduxForm>
  );
};

export default OppilaitosPageForm;
