import React, { useMemo } from 'react';
import { get } from 'lodash';

import ReduxForm from '../ReduxForm';

import OppilaitoksenOsaForm, {
  initialValues as formInitialValues,
} from '../OppilaitoksenOsaForm';

import getFormValuesByOppilaitoksenOsa from '../../utils/getFormValuesByOppilaitoksenOsa';
import getOrganisaatioContactInfo from '../../utils/getOrganisaatioContactInfo';
import koodiUriHasVersion from '../../utils/koodiUriHasVersion';

const OppilaitoksenOsaPageForm = ({ organisaatio, oppilaitoksenOsa }) => {
  const organisaatioOid = get(organisaatio, 'oid');

  const contactInfo = useMemo(() => getOrganisaatioContactInfo(organisaatio), [
    organisaatio,
  ]);

  const initialValues = useMemo(
    () => ({
      ...formInitialValues,
      yhteystiedot: {
        osoite: contactInfo.osoite || {},
        postinumero: contactInfo.postinumeroKoodiUri
          ? {
              value: koodiUriHasVersion(contactInfo.postinumeroKoodiUri)
                ? contactInfo.postinumeroKoodiUri
                : `${contactInfo.postinumeroKoodiUri}#2`,
            }
          : undefined,
        verkkosivu: contactInfo.verkkosivu || '',
        puhelinnumero: contactInfo.puhelinnumero || '',
      },
      ...(oppilaitoksenOsa &&
        getFormValuesByOppilaitoksenOsa(oppilaitoksenOsa)),
    }),
    [oppilaitoksenOsa, contactInfo],
  );

  const stepsEnabled = !oppilaitoksenOsa;
  const showArkistoituTilaOption = !!oppilaitoksenOsa;

  return (
    <ReduxForm form="oppilaitoksenOsa" initialValues={initialValues}>
      {() => (
        <OppilaitoksenOsaForm
          organisaatioOid={organisaatioOid}
          steps={stepsEnabled}
          showArkistoituTilaOption={showArkistoituTilaOption}
        />
      )}
    </ReduxForm>
  );
};

export default OppilaitoksenOsaPageForm;
