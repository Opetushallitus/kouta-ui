import React from 'react';

import LargeStatusTag from './LargeStatusTag';

export default {
  title: 'LargeStatusTag',
};

export const Basic = () => <LargeStatusTag status="julkaistu" />;

export const WithStatus = {
  render: () => (
    <>
      <LargeStatusTag status="julkaistu" />
      <LargeStatusTag status="tallennettu" />
      <LargeStatusTag status="arkistoitu" />
    </>
  ),

  name: 'With status',
};

export const WithCustomLabel = {
  render: () => <LargeStatusTag>Foo bar</LargeStatusTag>,
  name: 'With custom label',
};
