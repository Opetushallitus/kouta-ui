import React from 'react';

import RcTooltip from 'rc-tooltip';

export const Tooltip = ({ children, overlay, ...props }) => (
  <RcTooltip
    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
    overlay={overlay}
    {...props}
  >
    {children}
  </RcTooltip>
);
