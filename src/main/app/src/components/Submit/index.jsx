import React, { useState } from 'react';
import Button from '../Button';
import useDirty from '#/src/components/useDirty';
import { withRouter } from 'react-router-dom';
import useTranslation from '#/src/components/useTranslation';
import NavigationPrompt from 'react-router-navigation-prompt';
import UnsavedChangesDialog from '../UnsavedChangesDialog';

export const Submit = ({
  disabled = false,
  title,
  children,
  onClick,
  ...props
}) => {
  const [saving, setSaving] = useState(null);
  const release = () => setSaving(null);
  const isDirty = useDirty();
  return (
    <>
      <NavigationPrompt when={!saving && isDirty}>
        {props => <UnsavedChangesDialog {...props} />}
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

export default withRouter(Submit);
