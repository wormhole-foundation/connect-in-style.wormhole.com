import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import './editor.css'; //Example style, you can use another
import * as prettier from 'prettier';
import parserTypeScript from "prettier/plugins/typescript";
import parserEstree from "prettier/plugins/estree";

import { Alert, Box, Grid, Typography } from '@mui/material';

import WormholeConnect, {WormholeConnectConfig}  from '@wormhole-foundation/wormhole-connect';
import { makeStyles } from 'tss-react/mui';

const WORMHOLE_PURPLE = 'rgb(192, 186, 245)';
const WORMHOLE_PURPLE_SUBTLE = 'rgb(192, 186, 245, 0.5)';


const useStyles = makeStyles()(() => {
  return {
    wormbin: {
      padding: '20px',
      borderRadius: '10px',
      border: `1px solid ${WORMHOLE_PURPLE}`,
    },
    config: {
      background: 'transparent',
      border: `1px solid ${WORMHOLE_PURPLE_SUBTLE}`,
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: '300px',
      fontFamily: 'monospace',
      color: 'white',
    }
  }
});

export default () => {

  const styles = useStyles();

  const [configCode, setConfigCode] = useState('{}');
  const [editingConfig, setEditingConfig] = useState(false);
  const [config, setConfig] = useState<WormholeConnectConfig >({});
  const [configErr, setConfigErr] = useState<string | undefined >(undefined);
  const [nonce, setNonce] = useState(1);
  const [hideConnect, setHideConnect] = useState(false);

  useEffect(() => {
    if (editingConfig) return;

    try {
      const configEvaled = eval(`(${configCode || '{}'})`);
      setConfig(configEvaled);
      setConfigErr(undefined);
      setNonce(nonce+1);
      setHideConnect(true);
      setTimeout(() => {
        setHideConnect(false);
      }, 10);
    } catch (e: any) {
      setConfigErr(e.toString());
    }
  }, [editingConfig]);

  console.log(config, nonce);

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
          <Typography color={WORMHOLE_PURPLE} marginLeft={1}>Preview</Typography>
          <Box className={styles.classes.wormbin}>
            { <WormholeConnect config={{...config, cacheBust: nonce}} key={nonce} /> }
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography color={WORMHOLE_PURPLE} marginLeft={1}>Config</Typography>
          <Box className={styles.classes.wormbin}>
            <Editor
              className={styles.classes.config}
              value={configCode}
              onValueChange={code => {
                setConfigCode(code)
              }}
              onFocus={() => setEditingConfig(true)}
              onBlur={() => {
                setEditingConfig(false);
                prettier.format(configCode, {
                  semi: false,
                  parser: "typescript",
                  plugins: [parserTypeScript, parserEstree]
                }).then(setConfigCode);
              }}
              highlight={code => highlight(code, languages.js, 'js')}
              padding={10}
            >
            </Editor>

            {
              editingConfig ? <Alert severity="info">Waiting for changes...</Alert> : 
              configErr ? 
                <Alert severity="error">Error parsing config: {configErr}</Alert> : 
                <Alert severity="success">Config is valid</Alert>
            }
          </Box>
          <Typography color={WORMHOLE_PURPLE} marginLeft={1} marginTop={4}>Theme</Typography>
          <Box className={styles.classes.wormbin}>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
