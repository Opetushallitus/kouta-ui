import React from 'react';
import { Spring, config } from 'react-spring/renderprops';
import { isCypress } from '#/src/utils';

export const CollapseContent = ({ open = false, children }) => {
  return (
    <Spring
      config={{ ...config.gentle, clamp: true }}
      immediate={isCypress}
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
