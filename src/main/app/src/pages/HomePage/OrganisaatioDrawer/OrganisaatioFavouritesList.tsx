import React from 'react';

import { Typography } from '#/src/components/virkailija';
import Spacing from '#/src/components/Spacing';
import OrganisaatioItem from './OrganisaatioItem';
import { useTranslation } from 'react-i18next';
import organisaatioIsOppilaitos from '#/src/utils/organisaatio/organisaatioIsOppilaitos';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { OPPILAITOS_ROLE } from '#/src/constants';

export const OrganisaatioFavouritesList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
  language = 'fi',
}) => {
  const { t } = useTranslation();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  return (
    <>
      <Typography variant="secondary" as="div" marginBottom={1}>
        {t('etusivu.suosikit')}
      </Typography>
      {items.map((org, index) => {
        const { nimi, oid } = org;

        return (
          <Spacing marginBottom={index < items.length - 1 ? 1 : 0} key={oid}>
            <OrganisaatioItem
              oid={oid}
              favourite={true}
              selected={oid === selected}
              onToggleFavourite={onToggleFavourite}
              onSelect={onSelect}
              nimi={nimi}
              language={language}
              isOppilaitos={organisaatioIsOppilaitos(org)}
              showEditOppilaitos={roleBuilder
                .hasCreate(OPPILAITOS_ROLE, org)
                .result()}
            />
          </Spacing>
        );
      })}
    </>
  );
};

export default OrganisaatioFavouritesList;
