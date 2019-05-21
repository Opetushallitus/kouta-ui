import React, { useMemo } from 'react';
import uniq from 'lodash/uniq';

import { getOrganisaatioHierarchyByOid } from '../../apiUtils';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../Checkbox';

import {
  isArray,
  getTreeLevel,
  arrayDiff,
  getFirstLanguageValue,
  memoize,
} from '../../utils';

import Spacing from '../Spacing';
import useApiAsync from '../useApiAsync';

const filterByOrganisaatioTyyppi = tyyppi => ({ organisaatiotyypit }) =>
  isArray(organisaatiotyypit) && organisaatiotyypit.includes(tyyppi);

const getOrganisaatiot = async args => {
  const hierarchy = await getOrganisaatioHierarchyByOid(args);

  const children = getTreeLevel({ tree: { children: hierarchy }, level: 1 });

  return children.filter(filterByOrganisaatioTyyppi('organisaatiotyyppi_02'));
};

const getOptions = organisaatiot => {
  return organisaatiot.map(({ nimi, oid, children = [] }) => ({
    label: getFirstLanguageValue(nimi),
    value: oid,
    children: children
      .filter(filterByOrganisaatioTyyppi('organisaatiotyyppi_03'))
      .map(({ nimi: childNimi, oid: childOid }) => ({
        label: getFirstLanguageValue(childNimi),
        value: childOid,
      })),
  }));
};

const getFlatOptions = memoize(options => {
  return isArray(options)
    ? options.reduce((acc, curr) => {
        if (isArray(curr.children)) {
          return [...acc, ...curr.children];
        }

        return acc;
      }, [])
    : [];
});

const cleanValue = (value, options) => {
  const flatOptions = getFlatOptions(options);

  const optionValues = flatOptions.map(({ value }) => value);

  if (!isArray(options) || !isArray(value)) {
    return value;
  }

  return value.filter(v => optionValues.includes(v));
};

const makeOnGroupChange = ({
  options = [],
  value = [],
  onChange,
  allOptions = [],
}) => newValue => {
  const optionValue = options.map(({ value }) => value);
  const previousOptionValue = value.filter(v => optionValue.includes(v));
  const newOptionValue = newValue.filter(v => optionValue.includes(v));
  const { added, removed } = arrayDiff(previousOptionValue, newOptionValue);

  onChange(
    cleanValue(
      uniq([...added, ...value.filter(v => !removed.includes(v))]),
      allOptions,
    ),
  );
};

const makeOnToggleAll = ({ children, onChange, value }) => e => {
  const checked = Boolean(e.target.checked);
  const childValues = children.map(({ value: childValue }) => childValue);

  if (checked) {
    onChange(uniq([...value, ...childValues]));
  } else {
    onChange(value.filter(v => !childValues.includes(v)));
  }
};

const MultiSelection = ({ value = [], onChange = () => {}, options = [] }) => {
  return options
    .filter(({ children }) => isArray(children) && children.length > 0)
    .map(({ label, children = [], value: oid }, index) => {
      const onToggleAll = makeOnToggleAll({ children, onChange, value });

      const allChildrenSelected = !children.find(
        ({ value: childValue }) => !value.includes(childValue),
      );

      return (
        <Spacing marginBottom={index < options.length - 1 ? 2 : 0} key={oid}>
          <Spacing marginBottom={children.lenght > 0 ? 2 : 0}>
            <Checkbox checked={allChildrenSelected} onChange={onToggleAll}>
              {label}
            </Checkbox>
          </Spacing>
          {children.length > 0 ? (
            <Spacing paddingLeft={3}>
              <CheckboxGroup
                value={value}
                onChange={makeOnGroupChange({
                  options: children,
                  value,
                  onChange,
                  allOptions: options,
                })}
                options={children}
              />
            </Spacing>
          ) : null}
        </Spacing>
      );
    });
};

const JarjestamisPaikatSelect = ({ organisaatioOid, ...props }) => {
  const { data } = useApiAsync({
    promiseFn: getOrganisaatiot,
    oid: organisaatioOid,
    watch: organisaatioOid,
  });

  const options = useMemo(() => {
    return data ? getOptions(data) : [];
  }, [data]);

  return <MultiSelection options={options} {...props} />;
};

export default JarjestamisPaikatSelect;
