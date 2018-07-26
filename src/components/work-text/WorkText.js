import React, {Component} from "react";
import ReactDom from 'react-dom';
import Promise from 'bluebird';
import MarkDown from 'markdown';
import wheel from 'mouse-wheel'
import workText from './work.txt';

import {handleChar} from "../../common/utils";
import eventBus from '../../common/eventBus';

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/

const toHTML = MarkDown.markdown.toHTML;

class WorkText extends Component{
  constructor(props){
    super(props);
    this.state={
      speed: 16,
      flipped: false,
      preview: true,
      show: false,
      workText: workText,
      mdText: toHTML(workText),
      text:'',
      styleBuffer:''
    }
  }

  async write(){
    this.setState({show:true})
    let dom = ReactDom.findDOMNode(this);
    let {workText,speed} = this.state;
    await this.writeTo(dom, workText, 0, speed, false, 1);
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

  showWorkBox(){
    this.setState({
      show:true,
      preview:false,
      flipped:true,
    },()=>{
      let dom = ReactDom.findDOMNode(this);
      dom.scrollTop = 9999;
      let flipping = false;
      wheel(dom, async function(dx,dy){
        if(flipping) return;
        let half = (dom.scrollHeight - dom.clientHeight) / 2;
        let pastHalf = this.state.flipped ? dom.scrollTop < half : dom.scrollTop >half;

        if(pastHalf){
          this.setState({
            flipped:!this.state.flipped
          })
          flipping = true;
          await Promise.delay(500);
          dom.scrollTop = this.state.flipped ? 9999 :0;
          flipping = false;
        }

        dom.scrollTop += (dy * (this.flipped ? -1 : 1));

      }.bind(this), true)
    })
  }

  writeSimpleChar(char){
    this.setState({
      text:`${this.state.text}${char}`
    })
  }

  render(){
    const { show, flipped, preview, text, workText,mdText} = this.state;
    const workCls = flipped ? 'flipped' : '';
    const display = show ? 'block' : 'none';
    return(<pre id="work-text" className={workCls} style={{display:display}}>
      {preview ? 
      <div dangerouslySetInnerHTML= {{__html:text}}></div> 
      :<div >
          <div className="text" dangerouslySetInnerHTML= {{__html:workText}}></div>
          <div className="md" dangerouslySetInnerHTML= {{__html:mdText}}></div>
      </div>
      }
    </pre>)
  }
}

export default WorkText;