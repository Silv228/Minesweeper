import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import tile from './images/tile1.png'
import sprites0 from './images/tile0.png'
import sprites1 from './images/1.png'
import sprites2 from './images/2.png'
import sprites3 from './images/3.png'
import sprites4 from './images/4.png'
import sprites5 from './images/5.png'
import sprites6 from './images/6.png'
import sprites7 from './images/7.png'
import sprites8 from './images/8.png'
import flag from './images/flag.png'
import bomb from './images/bomb.png'
import detonatedBomb from './images/detB.png'
import FindBomb from './images/FindBomb.png'
import SmileStart from './images/SmileStart.png'
import SmileLose from './images/SmileLose.png'
import Question from './images/quest.png'
import c0 from './images/c0.png'
import c1 from './images/c1.png'
import c2 from './images/c2.png'
import c3 from './images/c3.png'
import c4 from './images/c4.png'
import c5 from './images/c5.png'
import c6 from './images/c6.png'
import c7 from './images/c7.png'
import c8 from './images/c8.png'
import c9 from './images/c9.png'
import SmileWOW from './images/SmileDown.png'
import SmileWin from './images/SmileWin.png'
import {Image, Layer, Stage } from 'react-konva';
import { connect } from 'react-redux';
import {UpdateMask, SetQuantBombs,winGame,SetReset,Settime, SetPick, SetWOW, SetQuantFlag, SetEnd, UpdateList, ClearField, SetBlank} from './redux/Reducer'

class Tile extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    this.setState({
      image: this.image,
    });
  };
  winGame = () => {
    console.log('WININIWNIDNAINW')
  }
  GenerateBombs = (i,j) =>{
    let k = 0
    while (k < 40){
      let ir = Math.floor(Math.random()*16)
      let jr = Math.floor(Math.random()*16)
      if(this.props.list[ir][jr] !== '*' && ir !== i && jr !== j){
        k += 1
        this.props.UpdateList(ir,jr,'*')
      }
    }
    this.QuantBombs()
    this.props.SetPick()
  }
  QuantBombs = () => {
    this.props.list.forEach((stroke,i) => {
      stroke.forEach((tile, j) => {
        if(tile === '*'){
          this.props.SetQuantBombs(i + (((i+1) > 15) ? 0 : 1), j + (((j+1) > 15)? 0 : 1), i - (((i-1) < 0) ? 0 : 1), j - (((j-1) < 0) ? 0 : 1))
        }
      })
    })
  }
  RegisterTile = (e) => {
    if(e.evt.button === 0){
      let i = (this.props.y - 100)/24
      let j = (this.props.x - 400)/24
      if (this.props.isFirstPick){
        this.GenerateBombs(i,j)
      } 
      if(this.props.list[i][j] !== '*'){
        this.props.UpdateMask(i,j)
        let win = 0
        this.props.mask.forEach((el) => {
        el.forEach((i) => {
          if (i === 0 || i === '>' || i === '?') win += 1
        })
        })
        if (win === 40){
          this.props.winGame()
        }
      }
      else if (this.props.list[i][j] === '*'){
        this.props.UpdateList(i,j,'#')
        this.props.UpdateMask(i,j)
        for(let i = 0; i < 15; i++){
          for(let j = 0; j < 15; j++){
            if(this.props.list[i][j] === '*' && this.props.mask[i][j] !== '>'){
              this.props.UpdateMask(i,j)
            }
            else if (this.props.list[i][j] === '*' && this.props.mask[i][j] === '>'){
              this.props.UpdateMask(i,j,'x')
            }
          }
        }
        this.props.SetEnd()
      }
      if (this.props.list[i][j] === 0){
        let l = 1
        let r = -1
        let jin = j
        //REFUCKTORING
        while(this.props.list[i][jin] === 0 ){
          jin -= 1
          l -= 1
        }
        jin = j
        while(this.props.list[i][jin] === 0 ){
          jin += 1
          r += 1
        }
        //REFUCKTORING
        for (let ind = j + l; ind <= j + r; ind++){
          let t = 1
          let b = -1
          let iin = i
          while(this.props.list[iin][ind] === 0 ){
            iin -= 1
            t -= 1
            if (iin < 0) break
          }
          iin = i
          while(this.props.list[iin][ind] === 0 ){
            iin += 1
            b += 1
            if (iin > 15) break
          }
          for (let jnd = i + t; jnd <= i + b; jnd++)
            this.props.SetBlank(jnd + (((jnd+1) > 15) ? 0 : 1), ind + (((ind + 1) > 15)? 0 : 1), jnd - (((jnd-1) < 0) ? 0 : 1), ind - (((ind-1) < 0) ? 0 : 1))    
        }
      }   
    }
    if(e.evt.button === 2 && !this.props.isFirstPick){
      let i = (this.props.y - 100)/24
      let j = (this.props.x - 400)/24
      if (this.props.mask[i][j] === 0 && this.props.flags > 0){
        this.props.UpdateMask(i,j,'>')
        this.props.SetQuantFlag(this.props.flags - 1)
      }
      else if (this.props.mask[i][j] === '>'){
        this.props.UpdateMask(i,j,'?')
        this.props.SetQuantFlag(this.props.flags + 1)
      }
      else if (this.props.mask[i][j] === '?'){
        this.props.UpdateMask(i,j, 0)
      }
    }
  }
  render() {
    return (
      <Image
        onContextMenu={()=>false}
        onClick = {this.props.isClick ? this.RegisterTile : ''}
        onMouseDown = { (e) => 
          e.evt.button === 0 ? this.props.SetWOW() : '' 
        }
        x = {this.props.x}
        y = {this.props.y}
        image = {this.state.image}
      />
    );
  }
}

const Comp = (props) => {
  const [smile, SetImage] = useState(null)
  const [quant1, SetQuant1] = useState(null)
  const [quant2, SetQuant2] = useState(null)
  const [quant3, SetQuant3] = useState(null)
  const [quant4, SetQuant4] = useState(null)
  const [quant5, SetQuant5] = useState(null)
  useEffect(() =>{
    loadImage()
    document.addEventListener('contextmenu', function(e) {e.preventDefault()}, true)
  }, [props.WOW, props.time, props.isClick, props.flags])
  useEffect(() => {
    const timer = setTimeout(() => {
      !props.reset  && props.Settime(props.time + 1)
    },1000)
    return () => {
      clearInterval(timer)
    }
  },[props.time])

  const loadImage = () =>{
    let smile = new window.Image()
    let quant1 = new window.Image()
    let quant2 = new window.Image()
    let quant3 = new window.Image()
    let quant4 = new window.Image()
    let quant5 = new window.Image()
    smile.src = props.win ? SmileWin : (props.WOW && props.isClick) ? SmileWOW : props.isClick ? SmileStart : SmileLose 
    quant1.src = CountList[Number(props.flags.toString()[0])]
    quant2.src = CountList[Number(props.flags.toString()[1])]
    quant3.src = CountList[Number(props.time.toString()[2])] ? CountList[Number(props.time.toString()[2])] : c0 
    quant4.src = CountList[Number(props.time.toString()[1])] ? CountList[Number(props.time.toString()[1])] : c0
    quant5.src = CountList[Number(props.time.toString()[0])]
    smile.addEventListener('load', () => SetImage(smile))
    quant1.addEventListener('load', () =>SetQuant1(quant1))
    quant2.addEventListener('load', () =>SetQuant2(quant2)) 
    quant3.addEventListener('load', () =>SetQuant3(quant3))
    quant4.addEventListener('load', () =>SetQuant4(quant4))
    quant5.addEventListener('load', () =>SetQuant5(quant5))
  }

  let CountList = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9]
  let spritelist = [sprites0,sprites1,sprites2,sprites3,sprites4,sprites5,sprites6,sprites7,sprites8]
  let normList = []
  
  props.mask.forEach((i,index) => {
    normList.push(i.map((j,jndex) =>
      <Tile key={`${index + jndex}`} SetQuantBombs = {props.SetQuantBombs} 
        SetPick = {props.SetPick} isFirstPick = {props.isFirstPick} SetQuantFlag = {props.SetQuantFlag}
        ClearField = {props.ClearField} SetBlank = {props.SetBlank} SetEnd = {props.SetEnd} SetWOW = {props.SetWOW}
        isClick = {props.isClick} list = {props.list} mask = {props.mask} flags = {props.flags} WOW = {props.WOW}
        x = {400 + 24 * jndex} y = {100 + 24 * index} win = {props.win}
        UpdateList = {props.UpdateList} UpdateMask = {props.UpdateMask}
        src = { props.mask[index][jndex] === '*' ? bomb : props.mask[index][jndex] in [1,2,3,4,5,6,7,8]  ? 
        spritelist[props.mask[index][jndex]] : props.mask[index][jndex] === '>' ? flag : props.mask[index][jndex] === '#'? detonatedBomb : props.mask[index][jndex] === '?' ? Question : props.mask[index][jndex] === 'x' ? FindBomb : tile}
      />
    ))
  }) 
  return (
      <Stage width={1000} height={600}>
        <Layer>
        <Image
          x={690}
          y={50}
          image={props.time < 10 ? quant3 : props.time < 100 ? quant3 : quant5}
        />
        <Image
          x={710}
          y={50}
          image={props.time < 10 ? quant4 : props.time < 100 ? quant5 : quant4}
        />
        <Image
          x={730}
          y={50}
          image={props.time < 10 ? quant5 : props.time < 100 ? quant4 : quant3}
        />
        <Image
          x={430}
          y={50}
          image={props.flags >= 10 ? quant1 : quant2}
        />
        <Image
          x={450}
          y={50}
          image={props.flags >= 10 ? quant2 : quant1}
        />
        <Image
          onClick={() => {
            props.ClearField()
            props.SetReset(true)
            props.Settime(0)
          }}
          x={570}
          y={50}
          image={smile}
        />
          {normList}
        </Layer>
      </Stage>
  );
}

const MapStateToProps = (state) => {
  return {
    list : state.Reducer.list,
    isFirstPick : state.Reducer.isFirstPick,
    mask : state.Reducer.mask,
    isClick : state.Reducer.isClick,
    flags : state.Reducer.flags,
    WOW : state.Reducer.WOW,
    win : state.Reducer.win,
    time : state.Reducer.time,
    reset : state.Reducer.reset
  }
}

const App = connect(MapStateToProps,{UpdateMask,Settime,SetReset, winGame, SetWOW, UpdateList, SetEnd, SetQuantFlag, SetQuantBombs, SetPick, ClearField, SetBlank})(Comp) 
export default App;
