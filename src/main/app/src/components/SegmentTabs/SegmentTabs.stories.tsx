import React, { useState } from 'react';

import { SegmentTab } from '#/src/components/SegmentTab';

import { SegmentTabs } from './index';

export default {
  title: 'SegmentTabs',
};

export const Basic = () => {
  const [val, setVal] = useState<'a' | 'b' | 'c'>('a');
  return (
    <SegmentTabs value={val}>
      <SegmentTab value="a" onClick={() => setVal('a')}>
        Tab A
      </SegmentTab>
      <SegmentTab value="b" onClick={() => setVal('b')}>
        Tab B
      </SegmentTab>
      <SegmentTab value="c" onClick={() => setVal('c')}>
        Tab C
      </SegmentTab>
    </SegmentTabs>
  );
};
