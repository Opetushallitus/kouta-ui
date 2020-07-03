import React, { useContext, useCallback } from 'react';
import { Field } from 'redux-form';

import { useTranslation } from 'react-i18next';
import { FormFieldImageInput } from './formFields';
import HttpContext from './HttpContext';
import UrlContext from './UrlContext';
import uploadTeemakuva from '../utils/kouta/uploadTeemakuva';
import {
  TEEMAKUVA_ACCEPTED_FORMATS,
  TEEMAKUVA_MAX_SIZE,
  TEEMAKUVA_MIN_DIMENSIONS,
} from '../constants';

export const TeemakuvaSection = props => {
  const { name, disabled } = props;
  const { t } = useTranslation();

  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const upload = useCallback(
    async file => {
      return uploadTeemakuva({ httpClient, image: file, apiUrls });
    },
    [httpClient, apiUrls]
  );

  return (
    <Field
      disabled={disabled}
      name={name}
      label={t('yleiset.teemakuva')}
      component={FormFieldImageInput}
      upload={upload}
      maxSize={TEEMAKUVA_MAX_SIZE}
      minDimensions={TEEMAKUVA_MIN_DIMENSIONS}
      acceptedFileFormats={TEEMAKUVA_ACCEPTED_FORMATS}
    ></Field>
  );
};

export default TeemakuvaSection;
