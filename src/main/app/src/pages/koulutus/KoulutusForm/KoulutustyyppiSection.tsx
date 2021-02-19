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
import { otherwise } from '#/src/utils';
import iterateTree from '#/src/utils/iterateTree';

const useOppilaitosTyypit = organisaatioOid => {
  const { hierarkia, isLoading } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitosTyypit = [];

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

const KoulutustyyppiSection = ({ organisaatioOid, name }) => {
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
      getIsDisabled={_fp.cond([
        [() => isOphVirkailija, _fp.F],
        [
          (value: any) =>
            isAmmatillinen &&
            !isKorkeakoulutus &&
            ![
              KOULUTUSTYYPPI.TUTKINNON_OSA,
              KOULUTUSTYYPPI.OSAAMISALA,
              KOULUTUSTYYPPI.MUUT_KOULUTUKSET,
            ].includes(value),
          _fp.T,
        ],
        [
          value =>
            isKorkeakoulutus && !KORKEAKOULU_KOULUTUSTYYPIT.includes(value),
          _fp.T,
        ],
        [value => isLukio && value !== KOULUTUSTYYPPI.LUKIOKOULUTUS, _fp.T],
        [otherwise, _fp.F],
      ])}
    />
  );
};

export default KoulutustyyppiSection;
