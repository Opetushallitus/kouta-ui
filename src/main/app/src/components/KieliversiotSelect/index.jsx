import React, { useMemo } from 'react';
import { isArray } from 'lodash';
import CheckboxGroup from '../CheckboxGroup';
import { useTranslation } from 'react-i18next';

const getOptions = t => [
  { value: 'fi', label: t('yleiset.suomi') },
  { value: 'sv', label: t('yleiset.ruotsi') },
  { value: 'en', label: t('yleiset.englanti') },
  { value: 'muu', label: t('yleiset.muu') },
];

const KieliversiotSelection = ({ value, ...props }) => {
  const { t } = useTranslation();
  const options = useMemo(() => getOptions(t), [t]);

  return (
    <CheckboxGroup
      value={isArray(value) ? value : []}
      options={options}
      {...props}
    />
  );
};

export default KieliversiotSelection;
