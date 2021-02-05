import React, { useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Button from '#/src/components/Button';
import Flex, { FlexItem } from '#/src/components/Flex';
import Select from '#/src/components/Select';
import { Icon, Typography } from '#/src/components/virkailija';
import { spacing } from '#/src/theme';

const ButtonIcon = styled(Icon)`
  font-size: 1.2rem;

  ${({ before }) =>
    before &&
    css`
      margin-right: ${spacing(1)};
    `}

  ${({ after }) =>
    after &&
    css`
      margin-left: ${spacing(1)};
    `}
`;

const SelectWrapper = styled.div`
  width: 6rem;
`;

const PageCount = styled(Typography)`
  white-space: nowrap;
`;

const getPageOptions = pageCount =>
  [...new Array(pageCount)].map((v, index) => ({
    value: index,
    label: index + 1,
  }));

const Pagination = ({ value = 0, onChange = () => {}, pageCount = 0 }) => {
  const { t } = useTranslation();
  const options = useMemo(() => getPageOptions(pageCount), [pageCount]);
  const onPrev = useCallback(() => onChange(value - 1), [value, onChange]);
  const onNext = useCallback(() => onChange(value + 1), [value, onChange]);
  const onSelectChange = useCallback(({ value }) => onChange(value), [
    onChange,
  ]);

  const pageValue = options[value];

  return (
    <Flex alignCenter inline>
      <Button disabled={value === 0} onClick={onPrev} variant="text">
        <ButtonIcon type="arrow_back" before /> {t('yleiset.edellinen')}
      </Button>
      <FlexItem marginLeft={2} grow={2} basis="10rem">
        <SelectWrapper>
          <Select
            options={options}
            value={pageValue}
            menuPlacement="auto"
            placeholder="0"
            onChange={onSelectChange}
            isClearable={false}
          />
        </SelectWrapper>
      </FlexItem>
      <FlexItem marginLeft={1} marginRight={2}>
        <PageCount>/ {pageCount}</PageCount>
      </FlexItem>
      <Button
        disabled={pageCount === 0 || value === pageCount - 1}
        onClick={onNext}
        variant="text"
      >
        {t('yleiset.seuraava')}
        <ButtonIcon type="arrow_forward" after />
      </Button>
    </Flex>
  );
};

export default Pagination;
