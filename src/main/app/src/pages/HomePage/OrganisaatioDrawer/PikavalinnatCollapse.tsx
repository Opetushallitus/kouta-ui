import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { SimpleCollapse } from '#/src/components/SimpleCollapse';
import { Typography, Box } from '#/src/components/virkailija';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';

import OpetushallitusOrganisaatioItem from './OpetushallitusOrganisaatioItem';
import OrganisaatioFavouritesList from './OrganisaatioFavouritesList';

export const PikavalinnatCollapse = ({
  hasOphOption,
  hasFavourites,
  organisaatioFavourites,
  favouriteItems,
  selectedOrganisaatio,
  onToggleFavourite,
  setSelectedOrganisaatio,
}) => {
  const { t } = useTranslation();
  const ophIsFavourite = useMemo(
    () => organisaatioFavourites.includes(OPETUSHALLITUS_ORGANISAATIO_OID),
    [organisaatioFavourites]
  );
  const pikavalinnatCount = _.size(favouriteItems) + (hasOphOption ? 1 : 0);

  return (
    <SimpleCollapse
      header={t('etusivu.pikavalinnat', { count: pikavalinnatCount })}
    >
      <Box flexGrow={0} width="100%" mb="30px">
        <Box>
          {hasOphOption && (
            <Box mb={1}>
              <Typography variant="secondary" as="div" mb={1}>
                {t('etusivu.rekisterinpitaja')}
              </Typography>
              <OpetushallitusOrganisaatioItem
                favourite={ophIsFavourite}
                selected={
                  selectedOrganisaatio === OPETUSHALLITUS_ORGANISAATIO_OID
                }
                onToggleFavourite={onToggleFavourite}
                onSelect={setSelectedOrganisaatio}
              />
            </Box>
          )}
          {hasFavourites && (
            <Box mb={1}>
              <OrganisaatioFavouritesList
                items={favouriteItems}
                selected={selectedOrganisaatio}
                onSelect={setSelectedOrganisaatio}
                onToggleFavourite={onToggleFavourite}
              />
            </Box>
          )}
        </Box>
      </Box>
    </SimpleCollapse>
  );
};
