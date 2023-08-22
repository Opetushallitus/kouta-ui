import { useMemo } from 'react';

import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';

import { FormFieldAsyncKoodistoSelect } from './formFields';
import { SectionInnerCollapse } from './SectionInnerCollapse';
import { useFieldValue } from '../hooks/form';
import { useUserLanguage } from '../hooks/useUserLanguage';
import getKoodiNimiTranslation from '../utils/getKoodiNimiTranslation';
import { koodiUriWithoutVersion } from '../utils/koodi/koodiUriWithoutVersion';

type CollapseContentProps = {
  koodiUri: string;
  index: number;
  name: string;
  itemProps: any;
};

export const KoodistoCollapseList = ({
  name,
  selectLabel,
  CollapseContent,
  koodistoData,
  formatLabel,
  itemProps,
}: {
  name: string;
  selectLabel: string;
  CollapseContent: React.ComponentType<CollapseContentProps>;
  koodistoData: Array<Koodi>;
  formatLabel?: (koodi: Koodi, language: LanguageCode) => string;
  itemProps: any;
}) => {
  const selectedItems = useFieldValue(`${name}.valinnat`);
  const userLanguage = useUserLanguage();

  const selectedItemsWithLabels = useMemo(
    () =>
      selectedItems?.map(({ value, label }) => {
        if (!label) {
          const koodi = koodistoData?.find(
            ({ koodiUri }) => koodiUriWithoutVersion(value) === koodiUri
          );
          if (koodi) {
            label =
              formatLabel?.(koodi, userLanguage) ??
              getKoodiNimiTranslation(koodi, userLanguage);
          }
        }
        return { value, label };
      }),
    [selectedItems, koodistoData, userLanguage, formatLabel]
  );

  return (
    <Box>
      <Box mb={3}>
        <Field
          component={FormFieldAsyncKoodistoSelect}
          name={`${name}.valinnat`}
          label={selectLabel}
          koodistoData={koodistoData}
          showAllOptions
          formatKoodiLabel={formatLabel}
          isMulti
        />
      </Box>
      {selectedItemsWithLabels?.map(({ value, label }, index) => (
        <Box mb={3} key={value}>
          <SectionInnerCollapse header={label}>
            <CollapseContent
              koodiUri={value}
              index={index}
              name={name}
              itemProps={itemProps}
            />
          </SectionInnerCollapse>
        </Box>
      ))}
    </Box>
  );
};
