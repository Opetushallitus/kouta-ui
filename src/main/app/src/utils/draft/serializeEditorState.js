import React from 'react';

import { convertToHTML as makeConvertToHTML } from 'draft-convert';

import get from 'lodash/get';
import { isObject, isFunction } from '../index';

const convertToHTML = makeConvertToHTML({
  entityToHTML: (entity, originalText) => {
    if (entity.type === 'LINK') {
      return <a href={get(entity, 'data.url') || ''}>{originalText}</a>;
    }

    return originalText;
  },
});

const serializeEditorState = value => {
  if (!isObject(value) || !isFunction(value.getCurrentContent)) {
    return '';
  }

  return convertToHTML(value.getCurrentContent());
};

export default serializeEditorState;
