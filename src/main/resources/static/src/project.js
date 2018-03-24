require=function n(c,r,h){function a(i,e){if(!r[i]){if(!c[i]){var t="function"==typeof require&&require;if(!e&&t)return t(i,!0);if(d)return d(i,!0);var o=new Error("Cannot find module '"+i+"'");throw o.code="MODULE_NOT_FOUND",o}var s=r[i]={exports:{}};c[i][0].call(s.exports,function(e){var t=c[i][1][e];return a(t||e)},s,s.exports,n,c,r,h)}return r[i].exports}for(var d="function"==typeof require&&require,e=0;e<h.length;e++)a(h[e]);return a}({Bullet:[function(e,t,i){"use strict";cc._RF.push(t,"bd07dWfWENEjasZeb5tvq5z","Bullet"),cc.Class({extends:cc.Component,properties:{speed:2e3,targetX:0,targetY:0},onLoad:function(){},onCollisionEnter:function(e,t){this.node.destroy()},update:function(e){var t=Math.atan2(this.targetX,this.targetY);this.node.x+=this.speed*e*Math.sin(t),this.node.y+=this.speed*e*Math.cos(t)}}),cc._RF.pop()},{}],CameraControl:[function(e,t,i){"use strict";cc._RF.push(t,"25fa9oEi19GRoWsA924p5dD","CameraControl"),cc.Class({extends:cc.Component,properties:{target:{default:null,type:cc.Node},camera:cc.Camera,anim:cc.Animation,jumpZoom:!1,centerAtStart:!1,smoothFollow:!1,followX:{default:0,visible:function(){return this.smoothFollow}},followY:{default:0,visible:function(){return this.smoothFollow}},minFollowDist:{default:0,visible:function(){return this.smoothFollow}},followRatio:{default:0,visible:function(){return this.smoothFollow}},overview:!1,overviewTargets:{default:[],type:[cc.Node],visible:function(){return this.overview}},overviewMargin:{default:0,visible:function(){return this.overview}},speedZoom:!1,zoomInSpeed:{default:0,visible:function(){return this.speedZoom}},zoomOutSpeed:{default:0,visible:function(){return this.speedZoom}},canShake:!1,shakeDuration:{default:0,visible:function(){return this.canShake}},pointerPan:!1,pointerXMult:{default:0,visible:function(){return this.pointerPan}},pointerYMult:{default:0,visible:function(){return this.pointerPan}},useBoundaries:!1,topBound:{default:0,visible:function(){return this.useBoundaries}},bottomBound:{default:0,visible:function(){return this.useBoundaries}},leftBound:{default:0,visible:function(){return this.useBoundaries}},rightBound:{default:0,visible:function(){return this.useBoundaries}}},onLoad:function(){this.startFollow=!1;var e=cc.find("Canvas").getComponent(cc.Canvas);this.visibleSize=cc.view.getVisibleSize(),this.initZoomRatio=this.camera.zoomRatio,this.previousPos=this.node.position,this.pointerPan&&(this.overview=!1,this.speedZoom=!1,e.node.on("mousemove",this.onMouseMove,this),e.node.on("touchmove",this.onTouchMove,this),this.pointerPos=null),this.overview&&(this.jumpZoom=!1,this.speedZoom=!1),this.speedZoom&&(this.jumpZoom=!1)},onEnable:function(){cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera)},onDisable:function(){cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera)},lateUpdate:function(e){var t=void 0;t=(this.overview,this.target.position),this.smoothFollow?((Math.abs(t.x-this.node.x)>=this.followX||Math.abs(t.y-this.node.y)>=this.followY)&&(this.startFollow=!0),this.startFollow&&(this.node.position=this.node.position.lerp(t,this.followRatio),cc.pDistance(t,this.node.position)<=this.minFollowDist&&(this.startFollow=!1))):this.node.position=t,this.previousPos=t},getOverviewTargetsMidpoint:function(){for(var e=cc.p(0,0),t=99999,i=99999,o=-99999,s=-99999,n=0;n<this.overviewTargets.length;++n){var c=this.overviewTargets[n];o=c.x>o?c.x:o,t=c.x<t?c.x:t,s=c.y>s?c.y:s,i=c.y<i?c.y:i}o+=this.overviewMargin,t-=this.overviewMargin,s+=this.overviewMargin,i-=this.overviewMargin;var r=Math.abs(o-t),h=Math.abs(s-i);e=cc.p(t+r/2,i+h/2);var a=Math.max(r/this.visibleSize.width,h/this.visibleSize.height);return this.camera.zoomRatio=1/a,e},shakeCamera:function(){this.canShake&&(this.anim.play("shake"),this.scheduleOnce(this.stopShake.bind(this),this.shakeDuration))},stopShake:function(){this.anim.stop(),this.camera.node.position=cc.p(0,0)},onMouseMove:function(e){this.pointerPos=e.getLocation()},onTouchMove:function(e){this.pointerPos=e.getLocation()}}),cc._RF.pop()},{}],HeroControl:[function(e,t,i){"use strict";cc._RF.push(t,"9d1dayf51FKZoi11wsc2/ON","HeroControl"),cc.Class({extends:cc.Component,properties:{speed:cc.v2(0,0),maxSpeed:cc.v2(400,400),drag:1e3,direction:0,directiony:0,jumpSpeed:0,bullet:{default:null,type:cc.Node}},onLoad:function(){this.stompClient=null,this.pi=3.141516,this.id=Math.floor(1e7*Math.random()),cc.director.getCollisionManager().enabled=!0,cc.director.getCollisionManager().enabledDebugDraw=!0,cc.find("Canvas").on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this),this.connectAndSubscribe(),cc.eventManager.addListener({event:cc.EventListener.KEYBOARD,onKeyPressed:this.onKeyPressed.bind(this),onKeyReleased:this.onKeyReleased.bind(this)},this.node),cc.eventManager.addListener({event:cc.EventListener.MOUSE,onMouseMove:this.onMouseMove.bind(this)},this.node),this.collisionX=0,this.collisionY=0,this.prePosition=cc.v2(),this.preStep=cc.v2(),this.touchingNumber=0},onEnable:function(){cc.director.getCollisionManager().enabled=!0,cc.director.getCollisionManager().enabledDebugDraw=!0},onDisable:function(){cc.director.getCollisionManager().enabled=!1,cc.director.getCollisionManager().enabledDebugDraw=!1},onKeyPressed:function(e,t){switch(e){case cc.KEY.a:case cc.KEY.left:this.direction=-1;break;case cc.KEY.d:case cc.KEY.right:this.direction=1;break;case cc.KEY.w:case cc.KEY.up:this.directiony=1;break;case cc.KEY.s:case cc.KEY.down:this.directiony=-1}},onKeyReleased:function(e,t){switch(e){case cc.KEY.a:case cc.KEY.left:case cc.KEY.d:case cc.KEY.right:this.direction=0;break;case cc.KEY.w:case cc.KEY.up:case cc.KEY.s:case cc.KEY.down:this.directiony=0}},onMouseMove:function(e){var t=Math.floor(e.getLocationX()),i=Math.floor(e.getLocationY()),o={x:t-this.node.position.x,y:i-this.node.position.y},s=Math.atan2(o.x,o.y);this.node.rotation=s*(180/this.pi)},onCollisionEnter:function(e,t){this.node.color=cc.Color.RED,this.touchingNumber++;var i=e.world.aabb,o=e.world.preAabb.clone(),s=t.world.aabb,n=t.world.preAabb.clone();n.x=s.x,o.x=i.x,console.log("col"),cc.Intersection.rectRect(n,o)&&(n.xMax>o.xMax?this.collisionX=-1:n.xMin<o.xMin&&(this.collisionX=1),e.touchingX=!0),n.y=s.y,o.y=i.y,cc.Intersection.rectRect(n,o)&&(n.yMax>o.yMax?this.collisionY=-1:n.yMin<o.yMin&&(this.collisionY=1),e.touchingY=!0)},onCollisionExit:function(e){this.touchingNumber--,0===this.touchingNumber&&(this.node.color=cc.Color.WHITE),e.touchingX&&(this.collisionX=0,e.touchingX=!1),e.touchingY&&(e.touchingY=!1,this.collisionY=0)},update:function(e){0===this.direction?0<this.speed.x?(this.speed.x-=this.drag*e,this.speed.x<=0&&(this.speed.x=0)):this.speed.x<0&&(this.speed.x+=this.drag*e,0<=this.speed.x&&(this.speed.x=0)):(this.speed.x+=(0<this.direction?1:-1)*this.drag*e,Math.abs(this.speed.x)>this.maxSpeed.x&&(this.speed.x=0<this.speed.x?this.maxSpeed.x:-this.maxSpeed.x)),0===this.directiony?0<this.speed.y?(this.speed.y-=this.drag*e,this.speed.y<=0&&(this.speed.y=0)):this.speed.y<0&&(this.speed.y+=this.drag*e,0<=this.speed.y&&(this.speed.y=0)):(this.speed.y+=(0<this.directiony?1:-1)*this.drag*e,Math.abs(this.speed.y)>this.maxSpeed.y&&(this.speed.y=0<this.speed.y?this.maxSpeed.y:-this.maxSpeed.y)),0===this.speed.y&&0===this.speed.x||this.stompClient.send("/room/movement",{},JSON.stringify({id:this.id,ps:this.node.position,rt:this.node.rotation})),this.prePosition.x=this.node.x,this.prePosition.y=this.node.y,this.preStep.x=this.speed.x*e,this.preStep.y=this.speed.y*e,this.collisionY<0?0<this.speed.y&&(this.node.y+=this.speed.y*e):0<this.collisionY?this.speed.y<0&&(this.node.y+=this.speed.y*e):this.node.y+=this.speed.y*e,this.collisionX<0?0<this.speed.x&&(this.node.x+=this.speed.x*e):0<this.collisionX?this.speed.x<0&&(this.node.x+=this.speed.x*e):this.node.x+=this.speed.x*e},onTouchBegan:function(e){var t=e.touch.getLocation();this.stompClient.send("/room/newshot",{},JSON.stringify({id:this.id,touchLocX:t.x,touchLocY:t.y}))},addBulletToScene:function(e){var t=cc.director.getScene(),i=cc.instantiate(this.bullet);i.position=this.node.position,i.getComponent("Bullet").targetX=e.touchLocX-this.node.position.x,i.getComponent("Bullet").targetY=bulletTouch.touchLocY-this.node.position.y,i.active=!0,t.addChild(i)},connectAndSubscribe:function(){var e=new SockJS("http://localhost:8080//stompendpoint");cc.log("Connecting to WS...."),this.stompClient=Stomp.over(e);var t=this.stompClient;this.stompClient.connect({},function(e){console.log("Connected: "+e);t.subscribe("/room/movement",function(e){var t=JSON.parse(e.body);this.node.position=t.ps,this.node.rotation=t.rt}),t.subscribe("/room/newshot",function(e){var t=JSON.parse(e.body);this.addBulletToScene(t)})})}}),cc._RF.pop()},{}]},{},["Bullet","CameraControl","HeroControl"]);