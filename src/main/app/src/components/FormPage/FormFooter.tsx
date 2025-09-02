import React, { useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { EsikatseluControls } from '#/src/components/EsikatseluControls';
import { FormButton } from '#/src/components/FormButton';
import { Box, Button } from '#/src/components/virkailija';
import { ENTITY, JULKAISUTILA } from '#/src/constants';
import { useFieldValue, useIsSubmitting } from '#/src/hooks/form';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { EntityModelBase } from '#/src/types/domainTypes';
import { getEntityNimiTranslation } from '#/src/utils';

import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import FormEditInfo from '../FormEditInfo';

type FormFooterProps = {
  entityType: ENTITY;
  entity?: EntityModelBase;
  save: () => void;
  canUpdate?: boolean;
  submitProps?: object;
  hideEsikatselu?: boolean;
  esikatseluUrl?: string;
  infoTextTranslationKey?: string;
};

const aboutToDeleteEntity = (nextState: JULKAISUTILA | undefined) => {
  return nextState && nextState === JULKAISUTILA.POISTETTU;
};

export const FormFooter = ({
  entityType,
  entity = {
    tila: undefined,
  },
  save,
  canUpdate = true,
  submitProps = {},
  hideEsikatselu = false,
  esikatseluUrl,
  infoTextTranslationKey = '',
}: FormFooterProps) => {
  const { t } = useTranslation();
  const isSubmitting = useIsSubmitting();
  let title;

  if (!canUpdate) {
    if (_.isEmpty(infoTextTranslationKey)) {
      title = t(`${entityType}lomake.eiMuokkausOikeutta`);
    } else {
      title = t(`${entityType}lomake.${infoTextTranslationKey}`);
    }
  }
  const [isConfirmationDialogOpen, toggleConfirmationDialog] = useState(false);
  const tila = useFieldValue('tila');
  const theEntityName = getEntityNimiTranslation(entity, useUserLanguage());

  const doDelete = () => {
    toggleConfirmationDialog(false);
    save();
  };

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onConfirm={doDelete}
        onCancel={() => {
          toggleConfirmationDialog(false);
        }}
        headerText={t('ilmoitukset.luonnoksenPoisto.otsikko')}
        message={t('ilmoitukset.luonnoksenPoisto.viesti', {
          name: theEntityName,
        })}
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
            {entity?.modified && <FormEditInfo entity={entity} />}
          </Box>
        </Box>
        <FormButton
          onClick={() => {
            aboutToDeleteEntity(tila) ? toggleConfirmationDialog(true) : save();
          }}
          disabled={!canUpdate || isSubmitting}
          title={title}
          {...submitProps}
        >
          {t('yleiset.tallenna')}
        </FormButton>
      </Box>
    </>
  );
};
