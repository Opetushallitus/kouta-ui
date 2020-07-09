import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '#/src/components/Button';
import Editor from './index';
import { parseEditorState, serializeEditorState } from './utils';

const convertToHTMLAction = action('convertToHTML');

const initialValue = parseEditorState(
  'Klikkaa tätä linkkiä: <a href="https://www.oph.fi/">Opetushallitus</a>'
);

const StoryEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Button onClick={() => convertToHTMLAction(serializeEditorState(value))}>
        To HTML
      </Button>
      <Editor value={value} onChange={setValue} />
    </>
  );
};

storiesOf('Editor', module).add('Basic', () => <StoryEditor />);
