import React from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '#/src/components/Button';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import { Box } from '#/src/components/virkailija';
import { useIsSubmitting } from '#/src/hooks/form';

import FormEditInfo from '../FormEditInfo';

const FormFooter = ({
  entityType,
  entity = {},
  save,
  canUpdate = true,
  submitProps = {},
  esikatseluUrl,
}) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  const { modified, muokkaaja } = entity;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Button as={Link} to="/" color="primary" variant="outlined">
          {t('yleiset.etusivulle')}
        </Button>
        <EsikatseluControls esikatseluUrl={esikatseluUrl} />
        <Box marginLeft={2}>
          {modified && <FormEditInfo date={modified} editorOid={muokkaaja} />}
        </Box>
      </Box>
      <Button
        onClick={save}
        disabled={!canUpdate || isSubmitting}
        title={
          !canUpdate ? t(`${entityType}lomake.eiMuokkausOikeutta`) : undefined
        }
        {...submitProps}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Box>
  );
};

export default FormFooter;
