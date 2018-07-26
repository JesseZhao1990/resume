import React, { Component } from 'react';
import logo from './images/logo.svg';
import styles from './App.less';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <header className={styles["app-header"]}>
          <img src={logo} className={styles["app-logo"]} alt="logo" />
          <h1 className={styles["app-tite"]}>Welcome to React</h1>
        </header>
        <p className={styles["qpp-intro"]}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
