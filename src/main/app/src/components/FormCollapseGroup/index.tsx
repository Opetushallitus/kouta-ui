import React, { useState, useEffect, useMemo } from 'react';

import { produce } from 'immer';
import _ from 'lodash';

import { FormCollapseProps } from '#/src/components/FormCollapse';
import { FIELD_ERROR_CLASSNAME } from '#/src/constants';
import { useForm } from '#/src/hooks/form';
import scrollElementIntoView from '#/src/utils/scrollElementIntoView';

type FormCollapseList = Array<React.ReactElement<FormCollapseProps>>;

const getFlattenedChildren = children => {
  let res: FormCollapseList = [];
  React.Children.forEach(children, child => {
    if (!child) {
      return;
    } else if (child?.type === React.Fragment) {
      res = [...res, ...getFlattenedChildren(child?.props?.children)];
    } else {
      res.push(child);
    }
  });

  return res as FormCollapseList;
};

const getFormCollapseId = id => `FormCollapse_${id}`;

export const FormCollapseGroup = ({
  enabled = true,
  defaultActiveStep = 0,
  defaultOpen = true,
  children,
}) => {
  const [sectionNeedsFocus, setSectionNeedsFocus] = useState<number | null>();
  const [errorsNeedAttention, setErrorsNeedAttention] =
    useState<boolean>(false);

  const {
    submitFailed,
    submitErrors: formErrors,
    submitting: isSubmitting,
  } = useForm();

  const flattenedChildren = useMemo(
    () => getFlattenedChildren(children),
    [children]
  );

  const sectionErrors: Array<boolean> = useMemo(
    () =>
      flattenedChildren.map(child => {
        // Get the 'section'-prop of the FormCollapse component
        // TODO: Enforce prop types
        const firstSection = child.props.section || '';
        return _.get(formErrors, firstSection) != null;
      }),
    [formErrors, flattenedChildren]
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
        scrollElementIntoView(firstError, 200);
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
      {flattenedChildren.map((child, index) => {
        const isLast = index === flattenedChildren.length - 1;
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
