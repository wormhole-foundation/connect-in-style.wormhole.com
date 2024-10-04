import React  from 'react';
import Editor from 'react-simple-code-editor';
import { WormholeConnectConfig, WormholeConnectPartialTheme } from '@wormhole-foundation/wormhole-connect';
import { highlight, languages } from 'prismjs';
import { makeStyles } from 'tss-react/mui';
import './editor.css'; //Example style, you can use another
import { WORMHOLE_PURPLE_SUBTLE } from '../consts';

const useStyles = makeStyles()(() => {
  return {
    example: {
      fontSize: '12px',
      background: 'transparent',
      border: `1px solid ${WORMHOLE_PURPLE_SUBTLE}`,
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%',
      fontFamily: 'monospace',
      color: 'white',
    },
  }
});



export default (props: { config: WormholeConnectConfig, configCode: string, theme: WormholeConnectPartialTheme, type: string }) => {
  const styles = useStyles();

  return <>
    <Editor
      className={styles.classes.example}
      value={generateOutputCode(props.config, props.configCode, props.theme, props.type)}
      padding={5}
      highlight={code => highlight(code, languages.js, 'tsx')}
      onValueChange={() => {}}
    />
  </>
}

const potentialImports = [
  'DEFAULT_ROUTES',
  'MayanRoute',
  'MayanRouteSWIFT',
  'MayanRouteMCTP',
  'MayanRouteWH',
  'nttRoutes',
  'CCTPRoute',
  'AutomaticCCTPRoute',
  'TokenBridgeRoute',
  'AutomaticTokenBridgeRoute',
];

const generateOutputCode = (config: WormholeConnectConfig, configCode: string, theme: WormholeConnectPartialTheme, type: string): string => {

  const packageImports: string[] = [];
  packageImports.push('WormholeConnectConfig');

  for (const imp of potentialImports) {
    if (configCode.includes(imp)) {
      packageImports.push(imp);
    }
  }

return `import WormholeConnect, { ${packageImports.join(', ')} } from '@wormhole-foundation/wormhole-connect';

const config: WormholeConnectConfig = ${configCode};

<WormholeConnect config={config} />
`
}

