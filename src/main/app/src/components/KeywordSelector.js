import React, {Component} from 'react';

export class KeywordSelector extends Component {

    constructor(props) {
        super(props);
        this.searchKeywords = this.props.searchKeywords.bind(this);
        this.listKeywords = this.props.listKeywords.bind(this);
        this.addKeyword = this.props.addKeyword.bind(this);
        this.deleteKeyword = this.props.deleteKeyword.bind(this);
        this.state = {
            searchResult: [],
            selected: false,
            keywords: this.props.listKeywords() ? this.props.listKeywords() : []
        };
    }

    addNewKeyword = (event) => {
        if(event.key === 'Enter') {
            this.props.addKeyword(event.target.value);
            this.setState({
                ...this.state,
                selected: true,
                keywords: this.props.listKeywords()
            });
        }
    };

    selectOption = (event) => {
        this.props.addKeyword(event.target.attributes.arvo.value);
        this.setState({
            ...this.state,
            selected: true,
            keywords: this.props.listKeywords()
        });
    };

    deleteOption = (event) => {
        this.props.deleteKeyword(event.target.attributes.arvo.value);
        this.setState({
            ...this.state,
            keywords: this.props.listKeywords()
        });
    };

    renderOption = (option) => (
        <li key={option} arvo={option} className={"option-li"} data-id={option.id} onClick={this.selectOption}>
            {option}
        </li>
    );

    renderSearchResult = () => {
        return this.state.searchResult && this.state.searchResult.length > 0  && !this.state.selected ? (
            <div className={"options-container"}>
                <ul className={"options-ul"}>
                    {this.state.searchResult.map(this.renderOption)}
                </ul>
            </div>
        ) : null;
    };

    findOptions = (event) => {
        this.searchKeywords(event.target.value, (result) => {
            this.setState({
                ...this.state,
                searchResult: result,
                selected: false
            });
        });
    };

    renderKeyword = (arvo) => (
        <div key={arvo} className={"selected-keyword"}>{arvo} <span arvo={arvo} onClick={this.deleteOption}>x</span></div>);

    renderKeywords = () => (
        this.state.keywords.map(k => this.renderKeyword(k.arvo)));

    render = () => {
        return <div className={"keyword-selector"}>
            <span>{this.props.header}</span>
            <input type={"text"} className={"filter-input"} placeholder={this.props.info}
                   onChange={this.findOptions} onKeyPress={this.addNewKeyword}></input>
            {this.renderSearchResult()}
            {this.renderKeywords()}
        </div>
    }
}