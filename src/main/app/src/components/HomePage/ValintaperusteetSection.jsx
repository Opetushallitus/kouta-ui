import React from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';
import Button from '../Button';

const Actions = ({ organisaatioOid }) => (
  <Button as={Link} to={`/organisaatio/${organisaatioOid}/valintaperusteet`}>
    Luo uusi valintaperuste
  </Button>
);

const ValintaperusteetSection = ({ organisaatioOid }) => {
  return (
    <ListCollapse
      icon="select_all"
      header="Valintaperusteet"
      actions={<Actions organisaatioOid={organisaatioOid} />}
      defaultOpen
    >
    </ListCollapse>
  );
};

export default ValintaperusteetSection;
