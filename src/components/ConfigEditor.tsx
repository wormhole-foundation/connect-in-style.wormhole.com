import Editor from 'react-simple-code-editor';
import React, { ReactElement, useState, useEffect } from 'react';
import { highlight, languages } from 'prismjs';
import './editor.css'; //Example style, you can use another
import parserTypeScript from "prettier/plugins/typescript";
import parserEstree from "prettier/plugins/estree";

import { Alert, Button  } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import * as prettier from 'prettier';

import {
  WormholeConnectConfig,
  buildConfig,
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

const WORMHOLE_PURPLE_SUBTLE = 'rgb(192, 186, 245, 0.5)';

const useStyles = makeStyles()(() => {
  return {
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
    },
  }
});

interface ConfigSuggestion {
  text: ReactElement;
  example: string;
}

export default (props: { onChange: (config: WormholeConnectConfig) => void }) => {
  const [configCode, setConfigCode] = useState('{}');
  const [editingConfig, setEditingConfig] = useState(false);
  const [configErr, setConfigErr] = useState<string | undefined>(undefined);
  const [configSuggestions, setConfigSuggestions] = useState<ConfigSuggestion[]>([]);

  const styles = useStyles();

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
      buildConfig(configEvaled);

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

      props.onChange(configEvaled);
      setConfigErr(undefined);
    } catch (e: any) {
      setConfigErr(e.toString());
    }


    setConfigSuggestions(suggestions);
  }, [editingConfig]);




  return <>
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
      configCode === '{}' ? null :
      configErr ? 
        <Alert severity="error">Error parsing config: {configErr}</Alert> : 
      configSuggestions.length === 0 ?
        <Alert severity="success">Config is valid</Alert>:
      configSuggestions.map((suggestion) => <Suggestion {...suggestion} />)
    }
  </>
}

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



