import Promise from 'bluebird';
import eventBus from './eventBus';

let openComment = false
const commentRegex = /(\/\*(?:[^](?!\/\*))*\*)$/
const keyRegex = /([a-zA-Z- ^\n]*)$/
const valueRegex = /([^:]*)$/
const selectorRegex = /(.*)$/
const pxRegex = /\dp/
const pxRegex2 = /p$/

const endOfSentence = /[？！。~：]$/
const comma = /\D[，；、]$/
const endOfBlock = /[^/]\n\n$/

export function handleChar(fullText, char) {
  if (openComment && char !== '/') {
    fullText += char
  } else if (char === '/' && openComment === false) {
    openComment = true
    fullText += char
  } else if (char === '/' && fullText.slice(-1) === '*' && openComment === true) {
    openComment = false
    fullText = fullText.replace(commentRegex, '<span class="comment">$1/</span>')
  } else if (char === ':') {
    fullText = fullText.replace(keyRegex, '<span class="key">$1</span>:')
  } else if (char === '') {
    fullText = fullText.replace(valueRegex, '<span class="value">$1</span>')
  } else if (char === '{') {
    fullText = fullText.replace(selectorRegex, '<span class="selector">$1</span>{')
  } else if (char === 'x' && pxRegex.test(fullText.slice(-2))) {
    fullText = fullText.replace(pxRegex2, '<span class="value px">px</span>')
  } else {
    fullText += char
  }
  return fullText
}



export async function writeTo( el, message, index, interval, mirrorToStyle, charsPerInterval, self){
  if(self.props.animationSkipped){
    throw new Error('SKIP IT');
  }

  let chars = message.slice(index,index+charsPerInterval)
  index += charsPerInterval
  el.scrollTop = el.scrollHeight;

  if(mirrorToStyle){
    writeChar(chars,self);
  }else{
    writeSimpleChar(chars,self);
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
    } while( self.props.paused )

    return writeTo(el, message, index, interval, mirrorToStyle, charsPerInterval, self)

  }

}

function writeChar(char,self){
  const {styleBuffer,text} = self.state;
  let newChar =  handleChar(text,char);
  let newStyleBuffer = styleBuffer + char;
  
  self.setState({
    text:newChar,
    styleBuffer:newStyleBuffer
  })
  if(char === ";"){
    eventBus.emit('styleAppend', self.state.styleBuffer);
    self.setState({
      styleBuffer:''
    })
  }
}

function writeSimpleChar(char,self){
  self.setState({
    text:`${self.state.text}${char}`
  })
}
