import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Editor, {
  convertToHTML,
  convertFromHTML,
  createEditorStateWithContent,
} from './index';
import Button from '../Button';

const convertToHTMLAction = action('convertToHTML');

const initialValue = createEditorStateWithContent(
  convertFromHTML(
    'Klikkaa tätä linkkiä: <a href="https://www.oph.fi/">Opetushallitus</a>',
  ),
);

console.log(initialValue);

const StoryEditor = () => {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Button
        onClick={() =>
          convertToHTMLAction(convertToHTML(value.getCurrentContent()))
        }
      >
        To HTML
      </Button>
      <Editor value={value} onChange={setValue} />
    </>
  );
};

storiesOf('Editor', module).add('Basic', () => <StoryEditor />);
