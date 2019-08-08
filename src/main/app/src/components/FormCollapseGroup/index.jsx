import React, { useState } from 'react';
import get from 'lodash/get';

import { isFunction } from '../../utils';
import useFormConfig from '../useFormConfig';

const getVisibleChildren = (children, config, configured) => {
  return React.Children.toArray(children).filter(c => {
    const sectionProp = get(c, 'props.section');

    if (!c) {
      return false;
    } else if (
      configured &&
      sectionProp &&
      !get(config, ['sections', sectionProp])
    ) {
      return false;
    }

    return true;
  });
};

const FormCollapseGroup = ({
  enabled = true,
  defaultActiveStep = 0,
  defaultOpen = false,
  configured = false,
  children,
}) => {
  const [activeStep, setActiveStep] = useState(defaultActiveStep);
  const config = useFormConfig();
  const visibleChildren = getVisibleChildren(children, config, configured);

  return React.Children.map(visibleChildren, (child, index) => {
    const childProps = enabled
      ? {
          index,
          defaultOpen,
          active: index === activeStep,
          onContinue:
            index < visibleChildren.length - 1
              ? () => {
                  if (isFunction(child.props.onContinue)) {
                    child.props.onContinue();
                  }

                  if (index < visibleChildren.length - 1) {
                    return setActiveStep(index + 1);
                  }
                }
              : null,
        }
      : {
          index,
          defaultOpen,
        };

    return React.cloneElement(child, childProps);
  });
};

export default FormCollapseGroup;
