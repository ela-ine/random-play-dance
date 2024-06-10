import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { FormContext } from './form';

interface Props {
    label: string,
    initialValue: string,
    regex: RegExp,
    id: string,
    parse?: (parsed?: string[]) => any;
    style?: object
}

export default function FormField({ initialValue, label, regex, id, parse, style }: Props) {
    const { errors, setErrors, setValues } = useContext(FormContext);
    const [error, setError] = useState(false);

    useEffect(() => {
        validate(initialValue);
    }, []);

    useEffect(() => {
        if (id in errors) {
            setError(errors[id]);
        }
    }, [errors])

    const validate = (str: string) => {
        var parsed = str.match(regex)?.filter(x => !!x);
        if (parse && parsed) {
            parsed = parse(parsed);
        }
        setValues(prev => ({ ...prev, [id]: parsed }));

        var hasError = !regex.test(str);
        setError(hasError);
        setErrors(prev => ({ ...prev, [id]: hasError }));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        validate(event.target.value);
    };

    return(
        <TextField 
            label={label} 
            defaultValue={initialValue} 
            onChange={handleChange} 
            error={error}
            helperText={error ? 'input is invalid :(' : ''}
            size='small' 
            margin='normal'
            style={style} />
    )
}