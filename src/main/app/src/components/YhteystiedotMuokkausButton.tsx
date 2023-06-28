import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormButton } from '#/src/components/FormButton';
import { useUrls } from '#/src/contexts/UrlContext';

export const YhteystiedotMuokkausButton = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();

  return (
    <>
      {organisaatioOid ? (
        <FormButton
          as="a"
          href={apiUrls.url(
            'organisaatiopalvelu.organisaation-muokkaus-ui',
            organisaatioOid
          )}
          target="_blank"
          variant="outlined"
          color="primary"
        >
          {t('oppilaitoslomake.yhteystietojen-muokkaus')}
        </FormButton>
      ) : null}
    </>
  );
};
