import React from 'react';
import get from 'lodash/get';

import FormConfigSectionContext from '../FormConfigSectionContext';
import useFormConfig from '../useFormConfig';

const FormConfigSection = ({ name, children }) => {
  const config = useFormConfig();

  const isVisible = get(config, ['sections', name]);

  return isVisible ? (
    <FormConfigSectionContext.Provider value={name}>
      {children}
    </FormConfigSectionContext.Provider>
  ) : null;
};

export default FormConfigSection;
