import React from 'react';
import { Field } from 'redux-form';

import { Radio } from '../Radio';
import { FormFieldSelect } from '../formFields';
import { POHJAVALINTA } from '../../constants';
import Spacing from '../Spacing';

const CopyField = ({ meta, input: { value, ...input }, ...props }) => (
  <Radio
    value={POHJAVALINTA.KOPIO}
    checked={value === POHJAVALINTA.KOPIO}
    {...input}
    {...props}
  />
);

const CreateField = ({ meta, input: { value, ...input }, ...props }) => (
  <Radio
    value={POHJAVALINTA.UUSI}
    checked={value === POHJAVALINTA.UUSI}
    {...input}
    {...props}
  />
);

const ExistingField = ({ meta, input: { value, ...input }, ...props }) => (
  <Radio
    value={POHJAVALINTA.AIEMPI}
    checked={value === POHJAVALINTA.AIEMPI}
    {...input}
    {...props}
  />
);

const CopySelect = ({ input: { value }, options, selectName }) => {
  return value === POHJAVALINTA.KOPIO ? (
    <Spacing marginTop={2} marginBottom={2}>
      <Field name={selectName} component={FormFieldSelect} options={options} />
    </Spacing>
  ) : null;
};

const ExistingSelect = ({ input: { value }, options, selectName }) => {
  return value === POHJAVALINTA.AIEMPI ? (
    <Spacing marginTop={2}>
      <Field name={selectName} component={FormFieldSelect} options={options} />
    </Spacing>
  ) : null;
};

export const BaseFields = ({
  name,
  createLabel,
  copyLabel,
  existingLabel,
  copyOptions = [],
  existingOptions = [],
}) => {
  const tapaName = `${name}.tapa`;
  const valintaName = `${name}.valinta`;

  return (
    <>
      {createLabel ? (
        <Spacing marginBottom={0.5}>
          <Field name={tapaName} component={CreateField}>
            {createLabel}
          </Field>
        </Spacing>
      ) : null}

      {copyLabel ? (
        <Spacing marginBottom={0.5}>
          <Field name={tapaName} component={CopyField}>
            {copyLabel}
          </Field>
        </Spacing>
      ) : null}

      <Field
        name={tapaName}
        options={copyOptions}
        selectName={valintaName}
        component={CopySelect}
      />

      {existingLabel ? (
        <Field name={tapaName} component={ExistingField}>
          {existingLabel}
        </Field>
      ) : null}

      <Field
        name={tapaName}
        options={existingOptions}
        selectName={valintaName}
        component={ExistingSelect}
      />
    </>
  );
};

export default BaseFields;
