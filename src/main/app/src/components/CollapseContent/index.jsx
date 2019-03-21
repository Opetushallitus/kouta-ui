import React from 'react';
import { Spring, Transition, animated } from 'react-spring';

export const CollapseContent = ({ open = false, children }) => {
  return (
    <Spring
      native
      from={{ opacity: 1, height: 'auto' }}
      to={open ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
    >
      {({ opacity, height }) => (
        <animated.div
          style={{
            opacity,
            height,
            overflow: opacity === 1 ? 'visible' : 'hidden',
          }}
        >
          {children}
        </animated.div>
      )}
    </Spring>
  );
};

export const UnmountingCollapseContent = ({ open, children }) => {
  return (
    <Transition
      native
      enter={{ opacity: 1, height: 'auto' }}
      leave={{ opacity: 0, height: 0 }}
      from={{ opacity: 0, height: 0 }}
      items={open}
    >
      {open =>
        open &&
        (({ opacity, height }) => (
          <animated.div
            style={{
              opacity,
              height,
              overflow: opacity === 1 ? 'visible' : 'hidden',
            }}
          >
            {children}
          </animated.div>
        ))
      }
    </Transition>
  );
};

export default CollapseContent;
