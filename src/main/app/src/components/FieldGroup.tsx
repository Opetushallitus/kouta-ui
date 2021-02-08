import React from 'react';

import DividerHeading from '#/src/components/DividerHeading';
import { Box } from '#/src/components/virkailija';
import {
  useFieldConfig,
  useFieldIsRequired,
} from '#/src/hooks/fieldConfigHooks';

type FieldGroupProps = {
  title: string;
  HeadingComponent?: React.ComponentType;
  name?: string;
};

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  children,
  HeadingComponent = DividerHeading,
  name,
  ...props
}) => {
  const fieldConfig = useFieldConfig(name);
  const required = useFieldIsRequired(fieldConfig);

  return !name || fieldConfig ? (
    <Box marginBottom={4} {...props}>
      <HeadingComponent>
        {title} {required ? '*' : ''}
      </HeadingComponent>
      {children}
    </Box>
  ) : (
    <div></div>
  );
};

export default FieldGroup;
