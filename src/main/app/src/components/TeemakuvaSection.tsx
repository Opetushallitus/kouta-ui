import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  KOULUTUSTYYPPI,
  TEEMAKUVA_ACCEPTED_FORMATS,
  TEEMAKUVA_MAX_SIZE,
  TEEMAKUVA_MIN_DIMENSIONS,
  TEEMAKUVA_VST_OSAAMISMERKKI_MIN_DIMENSIONS,
} from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { uploadTeemakuva } from '#/src/utils/api/uploadKuva';

import { FormFieldImageInput } from './formFields';
import { GenericFieldProps } from '../types/formTypes';

export const TeemakuvaSection = (props: GenericFieldProps) => {
  const { name, disabled, koulutustyyppi } = props;
  const { t } = useTranslation();

  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const isOsaamismerkki =
    koulutustyyppi === KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI;

  const upload = useCallback(
    async file => {
      return uploadTeemakuva({
        httpClient,
        image: file,
        apiUrls,
        params: { isSmallTeemakuva: isOsaamismerkki },
      });
    },
    [httpClient, apiUrls, isOsaamismerkki]
  );

  return (
    <Field
      disabled={disabled}
      name={name}
      label={t('yleiset.teemakuva')}
      component={FormFieldImageInput}
      upload={upload}
      maxSize={TEEMAKUVA_MAX_SIZE}
      minDimensions={
        isOsaamismerkki
          ? TEEMAKUVA_VST_OSAAMISMERKKI_MIN_DIMENSIONS
          : TEEMAKUVA_MIN_DIMENSIONS
      }
      acceptedFileFormats={TEEMAKUVA_ACCEPTED_FORMATS}
    />
  );
};

export default TeemakuvaSection;
