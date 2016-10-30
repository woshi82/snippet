/* 
 *  滑屏操作
 */

 function Slide(wrap,cont){
  this.winW = document.documentElement.clientWidth;
  this.winH = document.documentElement.clientHeight;
  this.wrap = document.getElementById(wrap);
  this.cont = document.getElementById(cont);
  this.cont_li = this.cont.getElementsByTagName("li");
  this.animateLay = document.getElementsByClassName("animate_wrap");
  this.cont_li_length = this.cont_li.length;
  this.startN = 0;
  this.prev = 1;
  this.startX = 0;
  this.startY = 0;
  this.endX = 0;
  this.transX = 0;
  this.transY = 0;
}

Slide.prototype = {
  init:function(){
      this.cont_li[0].style.webkitTransform = 'translate(0,0)';
      this.cont_li[0].style.zIndex = 10;
      this.cont_li[0].className = "page_0";
    this.addHandler(this.wrap,"touchstart",this.bind_fn(this,this.touch_start));
    this.addHandler(this.wrap,"touchmove",this.bind_fn(this,this.touch_move));
    this.addHandler(this.wrap,"touchend",this.bind_fn(this,this.touch_end));
    this.addHandler(this.wrap,"touchcancel",this.bind_fn(this,this.touch_end));
  },
  addHandler : function(elem,evtype,fn){
    if(elem.attachEvent){
      elem.attachEvent('on'+evtype,fn);
    }else if(elem.addEventListener){
      elem.addEventListener(evtype,fn,false);
    }else{
      elem["on"+evtype] = fn;
    }
  },
  bind_fn : function(obj,func){
    return function(){
      func.apply(obj,arguments);
    }
  },
  touch_start : function(e){
    if(!event.touches.length) return;
    var touch = event.touches[0];
        this.startX = touch.pageX;
        this.startY = touch.pageY;
  },
  touch_move : function(e){
    if(!event.touches.length) return;
    e.preventDefault();
    var touch = event.touches[0];
    this.transX = this.startX-touch.pageX;
    this.transY = this.startY-touch.pageY;


    if(Math.abs(this.transY)>Math.abs(this.transX)){
      this.transY = this.startY-touch.pageY;
      this.prev = parseInt( this.transY/Math.abs(this.transY) );

      var opacity = this.prev>0?1-(this.transY/this.winH):1+(this.transY/this.winH);
      var index = this.startN+this.prev;

      if(typeof this.cont_li[this.startN] != 'undefined'){
          this.cont_li[this.startN].style.webkitTransitionDuration = 0;
          this.animateLay[this.startN].style.opacity = opacity;
          this.cont_li[this.startN].style.zIndex = 5;
      }
      if(typeof this.cont_li[index] != 'undefined'){
        this.animateLay[index].style.opacity = 1;
        this.cont_li[index].style.webkitTransitionDuration = 0;
        this.cont_li[index].style.webkitTransform = "translate(0,"+(this.prev*this.winH-(this.transY))+"px)";
        this.cont_li[index].style.zIndex = 10;
      }
    }
  },
  touch_end : function(){
    if(Math.abs(this.transY)>Math.abs(this.transX) && Math.abs(this.transY)>50){
      this.play(this.startN,this.prev,true);
    }else{
      this.play(this.startN,this.prev,false);
    }
    this.transY = this.transX = 0;
  },
  play : function(n,v,b){
    var _=this;
    var iNow = 0;
    var bOut = false;

    iNow = b?n+v:n;
    if(iNow>=this.cont_li_length){
      iNow = this.cont_li_length-1;
      bOut = true;
    }
    if(iNow<0){
      iNow = 0;
      bOut = true;
    }

    if(this.cont_li[iNow]){
      this.cont_li[iNow].className = 'page_'+iNow;
      this.cont_li[iNow].style.webkitTransitionDuration = '300ms';
      this.cont_li[iNow].style.webkitTransform = 'translate(0,0)';
      this.animateLay[iNow].style.opacity=1;
      this.cont_li[iNow].style.zIndex = 10;
      if(!b&&this.cont_li[n+v]){
          this.cont_li[n+v].style.webkitTransitionDuration = '300ms';
          if(v>0)this.cont_li[n+v].style.webkitTransform = '';
          this.animateLay[n+v].style.opacity=0;
      }else{
        if (!bOut&&b) {
          setTimeout(function (){
            _.cont_li[n].className = '';
            _.cont_li[n].style.webkitTransform = '';
          },300);
        };
      }
      this.startN = iNow;

    }
  }
}
window.onload = function (){
    var slide1 = new Slide("slide","slide_ul");
    slide1.init();
}

