import React from 'react';

import { action } from '@storybook/addon-actions';

import SegmentTab from '#/src/components/SegmentTab';

import SegmentTabs from './index';

export default {
  title: 'SegmentTabs',
};

export const Basic = () => (
  <SegmentTabs value="b" onChange={action('change')}>
    <SegmentTab value="a">Tab A</SegmentTab>
    <SegmentTab value="b">Tab B</SegmentTab>
    <SegmentTab value="c">Tab C</SegmentTab>
  </SegmentTabs>
);
