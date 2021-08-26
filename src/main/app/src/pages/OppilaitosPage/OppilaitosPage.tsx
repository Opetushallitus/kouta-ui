import React, { useMemo, useState } from 'react';

import { StatusCodes } from 'http-status-codes';
import { useTranslation } from 'react-i18next';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage from '#/src/components/FormPage';
import FullSpin from '#/src/components/FullSpin';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import ReduxForm from '#/src/components/ReduxForm';
import Title from '#/src/components/Title';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import koodiUriHasVersion from '#/src/utils/koodi/koodiUriHasVersion';
import { getFormValuesByOppilaitos } from '#/src/utils/oppilaitos/getFormValuesByOppilaitos';
import { useOppilaitosByOid } from '#/src/utils/oppilaitos/getOppilaitosByOid';
import getOrganisaatioContactInfo from '#/src/utils/organisaatio/getOrganisaatioContactInfo';

import { OppilaitosFooter } from './OppilaitosFooter';
import OppilaitosForm, {
  initialValues as formInitialValues,
} from './OppilaitosForm';

export const OppilaitosPage = ({
  match: {
    params: { organisaatioOid },
  },
}) => {
  const { hierarkia } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: true,
  });

  const [formMode, setFormMode] = useState<FormMode>(FormMode.EDIT);

  const organisaatio = hierarkia?.[0];

  const { data: oppilaitos, isFetching } = useOppilaitosByOid(organisaatioOid, {
    retry: 0,
    onError: e => {
      if (e.response.status === StatusCodes.NOT_FOUND) {
        setFormMode(FormMode.CREATE);
      }
    },
    onSuccess: () => {
      setFormMode(FormMode.EDIT);
    },
  });

  const { t } = useTranslation();

  const contactInfo = useMemo(
    () => getOrganisaatioContactInfo(organisaatio),
    [organisaatio]
  );

  const canUpdate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.UPDATE,
    organisaatioOid
  );

  const canCreate = useCurrentUserHasRole(
    ENTITY.OPPILAITOS,
    CRUD_ROLES.CREATE,
    organisaatioOid
  );

  const readOnly = formMode === FormMode.EDIT ? !canUpdate : !canCreate;

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
        : oppilaitos
        ? getFormValuesByOppilaitos(oppilaitos)
        : {}),
    }),
    [formMode, oppilaitos, contactInfo]
  );

  const stepsEnabled = !oppilaitos;

  return isFetching ? (
    <FullSpin />
  ) : (
    <ReduxForm
      form={ENTITY.OPPILAITOS}
      initialValues={initialValues}
      disabled={readOnly}
    >
      <Title>{t('sivuTitlet.oppilaitos')}</Title>
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
          <OppilaitosFooter
            oppilaitos={oppilaitos}
            organisaatioOid={organisaatioOid}
            readOnly={readOnly}
          />
        }
      >
        {organisaatio && (
          <OppilaitosForm
            organisaatioOid={organisaatioOid}
            organisaatio={organisaatio}
            steps={stepsEnabled}
            oppilaitos={oppilaitos}
          />
        )}
      </FormPage>
    </ReduxForm>
  );
};
