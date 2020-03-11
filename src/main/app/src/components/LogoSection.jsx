import React, { useContext, useCallback } from 'react';
import { Field } from 'redux-form';
import { FormFieldImageInput } from './formFields';
import HttpContext from './HttpContext';
import UrlContext from './UrlContext';
import uploadLogo from '../utils/kouta/uploadLogo';
import {
  LOGO_ACCEPTED_FORMATS,
  LOGO_MAX_DIMENSIONS,
  LOGO_MAX_SIZE,
  LOGO_NO_DIMENSION_CHECK_FOR_FORMATS,
} from '../constants';

export const LogoSection = ({ name, label = '' }) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);

  const upload = useCallback(
    file => {
      // TODO: Use real upload API after the backend is available
      return Promise.resolve(URL.createObjectURL(file));
      //return uploadLogo({ httpClient, image: file, apiUrls });
    },
    [apiUrls, httpClient, uploadLogo],
  );

  return (
    <Field
      name={name}
      label={label}
      component={FormFieldImageInput}
      upload={upload}
      maxSize={LOGO_MAX_SIZE}
      maxDimensions={LOGO_MAX_DIMENSIONS}
      acceptedFileFormats={LOGO_ACCEPTED_FORMATS}
      noDimensionCheckForFormats={LOGO_NO_DIMENSION_CHECK_FOR_FORMATS}
      backgroundSize="contain"
    ></Field>
  );
};

export default LogoSection;
