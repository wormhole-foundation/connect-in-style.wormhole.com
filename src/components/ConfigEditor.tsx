import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import './editor.css'; //Example style, you can use another
import parserTypeScript from "prettier/plugins/typescript";
import parserEstree from "prettier/plugins/estree";

import { Box, Button, Typography  } from '@mui/material';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { makeStyles } from 'tss-react/mui';
import * as prettier from 'prettier';
import { WORMHOLE_PURPLE_SUBTLE } from '../consts';

const LOCAL_STORAGE_KEY = 'connect-editor:config-code';

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
      color: '#268bd2',
      borderRadius: '3px',
      padding: '2px',
    },
  }
});

const formatCode = async (code): Promise<string> => {
  return prettier.format(code, {
    semi: false,
    parser: "typescript",
    trailingComma: 'none',
    plugins: [parserTypeScript, parserEstree]
  })
}

export default (props: { onChange: (config: WormholeConnectConfig, code: string) => void }) => {
  const [config, setConfig] = useState<WormholeConnectConfig>({});
  const [configCode, setConfigCode] = useState('');
  const [editingConfig, setEditingConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [configErr, setConfigErr] = useState<string | undefined>(undefined);

  useEffect(() => {
    const initialCode = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}';

    formatCode(initialCode).then(setConfigCode).catch(() => {
      setConfigCode(initialCode);
    });

    setLoading(false);
  }, []);

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

    try {
      const configEvaled = eval(`(${configCode || '{}'})`);
      validateConfig(configEvaled);
      buildConfig(configEvaled);

      setConfig(configEvaled);
      props.onChange(configEvaled, configCode);
      setConfigErr(undefined);

      if (configCode !== '') {
        localStorage.setItem(LOCAL_STORAGE_KEY, configCode);
      }
    } catch (e: any) {
      setConfigErr(e.toString());
    }

  }, [editingConfig, loading]);


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
        formatCode(configCode).then(setConfigCode);
      }}
      highlight={code => highlight(code, languages.js, 'js')}
      padding={10}
    >
    </Editor>

    {
      configErr ? 
        <Typography margin="10px 0" variant="h6" color="error.main">{configErr}</Typography> :
        <Typography margin="10px 0" variant="h6" color="success.main">Config is valid</Typography>
    }

    <CommonProperties config={config} />
  </>
}

interface CommonPropertyData {
  key: string;
  description: string;
  example: string;
}

const COMMON_PROPERTIES: CommonPropertyData[] = [
  {
    key: 'rpcs',
    description: `RPC endpoints for the chains you're using Connect for`,
    example: `{
  rpcs: {
    Solana: 'https://...',
    Ethereum: 'https://...'
  }
}`
  },
  {
    key: 'routes',
    description: `Which routes/protocols you want Connect to choose from`,
    example: `{
  routes: [
    ...DEFAULT_ROUTES,
    MayanRoute,
    nttRoutes(myNttConfig),
  ]
}`
  },
  {
    key: 'chains',
    description: `Whitelist of chains you want Connect to offer`,
    example: `{
  chains: ['Solana', 'Base', 'Polygon']
}`

  },
  {
    key: 'tokensConfig',
    description: `Arbitrary tokens you want to add to Connect`,
    example: `{
  tokensConfig: {
    WIF: {
      key: "WIF",
      symbol: "WIF",
      nativeChain: "Solana",
      tokenId: {
        chain: "Solana",
        address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      },
      icon: "https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link",
      coinGeckoId: "dogwifcoin",
      decimals: 6,
    }
  }
}`,
  },
];

const CommonProperties = (props: { config: WormholeConnectConfig}) => {

  return <Box>

    <Typography variant="h6" >Common config properties</Typography>

    {
      COMMON_PROPERTIES.map((data) => <CommonProperty data={data} config={props.config} />)
    }
    </Box>
}


const CommonProperty = (props: { config: WormholeConnectConfig, data: CommonPropertyData }) => {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  return (
    <>
      <Box display="flex" alignItems="center" margin="5px 0">
        {props.config[props.data.key] !== undefined ?
          <CheckBoxOutlinedIcon fontSize="small" color="success" /> :
          <CheckBoxOutlineBlankOutlinedIcon  fontSize="small" color="primary" />
        }
        <code className={styles.classes.smolCode}>{props.data.key}</code> - {props.data.description}

        <Button sx={{marginLeft: 'auto', padding: '2px'}} onClick={() => setOpen(!open)}>Example</Button>

      </Box>
      {
        open && <Editor
          className={styles.classes.example}
          value={props.data.example}
          highlight={code => highlight(code, languages.js, 'js')}
          onValueChange={() => {}}
        /> 
      }
    </>
  )
};

const validateConfig = (config: WormholeConnectConfig) => {
  if (config.routes?.length === 0) {
    throw new Error(`Routes list is empty. Connect needs at least one route.`);
  }
  if (config.chains && config.chains.length < 2) {
    throw new Error(`Chains list too short. Connect needs at least two chains.`);
  }
}
