import { useContext } from 'react';

import _ from 'lodash';

import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
import { useFormConfig } from '#/src/hooks/form';

const FormConfigFragment = ({ name, children }) => {
  const config = useFormConfig();
  const section = useContext(FormConfigSectionContext);

  const isVisible = Boolean(
    _.get(config, ['sections', section, 'fragments', name])
  );

  return isVisible ? children : null;
};

export default FormConfigFragment;
