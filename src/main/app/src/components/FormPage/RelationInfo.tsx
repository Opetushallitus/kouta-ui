import React from 'react';

import { useTranslation } from 'react-i18next';

import { RouterAnchor } from '#/src/components/Anchor';
import { Box, Typography } from '#/src/components/virkailija';
import { getEntityNimiTranslation } from '#/src/utils';

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
  const { i18n } = useTranslation();
  const name = getEntityNimiTranslation(entity, i18n.language) || '';
  return (
    <Box
      flexGrow={0}
      style={{
        whiteSpace: 'pre-wrap',
      }}
    >
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
