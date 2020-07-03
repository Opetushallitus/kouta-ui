import React from 'react';

import Typography from '../../Typography';
import Spacing from '../../Spacing';
import OrganisaatioItem from './OrganisaatioItem';
import { useTranslation } from 'react-i18next';
import organisaatioIsOppilaitos from '../../../utils/organisaatioIsOppilaitos';
import useAuthorizedUserRoleBuilder from '../../useAuthorizedUserRoleBuilder';
import { OPPILAITOS_ROLE } from '../../../constants';

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
