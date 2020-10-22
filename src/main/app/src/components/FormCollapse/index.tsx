import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isFunction, isString, isArray } from 'lodash';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '#/src/utils';
import Collapse from '#/src/components/Collapse';
import Button from '#/src/components/Button';
import { Box, Typography } from '#/src/components/virkailija';
import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
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
  ) : isFunction(onContinue) ? (
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
  const headerContent = isString(header) ? (
    <Typography variant="h5" py={3} px={0}>
      {index + 1}. {header}
    </Typography>
  ) : (
    header
  );

  const showLanguageTabs =
    collapseOpen && isArray(languages) && languages.length > 0;

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

const FormCollapse = ({
  onContinue,
  actions: actionsProp = null,
  index,
  header: headerProp = null,
  id,
  defaultLanguage = 'fi',
  showLanguageTabs = false,
  languages = [],
  active = false,
  section,
  isOpen,
  onToggle,
  Component,
  ...props
}) => {
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

  return (
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
