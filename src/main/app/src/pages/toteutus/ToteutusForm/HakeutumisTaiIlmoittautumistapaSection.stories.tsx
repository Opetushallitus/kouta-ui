import React from 'react';
import { storiesOf } from '@storybook/react';

import HakeutumisTaiIlmoittautumistapaSection from './HakeutumisTaiIlmoittautumistapaSection';
import {
  makeFormDecorator,
  makeFormSectionDecorator,
} from '#/src/storybookUtils';
import { KOULUTUSTYYPPI, ENTITY } from '#/src/constants';

storiesOf('HakeutumisTaiIlmoittautumisTapaSection', module)
  .addDecorator(
    makeFormDecorator(ENTITY.TOTEUTUS, KOULUTUSTYYPPI.TUTKINNON_OSA)
  )
  .addDecorator(makeFormSectionDecorator('hakeutumisTaiIlmoittautumistapa'))
  .add('Basic', () => <HakeutumisTaiIlmoittautumistapaSection />);
