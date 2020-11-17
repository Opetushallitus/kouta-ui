import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '#/src/components/IconButton';

export default function RemoveButton({ children = undefined, ...props }) {
  const { t } = useTranslation();
  return (
    <IconButton
      type="button"
      variant="outlined"
      color="secondary"
      iconType="delete_outlined"
      {...props}
    >
      {children ? children : t('yleiset.poista')}
    </IconButton>
  );
}
