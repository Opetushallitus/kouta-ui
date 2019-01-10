import React from 'react';
import styled from 'styled-components';

import { getThemeProp } from '../../theme';
import Tabs, { Tab } from '../Tabs';

const TabsWrapper = styled.div`
  padding: 0px ${({ theme }) => theme.spacing.unit * 2}px;
  border-bottom: 1px solid ${getThemeProp('palette.border')};
`;

const LanguageTabs = ({ languages = [], value, onChange = () => {} }) => {
  return (
    <TabsWrapper>
      <Tabs value={value} onChange={onChange}>
        {languages.map(({ label, value }) => (
          <Tab value={value} key={value}>
            {label}
          </Tab>
        ))}
      </Tabs>
    </TabsWrapper>
  );
};

export default LanguageTabs;
