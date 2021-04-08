import React, { useMemo, useState } from 'react';

import { StatusCodes } from 'http-status-codes';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import FormPage from '#/src/components/FormPage';
import FullSpin from '#/src/components/FullSpin';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import {
  ENTITY,
  CRUD_ROLES,
  ORGANISAATIOTYYPPI,
  FormMode,
} from '#/src/constants';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useOrganisaatio, { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import koodiUriHasVersion from '#/src/utils/koodi/koodiUriHasVersion';
import { getFormValuesByOppilaitoksenOsa } from '#/src/utils/oppilaitoksenOsa/getFormValuesByOppilaitoksenOsa';
import { useOppilaitoksenOsaByOid } from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByOid';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';
import getOrganisaatioParentOidPath from '#/src/utils/organisaatio/getOrganisaatioParentOidPath';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

import OppilaitoksenOsaForm, {
  initialValues as formInitialValues,
} from './OppilaitoksenOsaForm';
import OppilaitoksenOsaPageFooter from './OppilaitoksenOsaPageFooter';

const useOppilaitosOid = oppilaitoksenOsaOrganisaatio => {
  const parentOids = getOrganisaatioParentOidPath(oppilaitoksenOsaOrganisaatio);
  const { organisaatiot } = useOrganisaatiot(parentOids);
  const oppilaitos = organisaatiot?.find?.(
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)
  );
  return oppilaitos?.oid;
};

export const OppilaitoksenOsaPage = ({
  match: {
    params: { organisaatioOid },
  },
}) => {
  const { organisaatio } = useOrganisaatio(organisaatioOid);

  const [formMode, setFormMode] = useState<FormMode>(FormMode.EDIT);

  const { data: oppilaitoksenOsa, isFetching } = useOppilaitoksenOsaByOid(
    organisaatioOid,
    {
      retry: 0,
      onError: e => {
        if (e.response.status === StatusCodes.NOT_FOUND) {
          setFormMode(FormMode.CREATE);
        }
      },
      onSuccess: () => {
        setFormMode(FormMode.EDIT);
      },
    }
  );

  // TODO: Setting oppilaitosOid should be done in backend. https://jira.oph.ware.fi/jira/browse/KTO-819
  const oppilaitosOid = useOppilaitosOid(organisaatio);

  const { t } = useTranslation();

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

  const config = useMemo(() => ({ noFieldConfigs: true, readOnly }), [
    readOnly,
  ]);

  const initialValues = useMemo(
    () => ({
      ...(formMode === FormMode.CREATE
        ? {
            ...formInitialValues,
            yhteystiedot: [
              {
                postiosoite: contactInfo.osoite || {},
                postinumero: contactInfo.postinumeroKoodiUri
                  ? {
                      value: koodiUriHasVersion(contactInfo.postinumeroKoodiUri)
                        ? contactInfo.postinumeroKoodiUri
                        : `${contactInfo.postinumeroKoodiUri}#2`,
                    }
                  : undefined,
                puhelinnumero: contactInfo.puhelinnumero || '',
              },
            ],
            perustiedot: {
              wwwSivuUrl: contactInfo.verkkosivu || '',
            },
          }
        : oppilaitoksenOsa
        ? getFormValuesByOppilaitoksenOsa(oppilaitoksenOsa)
        : {}),
      oppilaitosOid,
    }),
    [formMode, oppilaitoksenOsa, oppilaitosOid, contactInfo]
  );

  const apiUrls = useUrls();

  return isFetching ? (
    <FullSpin />
  ) : (
    <ReduxForm form="oppilaitoksenOsa" initialValues={initialValues}>
      <FormConfigContext.Provider value={config}>
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
          esikatseluControls={
            <EsikatseluControls
              esikatseluUrl={
                oppilaitoksenOsa &&
                apiUrls.url('konfo-ui.oppilaitoksenOsa', organisaatioOid)
              }
            />
          }
        >
          {organisaatio ? (
            <OppilaitoksenOsaForm
              organisaatioOid={organisaatioOid}
              steps={stepsEnabled}
              showArkistoituTilaOption={showArkistoituTilaOption}
            />
          ) : null}
        </FormPage>
      </FormConfigContext.Provider>
    </ReduxForm>
  );
};
