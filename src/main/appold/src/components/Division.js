import React, {Component} from 'react';

export class Division extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: props.expanded || true
        };
    }

    getLabel = () => this.props.label;

    isExpanded = () => this.state.expanded === true;

    getArrow = () => this.isExpanded() ? 'arrow_drop_down' : 'arrow_right';

    onHeaderClick = () => this.setState({
        ...this.state,
        expanded: !this.state.expanded
    });


    render = () => (
        <div className={'division'}>
            <div className={'division-header'} onClick={this.onHeaderClick}>
                <i className={'material-icons arrow-icon'}>{this.getArrow()}</i>
                <span className={'label'}>{this.getLabel()}</span>
            </div>
            {this.isExpanded() && this.props.children}
        </div>
    );
}
