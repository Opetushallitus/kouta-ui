import React from 'react';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { Link } from 'react-router-dom';
import _ from 'lodash/fp';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import { getOrganisaatioTyypit } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { getThemeProp } from '#/src/theme';
import { Typography, Box } from '#/src/components/virkailija';
import EditButton from '#/src/components/EditButton';
import { useTranslation } from 'react-i18next';
import { otherwise } from '#/src/utils';

const StyledBlueBox = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 18px 20px;
  margin-bottom: 35px;
  flex: 0 0 auto;
`;

export const SelectedOrganisaatioBox = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const { organisaatio } = useOrganisaatio(organisaatioOid);
  const nimi = getFirstLanguageValue(organisaatio?.nimi);

  const tyypit = getOrganisaatioTyypit(organisaatio);

  const orgEntityType = _.cond([
    [_.includes(ORGANISAATIOTYYPPI.OPPILAITOS), () => 'oppilaitos'],
    [_.includes(ORGANISAATIOTYYPPI.TOIMIPISTE), () => 'oppilaitoksen-osa'],
    [otherwise, () => undefined],
  ])(tyypit);

  return (
    <StyledBlueBox>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box mr="10px">
          <Typography variant="secondary" as="div">
            {t('yleiset.valittuOrganisaatio')}:
          </Typography>
          <Typography as="div">{nimi}</Typography>
        </Box>
        {orgEntityType && (
          <Box>
            <EditButton
              as={Link}
              to={`/organisaatio/${organisaatioOid}/${orgEntityType}`}
            />
          </Box>
        )}
      </Box>
    </StyledBlueBox>
  );
};
