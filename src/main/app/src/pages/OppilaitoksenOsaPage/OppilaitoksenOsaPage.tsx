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
import { getFormValuesByOppilaitoksenOsa } from '#/src/utils/oppilaitoksenOsa/getFormValuesByOppilaitoksenOsa';
import { useOppilaitoksenOsaByOid } from '#/src/utils/oppilaitoksenOsa/getOppilaitoksenOsaByOid';

import { OppilaitoksenOsaFooter } from './OppilaitoksenOsaFooter';
import OppilaitoksenOsaForm, {
  initialValues as formInitialValues,
} from './OppilaitoksenOsaForm';

export const OppilaitoksenOsaPage = () => {
  const { organisaatioOid } = useParams() as { organisaatioOid: string };

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
      onSuccess: oppilaitoksenOsa => {
        oppilaitoksenOsa?.lastModified
          ? setFormMode(FormMode.EDIT)
          : setFormMode(FormMode.CREATE);
      },
    }
  );

  const organisaatio = oppilaitoksenOsa?._enrichedData?.organisaatio;

  const { t } = useTranslation();

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

  const stepsEnabled = !oppilaitoksenOsa?.lastModified;
  const readOnly = oppilaitoksenOsa?.lastModified ? !canUpdate : !canCreate;

  const initialValues = useMemo(
    () => ({
      ...(formMode === FormMode.CREATE
        ? {
            ...formInitialValues,
            perustiedot: {
              wwwSivuUrl: organisaatio?.yhteystiedot?.www || '',
              jarjestaaUrheilijanAmmKoulutusta: false,
            },
          }
        : oppilaitoksenOsa
          ? getFormValuesByOppilaitoksenOsa(oppilaitoksenOsa)
          : {}),
    }),
    [formMode, oppilaitoksenOsa, organisaatio]
  );

  return isFetching ? (
    <FullSpin />
  ) : (
    <FormPage
      title={t('sivuTitlet.oppilaitoksenOsa')}
      entityType={ENTITY.OPPILAITOKSEN_OSA}
      formMode={formMode}
      initialValues={initialValues}
      readOnly={readOnly}
      steps={<OppilaitosFormSteps activeStep={ENTITY.OPPILAITOKSEN_OSA} />}
      header={
        <EntityFormHeader
          entityType={ENTITY.OPPILAITOKSEN_OSA}
          entity={{ ...(organisaatio ?? {}), ...(oppilaitoksenOsa ?? {}) }}
        />
      }
      footer={
        <OppilaitoksenOsaFooter
          oppilaitoksenOsa={oppilaitoksenOsa}
          organisaatioOid={organisaatioOid}
          readOnly={readOnly}
        />
      }
    >
      <OppilaitoksenOsaForm
        organisaatioOid={organisaatioOid}
        oppilaitoksenOsa={oppilaitoksenOsa}
        steps={stepsEnabled}
      />
    </FormPage>
  );
};
