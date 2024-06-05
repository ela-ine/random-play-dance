import { useState } from 'react';
import { FormGroup, TextField, Button } from '@mui/material';

export default function Submit({ label, initialValue, handleSubmit }) {
    const [val, setVal] = useState(initialValue || '');
    
    // Event handler to capture input value
    const handleInputChange = (event) => {
        setVal(event.target.value);
    };
    
    // Event handler to handle form submission
    const onSubmit = (event) => {
        event.preventDefault()
        console.log('onsubmit', event);
        handleSubmit(val);
        // setVal('');
    };
    
    return (
        // <div>
            <form onSubmit={onSubmit}>
                <FormGroup>
                    <TextField defaultValue={val} onChange={handleInputChange} label={label} size='small' margin='normal'></TextField>
                    <Button type="submit" variant="outlined">Submit</Button>
                </FormGroup>
                    {/* <label>{label}</label>
                    <input type="text" value={val} onChange={handleInputChange} /> */}
            </form>
        // </div>
    );
}