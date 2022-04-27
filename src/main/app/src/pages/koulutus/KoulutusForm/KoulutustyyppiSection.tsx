import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldKoulutustyyppiSelect } from '#/src/components/formFields';
import { CRUD_ROLES, ENTITY } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import {
  createIsKoulutustyyppiDisabledGetter,
  useOppilaitosTyypit,
} from '#/src/hooks/useOppilaitosTyypit';
import { useOppilaitostyypitByKoulutustyypit } from '#/src/utils/koulutus/getOppilaitostyypitByKoulutustyypit';

export const KoulutustyyppiSection = ({ organisaatioOid, name, disabled }) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const {
    oppilaitostyypit: allowedOppilaitostyypit,
    isLoading: loadingTyypit,
  } = useOppilaitosTyypit(organisaatioOid);

  const { oppilaitostyypitByKoulutustyypit, isLoading: loadingMappings } =
    useOppilaitostyypitByKoulutustyypit();

  const getIsDisabled = createIsKoulutustyyppiDisabledGetter({
    isOphVirkailija,
    oppilaitostyypitByKoulutustyypit,
    allowedOppilaitostyypit,
    entityType: ENTITY.KOULUTUS,
  });

  const canCreate = useCurrentUserHasRole(
    ENTITY.KOULUTUS,
    CRUD_ROLES.CREATE,
    organisaatioOid
  );

  const isLoading = loadingTyypit || loadingMappings;
  return (
    <Field
      name={name}
      component={FormFieldKoulutustyyppiSelect}
      label={t('yleiset.valitseKoulutustyyppi')}
      disabled={isLoading || !canCreate || disabled}
      getIsDisabled={getIsDisabled}
    />
  );
};
