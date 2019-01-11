import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import NavIcon from './index';

storiesOf('NavIcon', module)
  .add('Basic', () => <NavIcon icon="school">Koulutus</NavIcon>)
  .add('With state', () => (
    <>
      <NavIcon icon="school" done>
        Koulutus
      </NavIcon>
      <NavIcon icon="settings" active>
        Toteutus
      </NavIcon>
    </>
  ));
