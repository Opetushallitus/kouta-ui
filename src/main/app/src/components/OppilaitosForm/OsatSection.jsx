import React, { useMemo, useCallback } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';
import difference from 'lodash/difference';

import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { FormFieldCheckboxGroup } from '../FormFields';
import { getFirstLanguageValue } from '../../utils';
import useLanguage from '../useLanguage';
import useTranslation from '../useTranslation';
import Checkbox from '../Checkbox';
import Divider from '../Divider';
import Typography from '../Typography';

const ToggleAll = ({
  input: { onChange: inputOnChange, value },
  options,
  label,
}) => {
  const values = options.map(({ value }) => value);

  const onChange = useCallback(
    e => {
      if (e.target.checked) {
        inputOnChange(values);
      } else {
        inputOnChange([]);
      }
    },
    [inputOnChange, values],
  );

  const checked = useMemo(() => {
    return difference(values, value || []).length === 0;
  }, [values, value]);

  return (
    <Checkbox onChange={onChange} checked={checked}>
      {label}
    </Checkbox>
  );
};

const OsatSection = ({ organisaatioOid, name }) => {
  const language = useLanguage();

  const { hierarkia } = useOrganisaatioHierarkia(organisaatioOid, {
    skipParents: true,
  });

  const { t } = useTranslation();

  const options = useMemo(() => {
    return (get(hierarkia, '[0].children') || []).map(({ nimi, oid }) => ({
      value: oid,
      label: getFirstLanguageValue(nimi, language),
    }));
  }, [hierarkia, language]);

  return (
    <>
      <Typography as="div" mb={2}>
        {t('oppilaitoslomake.valitseOppilaitoksenOsat')}
      </Typography>
      <Field
        component={ToggleAll}
        label={<Typography color="text.dark">{t('yleiset.nimi')}</Typography>}
        name={name}
        options={options}
      />
      <Divider my={1} />
      <Field component={FormFieldCheckboxGroup} name={name} options={options} />
    </>
  );
};

export default OsatSection;
