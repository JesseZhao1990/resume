import React, {Component} from "react";
import ReactDom from 'react-dom';
import Promise from 'bluebird';
import MarkDown from 'markdown';
import wheel from 'mouse-wheel'
import workText from '../../config/work.txt';
import cfg from '../../config/cfg';

import {writeTo} from "../../common/utils";

const toHTML = MarkDown.markdown.toHTML;

class WorkText extends Component{
  constructor(props){
    super(props);
    this.state={
      speed: cfg.speed,
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
    await writeTo(dom, workText, 0, speed, false, 1,this);
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