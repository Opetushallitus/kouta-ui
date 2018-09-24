import React, {Component} from 'react';
import { observer, inject } from 'mobx-react';
import superagent from "superagent";

@inject("urlStore")
@observer
class TestiLaatikko extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        }
    }

    componentDidMount() {
        superagent
            .get(this.props.urlStore.urls.url('kouta-backend.base-url') + 'kouta-backend/healthcheck')
            .then((res) => {
                console.log(res);
                this.setState(res.body);
            })
    }


    render() {
        return (
            <div className={"laatikko"}>
                <h1>Koulutustarjonta</h1>
                {this.state.message && <h6>{this.state.message}</h6>}
            </div>
        )
    }
}

export default TestiLaatikko;