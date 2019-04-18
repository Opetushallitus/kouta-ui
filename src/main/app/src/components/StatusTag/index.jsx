import React from 'react';

import LargeStatusTag from './LargeStatusTag';
import SmallStatusTag from './SmallStatusTag';

const StatusTag = ({ large, small, ...props }) => {
  if (large) {
    return <LargeStatusTag {...props} />;
  }

  return <SmallStatusTag {...props} />;
};

export default StatusTag;
