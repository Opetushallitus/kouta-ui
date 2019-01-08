import React, {Component} from 'react';

export class Tag extends Component {

    getLabel = () => this.props.label;

    getIcon = () => this.props.icon || 'clear';

    render = () => (
        <div className={'tag'} onClick={this.props.onClick}>
            <span>{this.getLabel()}</span>
            <div className={'remove-button'}>
                <i className={'material-icons'}>{this.getIcon()}</i>
            </div>
        </div>
    );

}
