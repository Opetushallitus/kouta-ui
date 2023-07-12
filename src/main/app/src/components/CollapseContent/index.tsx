import React from 'react';

import { Spring, config } from 'react-spring/renderprops';

import { isPlaywright } from '#/src/utils';

const collapseConfig = {
  ...config.gentle,
  precision: 0.02,
  clamp: true,
};

export const CollapseContent = ({ open = false, children }) => {
  return (
    <Spring
      config={collapseConfig}
      immediate={isPlaywright}
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
