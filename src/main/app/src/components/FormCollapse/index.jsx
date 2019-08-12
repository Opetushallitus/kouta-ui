import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import Collapse from '../Collapse';
import Button from '../Button';
import { isFunction, isString, getTestIdProps, isArray } from '../../utils';
import useTranslation from '../useTranslation';
import LanguageTabs from './LanguageTabs';
import Typography from '../Typography';
import FormConfigSectionContext from '../FormConfigSectionContext';
import Box from '../Box';

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

const scrollIntoView = el => {
  try {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  } catch (e) {}
};

const renderChildren = ({ onContinue, children, language, section }) => {
  const childrenProps = {
    onContinue,
    language,
  };

  let renderedChildren = children;

  if (isFunction(children)) {
    renderedChildren = children(childrenProps);
  } else if (React.isValidElement(children)) {
    renderedChildren = React.cloneElement(children, childrenProps);
  }

  return section ? (
    <FormConfigSectionContext.Provider value={section}>
      {renderedChildren}
    </FormConfigSectionContext.Provider>
  ) : (
    renderedChildren
  );
};

const renderActions = ({ actions, onContinue, t }) => {
  return actions ? (
    actions
  ) : isFunction(onContinue) ? (
    <Button
      type="button"
      onClick={onContinue}
      {...getTestIdProps('jatkaButton')}
    >
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
  children = null,
  actions: actionsProp = null,
  index,
  header: headerProp = null,
  id,
  defaultLanguage = 'fi',
  showLanguageTabs = false,
  languages = [],
  active = false,
  defaultOpen = false,
  scrollOnActive = true,
  section,
  ...props
}) => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(defaultLanguage);
  const [collapseOpen, setCollapseOpen] = useState(defaultOpen);
  const containerRef = useRef();

  const onToggleCollapse = useCallback(() => {
    setCollapseOpen(open => !open);
  }, [setCollapseOpen]);

  useEffect(() => {
    if (active && !collapseOpen) {
      scrollOnActive && scrollIntoView(containerRef.current);
      setCollapseOpen(true);
    }
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (languages.length > 0 && !languages.find(lng => lng === language)) {
      setLanguage(languages[0]);
    }
  }, [languages]); // eslint-disable-line react-hooks/exhaustive-deps

  const actions = renderActions({ actions: actionsProp, t, onContinue });

  const header = renderHeader({
    header: headerProp,
    language,
    languages,
    onLanguageChange: setLanguage,
    index,
    collapseOpen,
  });

  return (
    <div {...id && { id }} ref={containerRef}>
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
        onToggle={onToggleCollapse}
        open={collapseOpen}
        toggleOnHeaderClick={false}
        {...props}
      >
        {renderChildren({ onContinue, children, language, section })}
      </Collapse>
    </div>
  );
};

export default FormCollapse;
