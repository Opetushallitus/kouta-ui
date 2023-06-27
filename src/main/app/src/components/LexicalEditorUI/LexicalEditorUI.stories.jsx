import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import FormButton from '#/src/components/FormButton';

import { LexicalEditorUI } from './index';
import { serializeEditorState, parseEditorState } from './utils';

const convertToHTMLAction = action('convertToHTML');

const initialValue = parseEditorState(
  'Klikkaa tätä linkkiä: <a href="https://www.oph.fi/">Opetushallitus</a>'
);

const StoryLexicalEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <FormButton
        onClick={() => convertToHTMLAction(serializeEditorState(value))}
      >
        To HTML
      </FormButton>
      <LexicalEditorUI value={value} onChange={setValue} />
    </>
  );
};

storiesOf('LexicalEditorUI', module).add('Basic', () => <StoryLexicalEditor />);
