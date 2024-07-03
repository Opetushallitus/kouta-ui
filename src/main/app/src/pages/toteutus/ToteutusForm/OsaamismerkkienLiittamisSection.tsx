import React from 'react';

import { useTranslation } from 'react-i18next';
import { FieldArray } from 'redux-form';

import { FieldGroup } from '#/src/components/FieldGroup';
import { Box } from '#/src/components/virkailija';
import { ENTITY, KOULUTUSTYYPPI } from '#/src/constants';
import useEntityOptions from '#/src/hooks/useEntityOptionsHook';
import { getTestIdProps } from '#/src/utils';
import { useKoulutuksetByKoulutustyyppi } from '#/src/utils/koulutus/getKoulutukset';

import { EntityFields } from './EntityFields';

export const OsaamismerkitFields = ({ fields, organisaatioOid }) => {
  const { data: osaamismerkit } = useKoulutuksetByKoulutustyyppi({
    organisaatioOid,
    koulutustyyppi: KOULUTUSTYYPPI.VAPAA_SIVISTYSTYO_OSAAMISMERKKI,
  });

  const options = useEntityOptions(osaamismerkit);

  return (
    <EntityFields
      fields={fields}
      options={options}
      organisaatioOid={organisaatioOid}
      fieldName={'osaamismerkki'}
      entityType={ENTITY.KOULUTUS}
      entityLinkTranslationKey={'toteutuslomake.siirryOsaamismerkinTietoihin'}
    />
  );
};

export const OsaamismerkkienLiittamisSection = ({
  name,
  organisaatioOid,
}: {
  name: string;
  organisaatioOid: string;
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={2} {...getTestIdProps('osaamismerkkienLiittaminen')}>
      <FieldGroup
        title={t('toteutuslomake.osaamismerkit')}
        {...getTestIdProps('osaamismerkit')}
      >
        <FieldArray
          name={`${name}.osaamismerkit`}
          component={OsaamismerkitFields}
          organisaatioOid={organisaatioOid}
        />
      </FieldGroup>
    </Box>
  );
};
