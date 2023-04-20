/* The editor handles HTML <-> state conversions internally, this is mainly for making sure
 * the HTML strings are nicely encapsulated so they can be recognized in the data. */

import { LexicalEditorHtml } from './LexicalEditorUI';

export const parseEditorState = (value: string): LexicalEditorHtml => {
  return { htmlStr: value };
};

export const serializeEditorState = (state: LexicalEditorHtml): string => {
  return state.htmlStr;
};

export const isEditorState = (value: any): boolean => {
  // eslint-disable-next-line lodash/prefer-lodash-typecheck
  return value && typeof value === 'object' && value.hasOwnProperty('htmlStr');
};

export const isEmptyEditorState = (state: LexicalEditorHtml) => {
  if (!isEditorState) return false;
  if (state.htmlStr.trim().length === 0) return true;

  const parser = new DOMParser();
  const doc = parser.parseFromString(state.htmlStr, 'text/html');
  const text = doc.body.textContent;

  if (text?.trim().length === 0) {
    return true;
  }

  return false;
};
