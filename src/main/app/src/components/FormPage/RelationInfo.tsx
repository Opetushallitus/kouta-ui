import React from 'react';

import _ from 'lodash';

import { RouterAnchor } from '#/src/components/Anchor';
import { Box, Typography } from '#/src/components/virkailija';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

const getEntityName = entity => {
  return entity && _.isObject(entity.nimi)
    ? getFirstLanguageValue(entity.nimi)
    : null;
};

export const RelationInfoContainer = ({ children }) => {
  return (
    <Box
      display="flex"
      marginBottom={2}
      justifyContent={
        React.Children.count(children) === 1 ? 'flex-end' : 'space-between'
      }
    >
      {children}
    </Box>
  );
};

export function RelationInfo({ title = '', entity, linkUrl = undefined }) {
  const name = getEntityName(entity) || '';
  return (
    <Box flexGrow={0}>
      {entity && (
        <>
          <Typography variant="h6" marginBottom={1}>
            {title}
          </Typography>
          <Typography>
            <RouterAnchor to={linkUrl}>{name}</RouterAnchor>
          </Typography>
        </>
      )}
    </Box>
  );
}
