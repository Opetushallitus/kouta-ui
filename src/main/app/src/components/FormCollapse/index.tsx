import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import Collapse from '#/src/components/Collapse';
import { Box, Typography } from '#/src/components/virkailija';
import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
import { getTestIdProps } from '#/src/utils';

import LanguageTabs from './LanguageTabs';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  height: 100%;
  padding: 0px ${({ theme }) => theme.spacing.unit * 3}px;
`;

const LanguageTabsWrapper = styled.div`
  align-items: flex-end;
  height: 100%;
  display: flex;
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
`;

const renderActions = ({ actions, onContinue, t }) => {
  return actions ? (
    actions
  ) : _.isFunction(onContinue) ? (
    <Button type="button" onClick={onContinue}>
      {t('yleiset.jatka')}
    </Button>
  ) : null;
};

const renderHeader = ({
  header,
  index,
  languages,
  language,
  onLanguageChange,
  collapseOpen,
}) => {
  const headerContent = _.isString(header) ? (
    <Typography variant="h5" py={3} px={0}>
      {index + 1}. {header}
    </Typography>
  ) : (
    header
  );

  const showLanguageTabs =
    collapseOpen && _.isArray(languages) && languages.length > 0;

  return (
    <HeaderWrapper>
      {headerContent}
      {showLanguageTabs && (
        <LanguageTabsWrapper>
          <LanguageTabs
            languages={languages}
            language={language}
            onChange={onLanguageChange}
          />
        </LanguageTabsWrapper>
      )}
    </HeaderWrapper>
  );
};

type ComponentProps = any;

export type FormCollapseProps = {
  onContinue?: () => void;
  actions?: React.ReactNode;
  index?: number;
  header: string;
  id?: string;
  defaultLanguage?: LanguageCode;
  showLanguageTabs?: boolean;
  languages?: Array<LanguageCode>;
  active?: boolean;
  section?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  Component: ComponentProps;
  [x: string]: any;
};

export const FormCollapse = ({
  onContinue,
  actions: actionsProp,
  index,
  header: headerProp,
  id,
  defaultLanguage = 'fi',
  showLanguageTabs = false,
  languages = [],
  active = false,
  section,
  isOpen = false,
  onToggle,
  Component,
  hidden = false,
  ...props
}: FormCollapseProps) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    if (languages.length > 0 && !languages.find(lng => lng === language)) {
      setLanguage(languages[0]);
    }
  }, [languages]); // eslint-disable-line react-hooks/exhaustive-deps

  const actions = renderActions({ actions: actionsProp, t, onContinue });
  const childProps = { ...props, language, languages, onContinue };

  const header = renderHeader({
    header: headerProp,
    language,
    languages,
    onLanguageChange: setLanguage,
    index,
    collapseOpen: isOpen,
  });

  return hidden ? null : (
    <Collapse
      header={header}
      footer={
        actions && (
          <Box display="flex" justifyContent="center">
            {actions}
          </Box>
        )
      }
      active={active}
      onToggle={onToggle}
      open={isOpen}
      toggleOnHeaderClick
      {...(section ? getTestIdProps(`${section}Section`) : {})}
      {...props}
    >
      {section ? (
        <FormConfigSectionContext.Provider value={section}>
          <Component name={section} {...childProps} />
        </FormConfigSectionContext.Provider>
      ) : (
        <Component name={section} {...childProps} />
      )}
    </Collapse>
  );
};

export default FormCollapse;
