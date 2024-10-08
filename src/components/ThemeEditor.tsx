import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import { ConnectTheme } from '../types';

import {
  WormholeConnectTheme,
  dark,
  light,
} from '@wormhole-foundation/wormhole-connect';

import { Radio, RadioGroup, FormControlLabel, PaletteMode } from '@mui/material';

const loadCustomTheme = (mode: PaletteMode): Required<WormholeConnectTheme> => {
  const key = `connect-editor:custom-theme-${mode}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const template = mode === 'dark' ? dark : light;

  return {
    mode,
    input: template.modal.background,
    primary: template.primary[500],
    secondary: template.secondary[500],
    text: template.text.primary,
    textSecondary: template.text.secondary,
    error: template.error[500],
    success: template.success[500],
    badge: template.background.badge,
    font: template.font,
  }
}

const saveCustomTheme = (mode: string, theme: ConnectTheme) => {
  const key = `connect-editor:custom-theme-${mode}`;
  localStorage.setItem(key, JSON.stringify(theme));
}

// 'DARK' and 'LIGHT' here refer to the built-in themes
export default (props: { onChange: (theme: ConnectTheme) => void }) => {
  const [mode, setMode] = useState(localStorage.getItem('connect-editor:mode') ?? 'customDark');
  const [customDark, setCustomDark] = useState<Required<WormholeConnectTheme>>(loadCustomTheme('dark'));
  const [customLight, setCustomLight] = useState<Required<WormholeConnectTheme>>(loadCustomTheme('dark'));
  const [theme, setTheme] = useState(customDark);

  const getTheme = (): WormholeConnectTheme => {
    switch (mode) {
      case 'dark': return { mode: 'dark' };
      case 'light': return { mode: 'light' }
      case 'customDark': return customDark;
      case 'customLight': return customLight;
    }
    return { mode: 'dark' }
  };

  useEffect(() => {
    if (mode === 'dark') {
      setTheme({ mode: 'dark' });
    } else if (mode === 'light') {
      setTheme({ mode: 'light' });
    } else if (mode === 'customDark') {
      setTheme(customDark);
    } else if (mode === 'customLight') {
      setTheme(customLight);
    }
  }, [mode]);

  useEffect(() => {
    saveCustomTheme(mode, getTheme());

    /* @ts-ignore */
    props.onChange(getTheme());
  }, [getTheme()]);

  const updateThemeProperty = (mutation: (theme: WormholeConnectTheme) => void) => {
    const t = JSON.parse(JSON.stringify(theme));
    mutation(t);
    if (mode === 'customDark') {
      setCustomDark(t);
    } else if (mode === 'customLight') {
      setCustomLight(t);
    }
    setTheme(t);
  };

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

    { mode.startsWith('custom') ? <>
      <ColorPicker id="primary" label="Primary" value={(getTheme()).primary} onChange={(val) =>
        updateThemeProperty((t) => { t.primary = val })
      } />

      <ColorPicker id="modal" label="Modal / Input" value={(getTheme()).input} onChange={(val) =>
        updateThemeProperty((t) => { t.input = val })
      } />

      <ColorPicker id="badges" label="Chain Badges" value={(getTheme()).badge} onChange={(val) =>
        updateThemeProperty((t) => { t.badge = val })
      } />

      <ColorPicker id="textPrimary" label="Text (Primary)" value={(getTheme()).text} onChange={(val) =>
        updateThemeProperty((t) => { t.text = val })
      } />

      <ColorPicker id="textSecondary" label="Text (Secondary)" value={(getTheme()).textSecondary} onChange={(val) =>
        updateThemeProperty((t) => { t.textSecondary = val })
      } />

      <ColorPicker id="error" label="Success" value={(getTheme()).success} onChange={(val) =>
        updateThemeProperty((t) => { t.success = val })
      } />

      <ColorPicker id="error" label="Error" value={(getTheme()).error} onChange={(val) =>
        updateThemeProperty((t) => { t.error = val })
      } />

    </> : null }
  </>
}
