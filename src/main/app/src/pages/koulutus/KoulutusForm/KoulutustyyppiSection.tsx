import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldKoulutustyyppiSelect } from '#/src/components/formFields';
import {
  ENTITY,
  CRUD_ROLES,
  KOULUTUSTYYPPI,
  AMMATILLISET_OPPILAITOSTYYPIT,
  KORKEAKOULU_OPPILAITOSTYYPIT,
  LUKIO_OPPILAITOSTYYPIT,
  KORKEAKOULU_KOULUTUSTYYPIT,
} from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { useOrganisaatioHierarkia } from '#/src/hooks/useOrganisaatioHierarkia';
import iterateTree from '#/src/utils/iterateTree';

const useOppilaitosTyypit = organisaatioOid => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitosTyypit: Array<any> = [];

  iterateTree(hierarkia, org => {
    if (org?.oppilaitostyyppi) {
      oppilaitosTyypit.push(org?.oppilaitostyyppi);
    }
  });

  const isAmmatillinen = !_fp.isEmpty(
    _fp.intersection(AMMATILLISET_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isKorkeakoulutus = !_fp.isEmpty(
    _fp.intersection(KORKEAKOULU_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isLukio = !_fp.isEmpty(
    _fp.intersection(LUKIO_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  return { isAmmatillinen, isKorkeakoulutus, isLukio, isLoading };
};

export const createIsKoulutustyyppiDisabledGetter = ({
  isOphVirkailija,
  isAmmatillinen,
  isKorkeakoulutus,
  isLukio,
}) => value => {
  if (isOphVirkailija) {
    return false;
  }

  // Don't disable anything, if not detecting any oppilaitos tyyppi
  if (!isLukio && !isAmmatillinen && !isKorkeakoulutus) {
    return false;
  }

  // Lukio koulutustyyppi disabled for all except OPH
  if (isLukio && !isAmmatillinen && !isKorkeakoulutus) {
    return true;
  }

  let isDisabled = true;
  // Allow "amm" and "kk" to coexist so that koulutustyyppis for both will
  // be enabled if both types of oppilaitos found.
  if (
    isAmmatillinen &&
    [
      KOULUTUSTYYPPI.TUTKINNON_OSA,
      KOULUTUSTYYPPI.OSAAMISALA,
      KOULUTUSTYYPPI.MUUT_KOULUTUKSET,
    ].includes(value)
  ) {
    isDisabled = false;
  }

  if (isKorkeakoulutus && KORKEAKOULU_KOULUTUSTYYPIT.includes(value)) {
    isDisabled = false;
  }

  return isDisabled;
};

export const KoulutustyyppiSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const {
    isAmmatillinen,
    isKorkeakoulutus,
    isLukio,
    isLoading,
  } = useOppilaitosTyypit(organisaatioOid);

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
      disabled={isLoading || !canCreate}
      getIsDisabled={createIsKoulutustyyppiDisabledGetter({
        isOphVirkailija,
        isLukio,
        isAmmatillinen,
        isKorkeakoulutus,
      })}
    />
  );
};
