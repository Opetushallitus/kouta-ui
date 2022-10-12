import React from 'react';

import { useTranslation } from 'react-i18next';
import { FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { Box } from '#/src/components/virkailija';
import { getTestIdProps } from '#/src/utils';

import { OpintojaksotFields } from './OpintojaksotFields.tsx';

export const OpintojaksojenLiittamisSection = ({
  language,
  name,
  disabled,
  organisaatioOid,
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={2} {...getTestIdProps('opintojaksojenLiittaminen')}>
      <FieldGroup
        title={t('toteutuslomake.opintojaksot')}
        {...getTestIdProps('opintojaksot')}
      >
        <FieldArray
          name={`${name}.opintojaksot`}
          component={OpintojaksotFields}
          organisaatioOid={organisaatioOid}
        />
      </FieldGroup>
    </Box>
  );
};
