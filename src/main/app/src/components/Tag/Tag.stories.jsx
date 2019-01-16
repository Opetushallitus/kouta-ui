import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { TagSelect } from './index';

const list = [
    {label: 'sosiaalityöntekijä', key: 'sosiaalityöntekijä'},
    {label: 'lastenhoitaja', key:'lastenhoitaja'},
    {label: 'laitoshoitaja', key: 'laitoshoitaja'},
    {label: 'ambulanssihoitaja', key: 'ambulanssihoitaja'}
];

storiesOf('Tag', module)
.add('Basic', () => (
    <TagSelect
    options={list}
    maxTags={5}/>
  ));
