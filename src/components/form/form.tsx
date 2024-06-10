import { CSSProperties, createContext, useEffect, useState } from 'react';
import { FormGroup, Button, Stack } from '@mui/material';

interface Props {
    submitText: string,
    handleSubmit: any,
    style?: CSSProperties,
    children?: any
}

export const FormContext = createContext({ 
    errors: {}, 
    setErrors: (prev: object) => {},
    values: {},
    setValues: (_) => {} 
});

export default function Form({ handleSubmit, submitText, style, children }: Props) {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({});
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(Object.values(errors).includes(true));
    }, [errors])
    useEffect(() => {
        // console.log(values);
    }, [values])
    
    // Event handler to handle form submission
    const onSubmit = (event) => {
        event.preventDefault()
        console.log(event);
        if (!hasError) {
            handleSubmit(values);
        }
    };
    
    return(
        <FormContext.Provider value={{ errors, setErrors, values, setValues }}>
            <form onSubmit={onSubmit} style={style}>
                {/* <FormGroup> */}
                    <Stack spacing={2} style={{paddingTop: '20px'}}>
                        {children}
                        <Button type="submit" disabled={hasError} variant="outlined">{submitText}</Button>
                    </Stack>
                {/* </FormGroup> */}
            </form>
        </FormContext.Provider>
    );
}