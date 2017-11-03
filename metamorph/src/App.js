import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
var API = require('./api/index.js').Api
var ReactGridLayout = require('react-grid-layout');

class App extends Component {
  constructor(){
    super()
     this.state = {
          input: "",
          value: ""
        };
  this.Morph = this.Morph.bind(this)
  }
  Morph(){
      let callback = (body) => {
        this.setState({...this.state,value:body});    
      }
      console.log("this.state.input",this.state.input)
      API.getMorphedCode(this.state.input,callback);    
  }
  onInputChanged(e){
    console.log(e.target.value,this.state)
    this.setState({...this.state,input:e.target.value})
  }
  render() {
    var layout = [
      {i: 'a', x: 0, y: 0, w: 6, h: 7,static: true},
      {i: 'b', x: 12, y: 0, w: 6, h: 7,static: true}
    ];
    return (
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Metamorphosis Engine</h1>
        </header>
        <ReactGridLayout className ="layout" layout = {layout} cols={12} rowHeight={30} width={1500}>
            <TextField key='a' multiline={true} onChange = {this.onInputChanged.bind(this)}/>
            <TextField key='b' multiline={true} value = {this.state.value} /><br /><br />
        </ReactGridLayout>

            <Button raised color="primary" onClick={this.Morph}>
        Morph
      </Button>

      </div>
    );
  }
}

export default App;
