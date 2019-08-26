import React from 'react';
import styled, { css } from 'styled-components';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import useFieldValue from '../useFieldValue';
import isKorkeakoulutusKohdejoukkoKoodiUri from '../../utils/isKorkeakoulutusKohdejoukkoKoodiUri';
import { FormFieldRadioGroup, FormFieldSelect } from '../FormFields';
import useTranslation from '../useTranslation';
import { getThemeProp, spacing } from '../../theme';
import { getTestIdProps } from '../../utils';

import Flex, { FlexItem } from '../Flex';

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
