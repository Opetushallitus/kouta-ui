import React from 'react';
import { storiesOf } from '@storybook/react';

import SoraKuvausSection from './SoraKuvausSection';
import {
  makeFormDecorator,
  makeFormSectionDecorator,
} from '#/src/storybookUtils';
import { KOULUTUSTYYPPI, ENTITY } from '#/src/constants';

storiesOf('SoraKuvausSection', module)
  .addDecorator(
    makeFormDecorator(ENTITY.TOTEUTUS, KOULUTUSTYYPPI.TUTKINNON_OSA)
  )
  .addDecorator(makeFormSectionDecorator('soraKuvaus'))
  .add('Basic', () => <SoraKuvausSection name="soraKuvaus" />);
