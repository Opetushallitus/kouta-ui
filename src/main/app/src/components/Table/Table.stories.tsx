import React from 'react';

import Table, { TableHead, TableRow, TableCell, TableBody } from './index';

export default {
  title: 'Table',
};

export const Basic = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sortDirection="desc">Otsikko 1</TableCell>
        <TableCell>Otsikko 2</TableCell>
        <TableCell>Otsikko 3</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Solu 1</TableCell>
        <TableCell>Solu 2</TableCell>
        <TableCell>Solu 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Solu 1</TableCell>
        <TableCell>Solu 2</TableCell>
        <TableCell>Solu 3</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Solu 1</TableCell>
        <TableCell>Solu 2</TableCell>
        <TableCell>Solu 3</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
