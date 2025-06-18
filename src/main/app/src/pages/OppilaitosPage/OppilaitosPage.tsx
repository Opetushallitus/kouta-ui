import React, { useMemo, useState } from 'react';

import { StatusCodes } from 'http-status-codes';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EntityFormHeader from '#/src/components/EntityFormHeader';
import FormPage from '#/src/components/FormPage';
import FullSpin from '#/src/components/FullSpin';
import OppilaitosFormSteps from '#/src/components/OppilaitosFormSteps';
import { ENTITY, CRUD_ROLES, FormMode } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { getFormValuesByOppilaitos } from '#/src/utils/oppilaitos/getFormValuesByOppilaitos';
import { useOppilaitosByOid } from '#/src/utils/oppilaitos/getOppilaitosByOid';

import { OppilaitosFooter } from './OppilaitosFooter';
import OppilaitosForm, {
  initialValues as formInitialValues,
} from './OppilaitosForm';

export const OppilaitosPage = () => {
  const { organisaatioOid } = useParams() as { organisaatioOid: string };

  const [formMode, setFormMode] = useState<FormMode>(FormMode.EDIT);

  const { data: oppilaitos, isFetching } = useOppilaitosByOid(organisaatioOid, {
    retry: 0,
    onError: e => {
      if (e.response.status === StatusCodes.NOT_FOUND) {
        setFormMode(FormMode.CREATE);
      }
    },
    onSuccess: oppilaitos => {
      oppilaitos?.lastModified
        ? setFormMode(FormMode.EDIT)
        : setFormMode(FormMode.CREATE);
    },
  });

  const { t } = useTranslation();

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

  const organisaatio = oppilaitos?._enrichedData?.organisaatio;

  const initialValues = useMemo(
    () => ({
      ...(formMode === FormMode.CREATE
        ? {
            ...formInitialValues,
            perustiedot: {
              wwwSivuUrl: organisaatio?.yhteystiedot?.www || '',
            },
          }
        : oppilaitos
          ? getFormValuesByOppilaitos(oppilaitos)
          : {}),
    }),
    [formMode, organisaatio, oppilaitos]
  );

  const stepsEnabled = !oppilaitos?.lastModified;
  const readOnly = formMode === FormMode.EDIT ? !canUpdate : !canCreate;

  return isFetching ? (
    <FullSpin />
  ) : (
    <FormPage
      title={t('sivuTitlet.oppilaitos')}
      entityType={ENTITY.OPPILAITOS}
      initialValues={initialValues}
      formMode={formMode}
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
  );
};
