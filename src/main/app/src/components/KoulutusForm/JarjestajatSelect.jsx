import React from 'react';

import ApiAsync from '../ApiAsync';
import { getOrganisaatioHierarchyByOid } from '../../apiUtils';
import Checkbox from '../Checkbox';
import { isArray } from '../../utils';

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const getOrganisaatiot = async args => {
  const hierarchy = await getOrganisaatioHierarchyByOid(args);

  const children = hierarchy.reduce((acc, curr) => {
    return [...acc, ...(isArray(curr.children) ? curr.children : [])];
  }, []);

  return children.filter(
    ({ organisaatiotyypit }) =>
      isArray(organisaatiotyypit) &&
      organisaatiotyypit.includes('organisaatiotyyppi_02'),
  );
};

const getOptions = organisaatiot => {
  return organisaatiot.map(({ nimi, oid }) => ({
    label: nimi.fi,
    value: oid,
  }));
};

const Selection = ({ value = [], onChange, options = [] }) => {
  return (
    <>
      {options.map(({ value: optionValue, label }) => (
        <Checkbox
          key={optionValue}
          checked={value.includes(optionValue)}
          onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
        >
          {label}
        </Checkbox>
      ))}
    </>
  );
};

const JarjestajatSelect = ({ organisaatioOid, ...props }) => {
  return (
    <ApiAsync
      promiseFn={getOrganisaatiot}
      oid={organisaatioOid}
      watch={organisaatioOid}
    >
      {({ data }) => {
        return data ? (
          <Selection {...props} options={getOptions(data)} />
        ) : null;
      }}
    </ApiAsync>
  );
};

export default JarjestajatSelect;
