import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import Button from '#/src/components/Button';

import { LexicalEditorUI } from './index';
import { serializeEditorState, parseEditorState } from './utils';

const convertToHTMLAction = action('convertToHTML');

const initialValue = parseEditorState(
  '<h1>Hei!</h1> <p> </p> <p>Klikkaa seuraavaa <b>linkkiä</b>: <a href="https://www.oph.fi/">Opetushallitus</a></p>'
);

const StoryLexicalEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Button onClick={() => convertToHTMLAction(serializeEditorState(value))}>
        To HTML
      </Button>
      <LexicalEditorUI value={value} onChange={setValue} />
    </>
  );
};

storiesOf('LexicalEditorUI', module).add('Basic', () => <StoryLexicalEditor />);
