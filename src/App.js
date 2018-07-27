import React, { Component } from 'react';
import Promise from 'bluebird';

import styles from './App.less';
import eventBus from './common/eventBus';

import StyleText from './components/style-text/StyleText';
import WorkText from './components/work-text/WorkText';
import Footer from './components/footer/Footer';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      paused:false,
      animationSkipped:false
    }
  }

  componentDidMount(){
    let styleTagEl = document.getElementById('style-tag')
    eventBus.on('styleAppend', (styleText) => {
      styleTagEl.textContent += styleText
    })

    eventBus.on('styleOverwrite', (styleText) => {
      styleTagEl.textContent = styleText
    })

    eventBus.on('togglePause', (state)=>{
      this.setState({
        paused: state === 1 ? true : false
      })
    })

    eventBus.on('skip', ()=>{
      this.setState({
        animationSkipped:true,
      })
    })

    this.startAnimation();
  }

  async startAnimation(){
    try {
      await this.refs.styleText.write(0);
      await this.refs.workText.write();
      await this.refs.styleText.write(1);
      this.refs.workText.showWorkBox();
      await Promise.delay(2000);
      await this.refs.styleText.write(2);
      this.refs.footer.end();
    } catch (error) {
      if(error.message === "SKIP IT"){
        this.surprisinglyShortAttentionSpan()
      } else{
        throw error;
      }
    }
  }

  surprisinglyShortAttentionSpan(){
    this.refs.styleText.writeToEnd();
    this.refs.workText.showWorkBox();
    this.refs.footer.end();
  }

  render() {
    return (
      <div className={styles.app}>
        <StyleText {...this.state} ref="styleText"/>
        <WorkText {...this.state} ref="workText"/>
        <Footer {...this.state} ref="footer"/>
      </div>
    );
  }
}

export default App;
