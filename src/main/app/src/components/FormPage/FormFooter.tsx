import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '#/src/components/Button';
import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import { Box } from '#/src/components/virkailija';
import { ENTITY, JULKAISUTILA } from '#/src/constants';
import { useFieldValue, useIsSubmitting } from '#/src/hooks/form';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import FormEditInfo from '../FormEditInfo';

type FormFooterProps = {
  entityType: ENTITY;
  entity: {
    muokkaaja?: string;
    modified?: string;
  };
  entityName?: TranslatedField<string>;
  save: () => void;
  canUpdate?: boolean;
  submitProps?: object;
  hideEsikatselu?: boolean;
  esikatseluUrl?: string;
};

const aboutToDeleteEntity = (nextState: JULKAISUTILA | undefined) => {
  return nextState && nextState === JULKAISUTILA.POISTETTU;
};

const FormFooter = ({
  entityType,
  entity = {},
  entityName,
  save,
  canUpdate = true,
  submitProps = {},
  hideEsikatselu = false,
  esikatseluUrl,
}: FormFooterProps) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  const { modified, muokkaaja } = entity;
  const [isConfirmationDialogOpen, toggleConfirmationDialog] = useState(false);
  const tila = useFieldValue('tila');
  const language = useUserLanguage();
  const theEntityName = getFirstLanguageValue(entityName, language);

  const doDelete = () => {
    toggleConfirmationDialog(false);
    save();
  };

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        name={theEntityName}
        onConfirm={() => {
          doDelete();
        }}
        onCancel={() => {
          toggleConfirmationDialog(false);
        }}
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Button as={Link} to="/" color="primary" variant="outlined">
            {t('yleiset.etusivulle')}
          </Button>
          {!hideEsikatselu && (
            <EsikatseluControls esikatseluUrl={esikatseluUrl} />
          )}
          <Box marginLeft={2}>
            {modified && <FormEditInfo date={modified} editorOid={muokkaaja} />}
          </Box>
        </Box>
        <Button
          onClick={() => {
            aboutToDeleteEntity(tila) ? toggleConfirmationDialog(true) : save();
          }}
          disabled={!canUpdate || isSubmitting}
          title={
            !canUpdate ? t(`${entityType}lomake.eiMuokkausOikeutta`) : undefined
          }
          {...submitProps}
        >
          {t('yleiset.tallenna')}
        </Button>
      </Box>
    </>
  );
};

export default FormFooter;
