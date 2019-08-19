import React from 'react';
import { Spring, Transition } from 'react-spring';

export const CollapseContent = ({ open = false, children }) => {
  return (
    <Spring
      to={open ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
    >
      {({ opacity, height }) => (
        <div
          style={{
            opacity,
            height,
            overflow: opacity === 1 ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      )}
    </Spring>
  );
};

export const UnmountingCollapseContent = ({ open = false, children }) => {
  return (
    <Transition
      enter={{ opacity: 1, height: 'auto' }}
      leave={{ opacity: 0, height: 0 }}
      from={{ opacity: 0, height: 0 }}
      items={open}
    >
      {open =>
        open &&
        (({ opacity, height }) => (
          <div
            style={{
              opacity,
              height,
              overflow: opacity.value === 1 ? 'visible' : 'hidden',
            }}
          >
            {children}
          </div>
        ))
      }
    </Transition>
  );
};

export default CollapseContent;
