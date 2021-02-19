import React from 'react';

import _ from 'lodash';
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
  const { hierarkia } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: false,
  });

  const oppilaitosTyypit = [];

  iterateTree(hierarkia, org => {
    if (org?.oppilaitostyyppi) {
      oppilaitosTyypit.push(org?.oppilaitostyyppi);
    }
  });

  const isAmmatillinen = !_.isEmpty(
    _.intersection(AMMATILLISET_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isKorkeakoulutus = !_.isEmpty(
    _.intersection(KORKEAKOULU_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  const isLukio = !_.isEmpty(
    _.intersection(LUKIO_OPPILAITOSTYYPIT, oppilaitosTyypit)
  );

  return { isAmmatillinen, isKorkeakoulutus, isLukio };
};

const KoulutustyyppiSection = ({ organisaatioOid, johtaaTutkintoon, name }) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const { isAmmatillinen, isKorkeakoulutus, isLukio } = useOppilaitosTyypit(
    organisaatioOid
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
      disabled={!canCreate}
      getIsDisabled={value => {
        if (isOphVirkailija) {
          return false;
        } else if (
          isAmmatillinen &&
          !isKorkeakoulutus &&
          ![
            KOULUTUSTYYPPI.TUTKINNON_OSA,
            KOULUTUSTYYPPI.OSAAMISALA,
            KOULUTUSTYYPPI.MUUT_KOULUTUKSET,
          ].includes(value)
        ) {
          return true;
        } else if (
          isKorkeakoulutus &&
          !KORKEAKOULU_KOULUTUSTYYPIT.includes(value)
        ) {
          return true;
        } else if (isLukio && value !== KOULUTUSTYYPPI.LUKIOKOULUTUS) {
          return true;
        } else {
          return false;
        }
      }}
    />
  );
};

export default KoulutustyyppiSection;
