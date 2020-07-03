import { convertFromHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import { isString } from 'lodash';
import linkDecorator from './linkDecorator';
import createEmptyEditorState from './createEmptyEditorState';

const createEditorStateWithContent = contentState =>
  EditorState.createWithContent(contentState, linkDecorator);

const parseEditorstate = value => {
  if (!isString(value)) {
    return createEmptyEditorState();
  }

  return createEditorStateWithContent(convertFromHTML(value));
};

export default parseEditorstate;
