import React from 'react';
import { get } from 'lodash';

import useOrganisaatio from '../../useOrganisaatio';
import OrganisaatioItem from './OrganisaatioItem';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '../../../constants';
import useLanguage from '../../useLanguage';

const OpetetushallitusOrganisaatioItem = props => {
  const language = useLanguage();
  const { organisaatio } = useOrganisaatio(OPETUSHALLITUS_ORGANISAATIO_OID);

  return (
    <OrganisaatioItem
      oid={OPETUSHALLITUS_ORGANISAATIO_OID}
      nimi={get(organisaatio, 'nimi')}
      language={language}
      {...props}
    />
  );
};

export default OpetetushallitusOrganisaatioItem;
