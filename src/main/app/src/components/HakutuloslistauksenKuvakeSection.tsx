import React, { useCallback, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useUnmount } from 'react-use';
import { Field } from 'redux-form';

import {
  TEEMAKUVA_ACCEPTED_FORMATS,
  TEEMAKUVA_MAX_SIZE,
  HAKUKOHDETULOSLISTAUKSEN_KUVAKE_MAX_DIMENSIONS,
} from '#/src/constants';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useBoundFormActions, useIsDirty } from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { GenericFieldProps } from '#/src/types/formTypes';
import { uploadIcon } from '#/src/utils/api/uploadKuva';

import { FormFieldImageInput } from './formFields';

export const HakutuloslistauksenKuvakeSection = (props: GenericFieldProps) => {
  const { name, disabled, koulutustyyppi: selectedKoulutus } = props;
  const { t } = useTranslation();

  const httpClient = useHttpClient();
  const apiUrls = useUrls();

  const upload = useCallback(
    async file => {
      return uploadIcon({ httpClient, image: file, apiUrls });
    },
    [httpClient, apiUrls]
  );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const koulutusHasChanged = useHasChanged(selectedKoulutus);

  useEffect(() => {
    if (isDirty && koulutusHasChanged) {
      change(name, null);
    }
  }, [change, isDirty, name, koulutusHasChanged]);

  useUnmount(() => {
    change(name, null);
  });

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
