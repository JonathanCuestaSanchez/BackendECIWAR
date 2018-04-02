require=function t(e,i,o){function s(c,a){if(!i[c]){if(!e[c]){var r="function"==typeof require&&require;if(!a&&r)return r(c,!0);if(n)return n(c,!0);var h=new Error("Cannot find module '"+c+"'");throw h.code="MODULE_NOT_FOUND",h}var l=i[c]={exports:{}};e[c][0].call(l.exports,function(t){var i=e[c][1][t];return s(i||t)},l,l.exports,t,e,i,o)}return i[c].exports}for(var n="function"==typeof require&&require,c=0;c<o.length;c++)s(o[c]);return s}({Bullet:[function(t,e,i){"use strict";cc._RF.push(e,"bd07dWfWENEjasZeb5tvq5z","Bullet"),cc.Class({extends:cc.Component,properties:{speed:2e3,targetX:0,targetY:0},onLoad:function(){},onCollisionEnter:function(t,e){"Kit"!=t.node.name&&this.node.destroy()},update:function(t){var e=Math.atan2(this.targetX,this.targetY);this.node.x+=this.speed*t*Math.sin(e),this.node.y+=this.speed*t*Math.cos(e)}}),cc._RF.pop()},{}],CameraControl:[function(t,e,i){"use strict";cc._RF.push(e,"25fa9oEi19GRoWsA924p5dD","CameraControl"),cc.Class({extends:cc.Component,properties:{target:{default:null,type:cc.Node},camera:cc.Camera,anim:cc.Animation,jumpZoom:!1,centerAtStart:!1,smoothFollow:!1,followX:{default:0,visible:function(){return this.smoothFollow}},followY:{default:0,visible:function(){return this.smoothFollow}},minFollowDist:{default:0,visible:function(){return this.smoothFollow}},followRatio:{default:0,visible:function(){return this.smoothFollow}},overview:!1,overviewTargets:{default:[],type:[cc.Node],visible:function(){return this.overview}},overviewMargin:{default:0,visible:function(){return this.overview}},speedZoom:!1,zoomInSpeed:{default:0,visible:function(){return this.speedZoom}},zoomOutSpeed:{default:0,visible:function(){return this.speedZoom}},canShake:!1,shakeDuration:{default:0,visible:function(){return this.canShake}},pointerPan:!1,pointerXMult:{default:0,visible:function(){return this.pointerPan}},pointerYMult:{default:0,visible:function(){return this.pointerPan}},useBoundaries:!1,topBound:{default:0,visible:function(){return this.useBoundaries}},bottomBound:{default:0,visible:function(){return this.useBoundaries}},leftBound:{default:0,visible:function(){return this.useBoundaries}},rightBound:{default:0,visible:function(){return this.useBoundaries}}},onLoad:function(){this.startFollow=!1;var t=cc.find("Canvas").getComponent(cc.Canvas);this.visibleSize=cc.view.getVisibleSize(),this.initZoomRatio=this.camera.zoomRatio,this.previousPos=this.node.position,this.pointerPan&&(this.overview=!1,this.speedZoom=!1,t.node.on("mousemove",this.onMouseMove,this),t.node.on("touchmove",this.onTouchMove,this),this.pointerPos=null),this.overview&&(this.jumpZoom=!1,this.speedZoom=!1),this.speedZoom&&(this.jumpZoom=!1)},onEnable:function(){cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera)},onDisable:function(){cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera)},lateUpdate:function(t){var e=void 0;e=(this.overview,this.target.position),this.smoothFollow?((Math.abs(e.x-this.node.x)>=this.followX||Math.abs(e.y-this.node.y)>=this.followY)&&(this.startFollow=!0),this.startFollow&&(this.node.position=this.node.position.lerp(e,this.followRatio),cc.pDistance(e,this.node.position)<=this.minFollowDist&&(this.startFollow=!1))):this.node.position=e,this.previousPos=e},getOverviewTargetsMidpoint:function(){for(var t=cc.p(0,0),e=99999,i=99999,o=-99999,s=-99999,n=0;n<this.overviewTargets.length;++n){var c=this.overviewTargets[n];o=c.x>o?c.x:o,e=c.x<e?c.x:e,s=c.y>s?c.y:s,i=c.y<i?c.y:i}o+=this.overviewMargin,e-=this.overviewMargin,s+=this.overviewMargin,i-=this.overviewMargin;var a=Math.abs(o-e),r=Math.abs(s-i);t=cc.p(e+a/2,i+r/2);var h=Math.max(a/this.visibleSize.width,r/this.visibleSize.height);return this.camera.zoomRatio=1/h,t},shakeCamera:function(){this.canShake&&(this.anim.play("shake"),this.scheduleOnce(this.stopShake.bind(this),this.shakeDuration))},stopShake:function(){this.anim.stop(),this.camera.node.position=cc.p(0,0)},onMouseMove:function(t){this.pointerPos=t.getLocation()},onTouchMove:function(t){this.pointerPos=t.getLocation()}}),cc._RF.pop()},{}],HeroControl:[function(t,e,i){"use strict";cc._RF.push(e,"f71dcKFhDRAspNw3w6SBhQq","HeroControl"),cc.Class({extends:cc.Component,properties:{speed:cc.v2(0,0),maxSpeed:cc.v2(400,400),drag:1e3,direction:0,directiony:0,jumpSpeed:0,bullet:{default:null,type:cc.Node},player2:{default:null,type:cc.Node},healthBar:{default:null,type:cc.ProgressBar}},onLoad:function(){this.isDead=!1,this.health=100,this.stompClient=null,this.pi=3.141516,this.id=Math.floor(1e7*Math.random()),cc.director.getCollisionManager().enabled=!0,cc.director.getCollisionManager().enabledDebugDraw=!0,cc.find("Camera").on(cc.Node.EventType.TOUCH_START,this.onTouchBegan,this),this.position=this.node.position,this.rotation=this.node.rotation,this.addBullet=this.addBulletToScene,this.connectAndSubscribe(),cc.eventManager.addListener({event:cc.EventListener.KEYBOARD,onKeyPressed:this.onKeyPressed.bind(this),onKeyReleased:this.onKeyReleased.bind(this)},this.node),cc.eventManager.addListener({event:cc.EventListener.MOUSE,onMouseMove:this.onMouseMove.bind(this)},this.node),this.collisionX=0,this.collisionY=0,this.prePosition=cc.v2(),this.preStep=cc.v2(),this.touchingNumber=0},onEnable:function(){cc.director.getCollisionManager().enabled=!0,cc.director.getCollisionManager().enabledDebugDraw=!0},onDisable:function(){cc.director.getCollisionManager().enabled=!1,cc.director.getCollisionManager().enabledDebugDraw=!1},onKeyPressed:function(t,e){if(!this.isDead)switch(t){case cc.KEY.a:case cc.KEY.left:this.direction=-1;break;case cc.KEY.d:case cc.KEY.right:this.direction=1;break;case cc.KEY.w:case cc.KEY.up:this.directiony=1;break;case cc.KEY.s:case cc.KEY.down:this.directiony=-1}},onKeyReleased:function(t,e){switch(t){case cc.KEY.a:case cc.KEY.left:case cc.KEY.d:case cc.KEY.right:this.direction=0;break;case cc.KEY.w:case cc.KEY.up:case cc.KEY.s:case cc.KEY.down:this.directiony=0}},onMouseMove:function(t){var e=Math.floor(t.getLocationX()),i=Math.floor(t.getLocationY()),o={x:e-this.node.position.x,y:i-this.node.position.y},s=Math.atan2(o.x,o.y);this.node.rotation=s*(180/this.pi)},onCollisionEnter:function(t,e){if("Bullet"==t.node.name)this.health-=10,this.healthBar.progress=this.health/100,this.health<=0&&(this.isDead=!0,this.node.color=cc.Color.RED);else if("Wall"==t.node.name){this.touchingNumber++;var i=t.world.aabb,o=t.world.preAabb.clone(),s=e.world.aabb,n=e.world.preAabb.clone();n.x=s.x,o.x=i.x,console.log("col"),cc.Intersection.rectRect(n,o)&&(n.xMax>o.xMax?this.collisionX=-1:n.xMin<o.xMin&&(this.collisionX=1),t.touchingX=!0),n.y=s.y,o.y=i.y,cc.Intersection.rectRect(n,o)&&(n.yMax>o.yMax?this.collisionY=-1:n.yMin<o.yMin&&(this.collisionY=1),t.touchingY=!0)}else"Kit"==t.node.name&&(this.health+=30,this.healthBar.progress=this.health/100)},onCollisionExit:function(t){0===--this.touchingNumber&&(this.node.color=cc.Color.WHITE),t.touchingX&&(this.collisionX=0,t.touchingX=!1),t.touchingY&&(t.touchingY=!1,this.collisionY=0)},update:function(t){0===this.direction?this.speed.x>0?(this.speed.x-=this.drag*t,this.speed.x<=0&&(this.speed.x=0)):this.speed.x<0&&(this.speed.x+=this.drag*t,this.speed.x>=0&&(this.speed.x=0)):(this.speed.x+=(this.direction>0?1:-1)*this.drag*t,Math.abs(this.speed.x)>this.maxSpeed.x&&(this.speed.x=this.speed.x>0?this.maxSpeed.x:-this.maxSpeed.x)),0===this.directiony?this.speed.y>0?(this.speed.y-=this.drag*t,this.speed.y<=0&&(this.speed.y=0)):this.speed.y<0&&(this.speed.y+=this.drag*t,this.speed.y>=0&&(this.speed.y=0)):(this.speed.y+=(this.directiony>0?1:-1)*this.drag*t,Math.abs(this.speed.y)>this.maxSpeed.y&&(this.speed.y=this.speed.y>0?this.maxSpeed.y:-this.maxSpeed.y)),0===this.speed.y&&0===this.speed.x||this.stompClient.send("/room/movement",{},JSON.stringify({id:this.id,ps:this.node.position,rt:this.node.rotation})),this.collisionY<0?this.speed.y>0&&(this.node.y+=this.speed.y*t):this.collisionY>0?this.speed.y<0&&(this.node.y+=this.speed.y*t):this.node.y+=this.speed.y*t,this.collisionX<0?this.speed.x>0&&(this.node.x+=this.speed.x*t):this.collisionX>0?this.speed.x<0&&(this.node.x+=this.speed.x*t):this.node.x+=this.speed.x*t},onTouchBegan:function(t){if(!this.isDead){var e=t.touch.getLocation();cc.log(this.node.position),this.stompClient.send("/room/newshot",{},JSON.stringify({id:this.id,touchLocX:e.x,touchLocY:e.y,position:this.node.position}))}},addBulletToScene:function(t,e){var i=cc.director.getScene();(e=cc.instantiate(e)).x=t.position.x,e.y=t.position.y,e.getComponent("Bullet").targetX=t.touchLocX-t.position.x,e.getComponent("Bullet").targetY=t.touchLocY-t.position.y,e.active=!0,i.addChild(e)},connectAndSubscribe:function(){var t=new SockJS("http://localhost:8080//stompendpoint");cc.log("Connecting to WS...."),this.stompClient=Stomp.over(t);var e=this.stompClient,i=(this.position,this.rotation,this.addBullet),o=this.bullet,s=this.player2,n=this.id;this.stompClient.connect({},function(t){console.log("Connected: "+t);e.subscribe("/room/movement",function(t){var e=JSON.parse(t.body);n!=e.id&&(s.position=e.ps,s.rotation=e.rt)}),e.subscribe("/room/newshot",function(t){var e=JSON.parse(t.body);i(e,o)})})}}),cc._RF.pop()},{}],Kit:[function(t,e,i){"use strict";cc._RF.push(e,"6dfadEsdTVGLbPiQ6Ew3I2X","Kit"),cc.Class({extends:cc.Component,properties:{},onLoad:function(){},onCollisionEnter:function(t,e){"Bullet"!=t.node.name&&this.node.destroy()}}),cc._RF.pop()},{}],MenuController:[function(t,e,i){"use strict";cc._RF.push(e,"a1ef8J/8lpINZUa6MX6yCNY","MenuController"),cc.Class({extends:cc.Component,properties:{username:null,inputName:{default:null,type:cc.EditBox},sendButton:{default:null,type:cc.Node}},onLoad:function(){},EditBoxDidEndEditing:function(t){this.username=this.inputName.string},onChangedScene:function(t){console.log(t)},buttonClicked:function(){cc.director.loadScene("game",this.onChangedScene(this.username))}}),cc._RF.pop()},{}],follow:[function(t,e,i){"use strict";cc._RF.push(e,"feb39Ti3uNP2Kj06Qnzgcqk","follow"),cc.Class({extends:cc.Component,properties:{target:{default:null,type:cc.Node}},onLoad:function(){if(this.node.active=!cc.sys.isMobile,this.target){var t=cc.follow(this.target,cc.rect(155,0,2325,1450));this.node.runAction(t)}}}),cc._RF.pop()},{}]},{},["Bullet","CameraControl","HeroControl","Kit","follow","MenuController"]);