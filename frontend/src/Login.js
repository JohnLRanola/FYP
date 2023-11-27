import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Pharmacies from './Pharmacies';
import GPS from './GPs';

class Login extends Component {
  state = {
    username: '',
    password: '',
    role: ''
  };

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (username === 'admin' && password === 'admin') {
      this.setState({ role: 'admin' });
    } else {
      this.setState({ role: 'user' });
    }
  };

  render() {
    const { role } = this.state;
    return (
      <Router>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="username" onChange={this.handleInputChange} />
          <input type="password" name="password" onChange={this.handleInputChange} />
          <button type="submit">Login</button>
        </form>
        <Switch>
          <Route path="/pharmacies" component={Pharmacies} />
          {role === 'admin' && <Route path="/gps" component={GPS} />}
          <Redirect to="/pharmacies" />
        </Switch>
      </Router>
    );
  }
}

export default Login;