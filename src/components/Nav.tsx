import {Link} from '@mui/material';
import {WORMHOLE_PURPLE} from '../consts';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => {
  return {
    nav: {
      listStyle: 'none',
      display: 'flex',
      justifyContent: 'end'
    },
    item: {
      display: 'inline-block',
      padding: '16px'
    },
    link: {
      textDecoration: 'none',
      color: WORMHOLE_PURPLE,
      '&:hover': {
        color: 'white'
      }
    }
  }
});

export default () => {
  const { classes } = useStyles();

  return <ul className={classes.nav}>
    <li className={classes.item}>
      <Link className={classes.link} target="_blank" href="https://github.com/wormhole-foundation/wormhole-connect">
        GitHub
      </Link>
    </li>
    <li className={classes.item}>
      <Link className={classes.link} target="_blank" href="https://www.npmjs.com/package/@wormhole-foundation/wormhole-connect">
        NPM
      </Link>
    </li>
    <li className={classes.item}>
      <Link className={classes.link} target="_blank" href="https://wormhole.com/docs/build/applications/connect/overview/">
        Documentation
      </Link>
    </li>
  </ul>
}
