import _ from 'lodash';

import { useFormConfigSection } from '#/src/contexts/FormConfigSectionContext';
import { useFormConfig } from '#/src/hooks/form';

const FormConfigFragment = ({ name, children }) => {
  const config = useFormConfig();
  const section = useFormConfigSection();

  const isVisible = Boolean(
    _.get(config, ['sections', section, 'fragments', name])
  );

  return isVisible ? children : null;
};

export default FormConfigFragment;
