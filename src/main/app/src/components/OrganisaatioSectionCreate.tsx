import { useMemo } from 'react';

import _ from 'lodash';
import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { useAllowedOrgs } from '#/src/pages/HomePage/OrganisaatioDrawer/useReadableOrganisaatioHierarkia';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

import { FormFieldSelect } from './formFields';

export const OrganisaatioSectionCreate = () => {
  const language = useUserLanguage();

  const { hierarkia, isLoading } = useAllowedOrgs();

  const options = useMemo(() => {
    const orgs = flattenHierarkia(hierarkia);

    return _.map(orgs, ({ oid, nimi }) => ({
      value: oid,
      label: `${getFirstLanguageValue(nimi, language)} (${oid})`,
    }));
  }, [hierarkia, language]);

  return (
    <Box>
      <Box mb={2}>
        <Field
          name="organisaatioOid"
          component={FormFieldSelect}
          options={options}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};
