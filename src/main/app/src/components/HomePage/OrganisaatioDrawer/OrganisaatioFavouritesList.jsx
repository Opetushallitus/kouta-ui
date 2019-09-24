import React from 'react';

import Typography from '../../Typography';
import Spacing from '../../Spacing';
import OrganisaatioItem from './OrganisaatioItem';
import useTranslation from '../../useTranslation';
import organisaatioIsOppilaitos from '../../../utils/organisaatioIsOppilaitos';

export const OrganisaatioFavouritesList = ({
  items,
  onToggleFavourite,
  onSelect,
  selected,
  language = 'fi',
}) => {
  const { t } = useTranslation();

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
            />
          </Spacing>
        );
      })}
    </>
  );
};

export default OrganisaatioFavouritesList;
