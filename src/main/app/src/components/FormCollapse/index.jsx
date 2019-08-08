import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import Collapse from '../Collapse';
import Button from '../Button';
import { isFunction, isString, getTestIdProps, isArray } from '../../utils';
import useTranslation from '../useTranslation';
import LanguageTabs from './LanguageTabs';
import Typography from '../Typography';
import FormConfigSectionContext from '../FormConfigSectionContext';

const CollapseFooterContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CollapseWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.unit * 4}px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  height: 100%;
  padding: 0px ${({ theme }) => theme.spacing.unit * 3}px;
`;

const HeaderContent = styled(Typography).attrs({ variant: 'h5' })`
  padding: ${({ theme }) => theme.spacing.unit * 3}px 0px;
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
    <HeaderContent>
      {index + 1}. {header}
    </HeaderContent>
  ) : (
    header
  );

  const showLanguageTabs =
    collapseOpen && isArray(languages) && languages.length > 0;

  return (
    <HeaderWrapper>
      {headerContent}
      {showLanguageTabs ? (
        <LanguageTabsWrapper>
          <LanguageTabs
            languages={languages}
            language={language}
            onChange={onLanguageChange}
          />
        </LanguageTabsWrapper>
      ) : null}
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
    <CollapseWrapper {...id && { id }} ref={containerRef}>
      <Collapse
        header={header}
        footer={
          actions ? (
            <CollapseFooterContainer>{actions}</CollapseFooterContainer>
          ) : null
        }
        active={active}
        onToggle={onToggleCollapse}
        open={collapseOpen}
        toggleOnHeaderClick={false}
        {...props}
      >
        {renderChildren({ onContinue, children, language, section })}
      </Collapse>
    </CollapseWrapper>
  );
};

export default FormCollapse;
