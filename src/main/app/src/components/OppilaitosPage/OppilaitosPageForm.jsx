import React, { useMemo } from 'react';
import get from 'lodash/get';

import ReduxForm from '../ReduxForm';

import OppilaitosForm, {
  initialValues as formInitialValues,
} from '../OppilaitosForm';

import getFormValuesByOppilaitos from '../../utils/getFormValuesByOppilaitos';
import getOrganisaatioContactInfo from '../../utils/getOrganisaatioContactInfo';

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
        postinumero: contactInfo.postinumero || '',
        postitoimipaikka: contactInfo.postitoimipaikka || {},
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
