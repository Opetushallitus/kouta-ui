import React, { useState } from 'react';
import NavigationPrompt from 'react-router-navigation-prompt';
import { useBoundFormSelectors } from '#/src/hooks/form';
import Button from '#/src/components/Button';
import UnsavedChangesDialog from '#/src/components/UnsavedChangesDialog';

export const Submit = ({
  disabled = false,
  title,
  children,
  onClick,
  ...props
}) => {
  const [saving, setSaving] = useState(null);
  const release = () => setSaving(null);
  const { isDirty } = useBoundFormSelectors();
  return (
    <>
      <NavigationPrompt
        when={(currentLoc, nextLoc) => {
          const samePath =
            (nextLoc && nextLoc.pathname) ===
            (currentLoc && currentLoc.pathname);
          const considerPreventReload = !saving && isDirty;
          return considerPreventReload && !samePath;
        }}
      >
        {props => {
          return <UnsavedChangesDialog {...props} />;
        }}
      </NavigationPrompt>
      <Button
        disabled={disabled || saving}
        onClick={() => setSaving(true) || onClick().then(release, release)}
        title={title}
        {...props}
      >
        {children}
      </Button>
    </>
  );
};

export default Submit;
