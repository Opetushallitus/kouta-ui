import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Anchor from '../Anchor';

export default function LocalLink(props) {
  return <RouterLink component={Anchor} {...props}></RouterLink>;
}
