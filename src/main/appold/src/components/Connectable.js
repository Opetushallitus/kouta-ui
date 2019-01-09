import {Component} from 'react';

import {disconnectListener} from '../utils/stateUtils';

export class Connectable extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount = () => disconnectListener(this);

}
