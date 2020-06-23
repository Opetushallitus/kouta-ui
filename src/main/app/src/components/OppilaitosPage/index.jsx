import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import OppilaitosForm, {
  initialValues as formInitialValues,
} from '#/src/components/OppilaitosForm';
import useOrganisaatio from '#/src/components/useOrganisaatio';
import FormPage from '#/src/components/FormPage';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import useApiAsync from '#/src/components/useApiAsync';
import getOppilaitosByOid from '#/src/utils/kouta/getOppilaitosByOid';
import Title from '#/src/components/Title';
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import getOrganisaatioContactInfo from '#/src/utils/getOrganisaatioContactInfo';
import koodiUriHasVersion from '#/src/utils/koodiUriHasVersion';
import getFormValuesByOppilaitos from '#/src/utils/getFormValuesByOppilaitos';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/components/FormConfigContext';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useEntityFormConfig } from '#/src/hooks/form';
import FullSpin from '#/src/components/FullSpin';
import OppilaitosPageHeader from './OppilaitosPageHeader';
import OppilaitosPageFooter from './OppilaitosPageFooter';
const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { oppilaitosUpdatedAt } = state;

  const { data: oppilaitos, isLoading } = useApiAsync({
    promiseFn: getOppilaitosByOid,
    oid: organisaatioOid,
    silent: true,
    watch: JSON.stringify([organisaatioOid, oppilaitosUpdatedAt]),
  });

  const { t } = useTranslation();

  const config = useEntityFormConfig(ENTITY.OPPILAITOS);

  const contactInfo = useMemo(() => getOrganisaatioContactInfo(organisaatio), [
    organisaatio,
  ]);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.UPDATE,
    oppilaitos?.organisaatioOid
  );

  const canCreate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.CREATE,
    organisaatioOid
  );

  const readOnly = oppilaitos ? !canUpdate : !canCreate;

  const initialValues = useMemo(
    () => ({
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
      ...formInitialValues,
      ...(oppilaitos && getFormValuesByOppilaitos(oppilaitos)),
    }),
    [oppilaitos, contactInfo]
  );

  const stepsEnabled = !oppilaitos;
  const showArkistoituTilaOption = !!oppilaitos;

  return isLoading ? (
    <FullSpin />
  ) : (
    <>
      <Title>{t('sivuTitlet.oppilaitos')}</Title>
      <ReduxForm form={ENTITY.OPPILAITOS} initialValues={initialValues}>
        <FormConfigContext.Provider value={{ ...config, readOnly }}>
          <FormPage
            readOnly={readOnly}
            steps={<OppilaitosFormSteps activeStep={ENTITY.OPPILAITOS} />}
            header={
              <OppilaitosPageHeader
                oppilaitos={oppilaitos}
                organisaatio={organisaatio}
              />
            }
            footer={
              <OppilaitosPageFooter
                oppilaitos={oppilaitos}
                organisaatioOid={organisaatioOid}
                readOnly={readOnly}
              />
            }
          >
            {organisaatio && (
              <OppilaitosForm
                organisaatioOid={organisaatioOid}
                steps={stepsEnabled}
                showArkistoituTilaOption={showArkistoituTilaOption}
              />
            )}
          </FormPage>
        </FormConfigContext.Provider>
      </ReduxForm>
    </>
  );
};

export default OppilaitosPage;
