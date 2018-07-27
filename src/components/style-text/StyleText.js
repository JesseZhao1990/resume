import React,{ Component } from "react";
import ReactDOM from 'react-dom';
import {handleChar,writeTo} from "../../common/utils";
import eventBus from "../../common/eventBus";
import cfg from '../../config/cfg';


const styleText = [0,1,2].map(i=>{
  return require('./styles'+i+'.txt');
})


class StyleText extends Component {
    constructor(props){
      super(props)
      this.state = {
        text:'',
        speed: cfg.speed,
        styleBuffer:''
      }
    }

    async write(index){
      const dom = ReactDOM.findDOMNode(this);
      const {speed} = this.state;
      await writeTo(dom, styleText[index], 0, speed, true, 1, this);
    }

    writeToEnd(){
      let txt = styleText.join('\n');
      let styleHTML = '';
      for (let i = 0; i < txt.length; i++) {
        styleHTML = handleChar(styleHTML, txt[i])
      }
      this.setState({
        text:styleHTML,
      })
      eventBus.emit('styleOverwrite', '#work-text * {transition: none; }' + txt);
    }

    render(){
      const {text} = this.state;
      return(<pre id="style-text" dangerouslySetInnerHTML= {{__html:text}}>
      </pre>)
    }
}

export default StyleText;