import React, { useState, useEffect, useMemo } from 'react';
import ColorPicker from './ColorPicker';

import {
  WormholeConnectTheme,
} from '@wormhole-foundation/wormhole-connect';

import { Radio, RadioGroup, FormControlLabel, Grid, Typography } from '@mui/material';

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

const loadCustomtheme = (mode: 'customDark' | 'customLight'): Required<WormholeConnectTheme> => {
  const key = `connect-editor:theme-${mode}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached);
  }

  return mode === 'customDark' ? DEFAULT_DARK : DEFAULT_LIGHT;
}

const saveCustomTheme = (mode: string, theme: WormholeConnectTheme) => {
  const key = `connect-editor:theme-${mode}`;
  localStorage.setItem(key, JSON.stringify(theme));
}

// 'DARK' and 'LIGHT' here refer to the built-in themes
export default (props: { onChange: (theme: WormholeConnectTheme) => void }) => {
  const [mode, setMode] = useState(localStorage.getItem('connect-editor:mode') ?? 'customDark');
  const [customDark, setCustomDark] = useState<Required<WormholeConnectTheme>>(loadCustomtheme('customDark'));
  const [customLight, setCustomLight] = useState<Required<WormholeConnectTheme>>(loadCustomtheme('customLight'));

  const theme: WormholeConnectTheme = useMemo(() => {
    switch (mode) {
      case 'dark': return { mode: 'dark' };
      case 'light': return { mode: 'light' }
      case 'customDark': return customDark;
      case 'customLight': return customLight;
    }
    return { mode: 'dark' }
  }, [mode, customDark, customLight]);

  useEffect(() => {
    saveCustomTheme(mode, theme);
    props.onChange(theme);
  }, [mode, customDark, customLight]);

  const updatethemeProperty = (mutation: (theme: WormholeConnectTheme) => void) => {
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
      updatethemeProperty((t) => { t.primary = val })
    } />

    <ColorPicker id="modal" label="Modal / Input" value={theme.input!} onChange={(val) =>
      updatethemeProperty((t) => { t.input = val })
    } />

    <ColorPicker id="badges" label="Chain Badges" value={theme.badge!} onChange={(val) =>
      updatethemeProperty((t) => { t.badge = val })
    } />

    <ColorPicker id="textPrimary" label="Text (Primary)" value={theme.text!} onChange={(val) =>
      updatethemeProperty((t) => { t.text = val })
    } />

    <ColorPicker id="textSecondary" label="Text (Secondary)" value={theme.textSecondary!} onChange={(val) =>
      updatethemeProperty((t) => { t.textSecondary = val })
    } />

    <ColorPicker id="error" label="Success" value={theme.success!} onChange={(val) =>
      updatethemeProperty((t) => { t.success = val })
    } />

    <ColorPicker id="error" label="Error" value={theme.error!} onChange={(val) =>
      updatethemeProperty((t) => { t.error = val })
    } />
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
        <ColorPicker id="error" label="Background Preview" value={theme.error!} onChange={(val) =>
          updatethemeProperty((t) => { t.error = val })
        } />
      </Grid>
    </Grid>

  </>
}
