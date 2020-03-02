import React, { useMemo } from 'react';
import { get } from 'lodash';

import ReduxForm from '../ReduxForm';

import OppilaitosForm, {
  initialValues as formInitialValues,
} from '../OppilaitosForm';

import getFormValuesByOppilaitos from '../../utils/getFormValuesByOppilaitos';
import getOrganisaatioContactInfo from '../../utils/getOrganisaatioContactInfo';
import koodiUriHasVersion from '../../utils/koodiUriHasVersion';

const OppilaitosPageForm = ({ organisaatio, oppilaitos }) => {
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
      ...(oppilaitos && getFormValuesByOppilaitos(oppilaitos)),
    }),
    [oppilaitos, contactInfo],
  );

  const stepsEnabled = !oppilaitos;
  const showArkistoituTilaOption = !!oppilaitos;

  return (
    <ReduxForm form="oppilaitos" initialValues={initialValues}>
      {() => (
        <OppilaitosForm
          organisaatioOid={organisaatioOid}
          steps={stepsEnabled}
          showArkistoituTilaOption={showArkistoituTilaOption}
        />
      )}
    </ReduxForm>
  );
};

export default OppilaitosPageForm;
