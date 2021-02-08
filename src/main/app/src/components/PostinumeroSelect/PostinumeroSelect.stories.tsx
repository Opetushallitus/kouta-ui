import React, { useState } from 'react';

import { storiesOf } from '@storybook/react';

import {
  makeApiDecorator,
  makeLocalizationDecorator,
} from '#/src/storybookUtils';

import PostinumeroSelect from './index';

function generateStory(koodi) {
  return () => {
    const [value, setValue] = useState({ value: koodi });

    return <PostinumeroSelect onChange={setValue} value={value} />;
  };
}

const Story = generateStory('posti_00940#2');

const StoryWithInvalidKoodistoVersion = generateStory('posti_00940#fi');

storiesOf('PostinumeroSelect', module)
  .addDecorator(makeLocalizationDecorator())
  .addDecorator(makeApiDecorator())
  .add('Basic', () => <Story />)
  .add('With invalid koodisto version', () => (
    <StoryWithInvalidKoodistoVersion />
  ));
