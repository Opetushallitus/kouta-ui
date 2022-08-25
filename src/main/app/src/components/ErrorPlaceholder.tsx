import React from "react";

import _ from 'lodash';

import {useSubmitErrors} from "#/src/hooks/form";
import {FIELD_ERROR_CLASSNAME} from "#/src/constants";
import {getFieldNameWithoutLanguage} from "#/src/utils";
import FormHelperTextMulti from "#/src/components/FormHelperTextMulti";


export const ErrorPlaceholder = props => {
    const { name } = props;
    const errors = useSubmitErrors(null);
    const error = _.get(errors, name)
    const isError = !_.isNil(error);

    return (
        <div
            className={isError ? FIELD_ERROR_CLASSNAME : ''}
            data-testid={`form-control_${getFieldNameWithoutLanguage(name)}`}
        >
            <FormHelperTextMulti errorMessage={error}/>
        </div>
    );
}
