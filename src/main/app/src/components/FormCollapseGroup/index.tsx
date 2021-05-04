import React, { useState, useEffect, useMemo } from 'react';

import { produce } from 'immer';
import _ from 'lodash';

import { FormCollapseProps } from '#/src/components/FormCollapse';
import { useFormConfig, useForm } from '#/src/hooks/form';
import scrollElementIntoView from '#/src/utils/scrollElementIntoView';

const getVisibleChildren = (children, config, configured) => {
  return React.Children.toArray(children).filter(c => {
    const section = _.get(c, 'props.section');

    if (!c) {
      return false;
    } else if (configured && section && !_.get(config, ['sections', section])) {
      return false;
    }

    return true;
  }) as Array<React.ReactElement<FormCollapseProps>>;
};

const getFormCollapseId = id => `FormCollapse_${id}`;

const FormCollapseGroup = ({
  enabled = true,
  defaultActiveStep = 0,
  configured = false,
  defaultOpen = true,
  children,
}) => {
  const [sectionNeedsFocus, setSectionNeedsFocus] = useState<number | null>();
  const [errorsNeedAttention, setErrorsNeedAttention] = useState<boolean>(
    false
  );

  const config = useFormConfig();

  const {
    submitFailed,
    submitErrors: formErrors,
    submitting: isSubmitting,
  } = useForm();

  const visibleChildren = useMemo(
    () => getVisibleChildren(children, config, configured),
    [children, config, configured]
  );

  const sectionErrors: Array<boolean> = useMemo(
    () =>
      React.Children.map(visibleChildren, child => {
        // Get the 'section'-prop of the FormCollapse component
        // TODO: Enforce prop types
        const firstSection = _.get(child, 'props.section');
        return _.get(formErrors, firstSection) != null;
      }),
    [formErrors, visibleChildren]
  );

  // initialize the collapse components' open/closed state so that the initial
  // active collapse is open and others closed
  const [collapsesOpen, setCollapsesOpen] = useState(() =>
    sectionErrors.map((_, i) => defaultOpen || defaultActiveStep === i)
  );

  const setCollapseOpen = (collapseIndex, value) => {
    setCollapsesOpen(collapses =>
      produce(collapses, draft => {
        draft[collapseIndex] = value;
      })
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
        sectionErrors.map((error, i) => error || collapses[i])
      );
      const firstError = document.querySelector(`.${FIELD_ERROR_CLASSNAME}`);
      if (firstError) {
        scrollElementIntoView(firstError);
      }
      setErrorsNeedAttention(false);
    }
  }, [errorsNeedAttention, sectionErrors]);

  useEffect(() => {
    if (sectionNeedsFocus != null) {
      setCollapseOpen(sectionNeedsFocus, true);
      const el = document.getElementById(getFormCollapseId(sectionNeedsFocus));
      scrollElementIntoView(el, 200);
      setSectionNeedsFocus(null);
    }
  }, [sectionNeedsFocus]);

  return (
    <>
      {visibleChildren.map((child, index) => {
        const isLast = index === visibleChildren.length - 1;
        const childProps = {
          ...(child?.props ?? {}),
          index,
          isOpen: collapsesOpen[index],
          onToggle: () => {
            setCollapseOpen(index, !collapsesOpen[index]);
          },
          onContinue:
            !isLast && enabled
              ? () => {
                  if (_.isFunction(child.props.onContinue)) {
                    child.props.onContinue();
                  }
                  setSectionNeedsFocus(index + 1);
                }
              : undefined,
          isLast,
          key: `FormCollapse_${_.kebabCase(child?.props?.header)}`,
          id: getFormCollapseId(index),
        };
        return React.cloneElement(child, childProps);
      })}
    </>
  );
};

export default FormCollapseGroup;
