import React, { useState } from 'react';

import Button from '../Button';

export const Submit = ({
  disabled = false,
  title,
  children,
  onClick,
  ...props
}) => {
  const [wait, setWait] = useState(null);
  const release = () => setWait(null);
  return (
    <Button
      disabled={disabled || wait}
      onClick={() => setWait(true) || onClick().then(release, release)}
      title={title}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Submit;
