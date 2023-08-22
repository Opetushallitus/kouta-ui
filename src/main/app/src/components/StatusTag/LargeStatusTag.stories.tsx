import React from 'react';

import LargeStatusTag from './LargeStatusTag';

export default {
  title: 'LargeStatusTag',
};

export const Basic = () => <LargeStatusTag status="julkaistu" />;

export const WithStatus = () => (
  <>
    <LargeStatusTag status="julkaistu" />
    <LargeStatusTag status="tallennettu" />
    <LargeStatusTag status="arkistoitu" />
  </>
);

WithStatus.storyName = 'With status';

export const WithCustomLabel = () => <LargeStatusTag>Foo bar</LargeStatusTag>;

WithCustomLabel.storyName = 'With custom label';
