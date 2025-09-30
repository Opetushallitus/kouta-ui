import styled from 'styled-components';

import { Button, Icon } from '#/src/components/virkailija';

const SizedIcon = styled(Icon)`
  font-size: 1.2em;
  width: 1.1em;
  padding-right: 2px;
`;

export type IconButtonProps = {
  iconType: string;
} & React.ComponentProps<typeof Button>;

export const IconButton = ({
  iconType,
  children,
  ...props
}: IconButtonProps) => (
  <Button {...props}>
    <SizedIcon type={iconType} />
    {children}
  </Button>
);

export default IconButton;
