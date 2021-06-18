import React, { useState, useEffect, useMemo } from 'react';

import { produce } from 'immer';
import _ from 'lodash';

import { FormCollapseProps } from '#/src/components/FormCollapse';
import { FIELD_ERROR_CLASSNAME } from '#/src/constants';
import { useForm } from '#/src/hooks/form';
import scrollElementIntoView from '#/src/utils/scrollElementIntoView';

const pushIfVisible = ({ child, configured, config }, acc) => {
  const section = _.get(child, 'props.section');
  if (
    !child ||
    (configured && section && !_.get(config, ['sections', section]))
  ) {
    return;
  }
  acc.push(child);
};

type FormCollapseList = Array<React.ReactElement<FormCollapseProps>>;

const getVisibleChildren = (children, config, configured) => {
  return React.Children.toArray(children).reduce(
    (acc: FormCollapseList, child: React.ReactNode) => {
      const res: FormCollapseList = [];

      if (child?.type === React.Fragment) {
        for (const subchild of React.Children.toArray(child?.props?.children)) {
          pushIfVisible({ child: subchild, configured, config }, res);
        }
      } else {
        pushIfVisible({ child, configured, config }, res);
      }

      return [...acc, ...res];
    },
    []
  ) as FormCollapseList;
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

  const visibleChildren = useMemo(
    () => getVisibleChildren(children, null, false),
    [children]
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
