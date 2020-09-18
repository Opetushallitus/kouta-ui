import React from 'react';
import _ from 'lodash';
import { Grid, Cell } from 'styled-css-grid';
import { Typography } from '#/src/components/virkailija';

const EPerusteInfoRow = ({ title, description, suffix }) => {
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
      <EPerusteInfoRow
        key={title}
        title={title}
        description={description}
        suffix={suffix}
      />
    ))}
  </Grid>
);
