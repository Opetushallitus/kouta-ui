import * as React from 'react';

import {
  convertToHTML as makeConvertToHTML,
  convertFromHTML as makeConvertFromHTML,
} from 'draft-convert';
import { EditorState } from 'draft-js';
import _ from 'lodash';

import linkDecorator from './linkDecorator';

const convertFromHTML = makeConvertFromHTML({
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a') {
      return createEntity('LINK', 'MUTABLE', { url: node.href });
    }
  },
});

const convertToHTML = makeConvertToHTML({
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return (
        <a
          href={_.get(entity, 'data.url') || ''}
          rel="noopener noreferrer"
          target="_blank"
        />
      );
    }

    return originalText;
  },
});

export const getSelectionLinkUrl = editorState => {
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
  const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey);
    return linkInstance.getData().url || '';
  }

  return '';
};

export const getBlockType = editorState => {
  const selection = editorState.getSelection();

  return editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
};

export const inlineIsActive = ({ editorState, styleName }) => {
  return editorState.getCurrentInlineStyle().has(styleName);
};

export const blockIsActive = ({ editorState, styleName }) => {
  return getBlockType(editorState) === styleName;
};

export const createEmptyEditorState = () =>
  EditorState.createEmpty(linkDecorator);

export const isEditorState = value => value instanceof EditorState;

const createEditorStateWithContent = contentState =>
  EditorState.createWithContent(contentState, linkDecorator);

export const parseEditorState = value => {
  if (!_.isString(value)) {
    return createEmptyEditorState();
  }

  return createEditorStateWithContent(convertFromHTML(value));
};

export const serializeEditorState = (value?: EditorState) => {
  const currentContent = value?.getCurrentContent?.();
  if (currentContent?.hasText?.()) {
    return convertToHTML(currentContent);
  }
};

export const isEmptyEditorState = editorState =>
  editorState?.getCurrentContent?.().hasText?.() !== true;
