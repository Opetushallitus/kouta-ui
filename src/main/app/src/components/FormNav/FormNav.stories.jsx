import React from 'react';
import { storiesOf } from '@storybook/react';

import FormNav, { FormNavGroup } from './index';
import NavIcon from '../NavIcon';

storiesOf('FormNav', module).add('Basic', () => (
  <FormNav>
    <FormNavGroup>
      <NavIcon icon="school">Koulutus</NavIcon>
      <NavIcon icon="settings">Toteutus</NavIcon>
    </FormNavGroup>
    <FormNavGroup>
      <NavIcon icon="access_time">Koulutus</NavIcon>
      <NavIcon icon="grain">Hakukohde</NavIcon>
    </FormNavGroup>
    <FormNavGroup>
      <NavIcon icon="select_all">Valintaperusteet</NavIcon>
    </FormNavGroup>
  </FormNav>
));
