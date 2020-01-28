import React, { useContext, useCallback } from 'react';
import { Field } from 'redux-form';

import useTranslation from './useTranslation';
import { FormFieldImageInput } from './formFields';
import HttpContext from './HttpContext';
import UrlContext from './UrlContext';
import uploadTeemakuva from '../utils/kouta/uploadTeemakuva';

export const TeemakuvaSection = props => {
  const { name } = props;
  const { t } = useTranslation();

  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const upload = useCallback(
    async file => {
      return uploadTeemakuva({ httpClient, image: file, apiUrls });
    },
    [httpClient, apiUrls],
  );

  return (
    <Field
      name={name}
      label={t('yleiset.teemakuva')}
      component={FormFieldImageInput}
      upload={upload}
      maxSize={2000000}
      minDimensions={{ width: 1260, height: 400 }}
      acceptedFileFormats={['.jpeg', '.jpg', '.png']}
    ></Field>
  );
};

export default TeemakuvaSection;
