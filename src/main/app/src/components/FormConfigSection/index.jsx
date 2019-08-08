import React from 'react';
import get from 'lodash/get';

import FormCollapse from '../FormCollapse';
import FormConfigSectionContext from '../FormConfigSectionContext';
import useFormConfig from '../useFormConfig';

const Wrapper = ({ name, children, ...props }) => {
  return (
    <FormConfigSectionContext.Provider value={name}>
      {React.isValidElement(children)
        ? React.cloneElement(children, props)
        : children}
    </FormConfigSectionContext.Provider>
  );
};

const FormConfigSection = ({ name, children, ...props }) => {
  const config = useFormConfig();

  const isVisible = get(config, ['sections', name]);

  return isVisible ? (
    <FormConfigSectionContext.Provider value={name}>
      {children}
    </FormConfigSectionContext.Provider>
  ) : null;
};

export default FormConfigSection;
