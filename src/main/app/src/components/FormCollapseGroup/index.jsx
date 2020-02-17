import React, { useState, useEffect, useRef, useMemo } from 'react';
import { get } from 'lodash';
import { produce } from 'immer';
import Box from '../Box';
import { isFunction } from '../../utils';
import useFormConfig from '../useFormConfig';
import useForm from '../useForm';
import scrollElementIntoView from '../../utils/scrollElementIntoView';

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
  configured = false,
  defaultOpen = true,
  children,
}) => {
  const [sectionNeedsFocus, setSectionNeedsFocus] = useState(null);
  const [errorsNeedAttention, setErrorsNeedAttention] = useState(false);

  const activeRef = useRef();
  const config = useFormConfig();

  const {
    submitFailed,
    submitErrors: formErrors,
    submitting: isSubmitting,
  } = useForm();

  const visibleChildren = useMemo(
    () => getVisibleChildren(children, config, configured),
    [children, config, configured],
  );

  const sectionErrors = useMemo(
    () =>
      React.Children.map(visibleChildren, child => {
        // Get the name of the *Section component which should be the only child of *FormCollapse component
        // TODO: Enforce prop types
        const firstSection = get(
          React.Children.toArray(get(child, 'props.children')),
          '0.props.name',
        );
        return get(formErrors, firstSection) != null;
      }),
    [formErrors, visibleChildren],
  );

  // initialize the collapse components' open/closed state so that the initial
  // active collapse is open and others closed
  const [collapsesOpen, setCollapsesOpen] = useState(() =>
    sectionErrors.map((_, i) => defaultOpen || defaultActiveStep === i),
  );

  const setCollapseOpen = (collapseIndex, value) => {
    setCollapsesOpen(collapses =>
      produce(collapses, draft => {
        draft[collapseIndex] = value;
      }),
    );
  };

  useEffect(() => {
    if (!isSubmitting && submitFailed) {
      setErrorsNeedAttention(true);
    }
  }, [isSubmitting, submitFailed]);

  useEffect(() => {
    if (errorsNeedAttention) {
      setCollapsesOpen(collapses =>
        sectionErrors.map((error, i) => error || collapses[i]),
      );
      const firstErrorIndex = sectionErrors.indexOf(true);
      firstErrorIndex !== -1 && setSectionNeedsFocus(firstErrorIndex);
      setErrorsNeedAttention(false);
    }
  }, [errorsNeedAttention, sectionErrors]);

  useEffect(() => {
    if (sectionNeedsFocus != null) {
      setCollapseOpen(sectionNeedsFocus, true);
      scrollElementIntoView(activeRef.current, 300);
      setSectionNeedsFocus(null);
    }
  }, [sectionNeedsFocus, activeRef]);

  return React.Children.map(visibleChildren, (child, index) => {
    const isLast = index === visibleChildren.length - 1;
    const childProps = {
      index,
      isOpen: collapsesOpen[index],
      onToggle: () => {
        setCollapseOpen(index, !collapsesOpen[index]);
      },
      onContinue:
        !isLast && enabled
          ? () => {
              if (isFunction(child.props.onContinue)) {
                child.props.onContinue();
              }
              setSectionNeedsFocus(index + 1);
            }
          : null,
    };
    return (
      <Box
        ref={index === sectionNeedsFocus ? activeRef : null}
        mb={isLast ? 0 : 4}
      >
        {React.cloneElement(child, childProps)}
      </Box>
    );
  });
};

export default FormCollapseGroup;
