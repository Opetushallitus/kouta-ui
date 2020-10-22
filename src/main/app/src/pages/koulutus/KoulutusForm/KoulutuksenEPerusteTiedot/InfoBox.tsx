import React from 'react';
import _ from 'lodash';
import { Grid, Cell } from 'styled-css-grid';
import styled from 'styled-components';
import { transparentize } from 'polished';
import { Box } from '#/src/components/virkailija';
import { Typography } from '#/src/components/virkailija';
import { getThemeProp } from '#/src/theme';

export const StyledInfoBox = styled(Box)`
  background-color: ${getThemeProp('colors.blueLighten4', transparentize(0.7))};
  padding: 30px;
  line-height: 23px;
  width: 100%;
`;

const InfoBoxRow = ({ title, description, suffix }) => {
  return (
    <>
      <Cell key="title-cell">
        <Typography color="text.dark">{title}:</Typography>
      </Cell>
      <Cell key="description-cell">
        <Typography>
          {_.isNil(description) || description?.length === 0
            ? '-'
            : description}
          {description && suffix ? ` ${suffix}` : ''}
        </Typography>
      </Cell>
    </>
  );
};

export const InfoBoxGrid = ({ rows, ...props }) => (
  <Grid
    columns={'auto minmax(0, 1fr)'}
    columnGap="20px"
    rowGap="25px"
    {...props}
  >
    {rows.map(({ title, description, suffix }) => (
      <InfoBoxRow
        key={title}
        title={title}
        description={description}
        suffix={suffix}
      />
    ))}
  </Grid>
);
