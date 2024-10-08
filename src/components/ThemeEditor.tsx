import React, { useState, useEffect, useMemo } from 'react';
import ColorPicker from './ColorPicker';

import { useCachedState } from '../utils';

import {
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

import { Radio, RadioGroup, FormControlLabel, Grid, Typography, Input } from '@mui/material';

const DEFAULT_DARK: Required<WormholeConnectTheme> = {
  mode: 'dark',
  input: '#181a2d',
  primary: '#9E77ED',
  secondary: '#667085',
  text: '#ffffff',
  textSecondary: '#79859e',
  error: '#F04438',
  success: '#12B76A',
  badge: '#010101',
  font: '"Inter", sans-serif'
};

const DEFAULT_LIGHT: Required<WormholeConnectTheme> = {
  mode: 'light',
  input: '#ffffff',
  primary: '#898b91',
  secondary: '#9e9e9e',
  text: '#212121',
  textSecondary: '#424242',
  error: '#f44336',
  success: '#4caf50',
  badge: '#E5E8F2',
  font: '"Inter", sans-serif'
};

// 'DARK' and 'LIGHT' here refer to the built-in themes
export default (props: { onChange: (theme: WormholeConnectTheme, bg: string) => void }) => {
  const [mode, setMode] = useState(localStorage.getItem('connect-editor:mode') ?? 'customDark');
  const isDark = mode === 'dark' || mode === 'customDark';
  const [customDark, setCustomDark] = useCachedState<Required<WormholeConnectTheme>>(
    'connect-editor:theme-customDark',
    DEFAULT_DARK,
    { serialize: JSON.stringify, deserialize: JSON.parse },
  );
  const [customLight, setCustomLight] = useCachedState<Required<WormholeConnectTheme>>(
    'connect-editor:theme-customLight',
    DEFAULT_LIGHT,
    { serialize: JSON.stringify, deserialize: JSON.parse },
  );
  const [previewBgDark, setPreviewBgDark] = useCachedState<string>('connect-editor:preview-bg-dark', '#000000');
  const [previewBgLight, setPreviewBgLight] = useCachedState<string>('connect-editor:preview-bg-dark', '#ffffff');

  const [theme, previewBg] = useMemo(() => {
    switch (mode) {
      case 'dark': return [{ mode: 'dark' }, previewBgDark];
      case 'light': return [{ mode: 'light' }, previewBgLight]
      case 'customDark': return [customDark, previewBgDark];
      case 'customLight': return [customLight, previewBgLight];
    }
    return [{ mode: 'dark' }, previewBg]
  }, [mode, customDark, customLight]);

  useEffect(() => {
    props.onChange(theme, isDark ? previewBgDark : previewBgLight);
  }, [mode, customDark, customLight, previewBgDark, previewBgLight]);

  const updateThemeProperty = (mutation: (theme: WormholeConnectTheme) => void) => {
    const t = JSON.parse(JSON.stringify(theme));
    mutation(t);
    if (mode === 'customDark') {
      setCustomDark(t);
    } else if (mode === 'customLight') {
      setCustomLight(t);
    }
  };

  const colorPickers = theme.primary !== undefined ? <>
    <ColorPicker id="primary" label="Primary" value={theme.primary} onChange={(val) =>
      updateThemeProperty((t) => { t.primary = val })
    } />

    <ColorPicker id="modal" label="Modal / Input" value={theme.input!} onChange={(val) =>
      updateThemeProperty((t) => { t.input = val })
    } />

    <ColorPicker id="badges" label="Chain Badges" value={theme.badge!} onChange={(val) =>
      updateThemeProperty((t) => { t.badge = val })
    } />

    <ColorPicker id="textPrimary" label="Text (Primary)" value={theme.text!} onChange={(val) =>
      updateThemeProperty((t) => { t.text = val })
    } />

    <ColorPicker id="textSecondary" label="Text (Secondary)" value={theme.textSecondary!} onChange={(val) =>
      updateThemeProperty((t) => { t.textSecondary = val })
    } />

    <ColorPicker id="error" label="Success" value={theme.success!} onChange={(val) =>
      updateThemeProperty((t) => { t.success = val })
    } />

    <ColorPicker id="error" label="Error" value={theme.error!} onChange={(val) =>
      updateThemeProperty((t) => { t.error = val })
    } />

    <Input value={theme.font} onChange={(e) => {
      updateThemeProperty((t) => { t.font = e.target.value })
    }} />
    Font
  </> : null;

  return <>
    <RadioGroup
      row
      value={mode}
      onChange={(e: any) => {
        setMode(e.target.value);
        localStorage.setItem('connect-editor:mode', e.target.value);
      }}
      sx={{ mb: 2 }}
    >
      <FormControlLabel
        value="customDark"
        control={<Radio />}
        label="Dark"
      />
      <FormControlLabel
        value="customLight"
        control={<Radio />}
        label="Light"
      />
      <FormControlLabel
        value="dark"
        control={<Radio />}
        label="Dark (Built-in)"
      />
      <FormControlLabel
        value="light"
        control={<Radio />}
        label="Light (Built-in)"
      />
    </RadioGroup>

    <Grid container spacing={2}>
      <Grid item xs={6} >
        { colorPickers }
      </Grid>
      <Grid item xs={6} >
        <Typography>
          Change to match your application:
        </Typography>
        <ColorPicker id="error" label="Background Preview" value={isDark ? previewBgDark : previewBgLight} onChange={(val) => {
          if (isDark) {
            setPreviewBgDark(val);
          } else {
            setPreviewBgLight(val);
          }
        }} />
      </Grid>
    </Grid>

  </>
}
