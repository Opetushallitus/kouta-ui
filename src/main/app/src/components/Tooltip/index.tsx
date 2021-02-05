import React from 'react';

import RcTooltip from 'rc-tooltip';

export const Tooltip = ({ children, overlay, ...props }) => (
  <RcTooltip
    arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
    overlay={overlay}
    {...props}
  >
    {/* If children have disabled pointer events, tooltip triggering doesn't work. Using a wrapper as a workaround. */}
    <div>{children}</div>
  </RcTooltip>
);
