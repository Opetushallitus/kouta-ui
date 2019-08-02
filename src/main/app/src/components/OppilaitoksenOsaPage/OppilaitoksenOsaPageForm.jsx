import React, { useMemo } from 'react';
import get from 'lodash/get';

import ReduxForm from '../ReduxForm';
import OppilaitoksenOsaForm from '../OppilaitoksenOsaForm';
import getFormValuesByOppilaitoksenOsa from '../../utils/getFormValuesByOppilaitoksenOsa';
import getOrganisaatioContactInfo from '../../utils/getOrganisaatioContactInfo';

const OppilaitoksenOsaPageForm = ({ organisaatio, oppilaitoksenOsa }) => {
  const organisaatioOid = get(organisaatio, 'oid');

  const contactInfo = useMemo(() => getOrganisaatioContactInfo(organisaatio), [
    organisaatio,
  ]);

  const initialValues = useMemo(
    () => ({
      yhteystiedot: {
        osoite: contactInfo.osoite || {},
        postinumero: contactInfo.postinumero || '',
        postitoimipaikka: contactInfo.postitoimipaikka || {},
        verkkosivu: contactInfo.verkkosivu || '',
        puhelinnumero: contactInfo.puhelinnumero || '',
      },
      ...(oppilaitoksenOsa &&
        getFormValuesByOppilaitoksenOsa(oppilaitoksenOsa)),
    }),
    [oppilaitoksenOsa, contactInfo],
  );

  return (
    <ReduxForm form="oppilaitoksenOsa" initialValues={initialValues}>
      {() => <OppilaitoksenOsaForm organisaatioOid={organisaatioOid} steps />}
    </ReduxForm>
  );
};

export default OppilaitoksenOsaPageForm;
