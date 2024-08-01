import ValidationError from '../error/validation_error';
import {unbundle} from '../util/unbundle_jsonlint';

import type {ValidationOptions} from './validate';

export default function validateEnum(options: ValidationOptions): Array<ValidationError> {
    const key = options.key;
    const value = options.value;
    const valueSpec = options.valueSpec;
    const errors = [];

    if (Array.isArray(valueSpec.values)) { // <=v7
        if (valueSpec.values.indexOf(unbundle(value)) === -1) {
            errors.push(new ValidationError(key, value, `expected one of [${valueSpec.values.join(', ')}], ${JSON.stringify(value)} found`));
        }
    } else { // >=v8
        // @ts-expect-error - TS2345 - Argument of type 'unknown' is not assignable to parameter of type 'string'.
        if (Object.keys(valueSpec.values).indexOf(unbundle(value)) === -1) {
            errors.push(new ValidationError(key, value, `expected one of [${Object.keys(valueSpec.values).join(', ')}], ${JSON.stringify(value)} found`));
        }
    }
    return errors;
}
