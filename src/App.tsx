import React, { useState, useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Tab from './components/Tab';
import ThemeEditor from './components/ThemeEditor';
import ConfigEditor from './components/ConfigEditor';

import WormholeConnect, { WormholeConnectConfig, WormholeConnectPartialTheme, dark } from '@wormhole-foundation/wormhole-connect';

import { WORMHOLE_PURPLE } from './consts';

const useStyles = makeStyles()(() => {
  return {
    wormbin: {
      padding: '20px',
      borderRadius: '10px',
      border: `1px solid ${WORMHOLE_PURPLE}`,
    }
  }
});

const getInitialTheme = () => {
  const cached = localStorage.getItem('connect-editor:theme')
  if (cached) {
    return JSON.parse(cached);
  }
  return dark;
};

export default () => {

  const styles = useStyles();

  const [config, setConfig] = useState<WormholeConnectConfig >({});
  const [nonce, setNonce] = useState(1);

  const [editorTab, setEditorTab] = useState<'config' | 'theme'>('config');

  const [theme, setTheme] = useState<WormholeConnectPartialTheme>(getInitialTheme());

  /* @ts-ignore */
  const configWithCacheBust = useMemo(() => {
    return { ...config, cacheBust: nonce }
  }, [config]);

  return (
    <Box padding={5}>
      <Box marginBottom={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wormhole Connect - Integrator Tool
        </Typography>
        <Typography>
          Customize your theme and validate your config to tailor Wormhole Connect exactly to your needs.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6} >
          <Box className={styles.classes.wormbin} sx={{
            background: theme.mode === 'dark' ? 'black' : 'white'
          }}>
            <WormholeConnect config={configWithCacheBust} theme={theme} key={nonce} />
          </Box>
        </Grid>
        <Grid item xs={6}>

          <Tab label="Config" selected={editorTab === 'config'} onClick={() => {setEditorTab('config')}} />
          <Tab label="Theme" selected={editorTab === 'theme'} onClick={() => {setEditorTab('theme')}} />
          
          <Box className={styles.classes.wormbin}>

            {
              editorTab === 'config' ?
              <ConfigEditor onChange={(config) => {
                setConfig(config);
                setNonce(nonce+1);
              }} /> :
              <ThemeEditor onChange={(theme: WormholeConnectPartialTheme) => {
                setTheme(theme);
                localStorage.setItem('connect-editor:theme', JSON.stringify(theme));
              }} />
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
