import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SegmentTabs from './index';
import SegmentTab from '#/src/components/SegmentTab';

storiesOf('SegmentTabs', module).add('Basic', () => (
  <SegmentTabs value="b" onChange={action('change')}>
    <SegmentTab value="a">Tab A</SegmentTab>
    <SegmentTab value="b">Tab B</SegmentTab>
    <SegmentTab value="c">Tab C</SegmentTab>
  </SegmentTabs>
));
