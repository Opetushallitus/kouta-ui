import React, { useState, useContext, useEffect } from 'react';
import { isFunction } from '../../utils';
import useFormConfig from '../useFormConfig';
import Box from '../Box';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import FormNameContext from '../FormNameContext';

const useFormName = () => useContext(FormNameContext)

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
  
  const formName = useFormName();
  const formData = useSelector(s => get(s, ['form', formName]));
  
  const formErrors = get(formData, ['submitErrors'])
  const isSubmitting = get(formData, ['submitting']);

  const sectionErrors = React.Children.map(children, child => {
    // Get the name of the *Section component which should be the only child of *FormCollapse component
    // TODO: Enforce prop types
    const n = get(React.Children.toArray(get(child, 'props.children')), '0.props.name');
    return get(formErrors, n) != null;
  })
  
  const firstErrorSectionIndex = sectionErrors.findIndex(error => error);

  useEffect(() => {
    if (!isSubmitting) {
      setActiveStep(firstErrorSectionIndex);
    }
  }, [firstErrorSectionIndex, isSubmitting])

  return React.Children.map(visibleChildren, (child, index) => {
    const isLast = index === visibleChildren.length - 1;

    const childProps = enabled
      ? {
          index,
          defaultOpen: sectionErrors[index],
          active: index === activeStep,
          isSubmitting,
          onContinue: !isLast
            ? () => {
                if (isFunction(child.props.onContinue)) {
                  child.props.onContinue();
                }

                if (!isLast) {
                  return setActiveStep(index + 1);
                }
              }
            : null,
        }
      : {
          index,
          defaultOpen,
        };

    return (
      <Box mb={isLast ? 0 : 4}>{React.cloneElement(child, childProps)}</Box>
    );
  });
};

export default FormCollapseGroup;
