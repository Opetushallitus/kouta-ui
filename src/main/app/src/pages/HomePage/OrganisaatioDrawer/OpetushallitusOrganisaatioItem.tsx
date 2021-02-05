import React from 'react';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import useLanguage from '#/src/hooks/useLanguage';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';

import OrganisaatioItem from './OrganisaatioItem';

const OpetetushallitusOrganisaatioItem = props => {
  const language = useLanguage();
  const { organisaatio } = useOrganisaatio(OPETUSHALLITUS_ORGANISAATIO_OID);

  return (
    <OrganisaatioItem
      oid={OPETUSHALLITUS_ORGANISAATIO_OID}
      nimi={organisaatio?.nimi}
      language={language}
      {...props}
    />
  );
};

export default OpetetushallitusOrganisaatioItem;
