import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { WORMHOLE_PURPLE } from '../consts';

const useStyles = makeStyles()(() => {
  return {
    tab: {
      display: 'inline',
      padding: '6px',
      borderRadius: '4px 4px 0 0',
      color: WORMHOLE_PURPLE,
      marginLeft: '10px',
      cursor: 'pointer',
      '&:hover': {
        background: WORMHOLE_PURPLE,
        color: 'black'
      }
    },
    tabSelected: {
      background: WORMHOLE_PURPLE,
      color: 'black',
    }
  }
});

export default (props: { label: string, selected: boolean, onClick: () => void }) => {
  const { classes } = useStyles();

  if (props.selected) {
    return <Box onClick={props.onClick} className={`${classes.tab} ${classes.tabSelected}`}>
      <Typography variant="h6" display="inline">{props.label}</Typography>
    </Box>
  } else {
    return <Box onClick={props.onClick} className={`${classes.tab}`}>
      <Typography variant="h6" display="inline">{props.label}</Typography>
    </Box>
  }
}

