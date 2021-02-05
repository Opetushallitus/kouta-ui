import React, { useCallback } from 'react';

import { Field } from 'redux-form';

import { FormFieldImageInput } from '#/src/components/formFields';
import {
  LOGO_ACCEPTED_FORMATS,
  LOGO_MAX_DIMENSIONS,
  LOGO_MAX_SIZE,
  LOGO_NO_DIMENSION_CHECK_FOR_FORMATS,
} from '#/src/constants';
import { useHttpClient, useUrls } from '#/src/contexts/contextHooks';
import { uploadLogo } from '#/src/utils/api/uploadLogo';

export const LogoSection = ({ name, label = '' }) => {
  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const upload = useCallback(
    file => uploadLogo({ httpClient, image: file, apiUrls }),
    [apiUrls, httpClient]
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
      dropzoneStyle={{ backgroundSize: 'contain' }}
    ></Field>
  );
};

export default LogoSection;
