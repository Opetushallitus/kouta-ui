import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '#/src/components/IconButton';

export function EditButton({ children, ...props }) {
  const { t } = useTranslation();
  return (
    <IconButton type="button" color="primary" iconType="edit" {...props}>
      {children ? children : t('yleiset.muokkaa')}
    </IconButton>
  );
}

export default EditButton;
