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
  required?: boolean;
};

export const FieldGroup: React.FC<FieldGroupProps> = ({
  title,
  children,
  HeadingComponent = DividerHeading,
  name,
  required: requiredProp = false,
  ...props
}) => {
  const fieldConfig = useFieldConfig(name);
  const required = useFieldIsRequired(fieldConfig) || requiredProp;

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
