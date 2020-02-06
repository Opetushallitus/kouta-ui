import React, { useContext, useCallback } from 'react';
import { Field } from 'redux-form';

import useTranslation from './useTranslation';
import { FormFieldImageInput } from './formFields';
import HttpContext from './HttpContext';
import UrlContext from './UrlContext';
import uploadLogo from '../utils/kouta/uploadLogo';

export const LogoSection = ({ name, label }) => {
  const { t } = useTranslation();

  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const upload = useCallback(async file => {
    // TODO: Use real upload API after the backend is available
    return Promise.resolve(URL.createObjectURL(file));
    //return uploadLogo({ httpClient, image: file, apiUrls });
  }, [httpClient, apiUrls, upload]);

  return (
    <Field
      name={name}
      label={label}
      component={FormFieldImageInput}
      upload={upload}
      maxSize={100000}
      maxDimensions={{ width: 180, height: 120 }}
      accept={['.jpeg', '.jpg', '.png', '.svg']}
    ></Field>
  );
};

export default LogoSection;
