import React from 'react';

import { useTranslation } from 'react-i18next';
import { FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { Box } from '#/src/components/virkailija';
import { ENTITY } from '#/src/constants';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { getTestIdProps } from '#/src/utils';
import { useOpintojaksot } from '#/src/utils/toteutus/getOpintojaksot';

import { EntityFields } from './EntityFields';

export const OpintojaksotFields = ({ fields, organisaatioOid }) => {
  const { data: opintojaksot } = useOpintojaksot({
    organisaatioOid,
  });

  const options = useEntityOptions(opintojaksot);

  return (
    <EntityFields
      fields={fields}
      options={options}
      organisaatioOid={organisaatioOid}
      fieldName={'opintojakso'}
      entityType={ENTITY.TOTEUTUS}
      entityLinkTranslationKey={'toteutuslomake.muokkaaOpintojaksoa'}
    />
  );
};

export const OpintojaksojenLiittamisSection = ({ name, organisaatioOid }) => {
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
