import { useContext } from 'react';
import { get } from 'lodash';

import FormConfigSectionContext from '../FormConfigSectionContext';
import useFormConfig from '../useFormConfig';

const FormConfigField = ({ name, children }) => {
  const config = useFormConfig();
  const section = useContext(FormConfigSectionContext);

  const isVisible = Boolean(
    get(config, ['sections', section, 'fragments', name]),
  );

  return isVisible ? children : null;
};

export default FormConfigField;
