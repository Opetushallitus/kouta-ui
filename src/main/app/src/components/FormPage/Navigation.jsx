import React from 'react';
import { Link, Route } from 'react-router-dom';

import FormNav, { FormNavGroup } from '../FormNav';
import NavIcon from '../NavIcon';

const NavIconLink = ({ to, ...props }) => (
  <Route
    path={to}
    children={({ match }) => (
      <NavIcon as={Link} to={to} active={!!match} {...props} />
    )}
  />
);

const Navigation = ({ ...props }) => (
  <FormNav {...props}>
    <FormNavGroup>
      <NavIconLink icon="school" to="/koulutus">
        Koulutus
      </NavIconLink>
      <NavIconLink icon="settings" as={Link} to="/toteutus">
        Toteutus
      </NavIconLink>
    </FormNavGroup>
    <FormNavGroup>
      <NavIconLink icon="access_time" as={Link} to="/haku">
        Haku
      </NavIconLink>
      <NavIconLink icon="grain" as={Link} to="/hakukohde">
        Hakukohde
      </NavIconLink>
    </FormNavGroup>
    <FormNavGroup>
      <NavIconLink icon="select_all" as={Link} to="/valintaperusteet">
        Valintaperusteet
      </NavIconLink>
    </FormNavGroup>
  </FormNav>
);

export default Navigation;
