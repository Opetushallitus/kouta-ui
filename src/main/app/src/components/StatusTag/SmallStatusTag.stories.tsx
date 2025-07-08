import React from 'react';

import SmallStatusTag from './SmallStatusTag';

export default {
  title: 'SmallStatusTag',
};

export const Basic = () => <SmallStatusTag status="julkaistu" />;

export const WithStatus = {
  render: () => (
    <>
      <SmallStatusTag status="julkaistu" />
      <SmallStatusTag status="tallennettu" />
      <SmallStatusTag status="arkistoitu" />
    </>
  ),

  name: 'With status',
};

export const WithCustomLabel = {
  render: () => <SmallStatusTag>Foo bar</SmallStatusTag>,
  name: 'With custom label',
};
