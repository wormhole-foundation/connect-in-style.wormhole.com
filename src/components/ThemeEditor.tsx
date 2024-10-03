import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';

import {
  dark,
  light,
  WormholeConnectPartialTheme,
} from '@wormhole-foundation/wormhole-connect';

import { Radio, RadioGroup, FormControlLabel } from '@mui/material';

const loadCustomTheme = (mode: string) => {
  const key = `connect-editor:custom-theme-${mode}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    return JSON.parse(cached);
  }
  return JSON.parse(JSON.stringify((mode === 'customDark' ? dark : light)))
}

const saveCustomTheme = (mode: string, theme: WormholeConnectPartialTheme) => {
  const key = `connect-editor:custom-theme-${mode}`;
  localStorage.setItem(key, JSON.stringify(theme));
}

export default (props: { onChange: (theme: WormholeConnectPartialTheme) => void }) => {
  const [mode, setMode] = useState(localStorage.getItem('connect-editor:mode') ?? 'customDark');
  const [customDark, setCustomDark] = useState(loadCustomTheme('customDark'));
  const [customLight, setCustomLight] = useState(loadCustomTheme('customLight'));
  const [theme, setTheme] = useState(customDark);

  const getTheme = () => {
    switch (mode) {
      case 'dark': return dark;
      case 'light': return light;
      case 'customDark': return customDark;
      case 'customLight': return customLight;
    }
    return dark;
  };

  useEffect(() => {
    if (mode === 'dark') {
      setTheme(dark);
    } else if (mode === 'light') {
      setTheme(light);
    } else if (mode === 'customDark') {
      setTheme(customDark);
    } else if (mode === 'customLight') {
      setTheme(customLight);
    }
  }, [mode]);

  useEffect(() => {
    const t = getTheme();
    t.background.default = 'transparent';
    props.onChange(getTheme());
    saveCustomTheme(mode, getTheme());
  }, [getTheme()]);

  const updateThemeProperty = (mutation: (theme: WormholeConnectPartialTheme) => void) => {
    const t = JSON.parse(JSON.stringify(theme));
    mutation(t);
    if (mode === 'customDark') {
      setCustomDark(t);
    } else if (mode === 'customLight') {
      setCustomLight(t);
    }
    setTheme(t);
  };

  if (!getTheme().primary) debugger;

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
      <ColorPicker id="primary" label="Primary" value={(getTheme()).primary[500]} onChange={(val) =>
        updateThemeProperty((t) => { t.primary![500] = val })
      } />

      <ColorPicker id="modal" label="Modal / Input" value={(getTheme()).modal.background} onChange={(val) =>
        updateThemeProperty((t) => { t.modal!.background = val })
      } />

      <ColorPicker id="badges" label="Chain Badges" value={(getTheme()).background.badge} onChange={(val) =>
        updateThemeProperty((t) => { t.background!.badge = val })
      } />

      <ColorPicker id="textPrimary" label="Text (Primary)" value={(getTheme()).text.primary} onChange={(val) =>
        updateThemeProperty((t) => { t.text!.primary = val })
      } />

      <ColorPicker id="textSecondary" label="Text (Secondary)" value={(getTheme()).text.secondary} onChange={(val) =>
        updateThemeProperty((t) => { t.text!.secondary = val })
      } />

      <ColorPicker id="error" label="Success" value={(getTheme()).success[500]} onChange={(val) =>
        updateThemeProperty((t) => { t.success![500] = val })
      } />

      <ColorPicker id="error" label="Error" value={(getTheme()).error[500]} onChange={(val) =>
        updateThemeProperty((t) => { t.error![500] = val })
      } />

    </> : null }
  </>
}
