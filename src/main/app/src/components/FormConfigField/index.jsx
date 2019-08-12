import { useContext } from 'react';
import get from 'lodash/get';

import FormConfigSectionContext from '../FormConfigSectionContext';
import useFormConfig from '../useFormConfig';

const FormConfigField = ({ name, children }) => {
  const config = useFormConfig();
  const section = useContext(FormConfigSectionContext);

  const isVisible = Boolean(get(config, ['sections', section, 'fields', name]));

  return isVisible ? children : null;
};

export default FormConfigField;
