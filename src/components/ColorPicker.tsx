import React from 'react';
import { Box, TextField } from '@mui/material';

export default (props: { id: string, label: string, value: string, onChange: (color: string) => void }) => {
  if (!props.value) {
    throw new Error('no color');
  }

  return <Box display="flex" sx={{alignItems: 'center'}}>
    <input style={{height:'40px', marginRight: '10px'}} id={props.id} type="color" value={props.value} onChange={(e: any) => {
      props.onChange(e.target.value);
    }} />

    <TextField variant="standard" sx={{width: '80px'}} value={props.value} onChange={(e) => props.onChange(e.target.value)} />

    <label style={{marginRight: '14px', cursor: 'pointer'}} htmlFor={props.id}>{props.label}</label>
  </Box>
}
