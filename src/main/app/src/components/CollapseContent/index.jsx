import React from 'react';
import { Spring } from 'react-spring';

export const CollapseContent = ({ open = false, children }) => {
  return (
    <Spring
      from={{ opacity: 1, height: 'auto' }}
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

export default CollapseContent;
