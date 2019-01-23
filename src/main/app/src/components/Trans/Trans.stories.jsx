import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  makeLocalisationDecorator,
  makeApiDecorator,
} from '../../storybookUtils';
import Trans from './index';

storiesOf('Trans', module)
  .addDecorator(makeLocalisationDecorator({ category: 'tarjonta' }))
  .addDecorator(makeApiDecorator())
  .add('Basic', () => (
    <div>
      Translation: <Trans i18nKey="cancel">Default translation</Trans>
    </div>
  ));
