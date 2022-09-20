import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { useUrls } from '#/src/contexts/UrlContext';

export const YhteystiedotMuokkausButton = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();

  return (
    <>
      {organisaatioOid ? (
        <Button
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
        </Button>
      ) : null}
    </>
  );
};
