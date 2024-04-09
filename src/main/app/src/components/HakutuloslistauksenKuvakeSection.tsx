import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  TEEMAKUVA_ACCEPTED_FORMATS,
  TEEMAKUVA_MAX_SIZE,
  HAKUKOHDETULOSLISTAUKSEN_KUVAKE_MAX_DIMENSIONS,
} from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { GenericFieldProps } from '#/src/types/formTypes';
import { uploadTeemakuva } from '#/src/utils/api/uploadTeemakuva';

import { FormFieldImageInput } from './formFields';

export const HakutuloslistauksenKuvakeSection = (props: GenericFieldProps) => {
  const { name, disabled } = props;
  const { t } = useTranslation();

  const httpClient = useHttpClient();
  const apiUrls = useUrls();

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
      maxDimensions={HAKUKOHDETULOSLISTAUKSEN_KUVAKE_MAX_DIMENSIONS}
      acceptedFileFormats={TEEMAKUVA_ACCEPTED_FORMATS}
    />
  );
};

export default HakutuloslistauksenKuvakeSection;
