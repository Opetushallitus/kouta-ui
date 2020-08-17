import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import useOrganisaatio, { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import FormPage from '#/src/components/FormPage';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import useApiAsync from '#/src/hooks/useApiAsync';
import getOppilaitoksenOsaByOid from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByOid';
import { Spin } from '#/src/components/virkailija';
import Title from '#/src/components/Title';
import EntityFormHeader from '#/src/components/EntityFormHeader';
import { ENTITY, CRUD_ROLES, ORGANISAATIOTYYPPI } from '#/src/constants';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';
import koodiUriHasVersion from '#/src/utils/koodi/koodiUriHasVersion';
import getFormValuesByOppilaitoksenOsa from '#/src/utils/oppilaitoksenOsa/getFormValuesByOppilaitoksenOsa';
import getOppilaitoksenOsaFormConfig from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaFormConfig';
import ReduxForm from '#/src/components/ReduxForm';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import OppilaitoksenOsaPageFooter from './OppilaitoksenOsaPageFooter';
import OppilaitoksenOsaForm, {
  initialValues as formInitialValues,
} from './OppilaitoksenOsaForm';
import getOrganisaatioParentOidPath from '#/src/utils/organisaatio/getOrganisaatioParentOidPath';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const useOppilaitosOid = oppilaitoksenOsaOrganisaatio => {
  const parentOids = getOrganisaatioParentOidPath(oppilaitoksenOsaOrganisaatio);
  const { organisaatiot } = useOrganisaatiot(parentOids);
  const oppilaitos = organisaatiot?.find?.(
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)
  );
  return oppilaitos?.oid;
};

const OppilaitoksenOsaPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const { oppilaitoksenOsaUpdatedAt } = state;

  const { data: oppilaitoksenOsa, finishedAt } = useApiAsync({
    promiseFn: getOppilaitoksenOsaByOid,
    oid: organisaatioOid,
    silent: true,
    watch: JSON.stringify([organisaatioOid, oppilaitoksenOsaUpdatedAt]),
  });

  // TODO: Setting oppilaitosOid should be done in backend. https://jira.oph.ware.fi/jira/browse/KTO-819
  const oppilaitosOid = useOppilaitosOid(organisaatio);

  const { t } = useTranslation();
  const oppilaitoksenOsaIsResolved = !!finishedAt;

  const stepsEnabled = !oppilaitoksenOsa;
  const showArkistoituTilaOption = !!oppilaitoksenOsa;
  const contactInfo = useMemo(() => getOrganisaatioContactInfo(organisaatio), [
    organisaatio,
  ]);

  const canUpdate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.UPDATE,
    oppilaitoksenOsa?.organisaatioOid
  );

  const canCreate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.CREATE,
    organisaatioOid
  );

  const readOnly = oppilaitoksenOsa ? !canUpdate : !canCreate;

  const initialValues = useMemo(
    () => ({
      ...formInitialValues,
      oppilaitosOid,
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
    [oppilaitoksenOsa, contactInfo, oppilaitosOid]
  );

  const config = getOppilaitoksenOsaFormConfig();

  return (
    <ReduxForm form="oppilaitoksenOsa" initialValues={initialValues}>
      <FormConfigContext.Provider value={{ ...config, readOnly }}>
        <Title>{t('sivuTitlet.oppilaitoksenOsa')}</Title>
        <FormPage
          readOnly={readOnly}
          steps={<OppilaitosFormSteps activeStep={ENTITY.OPPILAITOKSEN_OSA} />}
          header={
            <EntityFormHeader
              entityType={ENTITY.OPPILAITOKSEN_OSA}
              entity={{ ...(organisaatio ?? {}), ...(oppilaitoksenOsa ?? {}) }}
            />
          }
          footer={
            <OppilaitoksenOsaPageFooter
              oppilaitoksenOsa={oppilaitoksenOsa}
              organisaatioOid={organisaatioOid}
              readOnly={readOnly}
            />
          }
        >
          {organisaatio && oppilaitoksenOsaIsResolved ? (
            <OppilaitoksenOsaForm
              organisaatioOid={organisaatioOid}
              steps={stepsEnabled}
              showArkistoituTilaOption={showArkistoituTilaOption}
            />
          ) : (
            <Spin center />
          )}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};

export default OppilaitoksenOsaPage;
