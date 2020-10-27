import React, { useState } from 'react'
import './App.css'

import {
  createMuiTheme,
  responsiveFontSizes,
  MuiThemeProvider,
  Switch,
  FormGroup,
  FormControlLabel,
  Container,
} from '@material-ui/core'
import { deepOrange, orange, lightBlue, blue } from '@material-ui/core/colors' // cores
import CssBaseLine from '@material-ui/core/CssBaseLine' // ajuste navegadores antigos

import Nasa from './pages/Nasa'

function App() {

  const [temaDark, setTemaDark] = useState(false)
  const [check, setCheck] = useState(false)
  const tipoPaleta = temaDark ? 'dark' : 'light'
  const corPrimaria = temaDark ? orange[500] : blue[500]
  const corSecundaria = temaDark ? deepOrange[900] : lightBlue[400]
  let tema = createMuiTheme({
    palette: {
      type: tipoPaleta,
      primary: { main: corPrimaria },
      secondary: { main: corSecundaria }
    }
  })
  tema = responsiveFontSizes(tema) // reduz de acordo com tela

  function handleTheme() {
    setTemaDark(!temaDark)
    setCheck(!check)
  }

  return (
    <Container>
      <MuiThemeProvider theme={tema}>
        <CssBaseLine />
        <FormGroup style={{ 'marginLeft': '20px', 'color': 'grey' }}>
          <FormControlLabel
            control={<Switch size="small" checked={check} onChange={handleTheme} color="primary" inputProps={{ 'aria-label': 'primary checkbox' }} />}
            label={"Tema " + tipoPaleta}
          />
        </FormGroup>
        <Nasa />
      </MuiThemeProvider>
    </Container>
  );
}

export default App;
