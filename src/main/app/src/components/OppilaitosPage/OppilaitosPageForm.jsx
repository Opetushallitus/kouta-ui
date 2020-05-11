import React, { useMemo } from 'react';
import { get } from 'lodash';

import ReduxForm from '../ReduxForm';

import OppilaitosForm, {
  initialValues as formInitialValues,
} from '../OppilaitosForm';

import getOppilaitosFormConfig from '#/src/utils/getOppilaitosFormConfig';
import getFormValuesByOppilaitos from '#/src/utils/getFormValuesByOppilaitos';
import getOrganisaatioContactInfo from '#/src/utils/getOrganisaatioContactInfo';
import koodiUriHasVersion from '#/src/utils/koodiUriHasVersion';
import FormConfigContext from '../FormConfigContext';

const OppilaitosPageForm = ({ organisaatio, oppilaitos }) => {
  const organisaatioOid = get(organisaatio, 'oid');

  const config = useMemo(() => getOppilaitosFormConfig(), []);

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
    [oppilaitos, contactInfo]
  );

  const stepsEnabled = !oppilaitos;
  const showArkistoituTilaOption = !!oppilaitos;

  return (
    <FormConfigContext.Provider value={config}>
      <ReduxForm form="oppilaitos" initialValues={initialValues}>
        <OppilaitosForm
          organisaatioOid={organisaatioOid}
          steps={stepsEnabled}
          showArkistoituTilaOption={showArkistoituTilaOption}
        />
      </ReduxForm>
    </FormConfigContext.Provider>
  );
};

export default OppilaitosPageForm;
