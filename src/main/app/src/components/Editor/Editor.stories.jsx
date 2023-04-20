import React, { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { FormButton } from '#/src/components/FormButton';

import { Editor } from './index';
import { parseEditorState, serializeEditorState } from './utils';

const convertToHTMLAction = action('convertToHTML');

const initialValue = parseEditorState(
  'Klikkaa tätä linkkiä: <a href="https://www.oph.fi/">Opetushallitus</a>'
);

const StoryEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <FormButton
        onClick={() => convertToHTMLAction(serializeEditorState(value))}
      >
        To HTML
      </FormButton>
      <Editor value={value} onChange={setValue} />
    </>
  );
};

storiesOf('Editor', module).add('Basic', () => <StoryEditor />);
