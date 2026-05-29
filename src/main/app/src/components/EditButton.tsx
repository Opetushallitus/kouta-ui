import React from 'react';

import { useTranslation } from 'react-i18next';

import IconButton, { IconButtonProps } from '#/src/components/IconButton';

export function EditButton({
  children,
  ...props
}: Omit<IconButtonProps, 'type' | 'color' | 'iconType'> & {
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <IconButton type="button" color="primary" iconType="edit" {...props}>
      {children ?? t('yleiset.muokkaa')}
    </IconButton>
  );
}

export default EditButton;
