import { useTranslation } from 'react-i18next';

import IconButton, { IconButtonProps } from '#/src/components/IconButton';

export default function RemoveButton({
  children,
  ...props
}: Omit<IconButtonProps, 'iconType'>) {
  const { t } = useTranslation();
  return (
    <IconButton
      type="button"
      variant="outlined"
      color="secondary"
      {...props}
      iconType="delete"
    >
      {children ? children : t('yleiset.poista')}
    </IconButton>
  );
}
