import React, { useMemo } from 'react';

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

export const KoulutustyyppiSection = ({ organisaatioOid, name, disabled }) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const { oppilaitostyypit, isLoading } = useOppilaitosTyypit(organisaatioOid);

  const getIsDisabled = useMemo(
    () =>
      createIsKoulutustyyppiDisabledGetter({
        isOphVirkailija,
        oppilaitostyypit,
        entityType: ENTITY.KOULUTUS,
      }),
    [isOphVirkailija, oppilaitostyypit]
  );

  const canCreate = useCurrentUserHasRole(
    ENTITY.KOULUTUS,
    CRUD_ROLES.CREATE,
    organisaatioOid
  );

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
