import Promise from 'bluebird'
import React,{ Component } from "react";
import ReactDOM from 'react-dom';
import {handleChar} from "../../common/utils";
import eventBus from '../../common/eventBus';

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/



const styleText = [0,1,2].map(i=>{
  return require('./styles'+i+'.txt');
})


class StyleText extends Component {
    constructor(props){
      super(props)
      this.state = {
        text:'',
        speed: 16,
        styleBuffer:''
      }
    }

    async write(index){
      const dom = ReactDOM.findDOMNode(this);
      const {speed} = this.state;
      await this.writeTo(dom, styleText[index], 0, speed, true, 1);
    }

    async writeTo( el, message, index, interval, mirrorToStyle, charsPerInterval){
      let chars = message.slice(index,index+charsPerInterval)
      index += charsPerInterval
      el.scrollTop = el.scrollHeight;

      if(mirrorToStyle){
        this.writeChar(chars);
      }else{
        this.writeSimpleChar(chars);
      }

      if(index < message.length){
        let thisInterval = interval;
        let thisSlice = message.slice(index-2,index);
        if(comma.test(thisSlice)){
          thisInterval = interval * 30;
        }

        if(endOfSentence.test(thisSlice)){
          thisInterval = interval * 70;
        }

        thisSlice = message.slice(index-2,index+1);
        if(endOfBlock.test(thisSlice)){
          thisInterval = interval * 50;
        }

        do {
          await Promise.delay(thisInterval)
        } while( this.props.paused )

        return this.writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval)

      }

    }

    writeChar(char){
      const {styleBuffer,text} = this.state;
      let newChar =  handleChar(text,char);
      let newStyleBuffer = styleBuffer + char;
      
      this.setState({
        text:newChar,
        styleBuffer:newStyleBuffer
      })
      if(char === ";"){
        eventBus.emit('styleAppend', this.state.styleBuffer);
        this.setState({
          styleBuffer:''
        })
      }

    }

    writeSimpleChar(char){
      this.setState({
        text:`${this.state.text}${char}`
      })
    }
    
    render(){
      const {text} = this.state;
      return(<pre id="style-text" dangerouslySetInnerHTML= {{__html:text}}>
      </pre>)
    }
}

export default StyleText;