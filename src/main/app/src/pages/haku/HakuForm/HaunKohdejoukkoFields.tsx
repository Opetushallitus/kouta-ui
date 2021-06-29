import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled, { css } from 'styled-components';

import { Flex, FlexItem } from '#/src/components/Flex';
import {
  FormFieldRadioGroup,
  FormFieldSelect,
} from '#/src/components/formFields';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getThemeProp, spacing } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import isKorkeakoulutusKohdejoukkoKoodiUri from '#/src/utils/isKorkeakoulutusKohdejoukkoKoodiUri';

const KohdejoukkoFlexItem = styled(FlexItem).attrs({ grow: 0 })`
  ${({ showTarkenteet }) =>
    showTarkenteet &&
    css`
      border-right: 1px solid ${getThemeProp('palette.divider')};
      padding-right: ${spacing(4)};
    `}
`;

const HaunKohdejoukkoFields = ({
  kohdejoukkoLabel: kohdejoukkoLabelProp,
  tarkenneLabel: tarkenneLabelProp,
  name,
}) => {
  const { t } = useTranslation();

  const kohdejoukkoLabel =
    kohdejoukkoLabelProp === undefined
      ? t('yleiset.valitseHaunKohdejoukko')
      : kohdejoukkoLabelProp;

  const tarkenneLabel =
    tarkenneLabelProp === undefined
      ? t('yleiset.valitseHaunKohdejoukonTarkenne')
      : tarkenneLabelProp;

  const kohdejoukko = useFieldValue(`${name}.kohdejoukko`);
  const showTarkenteet = isKorkeakoulutusKohdejoukkoKoodiUri(kohdejoukko);

  const { options: kohdejoukkoOptions } = useKoodistoOptions({
    koodisto: 'haunkohdejoukko',
  });

  const { options: tarkenneOptions } = useKoodistoOptions({
    koodisto: 'haunkohdejoukontarkenne',
  });

  return (
    <Flex>
      <KohdejoukkoFlexItem
        showTarkenteet={showTarkenteet}
        {...getTestIdProps('kohdejoukko')}
      >
        <Field
          label={kohdejoukkoLabel}
          component={FormFieldRadioGroup}
          options={kohdejoukkoOptions}
          name={`${name}.kohdejoukko`}
          required
        />
      </KohdejoukkoFlexItem>
      {showTarkenteet && (
        <FlexItem grow={1} paddingLeft={4} {...getTestIdProps('tarkenne')}>
          <Field
            label={tarkenneLabel}
            component={FormFieldSelect}
            options={tarkenneOptions}
            name={`${name}.tarkenne`}
            isClearable
          />
        </FlexItem>
      )}
    </Flex>
  );
};

export default HaunKohdejoukkoFields;
