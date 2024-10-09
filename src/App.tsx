import React, { useState, useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Tab from './components/Tab';
import ThemeEditor from './components/ThemeEditor';
import ConfigEditor from './components/ConfigEditor';
import OutputCode from './components/OutputCode';
import WormholeLogo from './components/Wormhole';
import Background from './components/Background';
import Nav from './components/Nav';

import { useCachedState } from './utils';

import WormholeConnect, { WormholeConnectConfig, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { OutputCodeType } from './types';

import { WORMHOLE_PURPLE } from './consts';

const useStyles = makeStyles()(() => {
  return {
    wormbin: {
      padding: '20px',
      borderRadius: '10px',
      border: `1px solid ${WORMHOLE_PURPLE}`,
      background: 'rgba(0,0,0,0.3)'
    },
    root: {
      zIndex: 2,
      padding: '20px',
      display: 'flex',
      justifyContent:'center',
      width: '100%'
    },
    content: {
      maxWidth: '1440px',
      width: '100%'
    },
    logo: {
      display: 'inline-block',
      marginRight: '8px'
    }
  }
});

export default () => {

  const styles = useStyles();

  const [config, setConfig] = useState<WormholeConnectConfig >({});
  const [configCode, setConfigCode] = useState<string >('{}');
  const [nonce, setNonce] = useState(1);

  const [editorTab, setEditorTab] = useCachedState<'config' | 'theme'>('connect-editor:editor-tab', 'config');
  const [outputCodeType, setOutputCodeType] = useState<OutputCodeType>('react');

  const [theme, setTheme] = useCachedState<WormholeConnectTheme>('connect-editor:theme', { mode: 'dark' }, {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  });
  const [previewBg, setPreviewBg] = useCachedState('connect-editor:previewBg', '#000000');

  /* @ts-ignore */
  const configWithCacheBust = useMemo(() => {
    return { ...config, cacheBust: nonce }
  }, [config]);

  return (<>
    <Background />
    <Box className={styles.classes.root}>
      <Box className={styles.classes.content}>
        <Box marginBottom={5}>

          <Grid container spacing={2}>
            <Grid item md={12} lg={6} >
              <Typography variant="h5" component="h1" gutterBottom sx={{
                fontWeight: 'bold'
              }}>
                <Box className={styles.classes.logo}><WormholeLogo /></Box> Connect - Integrator Tool
              </Typography>
              <Typography>
                Validate your config and customize your theme to tailor Wormhole Connect exactly to your needs.
              </Typography>
            </Grid>
            <Grid item md={12} lg={6} >
              <Nav />
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2}>
          <Grid item md={12} lg={6} >
            <Box className={styles.classes.wormbin} sx={{
              background: previewBg + '!important',
            }}>
              <WormholeConnect config={configWithCacheBust} theme={theme} key={nonce} />
            </Box>
          </Grid>
          <Grid item md={12} lg={6} display="flex" flexDirection="column" height="100%">
            <Box>
              <Tab label="Config" selected={editorTab === 'config'} onClick={() => {setEditorTab('config')}} />
              <Tab label="Theme" selected={editorTab === 'theme'} onClick={() => {setEditorTab('theme')}} />
              <Box className={styles.classes.wormbin} marginBottom={2}>
                {
                  editorTab === 'config' ?
                  <ConfigEditor onChange={(config, configCode) => {
                    setConfig(config);
                    setConfigCode(configCode);
                    setNonce(nonce+1);
                  }} /> :
                    <ThemeEditor onChange={(theme, previewBg) => {
                      setTheme(theme);
                      setPreviewBg(previewBg);
                    }} />
                }
              </Box>
            </Box>

            <Box>
              <Tab label="React Integration" selected={outputCodeType === 'react'} onClick={() => {setOutputCodeType('react')}} />
              <Tab label="Hosted Integration" selected={outputCodeType === 'hosted'} onClick={() => {setOutputCodeType('hosted')}} />

              <Box className={styles.classes.wormbin}>
                <OutputCode config={config} configCode={configCode} theme={theme} type={outputCodeType} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </>);
};
