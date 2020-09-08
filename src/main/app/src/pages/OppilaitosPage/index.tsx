import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage from '#/src/components/FormPage';
import FullSpin from '#/src/components/FullSpin';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { ENTITY, CRUD_ROLES } from '#/src/constants';
import { useUrls } from '#/src/contexts/contextHooks';
import FormConfigContext from '#/src/contexts/FormConfigContext';
import { useEntityFormConfig } from '#/src/hooks/form';
import useApiAsync from '#/src/hooks/useApiAsync';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import koodiUriHasVersion from '#/src/utils/koodi/koodiUriHasVersion';
import getFormValuesByOppilaitos from '#/src/utils/oppilaitos/getFormValuesByOppilaitos';
import getOppilaitosByOid from '#/src/utils/oppilaitos/getOppilaitosByOid';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';

import OppilaitosForm, {
  initialValues as formInitialValues,
} from './OppilaitosForm';
import OppilaitosPageFooter from './OppilaitosPageFooter';

const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
  location: { state = {} },
}) => {
  const { hierarkia } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: true,
  });

  const organisaatio = hierarkia?.[0];

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

  const apiUrls = useUrls();

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
              <EntityFormHeader
                entityType={ENTITY.OPPILAITOS}
                entity={{ ...(organisaatio ?? {}), ...(oppilaitos ?? {}) }}
              />
            }
            footer={
              <OppilaitosPageFooter
                oppilaitos={oppilaitos}
                organisaatioOid={organisaatioOid}
                readOnly={readOnly}
              />
            }
            draftUrl={
              apiUrls.url('konfo-ui.oppilaitos', organisaatioOid) +
              '?draft=true'
            }
          >
            {organisaatio && (
              <OppilaitosForm
                organisaatioOid={organisaatioOid}
                organisaatio={organisaatio}
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
