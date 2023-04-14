import React, { useState } from 'react';

import { hideVisually } from 'polished';
import styled from 'styled-components';

const Hidden = styled.div`
  ${hideVisually()};
`;

type ChildrenProps = { open: boolean; onToggle: () => void };

type AbstractCollapseProps = {
  defaultOpen?: boolean;
  children?: (props: ChildrenProps) => React.ReactNode;
  content?: React.ReactNode;
  unmount?: boolean;
};

const Content = ({
  open,
  unmount,
  content,
}: {
  open: boolean;
  unmount: boolean;
  content: React.ReactNode;
}) => {
  switch (true) {
    case open:
      return <>{content}</>;
    case unmount:
      return null;
    default:
      return <Hidden>{content}</Hidden>;
  }
};

export const AbstractCollapse = ({
  defaultOpen = false,
  children = () => null,
  content = null,
  unmount = false,
}: AbstractCollapseProps) => {
  const [open, setOpen] = useState<boolean>(() => defaultOpen);

  return (
    <>
      {children({ open, onToggle: () => setOpen(isOpen => !isOpen) })}
      <Content open={open} unmount={unmount} content={content} />
    </>
  );
};
