import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Editor, { serialize, parse } from './index';
import Button from '../Button';

const convertToHTMLAction = action('convertToHTML');

const initialValue = parse(
  'Klikkaa tätä linkkiä: <a href="https://www.oph.fi/">Opetushallitus</a>',
);

const StoryEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Button onClick={() => convertToHTMLAction(serialize(value))}>
        To HTML
      </Button>
      <Editor value={value} onChange={setValue} />
    </>
  );
};

storiesOf('Editor', module).add('Basic', () => <StoryEditor />);
