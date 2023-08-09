import React, { useState } from 'react';

import PostinumeroSelect from './index';

function generateStory(koodi) {
  return () => {
    const [value, setValue] = useState({ value: koodi });

    return <PostinumeroSelect onChange={setValue} value={value} />;
  };
}

const Story = generateStory('posti_00940#2');

const StoryWithInvalidKoodistoVersion = generateStory('posti_00940#fi');

export default {
  title: 'PostinumeroSelect',
};

export const Basic = () => <Story />;

export const WithInvalidKoodistoVersion = () => (
  <StoryWithInvalidKoodistoVersion />
);

WithInvalidKoodistoVersion.storyName = 'With invalid koodisto version';
