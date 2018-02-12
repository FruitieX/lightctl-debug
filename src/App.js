import React, { Component } from 'react';
import Nes from 'nes/client';
import convert from 'color-convert';

class App extends Component {
  state = {
    luminaires: {},
  };

  componentDidMount = async () => {
    const client = new Nes.Client(`ws://${window.location.hostname}:5678`);
    await client.connect();

    client.subscribe('/luminaires/all', (luminaire, flags) => {
      const light = luminaire.lights[0];
      console.log(
        luminaire.id,
        this.getCssColorString(light.prevState),
        '=>',
        this.getCssColorString(light.state),
      );
      const nextLuminaires = {
        ...this.state.luminaires,
        [luminaire.id]: luminaire,
      };
      this.setState(() => ({ luminaires: nextLuminaires }));
    });
  };

  getCssColorString = color => {
    const hsl = convert.hsv.hsl(color);
    return `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(
      hsl[2],
    )}%)`;
  };

  getRounded = color =>
    `${Math.round(color[0])}, ${Math.round(color[1])}, ${Math.round(color[2])}`;

  renderLight = (light, index) => (
    <div style={{ display: 'flex' }} key={index}>
      <div style={{ flex: 1 }}>
        state:
        <div
          style={{
            width: 64,
            height: 64,
            backgroundColor: this.getCssColorString(light.state),
          }}
        />
        <div>{this.getRounded(light.state)}</div>
      </div>
      <div style={{ flex: 1 }}>
        prevState:
        <div
          style={{
            width: 64,
            height: 64,
            backgroundColor: this.getCssColorString(light.prevState),
          }}
        />
        <div>{this.getRounded(light.prevState)}</div>
      </div>
    </div>
  );

  renderLuminaire = ([luminaireId, luminaire]) => {
    const cnt = luminaire.lights.length;
    const numLightsText = `(${cnt} ${cnt > 1 ? 'lights' : 'light'})`;
    return (
      <div key={luminaire.id}>
        <h2>
          {luminaire.id} {numLightsText}
        </h2>
        {luminaire.lights.map(this.renderLight)}
      </div>
    );
  };

  render() {
    return (
      <div>
        {Object.entries(this.state.luminaires).map(this.renderLuminaire)}
      </div>
    );
  }
}

export default App;
