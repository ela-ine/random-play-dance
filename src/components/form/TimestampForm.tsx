import { Stack } from "@mui/material";
import FormField from "./FormField";
import { Timestamp } from "../common";
import { FormContext } from "./form";
import { useContext, useEffect } from "react";

interface Props {
    startId: string,
    endId: string,
    duration?: string
}

export default function TimestampForm({ startId, endId, duration }: Props) {
    const { values, setErrors } = useContext(FormContext);
    const timestampMatch = /\b([0-5]?[0-9]):([0-5][0-9]):([0-5][0-9]$)|([0-5]?[0-9]):([0-5][0-9]$)\b/;
    const style= {minWidth: '60px', maxWidth: '90px'}

    useEffect(() => {
        if (values[startId] && values[endId]) {
            const hasError = values[startId].seconds >= values[endId].seconds;
            setErrors(prev => ({...prev, [startId]: hasError, [endId]: hasError}))
        }
    }, [values])

    const timestampToSeconds = (timestamp: string[]) => {
        if (timestamp.length > 3) {
            throw new Error('timestamp parsing failed');
        }

        var result = 0;
        const seconds = [ 1, 60, 3600 ];
        timestamp.reverse().forEach((t, i) => result += parseInt(t) * seconds[i]);
        return result;
    }

    const parse = (timestamp: string[]) => {
        const t: Timestamp = {
            display: timestamp[0],
            seconds: timestampToSeconds(timestamp.slice(1)),
        }
        return t;
    }

    const TimestampField = (id: string, label: string, initialValue: string) => (
        <FormField id={id} label={label} initialValue={initialValue} regex={timestampMatch} parse={parse} style={style} />
    )

    return(
        <Stack direction='row' spacing={1}>
            {TimestampField(startId, 'start', '00:00')}
            {TimestampField(endId, 'end', duration || '00:01')}
        </Stack>
)}