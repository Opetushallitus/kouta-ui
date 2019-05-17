import React, { useMemo } from 'react';

import CheckboxGroup from '../CheckboxGroup';
import useTranslation from '../useTranslation';
import { isArray } from '../../utils';

const getOptions = t => [
  { value: 'fi', label: t('yleiset.suomi') },
  { value: 'sv', label: t('yleiset.ruotsi') },
  { value: 'en', label: t('yleiset.englanti') },
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
