import React from 'react';
import formatDate from 'date-fns/format';

import ListCollapse from './ListCollapse';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../Table';
import Pagination from '../Pagination';
import Flex, { FlexItem } from '../Flex';
import TilaLabel from './TilaLabel';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Spacing from '../Spacing';

const data = [
  {
    nimi: 'Sosiaali- ja terveysalan perustutkinto, päiväopetus',
    tila: 'julkaistu',
    muokattu: new Date(),
    muokkaaja: 'Kalle Ilves',
    toteutukset: [],
  },
];

const Filters = () => (
  <Flex alignCenter>
    <FlexItem grow={1} paddingRight={2}>
      <Input placeholder="Hae toteutuksia" />
    </FlexItem>
    <FlexItem grow={0}>
      <Checkbox checked={true}>Näytä myös arkistoidut</Checkbox>
    </FlexItem>
  </Flex>
);

const ToteutuksetSection = ({ organisaatioOid }) => (
  <ListCollapse icon="settings" header="Koulutuksen toteutukset" defaultOpen>
    <Spacing marginBottom={2}>
      <Filters />
    </Spacing>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sortDirection="desc">Nimi</TableCell>
          <TableCell sortDirection="desc">Tila</TableCell>
          <TableCell sortDirection="desc">Muokattu viimeksi</TableCell>
          <TableCell sortDirection="desc">Muokkaajan nimi</TableCell>
          <TableCell>Kiinnitetyt haut</TableCell>
          <TableCell>Toimenpiteet</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ nimi, tila, muokattu, muokkaaja }, index) => (
          <TableRow key={index}>
            <TableCell>{nimi}</TableCell>
            <TableCell>
              <TilaLabel color="success">Julkaistu</TilaLabel>
            </TableCell>
            <TableCell>
              {muokattu ? formatDate(muokattu, 'DD.MM.YYYY HH:mm') : null}
            </TableCell>
            <TableCell>{muokkaaja ? muokkaaja : null}</TableCell>
            <TableCell> </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Flex marginTop={2}>
      <Pagination value={0} pageCount={10} />
    </Flex>
  </ListCollapse>
);

export default ToteutuksetSection;
