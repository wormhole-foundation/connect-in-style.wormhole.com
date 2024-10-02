import React, { ReactElement, useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import './editor.css'; //Example style, you can use another
import * as prettier from 'prettier';
import parserTypeScript from "prettier/plugins/typescript";
import parserEstree from "prettier/plugins/estree";

import { Alert, Box, Grid, Typography, Button } from '@mui/material';

import WormholeConnect, {
  WormholeConnectConfig,
  /* @ts-ignore */
  DEFAULT_ROUTES,
  /* @ts-ignore */
  nttRoutes,
  /* @ts-ignore */
  AutomaticTokenBridgeRoute,
  /* @ts-ignore */
  AutomaticCCTPRoute,
  /* @ts-ignore */
  TokenBridgeRoute,
  /* @ts-ignore */
  CCTPRoute,
  /* @ts-ignore */
  MayanRoute,
  /* @ts-ignore */
  MayanRouteWH,
  /* @ts-ignore */
  MayanRouteMCTP,
  /* @ts-ignore */
  MayanRouteSWIFT,
}  from '@wormhole-foundation/wormhole-connect';
import { makeStyles } from 'tss-react/mui';

const WORMHOLE_PURPLE = 'rgb(192, 186, 245)';
const WORMHOLE_PURPLE_SUBTLE = 'rgb(192, 186, 245, 0.5)';

interface ConfigSuggestion {
  text: ReactElement;
  example: string;
}

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
      minHeight: '200px',
      fontFamily: 'monospace',
      color: 'white',
    },
    example: {
      background: 'transparent',
      border: `1px solid ${WORMHOLE_PURPLE_SUBTLE}`,
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      fontFamily: 'monospace',
      color: 'white',
    },
    smolCode: {
      borderRadius: '3px',
      padding: '2px',
      background: WORMHOLE_PURPLE_SUBTLE,
    }
  }
});

export default () => {

  const styles = useStyles();

  const [configCode, setConfigCode] = useState('{}');
  const [editingConfig, setEditingConfig] = useState(false);
  const [config, setConfig] = useState<WormholeConnectConfig >({});
  const [configErr, setConfigErr] = useState<string | undefined >(undefined);
  const [configSuggestions, setConfigSuggestions] = useState<ConfigSuggestion[]>([]);
  const [nonce, setNonce] = useState(1);

  // Parse user's config and handle any errors
  useEffect(() => {
    if (editingConfig) return;

    // Using ts-ignore on these because TypeScript is confused
    // (They are meant to be used by the code passed into eval() below)
    /* @ts-ignore */
    window.DEFAULT_ROUTES = DEFAULT_ROUTES;
    /* @ts-ignore */
    window.nttRoutes = nttRoutes;
    /* @ts-ignore */
    window.AutomaticTokenBridgeRoute = AutomaticTokenBridgeRoute;
    /* @ts-ignore */
    window.AutomaticCCTPRoute = AutomaticCCTPRoute;
    /* @ts-ignore */
    window.TokenBridgeRoute = TokenBridgeRoute;
    /* @ts-ignore */
    window.CCTPRoute = CCTPRoute;
    /* @ts-ignore */
    window.MayanRoute = MayanRoute;
    /* @ts-ignore */
    window.MayanRouteWH = MayanRouteWH;
    /* @ts-ignore */
    window.MayanRouteMCTP = MayanRouteMCTP;
    /* @ts-ignore */
    window.MayanRouteSWIFT = MayanRouteSWIFT;


    const suggestions: ConfigSuggestion[] = [];

    try {
      const configEvaled = eval(`(${configCode || '{}'})`);
      setConfig(configEvaled);
      // buildConfig(configEvaled);
      setConfigErr(undefined);
      setNonce(nonce+1);

      if (!configEvaled.rpcs) {
        suggestions.push({
          text: <>Connect requires RPC endpoints to work well. Add these as <code className={styles.classes.smolCode}>rpcs</code>.</>, 
          example: `{
  rpcs: {
    Solana: "https://...",
    Ethereum: "https://...",
  }
}`,
        });
      }
    } catch (e: any) {
      setConfigErr(e.toString());
    }


    setConfigSuggestions(suggestions);
  }, [editingConfig]);

  console.log(config, nonce);

  /* @ts-ignore */
  const configWithCacheBust = { ...config, cacheBust: nonce };

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
            { <WormholeConnect config={configWithCacheBust} key={nonce} /> }
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
              //configCode === '{}' ? null :
              configErr ? 
                <Alert severity="error">Error parsing config: {configErr}</Alert> : 
              configSuggestions.length === 0 ?
                <Alert severity="success">Config is valid</Alert>:
              configSuggestions.map((suggestion) => <Suggestion {...suggestion} />)
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

const Suggestion = (props: ConfigSuggestion) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return <><Alert
    severity="warning"
    action={
      <Button sx={{padding: '4px', marginLeft: '16px'}} onClick={() => { setOpen(!open) }} variant="outlined">{open ? 'Hide' : 'Show'} example</Button>
    }
  >
    {props.text}
  </Alert>
  {
    open ? <Editor
      className={styles.classes.example}
      value={props.example}
      highlight={code => highlight(code, languages.js, 'js')}
      onValueChange={() => {}}
    /> : null
  }
  </> 
};
