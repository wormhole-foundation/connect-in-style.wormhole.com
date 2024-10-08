import React, { useState, useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Tab from './components/Tab';
import ThemeEditor from './components/ThemeEditor';
import ConfigEditor from './components/ConfigEditor';
import OutputCode from './components/OutputCode';

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
            background: previewBg,
          }}>
            <WormholeConnect config={configWithCacheBust} theme={theme} key={nonce} />
          </Box>
        </Grid>
        <Grid item xs={6} display="flex" flexDirection="column" height="100%">
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
  );
};
