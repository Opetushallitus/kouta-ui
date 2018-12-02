import React, {Component} from 'react';
import {updateSingleSelectionOptionActivation} from '../utils/optionListUtils';

export class DropdownFilterSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            expanded: false,
            tags: props.tags || []
        };
    }

    getControlIcon = () => this.state.expanded ? 'arrow_drop_down' : 'arrow_drop_up';

    getFilter = () => this.state.filter || '';

    getOptions = () => this.props.options;

    getPlaceholder = () => this.props.placeholder || 'Valitse...';

    setFilter = (event) => this.setState({
        ...this.state,
        filter: event.target.value,
        expanded: true
    });

    supportsTags = () => this.props.maxTags && this.props.maxTags > 0;

    getFilteredOptions = () => (this.props.options || []).filter(option => option.label.toLowerCase().includes(this.getFilter().toLowerCase()));

    getTags = () => this.props.tags || this.state.tags || [];

    getLabel = () => this.props.label;

    selectOption = (event) => this.selectOptionByKey(event.target.getAttribute('data-id'));

    findOptionByKey = (key) => this.getOptions().find(option => option.key === key);

    hasTagWithKey = (key) => this.getTags().find(tag => tag.key === key);

    addTagByKey = (key) => this.hasTagWithKey(key) ? this.getTags() : this.getTags().concat([{...this.findOptionByKey(key)}]);

    selectOptionByKey = (key) => key && this.setState({
        filter: '',
        expanded: false,
        tags: this.addTagByKey(key)
    }, () => this.props.onSelect(
        updateSingleSelectionOptionActivation(this.props.options, {
            key,
            active: true
        })
    ));

    getKeyFromFirstFilteredOption = () => (this.getFilteredOptions().shift() || {}).key;

    selectOnEnterKey = (event) => event.keyCode === 13 && this.selectOptionByKey(this.getKeyFromFirstFilteredOption());

    toggleExpanded = () => this.setState({
        ...this.state,
        expanded: !this.state.expanded
    });

    renderOption = (option, index) => (
        <li key={index} className={'option-li'} data-id={option.key} onClick={this.selectOption}>
            {option.label}
        </li>
    );

    renderOptionList = () => this.state.expanded && (
        <div className={'options-container'}>
            <ul className={'options-list'}>
                {this.getFilteredOptions().map(this.renderOption)}
            </ul>
        </div>
    );

    removeTag = (key) => this.setState({
        ...this.state,
        tags: this.getTags().filter(tag => tag.key !== key)
    })

    renderTag = (option, index) => (
        <div key={index} className={'tag'}>
            <span>{option.label}</span>
            <div className={'remove-button'} onClick={() => this.removeTag(option.key)}>
                <i className={'material-icons'}>clear</i>
            </div>
        </div>
    );

    renderTags = () => this.supportsTags() && (
        <div className={'tags-container'}>
            {this.getTags().map(this.renderTag)}
        </div>
    );

    render = () => (
        <div className={'dropdown-filter-selector'}>
            <span className={'label-span'}>
                {this.getLabel()}
            </span>
            <div className={'controls'}>
                <input type={'text'} value={this.getFilter()} onChange={this.setFilter}
                       onKeyDown={this.selectOnEnterKey} placeholder={this.getPlaceholder()}/>
                <div className={'expand-button'}>
                    <i className="material-icons" onClick={this.toggleExpanded}>{this.getControlIcon()}</i>
                </div>
            </div>
            {this.renderOptionList()}
            {this.renderTags()}
        </div>
    );
}
