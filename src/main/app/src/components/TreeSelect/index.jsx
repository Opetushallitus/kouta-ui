import React, { useMemo, useCallback } from 'react';
import intersection from 'lodash/intersection';
import without from 'lodash/without';
import uniq from 'lodash/uniq';

import { noop } from '../../utils';
import TreeList from '../TreeList';
import Checkbox from '../Checkbox';
import findTreeNode from '../../utils/findTreeNode';

const defaultGetLabel = ({ label }) => label;
const defaultGetValue = ({ value }) => value;
const defaultGetChildren = ({ children }) => children;
const defaultGetIsDisabled = ({ disabled }) => Boolean(disabled);

const getTree = ({
  options,
  value,
  getChildren,
  getValue,
  getLabel,
  getIsDisabled,
  parent = null,
}) => {
  return options.map(opt => {
    const val = getValue(opt);
    const label = getLabel(opt);
    const children = getChildren(opt) || [];
    const disabled = getIsDisabled(opt);

    const node = {
      key: val,
      value: val,
      label,
      disabled,
      checked: value.includes(val),
      indeterminate: children.find(child => value.includes(getValue(child))),
      parent,
    };

    node.children = getTree({
      options: children,
      value,
      getChildren,
      getValue,
      getLabel,
      getIsDisabled,
      parent: node,
    });

    return node;
  });
};

const getAllOptionValues = options => {
  return options.reduce((acc, curr) => {
    return [...acc, curr.value, ...getAllOptionValues(curr.children)];
  }, []);
};

const getCleanValue = (value, allOptionValues) => {
  return intersection(allOptionValues, value);
};

const getDeepChildrenValues = node => {
  return node.children.reduce((acc, curr) => {
    return [
      ...acc,
      ...(curr.disabled ? [] : [curr.value]),
      ...curr.children
        .filter(({ disabled }) => !disabled)
        .reduce(
          (accChild, currChild) => [
            ...accChild,
            currChild.value,
            ...getDeepChildrenValues(currChild),
          ],
          [],
        ),
    ];
  }, []);
};

const getValueWithCheckedParents = (node, value) => {
  let parent = node.parent;

  let accValue = [...value];

  const isChecked = ({ value: val }) => accValue.includes(val);

  while (parent) {
    const next = parent;

    if (!next.disabled) {
      accValue = next.children.every(isChecked)
        ? [...accValue, next.value]
        : accValue;
    }

    parent = next.parent;
  }

  return accValue;
};

const getValueWithUncheckedParents = (node, value) => {
  let parent = node.parent;

  let accValue = [...value];

  while (parent) {
    const next = parent;

    if (!next.disabled) {
      accValue = without(accValue, next.value);
    }

    parent = next.parent;
  }

  return accValue;
};

const makeOnOptionChange = ({ options, value, onChange, optionValue }) => e => {
  const { checked } = e.target;

  const node = findTreeNode(options, ({ value: val }) => val === optionValue);

  let nextValue = value;

  if (!node) {
    return;
  }

  nextValue = uniq(
    checked
      ? [...value, ...getDeepChildrenValues(node), node.value]
      : without(value, ...[...getDeepChildrenValues(node), node.value]),
  );

  nextValue = uniq(getValueWithCheckedParents(node, nextValue));

  if (!checked) {
    nextValue = getValueWithUncheckedParents(node, nextValue);
  }

  return onChange(nextValue);
};

const TreeSelect = ({
  getLabel = defaultGetLabel,
  getValue = defaultGetValue,
  getChildren = defaultGetChildren,
  getIsDisabled = defaultGetIsDisabled,
  options = [],
  value: valueProp,
  onChange: onChangeProp = noop,
  error = false,
}) => {
  const value = valueProp || [];

  const tree = useMemo(
    () =>
      getTree({
        options,
        value,
        getChildren,
        getValue,
        getLabel,
        getIsDisabled,
      }),
    [options, value, getChildren, getValue, getLabel, getIsDisabled],
  );

  const allOptionValues = useMemo(() => {
    return getAllOptionValues(tree);
  }, [tree]);

  const onChange = useCallback(
    nextValue => {
      onChangeProp(getCleanValue(nextValue, allOptionValues));
    },
    [allOptionValues, onChangeProp],
  );

  const renderItem = useCallback(
    ({ label, checked, value: optionValue, indeterminate, disabled }) => {
      return (
        <Checkbox
          checked={checked}
          name={optionValue}
          onChange={makeOnOptionChange({
            options: tree,
            value,
            onChange,
            optionValue,
          })}
          error={error}
          indeterminate={indeterminate}
          disabled={disabled}
        >
          {label}
        </Checkbox>
      );
    },
    [onChange, tree, value, error],
  );

  return <TreeList items={tree}>{renderItem}</TreeList>;
};

export default TreeSelect;
