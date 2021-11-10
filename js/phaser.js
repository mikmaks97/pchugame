!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&false)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.p2=e()}}(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){var Scalar=_dereq_('./Scalar');module.exports=Line;function Line(){};Line.lineInt=function(l1,l2,precision){precision=precision||0;var i=[0,0];var a1,b1,c1,a2,b2,c2,det;a1=l1[1][1]-l1[0][1];b1=l1[0][0]-l1[1][0];c1=a1*l1[0][0]+b1*l1[0][1];a2=l2[1][1]-l2[0][1];b2=l2[0][0]-l2[1][0];c2=a2*l2[0][0]+b2*l2[0][1];det=a1*b2-a2*b1;if(!Scalar.eq(det,0,precision)){i[0]=(b2*c1-b1*c2)/ det;i[1]=(a1*c2-a2*c1)/ det;}
return i;};Line.segmentsIntersect=function(p1,p2,q1,q2){var dx=p2[0]-p1[0];var dy=p2[1]-p1[1];var da=q2[0]-q1[0];var db=q2[1]-q1[1];if(da*dy-db*dx==0)
return false;var s=(dx*(q1[1]-p1[1])+dy*(p1[0]-q1[0]))/(da*dy-db*dx)
var t=(da*(p1[1]-q1[1])+db*(q1[0]-p1[0]))/(db*dx-da*dy)
return(s>=0&&s<=1&&t>=0&&t<=1);};},{"./Scalar":4}],2:[function(_dereq_,module,exports){module.exports=Point;function Point(){};Point.area=function(a,b,c){return(((b[0]-a[0])*(c[1]-a[1]))-((c[0]-a[0])*(b[1]-a[1])));};Point.left=function(a,b,c){return Point.area(a,b,c)>0;};Point.leftOn=function(a,b,c){return Point.area(a,b,c)>=0;};Point.right=function(a,b,c){return Point.area(a,b,c)<0;};Point.rightOn=function(a,b,c){return Point.area(a,b,c)<=0;};var tmpPoint1=[],tmpPoint2=[];Point.collinear=function(a,b,c,thresholdAngle){if(!thresholdAngle)
return Point.area(a,b,c)==0;else{var ab=tmpPoint1,bc=tmpPoint2;ab[0]=b[0]-a[0];ab[1]=b[1]-a[1];bc[0]=c[0]-b[0];bc[1]=c[1]-b[1];var dot=ab[0]*bc[0]+ab[1]*bc[1],magA=Math.sqrt(ab[0]*ab[0]+ab[1]*ab[1]),magB=Math.sqrt(bc[0]*bc[0]+bc[1]*bc[1]),angle=Math.acos(dot/(magA*magB));return angle<thresholdAngle;}};Point.sqdist=function(a,b){var dx=b[0]-a[0];var dy=b[1]-a[1];return dx*dx+dy*dy;};},{}],3:[function(_dereq_,module,exports){var Line=_dereq_("./Line"),Point=_dereq_("./Point"),Scalar=_dereq_("./Scalar")
module.exports=Polygon;function Polygon(){this.vertices=[];}
Polygon.prototype.at=function(i){var v=this.vertices,s=v.length;return v[i<0?i%s+s:i%s];};Polygon.prototype.first=function(){return this.vertices[0];};Polygon.prototype.last=function(){return this.vertices[this.vertices.length-1];};Polygon.prototype.clear=function(){this.vertices.length=0;};Polygon.prototype.append=function(poly,from,to){if(typeof(from)=="undefined")throw new Error("From is not given!");if(typeof(to)=="undefined")throw new Error("To is not given!");if(to-1<from)throw new Error("lol1");if(to>poly.vertices.length)throw new Error("lol2");if(from<0)throw new Error("lol3");for(var i=from;i<to;i++){this.vertices.push(poly.vertices[i]);}};Polygon.prototype.makeCCW=function(){var br=0,v=this.vertices;for(var i=1;i<this.vertices.length;++i){if(v[i][1]<v[br][1]||(v[i][1]==v[br][1]&&v[i][0]>v[br][0])){br=i;}}
if(!Point.left(this.at(br-1),this.at(br),this.at(br+1))){this.reverse();}};Polygon.prototype.reverse=function(){var tmp=[];for(var i=0,N=this.vertices.length;i!==N;i++){tmp.push(this.vertices.pop());}
this.vertices=tmp;};Polygon.prototype.isReflex=function(i){return Point.right(this.at(i-1),this.at(i),this.at(i+1));};var tmpLine1=[],tmpLine2=[];Polygon.prototype.canSee=function(a,b){var p,dist,l1=tmpLine1,l2=tmpLine2;if(Point.leftOn(this.at(a+1),this.at(a),this.at(b))&&Point.rightOn(this.at(a-1),this.at(a),this.at(b))){return false;}
dist=Point.sqdist(this.at(a),this.at(b));for(var i=0;i!==this.vertices.length;++i){if((i+1)%this.vertices.length===a||i===a)
continue;if(Point.leftOn(this.at(a),this.at(b),this.at(i+1))&&Point.rightOn(this.at(a),this.at(b),this.at(i))){l1[0]=this.at(a);l1[1]=this.at(b);l2[0]=this.at(i);l2[1]=this.at(i+1);p=Line.lineInt(l1,l2);if(Point.sqdist(this.at(a),p)<dist){return false;}}}
return true;};Polygon.prototype.copy=function(i,j,targetPoly){var p=targetPoly||new Polygon();p.clear();if(i<j){for(var k=i;k<=j;k++)
p.vertices.push(this.vertices[k]);}else{for(var k=0;k<=j;k++)
p.vertices.push(this.vertices[k]);for(var k=i;k<this.vertices.length;k++)
p.vertices.push(this.vertices[k]);}
return p;};Polygon.prototype.getCutEdges=function(){var min=[],tmp1=[],tmp2=[],tmpPoly=new Polygon();var nDiags=Number.MAX_VALUE;for(var i=0;i<this.vertices.length;++i){if(this.isReflex(i)){for(var j=0;j<this.vertices.length;++j){if(this.canSee(i,j)){tmp1=this.copy(i,j,tmpPoly).getCutEdges();tmp2=this.copy(j,i,tmpPoly).getCutEdges();for(var k=0;k<tmp2.length;k++)
tmp1.push(tmp2[k]);if(tmp1.length<nDiags){min=tmp1;nDiags=tmp1.length;min.push([this.at(i),this.at(j)]);}}}}}
return min;};Polygon.prototype.decomp=function(){var edges=this.getCutEdges();if(edges.length>0)
return this.slice(edges);else
return[this];};Polygon.prototype.slice=function(cutEdges){if(cutEdges.length==0)return[this];if(cutEdges instanceof Array&&cutEdges.length&&cutEdges[0]instanceof Array&&cutEdges[0].length==2&&cutEdges[0][0]instanceof Array){var polys=[this];for(var i=0;i<cutEdges.length;i++){var cutEdge=cutEdges[i];for(var j=0;j<polys.length;j++){var poly=polys[j];var result=poly.slice(cutEdge);if(result){polys.splice(j,1);polys.push(result[0],result[1]);break;}}}
return polys;}else{var cutEdge=cutEdges;var i=this.vertices.indexOf(cutEdge[0]);var j=this.vertices.indexOf(cutEdge[1]);if(i!=-1&&j!=-1){return[this.copy(i,j),this.copy(j,i)];}else{return false;}}};Polygon.prototype.isSimple=function(){var path=this.vertices;for(var i=0;i<path.length-1;i++){for(var j=0;j<i-1;j++){if(Line.segmentsIntersect(path[i],path[i+1],path[j],path[j+1])){return false;}}}
for(var i=1;i<path.length-2;i++){if(Line.segmentsIntersect(path[0],path[path.length-1],path[i],path[i+1])){return false;}}
return true;};function getIntersectionPoint(p1,p2,q1,q2,delta){delta=delta||0;var a1=p2[1]-p1[1];var b1=p1[0]-p2[0];var c1=(a1*p1[0])+(b1*p1[1]);var a2=q2[1]-q1[1];var b2=q1[0]-q2[0];var c2=(a2*q1[0])+(b2*q1[1]);var det=(a1*b2)-(a2*b1);if(!Scalar.eq(det,0,delta))
return[((b2*c1)-(b1*c2))/ det,((a1*c2)-(a2*c1))/ det]
else
return[0,0]}
Polygon.prototype.quickDecomp=function(result,reflexVertices,steinerPoints,delta,maxlevel,level){maxlevel=maxlevel||100;level=level||0;delta=delta||25;result=typeof(result)!="undefined"?result:[];reflexVertices=reflexVertices||[];steinerPoints=steinerPoints||[];var upperInt=[0,0],lowerInt=[0,0],p=[0,0];var upperDist=0,lowerDist=0,d=0,closestDist=0;var upperIndex=0,lowerIndex=0,closestIndex=0;var lowerPoly=new Polygon(),upperPoly=new Polygon();var poly=this,v=this.vertices;if(v.length<3)return result;level++;if(level>maxlevel){console.warn("quickDecomp: max level ("+maxlevel+") reached.");return result;}
for(var i=0;i<this.vertices.length;++i){if(poly.isReflex(i)){reflexVertices.push(poly.vertices[i]);upperDist=lowerDist=Number.MAX_VALUE;for(var j=0;j<this.vertices.length;++j){if(Point.left(poly.at(i-1),poly.at(i),poly.at(j))&&Point.rightOn(poly.at(i-1),poly.at(i),poly.at(j-1))){p=getIntersectionPoint(poly.at(i-1),poly.at(i),poly.at(j),poly.at(j-1));if(Point.right(poly.at(i+1),poly.at(i),p)){d=Point.sqdist(poly.vertices[i],p);if(d<lowerDist){lowerDist=d;lowerInt=p;lowerIndex=j;}}}
if(Point.left(poly.at(i+1),poly.at(i),poly.at(j+1))&&Point.rightOn(poly.at(i+1),poly.at(i),poly.at(j))){p=getIntersectionPoint(poly.at(i+1),poly.at(i),poly.at(j),poly.at(j+1));if(Point.left(poly.at(i-1),poly.at(i),p)){d=Point.sqdist(poly.vertices[i],p);if(d<upperDist){upperDist=d;upperInt=p;upperIndex=j;}}}}
if(lowerIndex==(upperIndex+1)%this.vertices.length){p[0]=(lowerInt[0]+upperInt[0])/ 2;p[1]=(lowerInt[1]+upperInt[1])/ 2;steinerPoints.push(p);if(i<upperIndex){lowerPoly.append(poly,i,upperIndex+1);lowerPoly.vertices.push(p);upperPoly.vertices.push(p);if(lowerIndex!=0){upperPoly.append(poly,lowerIndex,poly.vertices.length);}
upperPoly.append(poly,0,i+1);}else{if(i!=0){lowerPoly.append(poly,i,poly.vertices.length);}
lowerPoly.append(poly,0,upperIndex+1);lowerPoly.vertices.push(p);upperPoly.vertices.push(p);upperPoly.append(poly,lowerIndex,i+1);}}else{if(lowerIndex>upperIndex){upperIndex+=this.vertices.length;}
closestDist=Number.MAX_VALUE;if(upperIndex<lowerIndex){return result;}
for(var j=lowerIndex;j<=upperIndex;++j){if(Point.leftOn(poly.at(i-1),poly.at(i),poly.at(j))&&Point.rightOn(poly.at(i+1),poly.at(i),poly.at(j))){d=Point.sqdist(poly.at(i),poly.at(j));if(d<closestDist){closestDist=d;closestIndex=j%this.vertices.length;}}}
if(i<closestIndex){lowerPoly.append(poly,i,closestIndex+1);if(closestIndex!=0){upperPoly.append(poly,closestIndex,v.length);}
upperPoly.append(poly,0,i+1);}else{if(i!=0){lowerPoly.append(poly,i,v.length);}
lowerPoly.append(poly,0,closestIndex+1);upperPoly.append(poly,closestIndex,i+1);}}
if(lowerPoly.vertices.length<upperPoly.vertices.length){lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);}else{upperPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);lowerPoly.quickDecomp(result,reflexVertices,steinerPoints,delta,maxlevel,level);}
return result;}}
result.push(this);return result;};Polygon.prototype.removeCollinearPoints=function(precision){var num=0;for(var i=this.vertices.length-1;this.vertices.length>3&&i>=0;--i){if(Point.collinear(this.at(i-1),this.at(i),this.at(i+1),precision)){this.vertices.splice(i%this.vertices.length,1);i--;num++;}}
return num;};},{"./Line":1,"./Point":2,"./Scalar":4}],4:[function(_dereq_,module,exports){module.exports=Scalar;function Scalar(){}
Scalar.eq=function(a,b,precision){precision=precision||0;return Math.abs(a-b)<precision;};},{}],5:[function(_dereq_,module,exports){module.exports={Polygon:_dereq_("./Polygon"),Point:_dereq_("./Point"),};},{"./Point":2,"./Polygon":3}],6:[function(_dereq_,module,exports){module.exports={"name":"p2","version":"0.7.0","description":"A JavaScript 2D physics engine.","author":"Stefan Hedman <schteppe@gmail.com> (http://steffe.se)","keywords":["p2.js","p2","physics","engine","2d"],"main":"./src/p2.js","engines":{"node":"*"},"repository":{"type":"git","url":"https://github.com/schteppe/p2.js.git"},"bugs":{"url":"https://github.com/schteppe/p2.js/issues"},"licenses":[{"type":"MIT"}],"devDependencies":{"grunt":"^0.4.5","grunt-contrib-jshint":"^0.11.2","grunt-contrib-nodeunit":"^0.4.1","grunt-contrib-uglify":"~0.4.0","grunt-contrib-watch":"~0.5.0","grunt-browserify":"~2.0.1","grunt-contrib-concat":"^0.4.0"},"dependencies":{"poly-decomp":"0.1.0"}}},{}],7:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),Utils=_dereq_('../utils/Utils');module.exports=AABB;function AABB(options){this.lowerBound=vec2.create();if(options&&options.lowerBound){vec2.copy(this.lowerBound,options.lowerBound);}
this.upperBound=vec2.create();if(options&&options.upperBound){vec2.copy(this.upperBound,options.upperBound);}}
var tmp=vec2.create();AABB.prototype.setFromPoints=function(points,position,angle,skinSize){var l=this.lowerBound,u=this.upperBound;if(typeof(angle)!=="number"){angle=0;}
if(angle!==0){vec2.rotate(l,points[0],angle);}else{vec2.copy(l,points[0]);}
vec2.copy(u,l);var cosAngle=Math.cos(angle),sinAngle=Math.sin(angle);for(var i=1;i<points.length;i++){var p=points[i];if(angle!==0){var x=p[0],y=p[1];tmp[0]=cosAngle*x-sinAngle*y;tmp[1]=sinAngle*x+cosAngle*y;p=tmp;}
for(var j=0;j<2;j++){if(p[j]>u[j]){u[j]=p[j];}
if(p[j]<l[j]){l[j]=p[j];}}}
if(position){vec2.add(this.lowerBound,this.lowerBound,position);vec2.add(this.upperBound,this.upperBound,position);}
if(skinSize){this.lowerBound[0]-=skinSize;this.lowerBound[1]-=skinSize;this.upperBound[0]+=skinSize;this.upperBound[1]+=skinSize;}};AABB.prototype.copy=function(aabb){vec2.copy(this.lowerBound,aabb.lowerBound);vec2.copy(this.upperBound,aabb.upperBound);};AABB.prototype.extend=function(aabb){var i=2;while(i--){var l=aabb.lowerBound[i];if(this.lowerBound[i]>l){this.lowerBound[i]=l;}
var u=aabb.upperBound[i];if(this.upperBound[i]<u){this.upperBound[i]=u;}}};AABB.prototype.overlaps=function(aabb){var l1=this.lowerBound,u1=this.upperBound,l2=aabb.lowerBound,u2=aabb.upperBound;return((l2[0]<=u1[0]&&u1[0]<=u2[0])||(l1[0]<=u2[0]&&u2[0]<=u1[0]))&&((l2[1]<=u1[1]&&u1[1]<=u2[1])||(l1[1]<=u2[1]&&u2[1]<=u1[1]));};AABB.prototype.containsPoint=function(point){var l=this.lowerBound,u=this.upperBound;return l[0]<=point[0]&&point[0]<=u[0]&&l[1]<=point[1]&&point[1]<=u[1];};AABB.prototype.overlapsRay=function(ray){var t=0;var dirFracX=1 / ray.direction[0];var dirFracY=1 / ray.direction[1];var t1=(this.lowerBound[0]-ray.from[0])*dirFracX;var t2=(this.upperBound[0]-ray.from[0])*dirFracX;var t3=(this.lowerBound[1]-ray.from[1])*dirFracY;var t4=(this.upperBound[1]-ray.from[1])*dirFracY;var tmin=Math.max(Math.max(Math.min(t1,t2),Math.min(t3,t4)));var tmax=Math.min(Math.min(Math.max(t1,t2),Math.max(t3,t4)));if(tmax<0){return-1;}
if(tmin>tmax){return-1;}
return tmin;};},{"../math/vec2":30,"../utils/Utils":57}],8:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Body=_dereq_('../objects/Body');module.exports=Broadphase;function Broadphase(type){this.type=type;this.result=[];this.world=null;this.boundingVolumeType=Broadphase.AABB;}
Broadphase.AABB=1;Broadphase.BOUNDING_CIRCLE=2;Broadphase.prototype.setWorld=function(world){this.world=world;};Broadphase.prototype.getCollisionPairs=function(world){};var dist=vec2.create();Broadphase.boundingRadiusCheck=function(bodyA,bodyB){vec2.sub(dist,bodyA.position,bodyB.position);var d2=vec2.squaredLength(dist),r=bodyA.boundingRadius+bodyB.boundingRadius;return d2<=r*r;};Broadphase.aabbCheck=function(bodyA,bodyB){return bodyA.getAABB().overlaps(bodyB.getAABB());};Broadphase.prototype.boundingVolumeCheck=function(bodyA,bodyB){var result;switch(this.boundingVolumeType){case Broadphase.BOUNDING_CIRCLE:result=Broadphase.boundingRadiusCheck(bodyA,bodyB);break;case Broadphase.AABB:result=Broadphase.aabbCheck(bodyA,bodyB);break;default:throw new Error('Bounding volume type not recognized: '+this.boundingVolumeType);}
return result;};Broadphase.canCollide=function(bodyA,bodyB){var KINEMATIC=Body.KINEMATIC;var STATIC=Body.STATIC;if(bodyA.type===STATIC&&bodyB.type===STATIC){return false;}
if((bodyA.type===KINEMATIC&&bodyB.type===STATIC)||(bodyA.type===STATIC&&bodyB.type===KINEMATIC)){return false;}
if(bodyA.type===KINEMATIC&&bodyB.type===KINEMATIC){return false;}
if(bodyA.sleepState===Body.SLEEPING&&bodyB.sleepState===Body.SLEEPING){return false;}
if((bodyA.sleepState===Body.SLEEPING&&bodyB.type===STATIC)||(bodyB.sleepState===Body.SLEEPING&&bodyA.type===STATIC)){return false;}
return true;};Broadphase.NAIVE=1;Broadphase.SAP=2;},{"../math/vec2":30,"../objects/Body":31}],9:[function(_dereq_,module,exports){var Circle=_dereq_('../shapes/Circle'),Plane=_dereq_('../shapes/Plane'),Shape=_dereq_('../shapes/Shape'),Particle=_dereq_('../shapes/Particle'),Broadphase=_dereq_('../collision/Broadphase'),vec2=_dereq_('../math/vec2');module.exports=NaiveBroadphase;function NaiveBroadphase(){Broadphase.call(this,Broadphase.NAIVE);}
NaiveBroadphase.prototype=new Broadphase();NaiveBroadphase.prototype.constructor=NaiveBroadphase;NaiveBroadphase.prototype.getCollisionPairs=function(world){var bodies=world.bodies,result=this.result;result.length=0;for(var i=0,Ncolliding=bodies.length;i!==Ncolliding;i++){var bi=bodies[i];for(var j=0;j<i;j++){var bj=bodies[j];if(Broadphase.canCollide(bi,bj)&&this.boundingVolumeCheck(bi,bj)){result.push(bi,bj);}}}
return result;};NaiveBroadphase.prototype.aabbQuery=function(world,aabb,result){result=result||[];var bodies=world.bodies;for(var i=0;i<bodies.length;i++){var b=bodies[i];if(b.aabbNeedsUpdate){b.updateAABB();}
if(b.aabb.overlaps(aabb)){result.push(b);}}
return result;};},{"../collision/Broadphase":8,"../math/vec2":30,"../shapes/Circle":39,"../shapes/Particle":43,"../shapes/Plane":44,"../shapes/Shape":45}],10:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),sub=vec2.sub,add=vec2.add,dot=vec2.dot,Utils=_dereq_('../utils/Utils'),ContactEquationPool=_dereq_('../utils/ContactEquationPool'),FrictionEquationPool=_dereq_('../utils/FrictionEquationPool'),TupleDictionary=_dereq_('../utils/TupleDictionary'),Equation=_dereq_('../equations/Equation'),ContactEquation=_dereq_('../equations/ContactEquation'),FrictionEquation=_dereq_('../equations/FrictionEquation'),Circle=_dereq_('../shapes/Circle'),Convex=_dereq_('../shapes/Convex'),Shape=_dereq_('../shapes/Shape'),Body=_dereq_('../objects/Body'),Box=_dereq_('../shapes/Box');module.exports=Narrowphase;var yAxis=vec2.fromValues(0,1);var tmp1=vec2.fromValues(0,0),tmp2=vec2.fromValues(0,0),tmp3=vec2.fromValues(0,0),tmp4=vec2.fromValues(0,0),tmp5=vec2.fromValues(0,0),tmp6=vec2.fromValues(0,0),tmp7=vec2.fromValues(0,0),tmp8=vec2.fromValues(0,0),tmp9=vec2.fromValues(0,0),tmp10=vec2.fromValues(0,0),tmp11=vec2.fromValues(0,0),tmp12=vec2.fromValues(0,0),tmp13=vec2.fromValues(0,0),tmp14=vec2.fromValues(0,0),tmp15=vec2.fromValues(0,0),tmp16=vec2.fromValues(0,0),tmp17=vec2.fromValues(0,0),tmp18=vec2.fromValues(0,0),tmpArray=[];function Narrowphase(){this.contactEquations=[];this.frictionEquations=[];this.enableFriction=true;this.enabledEquations=true;this.slipForce=10.0;this.frictionCoefficient=0.3;this.surfaceVelocity=0;this.contactEquationPool=new ContactEquationPool({size:32});this.frictionEquationPool=new FrictionEquationPool({size:64});this.restitution=0;this.stiffness=Equation.DEFAULT_STIFFNESS;this.relaxation=Equation.DEFAULT_RELAXATION;this.frictionStiffness=Equation.DEFAULT_STIFFNESS;this.frictionRelaxation=Equation.DEFAULT_RELAXATION;this.enableFrictionReduction=true;this.collidingBodiesLastStep=new TupleDictionary();this.contactSkinSize=0.01;}
var bodiesOverlap_shapePositionA=vec2.create();var bodiesOverlap_shapePositionB=vec2.create();Narrowphase.prototype.bodiesOverlap=function(bodyA,bodyB){var shapePositionA=bodiesOverlap_shapePositionA;var shapePositionB=bodiesOverlap_shapePositionB;for(var k=0,Nshapesi=bodyA.shapes.length;k!==Nshapesi;k++){var shapeA=bodyA.shapes[k];bodyA.toWorldFrame(shapePositionA,shapeA.position);for(var l=0,Nshapesj=bodyB.shapes.length;l!==Nshapesj;l++){var shapeB=bodyB.shapes[l];bodyB.toWorldFrame(shapePositionB,shapeB.position);if(this[shapeA.type|shapeB.type](bodyA,shapeA,shapePositionA,shapeA.angle+bodyA.angle,bodyB,shapeB,shapePositionB,shapeB.angle+bodyB.angle,true)){return true;}}}
return false;};Narrowphase.prototype.collidedLastStep=function(bodyA,bodyB){var id1=bodyA.id|0,id2=bodyB.id|0;return!!this.collidingBodiesLastStep.get(id1,id2);};Narrowphase.prototype.reset=function(){this.collidingBodiesLastStep.reset();var eqs=this.contactEquations;var l=eqs.length;while(l--){var eq=eqs[l],id1=eq.bodyA.id,id2=eq.bodyB.id;this.collidingBodiesLastStep.set(id1,id2,true);}
var ce=this.contactEquations,fe=this.frictionEquations;for(var i=0;i<ce.length;i++){this.contactEquationPool.release(ce[i]);}
for(var i=0;i<fe.length;i++){this.frictionEquationPool.release(fe[i]);}
this.contactEquations.length=this.frictionEquations.length=0;};Narrowphase.prototype.createContactEquation=function(bodyA,bodyB,shapeA,shapeB){var c=this.contactEquationPool.get();c.bodyA=bodyA;c.bodyB=bodyB;c.shapeA=shapeA;c.shapeB=shapeB;c.restitution=this.restitution;c.firstImpact=!this.collidedLastStep(bodyA,bodyB);c.stiffness=this.stiffness;c.relaxation=this.relaxation;c.needsUpdate=true;c.enabled=this.enabledEquations;c.offset=this.contactSkinSize;return c;};Narrowphase.prototype.createFrictionEquation=function(bodyA,bodyB,shapeA,shapeB){var c=this.frictionEquationPool.get();c.bodyA=bodyA;c.bodyB=bodyB;c.shapeA=shapeA;c.shapeB=shapeB;c.setSlipForce(this.slipForce);c.frictionCoefficient=this.frictionCoefficient;c.relativeVelocity=this.surfaceVelocity;c.enabled=this.enabledEquations;c.needsUpdate=true;c.stiffness=this.frictionStiffness;c.relaxation=this.frictionRelaxation;c.contactEquations.length=0;return c;};Narrowphase.prototype.createFrictionFromContact=function(c){var eq=this.createFrictionEquation(c.bodyA,c.bodyB,c.shapeA,c.shapeB);vec2.copy(eq.contactPointA,c.contactPointA);vec2.copy(eq.contactPointB,c.contactPointB);vec2.rotate90cw(eq.t,c.normalA);eq.contactEquations.push(c);return eq;};Narrowphase.prototype.createFrictionFromAverage=function(numContacts){var c=this.contactEquations[this.contactEquations.length-1];var eq=this.createFrictionEquation(c.bodyA,c.bodyB,c.shapeA,c.shapeB);var bodyA=c.bodyA;var bodyB=c.bodyB;vec2.set(eq.contactPointA,0,0);vec2.set(eq.contactPointB,0,0);vec2.set(eq.t,0,0);for(var i=0;i!==numContacts;i++){c=this.contactEquations[this.contactEquations.length-1-i];if(c.bodyA===bodyA){vec2.add(eq.t,eq.t,c.normalA);vec2.add(eq.contactPointA,eq.contactPointA,c.contactPointA);vec2.add(eq.contactPointB,eq.contactPointB,c.contactPointB);}else{vec2.sub(eq.t,eq.t,c.normalA);vec2.add(eq.contactPointA,eq.contactPointA,c.contactPointB);vec2.add(eq.contactPointB,eq.contactPointB,c.contactPointA);}
eq.contactEquations.push(c);}
var invNumContacts=1/numContacts;vec2.scale(eq.contactPointA,eq.contactPointA,invNumContacts);vec2.scale(eq.contactPointB,eq.contactPointB,invNumContacts);vec2.normalize(eq.t,eq.t);vec2.rotate90cw(eq.t,eq.t);return eq;};Narrowphase.prototype[Shape.LINE|Shape.CONVEX]=Narrowphase.prototype.convexLine=function(convexBody,convexShape,convexOffset,convexAngle,lineBody,lineShape,lineOffset,lineAngle,justTest){if(justTest){return false;}else{return 0;}};Narrowphase.prototype[Shape.LINE|Shape.BOX]=Narrowphase.prototype.lineBox=function(lineBody,lineShape,lineOffset,lineAngle,boxBody,boxShape,boxOffset,boxAngle,justTest){if(justTest){return false;}else{return 0;}};function setConvexToCapsuleShapeMiddle(convexShape,capsuleShape){vec2.set(convexShape.vertices[0],-capsuleShape.length*0.5,-capsuleShape.radius);vec2.set(convexShape.vertices[1],capsuleShape.length*0.5,-capsuleShape.radius);vec2.set(convexShape.vertices[2],capsuleShape.length*0.5,capsuleShape.radius);vec2.set(convexShape.vertices[3],-capsuleShape.length*0.5,capsuleShape.radius);}
var convexCapsule_tempRect=new Box({width:1,height:1}),convexCapsule_tempVec=vec2.create();Narrowphase.prototype[Shape.CAPSULE|Shape.CONVEX]=Narrowphase.prototype[Shape.CAPSULE|Shape.BOX]=Narrowphase.prototype.convexCapsule=function(convexBody,convexShape,convexPosition,convexAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){var circlePos=convexCapsule_tempVec;vec2.set(circlePos,capsuleShape.length/2,0);vec2.rotate(circlePos,circlePos,capsuleAngle);vec2.add(circlePos,circlePos,capsulePosition);var result1=this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle,convexBody,convexShape,convexPosition,convexAngle,justTest,capsuleShape.radius);vec2.set(circlePos,-capsuleShape.length/2,0);vec2.rotate(circlePos,circlePos,capsuleAngle);vec2.add(circlePos,circlePos,capsulePosition);var result2=this.circleConvex(capsuleBody,capsuleShape,circlePos,capsuleAngle,convexBody,convexShape,convexPosition,convexAngle,justTest,capsuleShape.radius);if(justTest&&(result1||result2)){return true;}
var r=convexCapsule_tempRect;setConvexToCapsuleShapeMiddle(r,capsuleShape);var result=this.convexConvex(convexBody,convexShape,convexPosition,convexAngle,capsuleBody,r,capsulePosition,capsuleAngle,justTest);return result+result1+result2;};Narrowphase.prototype[Shape.CAPSULE|Shape.LINE]=Narrowphase.prototype.lineCapsule=function(lineBody,lineShape,linePosition,lineAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){if(justTest){return false;}else{return 0;}};var capsuleCapsule_tempVec1=vec2.create();var capsuleCapsule_tempVec2=vec2.create();var capsuleCapsule_tempRect1=new Box({width:1,height:1});Narrowphase.prototype[Shape.CAPSULE|Shape.CAPSULE]=Narrowphase.prototype.capsuleCapsule=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){var enableFrictionBefore;var circlePosi=capsuleCapsule_tempVec1,circlePosj=capsuleCapsule_tempVec2;var numContacts=0;for(var i=0;i<2;i++){vec2.set(circlePosi,(i===0?-1:1)*si.length/2,0);vec2.rotate(circlePosi,circlePosi,ai);vec2.add(circlePosi,circlePosi,xi);for(var j=0;j<2;j++){vec2.set(circlePosj,(j===0?-1:1)*sj.length/2,0);vec2.rotate(circlePosj,circlePosj,aj);vec2.add(circlePosj,circlePosj,xj);if(this.enableFrictionReduction){enableFrictionBefore=this.enableFriction;this.enableFriction=false;}
var result=this.circleCircle(bi,si,circlePosi,ai,bj,sj,circlePosj,aj,justTest,si.radius,sj.radius);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}
if(justTest&&result){return true;}
numContacts+=result;}}
if(this.enableFrictionReduction){enableFrictionBefore=this.enableFriction;this.enableFriction=false;}
var rect=capsuleCapsule_tempRect1;setConvexToCapsuleShapeMiddle(rect,si);var result1=this.convexCapsule(bi,rect,xi,ai,bj,sj,xj,aj,justTest);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}
if(justTest&&result1){return true;}
numContacts+=result1;if(this.enableFrictionReduction){var enableFrictionBefore=this.enableFriction;this.enableFriction=false;}
setConvexToCapsuleShapeMiddle(rect,sj);var result2=this.convexCapsule(bj,rect,xj,aj,bi,si,xi,ai,justTest);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}
if(justTest&&result2){return true;}
numContacts+=result2;if(this.enableFrictionReduction){if(numContacts&&this.enableFriction){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}
return numContacts;};Narrowphase.prototype[Shape.LINE|Shape.LINE]=Narrowphase.prototype.lineLine=function(bodyA,shapeA,positionA,angleA,bodyB,shapeB,positionB,angleB,justTest){if(justTest){return false;}else{return 0;}};Narrowphase.prototype[Shape.PLANE|Shape.LINE]=Narrowphase.prototype.planeLine=function(planeBody,planeShape,planeOffset,planeAngle,lineBody,lineShape,lineOffset,lineAngle,justTest){var worldVertex0=tmp1,worldVertex1=tmp2,worldVertex01=tmp3,worldVertex11=tmp4,worldEdge=tmp5,worldEdgeUnit=tmp6,dist=tmp7,worldNormal=tmp8,worldTangent=tmp9,verts=tmpArray,numContacts=0;vec2.set(worldVertex0,-lineShape.length/2,0);vec2.set(worldVertex1,lineShape.length/2,0);vec2.rotate(worldVertex01,worldVertex0,lineAngle);vec2.rotate(worldVertex11,worldVertex1,lineAngle);add(worldVertex01,worldVertex01,lineOffset);add(worldVertex11,worldVertex11,lineOffset);vec2.copy(worldVertex0,worldVertex01);vec2.copy(worldVertex1,worldVertex11);sub(worldEdge,worldVertex1,worldVertex0);vec2.normalize(worldEdgeUnit,worldEdge);vec2.rotate90cw(worldTangent,worldEdgeUnit);vec2.rotate(worldNormal,yAxis,planeAngle);verts[0]=worldVertex0;verts[1]=worldVertex1;for(var i=0;i<verts.length;i++){var v=verts[i];sub(dist,v,planeOffset);var d=dot(dist,worldNormal);if(d<0){if(justTest){return true;}
var c=this.createContactEquation(planeBody,lineBody,planeShape,lineShape);numContacts++;vec2.copy(c.normalA,worldNormal);vec2.normalize(c.normalA,c.normalA);vec2.scale(dist,worldNormal,d);sub(c.contactPointA,v,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);sub(c.contactPointB,v,lineOffset);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}
if(justTest){return false;}
if(!this.enableFrictionReduction){if(numContacts&&this.enableFriction){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}
return numContacts;};Narrowphase.prototype[Shape.PARTICLE|Shape.CAPSULE]=Narrowphase.prototype.particleCapsule=function(particleBody,particleShape,particlePosition,particleAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest){return this.circleLine(particleBody,particleShape,particlePosition,particleAngle,capsuleBody,capsuleShape,capsulePosition,capsuleAngle,justTest,capsuleShape.radius,0);};Narrowphase.prototype[Shape.CIRCLE|Shape.LINE]=Narrowphase.prototype.circleLine=function(circleBody,circleShape,circleOffset,circleAngle,lineBody,lineShape,lineOffset,lineAngle,justTest,lineRadius,circleRadius){var lineRadius=lineRadius||0,circleRadius=typeof(circleRadius)!=="undefined"?circleRadius:circleShape.radius,orthoDist=tmp1,lineToCircleOrthoUnit=tmp2,projectedPoint=tmp3,centerDist=tmp4,worldTangent=tmp5,worldEdge=tmp6,worldEdgeUnit=tmp7,worldVertex0=tmp8,worldVertex1=tmp9,worldVertex01=tmp10,worldVertex11=tmp11,dist=tmp12,lineToCircle=tmp13,lineEndToLineRadius=tmp14,verts=tmpArray;vec2.set(worldVertex0,-lineShape.length/2,0);vec2.set(worldVertex1,lineShape.length/2,0);vec2.rotate(worldVertex01,worldVertex0,lineAngle);vec2.rotate(worldVertex11,worldVertex1,lineAngle);add(worldVertex01,worldVertex01,lineOffset);add(worldVertex11,worldVertex11,lineOffset);vec2.copy(worldVertex0,worldVertex01);vec2.copy(worldVertex1,worldVertex11);sub(worldEdge,worldVertex1,worldVertex0);vec2.normalize(worldEdgeUnit,worldEdge);vec2.rotate90cw(worldTangent,worldEdgeUnit);sub(dist,circleOffset,worldVertex0);var d=dot(dist,worldTangent);sub(centerDist,worldVertex0,lineOffset);sub(lineToCircle,circleOffset,lineOffset);var radiusSum=circleRadius+lineRadius;if(Math.abs(d)<radiusSum){vec2.scale(orthoDist,worldTangent,d);sub(projectedPoint,circleOffset,orthoDist);vec2.scale(lineToCircleOrthoUnit,worldTangent,dot(worldTangent,lineToCircle));vec2.normalize(lineToCircleOrthoUnit,lineToCircleOrthoUnit);vec2.scale(lineToCircleOrthoUnit,lineToCircleOrthoUnit,lineRadius);add(projectedPoint,projectedPoint,lineToCircleOrthoUnit);var pos=dot(worldEdgeUnit,projectedPoint);var pos0=dot(worldEdgeUnit,worldVertex0);var pos1=dot(worldEdgeUnit,worldVertex1);if(pos>pos0&&pos<pos1){if(justTest){return true;}
var c=this.createContactEquation(circleBody,lineBody,circleShape,lineShape);vec2.scale(c.normalA,orthoDist,-1);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,projectedPoint,lineOffset);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;}}
verts[0]=worldVertex0;verts[1]=worldVertex1;for(var i=0;i<verts.length;i++){var v=verts[i];sub(dist,v,circleOffset);if(vec2.squaredLength(dist)<Math.pow(radiusSum,2)){if(justTest){return true;}
var c=this.createContactEquation(circleBody,lineBody,circleShape,lineShape);vec2.copy(c.normalA,dist);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,v,lineOffset);vec2.scale(lineEndToLineRadius,c.normalA,-lineRadius);add(c.contactPointB,c.contactPointB,lineEndToLineRadius);add(c.contactPointB,c.contactPointB,lineOffset);sub(c.contactPointB,c.contactPointB,lineBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;}}
return 0;};Narrowphase.prototype[Shape.CIRCLE|Shape.CAPSULE]=Narrowphase.prototype.circleCapsule=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){return this.circleLine(bi,si,xi,ai,bj,sj,xj,aj,justTest,sj.radius);};Narrowphase.prototype[Shape.CIRCLE|Shape.CONVEX]=Narrowphase.prototype[Shape.CIRCLE|Shape.BOX]=Narrowphase.prototype.circleConvex=function(circleBody,circleShape,circleOffset,circleAngle,convexBody,convexShape,convexOffset,convexAngle,justTest,circleRadius){var circleRadius=typeof(circleRadius)==="number"?circleRadius:circleShape.radius;var worldVertex0=tmp1,worldVertex1=tmp2,worldEdge=tmp3,worldEdgeUnit=tmp4,worldNormal=tmp5,centerDist=tmp6,convexToCircle=tmp7,orthoDist=tmp8,projectedPoint=tmp9,dist=tmp10,worldVertex=tmp11,closestEdge=-1,closestEdgeDistance=null,closestEdgeOrthoDist=tmp12,closestEdgeProjectedPoint=tmp13,candidate=tmp14,candidateDist=tmp15,minCandidate=tmp16,found=false,minCandidateDistance=Number.MAX_VALUE;var numReported=0;var verts=convexShape.vertices;for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];vec2.rotate(worldVertex0,v0,convexAngle);vec2.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);sub(worldEdge,worldVertex1,worldVertex0);vec2.normalize(worldEdgeUnit,worldEdge);vec2.rotate90cw(worldNormal,worldEdgeUnit);vec2.scale(candidate,worldNormal,-circleShape.radius);add(candidate,candidate,circleOffset);if(pointInConvex(candidate,convexShape,convexOffset,convexAngle)){vec2.sub(candidateDist,worldVertex0,candidate);var candidateDistance=Math.abs(vec2.dot(candidateDist,worldNormal));if(candidateDistance<minCandidateDistance){vec2.copy(minCandidate,candidate);minCandidateDistance=candidateDistance;vec2.scale(closestEdgeProjectedPoint,worldNormal,candidateDistance);vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,candidate);found=true;}}}
if(found){if(justTest){return true;}
var c=this.createContactEquation(circleBody,convexBody,circleShape,convexShape);vec2.sub(c.normalA,minCandidate,circleOffset);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,closestEdgeProjectedPoint,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;}
if(circleRadius>0){for(var i=0;i<verts.length;i++){var localVertex=verts[i];vec2.rotate(worldVertex,localVertex,convexAngle);add(worldVertex,worldVertex,convexOffset);sub(dist,worldVertex,circleOffset);if(vec2.squaredLength(dist)<Math.pow(circleRadius,2)){if(justTest){return true;}
var c=this.createContactEquation(circleBody,convexBody,circleShape,convexShape);vec2.copy(c.normalA,dist);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,circleRadius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,worldVertex,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;}}}
return 0;};var pic_worldVertex0=vec2.create(),pic_worldVertex1=vec2.create(),pic_r0=vec2.create(),pic_r1=vec2.create();function pointInConvex(worldPoint,convexShape,convexOffset,convexAngle){var worldVertex0=pic_worldVertex0,worldVertex1=pic_worldVertex1,r0=pic_r0,r1=pic_r1,point=worldPoint,verts=convexShape.vertices,lastCross=null;for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];vec2.rotate(worldVertex0,v0,convexAngle);vec2.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);sub(r0,worldVertex0,point);sub(r1,worldVertex1,point);var cross=vec2.crossLength(r0,r1);if(lastCross===null){lastCross=cross;}
if(cross*lastCross<=0){return false;}
lastCross=cross;}
return true;}
Narrowphase.prototype[Shape.PARTICLE|Shape.CONVEX]=Narrowphase.prototype[Shape.PARTICLE|Shape.BOX]=Narrowphase.prototype.particleConvex=function(particleBody,particleShape,particleOffset,particleAngle,convexBody,convexShape,convexOffset,convexAngle,justTest){var worldVertex0=tmp1,worldVertex1=tmp2,worldEdge=tmp3,worldEdgeUnit=tmp4,worldTangent=tmp5,centerDist=tmp6,convexToparticle=tmp7,orthoDist=tmp8,projectedPoint=tmp9,dist=tmp10,worldVertex=tmp11,closestEdge=-1,closestEdgeDistance=null,closestEdgeOrthoDist=tmp12,closestEdgeProjectedPoint=tmp13,r0=tmp14,r1=tmp15,localPoint=tmp16,candidateDist=tmp17,minEdgeNormal=tmp18,minCandidateDistance=Number.MAX_VALUE;var numReported=0,found=false,verts=convexShape.vertices;if(!pointInConvex(particleOffset,convexShape,convexOffset,convexAngle)){return 0;}
if(justTest){return true;}
var lastCross=null;for(var i=0;i!==verts.length+1;i++){var v0=verts[i%verts.length],v1=verts[(i+1)%verts.length];vec2.rotate(worldVertex0,v0,convexAngle);vec2.rotate(worldVertex1,v1,convexAngle);add(worldVertex0,worldVertex0,convexOffset);add(worldVertex1,worldVertex1,convexOffset);sub(worldEdge,worldVertex1,worldVertex0);vec2.normalize(worldEdgeUnit,worldEdge);vec2.rotate90cw(worldTangent,worldEdgeUnit);sub(dist,particleOffset,worldVertex0);var d=dot(dist,worldTangent);sub(centerDist,worldVertex0,convexOffset);sub(convexToparticle,particleOffset,convexOffset);vec2.sub(candidateDist,worldVertex0,particleOffset);var candidateDistance=Math.abs(vec2.dot(candidateDist,worldTangent));if(candidateDistance<minCandidateDistance){minCandidateDistance=candidateDistance;vec2.scale(closestEdgeProjectedPoint,worldTangent,candidateDistance);vec2.add(closestEdgeProjectedPoint,closestEdgeProjectedPoint,particleOffset);vec2.copy(minEdgeNormal,worldTangent);found=true;}}
if(found){var c=this.createContactEquation(particleBody,convexBody,particleShape,convexShape);vec2.scale(c.normalA,minEdgeNormal,-1);vec2.normalize(c.normalA,c.normalA);vec2.set(c.contactPointA,0,0);add(c.contactPointA,c.contactPointA,particleOffset);sub(c.contactPointA,c.contactPointA,particleBody.position);sub(c.contactPointB,closestEdgeProjectedPoint,convexOffset);add(c.contactPointB,c.contactPointB,convexOffset);sub(c.contactPointB,c.contactPointB,convexBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;}
return 0;};Narrowphase.prototype[Shape.CIRCLE]=Narrowphase.prototype.circleCircle=function(bodyA,shapeA,offsetA,angleA,bodyB,shapeB,offsetB,angleB,justTest,radiusA,radiusB){var dist=tmp1,radiusA=radiusA||shapeA.radius,radiusB=radiusB||shapeB.radius;sub(dist,offsetA,offsetB);var r=radiusA+radiusB;if(vec2.squaredLength(dist)>Math.pow(r,2)){return 0;}
if(justTest){return true;}
var c=this.createContactEquation(bodyA,bodyB,shapeA,shapeB);sub(c.normalA,offsetB,offsetA);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,radiusA);vec2.scale(c.contactPointB,c.normalA,-radiusB);add(c.contactPointA,c.contactPointA,offsetA);sub(c.contactPointA,c.contactPointA,bodyA.position);add(c.contactPointB,c.contactPointB,offsetB);sub(c.contactPointB,c.contactPointB,bodyB.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;};Narrowphase.prototype[Shape.PLANE|Shape.CONVEX]=Narrowphase.prototype[Shape.PLANE|Shape.BOX]=Narrowphase.prototype.planeConvex=function(planeBody,planeShape,planeOffset,planeAngle,convexBody,convexShape,convexOffset,convexAngle,justTest){var worldVertex=tmp1,worldNormal=tmp2,dist=tmp3;var numReported=0;vec2.rotate(worldNormal,yAxis,planeAngle);for(var i=0;i!==convexShape.vertices.length;i++){var v=convexShape.vertices[i];vec2.rotate(worldVertex,v,convexAngle);add(worldVertex,worldVertex,convexOffset);sub(dist,worldVertex,planeOffset);if(dot(dist,worldNormal)<=0){if(justTest){return true;}
numReported++;var c=this.createContactEquation(planeBody,convexBody,planeShape,convexShape);sub(dist,worldVertex,planeOffset);vec2.copy(c.normalA,worldNormal);var d=dot(dist,c.normalA);vec2.scale(dist,c.normalA,d);sub(c.contactPointB,worldVertex,convexBody.position);sub(c.contactPointA,worldVertex,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);this.contactEquations.push(c);if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}
if(this.enableFrictionReduction){if(this.enableFriction&&numReported){this.frictionEquations.push(this.createFrictionFromAverage(numReported));}}
return numReported;};Narrowphase.prototype[Shape.PARTICLE|Shape.PLANE]=Narrowphase.prototype.particlePlane=function(particleBody,particleShape,particleOffset,particleAngle,planeBody,planeShape,planeOffset,planeAngle,justTest){var dist=tmp1,worldNormal=tmp2;planeAngle=planeAngle||0;sub(dist,particleOffset,planeOffset);vec2.rotate(worldNormal,yAxis,planeAngle);var d=dot(dist,worldNormal);if(d>0){return 0;}
if(justTest){return true;}
var c=this.createContactEquation(planeBody,particleBody,planeShape,particleShape);vec2.copy(c.normalA,worldNormal);vec2.scale(dist,c.normalA,d);sub(c.contactPointA,particleOffset,dist);sub(c.contactPointA,c.contactPointA,planeBody.position);sub(c.contactPointB,particleOffset,particleBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;};Narrowphase.prototype[Shape.CIRCLE|Shape.PARTICLE]=Narrowphase.prototype.circleParticle=function(circleBody,circleShape,circleOffset,circleAngle,particleBody,particleShape,particleOffset,particleAngle,justTest){var dist=tmp1;sub(dist,particleOffset,circleOffset);if(vec2.squaredLength(dist)>Math.pow(circleShape.radius,2)){return 0;}
if(justTest){return true;}
var c=this.createContactEquation(circleBody,particleBody,circleShape,particleShape);vec2.copy(c.normalA,dist);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointA,c.normalA,circleShape.radius);add(c.contactPointA,c.contactPointA,circleOffset);sub(c.contactPointA,c.contactPointA,circleBody.position);sub(c.contactPointB,particleOffset,particleBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}
return 1;};var planeCapsule_tmpCircle=new Circle({radius:1}),planeCapsule_tmp1=vec2.create(),planeCapsule_tmp2=vec2.create(),planeCapsule_tmp3=vec2.create();Narrowphase.prototype[Shape.PLANE|Shape.CAPSULE]=Narrowphase.prototype.planeCapsule=function(planeBody,planeShape,planeOffset,planeAngle,capsuleBody,capsuleShape,capsuleOffset,capsuleAngle,justTest){var end1=planeCapsule_tmp1,end2=planeCapsule_tmp2,circle=planeCapsule_tmpCircle,dst=planeCapsule_tmp3;vec2.set(end1,-capsuleShape.length/2,0);vec2.rotate(end1,end1,capsuleAngle);add(end1,end1,capsuleOffset);vec2.set(end2,capsuleShape.length/2,0);vec2.rotate(end2,end2,capsuleAngle);add(end2,end2,capsuleOffset);circle.radius=capsuleShape.radius;var enableFrictionBefore;if(this.enableFrictionReduction){enableFrictionBefore=this.enableFriction;this.enableFriction=false;}
var numContacts1=this.circlePlane(capsuleBody,circle,end1,0,planeBody,planeShape,planeOffset,planeAngle,justTest),numContacts2=this.circlePlane(capsuleBody,circle,end2,0,planeBody,planeShape,planeOffset,planeAngle,justTest);if(this.enableFrictionReduction){this.enableFriction=enableFrictionBefore;}
if(justTest){return numContacts1||numContacts2;}else{var numTotal=numContacts1+numContacts2;if(this.enableFrictionReduction){if(numTotal){this.frictionEquations.push(this.createFrictionFromAverage(numTotal));}}
return numTotal;}};Narrowphase.prototype[Shape.CIRCLE|Shape.PLANE]=Narrowphase.prototype.circlePlane=function(bi,si,xi,ai,bj,sj,xj,aj,justTest){var circleBody=bi,circleShape=si,circleOffset=xi,planeBody=bj,shapeB=sj,planeOffset=xj,planeAngle=aj;planeAngle=planeAngle||0;var planeToCircle=tmp1,worldNormal=tmp2,temp=tmp3;sub(planeToCircle,circleOffset,planeOffset);vec2.rotate(worldNormal,yAxis,planeAngle);var d=dot(worldNormal,planeToCircle);if(d>circleShape.radius){return 0;}
if(justTest){return true;}
var contact=this.createContactEquation(planeBody,circleBody,sj,si);vec2.copy(contact.normalA,worldNormal);vec2.scale(contact.contactPointB,contact.normalA,-circleShape.radius);add(contact.contactPointB,contact.contactPointB,circleOffset);sub(contact.contactPointB,contact.contactPointB,circleBody.position);vec2.scale(temp,contact.normalA,d);sub(contact.contactPointA,planeToCircle,temp);add(contact.contactPointA,contact.contactPointA,planeOffset);sub(contact.contactPointA,contact.contactPointA,planeBody.position);this.contactEquations.push(contact);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(contact));}
return 1;};Narrowphase.prototype[Shape.CONVEX]=Narrowphase.prototype[Shape.CONVEX|Shape.BOX]=Narrowphase.prototype[Shape.BOX]=Narrowphase.prototype.convexConvex=function(bi,si,xi,ai,bj,sj,xj,aj,justTest,precision){var sepAxis=tmp1,worldPoint=tmp2,worldPoint0=tmp3,worldPoint1=tmp4,worldEdge=tmp5,projected=tmp6,penetrationVec=tmp7,dist=tmp8,worldNormal=tmp9,numContacts=0,precision=typeof(precision)==='number'?precision:0;var found=Narrowphase.findSeparatingAxis(si,xi,ai,sj,xj,aj,sepAxis);if(!found){return 0;}
sub(dist,xj,xi);if(dot(sepAxis,dist)>0){vec2.scale(sepAxis,sepAxis,-1);}
var closestEdge1=Narrowphase.getClosestEdge(si,ai,sepAxis,true),closestEdge2=Narrowphase.getClosestEdge(sj,aj,sepAxis);if(closestEdge1===-1||closestEdge2===-1){return 0;}
for(var k=0;k<2;k++){var closestEdgeA=closestEdge1,closestEdgeB=closestEdge2,shapeA=si,shapeB=sj,offsetA=xi,offsetB=xj,angleA=ai,angleB=aj,bodyA=bi,bodyB=bj;if(k===0){var tmp;tmp=closestEdgeA;closestEdgeA=closestEdgeB;closestEdgeB=tmp;tmp=shapeA;shapeA=shapeB;shapeB=tmp;tmp=offsetA;offsetA=offsetB;offsetB=tmp;tmp=angleA;angleA=angleB;angleB=tmp;tmp=bodyA;bodyA=bodyB;bodyB=tmp;}
for(var j=closestEdgeB;j<closestEdgeB+2;j++){var v=shapeB.vertices[(j+shapeB.vertices.length)%shapeB.vertices.length];vec2.rotate(worldPoint,v,angleB);add(worldPoint,worldPoint,offsetB);var insideNumEdges=0;for(var i=closestEdgeA-1;i<closestEdgeA+2;i++){var v0=shapeA.vertices[(i+shapeA.vertices.length)%shapeA.vertices.length],v1=shapeA.vertices[(i+1+shapeA.vertices.length)%shapeA.vertices.length];vec2.rotate(worldPoint0,v0,angleA);vec2.rotate(worldPoint1,v1,angleA);add(worldPoint0,worldPoint0,offsetA);add(worldPoint1,worldPoint1,offsetA);sub(worldEdge,worldPoint1,worldPoint0);vec2.rotate90cw(worldNormal,worldEdge);vec2.normalize(worldNormal,worldNormal);sub(dist,worldPoint,worldPoint0);var d=dot(worldNormal,dist);if((i===closestEdgeA&&d<=precision)||(i!==closestEdgeA&&d<=0)){insideNumEdges++;}}
if(insideNumEdges>=3){if(justTest){return true;}
var c=this.createContactEquation(bodyA,bodyB,shapeA,shapeB);numContacts++;var v0=shapeA.vertices[(closestEdgeA)%shapeA.vertices.length],v1=shapeA.vertices[(closestEdgeA+1)%shapeA.vertices.length];vec2.rotate(worldPoint0,v0,angleA);vec2.rotate(worldPoint1,v1,angleA);add(worldPoint0,worldPoint0,offsetA);add(worldPoint1,worldPoint1,offsetA);sub(worldEdge,worldPoint1,worldPoint0);vec2.rotate90cw(c.normalA,worldEdge);vec2.normalize(c.normalA,c.normalA);sub(dist,worldPoint,worldPoint0);var d=dot(c.normalA,dist);vec2.scale(penetrationVec,c.normalA,d);sub(c.contactPointA,worldPoint,offsetA);sub(c.contactPointA,c.contactPointA,penetrationVec);add(c.contactPointA,c.contactPointA,offsetA);sub(c.contactPointA,c.contactPointA,bodyA.position);sub(c.contactPointB,worldPoint,offsetB);add(c.contactPointB,c.contactPointB,offsetB);sub(c.contactPointB,c.contactPointB,bodyB.position);this.contactEquations.push(c);if(!this.enableFrictionReduction){if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}}
if(this.enableFrictionReduction){if(this.enableFriction&&numContacts){this.frictionEquations.push(this.createFrictionFromAverage(numContacts));}}
return numContacts;};var pcoa_tmp1=vec2.fromValues(0,0);Narrowphase.projectConvexOntoAxis=function(convexShape,convexOffset,convexAngle,worldAxis,result){var max=null,min=null,v,value,localAxis=pcoa_tmp1;vec2.rotate(localAxis,worldAxis,-convexAngle);for(var i=0;i<convexShape.vertices.length;i++){v=convexShape.vertices[i];value=dot(v,localAxis);if(max===null||value>max){max=value;}
if(min===null||value<min){min=value;}}
if(min>max){var t=min;min=max;max=t;}
var offset=dot(convexOffset,worldAxis);vec2.set(result,min+offset,max+offset);};var fsa_tmp1=vec2.fromValues(0,0),fsa_tmp2=vec2.fromValues(0,0),fsa_tmp3=vec2.fromValues(0,0),fsa_tmp4=vec2.fromValues(0,0),fsa_tmp5=vec2.fromValues(0,0),fsa_tmp6=vec2.fromValues(0,0);Narrowphase.findSeparatingAxis=function(c1,offset1,angle1,c2,offset2,angle2,sepAxis){var maxDist=null,overlap=false,found=false,edge=fsa_tmp1,worldPoint0=fsa_tmp2,worldPoint1=fsa_tmp3,normal=fsa_tmp4,span1=fsa_tmp5,span2=fsa_tmp6;if(c1 instanceof Box&&c2 instanceof Box){for(var j=0;j!==2;j++){var c=c1,angle=angle1;if(j===1){c=c2;angle=angle2;}
for(var i=0;i!==2;i++){if(i===0){vec2.set(normal,0,1);}else if(i===1){vec2.set(normal,1,0);}
if(angle!==0){vec2.rotate(normal,normal,angle);}
Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);var a=span1,b=span2,swapped=false;if(span1[0]>span2[0]){b=span1;a=span2;swapped=true;}
var dist=b[0]-a[1];overlap=(dist<=0);if(maxDist===null||dist>maxDist){vec2.copy(sepAxis,normal);maxDist=dist;found=overlap;}}}}else{for(var j=0;j!==2;j++){var c=c1,angle=angle1;if(j===1){c=c2;angle=angle2;}
for(var i=0;i!==c.vertices.length;i++){vec2.rotate(worldPoint0,c.vertices[i],angle);vec2.rotate(worldPoint1,c.vertices[(i+1)%c.vertices.length],angle);sub(edge,worldPoint1,worldPoint0);vec2.rotate90cw(normal,edge);vec2.normalize(normal,normal);Narrowphase.projectConvexOntoAxis(c1,offset1,angle1,normal,span1);Narrowphase.projectConvexOntoAxis(c2,offset2,angle2,normal,span2);var a=span1,b=span2,swapped=false;if(span1[0]>span2[0]){b=span1;a=span2;swapped=true;}
var dist=b[0]-a[1];overlap=(dist<=0);if(maxDist===null||dist>maxDist){vec2.copy(sepAxis,normal);maxDist=dist;found=overlap;}}}}
return found;};var gce_tmp1=vec2.fromValues(0,0),gce_tmp2=vec2.fromValues(0,0),gce_tmp3=vec2.fromValues(0,0);Narrowphase.getClosestEdge=function(c,angle,axis,flip){var localAxis=gce_tmp1,edge=gce_tmp2,normal=gce_tmp3;vec2.rotate(localAxis,axis,-angle);if(flip){vec2.scale(localAxis,localAxis,-1);}
var closestEdge=-1,N=c.vertices.length,maxDot=-1;for(var i=0;i!==N;i++){sub(edge,c.vertices[(i+1)%N],c.vertices[i%N]);vec2.rotate90cw(normal,edge);vec2.normalize(normal,normal);var d=dot(normal,localAxis);if(closestEdge===-1||d>maxDot){closestEdge=i%N;maxDot=d;}}
return closestEdge;};var circleHeightfield_candidate=vec2.create(),circleHeightfield_dist=vec2.create(),circleHeightfield_v0=vec2.create(),circleHeightfield_v1=vec2.create(),circleHeightfield_minCandidate=vec2.create(),circleHeightfield_worldNormal=vec2.create(),circleHeightfield_minCandidateNormal=vec2.create();Narrowphase.prototype[Shape.CIRCLE|Shape.HEIGHTFIELD]=Narrowphase.prototype.circleHeightfield=function(circleBody,circleShape,circlePos,circleAngle,hfBody,hfShape,hfPos,hfAngle,justTest,radius){var data=hfShape.heights,radius=radius||circleShape.radius,w=hfShape.elementWidth,dist=circleHeightfield_dist,candidate=circleHeightfield_candidate,minCandidate=circleHeightfield_minCandidate,minCandidateNormal=circleHeightfield_minCandidateNormal,worldNormal=circleHeightfield_worldNormal,v0=circleHeightfield_v0,v1=circleHeightfield_v1;var idxA=Math.floor((circlePos[0]-radius-hfPos[0])/ w),idxB=Math.ceil((circlePos[0]+radius-hfPos[0])/ w);if(idxA<0){idxA=0;}
if(idxB>=data.length){idxB=data.length-1;}
var max=data[idxA],min=data[idxB];for(var i=idxA;i<idxB;i++){if(data[i]<min){min=data[i];}
if(data[i]>max){max=data[i];}}
if(circlePos[1]-radius>max){return justTest?false:0;}
var found=false;for(var i=idxA;i<idxB;i++){vec2.set(v0,i*w,data[i]);vec2.set(v1,(i+1)*w,data[i+1]);vec2.add(v0,v0,hfPos);vec2.add(v1,v1,hfPos);vec2.sub(worldNormal,v1,v0);vec2.rotate(worldNormal,worldNormal,Math.PI/2);vec2.normalize(worldNormal,worldNormal);vec2.scale(candidate,worldNormal,-radius);vec2.add(candidate,candidate,circlePos);vec2.sub(dist,candidate,v0);var d=vec2.dot(dist,worldNormal);if(candidate[0]>=v0[0]&&candidate[0]<v1[0]&&d<=0){if(justTest){return true;}
found=true;vec2.scale(dist,worldNormal,-d);vec2.add(minCandidate,candidate,dist);vec2.copy(minCandidateNormal,worldNormal);var c=this.createContactEquation(hfBody,circleBody,hfShape,circleShape);vec2.copy(c.normalA,minCandidateNormal);vec2.scale(c.contactPointB,c.normalA,-radius);add(c.contactPointB,c.contactPointB,circlePos);sub(c.contactPointB,c.contactPointB,circleBody.position);vec2.copy(c.contactPointA,minCandidate);vec2.sub(c.contactPointA,c.contactPointA,hfBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}
found=false;if(radius>0){for(var i=idxA;i<=idxB;i++){vec2.set(v0,i*w,data[i]);vec2.add(v0,v0,hfPos);vec2.sub(dist,circlePos,v0);if(vec2.squaredLength(dist)<Math.pow(radius,2)){if(justTest){return true;}
found=true;var c=this.createContactEquation(hfBody,circleBody,hfShape,circleShape);vec2.copy(c.normalA,dist);vec2.normalize(c.normalA,c.normalA);vec2.scale(c.contactPointB,c.normalA,-radius);add(c.contactPointB,c.contactPointB,circlePos);sub(c.contactPointB,c.contactPointB,circleBody.position);sub(c.contactPointA,v0,hfPos);add(c.contactPointA,c.contactPointA,hfPos);sub(c.contactPointA,c.contactPointA,hfBody.position);this.contactEquations.push(c);if(this.enableFriction){this.frictionEquations.push(this.createFrictionFromContact(c));}}}}
if(found){return 1;}
return 0;};var convexHeightfield_v0=vec2.create(),convexHeightfield_v1=vec2.create(),convexHeightfield_tilePos=vec2.create(),convexHeightfield_tempConvexShape=new Convex({vertices:[vec2.create(),vec2.create(),vec2.create(),vec2.create()]});Narrowphase.prototype[Shape.BOX|Shape.HEIGHTFIELD]=Narrowphase.prototype[Shape.CONVEX|Shape.HEIGHTFIELD]=Narrowphase.prototype.convexHeightfield=function(convexBody,convexShape,convexPos,convexAngle,hfBody,hfShape,hfPos,hfAngle,justTest){var data=hfShape.heights,w=hfShape.elementWidth,v0=convexHeightfield_v0,v1=convexHeightfield_v1,tilePos=convexHeightfield_tilePos,tileConvex=convexHeightfield_tempConvexShape;var idxA=Math.floor((convexBody.aabb.lowerBound[0]-hfPos[0])/ w),idxB=Math.ceil((convexBody.aabb.upperBound[0]-hfPos[0])/ w);if(idxA<0){idxA=0;}
if(idxB>=data.length){idxB=data.length-1;}
var max=data[idxA],min=data[idxB];for(var i=idxA;i<idxB;i++){if(data[i]<min){min=data[i];}
if(data[i]>max){max=data[i];}}
if(convexBody.aabb.lowerBound[1]>max){return justTest?false:0;}
var found=false;var numContacts=0;for(var i=idxA;i<idxB;i++){vec2.set(v0,i*w,data[i]);vec2.set(v1,(i+1)*w,data[i+1]);vec2.add(v0,v0,hfPos);vec2.add(v1,v1,hfPos);var tileHeight=100;vec2.set(tilePos,(v1[0]+v0[0])*0.5,(v1[1]+v0[1]-tileHeight)*0.5);vec2.sub(tileConvex.vertices[0],v1,tilePos);vec2.sub(tileConvex.vertices[1],v0,tilePos);vec2.copy(tileConvex.vertices[2],tileConvex.vertices[1]);vec2.copy(tileConvex.vertices[3],tileConvex.vertices[0]);tileConvex.vertices[2][1]-=tileHeight;tileConvex.vertices[3][1]-=tileHeight;numContacts+=this.convexConvex(convexBody,convexShape,convexPos,convexAngle,hfBody,tileConvex,tilePos,0,justTest);}
return numContacts;};},{"../equations/ContactEquation":21,"../equations/Equation":22,"../equations/FrictionEquation":23,"../math/vec2":30,"../objects/Body":31,"../shapes/Box":37,"../shapes/Circle":39,"../shapes/Convex":40,"../shapes/Shape":45,"../utils/ContactEquationPool":48,"../utils/FrictionEquationPool":49,"../utils/TupleDictionary":56,"../utils/Utils":57}],11:[function(_dereq_,module,exports){module.exports=Ray;var vec2=_dereq_('../math/vec2');var RaycastResult=_dereq_('../collision/RaycastResult');var Shape=_dereq_('../shapes/Shape');var AABB=_dereq_('../collision/AABB');function Ray(options){options=options||{};this.from=options.from?vec2.fromValues(options.from[0],options.from[1]):vec2.create();this.to=options.to?vec2.fromValues(options.to[0],options.to[1]):vec2.create();this.checkCollisionResponse=options.checkCollisionResponse!==undefined?options.checkCollisionResponse:true;this.skipBackfaces=!!options.skipBackfaces;this.collisionMask=options.collisionMask!==undefined?options.collisionMask:-1;this.collisionGroup=options.collisionGroup!==undefined?options.collisionGroup:-1;this.mode=options.mode!==undefined?options.mode:Ray.ANY;this.callback=options.callback||function(result){};this.direction=vec2.create();this.length=1;this.update();}
Ray.prototype.constructor=Ray;Ray.CLOSEST=1;Ray.ANY=2;Ray.ALL=4;Ray.prototype.update=function(){var d=this.direction;vec2.sub(d,this.to,this.from);this.length=vec2.length(d);vec2.normalize(d,d);};Ray.prototype.intersectBodies=function(result,bodies){for(var i=0,l=bodies.length;!result.shouldStop(this)&&i<l;i++){var body=bodies[i];var aabb=body.getAABB();if(aabb.overlapsRay(this)>=0||aabb.containsPoint(this.from)){this.intersectBody(result,body);}}};var intersectBody_worldPosition=vec2.create();Ray.prototype.intersectBody=function(result,body){var checkCollisionResponse=this.checkCollisionResponse;if(checkCollisionResponse&&!body.collisionResponse){return;}
var worldPosition=intersectBody_worldPosition;for(var i=0,N=body.shapes.length;i<N;i++){var shape=body.shapes[i];if(checkCollisionResponse&&!shape.collisionResponse){continue;}
if((this.collisionGroup&shape.collisionMask)===0||(shape.collisionGroup&this.collisionMask)===0){continue;}
vec2.rotate(worldPosition,shape.position,body.angle);vec2.add(worldPosition,worldPosition,body.position);var worldAngle=shape.angle+body.angle;this.intersectShape(result,shape,worldAngle,worldPosition,body);if(result.shouldStop(this)){break;}}};Ray.prototype.intersectShape=function(result,shape,angle,position,body){var from=this.from;var distance=distanceFromIntersectionSquared(from,this.direction,position);if(distance>shape.boundingRadius*shape.boundingRadius){return;}
this._currentBody=body;this._currentShape=shape;shape.raycast(result,this,position,angle);this._currentBody=this._currentShape=null;};Ray.prototype.getAABB=function(result){var to=this.to;var from=this.from;vec2.set(result.lowerBound,Math.min(to[0],from[0]),Math.min(to[1],from[1]));vec2.set(result.upperBound,Math.max(to[0],from[0]),Math.max(to[1],from[1]));};var hitPointWorld=vec2.create();Ray.prototype.reportIntersection=function(result,fraction,normal,faceIndex){var from=this.from;var to=this.to;var shape=this._currentShape;var body=this._currentBody;if(this.skipBackfaces&&vec2.dot(normal,this.direction)>0){return;}
switch(this.mode){case Ray.ALL:result.set(normal,shape,body,fraction,faceIndex);this.callback(result);break;case Ray.CLOSEST:if(fraction<result.fraction||!result.hasHit()){result.set(normal,shape,body,fraction,faceIndex);}
break;case Ray.ANY:result.set(normal,shape,body,fraction,faceIndex);break;}};var v0=vec2.create(),intersect=vec2.create();function distanceFromIntersectionSquared(from,direction,position){vec2.sub(v0,position,from);var dot=vec2.dot(v0,direction);vec2.scale(intersect,direction,dot);vec2.add(intersect,intersect,from);return vec2.squaredDistance(position,intersect);}},{"../collision/AABB":7,"../collision/RaycastResult":12,"../math/vec2":30,"../shapes/Shape":45}],12:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Ray=_dereq_('../collision/Ray');module.exports=RaycastResult;function RaycastResult(){this.normal=vec2.create();this.shape=null;this.body=null;this.faceIndex=-1;this.fraction=-1;this.isStopped=false;}
RaycastResult.prototype.reset=function(){vec2.set(this.normal,0,0);this.shape=null;this.body=null;this.faceIndex=-1;this.fraction=-1;this.isStopped=false;};RaycastResult.prototype.getHitDistance=function(ray){return vec2.distance(ray.from,ray.to)*this.fraction;};RaycastResult.prototype.hasHit=function(){return this.fraction!==-1;};RaycastResult.prototype.getHitPoint=function(out,ray){vec2.lerp(out,ray.from,ray.to,this.fraction);};RaycastResult.prototype.stop=function(){this.isStopped=true;};RaycastResult.prototype.shouldStop=function(ray){return this.isStopped||(this.fraction!==-1&&ray.mode===Ray.ANY);};RaycastResult.prototype.set=function(normal,shape,body,fraction,faceIndex){vec2.copy(this.normal,normal);this.shape=shape;this.body=body;this.fraction=fraction;this.faceIndex=faceIndex;};},{"../collision/Ray":11,"../math/vec2":30}],13:[function(_dereq_,module,exports){var Utils=_dereq_('../utils/Utils'),Broadphase=_dereq_('../collision/Broadphase');module.exports=SAPBroadphase;function SAPBroadphase(){Broadphase.call(this,Broadphase.SAP);this.axisList=[];this.axisIndex=0;var that=this;this._addBodyHandler=function(e){that.axisList.push(e.body);};this._removeBodyHandler=function(e){var idx=that.axisList.indexOf(e.body);if(idx!==-1){that.axisList.splice(idx,1);}};}
SAPBroadphase.prototype=new Broadphase();SAPBroadphase.prototype.constructor=SAPBroadphase;SAPBroadphase.prototype.setWorld=function(world){this.axisList.length=0;Utils.appendArray(this.axisList,world.bodies);world.off("addBody",this._addBodyHandler).off("removeBody",this._removeBodyHandler);world.on("addBody",this._addBodyHandler).on("removeBody",this._removeBodyHandler);this.world=world;};SAPBroadphase.sortAxisList=function(a,axisIndex){axisIndex=axisIndex|0;for(var i=1,l=a.length;i<l;i++){var v=a[i];for(var j=i-1;j>=0;j--){if(a[j].aabb.lowerBound[axisIndex]<=v.aabb.lowerBound[axisIndex]){break;}
a[j+1]=a[j];}
a[j+1]=v;}
return a;};SAPBroadphase.prototype.sortList=function(){var bodies=this.axisList,axisIndex=this.axisIndex;SAPBroadphase.sortAxisList(bodies,axisIndex);};SAPBroadphase.prototype.getCollisionPairs=function(world){var bodies=this.axisList,result=this.result,axisIndex=this.axisIndex;result.length=0;var l=bodies.length;while(l--){var b=bodies[l];if(b.aabbNeedsUpdate){b.updateAABB();}}
this.sortList();for(var i=0,N=bodies.length|0;i!==N;i++){var bi=bodies[i];for(var j=i+1;j<N;j++){var bj=bodies[j];var overlaps=(bj.aabb.lowerBound[axisIndex]<=bi.aabb.upperBound[axisIndex]);if(!overlaps){break;}
if(Broadphase.canCollide(bi,bj)&&this.boundingVolumeCheck(bi,bj)){result.push(bi,bj);}}}
return result;};SAPBroadphase.prototype.aabbQuery=function(world,aabb,result){result=result||[];this.sortList();var axisIndex=this.axisIndex;var axis='x';if(axisIndex===1){axis='y';}
if(axisIndex===2){axis='z';}
var axisList=this.axisList;var lower=aabb.lowerBound[axis];var upper=aabb.upperBound[axis];for(var i=0;i<axisList.length;i++){var b=axisList[i];if(b.aabbNeedsUpdate){b.updateAABB();}
if(b.aabb.overlaps(aabb)){result.push(b);}}
return result;};},{"../collision/Broadphase":8,"../utils/Utils":57}],14:[function(_dereq_,module,exports){module.exports=Constraint;var Utils=_dereq_('../utils/Utils');function Constraint(bodyA,bodyB,type,options){this.type=type;options=Utils.defaults(options,{collideConnected:true,wakeUpBodies:true,});this.equations=[];this.bodyA=bodyA;this.bodyB=bodyB;this.collideConnected=options.collideConnected;if(options.wakeUpBodies){if(bodyA){bodyA.wakeUp();}
if(bodyB){bodyB.wakeUp();}}}
Constraint.prototype.update=function(){throw new Error("method update() not implmemented in this Constraint subclass!");};Constraint.DISTANCE=1;Constraint.GEAR=2;Constraint.LOCK=3;Constraint.PRISMATIC=4;Constraint.REVOLUTE=5;Constraint.prototype.setStiffness=function(stiffness){var eqs=this.equations;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];eq.stiffness=stiffness;eq.needsUpdate=true;}};Constraint.prototype.setRelaxation=function(relaxation){var eqs=this.equations;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];eq.relaxation=relaxation;eq.needsUpdate=true;}};},{"../utils/Utils":57}],15:[function(_dereq_,module,exports){var Constraint=_dereq_('./Constraint'),Equation=_dereq_('../equations/Equation'),vec2=_dereq_('../math/vec2'),Utils=_dereq_('../utils/Utils');module.exports=DistanceConstraint;function DistanceConstraint(bodyA,bodyB,options){options=Utils.defaults(options,{localAnchorA:[0,0],localAnchorB:[0,0]});Constraint.call(this,bodyA,bodyB,Constraint.DISTANCE,options);this.localAnchorA=vec2.fromValues(options.localAnchorA[0],options.localAnchorA[1]);this.localAnchorB=vec2.fromValues(options.localAnchorB[0],options.localAnchorB[1]);var localAnchorA=this.localAnchorA;var localAnchorB=this.localAnchorB;this.distance=0;if(typeof(options.distance)==='number'){this.distance=options.distance;}else{var worldAnchorA=vec2.create(),worldAnchorB=vec2.create(),r=vec2.create();vec2.rotate(worldAnchorA,localAnchorA,bodyA.angle);vec2.rotate(worldAnchorB,localAnchorB,bodyB.angle);vec2.add(r,bodyB.position,worldAnchorB);vec2.sub(r,r,worldAnchorA);vec2.sub(r,r,bodyA.position);this.distance=vec2.length(r);}
var maxForce;if(typeof(options.maxForce)==="undefined"){maxForce=Number.MAX_VALUE;}else{maxForce=options.maxForce;}
var normal=new Equation(bodyA,bodyB,-maxForce,maxForce);this.equations=[normal];this.maxForce=maxForce;var r=vec2.create();var ri=vec2.create();var rj=vec2.create();var that=this;normal.computeGq=function(){var bodyA=this.bodyA,bodyB=this.bodyB,xi=bodyA.position,xj=bodyB.position;vec2.rotate(ri,localAnchorA,bodyA.angle);vec2.rotate(rj,localAnchorB,bodyB.angle);vec2.add(r,xj,rj);vec2.sub(r,r,ri);vec2.sub(r,r,xi);return vec2.length(r)-that.distance;};this.setMaxForce(maxForce);this.upperLimitEnabled=false;this.upperLimit=1;this.lowerLimitEnabled=false;this.lowerLimit=0;this.position=0;}
DistanceConstraint.prototype=new Constraint();DistanceConstraint.prototype.constructor=DistanceConstraint;var n=vec2.create();var ri=vec2.create();var rj=vec2.create();DistanceConstraint.prototype.update=function(){var normal=this.equations[0],bodyA=this.bodyA,bodyB=this.bodyB,distance=this.distance,xi=bodyA.position,xj=bodyB.position,normalEquation=this.equations[0],G=normal.G;vec2.rotate(ri,this.localAnchorA,bodyA.angle);vec2.rotate(rj,this.localAnchorB,bodyB.angle);vec2.add(n,xj,rj);vec2.sub(n,n,ri);vec2.sub(n,n,xi);this.position=vec2.length(n);var violating=false;if(this.upperLimitEnabled){if(this.position>this.upperLimit){normalEquation.maxForce=0;normalEquation.minForce=-this.maxForce;this.distance=this.upperLimit;violating=true;}}
if(this.lowerLimitEnabled){if(this.position<this.lowerLimit){normalEquation.maxForce=this.maxForce;normalEquation.minForce=0;this.distance=this.lowerLimit;violating=true;}}
if((this.lowerLimitEnabled||this.upperLimitEnabled)&&!violating){normalEquation.enabled=false;return;}
normalEquation.enabled=true;vec2.normalize(n,n);var rixn=vec2.crossLength(ri,n),rjxn=vec2.crossLength(rj,n);G[0]=-n[0];G[1]=-n[1];G[2]=-rixn;G[3]=n[0];G[4]=n[1];G[5]=rjxn;};DistanceConstraint.prototype.setMaxForce=function(maxForce){var normal=this.equations[0];normal.minForce=-maxForce;normal.maxForce=maxForce;};DistanceConstraint.prototype.getMaxForce=function(){var normal=this.equations[0];return normal.maxForce;};},{"../equations/Equation":22,"../math/vec2":30,"../utils/Utils":57,"./Constraint":14}],16:[function(_dereq_,module,exports){var Constraint=_dereq_('./Constraint'),Equation=_dereq_('../equations/Equation'),AngleLockEquation=_dereq_('../equations/AngleLockEquation'),vec2=_dereq_('../math/vec2');module.exports=GearConstraint;function GearConstraint(bodyA,bodyB,options){options=options||{};Constraint.call(this,bodyA,bodyB,Constraint.GEAR,options);this.ratio=options.ratio!==undefined?options.ratio:1;this.angle=options.angle!==undefined?options.angle:bodyB.angle-this.ratio*bodyA.angle;options.angle=this.angle;options.ratio=this.ratio;this.equations=[new AngleLockEquation(bodyA,bodyB,options),];if(options.maxTorque!==undefined){this.setMaxTorque(options.maxTorque);}}
GearConstraint.prototype=new Constraint();GearConstraint.prototype.constructor=GearConstraint;GearConstraint.prototype.update=function(){var eq=this.equations[0];if(eq.ratio!==this.ratio){eq.setRatio(this.ratio);}
eq.angle=this.angle;};GearConstraint.prototype.setMaxTorque=function(torque){this.equations[0].setMaxTorque(torque);};GearConstraint.prototype.getMaxTorque=function(torque){return this.equations[0].maxForce;};},{"../equations/AngleLockEquation":20,"../equations/Equation":22,"../math/vec2":30,"./Constraint":14}],17:[function(_dereq_,module,exports){var Constraint=_dereq_('./Constraint'),vec2=_dereq_('../math/vec2'),Equation=_dereq_('../equations/Equation');module.exports=LockConstraint;function LockConstraint(bodyA,bodyB,options){options=options||{};Constraint.call(this,bodyA,bodyB,Constraint.LOCK,options);var maxForce=(typeof(options.maxForce)==="undefined"?Number.MAX_VALUE:options.maxForce);var localAngleB=options.localAngleB||0;var x=new Equation(bodyA,bodyB,-maxForce,maxForce),y=new Equation(bodyA,bodyB,-maxForce,maxForce),rot=new Equation(bodyA,bodyB,-maxForce,maxForce);var l=vec2.create(),g=vec2.create(),that=this;x.computeGq=function(){vec2.rotate(l,that.localOffsetB,bodyA.angle);vec2.sub(g,bodyB.position,bodyA.position);vec2.sub(g,g,l);return g[0];};y.computeGq=function(){vec2.rotate(l,that.localOffsetB,bodyA.angle);vec2.sub(g,bodyB.position,bodyA.position);vec2.sub(g,g,l);return g[1];};var r=vec2.create(),t=vec2.create();rot.computeGq=function(){vec2.rotate(r,that.localOffsetB,bodyB.angle-that.localAngleB);vec2.scale(r,r,-1);vec2.sub(g,bodyA.position,bodyB.position);vec2.add(g,g,r);vec2.rotate(t,r,-Math.PI/2);vec2.normalize(t,t);return vec2.dot(g,t);};this.localOffsetB=vec2.create();if(options.localOffsetB){vec2.copy(this.localOffsetB,options.localOffsetB);}else{vec2.sub(this.localOffsetB,bodyB.position,bodyA.position);vec2.rotate(this.localOffsetB,this.localOffsetB,-bodyA.angle);}
this.localAngleB=0;if(typeof(options.localAngleB)==='number'){this.localAngleB=options.localAngleB;}else{this.localAngleB=bodyB.angle-bodyA.angle;}
this.equations.push(x,y,rot);this.setMaxForce(maxForce);}
LockConstraint.prototype=new Constraint();LockConstraint.prototype.constructor=LockConstraint;LockConstraint.prototype.setMaxForce=function(force){var eqs=this.equations;for(var i=0;i<this.equations.length;i++){eqs[i].maxForce=force;eqs[i].minForce=-force;}};LockConstraint.prototype.getMaxForce=function(){return this.equations[0].maxForce;};var l=vec2.create();var r=vec2.create();var t=vec2.create();var xAxis=vec2.fromValues(1,0);var yAxis=vec2.fromValues(0,1);LockConstraint.prototype.update=function(){var x=this.equations[0],y=this.equations[1],rot=this.equations[2],bodyA=this.bodyA,bodyB=this.bodyB;vec2.rotate(l,this.localOffsetB,bodyA.angle);vec2.rotate(r,this.localOffsetB,bodyB.angle-this.localAngleB);vec2.scale(r,r,-1);vec2.rotate(t,r,Math.PI/2);vec2.normalize(t,t);x.G[0]=-1;x.G[1]=0;x.G[2]=-vec2.crossLength(l,xAxis);x.G[3]=1;y.G[0]=0;y.G[1]=-1;y.G[2]=-vec2.crossLength(l,yAxis);y.G[4]=1;rot.G[0]=-t[0];rot.G[1]=-t[1];rot.G[3]=t[0];rot.G[4]=t[1];rot.G[5]=vec2.crossLength(r,t);};},{"../equations/Equation":22,"../math/vec2":30,"./Constraint":14}],18:[function(_dereq_,module,exports){var Constraint=_dereq_('./Constraint'),ContactEquation=_dereq_('../equations/ContactEquation'),Equation=_dereq_('../equations/Equation'),vec2=_dereq_('../math/vec2'),RotationalLockEquation=_dereq_('../equations/RotationalLockEquation');module.exports=PrismaticConstraint;function PrismaticConstraint(bodyA,bodyB,options){options=options||{};Constraint.call(this,bodyA,bodyB,Constraint.PRISMATIC,options);var localAnchorA=vec2.fromValues(0,0),localAxisA=vec2.fromValues(1,0),localAnchorB=vec2.fromValues(0,0);if(options.localAnchorA){vec2.copy(localAnchorA,options.localAnchorA);}
if(options.localAxisA){vec2.copy(localAxisA,options.localAxisA);}
if(options.localAnchorB){vec2.copy(localAnchorB,options.localAnchorB);}
this.localAnchorA=localAnchorA;this.localAnchorB=localAnchorB;this.localAxisA=localAxisA;var maxForce=this.maxForce=typeof(options.maxForce)!=="undefined"?options.maxForce:Number.MAX_VALUE;var trans=new Equation(bodyA,bodyB,-maxForce,maxForce);var ri=new vec2.create(),rj=new vec2.create(),gg=new vec2.create(),t=new vec2.create();trans.computeGq=function(){return vec2.dot(gg,t);};trans.updateJacobian=function(){var G=this.G,xi=bodyA.position,xj=bodyB.position;vec2.rotate(ri,localAnchorA,bodyA.angle);vec2.rotate(rj,localAnchorB,bodyB.angle);vec2.add(gg,xj,rj);vec2.sub(gg,gg,xi);vec2.sub(gg,gg,ri);vec2.rotate(t,localAxisA,bodyA.angle+Math.PI/2);G[0]=-t[0];G[1]=-t[1];G[2]=-vec2.crossLength(ri,t)+vec2.crossLength(t,gg);G[3]=t[0];G[4]=t[1];G[5]=vec2.crossLength(rj,t);};this.equations.push(trans);if(!options.disableRotationalLock){var rot=new RotationalLockEquation(bodyA,bodyB,-maxForce,maxForce);this.equations.push(rot);}
this.position=0;this.velocity=0;this.lowerLimitEnabled=typeof(options.lowerLimit)!=="undefined"?true:false;this.upperLimitEnabled=typeof(options.upperLimit)!=="undefined"?true:false;this.lowerLimit=typeof(options.lowerLimit)!=="undefined"?options.lowerLimit:0;this.upperLimit=typeof(options.upperLimit)!=="undefined"?options.upperLimit:1;this.upperLimitEquation=new ContactEquation(bodyA,bodyB);this.lowerLimitEquation=new ContactEquation(bodyA,bodyB);this.upperLimitEquation.minForce=this.lowerLimitEquation.minForce=0;this.upperLimitEquation.maxForce=this.lowerLimitEquation.maxForce=maxForce;this.motorEquation=new Equation(bodyA,bodyB);this.motorEnabled=false;this.motorSpeed=0;var that=this;var motorEquation=this.motorEquation;var old=motorEquation.computeGW;motorEquation.computeGq=function(){return 0;};motorEquation.computeGW=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.velocity,vj=bj.velocity,wi=bi.angularVelocity,wj=bj.angularVelocity;return this.gmult(G,vi,wi,vj,wj)+that.motorSpeed;};}
PrismaticConstraint.prototype=new Constraint();PrismaticConstraint.prototype.constructor=PrismaticConstraint;var worldAxisA=vec2.create(),worldAnchorA=vec2.create(),worldAnchorB=vec2.create(),orientedAnchorA=vec2.create(),orientedAnchorB=vec2.create(),tmp=vec2.create();PrismaticConstraint.prototype.update=function(){var eqs=this.equations,trans=eqs[0],upperLimit=this.upperLimit,lowerLimit=this.lowerLimit,upperLimitEquation=this.upperLimitEquation,lowerLimitEquation=this.lowerLimitEquation,bodyA=this.bodyA,bodyB=this.bodyB,localAxisA=this.localAxisA,localAnchorA=this.localAnchorA,localAnchorB=this.localAnchorB;trans.updateJacobian();vec2.rotate(worldAxisA,localAxisA,bodyA.angle);vec2.rotate(orientedAnchorA,localAnchorA,bodyA.angle);vec2.add(worldAnchorA,orientedAnchorA,bodyA.position);vec2.rotate(orientedAnchorB,localAnchorB,bodyB.angle);vec2.add(worldAnchorB,orientedAnchorB,bodyB.position);var relPosition=this.position=vec2.dot(worldAnchorB,worldAxisA)-vec2.dot(worldAnchorA,worldAxisA);if(this.motorEnabled){var G=this.motorEquation.G;G[0]=worldAxisA[0];G[1]=worldAxisA[1];G[2]=vec2.crossLength(worldAxisA,orientedAnchorB);G[3]=-worldAxisA[0];G[4]=-worldAxisA[1];G[5]=-vec2.crossLength(worldAxisA,orientedAnchorA);}
if(this.upperLimitEnabled&&relPosition>upperLimit){vec2.scale(upperLimitEquation.normalA,worldAxisA,-1);vec2.sub(upperLimitEquation.contactPointA,worldAnchorA,bodyA.position);vec2.sub(upperLimitEquation.contactPointB,worldAnchorB,bodyB.position);vec2.scale(tmp,worldAxisA,upperLimit);vec2.add(upperLimitEquation.contactPointA,upperLimitEquation.contactPointA,tmp);if(eqs.indexOf(upperLimitEquation)===-1){eqs.push(upperLimitEquation);}}else{var idx=eqs.indexOf(upperLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}
if(this.lowerLimitEnabled&&relPosition<lowerLimit){vec2.scale(lowerLimitEquation.normalA,worldAxisA,1);vec2.sub(lowerLimitEquation.contactPointA,worldAnchorA,bodyA.position);vec2.sub(lowerLimitEquation.contactPointB,worldAnchorB,bodyB.position);vec2.scale(tmp,worldAxisA,lowerLimit);vec2.sub(lowerLimitEquation.contactPointB,lowerLimitEquation.contactPointB,tmp);if(eqs.indexOf(lowerLimitEquation)===-1){eqs.push(lowerLimitEquation);}}else{var idx=eqs.indexOf(lowerLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}};PrismaticConstraint.prototype.enableMotor=function(){if(this.motorEnabled){return;}
this.equations.push(this.motorEquation);this.motorEnabled=true;};PrismaticConstraint.prototype.disableMotor=function(){if(!this.motorEnabled){return;}
var i=this.equations.indexOf(this.motorEquation);this.equations.splice(i,1);this.motorEnabled=false;};PrismaticConstraint.prototype.setLimits=function(lower,upper){if(typeof(lower)==='number'){this.lowerLimit=lower;this.lowerLimitEnabled=true;}else{this.lowerLimit=lower;this.lowerLimitEnabled=false;}
if(typeof(upper)==='number'){this.upperLimit=upper;this.upperLimitEnabled=true;}else{this.upperLimit=upper;this.upperLimitEnabled=false;}};},{"../equations/ContactEquation":21,"../equations/Equation":22,"../equations/RotationalLockEquation":24,"../math/vec2":30,"./Constraint":14}],19:[function(_dereq_,module,exports){var Constraint=_dereq_('./Constraint'),Equation=_dereq_('../equations/Equation'),RotationalVelocityEquation=_dereq_('../equations/RotationalVelocityEquation'),RotationalLockEquation=_dereq_('../equations/RotationalLockEquation'),vec2=_dereq_('../math/vec2');module.exports=RevoluteConstraint;var worldPivotA=vec2.create(),worldPivotB=vec2.create(),xAxis=vec2.fromValues(1,0),yAxis=vec2.fromValues(0,1),g=vec2.create();function RevoluteConstraint(bodyA,bodyB,options){options=options||{};Constraint.call(this,bodyA,bodyB,Constraint.REVOLUTE,options);var maxForce=this.maxForce=typeof(options.maxForce)!=="undefined"?options.maxForce:Number.MAX_VALUE;this.pivotA=vec2.create();this.pivotB=vec2.create();if(options.worldPivot){vec2.sub(this.pivotA,options.worldPivot,bodyA.position);vec2.sub(this.pivotB,options.worldPivot,bodyB.position);vec2.rotate(this.pivotA,this.pivotA,-bodyA.angle);vec2.rotate(this.pivotB,this.pivotB,-bodyB.angle);}else{vec2.copy(this.pivotA,options.localPivotA);vec2.copy(this.pivotB,options.localPivotB);}
var eqs=this.equations=[new Equation(bodyA,bodyB,-maxForce,maxForce),new Equation(bodyA,bodyB,-maxForce,maxForce),];var x=eqs[0];var y=eqs[1];var that=this;x.computeGq=function(){vec2.rotate(worldPivotA,that.pivotA,bodyA.angle);vec2.rotate(worldPivotB,that.pivotB,bodyB.angle);vec2.add(g,bodyB.position,worldPivotB);vec2.sub(g,g,bodyA.position);vec2.sub(g,g,worldPivotA);return vec2.dot(g,xAxis);};y.computeGq=function(){vec2.rotate(worldPivotA,that.pivotA,bodyA.angle);vec2.rotate(worldPivotB,that.pivotB,bodyB.angle);vec2.add(g,bodyB.position,worldPivotB);vec2.sub(g,g,bodyA.position);vec2.sub(g,g,worldPivotA);return vec2.dot(g,yAxis);};y.minForce=x.minForce=-maxForce;y.maxForce=x.maxForce=maxForce;this.motorEquation=new RotationalVelocityEquation(bodyA,bodyB);this.motorEnabled=false;this.angle=0;this.lowerLimitEnabled=false;this.upperLimitEnabled=false;this.lowerLimit=0;this.upperLimit=0;this.upperLimitEquation=new RotationalLockEquation(bodyA,bodyB);this.lowerLimitEquation=new RotationalLockEquation(bodyA,bodyB);this.upperLimitEquation.minForce=0;this.lowerLimitEquation.maxForce=0;}
RevoluteConstraint.prototype=new Constraint();RevoluteConstraint.prototype.constructor=RevoluteConstraint;RevoluteConstraint.prototype.setLimits=function(lower,upper){if(typeof(lower)==='number'){this.lowerLimit=lower;this.lowerLimitEnabled=true;}else{this.lowerLimit=lower;this.lowerLimitEnabled=false;}
if(typeof(upper)==='number'){this.upperLimit=upper;this.upperLimitEnabled=true;}else{this.upperLimit=upper;this.upperLimitEnabled=false;}};RevoluteConstraint.prototype.update=function(){var bodyA=this.bodyA,bodyB=this.bodyB,pivotA=this.pivotA,pivotB=this.pivotB,eqs=this.equations,normal=eqs[0],tangent=eqs[1],x=eqs[0],y=eqs[1],upperLimit=this.upperLimit,lowerLimit=this.lowerLimit,upperLimitEquation=this.upperLimitEquation,lowerLimitEquation=this.lowerLimitEquation;var relAngle=this.angle=bodyB.angle-bodyA.angle;if(this.upperLimitEnabled&&relAngle>upperLimit){upperLimitEquation.angle=upperLimit;if(eqs.indexOf(upperLimitEquation)===-1){eqs.push(upperLimitEquation);}}else{var idx=eqs.indexOf(upperLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}
if(this.lowerLimitEnabled&&relAngle<lowerLimit){lowerLimitEquation.angle=lowerLimit;if(eqs.indexOf(lowerLimitEquation)===-1){eqs.push(lowerLimitEquation);}}else{var idx=eqs.indexOf(lowerLimitEquation);if(idx!==-1){eqs.splice(idx,1);}}
vec2.rotate(worldPivotA,pivotA,bodyA.angle);vec2.rotate(worldPivotB,pivotB,bodyB.angle);x.G[0]=-1;x.G[1]=0;x.G[2]=-vec2.crossLength(worldPivotA,xAxis);x.G[3]=1;x.G[4]=0;x.G[5]=vec2.crossLength(worldPivotB,xAxis);y.G[0]=0;y.G[1]=-1;y.G[2]=-vec2.crossLength(worldPivotA,yAxis);y.G[3]=0;y.G[4]=1;y.G[5]=vec2.crossLength(worldPivotB,yAxis);};RevoluteConstraint.prototype.enableMotor=function(){if(this.motorEnabled){return;}
this.equations.push(this.motorEquation);this.motorEnabled=true;};RevoluteConstraint.prototype.disableMotor=function(){if(!this.motorEnabled){return;}
var i=this.equations.indexOf(this.motorEquation);this.equations.splice(i,1);this.motorEnabled=false;};RevoluteConstraint.prototype.motorIsEnabled=function(){return!!this.motorEnabled;};RevoluteConstraint.prototype.setMotorSpeed=function(speed){if(!this.motorEnabled){return;}
var i=this.equations.indexOf(this.motorEquation);this.equations[i].relativeVelocity=speed;};RevoluteConstraint.prototype.getMotorSpeed=function(){if(!this.motorEnabled){return false;}
return this.motorEquation.relativeVelocity;};},{"../equations/Equation":22,"../equations/RotationalLockEquation":24,"../equations/RotationalVelocityEquation":25,"../math/vec2":30,"./Constraint":14}],20:[function(_dereq_,module,exports){var Equation=_dereq_("./Equation"),vec2=_dereq_('../math/vec2');module.exports=AngleLockEquation;function AngleLockEquation(bodyA,bodyB,options){options=options||{};Equation.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);this.angle=options.angle||0;this.ratio=typeof(options.ratio)==="number"?options.ratio:1;this.setRatio(this.ratio);}
AngleLockEquation.prototype=new Equation();AngleLockEquation.prototype.constructor=AngleLockEquation;AngleLockEquation.prototype.computeGq=function(){return this.ratio*this.bodyA.angle-this.bodyB.angle+this.angle;};AngleLockEquation.prototype.setRatio=function(ratio){var G=this.G;G[2]=ratio;G[5]=-1;this.ratio=ratio;};AngleLockEquation.prototype.setMaxTorque=function(torque){this.maxForce=torque;this.minForce=-torque;};},{"../math/vec2":30,"./Equation":22}],21:[function(_dereq_,module,exports){var Equation=_dereq_("./Equation"),vec2=_dereq_('../math/vec2');module.exports=ContactEquation;function ContactEquation(bodyA,bodyB){Equation.call(this,bodyA,bodyB,0,Number.MAX_VALUE);this.contactPointA=vec2.create();this.penetrationVec=vec2.create();this.contactPointB=vec2.create();this.normalA=vec2.create();this.restitution=0;this.firstImpact=false;this.shapeA=null;this.shapeB=null;}
ContactEquation.prototype=new Equation();ContactEquation.prototype.constructor=ContactEquation;ContactEquation.prototype.computeB=function(a,b,h){var bi=this.bodyA,bj=this.bodyB,ri=this.contactPointA,rj=this.contactPointB,xi=bi.position,xj=bj.position;var penetrationVec=this.penetrationVec,n=this.normalA,G=this.G;var rixn=vec2.crossLength(ri,n),rjxn=vec2.crossLength(rj,n);G[0]=-n[0];G[1]=-n[1];G[2]=-rixn;G[3]=n[0];G[4]=n[1];G[5]=rjxn;vec2.add(penetrationVec,xj,rj);vec2.sub(penetrationVec,penetrationVec,xi);vec2.sub(penetrationVec,penetrationVec,ri);var GW,Gq;if(this.firstImpact&&this.restitution!==0){Gq=0;GW=(1/b)*(1+this.restitution)*this.computeGW();}else{Gq=vec2.dot(n,penetrationVec)+this.offset;GW=this.computeGW();}
var GiMf=this.computeGiMf();var B=-Gq*a-GW*b-h*GiMf;return B;};},{"../math/vec2":30,"./Equation":22}],22:[function(_dereq_,module,exports){module.exports=Equation;var vec2=_dereq_('../math/vec2'),Utils=_dereq_('../utils/Utils'),Body=_dereq_('../objects/Body');function Equation(bodyA,bodyB,minForce,maxForce){this.minForce=typeof(minForce)==="undefined"?-Number.MAX_VALUE:minForce;this.maxForce=typeof(maxForce)==="undefined"?Number.MAX_VALUE:maxForce;this.bodyA=bodyA;this.bodyB=bodyB;this.stiffness=Equation.DEFAULT_STIFFNESS;this.relaxation=Equation.DEFAULT_RELAXATION;this.G=new Utils.ARRAY_TYPE(6);for(var i=0;i<6;i++){this.G[i]=0;}
this.offset=0;this.a=0;this.b=0;this.epsilon=0;this.timeStep=1/60;this.needsUpdate=true;this.multiplier=0;this.relativeVelocity=0;this.enabled=true;}
Equation.prototype.constructor=Equation;Equation.DEFAULT_STIFFNESS=1e6;Equation.DEFAULT_RELAXATION=4;Equation.prototype.update=function(){var k=this.stiffness,d=this.relaxation,h=this.timeStep;this.a=4.0 /(h*(1+4*d));this.b=(4.0*d)/(1+4*d);this.epsilon=4.0 /(h*h*k*(1+4*d));this.needsUpdate=false;};Equation.prototype.gmult=function(G,vi,wi,vj,wj){return G[0]*vi[0]+
G[1]*vi[1]+
G[2]*wi+
G[3]*vj[0]+
G[4]*vj[1]+
G[5]*wj;};Equation.prototype.computeB=function(a,b,h){var GW=this.computeGW();var Gq=this.computeGq();var GiMf=this.computeGiMf();return-Gq*a-GW*b-GiMf*h;};var qi=vec2.create(),qj=vec2.create();Equation.prototype.computeGq=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,xi=bi.position,xj=bj.position,ai=bi.angle,aj=bj.angle;return this.gmult(G,qi,ai,qj,aj)+this.offset;};Equation.prototype.computeGW=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.velocity,vj=bj.velocity,wi=bi.angularVelocity,wj=bj.angularVelocity;return this.gmult(G,vi,wi,vj,wj)+this.relativeVelocity;};Equation.prototype.computeGWlambda=function(){var G=this.G,bi=this.bodyA,bj=this.bodyB,vi=bi.vlambda,vj=bj.vlambda,wi=bi.wlambda,wj=bj.wlambda;return this.gmult(G,vi,wi,vj,wj);};var iMfi=vec2.create(),iMfj=vec2.create();Equation.prototype.computeGiMf=function(){var bi=this.bodyA,bj=this.bodyB,fi=bi.force,ti=bi.angularForce,fj=bj.force,tj=bj.angularForce,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,G=this.G;vec2.scale(iMfi,fi,invMassi);vec2.multiply(iMfi,bi.massMultiplier,iMfi);vec2.scale(iMfj,fj,invMassj);vec2.multiply(iMfj,bj.massMultiplier,iMfj);return this.gmult(G,iMfi,ti*invIi,iMfj,tj*invIj);};Equation.prototype.computeGiMGt=function(){var bi=this.bodyA,bj=this.bodyB,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,G=this.G;return G[0]*G[0]*invMassi*bi.massMultiplier[0]+
G[1]*G[1]*invMassi*bi.massMultiplier[1]+
G[2]*G[2]*invIi+
G[3]*G[3]*invMassj*bj.massMultiplier[0]+
G[4]*G[4]*invMassj*bj.massMultiplier[1]+
G[5]*G[5]*invIj;};var addToWlambda_temp=vec2.create(),addToWlambda_Gi=vec2.create(),addToWlambda_Gj=vec2.create(),addToWlambda_ri=vec2.create(),addToWlambda_rj=vec2.create(),addToWlambda_Mdiag=vec2.create();Equation.prototype.addToWlambda=function(deltalambda){var bi=this.bodyA,bj=this.bodyB,temp=addToWlambda_temp,Gi=addToWlambda_Gi,Gj=addToWlambda_Gj,ri=addToWlambda_ri,rj=addToWlambda_rj,invMassi=bi.invMassSolve,invMassj=bj.invMassSolve,invIi=bi.invInertiaSolve,invIj=bj.invInertiaSolve,Mdiag=addToWlambda_Mdiag,G=this.G;Gi[0]=G[0];Gi[1]=G[1];Gj[0]=G[3];Gj[1]=G[4];vec2.scale(temp,Gi,invMassi*deltalambda);vec2.multiply(temp,temp,bi.massMultiplier);vec2.add(bi.vlambda,bi.vlambda,temp);bi.wlambda+=invIi*G[2]*deltalambda;vec2.scale(temp,Gj,invMassj*deltalambda);vec2.multiply(temp,temp,bj.massMultiplier);vec2.add(bj.vlambda,bj.vlambda,temp);bj.wlambda+=invIj*G[5]*deltalambda;};Equation.prototype.computeInvC=function(eps){return 1.0 /(this.computeGiMGt()+eps);};},{"../math/vec2":30,"../objects/Body":31,"../utils/Utils":57}],23:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),Equation=_dereq_('./Equation'),Utils=_dereq_('../utils/Utils');module.exports=FrictionEquation;function FrictionEquation(bodyA,bodyB,slipForce){Equation.call(this,bodyA,bodyB,-slipForce,slipForce);this.contactPointA=vec2.create();this.contactPointB=vec2.create();this.t=vec2.create();this.contactEquations=[];this.shapeA=null;this.shapeB=null;this.frictionCoefficient=0.3;}
FrictionEquation.prototype=new Equation();FrictionEquation.prototype.constructor=FrictionEquation;FrictionEquation.prototype.setSlipForce=function(slipForce){this.maxForce=slipForce;this.minForce=-slipForce;};FrictionEquation.prototype.getSlipForce=function(){return this.maxForce;};FrictionEquation.prototype.computeB=function(a,b,h){var bi=this.bodyA,bj=this.bodyB,ri=this.contactPointA,rj=this.contactPointB,t=this.t,G=this.G;G[0]=-t[0];G[1]=-t[1];G[2]=-vec2.crossLength(ri,t);G[3]=t[0];G[4]=t[1];G[5]=vec2.crossLength(rj,t);var GW=this.computeGW(),GiMf=this.computeGiMf();var B=-GW*b-h*GiMf;return B;};},{"../math/vec2":30,"../utils/Utils":57,"./Equation":22}],24:[function(_dereq_,module,exports){var Equation=_dereq_("./Equation"),vec2=_dereq_('../math/vec2');module.exports=RotationalLockEquation;function RotationalLockEquation(bodyA,bodyB,options){options=options||{};Equation.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);this.angle=options.angle||0;var G=this.G;G[2]=1;G[5]=-1;}
RotationalLockEquation.prototype=new Equation();RotationalLockEquation.prototype.constructor=RotationalLockEquation;var worldVectorA=vec2.create(),worldVectorB=vec2.create(),xAxis=vec2.fromValues(1,0),yAxis=vec2.fromValues(0,1);RotationalLockEquation.prototype.computeGq=function(){vec2.rotate(worldVectorA,xAxis,this.bodyA.angle+this.angle);vec2.rotate(worldVectorB,yAxis,this.bodyB.angle);return vec2.dot(worldVectorA,worldVectorB);};},{"../math/vec2":30,"./Equation":22}],25:[function(_dereq_,module,exports){var Equation=_dereq_("./Equation"),vec2=_dereq_('../math/vec2');module.exports=RotationalVelocityEquation;function RotationalVelocityEquation(bodyA,bodyB){Equation.call(this,bodyA,bodyB,-Number.MAX_VALUE,Number.MAX_VALUE);this.relativeVelocity=1;this.ratio=1;}
RotationalVelocityEquation.prototype=new Equation();RotationalVelocityEquation.prototype.constructor=RotationalVelocityEquation;RotationalVelocityEquation.prototype.computeB=function(a,b,h){var G=this.G;G[2]=-1;G[5]=this.ratio;var GiMf=this.computeGiMf();var GW=this.computeGW();var B=-GW*b-h*GiMf;return B;};},{"../math/vec2":30,"./Equation":22}],26:[function(_dereq_,module,exports){var EventEmitter=function(){};module.exports=EventEmitter;EventEmitter.prototype={constructor:EventEmitter,on:function(type,listener,context){listener.context=context||this;if(this._listeners===undefined){this._listeners={};}
var listeners=this._listeners;if(listeners[type]===undefined){listeners[type]=[];}
if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener);}
return this;},has:function(type,listener){if(this._listeners===undefined){return false;}
var listeners=this._listeners;if(listener){if(listeners[type]!==undefined&&listeners[type].indexOf(listener)!==-1){return true;}}else{if(listeners[type]!==undefined){return true;}}
return false;},off:function(type,listener){if(this._listeners===undefined){return this;}
var listeners=this._listeners;var index=listeners[type].indexOf(listener);if(index!==-1){listeners[type].splice(index,1);}
return this;},emit:function(event){if(this._listeners===undefined){return this;}
var listeners=this._listeners;var listenerArray=listeners[event.type];if(listenerArray!==undefined){event.target=this;for(var i=0,l=listenerArray.length;i<l;i++){var listener=listenerArray[i];listener.call(listener.context,event);}}
return this;}};},{}],27:[function(_dereq_,module,exports){var Material=_dereq_('./Material');var Equation=_dereq_('../equations/Equation');module.exports=ContactMaterial;function ContactMaterial(materialA,materialB,options){options=options||{};if(!(materialA instanceof Material)||!(materialB instanceof Material)){throw new Error("First two arguments must be Material instances.");}
this.id=ContactMaterial.idCounter++;this.materialA=materialA;this.materialB=materialB;this.friction=typeof(options.friction)!=="undefined"?Number(options.friction):0.3;this.restitution=typeof(options.restitution)!=="undefined"?Number(options.restitution):0.0;this.stiffness=typeof(options.stiffness)!=="undefined"?Number(options.stiffness):Equation.DEFAULT_STIFFNESS;this.relaxation=typeof(options.relaxation)!=="undefined"?Number(options.relaxation):Equation.DEFAULT_RELAXATION;this.frictionStiffness=typeof(options.frictionStiffness)!=="undefined"?Number(options.frictionStiffness):Equation.DEFAULT_STIFFNESS;this.frictionRelaxation=typeof(options.frictionRelaxation)!=="undefined"?Number(options.frictionRelaxation):Equation.DEFAULT_RELAXATION;this.surfaceVelocity=typeof(options.surfaceVelocity)!=="undefined"?Number(options.surfaceVelocity):0;this.contactSkinSize=0.005;}
ContactMaterial.idCounter=0;},{"../equations/Equation":22,"./Material":28}],28:[function(_dereq_,module,exports){module.exports=Material;function Material(id){this.id=id||Material.idCounter++;}
Material.idCounter=0;},{}],29:[function(_dereq_,module,exports){var PolyK={};PolyK.GetArea=function(p)
{if(p.length<6)return 0;var l=p.length-2;var sum=0;for(var i=0;i<l;i+=2)
sum+=(p[i+2]-p[i])*(p[i+1]+p[i+3]);sum+=(p[0]-p[l])*(p[l+1]+p[1]);return-sum*0.5;}
PolyK.Triangulate=function(p)
{var n=p.length>>1;if(n<3)return[];var tgs=[];var avl=[];for(var i=0;i<n;i++)avl.push(i);var i=0;var al=n;while(al>3)
{var i0=avl[(i+0)%al];var i1=avl[(i+1)%al];var i2=avl[(i+2)%al];var ax=p[2*i0],ay=p[2*i0+1];var bx=p[2*i1],by=p[2*i1+1];var cx=p[2*i2],cy=p[2*i2+1];var earFound=false;if(PolyK._convex(ax,ay,bx,by,cx,cy))
{earFound=true;for(var j=0;j<al;j++)
{var vi=avl[j];if(vi==i0||vi==i1||vi==i2)continue;if(PolyK._PointInTriangle(p[2*vi],p[2*vi+1],ax,ay,bx,by,cx,cy)){earFound=false;break;}}}
if(earFound)
{tgs.push(i0,i1,i2);avl.splice((i+1)%al,1);al--;i=0;}
else if(i++>3*al)break;}
tgs.push(avl[0],avl[1],avl[2]);return tgs;}
PolyK._PointInTriangle=function(px,py,ax,ay,bx,by,cx,cy)
{var v0x=cx-ax;var v0y=cy-ay;var v1x=bx-ax;var v1y=by-ay;var v2x=px-ax;var v2y=py-ay;var dot00=v0x*v0x+v0y*v0y;var dot01=v0x*v1x+v0y*v1y;var dot02=v0x*v2x+v0y*v2y;var dot11=v1x*v1x+v1y*v1y;var dot12=v1x*v2x+v1y*v2y;var invDenom=1 /(dot00*dot11-dot01*dot01);var u=(dot11*dot02-dot01*dot12)*invDenom;var v=(dot00*dot12-dot01*dot02)*invDenom;return(u>=0)&&(v>=0)&&(u+v<1);}
PolyK._convex=function(ax,ay,bx,by,cx,cy)
{return(ay-by)*(cx-bx)+(bx-ax)*(cy-by)>=0;}
module.exports=PolyK;},{}],30:[function(_dereq_,module,exports){var vec2=module.exports={};var Utils=_dereq_('../utils/Utils');vec2.crossLength=function(a,b){return a[0]*b[1]-a[1]*b[0];};vec2.crossVZ=function(out,vec,zcomp){vec2.rotate(out,vec,-Math.PI/2);vec2.scale(out,out,zcomp);return out;};vec2.crossZV=function(out,zcomp,vec){vec2.rotate(out,vec,Math.PI/2);vec2.scale(out,out,zcomp);return out;};vec2.rotate=function(out,a,angle){if(angle!==0){var c=Math.cos(angle),s=Math.sin(angle),x=a[0],y=a[1];out[0]=c*x-s*y;out[1]=s*x+c*y;}else{out[0]=a[0];out[1]=a[1];}};vec2.rotate90cw=function(out,a){var x=a[0];var y=a[1];out[0]=y;out[1]=-x;};vec2.toLocalFrame=function(out,worldPoint,framePosition,frameAngle){vec2.copy(out,worldPoint);vec2.sub(out,out,framePosition);vec2.rotate(out,out,-frameAngle);};vec2.toGlobalFrame=function(out,localPoint,framePosition,frameAngle){vec2.copy(out,localPoint);vec2.rotate(out,out,frameAngle);vec2.add(out,out,framePosition);};vec2.vectorToLocalFrame=function(out,worldVector,frameAngle){vec2.rotate(out,worldVector,-frameAngle);};vec2.vectorToGlobalFrame=function(out,localVector,frameAngle){vec2.rotate(out,localVector,frameAngle);};vec2.centroid=function(out,a,b,c){vec2.add(out,a,b);vec2.add(out,out,c);vec2.scale(out,out,1/3);return out;};vec2.create=function(){var out=new Utils.ARRAY_TYPE(2);out[0]=0;out[1]=0;return out;};vec2.clone=function(a){var out=new Utils.ARRAY_TYPE(2);out[0]=a[0];out[1]=a[1];return out;};vec2.fromValues=function(x,y){var out=new Utils.ARRAY_TYPE(2);out[0]=x;out[1]=y;return out;};vec2.copy=function(out,a){out[0]=a[0];out[1]=a[1];return out;};vec2.set=function(out,x,y){out[0]=x;out[1]=y;return out;};vec2.add=function(out,a,b){out[0]=a[0]+b[0];out[1]=a[1]+b[1];return out;};vec2.subtract=function(out,a,b){out[0]=a[0]-b[0];out[1]=a[1]-b[1];return out;};vec2.sub=vec2.subtract;vec2.multiply=function(out,a,b){out[0]=a[0]*b[0];out[1]=a[1]*b[1];return out;};vec2.mul=vec2.multiply;vec2.divide=function(out,a,b){out[0]=a[0]/ b[0];out[1]=a[1]/ b[1];return out;};vec2.div=vec2.divide;vec2.scale=function(out,a,b){out[0]=a[0]*b;out[1]=a[1]*b;return out;};vec2.distance=function(a,b){var x=b[0]-a[0],y=b[1]-a[1];return Math.sqrt(x*x+y*y);};vec2.dist=vec2.distance;vec2.squaredDistance=function(a,b){var x=b[0]-a[0],y=b[1]-a[1];return x*x+y*y;};vec2.sqrDist=vec2.squaredDistance;vec2.length=function(a){var x=a[0],y=a[1];return Math.sqrt(x*x+y*y);};vec2.len=vec2.length;vec2.squaredLength=function(a){var x=a[0],y=a[1];return x*x+y*y;};vec2.sqrLen=vec2.squaredLength;vec2.negate=function(out,a){out[0]=-a[0];out[1]=-a[1];return out;};vec2.normalize=function(out,a){var x=a[0],y=a[1];var len=x*x+y*y;if(len>0){len=1 / Math.sqrt(len);out[0]=a[0]*len;out[1]=a[1]*len;}
return out;};vec2.dot=function(a,b){return a[0]*b[0]+a[1]*b[1];};vec2.str=function(a){return'vec2('+a[0]+', '+a[1]+')';};vec2.lerp=function(out,a,b,t){var ax=a[0],ay=a[1];out[0]=ax+t*(b[0]-ax);out[1]=ay+t*(b[1]-ay);return out;};vec2.reflect=function(out,vector,normal){var dot=vector[0]*normal[0]+vector[1]*normal[1];out[0]=vector[0]-2*normal[0]*dot;out[1]=vector[1]-2*normal[1]*dot;};vec2.getLineSegmentsIntersection=function(out,p0,p1,p2,p3){var t=vec2.getLineSegmentsIntersectionFraction(p0,p1,p2,p3);if(t<0){return false;}else{out[0]=p0[0]+(t*(p1[0]-p0[0]));out[1]=p0[1]+(t*(p1[1]-p0[1]));return true;}};vec2.getLineSegmentsIntersectionFraction=function(p0,p1,p2,p3){var s1_x=p1[0]-p0[0];var s1_y=p1[1]-p0[1];var s2_x=p3[0]-p2[0];var s2_y=p3[1]-p2[1];var s,t;s=(-s1_y*(p0[0]-p2[0])+s1_x*(p0[1]-p2[1]))/(-s2_x*s1_y+s1_x*s2_y);t=(s2_x*(p0[1]-p2[1])-s2_y*(p0[0]-p2[0]))/(-s2_x*s1_y+s1_x*s2_y);if(s>=0&&s<=1&&t>=0&&t<=1){return t;}
return-1;};},{"../utils/Utils":57}],31:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),decomp=_dereq_('poly-decomp'),Convex=_dereq_('../shapes/Convex'),RaycastResult=_dereq_('../collision/RaycastResult'),Ray=_dereq_('../collision/Ray'),AABB=_dereq_('../collision/AABB'),EventEmitter=_dereq_('../events/EventEmitter');module.exports=Body;function Body(options){options=options||{};EventEmitter.call(this);this.id=options.id||++Body._idCounter;this.world=null;this.shapes=[];this.mass=options.mass||0;this.invMass=0;this.inertia=0;this.invInertia=0;this.invMassSolve=0;this.invInertiaSolve=0;this.fixedRotation=!!options.fixedRotation;this.fixedX=!!options.fixedX;this.fixedY=!!options.fixedY;this.massMultiplier=vec2.create();this.position=vec2.fromValues(0,0);if(options.position){vec2.copy(this.position,options.position);}
this.interpolatedPosition=vec2.fromValues(0,0);this.interpolatedAngle=0;this.previousPosition=vec2.fromValues(0,0);this.previousAngle=0;this.velocity=vec2.fromValues(0,0);if(options.velocity){vec2.copy(this.velocity,options.velocity);}
this.vlambda=vec2.fromValues(0,0);this.wlambda=0;this.angle=options.angle||0;this.angularVelocity=options.angularVelocity||0;this.force=vec2.create();if(options.force){vec2.copy(this.force,options.force);}
this.angularForce=options.angularForce||0;this.damping=typeof(options.damping)==="number"?options.damping:0.1;this.angularDamping=typeof(options.angularDamping)==="number"?options.angularDamping:0.1;this.type=Body.STATIC;if(typeof(options.type)!=='undefined'){this.type=options.type;}else if(!options.mass){this.type=Body.STATIC;}else{this.type=Body.DYNAMIC;}
this.boundingRadius=0;this.aabb=new AABB();this.aabbNeedsUpdate=true;this.allowSleep=options.allowSleep!==undefined?options.allowSleep:true;this.wantsToSleep=false;this.sleepState=Body.AWAKE;this.sleepSpeedLimit=options.sleepSpeedLimit!==undefined?options.sleepSpeedLimit:0.2;this.sleepTimeLimit=options.sleepTimeLimit!==undefined?options.sleepTimeLimit:1;this.gravityScale=options.gravityScale!==undefined?options.gravityScale:1;this.collisionResponse=options.collisionResponse!==undefined?options.collisionResponse:true;this.idleTime=0;this.timeLastSleepy=0;this.ccdSpeedThreshold=options.ccdSpeedThreshold!==undefined?options.ccdSpeedThreshold:-1;this.ccdIterations=options.ccdIterations!==undefined?options.ccdIterations:10;this.concavePath=null;this._wakeUpAfterNarrowphase=false;this.updateMassProperties();}
Body.prototype=new EventEmitter();Body.prototype.constructor=Body;Body._idCounter=0;Body.prototype.updateSolveMassProperties=function(){if(this.sleepState===Body.SLEEPING||this.type===Body.KINEMATIC){this.invMassSolve=0;this.invInertiaSolve=0;}else{this.invMassSolve=this.invMass;this.invInertiaSolve=this.invInertia;}};Body.prototype.setDensity=function(density){var totalArea=this.getArea();this.mass=totalArea*density;this.updateMassProperties();};Body.prototype.getArea=function(){var totalArea=0;for(var i=0;i<this.shapes.length;i++){totalArea+=this.shapes[i].area;}
return totalArea;};Body.prototype.getAABB=function(){if(this.aabbNeedsUpdate){this.updateAABB();}
return this.aabb;};var shapeAABB=new AABB(),tmp=vec2.create();Body.prototype.updateAABB=function(){var shapes=this.shapes,N=shapes.length,offset=tmp,bodyAngle=this.angle;for(var i=0;i!==N;i++){var shape=shapes[i],angle=shape.angle+bodyAngle;vec2.rotate(offset,shape.position,bodyAngle);vec2.add(offset,offset,this.position);shape.computeAABB(shapeAABB,offset,angle);if(i===0){this.aabb.copy(shapeAABB);}else{this.aabb.extend(shapeAABB);}}
this.aabbNeedsUpdate=false;};Body.prototype.updateBoundingRadius=function(){var shapes=this.shapes,N=shapes.length,radius=0;for(var i=0;i!==N;i++){var shape=shapes[i],offset=vec2.length(shape.position),r=shape.boundingRadius;if(offset+r>radius){radius=offset+r;}}
this.boundingRadius=radius;};Body.prototype.addShape=function(shape,offset,angle){if(shape.body){throw new Error('A shape can only be added to one body.');}
shape.body=this;if(offset){vec2.copy(shape.position,offset);}else{vec2.set(shape.position,0,0);}
shape.angle=angle||0;this.shapes.push(shape);this.updateMassProperties();this.updateBoundingRadius();this.aabbNeedsUpdate=true;};Body.prototype.removeShape=function(shape){var idx=this.shapes.indexOf(shape);if(idx!==-1){this.shapes.splice(idx,1);this.aabbNeedsUpdate=true;shape.body=null;return true;}else{return false;}};Body.prototype.updateMassProperties=function(){if(this.type===Body.STATIC||this.type===Body.KINEMATIC){this.mass=Number.MAX_VALUE;this.invMass=0;this.inertia=Number.MAX_VALUE;this.invInertia=0;}else{var shapes=this.shapes,N=shapes.length,m=this.mass / N,I=0;if(!this.fixedRotation){for(var i=0;i<N;i++){var shape=shapes[i],r2=vec2.squaredLength(shape.position),Icm=shape.computeMomentOfInertia(m);I+=Icm+m*r2;}
this.inertia=I;this.invInertia=I>0?1/I:0;}else{this.inertia=Number.MAX_VALUE;this.invInertia=0;}
this.invMass=1 / this.mass;vec2.set(this.massMultiplier,this.fixedX?0:1,this.fixedY?0:1);}};var Body_applyForce_r=vec2.create();Body.prototype.applyForce=function(force,relativePoint){vec2.add(this.force,this.force,force);if(relativePoint){var rotForce=vec2.crossLength(relativePoint,force);this.angularForce+=rotForce;}};var Body_applyForce_forceWorld=vec2.create();var Body_applyForce_pointWorld=vec2.create();var Body_applyForce_pointLocal=vec2.create();Body.prototype.applyForceLocal=function(localForce,localPoint){localPoint=localPoint||Body_applyForce_pointLocal;var worldForce=Body_applyForce_forceWorld;var worldPoint=Body_applyForce_pointWorld;this.vectorToWorldFrame(worldForce,localForce);this.vectorToWorldFrame(worldPoint,localPoint);this.applyForce(worldForce,worldPoint);};var Body_applyImpulse_velo=vec2.create();Body.prototype.applyImpulse=function(impulseVector,relativePoint){if(this.type!==Body.DYNAMIC){return;}
var velo=Body_applyImpulse_velo;vec2.scale(velo,impulseVector,this.invMass);vec2.multiply(velo,this.massMultiplier,velo);vec2.add(this.velocity,velo,this.velocity);if(relativePoint){var rotVelo=vec2.crossLength(relativePoint,impulseVector);rotVelo*=this.invInertia;this.angularVelocity+=rotVelo;}};var Body_applyImpulse_impulseWorld=vec2.create();var Body_applyImpulse_pointWorld=vec2.create();var Body_applyImpulse_pointLocal=vec2.create();Body.prototype.applyImpulseLocal=function(localImpulse,localPoint){localPoint=localPoint||Body_applyImpulse_pointLocal;var worldImpulse=Body_applyImpulse_impulseWorld;var worldPoint=Body_applyImpulse_pointWorld;this.vectorToWorldFrame(worldImpulse,localImpulse);this.vectorToWorldFrame(worldPoint,localPoint);this.applyImpulse(worldImpulse,worldPoint);};Body.prototype.toLocalFrame=function(out,worldPoint){vec2.toLocalFrame(out,worldPoint,this.position,this.angle);};Body.prototype.toWorldFrame=function(out,localPoint){vec2.toGlobalFrame(out,localPoint,this.position,this.angle);};Body.prototype.vectorToLocalFrame=function(out,worldVector){vec2.vectorToLocalFrame(out,worldVector,this.angle);};Body.prototype.vectorToWorldFrame=function(out,localVector){vec2.vectorToGlobalFrame(out,localVector,this.angle);};Body.prototype.fromPolygon=function(path,options){options=options||{};for(var i=this.shapes.length;i>=0;--i){this.removeShape(this.shapes[i]);}
var p=new decomp.Polygon();p.vertices=path;p.makeCCW();if(typeof(options.removeCollinearPoints)==="number"){p.removeCollinearPoints(options.removeCollinearPoints);}
if(typeof(options.skipSimpleCheck)==="undefined"){if(!p.isSimple()){return false;}}
this.concavePath=p.vertices.slice(0);for(var i=0;i<this.concavePath.length;i++){var v=[0,0];vec2.copy(v,this.concavePath[i]);this.concavePath[i]=v;}
var convexes;if(options.optimalDecomp){convexes=p.decomp();}else{convexes=p.quickDecomp();}
var cm=vec2.create();for(var i=0;i!==convexes.length;i++){var c=new Convex({vertices:convexes[i].vertices});for(var j=0;j!==c.vertices.length;j++){var v=c.vertices[j];vec2.sub(v,v,c.centerOfMass);}
vec2.scale(cm,c.centerOfMass,1);c.updateTriangles();c.updateCenterOfMass();c.updateBoundingRadius();this.addShape(c,cm);}
this.adjustCenterOfMass();this.aabbNeedsUpdate=true;return true;};var adjustCenterOfMass_tmp1=vec2.fromValues(0,0),adjustCenterOfMass_tmp2=vec2.fromValues(0,0),adjustCenterOfMass_tmp3=vec2.fromValues(0,0),adjustCenterOfMass_tmp4=vec2.fromValues(0,0);Body.prototype.adjustCenterOfMass=function(){var offset_times_area=adjustCenterOfMass_tmp2,sum=adjustCenterOfMass_tmp3,cm=adjustCenterOfMass_tmp4,totalArea=0;vec2.set(sum,0,0);for(var i=0;i!==this.shapes.length;i++){var s=this.shapes[i];vec2.scale(offset_times_area,s.position,s.area);vec2.add(sum,sum,offset_times_area);totalArea+=s.area;}
vec2.scale(cm,sum,1/totalArea);for(var i=0;i!==this.shapes.length;i++){var s=this.shapes[i];vec2.sub(s.position,s.position,cm);}
vec2.add(this.position,this.position,cm);for(var i=0;this.concavePath&&i<this.concavePath.length;i++){vec2.sub(this.concavePath[i],this.concavePath[i],cm);}
this.updateMassProperties();this.updateBoundingRadius();};Body.prototype.setZeroForce=function(){vec2.set(this.force,0.0,0.0);this.angularForce=0.0;};Body.prototype.resetConstraintVelocity=function(){var b=this,vlambda=b.vlambda;vec2.set(vlambda,0,0);b.wlambda=0;};Body.prototype.addConstraintVelocity=function(){var b=this,v=b.velocity;vec2.add(v,v,b.vlambda);b.angularVelocity+=b.wlambda;};Body.prototype.applyDamping=function(dt){if(this.type===Body.DYNAMIC){var v=this.velocity;vec2.scale(v,v,Math.pow(1.0-this.damping,dt));this.angularVelocity*=Math.pow(1.0-this.angularDamping,dt);}};Body.prototype.wakeUp=function(){var s=this.sleepState;this.sleepState=Body.AWAKE;this.idleTime=0;if(s!==Body.AWAKE){this.emit(Body.wakeUpEvent);}};Body.prototype.sleep=function(){this.sleepState=Body.SLEEPING;this.angularVelocity=0;this.angularForce=0;vec2.set(this.velocity,0,0);vec2.set(this.force,0,0);this.emit(Body.sleepEvent);};Body.prototype.sleepTick=function(time,dontSleep,dt){if(!this.allowSleep||this.type===Body.SLEEPING){return;}
this.wantsToSleep=false;var sleepState=this.sleepState,speedSquared=vec2.squaredLength(this.velocity)+Math.pow(this.angularVelocity,2),speedLimitSquared=Math.pow(this.sleepSpeedLimit,2);if(speedSquared>=speedLimitSquared){this.idleTime=0;this.sleepState=Body.AWAKE;}else{this.idleTime+=dt;this.sleepState=Body.SLEEPY;}
if(this.idleTime>this.sleepTimeLimit){if(!dontSleep){this.sleep();}else{this.wantsToSleep=true;}}};Body.prototype.overlaps=function(body){return this.world.overlapKeeper.bodiesAreOverlapping(this,body);};var integrate_fhMinv=vec2.create();var integrate_velodt=vec2.create();Body.prototype.integrate=function(dt){var minv=this.invMass,f=this.force,pos=this.position,velo=this.velocity;vec2.copy(this.previousPosition,this.position);this.previousAngle=this.angle;if(!this.fixedRotation){this.angularVelocity+=this.angularForce*this.invInertia*dt;}
vec2.scale(integrate_fhMinv,f,dt*minv);vec2.multiply(integrate_fhMinv,this.massMultiplier,integrate_fhMinv);vec2.add(velo,integrate_fhMinv,velo);if(!this.integrateToTimeOfImpact(dt)){vec2.scale(integrate_velodt,velo,dt);vec2.add(pos,pos,integrate_velodt);if(!this.fixedRotation){this.angle+=this.angularVelocity*dt;}}
this.aabbNeedsUpdate=true;};var result=new RaycastResult();var ray=new Ray({mode:Ray.ALL});var direction=vec2.create();var end=vec2.create();var startToEnd=vec2.create();var rememberPosition=vec2.create();Body.prototype.integrateToTimeOfImpact=function(dt){if(this.ccdSpeedThreshold<0||vec2.squaredLength(this.velocity)<Math.pow(this.ccdSpeedThreshold,2)){return false;}
vec2.normalize(direction,this.velocity);vec2.scale(end,this.velocity,dt);vec2.add(end,end,this.position);vec2.sub(startToEnd,end,this.position);var startToEndAngle=this.angularVelocity*dt;var len=vec2.length(startToEnd);var timeOfImpact=1;var hit;var that=this;result.reset();ray.callback=function(result){if(result.body===that){return;}
hit=result.body;result.getHitPoint(end,ray);vec2.sub(startToEnd,end,that.position);timeOfImpact=vec2.length(startToEnd)/ len;result.stop();};vec2.copy(ray.from,this.position);vec2.copy(ray.to,end);ray.update();this.world.raycast(result,ray);if(!hit){return false;}
var rememberAngle=this.angle;vec2.copy(rememberPosition,this.position);var iter=0;var tmin=0;var tmid=0;var tmax=timeOfImpact;while(tmax>=tmin&&iter<this.ccdIterations){iter++;tmid=(tmax-tmin)/ 2;vec2.scale(integrate_velodt,startToEnd,timeOfImpact);vec2.add(this.position,rememberPosition,integrate_velodt);this.angle=rememberAngle+startToEndAngle*timeOfImpact;this.updateAABB();var overlaps=this.aabb.overlaps(hit.aabb)&&this.world.narrowphase.bodiesOverlap(this,hit);if(overlaps){tmin=tmid;}else{tmax=tmid;}}
timeOfImpact=tmid;vec2.copy(this.position,rememberPosition);this.angle=rememberAngle;vec2.scale(integrate_velodt,startToEnd,timeOfImpact);vec2.add(this.position,this.position,integrate_velodt);if(!this.fixedRotation){this.angle+=startToEndAngle*timeOfImpact;}
return true;};Body.prototype.getVelocityAtPoint=function(result,relativePoint){vec2.crossVZ(result,relativePoint,this.angularVelocity);vec2.subtract(result,this.velocity,result);return result;};Body.sleepyEvent={type:"sleepy"};Body.sleepEvent={type:"sleep"};Body.wakeUpEvent={type:"wakeup"};Body.DYNAMIC=1;Body.STATIC=2;Body.KINEMATIC=4;Body.AWAKE=0;Body.SLEEPY=1;Body.SLEEPING=2;},{"../collision/AABB":7,"../collision/Ray":11,"../collision/RaycastResult":12,"../events/EventEmitter":26,"../math/vec2":30,"../shapes/Convex":40,"poly-decomp":5}],32:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Spring=_dereq_('./Spring');var Utils=_dereq_('../utils/Utils');module.exports=LinearSpring;function LinearSpring(bodyA,bodyB,options){options=options||{};Spring.call(this,bodyA,bodyB,options);this.localAnchorA=vec2.fromValues(0,0);this.localAnchorB=vec2.fromValues(0,0);if(options.localAnchorA){vec2.copy(this.localAnchorA,options.localAnchorA);}
if(options.localAnchorB){vec2.copy(this.localAnchorB,options.localAnchorB);}
if(options.worldAnchorA){this.setWorldAnchorA(options.worldAnchorA);}
if(options.worldAnchorB){this.setWorldAnchorB(options.worldAnchorB);}
var worldAnchorA=vec2.create();var worldAnchorB=vec2.create();this.getWorldAnchorA(worldAnchorA);this.getWorldAnchorB(worldAnchorB);var worldDistance=vec2.distance(worldAnchorA,worldAnchorB);this.restLength=typeof(options.restLength)==="number"?options.restLength:worldDistance;}
LinearSpring.prototype=new Spring();LinearSpring.prototype.constructor=LinearSpring;LinearSpring.prototype.setWorldAnchorA=function(worldAnchorA){this.bodyA.toLocalFrame(this.localAnchorA,worldAnchorA);};LinearSpring.prototype.setWorldAnchorB=function(worldAnchorB){this.bodyB.toLocalFrame(this.localAnchorB,worldAnchorB);};LinearSpring.prototype.getWorldAnchorA=function(result){this.bodyA.toWorldFrame(result,this.localAnchorA);};LinearSpring.prototype.getWorldAnchorB=function(result){this.bodyB.toWorldFrame(result,this.localAnchorB);};var applyForce_r=vec2.create(),applyForce_r_unit=vec2.create(),applyForce_u=vec2.create(),applyForce_f=vec2.create(),applyForce_worldAnchorA=vec2.create(),applyForce_worldAnchorB=vec2.create(),applyForce_ri=vec2.create(),applyForce_rj=vec2.create(),applyForce_tmp=vec2.create();LinearSpring.prototype.applyForce=function(){var k=this.stiffness,d=this.damping,l=this.restLength,bodyA=this.bodyA,bodyB=this.bodyB,r=applyForce_r,r_unit=applyForce_r_unit,u=applyForce_u,f=applyForce_f,tmp=applyForce_tmp;var worldAnchorA=applyForce_worldAnchorA,worldAnchorB=applyForce_worldAnchorB,ri=applyForce_ri,rj=applyForce_rj;this.getWorldAnchorA(worldAnchorA);this.getWorldAnchorB(worldAnchorB);vec2.sub(ri,worldAnchorA,bodyA.position);vec2.sub(rj,worldAnchorB,bodyB.position);vec2.sub(r,worldAnchorB,worldAnchorA);var rlen=vec2.len(r);vec2.normalize(r_unit,r);vec2.sub(u,bodyB.velocity,bodyA.velocity);vec2.crossZV(tmp,bodyB.angularVelocity,rj);vec2.add(u,u,tmp);vec2.crossZV(tmp,bodyA.angularVelocity,ri);vec2.sub(u,u,tmp);vec2.scale(f,r_unit,-k*(rlen-l)-d*vec2.dot(u,r_unit));vec2.sub(bodyA.force,bodyA.force,f);vec2.add(bodyB.force,bodyB.force,f);var ri_x_f=vec2.crossLength(ri,f);var rj_x_f=vec2.crossLength(rj,f);bodyA.angularForce-=ri_x_f;bodyB.angularForce+=rj_x_f;};},{"../math/vec2":30,"../utils/Utils":57,"./Spring":34}],33:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Spring=_dereq_('./Spring');module.exports=RotationalSpring;function RotationalSpring(bodyA,bodyB,options){options=options||{};Spring.call(this,bodyA,bodyB,options);this.restAngle=typeof(options.restAngle)==="number"?options.restAngle:bodyB.angle-bodyA.angle;}
RotationalSpring.prototype=new Spring();RotationalSpring.prototype.constructor=RotationalSpring;RotationalSpring.prototype.applyForce=function(){var k=this.stiffness,d=this.damping,l=this.restAngle,bodyA=this.bodyA,bodyB=this.bodyB,x=bodyB.angle-bodyA.angle,u=bodyB.angularVelocity-bodyA.angularVelocity;var torque=-k*(x-l)-d*u*0;bodyA.angularForce-=torque;bodyB.angularForce+=torque;};},{"../math/vec2":30,"./Spring":34}],34:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Utils=_dereq_('../utils/Utils');module.exports=Spring;function Spring(bodyA,bodyB,options){options=Utils.defaults(options,{stiffness:100,damping:1,});this.stiffness=options.stiffness;this.damping=options.damping;this.bodyA=bodyA;this.bodyB=bodyB;}
Spring.prototype.applyForce=function(){};},{"../math/vec2":30,"../utils/Utils":57}],35:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2');var Utils=_dereq_('../utils/Utils');var Constraint=_dereq_('../constraints/Constraint');var FrictionEquation=_dereq_('../equations/FrictionEquation');var Body=_dereq_('../objects/Body');module.exports=TopDownVehicle;function TopDownVehicle(chassisBody,options){options=options||{};this.chassisBody=chassisBody;this.wheels=[];this.groundBody=new Body({mass:0});this.world=null;var that=this;this.preStepCallback=function(){that.update();};}
TopDownVehicle.prototype.addToWorld=function(world){this.world=world;world.addBody(this.groundBody);world.on('preStep',this.preStepCallback);for(var i=0;i<this.wheels.length;i++){var wheel=this.wheels[i];world.addConstraint(wheel);}};TopDownVehicle.prototype.removeFromWorld=function(){var world=this.world;world.removeBody(this.groundBody);world.off('preStep',this.preStepCallback);for(var i=0;i<this.wheels.length;i++){var wheel=this.wheels[i];world.removeConstraint(wheel);}
this.world=null;};TopDownVehicle.prototype.addWheel=function(wheelOptions){var wheel=new WheelConstraint(this,wheelOptions);this.wheels.push(wheel);return wheel;};TopDownVehicle.prototype.update=function(){for(var i=0;i<this.wheels.length;i++){this.wheels[i].update();}};function WheelConstraint(vehicle,options){options=options||{};this.vehicle=vehicle;this.forwardEquation=new FrictionEquation(vehicle.chassisBody,vehicle.groundBody);this.sideEquation=new FrictionEquation(vehicle.chassisBody,vehicle.groundBody);this.steerValue=0;this.engineForce=0;this.setSideFriction(options.sideFriction!==undefined?options.sideFriction:5);this.localForwardVector=vec2.fromValues(0,1);if(options.localForwardVector){vec2.copy(this.localForwardVector,options.localForwardVector);}
this.localPosition=vec2.fromValues(0,0);if(options.localPosition){vec2.copy(this.localPosition,options.localPosition);}
Constraint.apply(this,vehicle.chassisBody,vehicle.groundBody);this.equations.push(this.forwardEquation,this.sideEquation);this.setBrakeForce(0);}
WheelConstraint.prototype=new Constraint();WheelConstraint.prototype.setBrakeForce=function(force){this.forwardEquation.setSlipForce(force);};WheelConstraint.prototype.setSideFriction=function(force){this.sideEquation.setSlipForce(force);};var worldVelocity=vec2.create();var relativePoint=vec2.create();WheelConstraint.prototype.getSpeed=function(){this.vehicle.chassisBody.vectorToWorldFrame(relativePoint,this.localForwardVector);this.vehicle.chassisBody.getVelocityAtPoint(worldVelocity,relativePoint);return vec2.dot(worldVelocity,relativePoint);};var tmpVec=vec2.create();WheelConstraint.prototype.update=function(){this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.t,this.localForwardVector);vec2.rotate(this.sideEquation.t,this.localForwardVector,Math.PI / 2);this.vehicle.chassisBody.vectorToWorldFrame(this.sideEquation.t,this.sideEquation.t);vec2.rotate(this.forwardEquation.t,this.forwardEquation.t,this.steerValue);vec2.rotate(this.sideEquation.t,this.sideEquation.t,this.steerValue);this.vehicle.chassisBody.toWorldFrame(this.forwardEquation.contactPointB,this.localPosition);vec2.copy(this.sideEquation.contactPointB,this.forwardEquation.contactPointB);this.vehicle.chassisBody.vectorToWorldFrame(this.forwardEquation.contactPointA,this.localPosition);vec2.copy(this.sideEquation.contactPointA,this.forwardEquation.contactPointA);vec2.normalize(tmpVec,this.forwardEquation.t);vec2.scale(tmpVec,tmpVec,this.engineForce);this.vehicle.chassisBody.applyForce(tmpVec,this.forwardEquation.contactPointA);};},{"../constraints/Constraint":14,"../equations/FrictionEquation":23,"../math/vec2":30,"../objects/Body":31,"../utils/Utils":57}],36:[function(_dereq_,module,exports){var p2=module.exports={AABB:_dereq_('./collision/AABB'),AngleLockEquation:_dereq_('./equations/AngleLockEquation'),Body:_dereq_('./objects/Body'),Broadphase:_dereq_('./collision/Broadphase'),Capsule:_dereq_('./shapes/Capsule'),Circle:_dereq_('./shapes/Circle'),Constraint:_dereq_('./constraints/Constraint'),ContactEquation:_dereq_('./equations/ContactEquation'),ContactEquationPool:_dereq_('./utils/ContactEquationPool'),ContactMaterial:_dereq_('./material/ContactMaterial'),Convex:_dereq_('./shapes/Convex'),DistanceConstraint:_dereq_('./constraints/DistanceConstraint'),Equation:_dereq_('./equations/Equation'),EventEmitter:_dereq_('./events/EventEmitter'),FrictionEquation:_dereq_('./equations/FrictionEquation'),FrictionEquationPool:_dereq_('./utils/FrictionEquationPool'),GearConstraint:_dereq_('./constraints/GearConstraint'),GSSolver:_dereq_('./solver/GSSolver'),Heightfield:_dereq_('./shapes/Heightfield'),Line:_dereq_('./shapes/Line'),LockConstraint:_dereq_('./constraints/LockConstraint'),Material:_dereq_('./material/Material'),Narrowphase:_dereq_('./collision/Narrowphase'),NaiveBroadphase:_dereq_('./collision/NaiveBroadphase'),Particle:_dereq_('./shapes/Particle'),Plane:_dereq_('./shapes/Plane'),Pool:_dereq_('./utils/Pool'),RevoluteConstraint:_dereq_('./constraints/RevoluteConstraint'),PrismaticConstraint:_dereq_('./constraints/PrismaticConstraint'),Ray:_dereq_('./collision/Ray'),RaycastResult:_dereq_('./collision/RaycastResult'),Box:_dereq_('./shapes/Box'),RotationalVelocityEquation:_dereq_('./equations/RotationalVelocityEquation'),SAPBroadphase:_dereq_('./collision/SAPBroadphase'),Shape:_dereq_('./shapes/Shape'),Solver:_dereq_('./solver/Solver'),Spring:_dereq_('./objects/Spring'),TopDownVehicle:_dereq_('./objects/TopDownVehicle'),LinearSpring:_dereq_('./objects/LinearSpring'),RotationalSpring:_dereq_('./objects/RotationalSpring'),Utils:_dereq_('./utils/Utils'),World:_dereq_('./world/World'),vec2:_dereq_('./math/vec2'),version:_dereq_('../package.json').version,};Object.defineProperty(p2,'Rectangle',{get:function(){console.warn('The Rectangle class has been renamed to Box.');return this.Box;}});},{"../package.json":6,"./collision/AABB":7,"./collision/Broadphase":8,"./collision/NaiveBroadphase":9,"./collision/Narrowphase":10,"./collision/Ray":11,"./collision/RaycastResult":12,"./collision/SAPBroadphase":13,"./constraints/Constraint":14,"./constraints/DistanceConstraint":15,"./constraints/GearConstraint":16,"./constraints/LockConstraint":17,"./constraints/PrismaticConstraint":18,"./constraints/RevoluteConstraint":19,"./equations/AngleLockEquation":20,"./equations/ContactEquation":21,"./equations/Equation":22,"./equations/FrictionEquation":23,"./equations/RotationalVelocityEquation":25,"./events/EventEmitter":26,"./material/ContactMaterial":27,"./material/Material":28,"./math/vec2":30,"./objects/Body":31,"./objects/LinearSpring":32,"./objects/RotationalSpring":33,"./objects/Spring":34,"./objects/TopDownVehicle":35,"./shapes/Box":37,"./shapes/Capsule":38,"./shapes/Circle":39,"./shapes/Convex":40,"./shapes/Heightfield":41,"./shapes/Line":42,"./shapes/Particle":43,"./shapes/Plane":44,"./shapes/Shape":45,"./solver/GSSolver":46,"./solver/Solver":47,"./utils/ContactEquationPool":48,"./utils/FrictionEquationPool":49,"./utils/Pool":55,"./utils/Utils":57,"./world/World":61}],37:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),Shape=_dereq_('./Shape'),Convex=_dereq_('./Convex');module.exports=Box;function Box(options){if(typeof(arguments[0])==='number'&&typeof(arguments[1])==='number'){options={width:arguments[0],height:arguments[1]};console.warn('The Rectangle has been renamed to Box and its constructor signature has changed. Please use the following format: new Box({ width: 1, height: 1, ... })');}
options=options||{};var width=this.width=options.width||1;var height=this.height=options.height||1;var verts=[vec2.fromValues(-width/2,-height/2),vec2.fromValues(width/2,-height/2),vec2.fromValues(width/2,height/2),vec2.fromValues(-width/2,height/2)];var axes=[vec2.fromValues(1,0),vec2.fromValues(0,1)];options.vertices=verts;options.axes=axes;options.type=Shape.BOX;Convex.call(this,options);}
Box.prototype=new Convex();Box.prototype.constructor=Box;Box.prototype.computeMomentOfInertia=function(mass){var w=this.width,h=this.height;return mass*(h*h+w*w)/ 12;};Box.prototype.updateBoundingRadius=function(){var w=this.width,h=this.height;this.boundingRadius=Math.sqrt(w*w+h*h)/ 2;};var corner1=vec2.create(),corner2=vec2.create(),corner3=vec2.create(),corner4=vec2.create();Box.prototype.computeAABB=function(out,position,angle){out.setFromPoints(this.vertices,position,angle,0);};Box.prototype.updateArea=function(){this.area=this.width*this.height;};},{"../math/vec2":30,"./Convex":40,"./Shape":45}],38:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2');module.exports=Capsule;function Capsule(options){if(typeof(arguments[0])==='number'&&typeof(arguments[1])==='number'){options={length:arguments[0],radius:arguments[1]};console.warn('The Capsule constructor signature has changed. Please use the following format: new Capsule({ radius: 1, length: 1 })');}
options=options||{};this.length=options.length||1;this.radius=options.radius||1;options.type=Shape.CAPSULE;Shape.call(this,options);}
Capsule.prototype=new Shape();Capsule.prototype.constructor=Capsule;Capsule.prototype.computeMomentOfInertia=function(mass){var r=this.radius,w=this.length+r,h=r*2;return mass*(h*h+w*w)/ 12;};Capsule.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius+this.length/2;};Capsule.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius+this.radius*2*this.length;};var r=vec2.create();Capsule.prototype.computeAABB=function(out,position,angle){var radius=this.radius;vec2.set(r,this.length / 2,0);if(angle!==0){vec2.rotate(r,r,angle);}
vec2.set(out.upperBound,Math.max(r[0]+radius,-r[0]+radius),Math.max(r[1]+radius,-r[1]+radius));vec2.set(out.lowerBound,Math.min(r[0]-radius,-r[0]-radius),Math.min(r[1]-radius,-r[1]-radius));vec2.add(out.lowerBound,out.lowerBound,position);vec2.add(out.upperBound,out.upperBound,position);};var intersectCapsule_hitPointWorld=vec2.create();var intersectCapsule_normal=vec2.create();var intersectCapsule_l0=vec2.create();var intersectCapsule_l1=vec2.create();var intersectCapsule_unit_y=vec2.fromValues(0,1);Capsule.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var hitPointWorld=intersectCapsule_hitPointWorld;var normal=intersectCapsule_normal;var l0=intersectCapsule_l0;var l1=intersectCapsule_l1;var halfLen=this.length / 2;for(var i=0;i<2;i++){var y=this.radius*(i*2-1);vec2.set(l0,-halfLen,y);vec2.set(l1,halfLen,y);vec2.toGlobalFrame(l0,l0,position,angle);vec2.toGlobalFrame(l1,l1,position,angle);var delta=vec2.getLineSegmentsIntersectionFraction(from,to,l0,l1);if(delta>=0){vec2.rotate(normal,intersectCapsule_unit_y,angle);vec2.scale(normal,normal,(i*2-1));ray.reportIntersection(result,delta,normal,-1);if(result.shouldStop(ray)){return;}}}
var diagonalLengthSquared=Math.pow(this.radius,2)+Math.pow(halfLen,2);for(var i=0;i<2;i++){vec2.set(l0,halfLen*(i*2-1),0);vec2.toGlobalFrame(l0,l0,position,angle);var a=Math.pow(to[0]-from[0],2)+Math.pow(to[1]-from[1],2);var b=2*((to[0]-from[0])*(from[0]-l0[0])+(to[1]-from[1])*(from[1]-l0[1]));var c=Math.pow(from[0]-l0[0],2)+Math.pow(from[1]-l0[1],2)-Math.pow(this.radius,2);var delta=Math.pow(b,2)-4*a*c;if(delta<0){continue;}else if(delta===0){vec2.lerp(hitPointWorld,from,to,delta);if(vec2.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2.sub(normal,hitPointWorld,l0);vec2.normalize(normal,normal);ray.reportIntersection(result,delta,normal,-1);if(result.shouldStop(ray)){return;}}}else{var sqrtDelta=Math.sqrt(delta);var inv2a=1 /(2*a);var d1=(-b-sqrtDelta)*inv2a;var d2=(-b+sqrtDelta)*inv2a;if(d1>=0&&d1<=1){vec2.lerp(hitPointWorld,from,to,d1);if(vec2.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2.sub(normal,hitPointWorld,l0);vec2.normalize(normal,normal);ray.reportIntersection(result,d1,normal,-1);if(result.shouldStop(ray)){return;}}}
if(d2>=0&&d2<=1){vec2.lerp(hitPointWorld,from,to,d2);if(vec2.squaredDistance(hitPointWorld,position)>diagonalLengthSquared){vec2.sub(normal,hitPointWorld,l0);vec2.normalize(normal,normal);ray.reportIntersection(result,d2,normal,-1);if(result.shouldStop(ray)){return;}}}}}};},{"../math/vec2":30,"./Shape":45}],39:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2');module.exports=Circle;function Circle(options){if(typeof(arguments[0])==='number'){options={radius:arguments[0]};console.warn('The Circle constructor signature has changed. Please use the following format: new Circle({ radius: 1 })');}
options=options||{};this.radius=options.radius||1;options.type=Shape.CIRCLE;Shape.call(this,options);}
Circle.prototype=new Shape();Circle.prototype.constructor=Circle;Circle.prototype.computeMomentOfInertia=function(mass){var r=this.radius;return mass*r*r / 2;};Circle.prototype.updateBoundingRadius=function(){this.boundingRadius=this.radius;};Circle.prototype.updateArea=function(){this.area=Math.PI*this.radius*this.radius;};Circle.prototype.computeAABB=function(out,position,angle){var r=this.radius;vec2.set(out.upperBound,r,r);vec2.set(out.lowerBound,-r,-r);if(position){vec2.add(out.lowerBound,out.lowerBound,position);vec2.add(out.upperBound,out.upperBound,position);}};var Ray_intersectSphere_intersectionPoint=vec2.create();var Ray_intersectSphere_normal=vec2.create();Circle.prototype.raycast=function(result,ray,position,angle){var from=ray.from,to=ray.to,r=this.radius;var a=Math.pow(to[0]-from[0],2)+Math.pow(to[1]-from[1],2);var b=2*((to[0]-from[0])*(from[0]-position[0])+(to[1]-from[1])*(from[1]-position[1]));var c=Math.pow(from[0]-position[0],2)+Math.pow(from[1]-position[1],2)-Math.pow(r,2);var delta=Math.pow(b,2)-4*a*c;var intersectionPoint=Ray_intersectSphere_intersectionPoint;var normal=Ray_intersectSphere_normal;if(delta<0){return;}else if(delta===0){vec2.lerp(intersectionPoint,from,to,delta);vec2.sub(normal,intersectionPoint,position);vec2.normalize(normal,normal);ray.reportIntersection(result,delta,normal,-1);}else{var sqrtDelta=Math.sqrt(delta);var inv2a=1 /(2*a);var d1=(-b-sqrtDelta)*inv2a;var d2=(-b+sqrtDelta)*inv2a;if(d1>=0&&d1<=1){vec2.lerp(intersectionPoint,from,to,d1);vec2.sub(normal,intersectionPoint,position);vec2.normalize(normal,normal);ray.reportIntersection(result,d1,normal,-1);if(result.shouldStop(ray)){return;}}
if(d2>=0&&d2<=1){vec2.lerp(intersectionPoint,from,to,d2);vec2.sub(normal,intersectionPoint,position);vec2.normalize(normal,normal);ray.reportIntersection(result,d2,normal,-1);}}};},{"../math/vec2":30,"./Shape":45}],40:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2'),polyk=_dereq_('../math/polyk'),decomp=_dereq_('poly-decomp');module.exports=Convex;function Convex(options){if(Array.isArray(arguments[0])){options={vertices:arguments[0],axes:arguments[1]};console.warn('The Convex constructor signature has changed. Please use the following format: new Convex({ vertices: [...], ... })');}
options=options||{};this.vertices=[];var vertices=options.vertices!==undefined?options.vertices:[];for(var i=0;i<vertices.length;i++){var v=vec2.create();vec2.copy(v,vertices[i]);this.vertices.push(v);}
this.axes=[];if(options.axes){for(var i=0;i<options.axes.length;i++){var axis=vec2.create();vec2.copy(axis,options.axes[i]);this.axes.push(axis);}}else{for(var i=0;i<this.vertices.length;i++){var worldPoint0=this.vertices[i];var worldPoint1=this.vertices[(i+1)%this.vertices.length];var normal=vec2.create();vec2.sub(normal,worldPoint1,worldPoint0);vec2.rotate90cw(normal,normal);vec2.normalize(normal,normal);this.axes.push(normal);}}
this.centerOfMass=vec2.fromValues(0,0);this.triangles=[];if(this.vertices.length){this.updateTriangles();this.updateCenterOfMass();}
this.boundingRadius=0;options.type=Shape.CONVEX;Shape.call(this,options);this.updateBoundingRadius();this.updateArea();if(this.area<0){throw new Error("Convex vertices must be given in conter-clockwise winding.");}}
Convex.prototype=new Shape();Convex.prototype.constructor=Convex;var tmpVec1=vec2.create();var tmpVec2=vec2.create();Convex.prototype.projectOntoLocalAxis=function(localAxis,result){var max=null,min=null,v,value,localAxis=tmpVec1;for(var i=0;i<this.vertices.length;i++){v=this.vertices[i];value=vec2.dot(v,localAxis);if(max===null||value>max){max=value;}
if(min===null||value<min){min=value;}}
if(min>max){var t=min;min=max;max=t;}
vec2.set(result,min,max);};Convex.prototype.projectOntoWorldAxis=function(localAxis,shapeOffset,shapeAngle,result){var worldAxis=tmpVec2;this.projectOntoLocalAxis(localAxis,result);if(shapeAngle!==0){vec2.rotate(worldAxis,localAxis,shapeAngle);}else{worldAxis=localAxis;}
var offset=vec2.dot(shapeOffset,worldAxis);vec2.set(result,result[0]+offset,result[1]+offset);};Convex.prototype.updateTriangles=function(){this.triangles.length=0;var polykVerts=[];for(var i=0;i<this.vertices.length;i++){var v=this.vertices[i];polykVerts.push(v[0],v[1]);}
var triangles=polyk.Triangulate(polykVerts);for(var i=0;i<triangles.length;i+=3){var id1=triangles[i],id2=triangles[i+1],id3=triangles[i+2];this.triangles.push([id1,id2,id3]);}};var updateCenterOfMass_centroid=vec2.create(),updateCenterOfMass_centroid_times_mass=vec2.create(),updateCenterOfMass_a=vec2.create(),updateCenterOfMass_b=vec2.create(),updateCenterOfMass_c=vec2.create(),updateCenterOfMass_ac=vec2.create(),updateCenterOfMass_ca=vec2.create(),updateCenterOfMass_cb=vec2.create(),updateCenterOfMass_n=vec2.create();Convex.prototype.updateCenterOfMass=function(){var triangles=this.triangles,verts=this.vertices,cm=this.centerOfMass,centroid=updateCenterOfMass_centroid,n=updateCenterOfMass_n,a=updateCenterOfMass_a,b=updateCenterOfMass_b,c=updateCenterOfMass_c,ac=updateCenterOfMass_ac,ca=updateCenterOfMass_ca,cb=updateCenterOfMass_cb,centroid_times_mass=updateCenterOfMass_centroid_times_mass;vec2.set(cm,0,0);var totalArea=0;for(var i=0;i!==triangles.length;i++){var t=triangles[i],a=verts[t[0]],b=verts[t[1]],c=verts[t[2]];vec2.centroid(centroid,a,b,c);var m=Convex.triangleArea(a,b,c);totalArea+=m;vec2.scale(centroid_times_mass,centroid,m);vec2.add(cm,cm,centroid_times_mass);}
vec2.scale(cm,cm,1/totalArea);};Convex.prototype.computeMomentOfInertia=function(mass){var denom=0.0,numer=0.0,N=this.vertices.length;for(var j=N-1,i=0;i<N;j=i,i++){var p0=this.vertices[j];var p1=this.vertices[i];var a=Math.abs(vec2.crossLength(p0,p1));var b=vec2.dot(p1,p1)+vec2.dot(p1,p0)+vec2.dot(p0,p0);denom+=a*b;numer+=a;}
return(mass / 6.0)*(denom / numer);};Convex.prototype.updateBoundingRadius=function(){var verts=this.vertices,r2=0;for(var i=0;i!==verts.length;i++){var l2=vec2.squaredLength(verts[i]);if(l2>r2){r2=l2;}}
this.boundingRadius=Math.sqrt(r2);};Convex.triangleArea=function(a,b,c){return(((b[0]-a[0])*(c[1]-a[1]))-((c[0]-a[0])*(b[1]-a[1])))*0.5;};Convex.prototype.updateArea=function(){this.updateTriangles();this.area=0;var triangles=this.triangles,verts=this.vertices;for(var i=0;i!==triangles.length;i++){var t=triangles[i],a=verts[t[0]],b=verts[t[1]],c=verts[t[2]];var m=Convex.triangleArea(a,b,c);this.area+=m;}};Convex.prototype.computeAABB=function(out,position,angle){out.setFromPoints(this.vertices,position,angle,0);};var intersectConvex_rayStart=vec2.create();var intersectConvex_rayEnd=vec2.create();var intersectConvex_normal=vec2.create();Convex.prototype.raycast=function(result,ray,position,angle){var rayStart=intersectConvex_rayStart;var rayEnd=intersectConvex_rayEnd;var normal=intersectConvex_normal;var vertices=this.vertices;vec2.toLocalFrame(rayStart,ray.from,position,angle);vec2.toLocalFrame(rayEnd,ray.to,position,angle);var n=vertices.length;for(var i=0;i<n&&!result.shouldStop(ray);i++){var q1=vertices[i];var q2=vertices[(i+1)%n];var delta=vec2.getLineSegmentsIntersectionFraction(rayStart,rayEnd,q1,q2);if(delta>=0){vec2.sub(normal,q2,q1);vec2.rotate(normal,normal,-Math.PI / 2+angle);vec2.normalize(normal,normal);ray.reportIntersection(result,delta,normal,i);}}};},{"../math/polyk":29,"../math/vec2":30,"./Shape":45,"poly-decomp":5}],41:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2'),Utils=_dereq_('../utils/Utils');module.exports=Heightfield;function Heightfield(options){if(Array.isArray(arguments[0])){options={heights:arguments[0]};if(typeof(arguments[1])==='object'){for(var key in arguments[1]){options[key]=arguments[1][key];}}
console.warn('The Heightfield constructor signature has changed. Please use the following format: new Heightfield({ heights: [...], ... })');}
options=options||{};this.heights=options.heights?options.heights.slice(0):[];this.maxValue=options.maxValue||null;this.minValue=options.minValue||null;this.elementWidth=options.elementWidth||0.1;if(options.maxValue===undefined||options.minValue===undefined){this.updateMaxMinValues();}
options.type=Shape.HEIGHTFIELD;Shape.call(this,options);}
Heightfield.prototype=new Shape();Heightfield.prototype.constructor=Heightfield;Heightfield.prototype.updateMaxMinValues=function(){var data=this.heights;var maxValue=data[0];var minValue=data[0];for(var i=0;i!==data.length;i++){var v=data[i];if(v>maxValue){maxValue=v;}
if(v<minValue){minValue=v;}}
this.maxValue=maxValue;this.minValue=minValue;};Heightfield.prototype.computeMomentOfInertia=function(mass){return Number.MAX_VALUE;};Heightfield.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE;};Heightfield.prototype.updateArea=function(){var data=this.heights,area=0;for(var i=0;i<data.length-1;i++){area+=(data[i]+data[i+1])/ 2*this.elementWidth;}
this.area=area;};var points=[vec2.create(),vec2.create(),vec2.create(),vec2.create()];Heightfield.prototype.computeAABB=function(out,position,angle){vec2.set(points[0],0,this.maxValue);vec2.set(points[1],this.elementWidth*this.heights.length,this.maxValue);vec2.set(points[2],this.elementWidth*this.heights.length,this.minValue);vec2.set(points[3],0,this.minValue);out.setFromPoints(points,position,angle);};Heightfield.prototype.getLineSegment=function(start,end,i){var data=this.heights;var width=this.elementWidth;vec2.set(start,i*width,data[i]);vec2.set(end,(i+1)*width,data[i+1]);};Heightfield.prototype.getSegmentIndex=function(position){return Math.floor(position[0]/ this.elementWidth);};Heightfield.prototype.getClampedSegmentIndex=function(position){var i=this.getSegmentIndex(position);i=Math.min(this.heights.length,Math.max(i,0));return i;};var intersectHeightfield_hitPointWorld=vec2.create();var intersectHeightfield_worldNormal=vec2.create();var intersectHeightfield_l0=vec2.create();var intersectHeightfield_l1=vec2.create();var intersectHeightfield_localFrom=vec2.create();var intersectHeightfield_localTo=vec2.create();var intersectHeightfield_unit_y=vec2.fromValues(0,1);function getLineSegmentsIntersection(out,p0,p1,p2,p3){var s1_x,s1_y,s2_x,s2_y;s1_x=p1[0]-p0[0];s1_y=p1[1]-p0[1];s2_x=p3[0]-p2[0];s2_y=p3[1]-p2[1];var s,t;s=(-s1_y*(p0[0]-p2[0])+s1_x*(p0[1]-p2[1]))/(-s2_x*s1_y+s1_x*s2_y);t=(s2_x*(p0[1]-p2[1])-s2_y*(p0[0]-p2[0]))/(-s2_x*s1_y+s1_x*s2_y);if(s>=0&&s<=1&&t>=0&&t<=1){var intX=p0[0]+(t*s1_x);var intY=p0[1]+(t*s1_y);out[0]=intX;out[1]=intY;return t;}
return-1;}
Heightfield.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var hitPointWorld=intersectHeightfield_hitPointWorld;var worldNormal=intersectHeightfield_worldNormal;var l0=intersectHeightfield_l0;var l1=intersectHeightfield_l1;var localFrom=intersectHeightfield_localFrom;var localTo=intersectHeightfield_localTo;vec2.toLocalFrame(localFrom,from,position,angle);vec2.toLocalFrame(localTo,to,position,angle);var i0=this.getClampedSegmentIndex(localFrom);var i1=this.getClampedSegmentIndex(localTo);if(i0>i1){var tmp=i0;i0=i1;i1=tmp;}
for(var i=0;i<this.heights.length-1;i++){this.getLineSegment(l0,l1,i);var t=vec2.getLineSegmentsIntersectionFraction(localFrom,localTo,l0,l1);if(t>=0){vec2.sub(worldNormal,l1,l0);vec2.rotate(worldNormal,worldNormal,angle+Math.PI / 2);vec2.normalize(worldNormal,worldNormal);ray.reportIntersection(result,t,worldNormal,-1);if(result.shouldStop(ray)){return;}}}};},{"../math/vec2":30,"../utils/Utils":57,"./Shape":45}],42:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2');module.exports=Line;function Line(options){if(typeof(arguments[0])==='number'){options={length:arguments[0]};console.warn('The Line constructor signature has changed. Please use the following format: new Line({ length: 1, ... })');}
options=options||{};this.length=options.length||1;options.type=Shape.LINE;Shape.call(this,options);}
Line.prototype=new Shape();Line.prototype.constructor=Line;Line.prototype.computeMomentOfInertia=function(mass){return mass*Math.pow(this.length,2)/ 12;};Line.prototype.updateBoundingRadius=function(){this.boundingRadius=this.length/2;};var points=[vec2.create(),vec2.create()];Line.prototype.computeAABB=function(out,position,angle){var l2=this.length / 2;vec2.set(points[0],-l2,0);vec2.set(points[1],l2,0);out.setFromPoints(points,position,angle,0);};var raycast_hitPoint=vec2.create();var raycast_normal=vec2.create();var raycast_l0=vec2.create();var raycast_l1=vec2.create();var raycast_unit_y=vec2.fromValues(0,1);Line.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var l0=raycast_l0;var l1=raycast_l1;var halfLen=this.length / 2;vec2.set(l0,-halfLen,0);vec2.set(l1,halfLen,0);vec2.toGlobalFrame(l0,l0,position,angle);vec2.toGlobalFrame(l1,l1,position,angle);var fraction=vec2.getLineSegmentsIntersectionFraction(l0,l1,from,to);if(fraction>=0){var normal=raycast_normal;vec2.rotate(normal,raycast_unit_y,angle);ray.reportIntersection(result,fraction,normal,-1);}};},{"../math/vec2":30,"./Shape":45}],43:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2');module.exports=Particle;function Particle(options){options=options||{};options.type=Shape.PARTICLE;Shape.call(this,options);}
Particle.prototype=new Shape();Particle.prototype.constructor=Particle;Particle.prototype.computeMomentOfInertia=function(mass){return 0;};Particle.prototype.updateBoundingRadius=function(){this.boundingRadius=0;};Particle.prototype.computeAABB=function(out,position,angle){vec2.copy(out.lowerBound,position);vec2.copy(out.upperBound,position);};},{"../math/vec2":30,"./Shape":45}],44:[function(_dereq_,module,exports){var Shape=_dereq_('./Shape'),vec2=_dereq_('../math/vec2'),Utils=_dereq_('../utils/Utils');module.exports=Plane;function Plane(options){options=options||{};options.type=Shape.PLANE;Shape.call(this,options);}
Plane.prototype=new Shape();Plane.prototype.constructor=Plane;Plane.prototype.computeMomentOfInertia=function(mass){return 0;};Plane.prototype.updateBoundingRadius=function(){this.boundingRadius=Number.MAX_VALUE;};Plane.prototype.computeAABB=function(out,position,angle){var a=angle%(2*Math.PI);var set=vec2.set;var max=Number.MAX_VALUE;var lowerBound=out.lowerBound;var upperBound=out.upperBound;if(a===0){set(lowerBound,-max,-max);set(upperBound,max,0);}else if(a===Math.PI / 2){set(lowerBound,0,-max);set(upperBound,max,max);}else if(a===Math.PI){set(lowerBound,-max,0);set(upperBound,max,max);}else if(a===3*Math.PI/2){set(lowerBound,-max,-max);set(upperBound,0,max);}else{set(lowerBound,-max,-max);set(upperBound,max,max);}
vec2.add(lowerBound,lowerBound,position);vec2.add(upperBound,upperBound,position);};Plane.prototype.updateArea=function(){this.area=Number.MAX_VALUE;};var intersectPlane_planePointToFrom=vec2.create();var intersectPlane_dir_scaled_with_t=vec2.create();var intersectPlane_hitPoint=vec2.create();var intersectPlane_normal=vec2.create();var intersectPlane_len=vec2.create();Plane.prototype.raycast=function(result,ray,position,angle){var from=ray.from;var to=ray.to;var direction=ray.direction;var planePointToFrom=intersectPlane_planePointToFrom;var dir_scaled_with_t=intersectPlane_dir_scaled_with_t;var hitPoint=intersectPlane_hitPoint;var normal=intersectPlane_normal;var len=intersectPlane_len;vec2.set(normal,0,1);vec2.rotate(normal,normal,angle);vec2.sub(len,from,position);var planeToFrom=vec2.dot(len,normal);vec2.sub(len,to,position);var planeToTo=vec2.dot(len,normal);if(planeToFrom*planeToTo>0){return;}
if(vec2.squaredDistance(from,to)<planeToFrom*planeToFrom){return;}
var n_dot_dir=vec2.dot(normal,direction);vec2.sub(planePointToFrom,from,position);var t=-vec2.dot(normal,planePointToFrom)/ n_dot_dir / ray.length;ray.reportIntersection(result,t,normal,-1);};},{"../math/vec2":30,"../utils/Utils":57,"./Shape":45}],45:[function(_dereq_,module,exports){module.exports=Shape;var vec2=_dereq_('../math/vec2');function Shape(options){options=options||{};this.body=null;this.position=vec2.fromValues(0,0);if(options.position){vec2.copy(this.position,options.position);}
this.angle=options.angle||0;this.type=options.type||0;this.id=Shape.idCounter++;this.boundingRadius=0;this.collisionGroup=options.collisionGroup!==undefined?options.collisionGroup:1;this.collisionResponse=options.collisionResponse!==undefined?options.collisionResponse:true;this.collisionMask=options.collisionMask!==undefined?options.collisionMask:1;this.material=options.material||null;this.area=0;this.sensor=options.sensor!==undefined?options.sensor:false;if(this.type){this.updateBoundingRadius();}
this.updateArea();}
Shape.idCounter=0;Shape.CIRCLE=1;Shape.PARTICLE=2;Shape.PLANE=4;Shape.CONVEX=8;Shape.LINE=16;Shape.BOX=32;Object.defineProperty(Shape,'RECTANGLE',{get:function(){console.warn('Shape.RECTANGLE is deprecated, use Shape.BOX instead.');return Shape.BOX;}});Shape.CAPSULE=64;Shape.HEIGHTFIELD=128;Shape.prototype.computeMomentOfInertia=function(mass){};Shape.prototype.updateBoundingRadius=function(){};Shape.prototype.updateArea=function(){};Shape.prototype.computeAABB=function(out,position,angle){};Shape.prototype.raycast=function(result,ray,position,angle){};},{"../math/vec2":30}],46:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),Solver=_dereq_('./Solver'),Utils=_dereq_('../utils/Utils'),FrictionEquation=_dereq_('../equations/FrictionEquation');module.exports=GSSolver;function GSSolver(options){Solver.call(this,options,Solver.GS);options=options||{};this.iterations=options.iterations||10;this.tolerance=options.tolerance||1e-7;this.arrayStep=30;this.lambda=new Utils.ARRAY_TYPE(this.arrayStep);this.Bs=new Utils.ARRAY_TYPE(this.arrayStep);this.invCs=new Utils.ARRAY_TYPE(this.arrayStep);this.useZeroRHS=false;this.frictionIterations=0;this.usedIterations=0;}
GSSolver.prototype=new Solver();GSSolver.prototype.constructor=GSSolver;function setArrayZero(array){var l=array.length;while(l--){array[l]=+0.0;}}
GSSolver.prototype.solve=function(h,world){this.sortEquations();var iter=0,maxIter=this.iterations,maxFrictionIter=this.frictionIterations,equations=this.equations,Neq=equations.length,tolSquared=Math.pow(this.tolerance*Neq,2),bodies=world.bodies,Nbodies=world.bodies.length,add=vec2.add,set=vec2.set,useZeroRHS=this.useZeroRHS,lambda=this.lambda;this.usedIterations=0;if(Neq){for(var i=0;i!==Nbodies;i++){var b=bodies[i];b.updateSolveMassProperties();}}
if(lambda.length<Neq){lambda=this.lambda=new Utils.ARRAY_TYPE(Neq+this.arrayStep);this.Bs=new Utils.ARRAY_TYPE(Neq+this.arrayStep);this.invCs=new Utils.ARRAY_TYPE(Neq+this.arrayStep);}
setArrayZero(lambda);var invCs=this.invCs,Bs=this.Bs,lambda=this.lambda;for(var i=0;i!==equations.length;i++){var c=equations[i];if(c.timeStep!==h||c.needsUpdate){c.timeStep=h;c.update();}
Bs[i]=c.computeB(c.a,c.b,h);invCs[i]=c.computeInvC(c.epsilon);}
var q,B,c,deltalambdaTot,i,j;if(Neq!==0){for(i=0;i!==Nbodies;i++){var b=bodies[i];b.resetConstraintVelocity();}
if(maxFrictionIter){for(iter=0;iter!==maxFrictionIter;iter++){deltalambdaTot=0.0;for(j=0;j!==Neq;j++){c=equations[j];var deltalambda=GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);deltalambdaTot+=Math.abs(deltalambda);}
this.usedIterations++;if(deltalambdaTot*deltalambdaTot<=tolSquared){break;}}
GSSolver.updateMultipliers(equations,lambda,1/h);for(j=0;j!==Neq;j++){var eq=equations[j];if(eq instanceof FrictionEquation){var f=0.0;for(var k=0;k!==eq.contactEquations.length;k++){f+=eq.contactEquations[k].multiplier;}
f*=eq.frictionCoefficient / eq.contactEquations.length;eq.maxForce=f;eq.minForce=-f;}}}
for(iter=0;iter!==maxIter;iter++){deltalambdaTot=0.0;for(j=0;j!==Neq;j++){c=equations[j];var deltalambda=GSSolver.iterateEquation(j,c,c.epsilon,Bs,invCs,lambda,useZeroRHS,h,iter);deltalambdaTot+=Math.abs(deltalambda);}
this.usedIterations++;if(deltalambdaTot*deltalambdaTot<=tolSquared){break;}}
for(i=0;i!==Nbodies;i++){bodies[i].addConstraintVelocity();}
GSSolver.updateMultipliers(equations,lambda,1/h);}};GSSolver.updateMultipliers=function(equations,lambda,invDt){var l=equations.length;while(l--){equations[l].multiplier=lambda[l]*invDt;}};GSSolver.iterateEquation=function(j,eq,eps,Bs,invCs,lambda,useZeroRHS,dt,iter){var B=Bs[j],invC=invCs[j],lambdaj=lambda[j],GWlambda=eq.computeGWlambda();var maxForce=eq.maxForce,minForce=eq.minForce;if(useZeroRHS){B=0;}
var deltalambda=invC*(B-GWlambda-eps*lambdaj);var lambdaj_plus_deltalambda=lambdaj+deltalambda;if(lambdaj_plus_deltalambda<minForce*dt){deltalambda=minForce*dt-lambdaj;}else if(lambdaj_plus_deltalambda>maxForce*dt){deltalambda=maxForce*dt-lambdaj;}
lambda[j]+=deltalambda;eq.addToWlambda(deltalambda);return deltalambda;};},{"../equations/FrictionEquation":23,"../math/vec2":30,"../utils/Utils":57,"./Solver":47}],47:[function(_dereq_,module,exports){var Utils=_dereq_('../utils/Utils'),EventEmitter=_dereq_('../events/EventEmitter');module.exports=Solver;function Solver(options,type){options=options||{};EventEmitter.call(this);this.type=type;this.equations=[];this.equationSortFunction=options.equationSortFunction||false;}
Solver.prototype=new EventEmitter();Solver.prototype.constructor=Solver;Solver.prototype.solve=function(dt,world){throw new Error("Solver.solve should be implemented by subclasses!");};var mockWorld={bodies:[]};Solver.prototype.solveIsland=function(dt,island){this.removeAllEquations();if(island.equations.length){this.addEquations(island.equations);mockWorld.bodies.length=0;island.getBodies(mockWorld.bodies);if(mockWorld.bodies.length){this.solve(dt,mockWorld);}}};Solver.prototype.sortEquations=function(){if(this.equationSortFunction){this.equations.sort(this.equationSortFunction);}};Solver.prototype.addEquation=function(eq){if(eq.enabled){this.equations.push(eq);}};Solver.prototype.addEquations=function(eqs){for(var i=0,N=eqs.length;i!==N;i++){var eq=eqs[i];if(eq.enabled){this.equations.push(eq);}}};Solver.prototype.removeEquation=function(eq){var i=this.equations.indexOf(eq);if(i!==-1){this.equations.splice(i,1);}};Solver.prototype.removeAllEquations=function(){this.equations.length=0;};Solver.GS=1;Solver.ISLAND=2;},{"../events/EventEmitter":26,"../utils/Utils":57}],48:[function(_dereq_,module,exports){var ContactEquation=_dereq_('../equations/ContactEquation');var Pool=_dereq_('./Pool');module.exports=ContactEquationPool;function ContactEquationPool(){Pool.apply(this,arguments);}
ContactEquationPool.prototype=new Pool();ContactEquationPool.prototype.constructor=ContactEquationPool;ContactEquationPool.prototype.create=function(){return new ContactEquation();};ContactEquationPool.prototype.destroy=function(equation){equation.bodyA=equation.bodyB=null;return this;};},{"../equations/ContactEquation":21,"./Pool":55}],49:[function(_dereq_,module,exports){var FrictionEquation=_dereq_('../equations/FrictionEquation');var Pool=_dereq_('./Pool');module.exports=FrictionEquationPool;function FrictionEquationPool(){Pool.apply(this,arguments);}
FrictionEquationPool.prototype=new Pool();FrictionEquationPool.prototype.constructor=FrictionEquationPool;FrictionEquationPool.prototype.create=function(){return new FrictionEquation();};FrictionEquationPool.prototype.destroy=function(equation){equation.bodyA=equation.bodyB=null;return this;};},{"../equations/FrictionEquation":23,"./Pool":55}],50:[function(_dereq_,module,exports){var IslandNode=_dereq_('../world/IslandNode');var Pool=_dereq_('./Pool');module.exports=IslandNodePool;function IslandNodePool(){Pool.apply(this,arguments);}
IslandNodePool.prototype=new Pool();IslandNodePool.prototype.constructor=IslandNodePool;IslandNodePool.prototype.create=function(){return new IslandNode();};IslandNodePool.prototype.destroy=function(node){node.reset();return this;};},{"../world/IslandNode":60,"./Pool":55}],51:[function(_dereq_,module,exports){var Island=_dereq_('../world/Island');var Pool=_dereq_('./Pool');module.exports=IslandPool;function IslandPool(){Pool.apply(this,arguments);}
IslandPool.prototype=new Pool();IslandPool.prototype.constructor=IslandPool;IslandPool.prototype.create=function(){return new Island();};IslandPool.prototype.destroy=function(island){island.reset();return this;};},{"../world/Island":58,"./Pool":55}],52:[function(_dereq_,module,exports){var TupleDictionary=_dereq_('./TupleDictionary');var OverlapKeeperRecord=_dereq_('./OverlapKeeperRecord');var OverlapKeeperRecordPool=_dereq_('./OverlapKeeperRecordPool');var Utils=_dereq_('./Utils');module.exports=OverlapKeeper;function OverlapKeeper(){this.overlappingShapesLastState=new TupleDictionary();this.overlappingShapesCurrentState=new TupleDictionary();this.recordPool=new OverlapKeeperRecordPool({size:16});this.tmpDict=new TupleDictionary();this.tmpArray1=[];}
OverlapKeeper.prototype.tick=function(){var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;var l=last.keys.length;while(l--){var key=last.keys[l];var lastObject=last.getByKey(key);var currentObject=current.getByKey(key);if(lastObject){this.recordPool.release(lastObject);}}
last.reset();last.copy(current);current.reset();};OverlapKeeper.prototype.setOverlapping=function(bodyA,shapeA,bodyB,shapeB){var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;if(!current.get(shapeA.id,shapeB.id)){var data=this.recordPool.get();data.set(bodyA,shapeA,bodyB,shapeB);current.set(shapeA.id,shapeB.id,data);}};OverlapKeeper.prototype.getNewOverlaps=function(result){return this.getDiff(this.overlappingShapesLastState,this.overlappingShapesCurrentState,result);};OverlapKeeper.prototype.getEndOverlaps=function(result){return this.getDiff(this.overlappingShapesCurrentState,this.overlappingShapesLastState,result);};OverlapKeeper.prototype.bodiesAreOverlapping=function(bodyA,bodyB){var current=this.overlappingShapesCurrentState;var l=current.keys.length;while(l--){var key=current.keys[l];var data=current.data[key];if((data.bodyA===bodyA&&data.bodyB===bodyB)||data.bodyA===bodyB&&data.bodyB===bodyA){return true;}}
return false;};OverlapKeeper.prototype.getDiff=function(dictA,dictB,result){var result=result||[];var last=dictA;var current=dictB;result.length=0;var l=current.keys.length;while(l--){var key=current.keys[l];var data=current.data[key];if(!data){throw new Error('Key '+key+' had no data!');}
var lastData=last.data[key];if(!lastData){result.push(data);}}
return result;};OverlapKeeper.prototype.isNewOverlap=function(shapeA,shapeB){var idA=shapeA.id|0,idB=shapeB.id|0;var last=this.overlappingShapesLastState;var current=this.overlappingShapesCurrentState;return!!!last.get(idA,idB)&&!!current.get(idA,idB);};OverlapKeeper.prototype.getNewBodyOverlaps=function(result){this.tmpArray1.length=0;var overlaps=this.getNewOverlaps(this.tmpArray1);return this.getBodyDiff(overlaps,result);};OverlapKeeper.prototype.getEndBodyOverlaps=function(result){this.tmpArray1.length=0;var overlaps=this.getEndOverlaps(this.tmpArray1);return this.getBodyDiff(overlaps,result);};OverlapKeeper.prototype.getBodyDiff=function(overlaps,result){result=result||[];var accumulator=this.tmpDict;var l=overlaps.length;while(l--){var data=overlaps[l];accumulator.set(data.bodyA.id|0,data.bodyB.id|0,data);}
l=accumulator.keys.length;while(l--){var data=accumulator.getByKey(accumulator.keys[l]);if(data){result.push(data.bodyA,data.bodyB);}}
accumulator.reset();return result;};},{"./OverlapKeeperRecord":53,"./OverlapKeeperRecordPool":54,"./TupleDictionary":56,"./Utils":57}],53:[function(_dereq_,module,exports){module.exports=OverlapKeeperRecord;function OverlapKeeperRecord(bodyA,shapeA,bodyB,shapeB){this.shapeA=shapeA;this.shapeB=shapeB;this.bodyA=bodyA;this.bodyB=bodyB;}
OverlapKeeperRecord.prototype.set=function(bodyA,shapeA,bodyB,shapeB){OverlapKeeperRecord.call(this,bodyA,shapeA,bodyB,shapeB);};},{}],54:[function(_dereq_,module,exports){var OverlapKeeperRecord=_dereq_('./OverlapKeeperRecord');var Pool=_dereq_('./Pool');module.exports=OverlapKeeperRecordPool;function OverlapKeeperRecordPool(){Pool.apply(this,arguments);}
OverlapKeeperRecordPool.prototype=new Pool();OverlapKeeperRecordPool.prototype.constructor=OverlapKeeperRecordPool;OverlapKeeperRecordPool.prototype.create=function(){return new OverlapKeeperRecord();};OverlapKeeperRecordPool.prototype.destroy=function(record){record.bodyA=record.bodyB=record.shapeA=record.shapeB=null;return this;};},{"./OverlapKeeperRecord":53,"./Pool":55}],55:[function(_dereq_,module,exports){module.exports=Pool;function Pool(options){options=options||{};this.objects=[];if(options.size!==undefined){this.resize(options.size);}}
Pool.prototype.resize=function(size){var objects=this.objects;while(objects.length>size){objects.pop();}
while(objects.length<size){objects.push(this.create());}
return this;};Pool.prototype.get=function(){var objects=this.objects;return objects.length?objects.pop():this.create();};Pool.prototype.release=function(object){this.destroy(object);this.objects.push(object);return this;};},{}],56:[function(_dereq_,module,exports){var Utils=_dereq_('./Utils');module.exports=TupleDictionary;function TupleDictionary(){this.data={};this.keys=[];}
TupleDictionary.prototype.getKey=function(id1,id2){id1=id1|0;id2=id2|0;if((id1|0)===(id2|0)){return-1;}
return((id1|0)>(id2|0)?(id1<<16)|(id2&0xFFFF):(id2<<16)|(id1&0xFFFF))|0;};TupleDictionary.prototype.getByKey=function(key){key=key|0;return this.data[key];};TupleDictionary.prototype.get=function(i,j){return this.data[this.getKey(i,j)];};TupleDictionary.prototype.set=function(i,j,value){if(!value){throw new Error("No data!");}
var key=this.getKey(i,j);if(!this.data[key]){this.keys.push(key);}
this.data[key]=value;return key;};TupleDictionary.prototype.reset=function(){var data=this.data,keys=this.keys;var l=keys.length;while(l--){delete data[keys[l]];}
keys.length=0;};TupleDictionary.prototype.copy=function(dict){this.reset();Utils.appendArray(this.keys,dict.keys);var l=dict.keys.length;while(l--){var key=dict.keys[l];this.data[key]=dict.data[key];}};},{"./Utils":57}],57:[function(_dereq_,module,exports){module.exports=Utils;function Utils(){}
Utils.appendArray=function(a,b){if(b.length<150000){a.push.apply(a,b);}else{for(var i=0,len=b.length;i!==len;++i){a.push(b[i]);}}};Utils.splice=function(array,index,howmany){howmany=howmany||1;for(var i=index,len=array.length-howmany;i<len;i++){array[i]=array[i+howmany];}
array.length=len;};if(typeof P2_ARRAY_TYPE!=='undefined'){Utils.ARRAY_TYPE=P2_ARRAY_TYPE;}else if(typeof Float32Array!=='undefined'){Utils.ARRAY_TYPE=Float32Array;}else{Utils.ARRAY_TYPE=Array;}
Utils.extend=function(a,b){for(var key in b){a[key]=b[key];}};Utils.defaults=function(options,defaults){options=options||{};for(var key in defaults){if(!(key in options)){options[key]=defaults[key];}}
return options;};},{}],58:[function(_dereq_,module,exports){var Body=_dereq_('../objects/Body');module.exports=Island;function Island(){this.equations=[];this.bodies=[];}
Island.prototype.reset=function(){this.equations.length=this.bodies.length=0;};var bodyIds=[];Island.prototype.getBodies=function(result){var bodies=result||[],eqs=this.equations;bodyIds.length=0;for(var i=0;i!==eqs.length;i++){var eq=eqs[i];if(bodyIds.indexOf(eq.bodyA.id)===-1){bodies.push(eq.bodyA);bodyIds.push(eq.bodyA.id);}
if(bodyIds.indexOf(eq.bodyB.id)===-1){bodies.push(eq.bodyB);bodyIds.push(eq.bodyB.id);}}
return bodies;};Island.prototype.wantsToSleep=function(){for(var i=0;i<this.bodies.length;i++){var b=this.bodies[i];if(b.type===Body.DYNAMIC&&!b.wantsToSleep){return false;}}
return true;};Island.prototype.sleep=function(){for(var i=0;i<this.bodies.length;i++){var b=this.bodies[i];b.sleep();}
return true;};},{"../objects/Body":31}],59:[function(_dereq_,module,exports){var vec2=_dereq_('../math/vec2'),Island=_dereq_('./Island'),IslandNode=_dereq_('./IslandNode'),IslandNodePool=_dereq_('./../utils/IslandNodePool'),IslandPool=_dereq_('./../utils/IslandPool'),Body=_dereq_('../objects/Body');module.exports=IslandManager;function IslandManager(options){this.nodePool=new IslandNodePool({size:16});this.islandPool=new IslandPool({size:8});this.equations=[];this.islands=[];this.nodes=[];this.queue=[];}
IslandManager.getUnvisitedNode=function(nodes){var Nnodes=nodes.length;for(var i=0;i!==Nnodes;i++){var node=nodes[i];if(!node.visited&&node.body.type===Body.DYNAMIC){return node;}}
return false;};IslandManager.prototype.visit=function(node,bds,eqs){bds.push(node.body);var Neqs=node.equations.length;for(var i=0;i!==Neqs;i++){var eq=node.equations[i];if(eqs.indexOf(eq)===-1){eqs.push(eq);}}};IslandManager.prototype.bfs=function(root,bds,eqs){var queue=this.queue;queue.length=0;queue.push(root);root.visited=true;this.visit(root,bds,eqs);while(queue.length){var node=queue.pop();var child;while((child=IslandManager.getUnvisitedNode(node.neighbors))){child.visited=true;this.visit(child,bds,eqs);if(child.body.type===Body.DYNAMIC){queue.push(child);}}}};IslandManager.prototype.split=function(world){var bodies=world.bodies,nodes=this.nodes,equations=this.equations;while(nodes.length){this.nodePool.release(nodes.pop());}
for(var i=0;i!==bodies.length;i++){var node=this.nodePool.get();node.body=bodies[i];nodes.push(node);}
for(var k=0;k!==equations.length;k++){var eq=equations[k],i=bodies.indexOf(eq.bodyA),j=bodies.indexOf(eq.bodyB),ni=nodes[i],nj=nodes[j];ni.neighbors.push(nj);nj.neighbors.push(ni);ni.equations.push(eq);nj.equations.push(eq);}
var islands=this.islands;for(var i=0;i<islands.length;i++){this.islandPool.release(islands[i]);}
islands.length=0;var child;while((child=IslandManager.getUnvisitedNode(nodes))){var island=this.islandPool.get();this.bfs(child,island.bodies,island.equations);islands.push(island);}
return islands;};},{"../math/vec2":30,"../objects/Body":31,"./../utils/IslandNodePool":50,"./../utils/IslandPool":51,"./Island":58,"./IslandNode":60}],60:[function(_dereq_,module,exports){module.exports=IslandNode;function IslandNode(body){this.body=body;this.neighbors=[];this.equations=[];this.visited=false;}
IslandNode.prototype.reset=function(){this.equations.length=0;this.neighbors.length=0;this.visited=false;this.body=null;};},{}],61:[function(_dereq_,module,exports){var GSSolver=_dereq_('../solver/GSSolver'),Solver=_dereq_('../solver/Solver'),Ray=_dereq_('../collision/Ray'),vec2=_dereq_('../math/vec2'),Circle=_dereq_('../shapes/Circle'),Convex=_dereq_('../shapes/Convex'),Line=_dereq_('../shapes/Line'),Plane=_dereq_('../shapes/Plane'),Capsule=_dereq_('../shapes/Capsule'),Particle=_dereq_('../shapes/Particle'),EventEmitter=_dereq_('../events/EventEmitter'),Body=_dereq_('../objects/Body'),Shape=_dereq_('../shapes/Shape'),LinearSpring=_dereq_('../objects/LinearSpring'),Material=_dereq_('../material/Material'),ContactMaterial=_dereq_('../material/ContactMaterial'),DistanceConstraint=_dereq_('../constraints/DistanceConstraint'),Constraint=_dereq_('../constraints/Constraint'),LockConstraint=_dereq_('../constraints/LockConstraint'),RevoluteConstraint=_dereq_('../constraints/RevoluteConstraint'),PrismaticConstraint=_dereq_('../constraints/PrismaticConstraint'),GearConstraint=_dereq_('../constraints/GearConstraint'),pkg=_dereq_('../../package.json'),Broadphase=_dereq_('../collision/Broadphase'),AABB=_dereq_('../collision/AABB'),SAPBroadphase=_dereq_('../collision/SAPBroadphase'),Narrowphase=_dereq_('../collision/Narrowphase'),Utils=_dereq_('../utils/Utils'),OverlapKeeper=_dereq_('../utils/OverlapKeeper'),IslandManager=_dereq_('./IslandManager'),RotationalSpring=_dereq_('../objects/RotationalSpring');module.exports=World;function World(options){EventEmitter.apply(this);options=options||{};this.springs=[];this.bodies=[];this.disabledBodyCollisionPairs=[];this.solver=options.solver||new GSSolver();this.narrowphase=new Narrowphase(this);this.islandManager=new IslandManager();this.gravity=vec2.fromValues(0,-9.78);if(options.gravity){vec2.copy(this.gravity,options.gravity);}
this.frictionGravity=vec2.length(this.gravity)||10;this.useWorldGravityAsFrictionGravity=true;this.useFrictionGravityOnZeroGravity=true;this.broadphase=options.broadphase||new SAPBroadphase();this.broadphase.setWorld(this);this.constraints=[];this.defaultMaterial=new Material();this.defaultContactMaterial=new ContactMaterial(this.defaultMaterial,this.defaultMaterial);this.lastTimeStep=1/60;this.applySpringForces=true;this.applyDamping=true;this.applyGravity=true;this.solveConstraints=true;this.contactMaterials=[];this.time=0.0;this.accumulator=0;this.stepping=false;this.bodiesToBeRemoved=[];this.islandSplit=typeof(options.islandSplit)!=="undefined"?!!options.islandSplit:true;this.emitImpactEvent=true;this._constraintIdCounter=0;this._bodyIdCounter=0;this.postStepEvent={type:"postStep"};this.addBodyEvent={type:"addBody",body:null};this.removeBodyEvent={type:"removeBody",body:null};this.addSpringEvent={type:"addSpring",spring:null};this.impactEvent={type:"impact",bodyA:null,bodyB:null,shapeA:null,shapeB:null,contactEquation:null};this.postBroadphaseEvent={type:"postBroadphase",pairs:null};this.sleepMode=World.NO_SLEEPING;this.beginContactEvent={type:"beginContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null,contactEquations:[]};this.endContactEvent={type:"endContact",shapeA:null,shapeB:null,bodyA:null,bodyB:null};this.preSolveEvent={type:"preSolve",contactEquations:null,frictionEquations:null};this.overlappingShapesLastState={keys:[]};this.overlappingShapesCurrentState={keys:[]};this.overlapKeeper=new OverlapKeeper();}
World.prototype=new Object(EventEmitter.prototype);World.prototype.constructor=World;World.NO_SLEEPING=1;World.BODY_SLEEPING=2;World.ISLAND_SLEEPING=4;World.prototype.addConstraint=function(constraint){this.constraints.push(constraint);};World.prototype.addContactMaterial=function(contactMaterial){this.contactMaterials.push(contactMaterial);};World.prototype.removeContactMaterial=function(cm){var idx=this.contactMaterials.indexOf(cm);if(idx!==-1){Utils.splice(this.contactMaterials,idx,1);}};World.prototype.getContactMaterial=function(materialA,materialB){var cmats=this.contactMaterials;for(var i=0,N=cmats.length;i!==N;i++){var cm=cmats[i];if((cm.materialA.id===materialA.id)&&(cm.materialB.id===materialB.id)||(cm.materialA.id===materialB.id)&&(cm.materialB.id===materialA.id)){return cm;}}
return false;};World.prototype.removeConstraint=function(constraint){var idx=this.constraints.indexOf(constraint);if(idx!==-1){Utils.splice(this.constraints,idx,1);}};var step_r=vec2.create(),step_runit=vec2.create(),step_u=vec2.create(),step_f=vec2.create(),step_fhMinv=vec2.create(),step_velodt=vec2.create(),step_mg=vec2.create(),xiw=vec2.fromValues(0,0),xjw=vec2.fromValues(0,0),zero=vec2.fromValues(0,0),interpvelo=vec2.fromValues(0,0);World.prototype.step=function(dt,timeSinceLastCalled,maxSubSteps){maxSubSteps=maxSubSteps||10;timeSinceLastCalled=timeSinceLastCalled||0;if(timeSinceLastCalled===0){this.internalStep(dt);this.time+=dt;}else{this.accumulator+=timeSinceLastCalled;var substeps=0;while(this.accumulator>=dt&&substeps<maxSubSteps){this.internalStep(dt);this.time+=dt;this.accumulator-=dt;substeps++;}
var t=(this.accumulator%dt)/ dt;for(var j=0;j!==this.bodies.length;j++){var b=this.bodies[j];vec2.lerp(b.interpolatedPosition,b.previousPosition,b.position,t);b.interpolatedAngle=b.previousAngle+t*(b.angle-b.previousAngle);}}};var endOverlaps=[];World.prototype.internalStep=function(dt){this.stepping=true;var that=this,Nsprings=this.springs.length,springs=this.springs,bodies=this.bodies,g=this.gravity,solver=this.solver,Nbodies=this.bodies.length,broadphase=this.broadphase,np=this.narrowphase,constraints=this.constraints,t0,t1,fhMinv=step_fhMinv,velodt=step_velodt,mg=step_mg,scale=vec2.scale,add=vec2.add,rotate=vec2.rotate,islandManager=this.islandManager;this.overlapKeeper.tick();this.lastTimeStep=dt;if(this.useWorldGravityAsFrictionGravity){var gravityLen=vec2.length(this.gravity);if(!(gravityLen===0&&this.useFrictionGravityOnZeroGravity)){this.frictionGravity=gravityLen;}}
if(this.applyGravity){for(var i=0;i!==Nbodies;i++){var b=bodies[i],fi=b.force;if(b.type!==Body.DYNAMIC||b.sleepState===Body.SLEEPING){continue;}
vec2.scale(mg,g,b.mass*b.gravityScale);add(fi,fi,mg);}}
if(this.applySpringForces){for(var i=0;i!==Nsprings;i++){var s=springs[i];s.applyForce();}}
if(this.applyDamping){for(var i=0;i!==Nbodies;i++){var b=bodies[i];if(b.type===Body.DYNAMIC){b.applyDamping(dt);}}}
var result=broadphase.getCollisionPairs(this);var ignoredPairs=this.disabledBodyCollisionPairs;for(var i=ignoredPairs.length-2;i>=0;i-=2){for(var j=result.length-2;j>=0;j-=2){if((ignoredPairs[i]===result[j]&&ignoredPairs[i+1]===result[j+1])||(ignoredPairs[i+1]===result[j]&&ignoredPairs[i]===result[j+1])){result.splice(j,2);}}}
var Nconstraints=constraints.length;for(i=0;i!==Nconstraints;i++){var c=constraints[i];if(!c.collideConnected){for(var j=result.length-2;j>=0;j-=2){if((c.bodyA===result[j]&&c.bodyB===result[j+1])||(c.bodyB===result[j]&&c.bodyA===result[j+1])){result.splice(j,2);}}}}
this.postBroadphaseEvent.pairs=result;this.emit(this.postBroadphaseEvent);this.postBroadphaseEvent.pairs=null;np.reset(this);for(var i=0,Nresults=result.length;i!==Nresults;i+=2){var bi=result[i],bj=result[i+1];for(var k=0,Nshapesi=bi.shapes.length;k!==Nshapesi;k++){var si=bi.shapes[k],xi=si.position,ai=si.angle;for(var l=0,Nshapesj=bj.shapes.length;l!==Nshapesj;l++){var sj=bj.shapes[l],xj=sj.position,aj=sj.angle;var cm=this.defaultContactMaterial;if(si.material&&sj.material){var tmp=this.getContactMaterial(si.material,sj.material);if(tmp){cm=tmp;}}
this.runNarrowphase(np,bi,si,xi,ai,bj,sj,xj,aj,cm,this.frictionGravity);}}}
for(var i=0;i!==Nbodies;i++){var body=bodies[i];if(body._wakeUpAfterNarrowphase){body.wakeUp();body._wakeUpAfterNarrowphase=false;}}
if(this.has('endContact')){this.overlapKeeper.getEndOverlaps(endOverlaps);var e=this.endContactEvent;var l=endOverlaps.length;while(l--){var data=endOverlaps[l];e.shapeA=data.shapeA;e.shapeB=data.shapeB;e.bodyA=data.bodyA;e.bodyB=data.bodyB;this.emit(e);}
endOverlaps.length=0;}
var preSolveEvent=this.preSolveEvent;preSolveEvent.contactEquations=np.contactEquations;preSolveEvent.frictionEquations=np.frictionEquations;this.emit(preSolveEvent);preSolveEvent.contactEquations=preSolveEvent.frictionEquations=null;var Nconstraints=constraints.length;for(i=0;i!==Nconstraints;i++){constraints[i].update();}
if(np.contactEquations.length||np.frictionEquations.length||Nconstraints){if(this.islandSplit){islandManager.equations.length=0;Utils.appendArray(islandManager.equations,np.contactEquations);Utils.appendArray(islandManager.equations,np.frictionEquations);for(i=0;i!==Nconstraints;i++){Utils.appendArray(islandManager.equations,constraints[i].equations);}
islandManager.split(this);for(var i=0;i!==islandManager.islands.length;i++){var island=islandManager.islands[i];if(island.equations.length){solver.solveIsland(dt,island);}}}else{solver.addEquations(np.contactEquations);solver.addEquations(np.frictionEquations);for(i=0;i!==Nconstraints;i++){solver.addEquations(constraints[i].equations);}
if(this.solveConstraints){solver.solve(dt,this);}
solver.removeAllEquations();}}
for(var i=0;i!==Nbodies;i++){var body=bodies[i];body.integrate(dt);}
for(var i=0;i!==Nbodies;i++){bodies[i].setZeroForce();}
if(this.emitImpactEvent&&this.has('impact')){var ev=this.impactEvent;for(var i=0;i!==np.contactEquations.length;i++){var eq=np.contactEquations[i];if(eq.firstImpact){ev.bodyA=eq.bodyA;ev.bodyB=eq.bodyB;ev.shapeA=eq.shapeA;ev.shapeB=eq.shapeB;ev.contactEquation=eq;this.emit(ev);}}}
if(this.sleepMode===World.BODY_SLEEPING){for(i=0;i!==Nbodies;i++){bodies[i].sleepTick(this.time,false,dt);}}else if(this.sleepMode===World.ISLAND_SLEEPING&&this.islandSplit){for(i=0;i!==Nbodies;i++){bodies[i].sleepTick(this.time,true,dt);}
for(var i=0;i<this.islandManager.islands.length;i++){var island=this.islandManager.islands[i];if(island.wantsToSleep()){island.sleep();}}}
this.stepping=false;var bodiesToBeRemoved=this.bodiesToBeRemoved;for(var i=0;i!==bodiesToBeRemoved.length;i++){this.removeBody(bodiesToBeRemoved[i]);}
bodiesToBeRemoved.length=0;this.emit(this.postStepEvent);};World.prototype.runNarrowphase=function(np,bi,si,xi,ai,bj,sj,xj,aj,cm,glen){if(!((si.collisionGroup&sj.collisionMask)!==0&&(sj.collisionGroup&si.collisionMask)!==0)){return;}
vec2.rotate(xiw,xi,bi.angle);vec2.rotate(xjw,xj,bj.angle);vec2.add(xiw,xiw,bi.position);vec2.add(xjw,xjw,bj.position);var aiw=ai+bi.angle;var ajw=aj+bj.angle;np.enableFriction=cm.friction>0;np.frictionCoefficient=cm.friction;var reducedMass;if(bi.type===Body.STATIC||bi.type===Body.KINEMATIC){reducedMass=bj.mass;}else if(bj.type===Body.STATIC||bj.type===Body.KINEMATIC){reducedMass=bi.mass;}else{reducedMass=(bi.mass*bj.mass)/(bi.mass+bj.mass);}
np.slipForce=cm.friction*glen*reducedMass;np.restitution=cm.restitution;np.surfaceVelocity=cm.surfaceVelocity;np.frictionStiffness=cm.frictionStiffness;np.frictionRelaxation=cm.frictionRelaxation;np.stiffness=cm.stiffness;np.relaxation=cm.relaxation;np.contactSkinSize=cm.contactSkinSize;np.enabledEquations=bi.collisionResponse&&bj.collisionResponse&&si.collisionResponse&&sj.collisionResponse;var resolver=np[si.type|sj.type],numContacts=0;if(resolver){var sensor=si.sensor||sj.sensor;var numFrictionBefore=np.frictionEquations.length;if(si.type<sj.type){numContacts=resolver.call(np,bi,si,xiw,aiw,bj,sj,xjw,ajw,sensor);}else{numContacts=resolver.call(np,bj,sj,xjw,ajw,bi,si,xiw,aiw,sensor);}
var numFrictionEquations=np.frictionEquations.length-numFrictionBefore;if(numContacts){if(bi.allowSleep&&bi.type===Body.DYNAMIC&&bi.sleepState===Body.SLEEPING&&bj.sleepState===Body.AWAKE&&bj.type!==Body.STATIC){var speedSquaredB=vec2.squaredLength(bj.velocity)+Math.pow(bj.angularVelocity,2);var speedLimitSquaredB=Math.pow(bj.sleepSpeedLimit,2);if(speedSquaredB>=speedLimitSquaredB*2){bi._wakeUpAfterNarrowphase=true;}}
if(bj.allowSleep&&bj.type===Body.DYNAMIC&&bj.sleepState===Body.SLEEPING&&bi.sleepState===Body.AWAKE&&bi.type!==Body.STATIC){var speedSquaredA=vec2.squaredLength(bi.velocity)+Math.pow(bi.angularVelocity,2);var speedLimitSquaredA=Math.pow(bi.sleepSpeedLimit,2);if(speedSquaredA>=speedLimitSquaredA*2){bj._wakeUpAfterNarrowphase=true;}}
this.overlapKeeper.setOverlapping(bi,si,bj,sj);if(this.has('beginContact')&&this.overlapKeeper.isNewOverlap(si,sj)){var e=this.beginContactEvent;e.shapeA=si;e.shapeB=sj;e.bodyA=bi;e.bodyB=bj;e.contactEquations.length=0;if(typeof(numContacts)==="number"){for(var i=np.contactEquations.length-numContacts;i<np.contactEquations.length;i++){e.contactEquations.push(np.contactEquations[i]);}}
this.emit(e);}
if(typeof(numContacts)==="number"&&numFrictionEquations>1){for(var i=np.frictionEquations.length-numFrictionEquations;i<np.frictionEquations.length;i++){var f=np.frictionEquations[i];f.setSlipForce(f.getSlipForce()/ numFrictionEquations);}}}}};World.prototype.addSpring=function(spring){this.springs.push(spring);var evt=this.addSpringEvent;evt.spring=spring;this.emit(evt);evt.spring=null;};World.prototype.removeSpring=function(spring){var idx=this.springs.indexOf(spring);if(idx!==-1){Utils.splice(this.springs,idx,1);}};World.prototype.addBody=function(body){if(this.bodies.indexOf(body)===-1){this.bodies.push(body);body.world=this;var evt=this.addBodyEvent;evt.body=body;this.emit(evt);evt.body=null;}};World.prototype.removeBody=function(body){if(this.stepping){this.bodiesToBeRemoved.push(body);}else{body.world=null;var idx=this.bodies.indexOf(body);if(idx!==-1){Utils.splice(this.bodies,idx,1);this.removeBodyEvent.body=body;body.resetConstraintVelocity();this.emit(this.removeBodyEvent);this.removeBodyEvent.body=null;}}};World.prototype.getBodyById=function(id){var bodies=this.bodies;for(var i=0;i<bodies.length;i++){var b=bodies[i];if(b.id===id){return b;}}
return false;};World.prototype.disableBodyCollision=function(bodyA,bodyB){this.disabledBodyCollisionPairs.push(bodyA,bodyB);};World.prototype.enableBodyCollision=function(bodyA,bodyB){var pairs=this.disabledBodyCollisionPairs;for(var i=0;i<pairs.length;i+=2){if((pairs[i]===bodyA&&pairs[i+1]===bodyB)||(pairs[i+1]===bodyA&&pairs[i]===bodyB)){pairs.splice(i,2);return;}}};World.prototype.clear=function(){this.time=0;if(this.solver&&this.solver.equations.length){this.solver.removeAllEquations();}
var cs=this.constraints;for(var i=cs.length-1;i>=0;i--){this.removeConstraint(cs[i]);}
var bodies=this.bodies;for(var i=bodies.length-1;i>=0;i--){this.removeBody(bodies[i]);}
var springs=this.springs;for(var i=springs.length-1;i>=0;i--){this.removeSpring(springs[i]);}
var cms=this.contactMaterials;for(var i=cms.length-1;i>=0;i--){this.removeContactMaterial(cms[i]);}
World.apply(this);};var hitTest_tmp1=vec2.create(),hitTest_zero=vec2.fromValues(0,0),hitTest_tmp2=vec2.fromValues(0,0);World.prototype.hitTest=function(worldPoint,bodies,precision){precision=precision||0;var pb=new Body({position:worldPoint}),ps=new Particle(),px=worldPoint,pa=0,x=hitTest_tmp1,zero=hitTest_zero,tmp=hitTest_tmp2;pb.addShape(ps);var n=this.narrowphase,result=[];for(var i=0,N=bodies.length;i!==N;i++){var b=bodies[i];for(var j=0,NS=b.shapes.length;j!==NS;j++){var s=b.shapes[j];vec2.rotate(x,s.position,b.angle);vec2.add(x,x,b.position);var a=s.angle+b.angle;if((s instanceof Circle&&n.circleParticle(b,s,x,a,pb,ps,px,pa,true))||(s instanceof Convex&&n.particleConvex(pb,ps,px,pa,b,s,x,a,true))||(s instanceof Plane&&n.particlePlane(pb,ps,px,pa,b,s,x,a,true))||(s instanceof Capsule&&n.particleCapsule(pb,ps,px,pa,b,s,x,a,true))||(s instanceof Particle&&vec2.squaredLength(vec2.sub(tmp,x,worldPoint))<precision*precision)){result.push(b);}}}
return result;};World.prototype.setGlobalStiffness=function(stiffness){var constraints=this.constraints;for(var i=0;i!==constraints.length;i++){var c=constraints[i];for(var j=0;j!==c.equations.length;j++){var eq=c.equations[j];eq.stiffness=stiffness;eq.needsUpdate=true;}}
var contactMaterials=this.contactMaterials;for(var i=0;i!==contactMaterials.length;i++){var c=contactMaterials[i];c.stiffness=c.frictionStiffness=stiffness;}
var c=this.defaultContactMaterial;c.stiffness=c.frictionStiffness=stiffness;};World.prototype.setGlobalRelaxation=function(relaxation){for(var i=0;i!==this.constraints.length;i++){var c=this.constraints[i];for(var j=0;j!==c.equations.length;j++){var eq=c.equations[j];eq.relaxation=relaxation;eq.needsUpdate=true;}}
for(var i=0;i!==this.contactMaterials.length;i++){var c=this.contactMaterials[i];c.relaxation=c.frictionRelaxation=relaxation;}
var c=this.defaultContactMaterial;c.relaxation=c.frictionRelaxation=relaxation;};var tmpAABB=new AABB();var tmpArray=[];World.prototype.raycast=function(result,ray){ray.getAABB(tmpAABB);this.broadphase.aabbQuery(this,tmpAABB,tmpArray);ray.intersectBodies(result,tmpArray);tmpArray.length=0;return result.hasHit();};},{"../../package.json":6,"../collision/AABB":7,"../collision/Broadphase":8,"../collision/Narrowphase":10,"../collision/Ray":11,"../collision/SAPBroadphase":13,"../constraints/Constraint":14,"../constraints/DistanceConstraint":15,"../constraints/GearConstraint":16,"../constraints/LockConstraint":17,"../constraints/PrismaticConstraint":18,"../constraints/RevoluteConstraint":19,"../events/EventEmitter":26,"../material/ContactMaterial":27,"../material/Material":28,"../math/vec2":30,"../objects/Body":31,"../objects/LinearSpring":32,"../objects/RotationalSpring":33,"../shapes/Capsule":38,"../shapes/Circle":39,"../shapes/Convex":40,"../shapes/Line":42,"../shapes/Particle":43,"../shapes/Plane":44,"../shapes/Shape":45,"../solver/GSSolver":46,"../solver/Solver":47,"../utils/OverlapKeeper":52,"../utils/Utils":57,"./IslandManager":59}]},{},[36])
(36)});(function(){var root=this;var PIXI=PIXI||{};PIXI.game=null;PIXI.WEBGL_RENDERER=0;PIXI.CANVAS_RENDERER=1;PIXI.VERSION="v2.2.9";PIXI._UID=0;if(typeof(Float32Array)!='undefined')
{PIXI.Float32Array=Float32Array;PIXI.Uint16Array=Uint16Array;PIXI.Uint32Array=Uint32Array;PIXI.ArrayBuffer=ArrayBuffer;}
else
{PIXI.Float32Array=Array;PIXI.Uint16Array=Array;}
PIXI.PI_2=Math.PI*2;PIXI.RAD_TO_DEG=180 / Math.PI;PIXI.DEG_TO_RAD=Math.PI / 180;PIXI.RETINA_PREFIX="@2x";PIXI.DisplayObject=function()
{this.position=new PIXI.Point(0,0);this.scale=new PIXI.Point(1,1);this.pivot=new PIXI.Point(0,0);this.rotation=0;this.alpha=1;this.visible=true;this.hitArea=null;this.renderable=false;this.parent=null;this.stage=null;this.worldAlpha=1;this.worldTransform=new PIXI.Matrix();this.worldPosition=new PIXI.Point(0,0);this.worldScale=new PIXI.Point(1,1);this.worldRotation=0;this._sr=0;this._cr=1;this.filterArea=null;this._bounds=new PIXI.Rectangle(0,0,1,1);this._currentBounds=null;this._mask=null;this._cacheAsBitmap=false;this._cacheIsDirty=false;};PIXI.DisplayObject.prototype.constructor=PIXI.DisplayObject;PIXI.DisplayObject.prototype.destroy=function()
{if(this.children)
{var i=this.children.length;while(i--)
{this.children[i].destroy();}
this.children=[];}
this.hitArea=null;this.parent=null;this.stage=null;this.worldTransform=null;this.filterArea=null;this._bounds=null;this._currentBounds=null;this._mask=null;this.renderable=false;this._destroyCachedSprite();};Object.defineProperty(PIXI.DisplayObject.prototype,'worldVisible',{get:function(){var item=this;do
{if(!item.visible)return false;item=item.parent;}
while(item);return true;}});Object.defineProperty(PIXI.DisplayObject.prototype,'mask',{get:function(){return this._mask;},set:function(value){if(this._mask)this._mask.isMask=false;this._mask=value;if(this._mask)this._mask.isMask=true;}});Object.defineProperty(PIXI.DisplayObject.prototype,'filters',{get:function(){return this._filters;},set:function(value){if(value)
{var passes=[];for(var i=0;i<value.length;i++)
{var filterPasses=value[i].passes;for(var j=0;j<filterPasses.length;j++)
{passes.push(filterPasses[j]);}}
this._filterBlock={target:this,filterPasses:passes};}
this._filters=value;if(this.blendMode&&this.blendMode===PIXI.blendModes.MULTIPLY)
{this.blendMode=PIXI.blendModes.NORMAL;}}});Object.defineProperty(PIXI.DisplayObject.prototype,'cacheAsBitmap',{get:function(){return this._cacheAsBitmap;},set:function(value){if(this._cacheAsBitmap===value)
{return;}
if(value)
{this._generateCachedSprite();}
else
{this._destroyCachedSprite();}
this._cacheAsBitmap=value;}});PIXI.DisplayObject.prototype.updateTransform=function(parent)
{if(!parent&&!this.parent&&!this.game)
{return;}
var p=this.parent;if(parent)
{p=parent;}
else if(!this.parent)
{p=this.game.world;}
var pt=p.worldTransform;var wt=this.worldTransform;var a,b,c,d,tx,ty;if(this.rotation%PIXI.PI_2)
{if(this.rotation!==this.rotationCache)
{this.rotationCache=this.rotation;this._sr=Math.sin(this.rotation);this._cr=Math.cos(this.rotation);}
a=this._cr*this.scale.x;b=this._sr*this.scale.x;c=-this._sr*this.scale.y;d=this._cr*this.scale.y;tx=this.position.x;ty=this.position.y;if(this.pivot.x||this.pivot.y)
{tx-=this.pivot.x*a+this.pivot.y*c;ty-=this.pivot.x*b+this.pivot.y*d;}
wt.a=a*pt.a+b*pt.c;wt.b=a*pt.b+b*pt.d;wt.c=c*pt.a+d*pt.c;wt.d=c*pt.b+d*pt.d;wt.tx=tx*pt.a+ty*pt.c+pt.tx;wt.ty=tx*pt.b+ty*pt.d+pt.ty;}
else
{a=this.scale.x;d=this.scale.y;tx=this.position.x-this.pivot.x*a;ty=this.position.y-this.pivot.y*d;wt.a=a*pt.a;wt.b=a*pt.b;wt.c=d*pt.c;wt.d=d*pt.d;wt.tx=tx*pt.a+ty*pt.c+pt.tx;wt.ty=tx*pt.b+ty*pt.d+pt.ty;}
this.worldAlpha=this.alpha*p.worldAlpha;this.worldPosition.set(wt.tx,wt.ty);this.worldScale.set(Math.sqrt(wt.a*wt.a+wt.b*wt.b),Math.sqrt(wt.c*wt.c+wt.d*wt.d));this.worldRotation=Math.atan2(-wt.c,wt.d);this._currentBounds=null;if(this.transformCallback)
{this.transformCallback.call(this.transformCallbackContext,wt,pt);}};PIXI.DisplayObject.prototype.displayObjectUpdateTransform=PIXI.DisplayObject.prototype.updateTransform;PIXI.DisplayObject.prototype.getBounds=function(matrix)
{matrix=matrix;return PIXI.EmptyRectangle;};PIXI.DisplayObject.prototype.getLocalBounds=function()
{return this.getBounds(PIXI.identityMatrix);};PIXI.DisplayObject.prototype.setStageReference=function(stage)
{this.stage=stage;};PIXI.DisplayObject.prototype.preUpdate=function()
{};PIXI.DisplayObject.prototype.generateTexture=function(resolution,scaleMode,renderer)
{var bounds=this.getLocalBounds();var renderTexture=new PIXI.RenderTexture(bounds.width|0,bounds.height|0,renderer,scaleMode,resolution);PIXI.DisplayObject._tempMatrix.tx=-bounds.x;PIXI.DisplayObject._tempMatrix.ty=-bounds.y;renderTexture.render(this,PIXI.DisplayObject._tempMatrix);return renderTexture;};PIXI.DisplayObject.prototype.updateCache=function()
{this._generateCachedSprite();};PIXI.DisplayObject.prototype.toGlobal=function(position)
{this.displayObjectUpdateTransform();return this.worldTransform.apply(position);};PIXI.DisplayObject.prototype.toLocal=function(position,from)
{if(from)
{position=from.toGlobal(position);}
this.displayObjectUpdateTransform();return this.worldTransform.applyInverse(position);};PIXI.DisplayObject.prototype._renderCachedSprite=function(renderSession)
{this._cachedSprite.worldAlpha=this.worldAlpha;if(renderSession.gl)
{PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite,renderSession);}
else
{PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite,renderSession);}};PIXI.DisplayObject.prototype._generateCachedSprite=function()
{this._cacheAsBitmap=false;var bounds=this.getLocalBounds();this.updateTransform();if(!this._cachedSprite)
{var renderTexture=new PIXI.RenderTexture(bounds.width|1,bounds.height|1);this._cachedSprite=new PIXI.Sprite(renderTexture);this._cachedSprite.worldTransform=this.worldTransform;}
else
{this._cachedSprite.texture.resize(bounds.width|1,bounds.height|1);}
var tempFilters=this._filters;this._filters=null;this._cachedSprite.filters=tempFilters;PIXI.DisplayObject._tempMatrix.tx=-bounds.x;PIXI.DisplayObject._tempMatrix.ty=-bounds.y;this._cachedSprite.texture.render(this,PIXI.DisplayObject._tempMatrix,true);this._cachedSprite.anchor.x=-(bounds.x / bounds.width);this._cachedSprite.anchor.y=-(bounds.y / bounds.height);this._filters=tempFilters;this._cacheAsBitmap=true;};PIXI.DisplayObject.prototype._destroyCachedSprite=function()
{if(!this._cachedSprite)return;this._cachedSprite.texture.destroy(true);this._cachedSprite=null;};PIXI.DisplayObject.prototype._renderWebGL=function(renderSession)
{renderSession=renderSession;};PIXI.DisplayObject.prototype._renderCanvas=function(renderSession)
{renderSession=renderSession;};Object.defineProperty(PIXI.DisplayObject.prototype,'x',{get:function(){return this.position.x;},set:function(value){this.position.x=value;}});Object.defineProperty(PIXI.DisplayObject.prototype,'y',{get:function(){return this.position.y;},set:function(value){this.position.y=value;}});PIXI.DisplayObjectContainer=function()
{PIXI.DisplayObject.call(this);this.children=[];};PIXI.DisplayObjectContainer.prototype=Object.create(PIXI.DisplayObject.prototype);PIXI.DisplayObjectContainer.prototype.constructor=PIXI.DisplayObjectContainer;Object.defineProperty(PIXI.DisplayObjectContainer.prototype,'width',{get:function(){return this.scale.x*this.getLocalBounds().width;},set:function(value){var width=this.getLocalBounds().width;if(width!==0)
{this.scale.x=value / width;}
else
{this.scale.x=1;}
this._width=value;}});Object.defineProperty(PIXI.DisplayObjectContainer.prototype,'height',{get:function(){return this.scale.y*this.getLocalBounds().height;},set:function(value){var height=this.getLocalBounds().height;if(height!==0)
{this.scale.y=value / height;}
else
{this.scale.y=1;}
this._height=value;}});PIXI.DisplayObjectContainer.prototype.addChild=function(child)
{return this.addChildAt(child,this.children.length);};PIXI.DisplayObjectContainer.prototype.addChildAt=function(child,index)
{if(index>=0&&index<=this.children.length)
{if(child.parent)
{child.parent.removeChild(child);}
child.parent=this;this.children.splice(index,0,child);if(this.stage)child.setStageReference(this.stage);return child;}
else
{throw new Error(child+'addChildAt: The index '+index+' supplied is out of bounds '+this.children.length);}};PIXI.DisplayObjectContainer.prototype.swapChildren=function(child,child2)
{if(child===child2){return;}
var index1=this.getChildIndex(child);var index2=this.getChildIndex(child2);if(index1<0||index2<0){throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');}
this.children[index1]=child2;this.children[index2]=child;};PIXI.DisplayObjectContainer.prototype.getChildIndex=function(child)
{var index=this.children.indexOf(child);if(index===-1)
{throw new Error('The supplied DisplayObject must be a child of the caller');}
return index;};PIXI.DisplayObjectContainer.prototype.setChildIndex=function(child,index)
{if(index<0||index>=this.children.length)
{throw new Error('The supplied index is out of bounds');}
var currentIndex=this.getChildIndex(child);this.children.splice(currentIndex,1);this.children.splice(index,0,child);};PIXI.DisplayObjectContainer.prototype.getChildAt=function(index)
{if(index<0||index>=this.children.length)
{throw new Error('getChildAt: Supplied index '+index+' does not exist in the child list, or the supplied DisplayObject must be a child of the caller');}
return this.children[index];};PIXI.DisplayObjectContainer.prototype.removeChild=function(child)
{var index=this.children.indexOf(child);if(index===-1)return;return this.removeChildAt(index);};PIXI.DisplayObjectContainer.prototype.removeChildAt=function(index)
{var child=this.getChildAt(index);if(this.stage)
child.removeStageReference();child.parent=undefined;this.children.splice(index,1);return child;};PIXI.DisplayObjectContainer.prototype.removeChildren=function(beginIndex,endIndex)
{var begin=beginIndex||0;var end=typeof endIndex==='number'?endIndex:this.children.length;var range=end-begin;if(range>0&&range<=end)
{var removed=this.children.splice(begin,range);for(var i=0;i<removed.length;i++){var child=removed[i];if(this.stage)
child.removeStageReference();child.parent=undefined;}
return removed;}
else if(range===0&&this.children.length===0)
{return[];}
else
{throw new Error('removeChildren: Range Error, numeric values are outside the acceptable range');}};PIXI.DisplayObjectContainer.prototype.updateTransform=function()
{if(!this.visible)
{return;}
this.displayObjectUpdateTransform();if(this._cacheAsBitmap)
{return;}
for(var i=0;i<this.children.length;i++)
{this.children[i].updateTransform();}};PIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform=PIXI.DisplayObjectContainer.prototype.updateTransform;PIXI.DisplayObjectContainer.prototype.getBounds=function()
{if(this.children.length===0)return PIXI.EmptyRectangle;var minX=Infinity;var minY=Infinity;var maxX=-Infinity;var maxY=-Infinity;var childBounds;var childMaxX;var childMaxY;var childVisible=false;for(var i=0,j=this.children.length;i<j;i++)
{var child=this.children[i];if(!child.visible)continue;childVisible=true;childBounds=this.children[i].getBounds();minX=minX<childBounds.x?minX:childBounds.x;minY=minY<childBounds.y?minY:childBounds.y;childMaxX=childBounds.width+childBounds.x;childMaxY=childBounds.height+childBounds.y;maxX=maxX>childMaxX?maxX:childMaxX;maxY=maxY>childMaxY?maxY:childMaxY;}
if(!childVisible)
return PIXI.EmptyRectangle;var bounds=this._bounds;bounds.x=minX;bounds.y=minY;bounds.width=maxX-minX;bounds.height=maxY-minY;return bounds;};PIXI.DisplayObjectContainer.prototype.getLocalBounds=function()
{var matrixCache=this.worldTransform;this.worldTransform=PIXI.identityMatrix;for(var i=0,j=this.children.length;i<j;i++)
{this.children[i].updateTransform();}
var bounds=this.getBounds();this.worldTransform=matrixCache;return bounds;};PIXI.DisplayObjectContainer.prototype.setStageReference=function(stage)
{this.stage=stage;for(var i=0;i<this.children.length;i++)
{this.children[i].setStageReference(stage)}};PIXI.DisplayObjectContainer.prototype.removeStageReference=function()
{for(var i=0;i<this.children.length;i++)
{this.children[i].removeStageReference();}
this.stage=null;};PIXI.DisplayObjectContainer.prototype._renderWebGL=function(renderSession)
{if(!this.visible||this.alpha<=0)return;if(this._cacheAsBitmap)
{this._renderCachedSprite(renderSession);return;}
var i;if(this._mask||this._filters)
{if(this._filters)
{renderSession.spriteBatch.flush();renderSession.filterManager.pushFilter(this._filterBlock);}
if(this._mask)
{renderSession.spriteBatch.stop();renderSession.maskManager.pushMask(this.mask,renderSession);renderSession.spriteBatch.start();}
for(i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession);}
renderSession.spriteBatch.stop();if(this._mask)renderSession.maskManager.popMask(this._mask,renderSession);if(this._filters)renderSession.filterManager.popFilter();renderSession.spriteBatch.start();}
else
{for(i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession);}}};PIXI.DisplayObjectContainer.prototype._renderCanvas=function(renderSession)
{if(this.visible===false||this.alpha===0)return;if(this._cacheAsBitmap)
{this._renderCachedSprite(renderSession);return;}
if(this._mask)
{renderSession.maskManager.pushMask(this._mask,renderSession);}
for(var i=0;i<this.children.length;i++)
{this.children[i]._renderCanvas(renderSession);}
if(this._mask)
{renderSession.maskManager.popMask(renderSession);}};PIXI.Sprite=function(texture)
{PIXI.DisplayObjectContainer.call(this);this.anchor=new PIXI.Point();this.texture=texture||PIXI.Texture.emptyTexture;this._width=0;this._height=0;this.tint=0xFFFFFF;this.cachedTint=-1;this.tintedTexture=null;this.blendMode=PIXI.blendModes.NORMAL;this.shader=null;if(this.texture.baseTexture.hasLoaded)
{this.onTextureUpdate();}
this.renderable=true;};PIXI.Sprite.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);PIXI.Sprite.prototype.constructor=PIXI.Sprite;Object.defineProperty(PIXI.Sprite.prototype,'width',{get:function(){return this.scale.x*this.texture.frame.width;},set:function(value){this.scale.x=value / this.texture.frame.width;this._width=value;}});Object.defineProperty(PIXI.Sprite.prototype,'height',{get:function(){return this.scale.y*this.texture.frame.height;},set:function(value){this.scale.y=value / this.texture.frame.height;this._height=value;}});PIXI.Sprite.prototype.setTexture=function(texture,destroyBase)
{if(destroyBase!==undefined)
{this.texture.baseTexture.destroy();}
this.texture=texture;this.texture.valid=true;};PIXI.Sprite.prototype.onTextureUpdate=function()
{if(this._width)this.scale.x=this._width / this.texture.frame.width;if(this._height)this.scale.y=this._height / this.texture.frame.height;};PIXI.Sprite.prototype.getBounds=function(matrix)
{var width=this.texture.frame.width;var height=this.texture.frame.height;var w0=width*(1-this.anchor.x);var w1=width*-this.anchor.x;var h0=height*(1-this.anchor.y);var h1=height*-this.anchor.y;var worldTransform=matrix||this.worldTransform;var a=worldTransform.a;var b=worldTransform.b;var c=worldTransform.c;var d=worldTransform.d;var tx=worldTransform.tx;var ty=worldTransform.ty;var maxX=-Infinity;var maxY=-Infinity;var minX=Infinity;var minY=Infinity;if(b===0&&c===0)
{if(a<0)
{a*=-1;var temp=w0;w0=-w1;w1=-temp;}
if(d<0)
{d*=-1;var temp=h0;h0=-h1;h1=-temp;}
minX=a*w1+tx;maxX=a*w0+tx;minY=d*h1+ty;maxY=d*h0+ty;}
else
{var x1=a*w1+c*h1+tx;var y1=d*h1+b*w1+ty;var x2=a*w0+c*h1+tx;var y2=d*h1+b*w0+ty;var x3=a*w0+c*h0+tx;var y3=d*h0+b*w0+ty;var x4=a*w1+c*h0+tx;var y4=d*h0+b*w1+ty;minX=x1<minX?x1:minX;minX=x2<minX?x2:minX;minX=x3<minX?x3:minX;minX=x4<minX?x4:minX;minY=y1<minY?y1:minY;minY=y2<minY?y2:minY;minY=y3<minY?y3:minY;minY=y4<minY?y4:minY;maxX=x1>maxX?x1:maxX;maxX=x2>maxX?x2:maxX;maxX=x3>maxX?x3:maxX;maxX=x4>maxX?x4:maxX;maxY=y1>maxY?y1:maxY;maxY=y2>maxY?y2:maxY;maxY=y3>maxY?y3:maxY;maxY=y4>maxY?y4:maxY;}
var bounds=this._bounds;bounds.x=minX;bounds.width=maxX-minX;bounds.y=minY;bounds.height=maxY-minY;this._currentBounds=bounds;return bounds;};PIXI.Sprite.prototype._renderWebGL=function(renderSession,matrix)
{if(!this.visible||this.alpha<=0||!this.renderable)return;var wt=this.worldTransform;if(matrix)
{wt=matrix;}
if(this._mask||this._filters)
{var spriteBatch=renderSession.spriteBatch;if(this._filters)
{spriteBatch.flush();renderSession.filterManager.pushFilter(this._filterBlock);}
if(this._mask)
{spriteBatch.stop();renderSession.maskManager.pushMask(this.mask,renderSession);spriteBatch.start();}
spriteBatch.render(this);for(var i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession);}
spriteBatch.stop();if(this._mask)renderSession.maskManager.popMask(this._mask,renderSession);if(this._filters)renderSession.filterManager.popFilter();spriteBatch.start();}
else
{renderSession.spriteBatch.render(this);for(var i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession,wt);}}};PIXI.Sprite.prototype._renderCanvas=function(renderSession,matrix)
{if(!this.visible||this.alpha===0||!this.renderable||this.texture.crop.width<=0||this.texture.crop.height<=0)
{return;}
var wt=this.worldTransform;if(matrix)
{wt=matrix;}
if(this.blendMode!==renderSession.currentBlendMode)
{renderSession.currentBlendMode=this.blendMode;renderSession.context.globalCompositeOperation=PIXI.blendModesCanvas[renderSession.currentBlendMode];}
if(this._mask)
{renderSession.maskManager.pushMask(this._mask,renderSession);}
if(this.texture.valid)
{var resolution=this.texture.baseTexture.resolution / renderSession.resolution;renderSession.context.globalAlpha=this.worldAlpha;if(renderSession.smoothProperty&&renderSession.scaleMode!==this.texture.baseTexture.scaleMode)
{renderSession.scaleMode=this.texture.baseTexture.scaleMode;renderSession.context[renderSession.smoothProperty]=(renderSession.scaleMode===PIXI.scaleModes.LINEAR);}
var dx=(this.texture.trim)?this.texture.trim.x-this.anchor.x*this.texture.trim.width:this.anchor.x*-this.texture.frame.width;var dy=(this.texture.trim)?this.texture.trim.y-this.anchor.y*this.texture.trim.height:this.anchor.y*-this.texture.frame.height;if(renderSession.roundPixels)
{renderSession.context.setTransform(wt.a,wt.b,wt.c,wt.d,(wt.tx*renderSession.resolution)|0,(wt.ty*renderSession.resolution)|0);dx|=0;dy|=0;}
else
{renderSession.context.setTransform(wt.a,wt.b,wt.c,wt.d,wt.tx*renderSession.resolution,wt.ty*renderSession.resolution);}
var cw=this.texture.crop.width;var ch=this.texture.crop.height;dx /=resolution;dy /=resolution;if(this.tint!==0xFFFFFF)
{if(this.texture.requiresReTint||this.cachedTint!==this.tint)
{this.tintedTexture=PIXI.CanvasTinter.getTintedTexture(this,this.tint);this.cachedTint=this.tint;}
renderSession.context.drawImage(this.tintedTexture,0,0,cw,ch,dx,dy,cw / resolution,ch / resolution);}
else
{var cx=this.texture.crop.x;var cy=this.texture.crop.y;renderSession.context.drawImage(this.texture.baseTexture.source,cx,cy,cw,ch,dx,dy,cw / resolution,ch / resolution);}}
for(var i=0;i<this.children.length;i++)
{this.children[i]._renderCanvas(renderSession);}
if(this._mask)
{renderSession.maskManager.popMask(renderSession);}};PIXI.Sprite.fromFrame=function(frameId)
{var texture=PIXI.TextureCache[frameId];if(!texture)throw new Error('The frameId "'+frameId+'" does not exist in the texture cache'+this);return new PIXI.Sprite(texture);};PIXI.Sprite.fromImage=function(imageId,crossorigin,scaleMode)
{var texture=PIXI.Texture.fromImage(imageId,crossorigin,scaleMode);return new PIXI.Sprite(texture);};PIXI.SpriteBatch=function(texture)
{PIXI.DisplayObjectContainer.call(this);this.textureThing=texture;this.ready=false;};PIXI.SpriteBatch.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);PIXI.SpriteBatch.prototype.constructor=PIXI.SpriteBatch;PIXI.SpriteBatch.prototype.initWebGL=function(gl)
{this.fastSpriteBatch=new PIXI.WebGLFastSpriteBatch(gl);this.ready=true;};PIXI.SpriteBatch.prototype.updateTransform=function()
{this.displayObjectUpdateTransform();};PIXI.SpriteBatch.prototype._renderWebGL=function(renderSession)
{if(!this.visible||this.alpha<=0||!this.children.length)return;if(!this.ready)
{this.initWebGL(renderSession.gl);}
if(this.fastSpriteBatch.gl!==renderSession.gl)
{this.fastSpriteBatch.setContext(renderSession.gl);}
renderSession.spriteBatch.stop();renderSession.shaderManager.setShader(renderSession.shaderManager.fastShader);this.fastSpriteBatch.begin(this,renderSession);this.fastSpriteBatch.render(this);renderSession.spriteBatch.start();};PIXI.SpriteBatch.prototype._renderCanvas=function(renderSession)
{if(!this.visible||this.alpha<=0||!this.children.length)return;var context=renderSession.context;context.globalAlpha=this.worldAlpha;this.displayObjectUpdateTransform();var transform=this.worldTransform;var isRotated=true;for(var i=0;i<this.children.length;i++)
{var child=this.children[i];if(!child.visible)continue;var texture=child.texture;var frame=texture.frame;context.globalAlpha=this.worldAlpha*child.alpha;if(child.rotation%(Math.PI*2)===0)
{if(isRotated)
{context.setTransform(transform.a,transform.b,transform.c,transform.d,transform.tx,transform.ty);isRotated=false;}
context.drawImage(texture.baseTexture.source,frame.x,frame.y,frame.width,frame.height,((child.anchor.x)*(-frame.width*child.scale.x)+child.position.x+0.5)|0,((child.anchor.y)*(-frame.height*child.scale.y)+child.position.y+0.5)|0,frame.width*child.scale.x,frame.height*child.scale.y);}
else
{if(!isRotated)isRotated=true;child.displayObjectUpdateTransform();var childTransform=child.worldTransform;if(renderSession.roundPixels)
{context.setTransform(childTransform.a,childTransform.b,childTransform.c,childTransform.d,childTransform.tx|0,childTransform.ty|0);}
else
{context.setTransform(childTransform.a,childTransform.b,childTransform.c,childTransform.d,childTransform.tx,childTransform.ty);}
context.drawImage(texture.baseTexture.source,frame.x,frame.y,frame.width,frame.height,((child.anchor.x)*(-frame.width)+0.5)|0,((child.anchor.y)*(-frame.height)+0.5)|0,frame.width,frame.height);}}};PIXI.hex2rgb=function(hex){return[(hex>>16&0xFF)/ 255,(hex>>8&0xFF)/ 255,(hex&0xFF)/ 255];};PIXI.rgb2hex=function(rgb){return((rgb[0]*255<<16)+(rgb[1]*255<<8)+rgb[2]*255);};PIXI.canUseNewCanvasBlendModes=function()
{if(document===undefined)return false;var pngHead='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/';var pngEnd='AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';var magenta=new Image();magenta.src=pngHead+'AP804Oa6'+pngEnd;var yellow=new Image();yellow.src=pngHead+'/wCKxvRF'+pngEnd;var canvas=PIXI.CanvasPool.create(this,6,1);var context=canvas.getContext('2d');context.globalCompositeOperation='multiply';context.drawImage(magenta,0,0);context.drawImage(yellow,2,0);if(!context.getImageData(2,0,1,1))
{return false;}
var data=context.getImageData(2,0,1,1).data;PIXI.CanvasPool.remove(this);return(data[0]===255&&data[1]===0&&data[2]===0);};PIXI.getNextPowerOfTwo=function(number)
{if(number>0&&(number&(number-1))===0)
return number;else
{var result=1;while(result<number)result<<=1;return result;}};PIXI.isPowerOfTwo=function(width,height)
{return(width>0&&(width&(width-1))===0&&height>0&&(height&(height-1))===0);};PIXI.CanvasPool={create:function(parent,width,height){var idx=PIXI.CanvasPool.getFirst();var canvas;if(idx===-1)
{var container={parent:parent,canvas:document.createElement('canvas')}
PIXI.CanvasPool.pool.push(container);canvas=container.canvas;}
else
{PIXI.CanvasPool.pool[idx].parent=parent;canvas=PIXI.CanvasPool.pool[idx].canvas;}
if(width!==undefined)
{canvas.width=width;canvas.height=height;}
return canvas;},getFirst:function(){var pool=PIXI.CanvasPool.pool;for(var i=0;i<pool.length;i++)
{if(pool[i].parent===null)
{return i;}}
return-1;},remove:function(parent){var pool=PIXI.CanvasPool.pool;for(var i=0;i<pool.length;i++)
{if(pool[i].parent===parent)
{pool[i].parent=null;}}},removeByCanvas:function(canvas){var pool=PIXI.CanvasPool.pool;for(var i=0;i<pool.length;i++)
{if(pool[i].canvas===canvas)
{pool[i].parent=null;}}},getTotal:function(){var pool=PIXI.CanvasPool.pool;var c=0;for(var i=0;i<pool.length;i++)
{if(pool[i].parent!==null)
{c++;}}
return c;},getFree:function(){var pool=PIXI.CanvasPool.pool;var c=0;for(var i=0;i<pool.length;i++)
{if(pool[i].parent===null)
{c++;}}
return c;}};PIXI.CanvasPool.pool=[];PIXI.initDefaultShaders=function()
{};PIXI.CompileVertexShader=function(gl,shaderSrc)
{return PIXI._CompileShader(gl,shaderSrc,gl.VERTEX_SHADER);};PIXI.CompileFragmentShader=function(gl,shaderSrc)
{return PIXI._CompileShader(gl,shaderSrc,gl.FRAGMENT_SHADER);};PIXI._CompileShader=function(gl,shaderSrc,shaderType)
{var src=shaderSrc;if(Array.isArray(shaderSrc))
{src=shaderSrc.join("\n");}
var shader=gl.createShader(shaderType);gl.shaderSource(shader,src);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
{window.console.log(gl.getShaderInfoLog(shader));return null;}
return shader;};PIXI.compileProgram=function(gl,vertexSrc,fragmentSrc)
{var fragmentShader=PIXI.CompileFragmentShader(gl,fragmentSrc);var vertexShader=PIXI.CompileVertexShader(gl,vertexSrc);var shaderProgram=gl.createProgram();gl.attachShader(shaderProgram,vertexShader);gl.attachShader(shaderProgram,fragmentShader);gl.linkProgram(shaderProgram);if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
{window.console.log("Could not initialise shaders");}
return shaderProgram;};PIXI.PixiShader=function(gl)
{this._UID=PIXI._UID++;this.gl=gl;this.program=null;this.fragmentSrc=['precision lowp float;','varying vec2 vTextureCoord;','varying vec4 vColor;','uniform sampler2D uSampler;','void main(void) {','   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;','}'];this.textureCount=0;this.firstRun=true;this.dirty=true;this.attributes=[];this.init();};PIXI.PixiShader.prototype.constructor=PIXI.PixiShader;PIXI.PixiShader.prototype.init=function()
{var gl=this.gl;var program=PIXI.compileProgram(gl,this.vertexSrc||PIXI.PixiShader.defaultVertexSrc,this.fragmentSrc);gl.useProgram(program);this.uSampler=gl.getUniformLocation(program,'uSampler');this.projectionVector=gl.getUniformLocation(program,'projectionVector');this.offsetVector=gl.getUniformLocation(program,'offsetVector');this.dimensions=gl.getUniformLocation(program,'dimensions');this.aVertexPosition=gl.getAttribLocation(program,'aVertexPosition');this.aTextureCoord=gl.getAttribLocation(program,'aTextureCoord');this.colorAttribute=gl.getAttribLocation(program,'aColor');if(this.colorAttribute===-1)
{this.colorAttribute=2;}
this.attributes=[this.aVertexPosition,this.aTextureCoord,this.colorAttribute];for(var key in this.uniforms)
{this.uniforms[key].uniformLocation=gl.getUniformLocation(program,key);}
this.initUniforms();this.program=program;};PIXI.PixiShader.prototype.initUniforms=function()
{this.textureCount=1;var gl=this.gl;var uniform;for(var key in this.uniforms)
{uniform=this.uniforms[key];var type=uniform.type;if(type==='sampler2D')
{uniform._init=false;if(uniform.value!==null)
{this.initSampler2D(uniform);}}
else if(type==='mat2'||type==='mat3'||type==='mat4')
{uniform.glMatrix=true;uniform.glValueLength=1;if(type==='mat2')
{uniform.glFunc=gl.uniformMatrix2fv;}
else if(type==='mat3')
{uniform.glFunc=gl.uniformMatrix3fv;}
else if(type==='mat4')
{uniform.glFunc=gl.uniformMatrix4fv;}}
else
{uniform.glFunc=gl['uniform'+type];if(type==='2f'||type==='2i')
{uniform.glValueLength=2;}
else if(type==='3f'||type==='3i')
{uniform.glValueLength=3;}
else if(type==='4f'||type==='4i')
{uniform.glValueLength=4;}
else
{uniform.glValueLength=1;}}}};PIXI.PixiShader.prototype.initSampler2D=function(uniform)
{if(!uniform.value||!uniform.value.baseTexture||!uniform.value.baseTexture.hasLoaded)
{return;}
var gl=this.gl;gl.activeTexture(gl['TEXTURE'+this.textureCount]);gl.bindTexture(gl.TEXTURE_2D,uniform.value.baseTexture._glTextures[gl.id]);if(uniform.textureData)
{var data=uniform.textureData;var magFilter=(data.magFilter)?data.magFilter:gl.LINEAR;var minFilter=(data.minFilter)?data.minFilter:gl.LINEAR;var wrapS=(data.wrapS)?data.wrapS:gl.CLAMP_TO_EDGE;var wrapT=(data.wrapT)?data.wrapT:gl.CLAMP_TO_EDGE;var format=(data.luminance)?gl.LUMINANCE:gl.RGBA;if(data.repeat)
{wrapS=gl.REPEAT;wrapT=gl.REPEAT;}
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,!!data.flipY);if(data.width)
{var width=(data.width)?data.width:512;var height=(data.height)?data.height:2;var border=(data.border)?data.border:0;gl.texImage2D(gl.TEXTURE_2D,0,format,width,height,border,format,gl.UNSIGNED_BYTE,null);}
else
{gl.texImage2D(gl.TEXTURE_2D,0,format,gl.RGBA,gl.UNSIGNED_BYTE,uniform.value.baseTexture.source);}
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,magFilter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,minFilter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,wrapS);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,wrapT);}
gl.uniform1i(uniform.uniformLocation,this.textureCount);uniform._init=true;this.textureCount++;};PIXI.PixiShader.prototype.syncUniforms=function()
{this.textureCount=1;var uniform;var gl=this.gl;for(var key in this.uniforms)
{uniform=this.uniforms[key];if(uniform.glValueLength===1)
{if(uniform.glMatrix===true)
{uniform.glFunc.call(gl,uniform.uniformLocation,uniform.transpose,uniform.value);}
else
{uniform.glFunc.call(gl,uniform.uniformLocation,uniform.value);}}
else if(uniform.glValueLength===2)
{uniform.glFunc.call(gl,uniform.uniformLocation,uniform.value.x,uniform.value.y);}
else if(uniform.glValueLength===3)
{uniform.glFunc.call(gl,uniform.uniformLocation,uniform.value.x,uniform.value.y,uniform.value.z);}
else if(uniform.glValueLength===4)
{uniform.glFunc.call(gl,uniform.uniformLocation,uniform.value.x,uniform.value.y,uniform.value.z,uniform.value.w);}
else if(uniform.type==='sampler2D')
{if(uniform._init)
{gl.activeTexture(gl['TEXTURE'+this.textureCount]);if(uniform.value.baseTexture._dirty[gl.id])
{PIXI.instances[gl.id].updateTexture(uniform.value.baseTexture);}
else
{gl.bindTexture(gl.TEXTURE_2D,uniform.value.baseTexture._glTextures[gl.id]);}
gl.uniform1i(uniform.uniformLocation,this.textureCount);this.textureCount++;}
else
{this.initSampler2D(uniform);}}}};PIXI.PixiShader.prototype.destroy=function()
{this.gl.deleteProgram(this.program);this.uniforms=null;this.gl=null;this.attributes=null;};PIXI.PixiShader.defaultVertexSrc=['attribute vec2 aVertexPosition;','attribute vec2 aTextureCoord;','attribute vec4 aColor;','uniform vec2 projectionVector;','uniform vec2 offsetVector;','varying vec2 vTextureCoord;','varying vec4 vColor;','const vec2 center = vec2(-1.0, 1.0);','void main(void) {','   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);','   vTextureCoord = aTextureCoord;','   vColor = vec4(aColor.rgb * aColor.a, aColor.a);','}'];PIXI.PixiFastShader=function(gl)
{this._UID=PIXI._UID++;this.gl=gl;this.program=null;this.fragmentSrc=['precision lowp float;','varying vec2 vTextureCoord;','varying float vColor;','uniform sampler2D uSampler;','void main(void) {','   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;','}'];this.vertexSrc=['attribute vec2 aVertexPosition;','attribute vec2 aPositionCoord;','attribute vec2 aScale;','attribute float aRotation;','attribute vec2 aTextureCoord;','attribute float aColor;','uniform vec2 projectionVector;','uniform vec2 offsetVector;','uniform mat3 uMatrix;','varying vec2 vTextureCoord;','varying float vColor;','const vec2 center = vec2(-1.0, 1.0);','void main(void) {','   vec2 v;','   vec2 sv = aVertexPosition * aScale;','   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);','   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);','   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;','   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);','   vTextureCoord = aTextureCoord;','   vColor = aColor;','}'];this.textureCount=0;this.init();};PIXI.PixiFastShader.prototype.constructor=PIXI.PixiFastShader;PIXI.PixiFastShader.prototype.init=function()
{var gl=this.gl;var program=PIXI.compileProgram(gl,this.vertexSrc,this.fragmentSrc);gl.useProgram(program);this.uSampler=gl.getUniformLocation(program,'uSampler');this.projectionVector=gl.getUniformLocation(program,'projectionVector');this.offsetVector=gl.getUniformLocation(program,'offsetVector');this.dimensions=gl.getUniformLocation(program,'dimensions');this.uMatrix=gl.getUniformLocation(program,'uMatrix');this.aVertexPosition=gl.getAttribLocation(program,'aVertexPosition');this.aPositionCoord=gl.getAttribLocation(program,'aPositionCoord');this.aScale=gl.getAttribLocation(program,'aScale');this.aRotation=gl.getAttribLocation(program,'aRotation');this.aTextureCoord=gl.getAttribLocation(program,'aTextureCoord');this.colorAttribute=gl.getAttribLocation(program,'aColor');if(this.colorAttribute===-1)
{this.colorAttribute=2;}
this.attributes=[this.aVertexPosition,this.aPositionCoord,this.aScale,this.aRotation,this.aTextureCoord,this.colorAttribute];this.program=program;};PIXI.PixiFastShader.prototype.destroy=function()
{this.gl.deleteProgram(this.program);this.uniforms=null;this.gl=null;this.attributes=null;};PIXI.StripShader=function(gl)
{this._UID=PIXI._UID++;this.gl=gl;this.program=null;this.fragmentSrc=['precision mediump float;','varying vec2 vTextureCoord;','uniform float alpha;','uniform sampler2D uSampler;','void main(void) {','   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * alpha;','}'];this.vertexSrc=['attribute vec2 aVertexPosition;','attribute vec2 aTextureCoord;','uniform mat3 translationMatrix;','uniform vec2 projectionVector;','uniform vec2 offsetVector;','varying vec2 vTextureCoord;','void main(void) {','   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);','   v -= offsetVector.xyx;','   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);','   vTextureCoord = aTextureCoord;','}'];this.init();};PIXI.StripShader.prototype.constructor=PIXI.StripShader;PIXI.StripShader.prototype.init=function()
{var gl=this.gl;var program=PIXI.compileProgram(gl,this.vertexSrc,this.fragmentSrc);gl.useProgram(program);this.uSampler=gl.getUniformLocation(program,'uSampler');this.projectionVector=gl.getUniformLocation(program,'projectionVector');this.offsetVector=gl.getUniformLocation(program,'offsetVector');this.colorAttribute=gl.getAttribLocation(program,'aColor');this.aVertexPosition=gl.getAttribLocation(program,'aVertexPosition');this.aTextureCoord=gl.getAttribLocation(program,'aTextureCoord');this.attributes=[this.aVertexPosition,this.aTextureCoord];this.translationMatrix=gl.getUniformLocation(program,'translationMatrix');this.alpha=gl.getUniformLocation(program,'alpha');this.program=program;};PIXI.StripShader.prototype.destroy=function()
{this.gl.deleteProgram(this.program);this.uniforms=null;this.gl=null;this.attribute=null;};PIXI.PrimitiveShader=function(gl)
{this._UID=PIXI._UID++;this.gl=gl;this.program=null;this.fragmentSrc=['precision mediump float;','varying vec4 vColor;','void main(void) {','   gl_FragColor = vColor;','}'];this.vertexSrc=['attribute vec2 aVertexPosition;','attribute vec4 aColor;','uniform mat3 translationMatrix;','uniform vec2 projectionVector;','uniform vec2 offsetVector;','uniform float alpha;','uniform float flipY;','uniform vec3 tint;','varying vec4 vColor;','void main(void) {','   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);','   v -= offsetVector.xyx;','   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);','   vColor = aColor * vec4(tint * alpha, alpha);','}'];this.init();};PIXI.PrimitiveShader.prototype.constructor=PIXI.PrimitiveShader;PIXI.PrimitiveShader.prototype.init=function()
{var gl=this.gl;var program=PIXI.compileProgram(gl,this.vertexSrc,this.fragmentSrc);gl.useProgram(program);this.projectionVector=gl.getUniformLocation(program,'projectionVector');this.offsetVector=gl.getUniformLocation(program,'offsetVector');this.tintColor=gl.getUniformLocation(program,'tint');this.flipY=gl.getUniformLocation(program,'flipY');this.aVertexPosition=gl.getAttribLocation(program,'aVertexPosition');this.colorAttribute=gl.getAttribLocation(program,'aColor');this.attributes=[this.aVertexPosition,this.colorAttribute];this.translationMatrix=gl.getUniformLocation(program,'translationMatrix');this.alpha=gl.getUniformLocation(program,'alpha');this.program=program;};PIXI.PrimitiveShader.prototype.destroy=function()
{this.gl.deleteProgram(this.program);this.uniforms=null;this.gl=null;this.attributes=null;};PIXI.ComplexPrimitiveShader=function(gl)
{this._UID=PIXI._UID++;this.gl=gl;this.program=null;this.fragmentSrc=['precision mediump float;','varying vec4 vColor;','void main(void) {','   gl_FragColor = vColor;','}'];this.vertexSrc=['attribute vec2 aVertexPosition;','uniform mat3 translationMatrix;','uniform vec2 projectionVector;','uniform vec2 offsetVector;','uniform vec3 tint;','uniform float alpha;','uniform vec3 color;','uniform float flipY;','varying vec4 vColor;','void main(void) {','   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);','   v -= offsetVector.xyx;','   gl_Position = vec4( v.x / projectionVector.x -1.0, (v.y / projectionVector.y * -flipY) + flipY , 0.0, 1.0);','   vColor = vec4(color * alpha * tint, alpha);','}'];this.init();};PIXI.ComplexPrimitiveShader.prototype.constructor=PIXI.ComplexPrimitiveShader;PIXI.ComplexPrimitiveShader.prototype.init=function()
{var gl=this.gl;var program=PIXI.compileProgram(gl,this.vertexSrc,this.fragmentSrc);gl.useProgram(program);this.projectionVector=gl.getUniformLocation(program,'projectionVector');this.offsetVector=gl.getUniformLocation(program,'offsetVector');this.tintColor=gl.getUniformLocation(program,'tint');this.color=gl.getUniformLocation(program,'color');this.flipY=gl.getUniformLocation(program,'flipY');this.aVertexPosition=gl.getAttribLocation(program,'aVertexPosition');this.attributes=[this.aVertexPosition,this.colorAttribute];this.translationMatrix=gl.getUniformLocation(program,'translationMatrix');this.alpha=gl.getUniformLocation(program,'alpha');this.program=program;};PIXI.ComplexPrimitiveShader.prototype.destroy=function()
{this.gl.deleteProgram(this.program);this.uniforms=null;this.gl=null;this.attribute=null;};PIXI.glContexts=[];PIXI.instances=[];PIXI.WebGLRenderer=function(game){this.game=game;if(!PIXI.defaultRenderer)
{PIXI.defaultRenderer=this;}
this.type=PIXI.WEBGL_RENDERER;this.resolution=game.resolution;this.transparent=game.transparent;this.autoResize=false;this.preserveDrawingBuffer=game.preserveDrawingBuffer;this.clearBeforeRender=game.clearBeforeRender;this.width=game.width;this.height=game.height;this.view=game.canvas;this._contextOptions={alpha:this.transparent,antialias:game.antialias,premultipliedAlpha:this.transparent&&this.transparent!=='notMultiplied',stencil:true,preserveDrawingBuffer:this.preserveDrawingBuffer};this.projection=new PIXI.Point();this.offset=new PIXI.Point();this.shaderManager=new PIXI.WebGLShaderManager();this.spriteBatch=new PIXI.WebGLSpriteBatch();this.maskManager=new PIXI.WebGLMaskManager();this.filterManager=new PIXI.WebGLFilterManager();this.stencilManager=new PIXI.WebGLStencilManager();this.blendModeManager=new PIXI.WebGLBlendModeManager();this.renderSession={};this.renderSession.game=this.game;this.renderSession.gl=this.gl;this.renderSession.drawCount=0;this.renderSession.shaderManager=this.shaderManager;this.renderSession.maskManager=this.maskManager;this.renderSession.filterManager=this.filterManager;this.renderSession.blendModeManager=this.blendModeManager;this.renderSession.spriteBatch=this.spriteBatch;this.renderSession.stencilManager=this.stencilManager;this.renderSession.renderer=this;this.renderSession.resolution=this.resolution;this.initContext();this.mapBlendModes();};PIXI.WebGLRenderer.prototype.constructor=PIXI.WebGLRenderer;PIXI.WebGLRenderer.prototype.initContext=function()
{var gl=this.view.getContext('webgl',this._contextOptions)||this.view.getContext('experimental-webgl',this._contextOptions);this.gl=gl;if(!gl){throw new Error('This browser does not support webGL. Try using the canvas renderer');}
this.glContextId=gl.id=PIXI.WebGLRenderer.glContextId++;PIXI.glContexts[this.glContextId]=gl;PIXI.instances[this.glContextId]=this;gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);this.shaderManager.setContext(gl);this.spriteBatch.setContext(gl);this.maskManager.setContext(gl);this.filterManager.setContext(gl);this.blendModeManager.setContext(gl);this.stencilManager.setContext(gl);this.renderSession.gl=this.gl;this.resize(this.width,this.height);};PIXI.WebGLRenderer.prototype.render=function(stage)
{if(this.contextLost)
{return;}
stage.updateTransform();var gl=this.gl;gl.viewport(0,0,this.width,this.height);gl.bindFramebuffer(gl.FRAMEBUFFER,null);if(this.game.clearBeforeRender)
{gl.clearColor(stage._bgColor.r,stage._bgColor.g,stage._bgColor.b,stage._bgColor.a);gl.clear(gl.COLOR_BUFFER_BIT);}
this.renderDisplayObject(stage,this.projection);};PIXI.WebGLRenderer.prototype.renderDisplayObject=function(displayObject,projection,buffer,matrix)
{this.renderSession.blendModeManager.setBlendMode(PIXI.blendModes.NORMAL);this.renderSession.drawCount=0;this.renderSession.flipY=buffer?-1:1;this.renderSession.projection=projection;this.renderSession.offset=this.offset;this.spriteBatch.begin(this.renderSession);this.filterManager.begin(this.renderSession,buffer);displayObject._renderWebGL(this.renderSession,matrix);this.spriteBatch.end();};PIXI.WebGLRenderer.prototype.resize=function(width,height)
{this.width=width*this.resolution;this.height=height*this.resolution;this.view.width=this.width;this.view.height=this.height;if(this.autoResize){this.view.style.width=this.width / this.resolution+'px';this.view.style.height=this.height / this.resolution+'px';}
this.gl.viewport(0,0,this.width,this.height);this.projection.x=this.width / 2 / this.resolution;this.projection.y=-this.height / 2 / this.resolution;};PIXI.WebGLRenderer.prototype.updateTexture=function(texture)
{if(!texture.hasLoaded)
{return false;}
var gl=this.gl;if(!texture._glTextures[gl.id])
{texture._glTextures[gl.id]=gl.createTexture();}
gl.bindTexture(gl.TEXTURE_2D,texture._glTextures[gl.id]);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,texture.premultipliedAlpha);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture.source);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,texture.scaleMode===PIXI.scaleModes.LINEAR?gl.LINEAR:gl.NEAREST);if(texture.mipmap&&PIXI.isPowerOfTwo(texture.width,texture.height))
{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,texture.scaleMode===PIXI.scaleModes.LINEAR?gl.LINEAR_MIPMAP_LINEAR:gl.NEAREST_MIPMAP_NEAREST);gl.generateMipmap(gl.TEXTURE_2D);}
else
{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,texture.scaleMode===PIXI.scaleModes.LINEAR?gl.LINEAR:gl.NEAREST);}
if(!texture._powerOf2)
{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
else
{gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);}
texture._dirty[gl.id]=false;return true;};PIXI.WebGLRenderer.prototype.destroy=function()
{PIXI.glContexts[this.glContextId]=null;this.projection=null;this.offset=null;this.shaderManager.destroy();this.spriteBatch.destroy();this.maskManager.destroy();this.filterManager.destroy();this.shaderManager=null;this.spriteBatch=null;this.maskManager=null;this.filterManager=null;this.gl=null;this.renderSession=null;PIXI.CanvasPool.remove(this);PIXI.instances[this.glContextId]=null;PIXI.WebGLRenderer.glContextId--;};PIXI.WebGLRenderer.prototype.mapBlendModes=function()
{var gl=this.gl;if(!PIXI.blendModesWebGL)
{var b=[];var modes=PIXI.blendModes;b[modes.NORMAL]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.ADD]=[gl.SRC_ALPHA,gl.DST_ALPHA];b[modes.MULTIPLY]=[gl.DST_COLOR,gl.ONE_MINUS_SRC_ALPHA];b[modes.SCREEN]=[gl.SRC_ALPHA,gl.ONE];b[modes.OVERLAY]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.DARKEN]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.LIGHTEN]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.COLOR_DODGE]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.COLOR_BURN]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.HARD_LIGHT]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.SOFT_LIGHT]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.DIFFERENCE]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.EXCLUSION]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.HUE]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.SATURATION]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.COLOR]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];b[modes.LUMINOSITY]=[gl.ONE,gl.ONE_MINUS_SRC_ALPHA];PIXI.blendModesWebGL=b;}};PIXI.WebGLRenderer.glContextId=0;PIXI.WebGLBlendModeManager=function()
{this.currentBlendMode=99999;};PIXI.WebGLBlendModeManager.prototype.constructor=PIXI.WebGLBlendModeManager;PIXI.WebGLBlendModeManager.prototype.setContext=function(gl)
{this.gl=gl;};PIXI.WebGLBlendModeManager.prototype.setBlendMode=function(blendMode)
{if(this.currentBlendMode===blendMode)return false;this.currentBlendMode=blendMode;var blendModeWebGL=PIXI.blendModesWebGL[this.currentBlendMode];if(blendModeWebGL)
{this.gl.blendFunc(blendModeWebGL[0],blendModeWebGL[1]);}
return true;};PIXI.WebGLBlendModeManager.prototype.destroy=function()
{this.gl=null;};PIXI.WebGLMaskManager=function()
{};PIXI.WebGLMaskManager.prototype.constructor=PIXI.WebGLMaskManager;PIXI.WebGLMaskManager.prototype.setContext=function(gl)
{this.gl=gl;};PIXI.WebGLMaskManager.prototype.pushMask=function(maskData,renderSession)
{var gl=renderSession.gl;if(maskData.dirty)
{PIXI.WebGLGraphics.updateGraphics(maskData,gl);}
if(!maskData._webGL[gl.id].data.length)return;renderSession.stencilManager.pushStencil(maskData,maskData._webGL[gl.id].data[0],renderSession);};PIXI.WebGLMaskManager.prototype.popMask=function(maskData,renderSession)
{var gl=this.gl;renderSession.stencilManager.popStencil(maskData,maskData._webGL[gl.id].data[0],renderSession);};PIXI.WebGLMaskManager.prototype.destroy=function()
{this.gl=null;};PIXI.WebGLStencilManager=function()
{this.stencilStack=[];this.reverse=true;this.count=0;};PIXI.WebGLStencilManager.prototype.setContext=function(gl)
{this.gl=gl;};PIXI.WebGLStencilManager.prototype.pushStencil=function(graphics,webGLData,renderSession)
{var gl=this.gl;this.bindGraphics(graphics,webGLData,renderSession);if(this.stencilStack.length===0)
{gl.enable(gl.STENCIL_TEST);gl.clear(gl.STENCIL_BUFFER_BIT);this.reverse=true;this.count=0;}
this.stencilStack.push(webGLData);var level=this.count;gl.colorMask(false,false,false,false);gl.stencilFunc(gl.ALWAYS,0,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);if(webGLData.mode===1)
{gl.drawElements(gl.TRIANGLE_FAN,webGLData.indices.length-4,gl.UNSIGNED_SHORT,0);if(this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-level,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);}
else
{gl.stencilFunc(gl.EQUAL,level,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);}
gl.drawElements(gl.TRIANGLE_FAN,4,gl.UNSIGNED_SHORT,(webGLData.indices.length-4)*2);if(this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level+1),0xFF);}
else
{gl.stencilFunc(gl.EQUAL,level+1,0xFF);}
this.reverse=!this.reverse;}
else
{if(!this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-level,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);}
else
{gl.stencilFunc(gl.EQUAL,level,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);}
gl.drawElements(gl.TRIANGLE_STRIP,webGLData.indices.length,gl.UNSIGNED_SHORT,0);if(!this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level+1),0xFF);}
else
{gl.stencilFunc(gl.EQUAL,level+1,0xFF);}}
gl.colorMask(true,true,true,true);gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);this.count++;};PIXI.WebGLStencilManager.prototype.bindGraphics=function(graphics,webGLData,renderSession)
{this._currentGraphics=graphics;var gl=this.gl;var projection=renderSession.projection,offset=renderSession.offset,shader;if(webGLData.mode===1)
{shader=renderSession.shaderManager.complexPrimitiveShader;renderSession.shaderManager.setShader(shader);gl.uniform1f(shader.flipY,renderSession.flipY);gl.uniformMatrix3fv(shader.translationMatrix,false,graphics.worldTransform.toArray(true));gl.uniform2f(shader.projectionVector,projection.x,-projection.y);gl.uniform2f(shader.offsetVector,-offset.x,-offset.y);gl.uniform3fv(shader.tintColor,PIXI.hex2rgb(graphics.tint));gl.uniform3fv(shader.color,webGLData.color);gl.uniform1f(shader.alpha,graphics.worldAlpha*webGLData.alpha);gl.bindBuffer(gl.ARRAY_BUFFER,webGLData.buffer);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,4*2,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,webGLData.indexBuffer);}
else
{shader=renderSession.shaderManager.primitiveShader;renderSession.shaderManager.setShader(shader);gl.uniformMatrix3fv(shader.translationMatrix,false,graphics.worldTransform.toArray(true));gl.uniform1f(shader.flipY,renderSession.flipY);gl.uniform2f(shader.projectionVector,projection.x,-projection.y);gl.uniform2f(shader.offsetVector,-offset.x,-offset.y);gl.uniform3fv(shader.tintColor,PIXI.hex2rgb(graphics.tint));gl.uniform1f(shader.alpha,graphics.worldAlpha);gl.bindBuffer(gl.ARRAY_BUFFER,webGLData.buffer);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,4*6,0);gl.vertexAttribPointer(shader.colorAttribute,4,gl.FLOAT,false,4*6,2*4);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,webGLData.indexBuffer);}};PIXI.WebGLStencilManager.prototype.popStencil=function(graphics,webGLData,renderSession)
{var gl=this.gl;this.stencilStack.pop();this.count--;if(this.stencilStack.length===0)
{gl.disable(gl.STENCIL_TEST);}
else
{var level=this.count;this.bindGraphics(graphics,webGLData,renderSession);gl.colorMask(false,false,false,false);if(webGLData.mode===1)
{this.reverse=!this.reverse;if(this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level+1),0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);}
else
{gl.stencilFunc(gl.EQUAL,level+1,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);}
gl.drawElements(gl.TRIANGLE_FAN,4,gl.UNSIGNED_SHORT,(webGLData.indices.length-4)*2);gl.stencilFunc(gl.ALWAYS,0,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INVERT);gl.drawElements(gl.TRIANGLE_FAN,webGLData.indices.length-4,gl.UNSIGNED_SHORT,0);if(!this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level),0xFF);}
else
{gl.stencilFunc(gl.EQUAL,level,0xFF);}}
else
{if(!this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level+1),0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);}
else
{gl.stencilFunc(gl.EQUAL,level+1,0xFF);gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);}
gl.drawElements(gl.TRIANGLE_STRIP,webGLData.indices.length,gl.UNSIGNED_SHORT,0);if(!this.reverse)
{gl.stencilFunc(gl.EQUAL,0xFF-(level),0xFF);}
else
{gl.stencilFunc(gl.EQUAL,level,0xFF);}}
gl.colorMask(true,true,true,true);gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);}};PIXI.WebGLStencilManager.prototype.destroy=function()
{this.stencilStack=null;this.gl=null;};PIXI.WebGLShaderManager=function()
{this.maxAttibs=10;this.attribState=[];this.tempAttribState=[];for(var i=0;i<this.maxAttibs;i++)
{this.attribState[i]=false;}
this.stack=[];};PIXI.WebGLShaderManager.prototype.constructor=PIXI.WebGLShaderManager;PIXI.WebGLShaderManager.prototype.setContext=function(gl)
{this.gl=gl;this.primitiveShader=new PIXI.PrimitiveShader(gl);this.complexPrimitiveShader=new PIXI.ComplexPrimitiveShader(gl);this.defaultShader=new PIXI.PixiShader(gl);this.fastShader=new PIXI.PixiFastShader(gl);this.stripShader=new PIXI.StripShader(gl);this.setShader(this.defaultShader);};PIXI.WebGLShaderManager.prototype.setAttribs=function(attribs)
{var i;for(i=0;i<this.tempAttribState.length;i++)
{this.tempAttribState[i]=false;}
for(i=0;i<attribs.length;i++)
{var attribId=attribs[i];this.tempAttribState[attribId]=true;}
var gl=this.gl;for(i=0;i<this.attribState.length;i++)
{if(this.attribState[i]!==this.tempAttribState[i])
{this.attribState[i]=this.tempAttribState[i];if(this.tempAttribState[i])
{gl.enableVertexAttribArray(i);}
else
{gl.disableVertexAttribArray(i);}}}};PIXI.WebGLShaderManager.prototype.setShader=function(shader)
{if(this._currentId===shader._UID)return false;this._currentId=shader._UID;this.currentShader=shader;this.gl.useProgram(shader.program);this.setAttribs(shader.attributes);return true;};PIXI.WebGLShaderManager.prototype.destroy=function()
{this.attribState=null;this.tempAttribState=null;this.primitiveShader.destroy();this.complexPrimitiveShader.destroy();this.defaultShader.destroy();this.fastShader.destroy();this.stripShader.destroy();this.gl=null;};PIXI.WebGLSpriteBatch=function()
{this.vertSize=5;this.size=2000;var numVerts=this.size*4*4*this.vertSize;var numIndices=this.size*6;this.vertices=new PIXI.ArrayBuffer(numVerts);this.positions=new PIXI.Float32Array(this.vertices);this.colors=new PIXI.Uint32Array(this.vertices);this.indices=new PIXI.Uint16Array(numIndices);this.lastIndexCount=0;for(var i=0,j=0;i<numIndices;i+=6,j+=4)
{this.indices[i+0]=j+0;this.indices[i+1]=j+1;this.indices[i+2]=j+2;this.indices[i+3]=j+0;this.indices[i+4]=j+2;this.indices[i+5]=j+3;}
this.drawing=false;this.currentBatchSize=0;this.currentBaseTexture=null;this.dirty=true;this.textures=[];this.blendModes=[];this.shaders=[];this.sprites=[];this.defaultShader=new PIXI.AbstractFilter(['precision lowp float;','varying vec2 vTextureCoord;','varying vec4 vColor;','uniform sampler2D uSampler;','void main(void) {','   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;','}']);};PIXI.WebGLSpriteBatch.prototype.setContext=function(gl)
{this.gl=gl;this.vertexBuffer=gl.createBuffer();this.indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.indices,gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices,gl.DYNAMIC_DRAW);this.currentBlendMode=99999;var shader=new PIXI.PixiShader(gl);shader.fragmentSrc=this.defaultShader.fragmentSrc;shader.uniforms={};shader.init();this.defaultShader.shaders[gl.id]=shader;};PIXI.WebGLSpriteBatch.prototype.begin=function(renderSession)
{this.renderSession=renderSession;this.shader=this.renderSession.shaderManager.defaultShader;this.start();};PIXI.WebGLSpriteBatch.prototype.end=function()
{this.flush();};PIXI.WebGLSpriteBatch.prototype.render=function(sprite,matrix)
{var texture=sprite.texture;var wt=sprite.worldTransform;if(matrix)
{wt=matrix;}
if(this.currentBatchSize>=this.size)
{this.flush();this.currentBaseTexture=texture.baseTexture;}
var uvs=texture._uvs;if(!uvs)
{return;}
var aX=sprite.anchor.x;var aY=sprite.anchor.y;var w0,w1,h0,h1;if(texture.trim)
{var trim=texture.trim;w1=trim.x-aX*trim.width;w0=w1+texture.crop.width;h1=trim.y-aY*trim.height;h0=h1+texture.crop.height;}
else
{w0=(texture.frame.width)*(1-aX);w1=(texture.frame.width)*-aX;h0=texture.frame.height*(1-aY);h1=texture.frame.height*-aY;}
var i=this.currentBatchSize*4*this.vertSize;var resolution=texture.baseTexture.resolution;var a=wt.a / resolution;var b=wt.b / resolution;var c=wt.c / resolution;var d=wt.d / resolution;var tx=wt.tx;var ty=wt.ty;var colors=this.colors;var positions=this.positions;if(this.renderSession.roundPixels)
{positions[i]=a*w1+c*h1+tx|0;positions[i+1]=d*h1+b*w1+ty|0;positions[i+5]=a*w0+c*h1+tx|0;positions[i+6]=d*h1+b*w0+ty|0;positions[i+10]=a*w0+c*h0+tx|0;positions[i+11]=d*h0+b*w0+ty|0;positions[i+15]=a*w1+c*h0+tx|0;positions[i+16]=d*h0+b*w1+ty|0;}
else
{positions[i]=a*w1+c*h1+tx;positions[i+1]=d*h1+b*w1+ty;positions[i+5]=a*w0+c*h1+tx;positions[i+6]=d*h1+b*w0+ty;positions[i+10]=a*w0+c*h0+tx;positions[i+11]=d*h0+b*w0+ty;positions[i+15]=a*w1+c*h0+tx;positions[i+16]=d*h0+b*w1+ty;}
positions[i+2]=uvs.x0;positions[i+3]=uvs.y0;positions[i+7]=uvs.x1;positions[i+8]=uvs.y1;positions[i+12]=uvs.x2;positions[i+13]=uvs.y2;positions[i+17]=uvs.x3;positions[i+18]=uvs.y3;var tint=sprite.tint;colors[i+4]=colors[i+9]=colors[i+14]=colors[i+19]=(tint>>16)+(tint&0xff00)+((tint&0xff)<<16)+(sprite.worldAlpha*255<<24);this.sprites[this.currentBatchSize++]=sprite;};PIXI.WebGLSpriteBatch.prototype.renderTilingSprite=function(sprite)
{var texture=sprite.tilingTexture;if(this.currentBatchSize>=this.size)
{this.flush();this.currentBaseTexture=texture.baseTexture;}
if(!sprite._uvs)
{sprite._uvs=new PIXI.TextureUvs();}
var uvs=sprite._uvs;var w=texture.baseTexture.width;var h=texture.baseTexture.height;sprite.tilePosition.x%=w*sprite.tileScaleOffset.x;sprite.tilePosition.y%=h*sprite.tileScaleOffset.y;var offsetX=sprite.tilePosition.x /(w*sprite.tileScaleOffset.x);var offsetY=sprite.tilePosition.y /(h*sprite.tileScaleOffset.y);var scaleX=(sprite.width / w)/(sprite.tileScale.x*sprite.tileScaleOffset.x);var scaleY=(sprite.height / h)/(sprite.tileScale.y*sprite.tileScaleOffset.y);uvs.x0=0-offsetX;uvs.y0=0-offsetY;uvs.x1=(1*scaleX)-offsetX;uvs.y1=0-offsetY;uvs.x2=(1*scaleX)-offsetX;uvs.y2=(1*scaleY)-offsetY;uvs.x3=0-offsetX;uvs.y3=(1*scaleY)-offsetY;var tint=sprite.tint;var color=(tint>>16)+(tint&0xff00)+((tint&0xff)<<16)+(sprite.worldAlpha*255<<24);var positions=this.positions;var colors=this.colors;var width=sprite.width;var height=sprite.height;var aX=sprite.anchor.x;var aY=sprite.anchor.y;var w0=width*(1-aX);var w1=width*-aX;var h0=height*(1-aY);var h1=height*-aY;var i=this.currentBatchSize*4*this.vertSize;var resolution=texture.baseTexture.resolution;var wt=sprite.worldTransform;var a=wt.a / resolution;var b=wt.b / resolution;var c=wt.c / resolution;var d=wt.d / resolution;var tx=wt.tx;var ty=wt.ty;positions[i++]=a*w1+c*h1+tx;positions[i++]=d*h1+b*w1+ty;positions[i++]=uvs.x0;positions[i++]=uvs.y0;colors[i++]=color;positions[i++]=(a*w0+c*h1+tx);positions[i++]=d*h1+b*w0+ty;positions[i++]=uvs.x1;positions[i++]=uvs.y1;colors[i++]=color;positions[i++]=a*w0+c*h0+tx;positions[i++]=d*h0+b*w0+ty;positions[i++]=uvs.x2;positions[i++]=uvs.y2;colors[i++]=color;positions[i++]=a*w1+c*h0+tx;positions[i++]=d*h0+b*w1+ty;positions[i++]=uvs.x3;positions[i++]=uvs.y3;colors[i++]=color;this.sprites[this.currentBatchSize++]=sprite;};PIXI.WebGLSpriteBatch.prototype.flush=function()
{if(this.currentBatchSize===0)
{return;}
var gl=this.gl;var shader;if(this.dirty)
{this.dirty=false;gl.activeTexture(gl.TEXTURE0);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);shader=this.defaultShader.shaders[gl.id];var stride=this.vertSize*4;gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,stride,0);gl.vertexAttribPointer(shader.aTextureCoord,2,gl.FLOAT,false,stride,2*4);gl.vertexAttribPointer(shader.colorAttribute,4,gl.UNSIGNED_BYTE,true,stride,4*4);}
if(this.currentBatchSize>(this.size*0.5))
{gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertices);}
else
{var view=this.positions.subarray(0,this.currentBatchSize*4*this.vertSize);gl.bufferSubData(gl.ARRAY_BUFFER,0,view);}
var nextTexture,nextBlendMode,nextShader;var batchSize=0;var start=0;var currentBaseTexture=null;var currentBlendMode=this.renderSession.blendModeManager.currentBlendMode;var currentShader=null;var blendSwap=false;var shaderSwap=false;var sprite;for(var i=0,j=this.currentBatchSize;i<j;i++){sprite=this.sprites[i];if(sprite.tilingTexture)
{nextTexture=sprite.tilingTexture.baseTexture;}
else
{nextTexture=sprite.texture.baseTexture;}
nextBlendMode=sprite.blendMode;nextShader=sprite.shader||this.defaultShader;blendSwap=currentBlendMode!==nextBlendMode;shaderSwap=currentShader!==nextShader;if((currentBaseTexture!==nextTexture&&!nextTexture.skipRender)||blendSwap||shaderSwap)
{this.renderBatch(currentBaseTexture,batchSize,start);start=i;batchSize=0;currentBaseTexture=nextTexture;if(blendSwap)
{currentBlendMode=nextBlendMode;this.renderSession.blendModeManager.setBlendMode(currentBlendMode);}
if(shaderSwap)
{currentShader=nextShader;shader=currentShader.shaders[gl.id];if(!shader)
{shader=new PIXI.PixiShader(gl);shader.fragmentSrc=currentShader.fragmentSrc;shader.uniforms=currentShader.uniforms;shader.init();currentShader.shaders[gl.id]=shader;}
this.renderSession.shaderManager.setShader(shader);if(shader.dirty)
{shader.syncUniforms();}
var projection=this.renderSession.projection;gl.uniform2f(shader.projectionVector,projection.x,projection.y);var offsetVector=this.renderSession.offset;gl.uniform2f(shader.offsetVector,offsetVector.x,offsetVector.y);}}
batchSize++;}
this.renderBatch(currentBaseTexture,batchSize,start);this.currentBatchSize=0;};PIXI.WebGLSpriteBatch.prototype.renderBatch=function(texture,size,startIndex)
{if(size===0)
{return;}
var gl=this.gl;if(texture._dirty[gl.id])
{if(!this.renderSession.renderer.updateTexture(texture))
{return;}}
else
{gl.bindTexture(gl.TEXTURE_2D,texture._glTextures[gl.id]);}
gl.drawElements(gl.TRIANGLES,size*6,gl.UNSIGNED_SHORT,startIndex*6*2);this.renderSession.drawCount++;};PIXI.WebGLSpriteBatch.prototype.stop=function()
{this.flush();this.dirty=true;};PIXI.WebGLSpriteBatch.prototype.start=function()
{this.dirty=true;};PIXI.WebGLSpriteBatch.prototype.destroy=function()
{this.vertices=null;this.indices=null;this.gl.deleteBuffer(this.vertexBuffer);this.gl.deleteBuffer(this.indexBuffer);this.currentBaseTexture=null;this.gl=null;};PIXI.WebGLFastSpriteBatch=function(gl)
{this.vertSize=10;this.maxSize=6000;this.size=this.maxSize;var numVerts=this.size*4*this.vertSize;var numIndices=this.maxSize*6;this.vertices=new PIXI.Float32Array(numVerts);this.indices=new PIXI.Uint16Array(numIndices);this.vertexBuffer=null;this.indexBuffer=null;this.lastIndexCount=0;for(var i=0,j=0;i<numIndices;i+=6,j+=4)
{this.indices[i+0]=j+0;this.indices[i+1]=j+1;this.indices[i+2]=j+2;this.indices[i+3]=j+0;this.indices[i+4]=j+2;this.indices[i+5]=j+3;}
this.drawing=false;this.currentBatchSize=0;this.currentBaseTexture=null;this.currentBlendMode=0;this.renderSession=null;this.shader=null;this.matrix=null;this.setContext(gl);};PIXI.WebGLFastSpriteBatch.prototype.constructor=PIXI.WebGLFastSpriteBatch;PIXI.WebGLFastSpriteBatch.prototype.setContext=function(gl)
{this.gl=gl;this.vertexBuffer=gl.createBuffer();this.indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.indices,gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices,gl.DYNAMIC_DRAW);};PIXI.WebGLFastSpriteBatch.prototype.begin=function(spriteBatch,renderSession)
{this.renderSession=renderSession;this.shader=this.renderSession.shaderManager.fastShader;this.matrix=spriteBatch.worldTransform.toArray(true);this.start();};PIXI.WebGLFastSpriteBatch.prototype.end=function()
{this.flush();};PIXI.WebGLFastSpriteBatch.prototype.render=function(spriteBatch)
{var children=spriteBatch.children;var sprite=children[0];if(!sprite.texture._uvs)return;this.currentBaseTexture=sprite.texture.baseTexture;if(sprite.blendMode!==this.renderSession.blendModeManager.currentBlendMode)
{this.flush();this.renderSession.blendModeManager.setBlendMode(sprite.blendMode);}
for(var i=0,j=children.length;i<j;i++)
{this.renderSprite(children[i]);}
this.flush();};PIXI.WebGLFastSpriteBatch.prototype.renderSprite=function(sprite)
{if(!sprite.visible)return;if(sprite.texture.baseTexture!==this.currentBaseTexture&&!sprite.texture.baseTexture.skipRender)
{this.flush();this.currentBaseTexture=sprite.texture.baseTexture;if(!sprite.texture._uvs)return;}
var uvs,vertices=this.vertices,width,height,w0,w1,h0,h1,index;uvs=sprite.texture._uvs;width=sprite.texture.frame.width;height=sprite.texture.frame.height;if(sprite.texture.trim)
{var trim=sprite.texture.trim;w1=trim.x-sprite.anchor.x*trim.width;w0=w1+sprite.texture.crop.width;h1=trim.y-sprite.anchor.y*trim.height;h0=h1+sprite.texture.crop.height;}
else
{w0=(sprite.texture.frame.width)*(1-sprite.anchor.x);w1=(sprite.texture.frame.width)*-sprite.anchor.x;h0=sprite.texture.frame.height*(1-sprite.anchor.y);h1=sprite.texture.frame.height*-sprite.anchor.y;}
index=this.currentBatchSize*4*this.vertSize;vertices[index++]=w1;vertices[index++]=h1;vertices[index++]=sprite.position.x;vertices[index++]=sprite.position.y;vertices[index++]=sprite.scale.x;vertices[index++]=sprite.scale.y;vertices[index++]=sprite.rotation;vertices[index++]=uvs.x0;vertices[index++]=uvs.y1;vertices[index++]=sprite.alpha;vertices[index++]=w0;vertices[index++]=h1;vertices[index++]=sprite.position.x;vertices[index++]=sprite.position.y;vertices[index++]=sprite.scale.x;vertices[index++]=sprite.scale.y;vertices[index++]=sprite.rotation;vertices[index++]=uvs.x1;vertices[index++]=uvs.y1;vertices[index++]=sprite.alpha;vertices[index++]=w0;vertices[index++]=h0;vertices[index++]=sprite.position.x;vertices[index++]=sprite.position.y;vertices[index++]=sprite.scale.x;vertices[index++]=sprite.scale.y;vertices[index++]=sprite.rotation;vertices[index++]=uvs.x2;vertices[index++]=uvs.y2;vertices[index++]=sprite.alpha;vertices[index++]=w1;vertices[index++]=h0;vertices[index++]=sprite.position.x;vertices[index++]=sprite.position.y;vertices[index++]=sprite.scale.x;vertices[index++]=sprite.scale.y;vertices[index++]=sprite.rotation;vertices[index++]=uvs.x3;vertices[index++]=uvs.y3;vertices[index++]=sprite.alpha;this.currentBatchSize++;if(this.currentBatchSize>=this.size)
{this.flush();}};PIXI.WebGLFastSpriteBatch.prototype.flush=function()
{if(this.currentBatchSize===0)return;var gl=this.gl;if(!this.currentBaseTexture._glTextures[gl.id])this.renderSession.renderer.updateTexture(this.currentBaseTexture,gl);gl.bindTexture(gl.TEXTURE_2D,this.currentBaseTexture._glTextures[gl.id]);if(this.currentBatchSize>(this.size*0.5))
{gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertices);}
else
{var view=this.vertices.subarray(0,this.currentBatchSize*4*this.vertSize);gl.bufferSubData(gl.ARRAY_BUFFER,0,view);}
gl.drawElements(gl.TRIANGLES,this.currentBatchSize*6,gl.UNSIGNED_SHORT,0);this.currentBatchSize=0;this.renderSession.drawCount++;};PIXI.WebGLFastSpriteBatch.prototype.stop=function()
{this.flush();};PIXI.WebGLFastSpriteBatch.prototype.start=function()
{var gl=this.gl;gl.activeTexture(gl.TEXTURE0);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);var projection=this.renderSession.projection;gl.uniform2f(this.shader.projectionVector,projection.x,projection.y);gl.uniformMatrix3fv(this.shader.uMatrix,false,this.matrix);var stride=this.vertSize*4;gl.vertexAttribPointer(this.shader.aVertexPosition,2,gl.FLOAT,false,stride,0);gl.vertexAttribPointer(this.shader.aPositionCoord,2,gl.FLOAT,false,stride,2*4);gl.vertexAttribPointer(this.shader.aScale,2,gl.FLOAT,false,stride,4*4);gl.vertexAttribPointer(this.shader.aRotation,1,gl.FLOAT,false,stride,6*4);gl.vertexAttribPointer(this.shader.aTextureCoord,2,gl.FLOAT,false,stride,7*4);gl.vertexAttribPointer(this.shader.colorAttribute,1,gl.FLOAT,false,stride,9*4);};PIXI.WebGLFilterManager=function()
{this.filterStack=[];this.offsetX=0;this.offsetY=0;};PIXI.WebGLFilterManager.prototype.constructor=PIXI.WebGLFilterManager;PIXI.WebGLFilterManager.prototype.setContext=function(gl)
{this.gl=gl;this.texturePool=[];this.initShaderBuffers();};PIXI.WebGLFilterManager.prototype.begin=function(renderSession,buffer)
{this.renderSession=renderSession;this.defaultShader=renderSession.shaderManager.defaultShader;var projection=this.renderSession.projection;this.width=projection.x*2;this.height=-projection.y*2;this.buffer=buffer;};PIXI.WebGLFilterManager.prototype.pushFilter=function(filterBlock)
{var gl=this.gl;var projection=this.renderSession.projection;var offset=this.renderSession.offset;filterBlock._filterArea=filterBlock.target.filterArea||filterBlock.target.getBounds();this.filterStack.push(filterBlock);var filter=filterBlock.filterPasses[0];this.offsetX+=filterBlock._filterArea.x;this.offsetY+=filterBlock._filterArea.y;var texture=this.texturePool.pop();if(!texture)
{texture=new PIXI.FilterTexture(this.gl,this.width,this.height);}
else
{texture.resize(this.width,this.height);}
gl.bindTexture(gl.TEXTURE_2D,texture.texture);var filterArea=filterBlock._filterArea;var padding=filter.padding;filterArea.x-=padding;filterArea.y-=padding;filterArea.width+=padding*2;filterArea.height+=padding*2;if(filterArea.x<0)filterArea.x=0;if(filterArea.width>this.width)filterArea.width=this.width;if(filterArea.y<0)filterArea.y=0;if(filterArea.height>this.height)filterArea.height=this.height;gl.bindFramebuffer(gl.FRAMEBUFFER,texture.frameBuffer);gl.viewport(0,0,filterArea.width,filterArea.height);projection.x=filterArea.width/2;projection.y=-filterArea.height/2;offset.x=-filterArea.x;offset.y=-filterArea.y;gl.colorMask(true,true,true,true);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);filterBlock._glFilterTexture=texture;};PIXI.WebGLFilterManager.prototype.popFilter=function()
{var gl=this.gl;var filterBlock=this.filterStack.pop();var filterArea=filterBlock._filterArea;var texture=filterBlock._glFilterTexture;var projection=this.renderSession.projection;var offset=this.renderSession.offset;if(filterBlock.filterPasses.length>1)
{gl.viewport(0,0,filterArea.width,filterArea.height);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);this.vertexArray[0]=0;this.vertexArray[1]=filterArea.height;this.vertexArray[2]=filterArea.width;this.vertexArray[3]=filterArea.height;this.vertexArray[4]=0;this.vertexArray[5]=0;this.vertexArray[6]=filterArea.width;this.vertexArray[7]=0;gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertexArray);gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);this.uvArray[2]=filterArea.width/this.width;this.uvArray[5]=filterArea.height/this.height;this.uvArray[6]=filterArea.width/this.width;this.uvArray[7]=filterArea.height/this.height;gl.bufferSubData(gl.ARRAY_BUFFER,0,this.uvArray);var inputTexture=texture;var outputTexture=this.texturePool.pop();if(!outputTexture)outputTexture=new PIXI.FilterTexture(this.gl,this.width,this.height);outputTexture.resize(this.width,this.height);gl.bindFramebuffer(gl.FRAMEBUFFER,outputTexture.frameBuffer);gl.clear(gl.COLOR_BUFFER_BIT);gl.disable(gl.BLEND);for(var i=0;i<filterBlock.filterPasses.length-1;i++)
{var filterPass=filterBlock.filterPasses[i];gl.bindFramebuffer(gl.FRAMEBUFFER,outputTexture.frameBuffer);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,inputTexture.texture);this.applyFilterPass(filterPass,filterArea,filterArea.width,filterArea.height);var temp=inputTexture;inputTexture=outputTexture;outputTexture=temp;}
gl.enable(gl.BLEND);texture=inputTexture;this.texturePool.push(outputTexture);}
var filter=filterBlock.filterPasses[filterBlock.filterPasses.length-1];this.offsetX-=filterArea.x;this.offsetY-=filterArea.y;var sizeX=this.width;var sizeY=this.height;var offsetX=0;var offsetY=0;var buffer=this.buffer;if(this.filterStack.length===0)
{gl.colorMask(true,true,true,true);}
else
{var currentFilter=this.filterStack[this.filterStack.length-1];filterArea=currentFilter._filterArea;sizeX=filterArea.width;sizeY=filterArea.height;offsetX=filterArea.x;offsetY=filterArea.y;buffer=currentFilter._glFilterTexture.frameBuffer;}
projection.x=sizeX/2;projection.y=-sizeY/2;offset.x=offsetX;offset.y=offsetY;filterArea=filterBlock._filterArea;var x=filterArea.x-offsetX;var y=filterArea.y-offsetY;gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);this.vertexArray[0]=x;this.vertexArray[1]=y+filterArea.height;this.vertexArray[2]=x+filterArea.width;this.vertexArray[3]=y+filterArea.height;this.vertexArray[4]=x;this.vertexArray[5]=y;this.vertexArray[6]=x+filterArea.width;this.vertexArray[7]=y;gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertexArray);gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);this.uvArray[2]=filterArea.width/this.width;this.uvArray[5]=filterArea.height/this.height;this.uvArray[6]=filterArea.width/this.width;this.uvArray[7]=filterArea.height/this.height;gl.bufferSubData(gl.ARRAY_BUFFER,0,this.uvArray);gl.viewport(0,0,sizeX*this.renderSession.resolution,sizeY*this.renderSession.resolution);gl.bindFramebuffer(gl.FRAMEBUFFER,buffer);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture.texture);this.applyFilterPass(filter,filterArea,sizeX,sizeY);this.texturePool.push(texture);filterBlock._glFilterTexture=null;};PIXI.WebGLFilterManager.prototype.applyFilterPass=function(filter,filterArea,width,height)
{var gl=this.gl;var shader=filter.shaders[gl.id];if(!shader)
{shader=new PIXI.PixiShader(gl);shader.fragmentSrc=filter.fragmentSrc;shader.uniforms=filter.uniforms;shader.init();filter.shaders[gl.id]=shader;}
this.renderSession.shaderManager.setShader(shader);gl.uniform2f(shader.projectionVector,width/2,-height/2);gl.uniform2f(shader.offsetVector,0,0);if(filter.uniforms.dimensions)
{filter.uniforms.dimensions.value[0]=this.width;filter.uniforms.dimensions.value[1]=this.height;filter.uniforms.dimensions.value[2]=this.vertexArray[0];filter.uniforms.dimensions.value[3]=this.vertexArray[5];}
shader.syncUniforms();gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);gl.vertexAttribPointer(shader.aTextureCoord,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);gl.vertexAttribPointer(shader.colorAttribute,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);this.renderSession.drawCount++;};PIXI.WebGLFilterManager.prototype.initShaderBuffers=function()
{var gl=this.gl;this.vertexBuffer=gl.createBuffer();this.uvBuffer=gl.createBuffer();this.colorBuffer=gl.createBuffer();this.indexBuffer=gl.createBuffer();this.vertexArray=new PIXI.Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);gl.bindBuffer(gl.ARRAY_BUFFER,this.vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertexArray,gl.STATIC_DRAW);this.uvArray=new PIXI.Float32Array([0.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0]);gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.uvArray,gl.STATIC_DRAW);this.colorArray=new PIXI.Float32Array([1.0,0xFFFFFF,1.0,0xFFFFFF,1.0,0xFFFFFF,1.0,0xFFFFFF]);gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.colorArray,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,3,2]),gl.STATIC_DRAW);};PIXI.WebGLFilterManager.prototype.destroy=function()
{var gl=this.gl;this.filterStack=null;this.offsetX=0;this.offsetY=0;for(var i=0;i<this.texturePool.length;i++){this.texturePool[i].destroy();}
this.texturePool=null;gl.deleteBuffer(this.vertexBuffer);gl.deleteBuffer(this.uvBuffer);gl.deleteBuffer(this.colorBuffer);gl.deleteBuffer(this.indexBuffer);};PIXI.FilterTexture=function(gl,width,height,scaleMode)
{this.gl=gl;this.frameBuffer=gl.createFramebuffer();this.texture=gl.createTexture();scaleMode=scaleMode||PIXI.scaleModes.DEFAULT;gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,scaleMode===PIXI.scaleModes.LINEAR?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,scaleMode===PIXI.scaleModes.LINEAR?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.bindFramebuffer(gl.FRAMEBUFFER,this.frameBuffer);gl.bindFramebuffer(gl.FRAMEBUFFER,this.frameBuffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.texture,0);this.renderBuffer=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,this.renderBuffer);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,this.renderBuffer);this.resize(width,height);};PIXI.FilterTexture.prototype.constructor=PIXI.FilterTexture;PIXI.FilterTexture.prototype.clear=function()
{var gl=this.gl;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);};PIXI.FilterTexture.prototype.resize=function(width,height)
{if(this.width===width&&this.height===height)return;this.width=width;this.height=height;var gl=this.gl;gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindRenderbuffer(gl.RENDERBUFFER,this.renderBuffer);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_STENCIL,width,height);};PIXI.FilterTexture.prototype.destroy=function()
{var gl=this.gl;gl.deleteFramebuffer(this.frameBuffer);gl.deleteTexture(this.texture);this.frameBuffer=null;this.texture=null;};PIXI.CanvasBuffer=function(width,height)
{this.width=width;this.height=height;this.canvas=PIXI.CanvasPool.create(this,this.width,this.height);this.context=this.canvas.getContext("2d");this.canvas.width=width;this.canvas.height=height;};PIXI.CanvasBuffer.prototype.constructor=PIXI.CanvasBuffer;PIXI.CanvasBuffer.prototype.clear=function()
{this.context.setTransform(1,0,0,1,0,0);this.context.clearRect(0,0,this.width,this.height);};PIXI.CanvasBuffer.prototype.resize=function(width,height)
{this.width=this.canvas.width=width;this.height=this.canvas.height=height;};PIXI.CanvasBuffer.prototype.destroy=function()
{PIXI.CanvasPool.remove(this);};PIXI.CanvasMaskManager=function()
{};PIXI.CanvasMaskManager.prototype.constructor=PIXI.CanvasMaskManager;PIXI.CanvasMaskManager.prototype.pushMask=function(maskData,renderSession){var context=renderSession.context;context.save();var cacheAlpha=maskData.alpha;var transform=maskData.worldTransform;var resolution=renderSession.resolution;context.setTransform(transform.a*resolution,transform.b*resolution,transform.c*resolution,transform.d*resolution,transform.tx*resolution,transform.ty*resolution);PIXI.CanvasGraphics.renderGraphicsMask(maskData,context);context.clip();maskData.worldAlpha=cacheAlpha;};PIXI.CanvasMaskManager.prototype.popMask=function(renderSession)
{renderSession.context.restore();};PIXI.CanvasTinter=function(){};PIXI.CanvasTinter.getTintedTexture=function(sprite,color)
{var canvas=sprite.tintedTexture||PIXI.CanvasPool.create(this);PIXI.CanvasTinter.tintMethod(sprite.texture,color,canvas);return canvas;};PIXI.CanvasTinter.tintWithMultiply=function(texture,color,canvas)
{var context=canvas.getContext("2d");var crop=texture.crop;if(canvas.width!==crop.width||canvas.height!==crop.height)
{canvas.width=crop.width;canvas.height=crop.height;}
context.clearRect(0,0,crop.width,crop.height);context.fillStyle="#"+("00000"+(color|0).toString(16)).substr(-6);context.fillRect(0,0,crop.width,crop.height);context.globalCompositeOperation="multiply";context.drawImage(texture.baseTexture.source,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);context.globalCompositeOperation="destination-atop";context.drawImage(texture.baseTexture.source,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);};PIXI.CanvasTinter.tintWithPerPixel=function(texture,color,canvas)
{var context=canvas.getContext("2d");var crop=texture.crop;canvas.width=crop.width;canvas.height=crop.height;context.globalCompositeOperation="copy";context.drawImage(texture.baseTexture.source,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);var rgbValues=PIXI.hex2rgb(color);var r=rgbValues[0],g=rgbValues[1],b=rgbValues[2];var pixelData=context.getImageData(0,0,crop.width,crop.height);var pixels=pixelData.data;for(var i=0;i<pixels.length;i+=4)
{pixels[i+0]*=r;pixels[i+1]*=g;pixels[i+2]*=b;if(!PIXI.CanvasTinter.canHandleAlpha)
{var alpha=pixels[i+3];pixels[i+0]/=255 / alpha;pixels[i+1]/=255 / alpha;pixels[i+2]/=255 / alpha;}}
context.putImageData(pixelData,0,0);};PIXI.CanvasTinter.checkInverseAlpha=function()
{var canvas=new PIXI.CanvasBuffer(2,1);canvas.context.fillStyle="rgba(10, 20, 30, 0.5)";canvas.context.fillRect(0,0,1,1);var s1=canvas.context.getImageData(0,0,1,1);if(s1===null)
{return false;}
canvas.context.putImageData(s1,1,0);var s2=canvas.context.getImageData(1,0,1,1);return(s2.data[0]===s1.data[0]&&s2.data[1]===s1.data[1]&&s2.data[2]===s1.data[2]&&s2.data[3]===s1.data[3]);};PIXI.CanvasTinter.canHandleAlpha=PIXI.CanvasTinter.checkInverseAlpha();PIXI.CanvasTinter.canUseMultiply=PIXI.canUseNewCanvasBlendModes();PIXI.CanvasTinter.tintMethod=PIXI.CanvasTinter.canUseMultiply?PIXI.CanvasTinter.tintWithMultiply:PIXI.CanvasTinter.tintWithPerPixel;PIXI.CanvasRenderer=function(game){this.game=game;if(!PIXI.defaultRenderer)
{PIXI.defaultRenderer=this;}
this.type=PIXI.CANVAS_RENDERER;this.resolution=game.resolution;this.clearBeforeRender=game.clearBeforeRender;this.transparent=game.transparent;this.autoResize=false;this.width=game.width*this.resolution;this.height=game.height*this.resolution;this.view=game.canvas;this.context=this.view.getContext("2d",{alpha:this.transparent});this.refresh=true;this.count=0;this.maskManager=new PIXI.CanvasMaskManager();this.renderSession={context:this.context,maskManager:this.maskManager,scaleMode:null,smoothProperty:Phaser.Canvas.getSmoothingPrefix(this.context),roundPixels:false};this.mapBlendModes();this.resize(this.width,this.height);};PIXI.CanvasRenderer.prototype.constructor=PIXI.CanvasRenderer;PIXI.CanvasRenderer.prototype.render=function(stage){stage.updateTransform();this.context.setTransform(1,0,0,1,0,0);this.context.globalAlpha=1;this.renderSession.currentBlendMode=0;this.context.globalCompositeOperation='source-over';if(navigator.isCocoonJS&&this.view.screencanvas)
{this.context.fillStyle="black";this.context.clear();}
if(this.clearBeforeRender)
{if(this.transparent)
{this.context.clearRect(0,0,this.width,this.height);}
else
{this.context.fillStyle=stage._bgColor.rgba;this.context.fillRect(0,0,this.width,this.height);}}
this.renderDisplayObject(stage);};PIXI.CanvasRenderer.prototype.destroy=function(removeView)
{if(removeView===undefined){removeView=true;}
if(removeView&&this.view.parent)
{this.view.parent.removeChild(this.view);}
this.view=null;this.context=null;this.maskManager=null;this.renderSession=null;};PIXI.CanvasRenderer.prototype.resize=function(width,height)
{this.width=width*this.resolution;this.height=height*this.resolution;this.view.width=this.width;this.view.height=this.height;if(this.autoResize)
{this.view.style.width=this.width / this.resolution+"px";this.view.style.height=this.height / this.resolution+"px";}};PIXI.CanvasRenderer.prototype.renderDisplayObject=function(displayObject,context,matrix){this.renderSession.context=context||this.context;this.renderSession.resolution=this.resolution;displayObject._renderCanvas(this.renderSession,matrix);};PIXI.CanvasRenderer.prototype.mapBlendModes=function(){if(!PIXI.blendModesCanvas)
{var b=[];var modes=PIXI.blendModes;var useNew=PIXI.canUseNewCanvasBlendModes();b[modes.NORMAL]='source-over';b[modes.ADD]='lighter';b[modes.MULTIPLY]=(useNew)?'multiply':'source-over';b[modes.SCREEN]=(useNew)?'screen':'source-over';b[modes.OVERLAY]=(useNew)?'overlay':'source-over';b[modes.DARKEN]=(useNew)?'darken':'source-over';b[modes.LIGHTEN]=(useNew)?'lighten':'source-over';b[modes.COLOR_DODGE]=(useNew)?'color-dodge':'source-over';b[modes.COLOR_BURN]=(useNew)?'color-burn':'source-over';b[modes.HARD_LIGHT]=(useNew)?'hard-light':'source-over';b[modes.SOFT_LIGHT]=(useNew)?'soft-light':'source-over';b[modes.DIFFERENCE]=(useNew)?'difference':'source-over';b[modes.EXCLUSION]=(useNew)?'exclusion':'source-over';b[modes.HUE]=(useNew)?'hue':'source-over';b[modes.SATURATION]=(useNew)?'saturation':'source-over';b[modes.COLOR]=(useNew)?'color':'source-over';b[modes.LUMINOSITY]=(useNew)?'luminosity':'source-over';PIXI.blendModesCanvas=b;}};PIXI.BaseTextureCache={};PIXI.BaseTextureCacheIdGenerator=0;PIXI.BaseTexture=function(source,scaleMode)
{this.resolution=1;this.width=100;this.height=100;this.scaleMode=scaleMode||PIXI.scaleModes.DEFAULT;this.hasLoaded=false;this.source=source;this._UID=PIXI._UID++;this.premultipliedAlpha=true;this._glTextures=[];this.mipmap=false;this._dirty=[true,true,true,true];if(!source)
{return;}
if((this.source.complete||this.source.getContext)&&this.source.width&&this.source.height)
{this.hasLoaded=true;this.width=this.source.naturalWidth||this.source.width;this.height=this.source.naturalHeight||this.source.height;this.dirty();}
this.skipRender=false;this.imageUrl=null;this._powerOf2=false;};PIXI.BaseTexture.prototype.constructor=PIXI.BaseTexture;PIXI.BaseTexture.prototype.forceLoaded=function(width,height)
{this.hasLoaded=true;this.width=width;this.height=height;this.dirty();};PIXI.BaseTexture.prototype.destroy=function()
{if(this.imageUrl)
{delete PIXI.BaseTextureCache[this.imageUrl];delete PIXI.TextureCache[this.imageUrl];this.imageUrl=null;if(!navigator.isCocoonJS)this.source.src='';}
else if(this.source&&this.source._pixiId)
{PIXI.CanvasPool.removeByCanvas(this.source);delete PIXI.BaseTextureCache[this.source._pixiId];}
this.source=null;this.unloadFromGPU();};PIXI.BaseTexture.prototype.updateSourceImage=function(newSrc)
{this.hasLoaded=false;this.source.src=null;this.source.src=newSrc;};PIXI.BaseTexture.prototype.dirty=function()
{for(var i=0;i<this._glTextures.length;i++)
{this._dirty[i]=true;}};PIXI.BaseTexture.prototype.unloadFromGPU=function()
{this.dirty();for(var i=this._glTextures.length-1;i>=0;i--)
{var glTexture=this._glTextures[i];var gl=PIXI.glContexts[i];if(gl&&glTexture)
{gl.deleteTexture(glTexture);}}
this._glTextures.length=0;this.dirty();};PIXI.BaseTexture.fromImage=function(imageUrl,crossorigin,scaleMode)
{var baseTexture=PIXI.BaseTextureCache[imageUrl];if(crossorigin===undefined&&imageUrl.indexOf('data:')===-1)crossorigin=true;if(!baseTexture)
{var image=new Image();if(crossorigin)
{image.crossOrigin='';}
image.src=imageUrl;baseTexture=new PIXI.BaseTexture(image,scaleMode);baseTexture.imageUrl=imageUrl;PIXI.BaseTextureCache[imageUrl]=baseTexture;if(imageUrl.indexOf(PIXI.RETINA_PREFIX+'.')!==-1)
{baseTexture.resolution=2;}}
return baseTexture;};PIXI.BaseTexture.fromCanvas=function(canvas,scaleMode)
{if(!canvas._pixiId)
{canvas._pixiId='canvas_'+PIXI.TextureCacheIdGenerator++;}
if(canvas.width===0)
{canvas.width=1;}
if(canvas.height===0)
{canvas.height=1;}
var baseTexture=PIXI.BaseTextureCache[canvas._pixiId];if(!baseTexture)
{baseTexture=new PIXI.BaseTexture(canvas,scaleMode);PIXI.BaseTextureCache[canvas._pixiId]=baseTexture;}
return baseTexture;};PIXI.TextureCache={};PIXI.FrameCache={};PIXI.TextureSilentFail=false;PIXI.TextureCacheIdGenerator=0;PIXI.Texture=function(baseTexture,frame,crop,trim)
{this.noFrame=false;if(!frame)
{this.noFrame=true;frame=new PIXI.Rectangle(0,0,1,1);}
if(baseTexture instanceof PIXI.Texture)
{baseTexture=baseTexture.baseTexture;}
this.baseTexture=baseTexture;this.frame=frame;this.trim=trim;this.valid=false;this.isTiling=false;this.requiresUpdate=false;this.requiresReTint=false;this._uvs=null;this.width=0;this.height=0;this.crop=crop||new PIXI.Rectangle(0,0,1,1);if(baseTexture.hasLoaded)
{if(this.noFrame)frame=new PIXI.Rectangle(0,0,baseTexture.width,baseTexture.height);this.setFrame(frame);}};PIXI.Texture.prototype.constructor=PIXI.Texture;PIXI.Texture.prototype.onBaseTextureLoaded=function()
{var baseTexture=this.baseTexture;if(this.noFrame)
{this.frame=new PIXI.Rectangle(0,0,baseTexture.width,baseTexture.height);}
this.setFrame(this.frame);};PIXI.Texture.prototype.destroy=function(destroyBase)
{if(destroyBase)this.baseTexture.destroy();this.valid=false;};PIXI.Texture.prototype.setFrame=function(frame)
{this.noFrame=false;this.frame=frame;this.width=frame.width;this.height=frame.height;this.crop.x=frame.x;this.crop.y=frame.y;this.crop.width=frame.width;this.crop.height=frame.height;if(!this.trim&&(frame.x+frame.width>this.baseTexture.width||frame.y+frame.height>this.baseTexture.height))
{if(!PIXI.TextureSilentFail)
{throw new Error('Texture Error: frame does not fit inside the base Texture dimensions '+this);}
this.valid=false;return;}
this.valid=frame&&frame.width&&frame.height&&this.baseTexture.source&&this.baseTexture.hasLoaded;if(this.trim)
{this.width=this.trim.width;this.height=this.trim.height;this.frame.width=this.trim.width;this.frame.height=this.trim.height;}
if(this.valid)this._updateUvs();};PIXI.Texture.prototype._updateUvs=function()
{if(!this._uvs)this._uvs=new PIXI.TextureUvs();var frame=this.crop;var tw=this.baseTexture.width;var th=this.baseTexture.height;this._uvs.x0=frame.x / tw;this._uvs.y0=frame.y / th;this._uvs.x1=(frame.x+frame.width)/ tw;this._uvs.y1=frame.y / th;this._uvs.x2=(frame.x+frame.width)/ tw;this._uvs.y2=(frame.y+frame.height)/ th;this._uvs.x3=frame.x / tw;this._uvs.y3=(frame.y+frame.height)/ th;};PIXI.Texture.fromImage=function(imageUrl,crossorigin,scaleMode)
{var texture=PIXI.TextureCache[imageUrl];if(!texture)
{texture=new PIXI.Texture(PIXI.BaseTexture.fromImage(imageUrl,crossorigin,scaleMode));PIXI.TextureCache[imageUrl]=texture;}
return texture;};PIXI.Texture.fromFrame=function(frameId)
{var texture=PIXI.TextureCache[frameId];if(!texture)throw new Error('The frameId "'+frameId+'" does not exist in the texture cache ');return texture;};PIXI.Texture.fromCanvas=function(canvas,scaleMode)
{var baseTexture=PIXI.BaseTexture.fromCanvas(canvas,scaleMode);return new PIXI.Texture(baseTexture);};PIXI.Texture.addTextureToCache=function(texture,id)
{PIXI.TextureCache[id]=texture;};PIXI.Texture.removeTextureFromCache=function(id)
{var texture=PIXI.TextureCache[id];delete PIXI.TextureCache[id];delete PIXI.BaseTextureCache[id];return texture;};PIXI.TextureUvs=function()
{this.x0=0;this.y0=0;this.x1=0;this.y1=0;this.x2=0;this.y2=0;this.x3=0;this.y3=0;};PIXI.RenderTexture=function(width,height,renderer,scaleMode,resolution)
{this.width=width||100;this.height=height||100;this.resolution=resolution||1;this.frame=new PIXI.Rectangle(0,0,this.width*this.resolution,this.height*this.resolution);this.crop=new PIXI.Rectangle(0,0,this.width*this.resolution,this.height*this.resolution);this.baseTexture=new PIXI.BaseTexture();this.baseTexture.width=this.width*this.resolution;this.baseTexture.height=this.height*this.resolution;this.baseTexture._glTextures=[];this.baseTexture.resolution=this.resolution;this.baseTexture.scaleMode=scaleMode||PIXI.scaleModes.DEFAULT;this.baseTexture.hasLoaded=true;PIXI.Texture.call(this,this.baseTexture,new PIXI.Rectangle(0,0,this.width*this.resolution,this.height*this.resolution));this.renderer=renderer||PIXI.defaultRenderer;if(this.renderer.type===PIXI.WEBGL_RENDERER)
{var gl=this.renderer.gl;this.baseTexture._dirty[gl.id]=false;this.textureBuffer=new PIXI.FilterTexture(gl,this.width,this.height,this.baseTexture.scaleMode);this.baseTexture._glTextures[gl.id]=this.textureBuffer.texture;this.render=this.renderWebGL;this.projection=new PIXI.Point(this.width*0.5,-this.height*0.5);}
else
{this.render=this.renderCanvas;this.textureBuffer=new PIXI.CanvasBuffer(this.width*this.resolution,this.height*this.resolution);this.baseTexture.source=this.textureBuffer.canvas;}
this.valid=true;this.tempMatrix=new Phaser.Matrix();this._updateUvs();};PIXI.RenderTexture.prototype=Object.create(PIXI.Texture.prototype);PIXI.RenderTexture.prototype.constructor=PIXI.RenderTexture;PIXI.RenderTexture.prototype.resize=function(width,height,updateBase)
{if(width===this.width&&height===this.height)return;this.valid=(width>0&&height>0);this.width=width;this.height=height;this.frame.width=this.crop.width=width*this.resolution;this.frame.height=this.crop.height=height*this.resolution;if(updateBase)
{this.baseTexture.width=this.width*this.resolution;this.baseTexture.height=this.height*this.resolution;}
if(this.renderer.type===PIXI.WEBGL_RENDERER)
{this.projection.x=this.width / 2;this.projection.y=-this.height / 2;}
if(!this.valid)return;this.textureBuffer.resize(this.width,this.height);};PIXI.RenderTexture.prototype.clear=function()
{if(!this.valid)
{return;}
if(this.renderer.type===PIXI.WEBGL_RENDERER)
{this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER,this.textureBuffer.frameBuffer);}
this.textureBuffer.clear();};PIXI.RenderTexture.prototype.renderWebGL=function(displayObject,matrix,clear)
{if(!this.valid||displayObject.alpha===0)
{return;}
var wt=displayObject.worldTransform;wt.identity();wt.translate(0,this.projection.y*2);if(matrix)
{wt.append(matrix);}
wt.scale(1,-1);for(var i=0;i<displayObject.children.length;i++)
{displayObject.children[i].updateTransform();}
var gl=this.renderer.gl;gl.viewport(0,0,this.width*this.resolution,this.height*this.resolution);gl.bindFramebuffer(gl.FRAMEBUFFER,this.textureBuffer.frameBuffer);if(clear)
{this.textureBuffer.clear();}
this.renderer.spriteBatch.dirty=true;this.renderer.renderDisplayObject(displayObject,this.projection,this.textureBuffer.frameBuffer,matrix);this.renderer.spriteBatch.dirty=true;};PIXI.RenderTexture.prototype.renderCanvas=function(displayObject,matrix,clear)
{if(!this.valid||displayObject.alpha===0)
{return;}
var wt=displayObject.worldTransform;wt.identity();if(matrix)
{wt.append(matrix);}
for(var i=0;i<displayObject.children.length;i++)
{displayObject.children[i].updateTransform();}
if(clear)
{this.textureBuffer.clear();}
var realResolution=this.renderer.resolution;this.renderer.resolution=this.resolution;this.renderer.renderDisplayObject(displayObject,this.textureBuffer.context,matrix);this.renderer.resolution=realResolution;};PIXI.RenderTexture.prototype.getImage=function()
{var image=new Image();image.src=this.getBase64();return image;};PIXI.RenderTexture.prototype.getBase64=function()
{return this.getCanvas().toDataURL();};PIXI.RenderTexture.prototype.getCanvas=function()
{if(this.renderer.type===PIXI.WEBGL_RENDERER)
{var gl=this.renderer.gl;var width=this.textureBuffer.width;var height=this.textureBuffer.height;var webGLPixels=new Uint8Array(4*width*height);gl.bindFramebuffer(gl.FRAMEBUFFER,this.textureBuffer.frameBuffer);gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,webGLPixels);gl.bindFramebuffer(gl.FRAMEBUFFER,null);var tempCanvas=new PIXI.CanvasBuffer(width,height);var canvasData=tempCanvas.context.getImageData(0,0,width,height);canvasData.data.set(webGLPixels);tempCanvas.context.putImageData(canvasData,0,0);return tempCanvas.canvas;}
else
{return this.textureBuffer.canvas;}};PIXI.AbstractFilter=function(fragmentSrc,uniforms)
{this.passes=[this];this.shaders=[];this.dirty=true;this.padding=0;this.uniforms=uniforms||{};this.fragmentSrc=fragmentSrc||[];};PIXI.AbstractFilter.prototype.constructor=PIXI.AbstractFilter;PIXI.AbstractFilter.prototype.syncUniforms=function()
{for(var i=0,j=this.shaders.length;i<j;i++)
{this.shaders[i].dirty=true;}};PIXI.Strip=function(texture)
{PIXI.DisplayObjectContainer.call(this);this.texture=texture;this.uvs=new PIXI.Float32Array([0,1,1,1,1,0,0,1]);this.vertices=new PIXI.Float32Array([0,0,100,0,100,100,0,100]);this.colors=new PIXI.Float32Array([1,1,1,1]);this.indices=new PIXI.Uint16Array([0,1,2,3]);this.dirty=true;this.blendMode=PIXI.blendModes.NORMAL;this.canvasPadding=0;this.drawMode=PIXI.Strip.DrawModes.TRIANGLE_STRIP;};PIXI.Strip.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);PIXI.Strip.prototype.constructor=PIXI.Strip;PIXI.Strip.prototype._renderWebGL=function(renderSession)
{if(!this.visible||this.alpha<=0)return;renderSession.spriteBatch.stop();if(!this._vertexBuffer)this._initWebGL(renderSession);renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);this._renderStrip(renderSession);renderSession.spriteBatch.start();};PIXI.Strip.prototype._initWebGL=function(renderSession)
{var gl=renderSession.gl;this._vertexBuffer=gl.createBuffer();this._indexBuffer=gl.createBuffer();this._uvBuffer=gl.createBuffer();this._colorBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this._vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices,gl.DYNAMIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this._uvBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.uvs,gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,this._colorBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.colors,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.indices,gl.STATIC_DRAW);};PIXI.Strip.prototype._renderStrip=function(renderSession)
{var gl=renderSession.gl;var projection=renderSession.projection,offset=renderSession.offset,shader=renderSession.shaderManager.stripShader;var drawMode=this.drawMode===PIXI.Strip.DrawModes.TRIANGLE_STRIP?gl.TRIANGLE_STRIP:gl.TRIANGLES;renderSession.blendModeManager.setBlendMode(this.blendMode);gl.uniformMatrix3fv(shader.translationMatrix,false,this.worldTransform.toArray(true));gl.uniform2f(shader.projectionVector,projection.x,-projection.y);gl.uniform2f(shader.offsetVector,-offset.x,-offset.y);gl.uniform1f(shader.alpha,this.worldAlpha);if(!this.dirty)
{gl.bindBuffer(gl.ARRAY_BUFFER,this._vertexBuffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.vertices);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,this._uvBuffer);gl.vertexAttribPointer(shader.aTextureCoord,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);if(this.texture.baseTexture._dirty[gl.id])
{renderSession.renderer.updateTexture(this.texture.baseTexture);}
else
{gl.bindTexture(gl.TEXTURE_2D,this.texture.baseTexture._glTextures[gl.id]);}
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._indexBuffer);}
else
{this.dirty=false;gl.bindBuffer(gl.ARRAY_BUFFER,this._vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.vertices,gl.STATIC_DRAW);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,this._uvBuffer);gl.bufferData(gl.ARRAY_BUFFER,this.uvs,gl.STATIC_DRAW);gl.vertexAttribPointer(shader.aTextureCoord,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);if(this.texture.baseTexture._dirty[gl.id])
{renderSession.renderer.updateTexture(this.texture.baseTexture);}
else
{gl.bindTexture(gl.TEXTURE_2D,this.texture.baseTexture._glTextures[gl.id]);}
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.indices,gl.STATIC_DRAW);}
gl.drawElements(drawMode,this.indices.length,gl.UNSIGNED_SHORT,0);};PIXI.Strip.prototype._renderCanvas=function(renderSession)
{var context=renderSession.context;var transform=this.worldTransform;if(renderSession.roundPixels)
{context.setTransform(transform.a,transform.b,transform.c,transform.d,transform.tx|0,transform.ty|0);}
else
{context.setTransform(transform.a,transform.b,transform.c,transform.d,transform.tx,transform.ty);}
if(this.drawMode===PIXI.Strip.DrawModes.TRIANGLE_STRIP)
{this._renderCanvasTriangleStrip(context);}
else
{this._renderCanvasTriangles(context);}};PIXI.Strip.prototype._renderCanvasTriangleStrip=function(context)
{var vertices=this.vertices;var uvs=this.uvs;var length=vertices.length / 2;this.count++;for(var i=0;i<length-2;i++){var index=i*2;this._renderCanvasDrawTriangle(context,vertices,uvs,index,(index+2),(index+4));}};PIXI.Strip.prototype._renderCanvasTriangles=function(context)
{var vertices=this.vertices;var uvs=this.uvs;var indices=this.indices;var length=indices.length;this.count++;for(var i=0;i<length;i+=3){var index0=indices[i]*2,index1=indices[i+1]*2,index2=indices[i+2]*2;this._renderCanvasDrawTriangle(context,vertices,uvs,index0,index1,index2);}};PIXI.Strip.prototype._renderCanvasDrawTriangle=function(context,vertices,uvs,index0,index1,index2)
{var textureSource=this.texture.baseTexture.source;var textureWidth=this.texture.width;var textureHeight=this.texture.height;var x0=vertices[index0],x1=vertices[index1],x2=vertices[index2];var y0=vertices[index0+1],y1=vertices[index1+1],y2=vertices[index2+1];var u0=uvs[index0]*textureWidth,u1=uvs[index1]*textureWidth,u2=uvs[index2]*textureWidth;var v0=uvs[index0+1]*textureHeight,v1=uvs[index1+1]*textureHeight,v2=uvs[index2+1]*textureHeight;if(this.canvasPadding>0){var paddingX=this.canvasPadding / this.worldTransform.a;var paddingY=this.canvasPadding / this.worldTransform.d;var centerX=(x0+x1+x2)/ 3;var centerY=(y0+y1+y2)/ 3;var normX=x0-centerX;var normY=y0-centerY;var dist=Math.sqrt(normX*normX+normY*normY);x0=centerX+(normX / dist)*(dist+paddingX);y0=centerY+(normY / dist)*(dist+paddingY);normX=x1-centerX;normY=y1-centerY;dist=Math.sqrt(normX*normX+normY*normY);x1=centerX+(normX / dist)*(dist+paddingX);y1=centerY+(normY / dist)*(dist+paddingY);normX=x2-centerX;normY=y2-centerY;dist=Math.sqrt(normX*normX+normY*normY);x2=centerX+(normX / dist)*(dist+paddingX);y2=centerY+(normY / dist)*(dist+paddingY);}
context.save();context.beginPath();context.moveTo(x0,y0);context.lineTo(x1,y1);context.lineTo(x2,y2);context.closePath();context.clip();var delta=(u0*v1)+(v0*u2)+(u1*v2)-(v1*u2)-(v0*u1)-(u0*v2);var deltaA=(x0*v1)+(v0*x2)+(x1*v2)-(v1*x2)-(v0*x1)-(x0*v2);var deltaB=(u0*x1)+(x0*u2)+(u1*x2)-(x1*u2)-(x0*u1)-(u0*x2);var deltaC=(u0*v1*x2)+(v0*x1*u2)+(x0*u1*v2)-(x0*v1*u2)-(v0*u1*x2)-(u0*x1*v2);var deltaD=(y0*v1)+(v0*y2)+(y1*v2)-(v1*y2)-(v0*y1)-(y0*v2);var deltaE=(u0*y1)+(y0*u2)+(u1*y2)-(y1*u2)-(y0*u1)-(u0*y2);var deltaF=(u0*v1*y2)+(v0*y1*u2)+(y0*u1*v2)-(y0*v1*u2)-(v0*u1*y2)-(u0*y1*v2);context.transform(deltaA / delta,deltaD / delta,deltaB / delta,deltaE / delta,deltaC / delta,deltaF / delta);context.drawImage(textureSource,0,0);context.restore();};PIXI.Strip.prototype.renderStripFlat=function(strip)
{var context=this.context;var vertices=strip.vertices;var length=vertices.length/2;this.count++;context.beginPath();for(var i=1;i<length-2;i++)
{var index=i*2;var x0=vertices[index],x1=vertices[index+2],x2=vertices[index+4];var y0=vertices[index+1],y1=vertices[index+3],y2=vertices[index+5];context.moveTo(x0,y0);context.lineTo(x1,y1);context.lineTo(x2,y2);}
context.fillStyle='#FF0000';context.fill();context.closePath();};PIXI.Strip.prototype.onTextureUpdate=function()
{this.updateFrame=true;};PIXI.Strip.prototype.getBounds=function(matrix)
{var worldTransform=matrix||this.worldTransform;var a=worldTransform.a;var b=worldTransform.b;var c=worldTransform.c;var d=worldTransform.d;var tx=worldTransform.tx;var ty=worldTransform.ty;var maxX=-Infinity;var maxY=-Infinity;var minX=Infinity;var minY=Infinity;var vertices=this.vertices;for(var i=0,n=vertices.length;i<n;i+=2)
{var rawX=vertices[i],rawY=vertices[i+1];var x=(a*rawX)+(c*rawY)+tx;var y=(d*rawY)+(b*rawX)+ty;minX=x<minX?x:minX;minY=y<minY?y:minY;maxX=x>maxX?x:maxX;maxY=y>maxY?y:maxY;}
if(minX===-Infinity||maxY===Infinity)
{return PIXI.EmptyRectangle;}
var bounds=this._bounds;bounds.x=minX;bounds.width=maxX-minX;bounds.y=minY;bounds.height=maxY-minY;this._currentBounds=bounds;return bounds;};PIXI.Strip.DrawModes={TRIANGLE_STRIP:0,TRIANGLES:1};PIXI.Rope=function(texture,points)
{PIXI.Strip.call(this,texture);this.points=points;this.vertices=new PIXI.Float32Array(points.length*4);this.uvs=new PIXI.Float32Array(points.length*4);this.colors=new PIXI.Float32Array(points.length*2);this.indices=new PIXI.Uint16Array(points.length*2);this.refresh();};PIXI.Rope.prototype=Object.create(PIXI.Strip.prototype);PIXI.Rope.prototype.constructor=PIXI.Rope;PIXI.Rope.prototype.refresh=function()
{var points=this.points;if(points.length<1)return;var uvs=this.uvs;var lastPoint=points[0];var indices=this.indices;var colors=this.colors;this.count-=0.2;uvs[0]=0;uvs[1]=0;uvs[2]=0;uvs[3]=1;colors[0]=1;colors[1]=1;indices[0]=0;indices[1]=1;var total=points.length,point,index,amount;for(var i=1;i<total;i++)
{point=points[i];index=i*4;amount=i /(total-1);if(i%2)
{uvs[index]=amount;uvs[index+1]=0;uvs[index+2]=amount;uvs[index+3]=1;}
else
{uvs[index]=amount;uvs[index+1]=0;uvs[index+2]=amount;uvs[index+3]=1;}
index=i*2;colors[index]=1;colors[index+1]=1;index=i*2;indices[index]=index;indices[index+1]=index+1;lastPoint=point;}};PIXI.Rope.prototype.updateTransform=function()
{var points=this.points;if(points.length<1)return;var lastPoint=points[0];var nextPoint;var perp={x:0,y:0};this.count-=0.2;var vertices=this.vertices;var total=points.length,point,index,ratio,perpLength,num;for(var i=0;i<total;i++)
{point=points[i];index=i*4;if(i<points.length-1)
{nextPoint=points[i+1];}
else
{nextPoint=point;}
perp.y=-(nextPoint.x-lastPoint.x);perp.x=nextPoint.y-lastPoint.y;ratio=(1-(i /(total-1)))*10;if(ratio>1)ratio=1;perpLength=Math.sqrt(perp.x*perp.x+perp.y*perp.y);num=this.texture.height / 2;perp.x /=perpLength;perp.y /=perpLength;perp.x*=num;perp.y*=num;vertices[index]=point.x+perp.x;vertices[index+1]=point.y+perp.y;vertices[index+2]=point.x-perp.x;vertices[index+3]=point.y-perp.y;lastPoint=point;}
PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);};PIXI.Rope.prototype.setTexture=function(texture)
{this.texture=texture;};PIXI.TilingSprite=function(texture,width,height)
{PIXI.Sprite.call(this,texture);this._width=width||128;this._height=height||128;this.tileScale=new PIXI.Point(1,1);this.tileScaleOffset=new PIXI.Point(1,1);this.tilePosition=new PIXI.Point();this.renderable=true;this.tint=0xFFFFFF;this.textureDebug=false;this.blendMode=PIXI.blendModes.NORMAL;this.canvasBuffer=null;this.tilingTexture=null;this.tilePattern=null;this.refreshTexture=true;this.frameWidth=0;this.frameHeight=0;};PIXI.TilingSprite.prototype=Object.create(PIXI.Sprite.prototype);PIXI.TilingSprite.prototype.constructor=PIXI.TilingSprite;PIXI.TilingSprite.prototype.setTexture=function(texture)
{if(this.texture!==texture)
{this.texture=texture;this.refreshTexture=true;this.cachedTint=0xFFFFFF;}};PIXI.TilingSprite.prototype._renderWebGL=function(renderSession)
{if(this.visible===false||this.alpha===0)
{return;}
if(this._mask)
{renderSession.spriteBatch.stop();renderSession.maskManager.pushMask(this.mask,renderSession);renderSession.spriteBatch.start();}
if(this._filters)
{renderSession.spriteBatch.flush();renderSession.filterManager.pushFilter(this._filterBlock);}
if(this.refreshTexture)
{this.generateTilingTexture(true,renderSession);if(this.tilingTexture)
{if(this.tilingTexture.needsUpdate)
{renderSession.renderer.updateTexture(this.tilingTexture.baseTexture);this.tilingTexture.needsUpdate=false;}}
else
{return;}}
renderSession.spriteBatch.renderTilingSprite(this);for(var i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession);}
renderSession.spriteBatch.stop();if(this._filters)
{renderSession.filterManager.popFilter();}
if(this._mask)
{renderSession.maskManager.popMask(this._mask,renderSession);}
renderSession.spriteBatch.start();};PIXI.TilingSprite.prototype._renderCanvas=function(renderSession)
{if(this.visible===false||this.alpha===0)
{return;}
var context=renderSession.context;if(this._mask)
{renderSession.maskManager.pushMask(this._mask,renderSession);}
context.globalAlpha=this.worldAlpha;var wt=this.worldTransform;var resolution=renderSession.resolution;context.setTransform(wt.a*resolution,wt.b*resolution,wt.c*resolution,wt.d*resolution,wt.tx*resolution,wt.ty*resolution);if(this.refreshTexture)
{this.generateTilingTexture(false,renderSession);if(this.tilingTexture)
{this.tilePattern=context.createPattern(this.tilingTexture.baseTexture.source,'repeat');}
else
{return;}}
var sessionBlendMode=renderSession.currentBlendMode;if(this.blendMode!==renderSession.currentBlendMode)
{renderSession.currentBlendMode=this.blendMode;context.globalCompositeOperation=PIXI.blendModesCanvas[renderSession.currentBlendMode];}
var tilePosition=this.tilePosition;var tileScale=this.tileScale;tilePosition.x%=this.tilingTexture.baseTexture.width;tilePosition.y%=this.tilingTexture.baseTexture.height;context.scale(tileScale.x,tileScale.y);context.translate(tilePosition.x+(this.anchor.x*-this._width),tilePosition.y+(this.anchor.y*-this._height));context.fillStyle=this.tilePattern;var tx=-tilePosition.x;var ty=-tilePosition.y;var tw=this._width / tileScale.x;var th=this._height / tileScale.y;if(renderSession.roundPixels)
{tx|=0;ty|=0;tw|=0;th|=0;}
context.fillRect(tx,ty,tw,th);context.scale(1 / tileScale.x,1 / tileScale.y);context.translate(-tilePosition.x+(this.anchor.x*this._width),-tilePosition.y+(this.anchor.y*this._height));if(this._mask)
{renderSession.maskManager.popMask(renderSession);}
for(var i=0;i<this.children.length;i++)
{this.children[i]._renderCanvas(renderSession);}
if(sessionBlendMode!==this.blendMode)
{renderSession.currentBlendMode=sessionBlendMode;context.globalCompositeOperation=PIXI.blendModesCanvas[sessionBlendMode];}};PIXI.TilingSprite.prototype.onTextureUpdate=function()
{};PIXI.TilingSprite.prototype.generateTilingTexture=function(forcePowerOfTwo,renderSession)
{if(!this.texture.baseTexture.hasLoaded)
{return;}
var texture=this.texture;var frame=texture.frame;var targetWidth=this._frame.sourceSizeW;var targetHeight=this._frame.sourceSizeH;var dx=0;var dy=0;if(this._frame.trimmed)
{dx=this._frame.spriteSourceSizeX;dy=this._frame.spriteSourceSizeY;}
if(forcePowerOfTwo)
{targetWidth=PIXI.getNextPowerOfTwo(targetWidth);targetHeight=PIXI.getNextPowerOfTwo(targetHeight);}
if(this.canvasBuffer)
{this.canvasBuffer.resize(targetWidth,targetHeight);this.tilingTexture.baseTexture.width=targetWidth;this.tilingTexture.baseTexture.height=targetHeight;this.tilingTexture.needsUpdate=true;}
else
{this.canvasBuffer=new PIXI.CanvasBuffer(targetWidth,targetHeight);this.tilingTexture=PIXI.Texture.fromCanvas(this.canvasBuffer.canvas);this.tilingTexture.isTiling=true;this.tilingTexture.needsUpdate=true;}
if(this.textureDebug)
{this.canvasBuffer.context.strokeStyle='#00ff00';this.canvasBuffer.context.strokeRect(0,0,targetWidth,targetHeight);}
var w=texture.crop.width;var h=texture.crop.height;if(w!==targetWidth||h!==targetHeight)
{w=targetWidth;h=targetHeight;}
this.canvasBuffer.context.drawImage(texture.baseTexture.source,texture.crop.x,texture.crop.y,texture.crop.width,texture.crop.height,dx,dy,w,h);this.tileScaleOffset.x=frame.width / targetWidth;this.tileScaleOffset.y=frame.height / targetHeight;this.refreshTexture=false;this.tilingTexture.baseTexture._powerOf2=true;};PIXI.TilingSprite.prototype.getBounds=function()
{var width=this._width;var height=this._height;var w0=width*(1-this.anchor.x);var w1=width*-this.anchor.x;var h0=height*(1-this.anchor.y);var h1=height*-this.anchor.y;var worldTransform=this.worldTransform;var a=worldTransform.a;var b=worldTransform.b;var c=worldTransform.c;var d=worldTransform.d;var tx=worldTransform.tx;var ty=worldTransform.ty;var x1=a*w1+c*h1+tx;var y1=d*h1+b*w1+ty;var x2=a*w0+c*h1+tx;var y2=d*h1+b*w0+ty;var x3=a*w0+c*h0+tx;var y3=d*h0+b*w0+ty;var x4=a*w1+c*h0+tx;var y4=d*h0+b*w1+ty;var maxX=-Infinity;var maxY=-Infinity;var minX=Infinity;var minY=Infinity;minX=x1<minX?x1:minX;minX=x2<minX?x2:minX;minX=x3<minX?x3:minX;minX=x4<minX?x4:minX;minY=y1<minY?y1:minY;minY=y2<minY?y2:minY;minY=y3<minY?y3:minY;minY=y4<minY?y4:minY;maxX=x1>maxX?x1:maxX;maxX=x2>maxX?x2:maxX;maxX=x3>maxX?x3:maxX;maxX=x4>maxX?x4:maxX;maxY=y1>maxY?y1:maxY;maxY=y2>maxY?y2:maxY;maxY=y3>maxY?y3:maxY;maxY=y4>maxY?y4:maxY;var bounds=this._bounds;bounds.x=minX;bounds.width=maxX-minX;bounds.y=minY;bounds.height=maxY-minY;this._currentBounds=bounds;return bounds;};PIXI.TilingSprite.prototype.destroy=function(){PIXI.Sprite.prototype.destroy.call(this);if(this.canvasBuffer)
{this.canvasBuffer.destroy();this.canvasBuffer=null;}
this.tileScale=null;this.tileScaleOffset=null;this.tilePosition=null;if(this.tilingTexture)
{this.tilingTexture.destroy(true);this.tilingTexture=null;}};Object.defineProperty(PIXI.TilingSprite.prototype,'width',{get:function(){return this._width;},set:function(value){this._width=value;}});Object.defineProperty(PIXI.TilingSprite.prototype,'height',{get:function(){return this._height;},set:function(value){this._height=value;}});if(typeof exports!=='undefined'){if(typeof module!=='undefined'&&module.exports){exports=module.exports=PIXI;}
exports.PIXI=PIXI;}else if(typeof define!=='undefined'&&define.amd){define('PIXI',(function(){return root.PIXI=PIXI;})());}else{root.PIXI=PIXI;}
return PIXI;}).call(this);(function(){var root=this;var Phaser=Phaser||{VERSION:'2.4.4',GAMES:[],AUTO:0,CANVAS:1,WEBGL:2,HEADLESS:3,NONE:0,LEFT:1,RIGHT:2,UP:3,DOWN:4,SPRITE:0,BUTTON:1,IMAGE:2,GRAPHICS:3,TEXT:4,TILESPRITE:5,BITMAPTEXT:6,GROUP:7,RENDERTEXTURE:8,TILEMAP:9,TILEMAPLAYER:10,EMITTER:11,POLYGON:12,BITMAPDATA:13,CANVAS_FILTER:14,WEBGL_FILTER:15,ELLIPSE:16,SPRITEBATCH:17,RETROFONT:18,POINTER:19,ROPE:20,CIRCLE:21,RECTANGLE:22,LINE:23,MATRIX:24,POINT:25,ROUNDEDRECTANGLE:26,CREATURE:27,VIDEO:28,blendModes:{NORMAL:0,ADD:1,MULTIPLY:2,SCREEN:3,OVERLAY:4,DARKEN:5,LIGHTEN:6,COLOR_DODGE:7,COLOR_BURN:8,HARD_LIGHT:9,SOFT_LIGHT:10,DIFFERENCE:11,EXCLUSION:12,HUE:13,SATURATION:14,COLOR:15,LUMINOSITY:16},scaleModes:{DEFAULT:0,LINEAR:0,NEAREST:1},PIXI:PIXI||{}};if(!Math.trunc){Math.trunc=function trunc(x){return x<0?Math.ceil(x):Math.floor(x);};}
if(!Function.prototype.bind){Function.prototype.bind=(function(){var slice=Array.prototype.slice;return function(thisArg){var target=this,boundArgs=slice.call(arguments,1);if(typeof target!=='function')
{throw new TypeError();}
function bound(){var args=boundArgs.concat(slice.call(arguments));target.apply(this instanceof bound?this:thisArg,args);}
bound.prototype=(function F(proto){if(proto)
{F.prototype=proto;}
if(!(this instanceof F))
{return new F;}})(target.prototype);return bound;};})();}
if(!Array.isArray)
{Array.isArray=function(arg)
{return Object.prototype.toString.call(arg)=='[object Array]';};}
if(!Array.prototype.forEach)
{Array.prototype.forEach=function(fun)
{"use strict";if(this===void 0||this===null)
{throw new TypeError();}
var t=Object(this);var len=t.length>>>0;if(typeof fun!=="function")
{throw new TypeError();}
var thisArg=arguments.length>=2?arguments[1]:void 0;for(var i=0;i<len;i++)
{if(i in t)
{fun.call(thisArg,t[i],i,t);}}};}
if(typeof window.Uint32Array!=="function"&&typeof window.Uint32Array!=="object")
{var CheapArray=function(type)
{var proto=new Array();window[type]=function(arg){if(typeof(arg)==="number")
{Array.call(this,arg);this.length=arg;for(var i=0;i<this.length;i++)
{this[i]=0;}}
else
{Array.call(this,arg.length);this.length=arg.length;for(var i=0;i<this.length;i++)
{this[i]=arg[i];}}};window[type].prototype=proto;window[type].constructor=window[type];};CheapArray('Uint32Array');CheapArray('Int16Array');}
if(!window.console)
{window.console={};window.console.log=window.console.assert=function(){};window.console.warn=window.console.assert=function(){};}
Phaser.Utils={getProperty:function(obj,prop){var parts=prop.split('.'),last=parts.pop(),l=parts.length,i=1,current=parts[0];while(i<l&&(obj=obj[current]))
{current=parts[i];i++;}
if(obj)
{return obj[last];}
else
{return null;}},setProperty:function(obj,prop,value){var parts=prop.split('.'),last=parts.pop(),l=parts.length,i=1,current=parts[0];while(i<l&&(obj=obj[current]))
{current=parts[i];i++;}
if(obj)
{obj[last]=value;}
return obj;},chanceRoll:function(chance){if(chance===undefined){chance=50;}
return chance>0&&(Math.random()*100<=chance);},randomChoice:function(choice1,choice2){return(Math.random()<0.5)?choice1:choice2;},parseDimension:function(size,dimension){var f=0;var px=0;if(typeof size==='string')
{if(size.substr(-1)==='%')
{f=parseInt(size,10)/ 100;if(dimension===0)
{px=window.innerWidth*f;}
else
{px=window.innerHeight*f;}}
else
{px=parseInt(size,10);}}
else
{px=size;}
return px;},pad:function(str,len,pad,dir){if(len===undefined){var len=0;}
if(pad===undefined){var pad=' ';}
if(dir===undefined){var dir=3;}
var padlen=0;if(len+1>=str.length)
{switch(dir)
{case 1:str=new Array(len+1-str.length).join(pad)+str;break;case 3:var right=Math.ceil((padlen=len-str.length)/ 2);var left=padlen-right;str=new Array(left+1).join(pad)+str+new Array(right+1).join(pad);break;default:str=str+new Array(len+1-str.length).join(pad);break;}}
return str;},isPlainObject:function(obj){if(typeof(obj)!=="object"||obj.nodeType||obj===obj.window)
{return false;}
try{if(obj.constructor&&!({}).hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf"))
{return false;}}catch(e){return false;}
return true;},extend:function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;if(typeof target==="boolean")
{deep=target;target=arguments[1]||{};i=2;}
if(length===i)
{target=this;--i;}
for(;i<length;i++)
{if((options=arguments[i])!=null)
{for(name in options)
{src=target[name];copy=options[name];if(target===copy)
{continue;}
if(deep&&copy&&(Phaser.Utils.isPlainObject(copy)||(copyIsArray=Array.isArray(copy))))
{if(copyIsArray)
{copyIsArray=false;clone=src&&Array.isArray(src)?src:[];}
else
{clone=src&&Phaser.Utils.isPlainObject(src)?src:{};}
target[name]=Phaser.Utils.extend(deep,clone,copy);}
else if(copy!==undefined)
{target[name]=copy;}}}}
return target;},mixinPrototype:function(target,mixin,replace){if(replace===undefined){replace=false;}
var mixinKeys=Object.keys(mixin);for(var i=0;i<mixinKeys.length;i++)
{var key=mixinKeys[i];var value=mixin[key];if(!replace&&(key in target))
{continue;}
else
{if(value&&(typeof value.get==='function'||typeof value.set==='function'))
{if(typeof value.clone==='function')
{target[key]=value.clone();}
else
{Object.defineProperty(target,key,value);}}
else
{target[key]=value;}}}},mixin:function(from,to){if(!from||typeof(from)!=="object")
{return to;}
for(var key in from)
{var o=from[key];if(o.childNodes||o.cloneNode)
{continue;}
var type=typeof(from[key]);if(!from[key]||type!=="object")
{to[key]=from[key];}
else
{if(typeof(to[key])===type)
{to[key]=Phaser.Utils.mixin(from[key],to[key]);}
else
{to[key]=Phaser.Utils.mixin(from[key],new o.constructor());}}}
return to;}};Phaser.Circle=function(x,y,diameter){x=x||0;y=y||0;diameter=diameter||0;this.x=x;this.y=y;this._diameter=diameter;this._radius=0;if(diameter>0)
{this._radius=diameter*0.5;}
this.type=Phaser.CIRCLE;};Phaser.Circle.prototype={circumference:function(){return 2*(Math.PI*this._radius);},random:function(out){if(out===undefined){out=new Phaser.Point();}
var t=2*Math.PI*Math.random();var u=Math.random()+Math.random();var r=(u>1)?2-u:u;var x=r*Math.cos(t);var y=r*Math.sin(t);out.x=this.x+(x*this.radius);out.y=this.y+(y*this.radius);return out;},getBounds:function(){return new Phaser.Rectangle(this.x-this.radius,this.y-this.radius,this.diameter,this.diameter);},setTo:function(x,y,diameter){this.x=x;this.y=y;this._diameter=diameter;this._radius=diameter*0.5;return this;},copyFrom:function(source){return this.setTo(source.x,source.y,source.diameter);},copyTo:function(dest){dest.x=this.x;dest.y=this.y;dest.diameter=this._diameter;return dest;},distance:function(dest,round){var distance=Phaser.Math.distance(this.x,this.y,dest.x,dest.y);return round?Math.round(distance):distance;},clone:function(output){if(output===undefined||output===null)
{output=new Phaser.Circle(this.x,this.y,this.diameter);}
else
{output.setTo(this.x,this.y,this.diameter);}
return output;},contains:function(x,y){return Phaser.Circle.contains(this,x,y);},circumferencePoint:function(angle,asDegrees,out){return Phaser.Circle.circumferencePoint(this,angle,asDegrees,out);},offset:function(dx,dy){this.x+=dx;this.y+=dy;return this;},offsetPoint:function(point){return this.offset(point.x,point.y);},toString:function(){return"[{Phaser.Circle (x="+this.x+" y="+this.y+" diameter="+this.diameter+" radius="+this.radius+")}]";}};Phaser.Circle.prototype.constructor=Phaser.Circle;Object.defineProperty(Phaser.Circle.prototype,"diameter",{get:function(){return this._diameter;},set:function(value){if(value>0)
{this._diameter=value;this._radius=value*0.5;}}});Object.defineProperty(Phaser.Circle.prototype,"radius",{get:function(){return this._radius;},set:function(value){if(value>0)
{this._radius=value;this._diameter=value*2;}}});Object.defineProperty(Phaser.Circle.prototype,"left",{get:function(){return this.x-this._radius;},set:function(value){if(value>this.x)
{this._radius=0;this._diameter=0;}
else
{this.radius=this.x-value;}}});Object.defineProperty(Phaser.Circle.prototype,"right",{get:function(){return this.x+this._radius;},set:function(value){if(value<this.x)
{this._radius=0;this._diameter=0;}
else
{this.radius=value-this.x;}}});Object.defineProperty(Phaser.Circle.prototype,"top",{get:function(){return this.y-this._radius;},set:function(value){if(value>this.y)
{this._radius=0;this._diameter=0;}
else
{this.radius=this.y-value;}}});Object.defineProperty(Phaser.Circle.prototype,"bottom",{get:function(){return this.y+this._radius;},set:function(value){if(value<this.y)
{this._radius=0;this._diameter=0;}
else
{this.radius=value-this.y;}}});Object.defineProperty(Phaser.Circle.prototype,"area",{get:function(){if(this._radius>0)
{return Math.PI*this._radius*this._radius;}
else
{return 0;}}});Object.defineProperty(Phaser.Circle.prototype,"empty",{get:function(){return(this._diameter===0);},set:function(value){if(value===true)
{this.setTo(0,0,0);}}});Phaser.Circle.contains=function(a,x,y){if(a.radius>0&&x>=a.left&&x<=a.right&&y>=a.top&&y<=a.bottom)
{var dx=(a.x-x)*(a.x-x);var dy=(a.y-y)*(a.y-y);return(dx+dy)<=(a.radius*a.radius);}
else
{return false;}};Phaser.Circle.equals=function(a,b){return(a.x==b.x&&a.y==b.y&&a.diameter==b.diameter);};Phaser.Circle.intersects=function(a,b){return(Phaser.Math.distance(a.x,a.y,b.x,b.y)<=(a.radius+b.radius));};Phaser.Circle.circumferencePoint=function(a,angle,asDegrees,out){if(asDegrees===undefined){asDegrees=false;}
if(out===undefined){out=new Phaser.Point();}
if(asDegrees===true)
{angle=Phaser.Math.degToRad(angle);}
out.x=a.x+a.radius*Math.cos(angle);out.y=a.y+a.radius*Math.sin(angle);return out;};Phaser.Circle.intersectsRectangle=function(c,r){var cx=Math.abs(c.x-r.x-r.halfWidth);var xDist=r.halfWidth+c.radius;if(cx>xDist)
{return false;}
var cy=Math.abs(c.y-r.y-r.halfHeight);var yDist=r.halfHeight+c.radius;if(cy>yDist)
{return false;}
if(cx<=r.halfWidth||cy<=r.halfHeight)
{return true;}
var xCornerDist=cx-r.halfWidth;var yCornerDist=cy-r.halfHeight;var xCornerDistSq=xCornerDist*xCornerDist;var yCornerDistSq=yCornerDist*yCornerDist;var maxCornerDistSq=c.radius*c.radius;return xCornerDistSq+yCornerDistSq<=maxCornerDistSq;};PIXI.Circle=Phaser.Circle;Phaser.Ellipse=function(x,y,width,height){x=x||0;y=y||0;width=width||0;height=height||0;this.x=x;this.y=y;this.width=width;this.height=height;this.type=Phaser.ELLIPSE;};Phaser.Ellipse.prototype={setTo:function(x,y,width,height){this.x=x;this.y=y;this.width=width;this.height=height;return this;},getBounds:function(){return new Phaser.Rectangle(this.x-this.width,this.y-this.height,this.width,this.height);},copyFrom:function(source){return this.setTo(source.x,source.y,source.width,source.height);},copyTo:function(dest){dest.x=this.x;dest.y=this.y;dest.width=this.width;dest.height=this.height;return dest;},clone:function(output){if(output===undefined||output===null)
{output=new Phaser.Ellipse(this.x,this.y,this.width,this.height);}
else
{output.setTo(this.x,this.y,this.width,this.height);}
return output;},contains:function(x,y){return Phaser.Ellipse.contains(this,x,y);},random:function(out){if(out===undefined){out=new Phaser.Point();}
var p=Math.random()*Math.PI*2;var r=Math.random();out.x=Math.sqrt(r)*Math.cos(p);out.y=Math.sqrt(r)*Math.sin(p);out.x=this.x+(out.x*this.width / 2.0);out.y=this.y+(out.y*this.height / 2.0);return out;},toString:function(){return"[{Phaser.Ellipse (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+")}]";}};Phaser.Ellipse.prototype.constructor=Phaser.Ellipse;Object.defineProperty(Phaser.Ellipse.prototype,"left",{get:function(){return this.x;},set:function(value){this.x=value;}});Object.defineProperty(Phaser.Ellipse.prototype,"right",{get:function(){return this.x+this.width;},set:function(value){if(value<this.x)
{this.width=0;}
else
{this.width=value-this.x;}}});Object.defineProperty(Phaser.Ellipse.prototype,"top",{get:function(){return this.y;},set:function(value){this.y=value;}});Object.defineProperty(Phaser.Ellipse.prototype,"bottom",{get:function(){return this.y+this.height;},set:function(value){if(value<this.y)
{this.height=0;}
else
{this.height=value-this.y;}}});Object.defineProperty(Phaser.Ellipse.prototype,"empty",{get:function(){return(this.width===0||this.height===0);},set:function(value){if(value===true)
{this.setTo(0,0,0,0);}}});Phaser.Ellipse.contains=function(a,x,y){if(a.width<=0||a.height<=0){return false;}
var normx=((x-a.x)/ a.width)-0.5;var normy=((y-a.y)/ a.height)-0.5;normx*=normx;normy*=normy;return(normx+normy<0.25);};PIXI.Ellipse=Phaser.Ellipse;Phaser.Line=function(x1,y1,x2,y2){x1=x1||0;y1=y1||0;x2=x2||0;y2=y2||0;this.start=new Phaser.Point(x1,y1);this.end=new Phaser.Point(x2,y2);this.type=Phaser.LINE;};Phaser.Line.prototype={setTo:function(x1,y1,x2,y2){this.start.setTo(x1,y1);this.end.setTo(x2,y2);return this;},fromSprite:function(startSprite,endSprite,useCenter){if(useCenter===undefined){useCenter=false;}
if(useCenter)
{return this.setTo(startSprite.center.x,startSprite.center.y,endSprite.center.x,endSprite.center.y);}
return this.setTo(startSprite.x,startSprite.y,endSprite.x,endSprite.y);},fromAngle:function(x,y,angle,length){this.start.setTo(x,y);this.end.setTo(x+(Math.cos(angle)*length),y+(Math.sin(angle)*length));return this;},rotate:function(angle,asDegrees){var cx=(this.start.x+this.end.x)/ 2;var cy=(this.start.y+this.end.y)/ 2;this.start.rotate(cx,cy,angle,asDegrees);this.end.rotate(cx,cy,angle,asDegrees);return this;},rotateAround:function(x,y,angle,asDegrees){this.start.rotate(x,y,angle,asDegrees);this.end.rotate(x,y,angle,asDegrees);return this;},intersects:function(line,asSegment,result){return Phaser.Line.intersectsPoints(this.start,this.end,line.start,line.end,asSegment,result);},reflect:function(line){return Phaser.Line.reflect(this,line);},midPoint:function(out){if(out===undefined){out=new Phaser.Point();}
out.x=(this.start.x+this.end.x)/ 2;out.y=(this.start.y+this.end.y)/ 2;return out;},centerOn:function(x,y){var cx=(this.start.x+this.end.x)/ 2;var cy=(this.start.y+this.end.y)/ 2;var tx=x-cx;var ty=y-cy;this.start.add(tx,ty);this.end.add(tx,ty);},pointOnLine:function(x,y){return((x-this.start.x)*(this.end.y-this.start.y)===(this.end.x-this.start.x)*(y-this.start.y));},pointOnSegment:function(x,y){var xMin=Math.min(this.start.x,this.end.x);var xMax=Math.max(this.start.x,this.end.x);var yMin=Math.min(this.start.y,this.end.y);var yMax=Math.max(this.start.y,this.end.y);return(this.pointOnLine(x,y)&&(x>=xMin&&x<=xMax)&&(y>=yMin&&y<=yMax));},random:function(out){if(out===undefined){out=new Phaser.Point();}
var t=Math.random();out.x=this.start.x+t*(this.end.x-this.start.x);out.y=this.start.y+t*(this.end.y-this.start.y);return out;},coordinatesOnLine:function(stepRate,results){if(stepRate===undefined){stepRate=1;}
if(results===undefined){results=[];}
var x1=Math.round(this.start.x);var y1=Math.round(this.start.y);var x2=Math.round(this.end.x);var y2=Math.round(this.end.y);var dx=Math.abs(x2-x1);var dy=Math.abs(y2-y1);var sx=(x1<x2)?1:-1;var sy=(y1<y2)?1:-1;var err=dx-dy;results.push([x1,y1]);var i=1;while(!((x1==x2)&&(y1==y2)))
{var e2=err<<1;if(e2>-dy)
{err-=dy;x1+=sx;}
if(e2<dx)
{err+=dx;y1+=sy;}
if(i%stepRate===0)
{results.push([x1,y1]);}
i++;}
return results;},clone:function(output){if(output===undefined||output===null)
{output=new Phaser.Line(this.start.x,this.start.y,this.end.x,this.end.y);}
else
{output.setTo(this.start.x,this.start.y,this.end.x,this.end.y);}
return output;}};Object.defineProperty(Phaser.Line.prototype,"length",{get:function(){return Math.sqrt((this.end.x-this.start.x)*(this.end.x-this.start.x)+(this.end.y-this.start.y)*(this.end.y-this.start.y));}});Object.defineProperty(Phaser.Line.prototype,"angle",{get:function(){return Math.atan2(this.end.y-this.start.y,this.end.x-this.start.x);}});Object.defineProperty(Phaser.Line.prototype,"slope",{get:function(){return(this.end.y-this.start.y)/(this.end.x-this.start.x);}});Object.defineProperty(Phaser.Line.prototype,"perpSlope",{get:function(){return-((this.end.x-this.start.x)/(this.end.y-this.start.y));}});Object.defineProperty(Phaser.Line.prototype,"x",{get:function(){return Math.min(this.start.x,this.end.x);}});Object.defineProperty(Phaser.Line.prototype,"y",{get:function(){return Math.min(this.start.y,this.end.y);}});Object.defineProperty(Phaser.Line.prototype,"left",{get:function(){return Math.min(this.start.x,this.end.x);}});Object.defineProperty(Phaser.Line.prototype,"right",{get:function(){return Math.max(this.start.x,this.end.x);}});Object.defineProperty(Phaser.Line.prototype,"top",{get:function(){return Math.min(this.start.y,this.end.y);}});Object.defineProperty(Phaser.Line.prototype,"bottom",{get:function(){return Math.max(this.start.y,this.end.y);}});Object.defineProperty(Phaser.Line.prototype,"width",{get:function(){return Math.abs(this.start.x-this.end.x);}});Object.defineProperty(Phaser.Line.prototype,"height",{get:function(){return Math.abs(this.start.y-this.end.y);}});Object.defineProperty(Phaser.Line.prototype,"normalX",{get:function(){return Math.cos(this.angle-1.5707963267948966);}});Object.defineProperty(Phaser.Line.prototype,"normalY",{get:function(){return Math.sin(this.angle-1.5707963267948966);}});Object.defineProperty(Phaser.Line.prototype,"normalAngle",{get:function(){return Phaser.Math.wrap(this.angle-1.5707963267948966,-Math.PI,Math.PI);}});Phaser.Line.intersectsPoints=function(a,b,e,f,asSegment,result){if(asSegment===undefined){asSegment=true;}
if(result===undefined){result=new Phaser.Point();}
var a1=b.y-a.y;var a2=f.y-e.y;var b1=a.x-b.x;var b2=e.x-f.x;var c1=(b.x*a.y)-(a.x*b.y);var c2=(f.x*e.y)-(e.x*f.y);var denom=(a1*b2)-(a2*b1);if(denom===0)
{return null;}
result.x=((b1*c2)-(b2*c1))/ denom;result.y=((a2*c1)-(a1*c2))/ denom;if(asSegment)
{var uc=((f.y-e.y)*(b.x-a.x)-(f.x-e.x)*(b.y-a.y));var ua=(((f.x-e.x)*(a.y-e.y))-(f.y-e.y)*(a.x-e.x))/ uc;var ub=(((b.x-a.x)*(a.y-e.y))-((b.y-a.y)*(a.x-e.x)))/ uc;if(ua>=0&&ua<=1&&ub>=0&&ub<=1)
{return result;}
else
{return null;}}
return result;};Phaser.Line.intersects=function(a,b,asSegment,result){return Phaser.Line.intersectsPoints(a.start,a.end,b.start,b.end,asSegment,result);};Phaser.Line.reflect=function(a,b){return 2*b.normalAngle-3.141592653589793-a.angle;};Phaser.Matrix=function(a,b,c,d,tx,ty){a=a||1;b=b||0;c=c||0;d=d||1;tx=tx||0;ty=ty||0;this.a=a;this.b=b;this.c=c;this.d=d;this.tx=tx;this.ty=ty;this.type=Phaser.MATRIX;};Phaser.Matrix.prototype={fromArray:function(array){return this.setTo(array[0],array[1],array[3],array[4],array[2],array[5]);},setTo:function(a,b,c,d,tx,ty){this.a=a;this.b=b;this.c=c;this.d=d;this.tx=tx;this.ty=ty;return this;},clone:function(output){if(output===undefined||output===null)
{output=new Phaser.Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);}
else
{output.a=this.a;output.b=this.b;output.c=this.c;output.d=this.d;output.tx=this.tx;output.ty=this.ty;}
return output;},copyTo:function(matrix){matrix.copyFrom(this);return matrix;},copyFrom:function(matrix){this.a=matrix.a;this.b=matrix.b;this.c=matrix.c;this.d=matrix.d;this.tx=matrix.tx;this.ty=matrix.ty;return this;},toArray:function(transpose,array){if(array===undefined){array=new PIXI.Float32Array(9);}
if(transpose)
{array[0]=this.a;array[1]=this.b;array[2]=0;array[3]=this.c;array[4]=this.d;array[5]=0;array[6]=this.tx;array[7]=this.ty;array[8]=1;}
else
{array[0]=this.a;array[1]=this.c;array[2]=this.tx;array[3]=this.b;array[4]=this.d;array[5]=this.ty;array[6]=0;array[7]=0;array[8]=1;}
return array;},apply:function(pos,newPos){if(newPos===undefined){newPos=new Phaser.Point();}
newPos.x=this.a*pos.x+this.c*pos.y+this.tx;newPos.y=this.b*pos.x+this.d*pos.y+this.ty;return newPos;},applyInverse:function(pos,newPos){if(newPos===undefined){newPos=new Phaser.Point();}
var id=1 /(this.a*this.d+this.c*-this.b);var x=pos.x;var y=pos.y;newPos.x=this.d*id*x+ -this.c*id*y+(this.ty*this.c-this.tx*this.d)*id;newPos.y=this.a*id*y+ -this.b*id*x+(-this.ty*this.a+this.tx*this.b)*id;return newPos;},translate:function(x,y){this.tx+=x;this.ty+=y;return this;},scale:function(x,y){this.a*=x;this.d*=y;this.c*=x;this.b*=y;this.tx*=x;this.ty*=y;return this;},rotate:function(angle){var cos=Math.cos(angle);var sin=Math.sin(angle);var a1=this.a;var c1=this.c;var tx1=this.tx;this.a=a1*cos-this.b*sin;this.b=a1*sin+this.b*cos;this.c=c1*cos-this.d*sin;this.d=c1*sin+this.d*cos;this.tx=tx1*cos-this.ty*sin;this.ty=tx1*sin+this.ty*cos;return this;},append:function(matrix){var a1=this.a;var b1=this.b;var c1=this.c;var d1=this.d;this.a=matrix.a*a1+matrix.b*c1;this.b=matrix.a*b1+matrix.b*d1;this.c=matrix.c*a1+matrix.d*c1;this.d=matrix.c*b1+matrix.d*d1;this.tx=matrix.tx*a1+matrix.ty*c1+this.tx;this.ty=matrix.tx*b1+matrix.ty*d1+this.ty;return this;},identity:function(){return this.setTo(1,0,0,1,0,0);}};Phaser.identityMatrix=new Phaser.Matrix();PIXI.Matrix=Phaser.Matrix;PIXI.identityMatrix=Phaser.identityMatrix;Phaser.Point=function(x,y){x=x||0;y=y||0;this.x=x;this.y=y;this.type=Phaser.POINT;};Phaser.Point.prototype={copyFrom:function(source){return this.setTo(source.x,source.y);},invert:function(){return this.setTo(this.y,this.x);},setTo:function(x,y){this.x=x||0;this.y=y||((y!==0)?this.x:0);return this;},set:function(x,y){this.x=x||0;this.y=y||((y!==0)?this.x:0);return this;},add:function(x,y){this.x+=x;this.y+=y;return this;},subtract:function(x,y){this.x-=x;this.y-=y;return this;},multiply:function(x,y){this.x*=x;this.y*=y;return this;},divide:function(x,y){this.x /=x;this.y /=y;return this;},clampX:function(min,max){this.x=Phaser.Math.clamp(this.x,min,max);return this;},clampY:function(min,max){this.y=Phaser.Math.clamp(this.y,min,max);return this;},clamp:function(min,max){this.x=Phaser.Math.clamp(this.x,min,max);this.y=Phaser.Math.clamp(this.y,min,max);return this;},clone:function(output){if(output===undefined||output===null)
{output=new Phaser.Point(this.x,this.y);}
else
{output.setTo(this.x,this.y);}
return output;},copyTo:function(dest){dest.x=this.x;dest.y=this.y;return dest;},distance:function(dest,round){return Phaser.Point.distance(this,dest,round);},equals:function(a){return(a.x===this.x&&a.y===this.y);},angle:function(a,asDegrees){if(asDegrees===undefined){asDegrees=false;}
if(asDegrees)
{return Phaser.Math.radToDeg(Math.atan2(a.y-this.y,a.x-this.x));}
else
{return Math.atan2(a.y-this.y,a.x-this.x);}},rotate:function(x,y,angle,asDegrees,distance){return Phaser.Point.rotate(this,x,y,angle,asDegrees,distance);},getMagnitude:function(){return Math.sqrt((this.x*this.x)+(this.y*this.y));},getMagnitudeSq:function(){return(this.x*this.x)+(this.y*this.y);},setMagnitude:function(magnitude){return this.normalize().multiply(magnitude,magnitude);},normalize:function(){if(!this.isZero())
{var m=this.getMagnitude();this.x /=m;this.y /=m;}
return this;},isZero:function(){return(this.x===0&&this.y===0);},dot:function(a){return((this.x*a.x)+(this.y*a.y));},cross:function(a){return((this.x*a.y)-(this.y*a.x));},perp:function(){return this.setTo(-this.y,this.x);},rperp:function(){return this.setTo(this.y,-this.x);},normalRightHand:function(){return this.setTo(this.y*-1,this.x);},floor:function(){return this.setTo(Math.floor(this.x),Math.floor(this.y));},ceil:function(){return this.setTo(Math.ceil(this.x),Math.ceil(this.y));},toString:function(){return'[{Point (x='+this.x+' y='+this.y+')}]';}};Phaser.Point.prototype.constructor=Phaser.Point;Phaser.Point.add=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
out.x=a.x+b.x;out.y=a.y+b.y;return out;};Phaser.Point.subtract=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
out.x=a.x-b.x;out.y=a.y-b.y;return out;};Phaser.Point.multiply=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
out.x=a.x*b.x;out.y=a.y*b.y;return out;};Phaser.Point.divide=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
out.x=a.x / b.x;out.y=a.y / b.y;return out;};Phaser.Point.equals=function(a,b){return(a.x===b.x&&a.y===b.y);};Phaser.Point.angle=function(a,b){return Math.atan2(a.y-b.y,a.x-b.x);};Phaser.Point.negative=function(a,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(-a.x,-a.y);};Phaser.Point.multiplyAdd=function(a,b,s,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(a.x+b.x*s,a.y+b.y*s);};Phaser.Point.interpolate=function(a,b,f,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f);};Phaser.Point.perp=function(a,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(-a.y,a.x);};Phaser.Point.rperp=function(a,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(a.y,-a.x);};Phaser.Point.distance=function(a,b,round){var distance=Phaser.Math.distance(a.x,a.y,b.x,b.y);return round?Math.round(distance):distance;};Phaser.Point.project=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
var amt=a.dot(b)/ b.getMagnitudeSq();if(amt!==0)
{out.setTo(amt*b.x,amt*b.y);}
return out;};Phaser.Point.projectUnit=function(a,b,out){if(out===undefined){out=new Phaser.Point();}
var amt=a.dot(b);if(amt!==0)
{out.setTo(amt*b.x,amt*b.y);}
return out;};Phaser.Point.normalRightHand=function(a,out){if(out===undefined){out=new Phaser.Point();}
return out.setTo(a.y*-1,a.x);};Phaser.Point.normalize=function(a,out){if(out===undefined){out=new Phaser.Point();}
var m=a.getMagnitude();if(m!==0)
{out.setTo(a.x / m,a.y / m);}
return out;};Phaser.Point.rotate=function(a,x,y,angle,asDegrees,distance){if(asDegrees){angle=Phaser.Math.degToRad(angle);}
if(distance===undefined)
{a.subtract(x,y);var s=Math.sin(angle);var c=Math.cos(angle);var tx=c*a.x-s*a.y;var ty=s*a.x+c*a.y;a.x=tx+x;a.y=ty+y;}
else
{var t=angle+Math.atan2(a.y-y,a.x-x);a.x=x+distance*Math.cos(t);a.y=y+distance*Math.sin(t);}
return a;};Phaser.Point.centroid=function(points,out){if(out===undefined){out=new Phaser.Point();}
if(Object.prototype.toString.call(points)!=='[object Array]')
{throw new Error("Phaser.Point. Parameter 'points' must be an array");}
var pointslength=points.length;if(pointslength<1)
{throw new Error("Phaser.Point. Parameter 'points' array must not be empty");}
if(pointslength===1)
{out.copyFrom(points[0]);return out;}
for(var i=0;i<pointslength;i++)
{Phaser.Point.add(out,points[i],out);}
out.divide(pointslength,pointslength);return out;};Phaser.Point.parse=function(obj,xProp,yProp){xProp=xProp||'x';yProp=yProp||'y';var point=new Phaser.Point();if(obj[xProp])
{point.x=parseInt(obj[xProp],10);}
if(obj[yProp])
{point.y=parseInt(obj[yProp],10);}
return point;};PIXI.Point=Phaser.Point;Phaser.Polygon=function(){this.area=0;this._points=[];if(arguments.length>0)
{this.setTo.apply(this,arguments);}
this.closed=true;this.type=Phaser.POLYGON;};Phaser.Polygon.prototype={toNumberArray:function(output){if(output===undefined){output=[];}
for(var i=0;i<this._points.length;i++)
{if(typeof this._points[i]==='number')
{output.push(this._points[i]);output.push(this._points[i+1]);i++;}
else
{output.push(this._points[i].x);output.push(this._points[i].y);}}
return output;},flatten:function(){this._points=this.toNumberArray();return this;},clone:function(output){var points=this._points.slice();if(output===undefined||output===null)
{output=new Phaser.Polygon(points);}
else
{output.setTo(points);}
return output;},contains:function(x,y){var length=this._points.length;var inside=false;for(var i=-1,j=length-1;++i<length;j=i)
{var ix=this._points[i].x;var iy=this._points[i].y;var jx=this._points[j].x;var jy=this._points[j].y;if(((iy<=y&&y<jy)||(jy<=y&&y<iy))&&(x<(jx-ix)*(y-iy)/(jy-iy)+ix))
{inside=!inside;}}
return inside;},setTo:function(points){this.area=0;this._points=[];if(arguments.length>0)
{if(!Array.isArray(points))
{points=Array.prototype.slice.call(arguments);}
var y0=Number.MAX_VALUE;for(var i=0,len=points.length;i<len;i++)
{if(typeof points[i]==='number')
{var p=new PIXI.Point(points[i],points[i+1]);i++;}
else
{var p=new PIXI.Point(points[i].x,points[i].y);}
this._points.push(p);if(p.y<y0)
{y0=p.y;}}
this.calculateArea(y0);}
return this;},calculateArea:function(y0){var p1;var p2;var avgHeight;var width;for(var i=0,len=this._points.length;i<len;i++)
{p1=this._points[i];if(i===len-1)
{p2=this._points[0];}
else
{p2=this._points[i+1];}
avgHeight=((p1.y-y0)+(p2.y-y0))/ 2;width=p1.x-p2.x;this.area+=avgHeight*width;}
return this.area;}};Phaser.Polygon.prototype.constructor=Phaser.Polygon;Object.defineProperty(Phaser.Polygon.prototype,'points',{get:function(){return this._points;},set:function(points){if(points!=null)
{this.setTo(points);}
else
{this.setTo();}}});PIXI.Polygon=Phaser.Polygon;Phaser.Rectangle=function(x,y,width,height){x=x||0;y=y||0;width=width||0;height=height||0;this.x=x;this.y=y;this.width=width;this.height=height;this.type=Phaser.RECTANGLE;};Phaser.Rectangle.prototype={offset:function(dx,dy){this.x+=dx;this.y+=dy;return this;},offsetPoint:function(point){return this.offset(point.x,point.y);},setTo:function(x,y,width,height){this.x=x;this.y=y;this.width=width;this.height=height;return this;},scale:function(x,y){if(y===undefined){y=x;}
this.width*=x;this.height*=y;return this;},centerOn:function(x,y){this.centerX=x;this.centerY=y;return this;},floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);},floorAll:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.width=Math.floor(this.width);this.height=Math.floor(this.height);},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);},ceilAll:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);},copyFrom:function(source){return this.setTo(source.x,source.y,source.width,source.height);},copyTo:function(dest){dest.x=this.x;dest.y=this.y;dest.width=this.width;dest.height=this.height;return dest;},inflate:function(dx,dy){return Phaser.Rectangle.inflate(this,dx,dy);},size:function(output){return Phaser.Rectangle.size(this,output);},resize:function(width,height){this.width=width;this.height=height;return this;},clone:function(output){return Phaser.Rectangle.clone(this,output);},contains:function(x,y){return Phaser.Rectangle.contains(this,x,y);},containsRect:function(b){return Phaser.Rectangle.containsRect(b,this);},equals:function(b){return Phaser.Rectangle.equals(this,b);},intersection:function(b,out){return Phaser.Rectangle.intersection(this,b,out);},intersects:function(b){return Phaser.Rectangle.intersects(this,b);},intersectsRaw:function(left,right,top,bottom,tolerance){return Phaser.Rectangle.intersectsRaw(this,left,right,top,bottom,tolerance);},union:function(b,out){return Phaser.Rectangle.union(this,b,out);},random:function(out){if(out===undefined){out=new Phaser.Point();}
out.x=this.randomX;out.y=this.randomY;return out;},toString:function(){return"[{Rectangle (x="+this.x+" y="+this.y+" width="+this.width+" height="+this.height+" empty="+this.empty+")}]";}};Object.defineProperty(Phaser.Rectangle.prototype,"halfWidth",{get:function(){return Math.round(this.width / 2);}});Object.defineProperty(Phaser.Rectangle.prototype,"halfHeight",{get:function(){return Math.round(this.height / 2);}});Object.defineProperty(Phaser.Rectangle.prototype,"bottom",{get:function(){return this.y+this.height;},set:function(value){if(value<=this.y)
{this.height=0;}
else
{this.height=value-this.y;}}});Object.defineProperty(Phaser.Rectangle.prototype,"bottomLeft",{get:function(){return new Phaser.Point(this.x,this.bottom);},set:function(value){this.x=value.x;this.bottom=value.y;}});Object.defineProperty(Phaser.Rectangle.prototype,"bottomRight",{get:function(){return new Phaser.Point(this.right,this.bottom);},set:function(value){this.right=value.x;this.bottom=value.y;}});Object.defineProperty(Phaser.Rectangle.prototype,"left",{get:function(){return this.x;},set:function(value){if(value>=this.right){this.width=0;}else{this.width=this.right-value;}
this.x=value;}});Object.defineProperty(Phaser.Rectangle.prototype,"right",{get:function(){return this.x+this.width;},set:function(value){if(value<=this.x){this.width=0;}else{this.width=value-this.x;}}});Object.defineProperty(Phaser.Rectangle.prototype,"volume",{get:function(){return this.width*this.height;}});Object.defineProperty(Phaser.Rectangle.prototype,"perimeter",{get:function(){return(this.width*2)+(this.height*2);}});Object.defineProperty(Phaser.Rectangle.prototype,"centerX",{get:function(){return this.x+this.halfWidth;},set:function(value){this.x=value-this.halfWidth;}});Object.defineProperty(Phaser.Rectangle.prototype,"centerY",{get:function(){return this.y+this.halfHeight;},set:function(value){this.y=value-this.halfHeight;}});Object.defineProperty(Phaser.Rectangle.prototype,"randomX",{get:function(){return this.x+(Math.random()*this.width);}});Object.defineProperty(Phaser.Rectangle.prototype,"randomY",{get:function(){return this.y+(Math.random()*this.height);}});Object.defineProperty(Phaser.Rectangle.prototype,"top",{get:function(){return this.y;},set:function(value){if(value>=this.bottom){this.height=0;this.y=value;}else{this.height=(this.bottom-value);}}});Object.defineProperty(Phaser.Rectangle.prototype,"topLeft",{get:function(){return new Phaser.Point(this.x,this.y);},set:function(value){this.x=value.x;this.y=value.y;}});Object.defineProperty(Phaser.Rectangle.prototype,"topRight",{get:function(){return new Phaser.Point(this.x+this.width,this.y);},set:function(value){this.right=value.x;this.y=value.y;}});Object.defineProperty(Phaser.Rectangle.prototype,"empty",{get:function(){return(!this.width||!this.height);},set:function(value){if(value===true)
{this.setTo(0,0,0,0);}}});Phaser.Rectangle.prototype.constructor=Phaser.Rectangle;Phaser.Rectangle.inflate=function(a,dx,dy){a.x-=dx;a.width+=2*dx;a.y-=dy;a.height+=2*dy;return a;};Phaser.Rectangle.inflatePoint=function(a,point){return Phaser.Rectangle.inflate(a,point.x,point.y);};Phaser.Rectangle.size=function(a,output){if(output===undefined||output===null)
{output=new Phaser.Point(a.width,a.height);}
else
{output.setTo(a.width,a.height);}
return output;};Phaser.Rectangle.clone=function(a,output){if(output===undefined||output===null)
{output=new Phaser.Rectangle(a.x,a.y,a.width,a.height);}
else
{output.setTo(a.x,a.y,a.width,a.height);}
return output;};Phaser.Rectangle.contains=function(a,x,y){if(a.width<=0||a.height<=0)
{return false;}
return(x>=a.x&&x<a.right&&y>=a.y&&y<a.bottom);};Phaser.Rectangle.containsRaw=function(rx,ry,rw,rh,x,y){return(x>=rx&&x<(rx+rw)&&y>=ry&&y<(ry+rh));};Phaser.Rectangle.containsPoint=function(a,point){return Phaser.Rectangle.contains(a,point.x,point.y);};Phaser.Rectangle.containsRect=function(a,b){if(a.volume>b.volume)
{return false;}
return(a.x>=b.x&&a.y>=b.y&&a.right<b.right&&a.bottom<b.bottom);};Phaser.Rectangle.equals=function(a,b){return(a.x==b.x&&a.y==b.y&&a.width==b.width&&a.height==b.height);};Phaser.Rectangle.sameDimensions=function(a,b){return(a.width===b.width&&a.height===b.height);};Phaser.Rectangle.intersection=function(a,b,output){if(output===undefined)
{output=new Phaser.Rectangle();}
if(Phaser.Rectangle.intersects(a,b))
{output.x=Math.max(a.x,b.x);output.y=Math.max(a.y,b.y);output.width=Math.min(a.right,b.right)-output.x;output.height=Math.min(a.bottom,b.bottom)-output.y;}
return output;};Phaser.Rectangle.intersects=function(a,b){if(a.width<=0||a.height<=0||b.width<=0||b.height<=0)
{return false;}
return!(a.right<b.x||a.bottom<b.y||a.x>b.right||a.y>b.bottom);};Phaser.Rectangle.intersectsRaw=function(a,left,right,top,bottom,tolerance){if(tolerance===undefined){tolerance=0;}
return!(left>a.right+tolerance||right<a.left-tolerance||top>a.bottom+tolerance||bottom<a.top-tolerance);};Phaser.Rectangle.union=function(a,b,output){if(output===undefined)
{output=new Phaser.Rectangle();}
return output.setTo(Math.min(a.x,b.x),Math.min(a.y,b.y),Math.max(a.right,b.right)-Math.min(a.left,b.left),Math.max(a.bottom,b.bottom)-Math.min(a.top,b.top));};Phaser.Rectangle.aabb=function(points,out){if(out===undefined){out=new Phaser.Rectangle();}
var xMax=Number.MIN_VALUE,xMin=Number.MAX_VALUE,yMax=Number.MIN_VALUE,yMin=Number.MAX_VALUE;points.forEach(function(point){if(point.x>xMax){xMax=point.x;}
if(point.x<xMin){xMin=point.x;}
if(point.y>yMax){yMax=point.y;}
if(point.y<yMin){yMin=point.y;}});out.setTo(xMin,yMin,xMax-xMin,yMax-yMin);return out;};PIXI.Rectangle=Phaser.Rectangle;PIXI.EmptyRectangle=new Phaser.Rectangle(0,0,0,0);Phaser.RoundedRectangle=function(x,y,width,height,radius)
{if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=0;}
if(height===undefined){height=0;}
if(radius===undefined){radius=20;}
this.x=x;this.y=y;this.width=width;this.height=height;this.radius=radius||20;this.type=Phaser.ROUNDEDRECTANGLE;};Phaser.RoundedRectangle.prototype={clone:function(){return new Phaser.RoundedRectangle(this.x,this.y,this.width,this.height,this.radius);},contains:function(x,y){if(this.width<=0||this.height<=0)
{return false;}
var x1=this.x;if(x>=x1&&x<=x1+this.width)
{var y1=this.y;if(y>=y1&&y<=y1+this.height)
{return true;}}
return false;}};Phaser.RoundedRectangle.prototype.constructor=Phaser.RoundedRectangle;PIXI.RoundedRectangle=Phaser.RoundedRectangle;Phaser.Camera=function(game,id,x,y,width,height){this.game=game;this.world=game.world;this.id=0;this.view=new Phaser.Rectangle(x,y,width,height);this.bounds=new Phaser.Rectangle(x,y,width,height);this.deadzone=null;this.visible=true;this.roundPx=true;this.atLimit={x:false,y:false};this.target=null;this.displayObject=null;this.scale=null;this.totalInView=0;this._targetPosition=new Phaser.Point();this._edge=0;this._position=new Phaser.Point();};Phaser.Camera.FOLLOW_LOCKON=0;Phaser.Camera.FOLLOW_PLATFORMER=1;Phaser.Camera.FOLLOW_TOPDOWN=2;Phaser.Camera.FOLLOW_TOPDOWN_TIGHT=3;Phaser.Camera.prototype={preUpdate:function(){this.totalInView=0;},follow:function(target,style){if(style===undefined){style=Phaser.Camera.FOLLOW_LOCKON;}
this.target=target;var helper;switch(style){case Phaser.Camera.FOLLOW_PLATFORMER:var w=this.width / 8;var h=this.height / 3;this.deadzone=new Phaser.Rectangle((this.width-w)/ 2,(this.height-h)/ 2-h*0.25,w,h);break;case Phaser.Camera.FOLLOW_TOPDOWN:helper=Math.max(this.width,this.height)/ 4;this.deadzone=new Phaser.Rectangle((this.width-helper)/ 2,(this.height-helper)/ 2,helper,helper);break;case Phaser.Camera.FOLLOW_TOPDOWN_TIGHT:helper=Math.max(this.width,this.height)/ 8;this.deadzone=new Phaser.Rectangle((this.width-helper)/ 2,(this.height-helper)/ 2,helper,helper);break;case Phaser.Camera.FOLLOW_LOCKON:this.deadzone=null;break;default:this.deadzone=null;break;}},unfollow:function(){this.target=null;},focusOn:function(displayObject){this.setPosition(Math.round(displayObject.x-this.view.halfWidth),Math.round(displayObject.y-this.view.halfHeight));},focusOnXY:function(x,y){this.setPosition(Math.round(x-this.view.halfWidth),Math.round(y-this.view.halfHeight));},update:function(){if(this.target)
{this.updateTarget();}
if(this.bounds)
{this.checkBounds();}
if(this.roundPx)
{this.view.floor();}
this.displayObject.position.x=-this.view.x;this.displayObject.position.y=-this.view.y;},updateTarget:function(){this._targetPosition.copyFrom(this.target);if(this.target.parent)
{this._targetPosition.multiply(this.target.parent.worldTransform.a,this.target.parent.worldTransform.d);}
if(this.deadzone)
{this._edge=this._targetPosition.x-this.view.x;if(this._edge<this.deadzone.left)
{this.view.x=this._targetPosition.x-this.deadzone.left;}
else if(this._edge>this.deadzone.right)
{this.view.x=this._targetPosition.x-this.deadzone.right;}
this._edge=this._targetPosition.y-this.view.y;if(this._edge<this.deadzone.top)
{this.view.y=this._targetPosition.y-this.deadzone.top;}
else if(this._edge>this.deadzone.bottom)
{this.view.y=this._targetPosition.y-this.deadzone.bottom;}}
else
{this.view.x=this._targetPosition.x-this.view.halfWidth;this.view.y=this._targetPosition.y-this.view.halfHeight;}},setBoundsToWorld:function(){if(this.bounds)
{this.bounds.copyFrom(this.game.world.bounds);}},checkBounds:function(){this.atLimit.x=false;this.atLimit.y=false;if(this.view.x<=this.bounds.x)
{this.atLimit.x=true;this.view.x=this.bounds.x;}
if(this.view.right>=this.bounds.right)
{this.atLimit.x=true;this.view.x=this.bounds.right-this.width;}
if(this.view.y<=this.bounds.top)
{this.atLimit.y=true;this.view.y=this.bounds.top;}
if(this.view.bottom>=this.bounds.bottom)
{this.atLimit.y=true;this.view.y=this.bounds.bottom-this.height;}},setPosition:function(x,y){this.view.x=x;this.view.y=y;if(this.bounds)
{this.checkBounds();}},setSize:function(width,height){this.view.width=width;this.view.height=height;},reset:function(){this.target=null;this.view.x=0;this.view.y=0;}};Phaser.Camera.prototype.constructor=Phaser.Camera;Object.defineProperty(Phaser.Camera.prototype,"x",{get:function(){return this.view.x;},set:function(value){this.view.x=value;if(this.bounds)
{this.checkBounds();}}});Object.defineProperty(Phaser.Camera.prototype,"y",{get:function(){return this.view.y;},set:function(value){this.view.y=value;if(this.bounds)
{this.checkBounds();}}});Object.defineProperty(Phaser.Camera.prototype,"position",{get:function(){this._position.set(this.view.centerX,this.view.centerY);return this._position;},set:function(value){if(typeof value.x!=="undefined"){this.view.x=value.x;}
if(typeof value.y!=="undefined"){this.view.y=value.y;}
if(this.bounds)
{this.checkBounds();}}});Object.defineProperty(Phaser.Camera.prototype,"width",{get:function(){return this.view.width;},set:function(value){this.view.width=value;}});Object.defineProperty(Phaser.Camera.prototype,"height",{get:function(){return this.view.height;},set:function(value){this.view.height=value;}});Phaser.State=function(){this.game=null;this.key='';this.add=null;this.make=null;this.camera=null;this.cache=null;this.input=null;this.load=null;this.math=null;this.sound=null;this.scale=null;this.stage=null;this.time=null;this.tweens=null;this.world=null;this.particles=null;this.physics=null;this.rnd=null;};Phaser.State.prototype={init:function(){},preload:function(){},loadUpdate:function(){},loadRender:function(){},create:function(){},update:function(){},preRender:function(){},render:function(){},resize:function(){},paused:function(){},resumed:function(){},pauseUpdate:function(){},shutdown:function(){}};Phaser.State.prototype.constructor=Phaser.State;Phaser.StateManager=function(game,pendingState){this.game=game;this.states={};this._pendingState=null;if(typeof pendingState!=='undefined'&&pendingState!==null)
{this._pendingState=pendingState;}
this._clearWorld=false;this._clearCache=false;this._created=false;this._args=[];this.current='';this.onStateChange=new Phaser.Signal();this.onInitCallback=null;this.onPreloadCallback=null;this.onCreateCallback=null;this.onUpdateCallback=null;this.onRenderCallback=null;this.onResizeCallback=null;this.onPreRenderCallback=null;this.onLoadUpdateCallback=null;this.onLoadRenderCallback=null;this.onPausedCallback=null;this.onResumedCallback=null;this.onPauseUpdateCallback=null;this.onShutDownCallback=null;};Phaser.StateManager.prototype={boot:function(){this.game.onPause.add(this.pause,this);this.game.onResume.add(this.resume,this);if(this._pendingState!==null&&typeof this._pendingState!=='string')
{this.add('default',this._pendingState,true);}},add:function(key,state,autoStart){if(autoStart===undefined){autoStart=false;}
var newState;if(state instanceof Phaser.State)
{newState=state;}
else if(typeof state==='object')
{newState=state;newState.game=this.game;}
else if(typeof state==='function')
{newState=new state(this.game);}
this.states[key]=newState;if(autoStart)
{if(this.game.isBooted)
{this.start(key);}
else
{this._pendingState=key;}}
return newState;},remove:function(key){if(this.current===key)
{this.callbackContext=null;this.onInitCallback=null;this.onShutDownCallback=null;this.onPreloadCallback=null;this.onLoadRenderCallback=null;this.onLoadUpdateCallback=null;this.onCreateCallback=null;this.onUpdateCallback=null;this.onPreRenderCallback=null;this.onRenderCallback=null;this.onResizeCallback=null;this.onPausedCallback=null;this.onResumedCallback=null;this.onPauseUpdateCallback=null;}
delete this.states[key];},start:function(key,clearWorld,clearCache){if(clearWorld===undefined){clearWorld=true;}
if(clearCache===undefined){clearCache=false;}
if(this.checkState(key))
{this._pendingState=key;this._clearWorld=clearWorld;this._clearCache=clearCache;if(arguments.length>3)
{this._args=Array.prototype.splice.call(arguments,3);}}},restart:function(clearWorld,clearCache){if(clearWorld===undefined){clearWorld=true;}
if(clearCache===undefined){clearCache=false;}
this._pendingState=this.current;this._clearWorld=clearWorld;this._clearCache=clearCache;if(arguments.length>2)
{this._args=Array.prototype.slice.call(arguments,2);}},dummy:function(){},preUpdate:function(){if(this._pendingState&&this.game.isBooted)
{var previousStateKey=this.current;this.clearCurrentState();this.setCurrentState(this._pendingState);this.onStateChange.dispatch(this.current,previousStateKey);if(this.current!==this._pendingState)
{return;}
else
{this._pendingState=null;}
if(this.onPreloadCallback)
{this.game.load.reset(true);this.onPreloadCallback.call(this.callbackContext,this.game);if(this.game.load.totalQueuedFiles()===0&&this.game.load.totalQueuedPacks()===0)
{this.loadComplete();}
else
{this.game.load.start();}}
else
{this.loadComplete();}}},clearCurrentState:function(){if(this.current)
{if(this.onShutDownCallback)
{this.onShutDownCallback.call(this.callbackContext,this.game);}
this.game.tweens.removeAll();this.game.camera.reset();this.game.input.reset(true);this.game.physics.clear();this.game.time.removeAll();this.game.scale.reset(this._clearWorld);if(this.game.debug)
{this.game.debug.reset();}
if(this._clearWorld)
{this.game.world.shutdown();if(this._clearCache===true)
{this.game.cache.destroy();}}}},checkState:function(key){if(this.states[key])
{var valid=false;if(this.states[key]['preload']||this.states[key]['create']||this.states[key]['update']||this.states[key]['render'])
{valid=true;}
if(valid===false)
{console.warn("Invalid Phaser State object given. Must contain at least a one of the required functions: preload, create, update or render");return false;}
return true;}
else
{console.warn("Phaser.StateManager - No state found with the key: "+key);return false;}},link:function(key){this.states[key].game=this.game;this.states[key].add=this.game.add;this.states[key].make=this.game.make;this.states[key].camera=this.game.camera;this.states[key].cache=this.game.cache;this.states[key].input=this.game.input;this.states[key].load=this.game.load;this.states[key].math=this.game.math;this.states[key].sound=this.game.sound;this.states[key].scale=this.game.scale;this.states[key].state=this;this.states[key].stage=this.game.stage;this.states[key].time=this.game.time;this.states[key].tweens=this.game.tweens;this.states[key].world=this.game.world;this.states[key].particles=this.game.particles;this.states[key].rnd=this.game.rnd;this.states[key].physics=this.game.physics;this.states[key].key=key;},unlink:function(key){if(this.states[key])
{this.states[key].game=null;this.states[key].add=null;this.states[key].make=null;this.states[key].camera=null;this.states[key].cache=null;this.states[key].input=null;this.states[key].load=null;this.states[key].math=null;this.states[key].sound=null;this.states[key].scale=null;this.states[key].state=null;this.states[key].stage=null;this.states[key].time=null;this.states[key].tweens=null;this.states[key].world=null;this.states[key].particles=null;this.states[key].rnd=null;this.states[key].physics=null;}},setCurrentState:function(key){this.callbackContext=this.states[key];this.link(key);this.onInitCallback=this.states[key]['init']||this.dummy;this.onPreloadCallback=this.states[key]['preload']||null;this.onLoadRenderCallback=this.states[key]['loadRender']||null;this.onLoadUpdateCallback=this.states[key]['loadUpdate']||null;this.onCreateCallback=this.states[key]['create']||null;this.onUpdateCallback=this.states[key]['update']||null;this.onPreRenderCallback=this.states[key]['preRender']||null;this.onRenderCallback=this.states[key]['render']||null;this.onResizeCallback=this.states[key]['resize']||null;this.onPausedCallback=this.states[key]['paused']||null;this.onResumedCallback=this.states[key]['resumed']||null;this.onPauseUpdateCallback=this.states[key]['pauseUpdate']||null;this.onShutDownCallback=this.states[key]['shutdown']||this.dummy;if(this.current!=='')
{this.game.physics.reset();}
this.current=key;this._created=false;this.onInitCallback.apply(this.callbackContext,this._args);if(key===this._pendingState)
{this._args=[];}
this.game._kickstart=true;},getCurrentState:function(){return this.states[this.current];},loadComplete:function(){if(this._created===false&&this.onCreateCallback)
{this._created=true;this.onCreateCallback.call(this.callbackContext,this.game);}
else
{this._created=true;}},pause:function(){if(this._created&&this.onPausedCallback)
{this.onPausedCallback.call(this.callbackContext,this.game);}},resume:function(){if(this._created&&this.onResumedCallback)
{this.onResumedCallback.call(this.callbackContext,this.game);}},update:function(){if(this._created)
{if(this.onUpdateCallback)
{this.onUpdateCallback.call(this.callbackContext,this.game);}}
else
{if(this.onLoadUpdateCallback)
{this.onLoadUpdateCallback.call(this.callbackContext,this.game);}}},pauseUpdate:function(){if(this._created)
{if(this.onPauseUpdateCallback)
{this.onPauseUpdateCallback.call(this.callbackContext,this.game);}}
else
{if(this.onLoadUpdateCallback)
{this.onLoadUpdateCallback.call(this.callbackContext,this.game);}}},preRender:function(elapsedTime){if(this._created&&this.onPreRenderCallback)
{this.onPreRenderCallback.call(this.callbackContext,this.game,elapsedTime);}},resize:function(width,height){if(this.onResizeCallback)
{this.onResizeCallback.call(this.callbackContext,width,height);}},render:function(){if(this._created)
{if(this.onRenderCallback)
{if(this.game.renderType===Phaser.CANVAS)
{this.game.context.save();this.game.context.setTransform(1,0,0,1,0,0);this.onRenderCallback.call(this.callbackContext,this.game);this.game.context.restore();}
else
{this.onRenderCallback.call(this.callbackContext,this.game);}}}
else
{if(this.onLoadRenderCallback)
{this.onLoadRenderCallback.call(this.callbackContext,this.game);}}},destroy:function(){this.clearCurrentState();this.callbackContext=null;this.onInitCallback=null;this.onShutDownCallback=null;this.onPreloadCallback=null;this.onLoadRenderCallback=null;this.onLoadUpdateCallback=null;this.onCreateCallback=null;this.onUpdateCallback=null;this.onRenderCallback=null;this.onPausedCallback=null;this.onResumedCallback=null;this.onPauseUpdateCallback=null;this.game=null;this.states={};this._pendingState=null;this.current='';}};Phaser.StateManager.prototype.constructor=Phaser.StateManager;Object.defineProperty(Phaser.StateManager.prototype,"created",{get:function(){return this._created;}});Phaser.Signal=function(){};Phaser.Signal.prototype={_bindings:null,_prevParams:null,memorize:false,_shouldPropagate:true,active:true,_boundDispatch:true,validateListener:function(listener,fnName){if(typeof listener!=='function')
{throw new Error('Phaser.Signal: listener is a required param of {fn}() and should be a Function.'.replace('{fn}',fnName));}},_registerListener:function(listener,isOnce,listenerContext,priority,args){var prevIndex=this._indexOfListener(listener,listenerContext);var binding;if(prevIndex!==-1)
{binding=this._bindings[prevIndex];if(binding.isOnce()!==isOnce)
{throw new Error('You cannot add'+(isOnce?'':'Once')+'() then add'+(!isOnce?'':'Once')+'() the same listener without removing the relationship first.');}}
else
{binding=new Phaser.SignalBinding(this,listener,isOnce,listenerContext,priority,args);this._addBinding(binding);}
if(this.memorize&&this._prevParams)
{binding.execute(this._prevParams);}
return binding;},_addBinding:function(binding){if(!this._bindings)
{this._bindings=[];}
var n=this._bindings.length;do{n--;}
while(this._bindings[n]&&binding._priority<=this._bindings[n]._priority);this._bindings.splice(n+1,0,binding);},_indexOfListener:function(listener,context){if(!this._bindings)
{return-1;}
if(context===undefined){context=null;}
var n=this._bindings.length;var cur;while(n--)
{cur=this._bindings[n];if(cur._listener===listener&&cur.context===context)
{return n;}}
return-1;},has:function(listener,context){return this._indexOfListener(listener,context)!==-1;},add:function(listener,listenerContext,priority){this.validateListener(listener,'add');var args=[];if(arguments.length>3)
{for(var i=3;i<arguments.length;i++)
{args.push(arguments[i]);}}
return this._registerListener(listener,false,listenerContext,priority,args);},addOnce:function(listener,listenerContext,priority){this.validateListener(listener,'addOnce');var args=[];if(arguments.length>3)
{for(var i=3;i<arguments.length;i++)
{args.push(arguments[i]);}}
return this._registerListener(listener,true,listenerContext,priority,args);},remove:function(listener,context){this.validateListener(listener,'remove');var i=this._indexOfListener(listener,context);if(i!==-1)
{this._bindings[i]._destroy();this._bindings.splice(i,1);}
return listener;},removeAll:function(context){if(context===undefined){context=null;}
if(!this._bindings)
{return;}
var n=this._bindings.length;while(n--)
{if(context)
{if(this._bindings[n].context===context)
{this._bindings[n]._destroy();this._bindings.splice(n,1);}}
else
{this._bindings[n]._destroy();}}
if(!context)
{this._bindings.length=0;}},getNumListeners:function(){return this._bindings?this._bindings.length:0;},halt:function(){this._shouldPropagate=false;},dispatch:function(){if(!this.active||!this._bindings)
{return;}
var paramsArr=Array.prototype.slice.call(arguments);var n=this._bindings.length;var bindings;if(this.memorize)
{this._prevParams=paramsArr;}
if(!n)
{return;}
bindings=this._bindings.slice();this._shouldPropagate=true;do{n--;}
while(bindings[n]&&this._shouldPropagate&&bindings[n].execute(paramsArr)!==false);},forget:function(){if(this._prevParams)
{this._prevParams=null;}},dispose:function(){this.removeAll();this._bindings=null;if(this._prevParams)
{this._prevParams=null;}},toString:function(){return'[Phaser.Signal active:'+this.active+' numListeners:'+this.getNumListeners()+']';}};Object.defineProperty(Phaser.Signal.prototype,"boundDispatch",{get:function(){var _this=this;return this._boundDispatch||(this._boundDispatch=function(){return _this.dispatch.apply(_this,arguments);});}});Phaser.Signal.prototype.constructor=Phaser.Signal;Phaser.SignalBinding=function(signal,listener,isOnce,listenerContext,priority,args){this._listener=listener;if(isOnce)
{this._isOnce=true;}
if(listenerContext!=null)
{this.context=listenerContext;}
this._signal=signal;if(priority)
{this._priority=priority;}
if(args&&args.length)
{this._args=args;}};Phaser.SignalBinding.prototype={context:null,_isOnce:false,_priority:0,_args:null,callCount:0,active:true,params:null,execute:function(paramsArr){var handlerReturn,params;if(this.active&&!!this._listener)
{params=this.params?this.params.concat(paramsArr):paramsArr;if(this._args)
{params=params.concat(this._args);}
handlerReturn=this._listener.apply(this.context,params);this.callCount++;if(this._isOnce)
{this.detach();}}
return handlerReturn;},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null;},isBound:function(){return(!!this._signal&&!!this._listener);},isOnce:function(){return this._isOnce;},getListener:function(){return this._listener;},getSignal:function(){return this._signal;},_destroy:function(){delete this._signal;delete this._listener;delete this.context;},toString:function(){return'[Phaser.SignalBinding isOnce:'+this._isOnce+', isBound:'+this.isBound()+', active:'+this.active+']';}};Phaser.SignalBinding.prototype.constructor=Phaser.SignalBinding;Phaser.Filter=function(game,uniforms,fragmentSrc){this.game=game;this.type=Phaser.WEBGL_FILTER;this.passes=[this];this.shaders=[];this.dirty=true;this.padding=0;this.prevPoint=new Phaser.Point();var d=new Date();this.uniforms={resolution:{type:'2f',value:{x:256,y:256}},time:{type:'1f',value:0},mouse:{type:'2f',value:{x:0.0,y:0.0}},date:{type:'4fv',value:[d.getFullYear(),d.getMonth(),d.getDate(),d.getHours()*60*60+d.getMinutes()*60+d.getSeconds()]},sampleRate:{type:'1f',value:44100.0},iChannel0:{type:'sampler2D',value:null,textureData:{repeat:true}},iChannel1:{type:'sampler2D',value:null,textureData:{repeat:true}},iChannel2:{type:'sampler2D',value:null,textureData:{repeat:true}},iChannel3:{type:'sampler2D',value:null,textureData:{repeat:true}}};if(uniforms)
{for(var key in uniforms)
{this.uniforms[key]=uniforms[key];}}
this.fragmentSrc=fragmentSrc||'';};Phaser.Filter.prototype={init:function(){},setResolution:function(width,height){this.uniforms.resolution.value.x=width;this.uniforms.resolution.value.y=height;},update:function(pointer){if(typeof pointer!=='undefined')
{var x=pointer.x / this.game.width;var y=1-pointer.y / this.game.height;if(x!==this.prevPoint.x||y!==this.prevPoint.y)
{this.uniforms.mouse.value.x=x.toFixed(2);this.uniforms.mouse.value.y=y.toFixed(2);this.prevPoint.set(x,y);}}
this.uniforms.time.value=this.game.time.totalElapsedSeconds();},addToWorld:function(x,y,width,height,anchorX,anchorY){if(anchorX===undefined){anchorX=0;}
if(anchorY===undefined){anchorY=0;}
if(width!==undefined&&width!==null)
{this.width=width;}
else
{width=this.width;}
if(height!==undefined&&height!==null)
{this.height=height;}
else
{height=this.height;}
var image=this.game.add.image(x,y,'__default');image.width=width;image.height=height;image.anchor.set(anchorX,anchorY);image.filters=[this];return image;},destroy:function(){this.game=null;}};Phaser.Filter.prototype.constructor=Phaser.Filter;Object.defineProperty(Phaser.Filter.prototype,'width',{get:function(){return this.uniforms.resolution.value.x;},set:function(value){this.uniforms.resolution.value.x=value;}});Object.defineProperty(Phaser.Filter.prototype,'height',{get:function(){return this.uniforms.resolution.value.y;},set:function(value){this.uniforms.resolution.value.y=value;}});Phaser.Plugin=function(game,parent){if(parent===undefined){parent=null;}
this.game=game;this.parent=parent;this.active=false;this.visible=false;this.hasPreUpdate=false;this.hasUpdate=false;this.hasPostUpdate=false;this.hasRender=false;this.hasPostRender=false;};Phaser.Plugin.prototype={preUpdate:function(){},update:function(){},render:function(){},postRender:function(){},destroy:function(){this.game=null;this.parent=null;this.active=false;this.visible=false;}};Phaser.Plugin.prototype.constructor=Phaser.Plugin;Phaser.PluginManager=function(game){this.game=game;this.plugins=[];this._len=0;this._i=0;};Phaser.PluginManager.prototype={add:function(plugin){var args=Array.prototype.slice.call(arguments,1);var result=false;if(typeof plugin==='function')
{plugin=new plugin(this.game,this);}
else
{plugin.game=this.game;plugin.parent=this;}
if(typeof plugin['preUpdate']==='function')
{plugin.hasPreUpdate=true;result=true;}
if(typeof plugin['update']==='function')
{plugin.hasUpdate=true;result=true;}
if(typeof plugin['postUpdate']==='function')
{plugin.hasPostUpdate=true;result=true;}
if(typeof plugin['render']==='function')
{plugin.hasRender=true;result=true;}
if(typeof plugin['postRender']==='function')
{plugin.hasPostRender=true;result=true;}
if(result)
{if(plugin.hasPreUpdate||plugin.hasUpdate||plugin.hasPostUpdate)
{plugin.active=true;}
if(plugin.hasRender||plugin.hasPostRender)
{plugin.visible=true;}
this._len=this.plugins.push(plugin);if(typeof plugin['init']==='function')
{plugin.init.apply(plugin,args);}
return plugin;}
else
{return null;}},remove:function(plugin){this._i=this._len;while(this._i--)
{if(this.plugins[this._i]===plugin)
{plugin.destroy();this.plugins.splice(this._i,1);this._len--;return;}}},removeAll:function(){this._i=this._len;while(this._i--)
{this.plugins[this._i].destroy();}
this.plugins.length=0;this._len=0;},preUpdate:function(){this._i=this._len;while(this._i--)
{if(this.plugins[this._i].active&&this.plugins[this._i].hasPreUpdate)
{this.plugins[this._i].preUpdate();}}},update:function(){this._i=this._len;while(this._i--)
{if(this.plugins[this._i].active&&this.plugins[this._i].hasUpdate)
{this.plugins[this._i].update();}}},postUpdate:function(){this._i=this._len;while(this._i--)
{if(this.plugins[this._i].active&&this.plugins[this._i].hasPostUpdate)
{this.plugins[this._i].postUpdate();}}},render:function(){this._i=this._len;while(this._i--)
{if(this.plugins[this._i].visible&&this.plugins[this._i].hasRender)
{this.plugins[this._i].render();}}},postRender:function(){this._i=this._len;while(this._i--)
{if(this.plugins[this._i].visible&&this.plugins[this._i].hasPostRender)
{this.plugins[this._i].postRender();}}},destroy:function(){this.removeAll();this.game=null;}};Phaser.PluginManager.prototype.constructor=Phaser.PluginManager;Phaser.Stage=function(game){this.game=game;PIXI.DisplayObjectContainer.call(this);this.name='_stage_root';this.disableVisibilityChange=false;this.exists=true;this.worldTransform=new PIXI.Matrix();this.stage=this;this.currentRenderOrderID=0;this._hiddenVar='hidden';this._onChange=null;this._bgColor={r:0,g:0,b:0,a:0,color:0,rgba:'#000000'};if(!this.game.transparent)
{this._bgColor.a=1;}
if(game.config)
{this.parseConfig(game.config);}};Phaser.Stage.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);Phaser.Stage.prototype.constructor=Phaser.Stage;Phaser.Stage.prototype.parseConfig=function(config){if(config['disableVisibilityChange'])
{this.disableVisibilityChange=config['disableVisibilityChange'];}
if(config['backgroundColor'])
{this.setBackgroundColor(config['backgroundColor']);}};Phaser.Stage.prototype.boot=function(){Phaser.DOM.getOffset(this.game.canvas,this.offset);Phaser.Canvas.setUserSelect(this.game.canvas,'none');Phaser.Canvas.setTouchAction(this.game.canvas,'none');this.checkVisibility();};Phaser.Stage.prototype.preUpdate=function(){this.currentRenderOrderID=0;for(var i=0;i<this.children.length;i++)
{this.children[i].preUpdate();}};Phaser.Stage.prototype.update=function(){var i=this.children.length;while(i--)
{this.children[i].update();}};Phaser.Stage.prototype.postUpdate=function(){if(this.game.world.camera.target)
{this.game.world.camera.target.postUpdate();this.game.world.camera.update();var i=this.children.length;while(i--)
{if(this.children[i]!==this.game.world.camera.target)
{this.children[i].postUpdate();}}}
else
{this.game.world.camera.update();var i=this.children.length;while(i--)
{this.children[i].postUpdate();}}};Phaser.Stage.prototype.updateTransform=function(){this.worldAlpha=1;for(var i=0;i<this.children.length;i++)
{this.children[i].updateTransform();}};Phaser.Stage.prototype.checkVisibility=function(){if(document.webkitHidden!==undefined)
{this._hiddenVar='webkitvisibilitychange';}
else if(document.mozHidden!==undefined)
{this._hiddenVar='mozvisibilitychange';}
else if(document.msHidden!==undefined)
{this._hiddenVar='msvisibilitychange';}
else if(document.hidden!==undefined)
{this._hiddenVar='visibilitychange';}
else
{this._hiddenVar=null;}
var _this=this;this._onChange=function(event){return _this.visibilityChange(event);};if(this._hiddenVar)
{document.addEventListener(this._hiddenVar,this._onChange,false);}
window.onblur=this._onChange;window.onfocus=this._onChange;window.onpagehide=this._onChange;window.onpageshow=this._onChange;if(this.game.device.cocoonJSApp)
{CocoonJS.App.onSuspended.addEventListener(function(){Phaser.Stage.prototype.visibilityChange.call(_this,{type:"pause"});});CocoonJS.App.onActivated.addEventListener(function(){Phaser.Stage.prototype.visibilityChange.call(_this,{type:"resume"});});}};Phaser.Stage.prototype.visibilityChange=function(event){if(event.type==='pagehide'||event.type==='blur'||event.type==='pageshow'||event.type==='focus')
{if(event.type==='pagehide'||event.type==='blur')
{this.game.focusLoss(event);}
else if(event.type==='pageshow'||event.type==='focus')
{this.game.focusGain(event);}
return;}
if(this.disableVisibilityChange)
{return;}
if(document.hidden||document.mozHidden||document.msHidden||document.webkitHidden||event.type==="pause")
{this.game.gamePaused(event);}
else
{this.game.gameResumed(event);}};Phaser.Stage.prototype.setBackgroundColor=function(color){if(this.game.transparent){return;}
Phaser.Color.valueToColor(color,this._bgColor);Phaser.Color.updateColor(this._bgColor);this._bgColor.r /=255;this._bgColor.g /=255;this._bgColor.b /=255;this._bgColor.a=1;};Phaser.Stage.prototype.destroy=function(){if(this._hiddenVar)
{document.removeEventListener(this._hiddenVar,this._onChange,false);}
window.onpagehide=null;window.onpageshow=null;window.onblur=null;window.onfocus=null;};Object.defineProperty(Phaser.Stage.prototype,"backgroundColor",{get:function(){return this._bgColor.color;},set:function(color){this.setBackgroundColor(color);}});Object.defineProperty(Phaser.Stage.prototype,"smoothed",{get:function(){return PIXI.scaleModes.DEFAULT===PIXI.scaleModes.LINEAR;},set:function(value){if(value)
{PIXI.scaleModes.DEFAULT=PIXI.scaleModes.LINEAR;}
else
{PIXI.scaleModes.DEFAULT=PIXI.scaleModes.NEAREST;}}});Phaser.Group=function(game,parent,name,addToStage,enableBody,physicsBodyType){if(addToStage===undefined){addToStage=false;}
if(enableBody===undefined){enableBody=false;}
if(physicsBodyType===undefined){physicsBodyType=Phaser.Physics.ARCADE;}
this.game=game;if(parent===undefined)
{parent=game.world;}
this.name=name||'group';this.z=0;PIXI.DisplayObjectContainer.call(this);if(addToStage)
{this.game.stage.addChild(this);this.z=this.game.stage.children.length;}
else
{if(parent)
{parent.addChild(this);this.z=parent.children.length;}}
this.type=Phaser.GROUP;this.physicsType=Phaser.GROUP;this.alive=true;this.exists=true;this.ignoreDestroy=false;this.pendingDestroy=false;this.classType=Phaser.Sprite;this.cursor=null;this.enableBody=enableBody;this.enableBodyDebug=false;this.physicsBodyType=physicsBodyType;this.physicsSortDirection=null;this.onDestroy=new Phaser.Signal();this.cursorIndex=0;this.fixedToCamera=false;this.cameraOffset=new Phaser.Point();this.hash=[];this._sortProperty='z';};Phaser.Group.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);Phaser.Group.prototype.constructor=Phaser.Group;Phaser.Group.RETURN_NONE=0;Phaser.Group.RETURN_TOTAL=1;Phaser.Group.RETURN_CHILD=2;Phaser.Group.SORT_ASCENDING=-1;Phaser.Group.SORT_DESCENDING=1;Phaser.Group.prototype.add=function(child,silent){if(silent===undefined){silent=false;}
if(child.parent!==this)
{this.addChild(child);child.z=this.children.length;if(this.enableBody&&child.body===null)
{this.game.physics.enable(child,this.physicsBodyType);}
else if(child.body)
{this.addToHash(child);}
if(!silent&&child.events)
{child.events.onAddedToGroup$dispatch(child,this);}
if(this.cursor===null)
{this.cursor=child;}}
return child;};Phaser.Group.prototype.addToHash=function(child){if(child.parent===this)
{var index=this.hash.indexOf(child);if(index===-1)
{this.hash.push(child);return true;}}
return false;};Phaser.Group.prototype.removeFromHash=function(child){if(child)
{var index=this.hash.indexOf(child);if(index!==-1)
{this.hash.splice(index,1);return true;}}
return false;};Phaser.Group.prototype.addMultiple=function(children,silent){if(children instanceof Phaser.Group)
{children.moveAll(this,silent);}
else if(Array.isArray(children))
{for(var i=0;i<children.length;i++)
{this.add(children[i],silent);}}
return children;};Phaser.Group.prototype.addAt=function(child,index,silent){if(silent===undefined){silent=false;}
if(child.parent!==this)
{this.addChildAt(child,index);this.updateZ();if(this.enableBody&&child.body===null)
{this.game.physics.enable(child,this.physicsBodyType);}
else if(child.body)
{this.addToHash(child);}
if(!silent&&child.events)
{child.events.onAddedToGroup$dispatch(child,this);}
if(this.cursor===null)
{this.cursor=child;}}
return child;};Phaser.Group.prototype.getAt=function(index){if(index<0||index>=this.children.length)
{return-1;}
else
{return this.getChildAt(index);}};Phaser.Group.prototype.create=function(x,y,key,frame,exists){if(exists===undefined){exists=true;}
var child=new this.classType(this.game,x,y,key,frame);child.exists=exists;child.visible=exists;child.alive=exists;this.addChild(child);child.z=this.children.length;if(this.enableBody)
{this.game.physics.enable(child,this.physicsBodyType,this.enableBodyDebug);}
if(child.events)
{child.events.onAddedToGroup$dispatch(child,this);}
if(this.cursor===null)
{this.cursor=child;}
return child;};Phaser.Group.prototype.createMultiple=function(quantity,key,frame,exists){if(exists===undefined){exists=false;}
for(var i=0;i<quantity;i++)
{this.create(0,0,key,frame,exists);}};Phaser.Group.prototype.updateZ=function(){var i=this.children.length;while(i--)
{this.children[i].z=i;}};Phaser.Group.prototype.resetCursor=function(index){if(index===undefined){index=0;}
if(index>this.children.length-1)
{index=0;}
if(this.cursor)
{this.cursorIndex=index;this.cursor=this.children[this.cursorIndex];return this.cursor;}};Phaser.Group.prototype.next=function(){if(this.cursor)
{if(this.cursorIndex>=this.children.length-1)
{this.cursorIndex=0;}
else
{this.cursorIndex++;}
this.cursor=this.children[this.cursorIndex];return this.cursor;}};Phaser.Group.prototype.previous=function(){if(this.cursor)
{if(this.cursorIndex===0)
{this.cursorIndex=this.children.length-1;}
else
{this.cursorIndex--;}
this.cursor=this.children[this.cursorIndex];return this.cursor;}};Phaser.Group.prototype.swap=function(child1,child2){this.swapChildren(child1,child2);this.updateZ();};Phaser.Group.prototype.bringToTop=function(child){if(child.parent===this&&this.getIndex(child)<this.children.length)
{this.remove(child,false,true);this.add(child,true);}
return child;};Phaser.Group.prototype.sendToBack=function(child){if(child.parent===this&&this.getIndex(child)>0)
{this.remove(child,false,true);this.addAt(child,0,true);}
return child;};Phaser.Group.prototype.moveUp=function(child){if(child.parent===this&&this.getIndex(child)<this.children.length-1)
{var a=this.getIndex(child);var b=this.getAt(a+1);if(b)
{this.swap(child,b);}}
return child;};Phaser.Group.prototype.moveDown=function(child){if(child.parent===this&&this.getIndex(child)>0)
{var a=this.getIndex(child);var b=this.getAt(a-1);if(b)
{this.swap(child,b);}}
return child;};Phaser.Group.prototype.xy=function(index,x,y){if(index<0||index>this.children.length)
{return-1;}
else
{this.getChildAt(index).x=x;this.getChildAt(index).y=y;}};Phaser.Group.prototype.reverse=function(){this.children.reverse();this.updateZ();};Phaser.Group.prototype.getIndex=function(child){return this.children.indexOf(child);};Phaser.Group.prototype.replace=function(oldChild,newChild){var index=this.getIndex(oldChild);if(index!==-1)
{if(newChild.parent)
{if(newChild.parent instanceof Phaser.Group)
{newChild.parent.remove(newChild);}
else
{newChild.parent.removeChild(newChild);}}
this.remove(oldChild);this.addAt(newChild,index);return oldChild;}};Phaser.Group.prototype.hasProperty=function(child,key){var len=key.length;if(len===1&&key[0]in child)
{return true;}
else if(len===2&&key[0]in child&&key[1]in child[key[0]])
{return true;}
else if(len===3&&key[0]in child&&key[1]in child[key[0]]&&key[2]in child[key[0]][key[1]])
{return true;}
else if(len===4&&key[0]in child&&key[1]in child[key[0]]&&key[2]in child[key[0]][key[1]]&&key[3]in child[key[0]][key[1]][key[2]])
{return true;}
return false;};Phaser.Group.prototype.setProperty=function(child,key,value,operation,force){if(force===undefined){force=false;}
operation=operation||0;if(!this.hasProperty(child,key)&&(!force||operation>0))
{return false;}
var len=key.length;if(len===1)
{if(operation===0){child[key[0]]=value;}
else if(operation==1){child[key[0]]+=value;}
else if(operation==2){child[key[0]]-=value;}
else if(operation==3){child[key[0]]*=value;}
else if(operation==4){child[key[0]]/=value;}}
else if(len===2)
{if(operation===0){child[key[0]][key[1]]=value;}
else if(operation==1){child[key[0]][key[1]]+=value;}
else if(operation==2){child[key[0]][key[1]]-=value;}
else if(operation==3){child[key[0]][key[1]]*=value;}
else if(operation==4){child[key[0]][key[1]]/=value;}}
else if(len===3)
{if(operation===0){child[key[0]][key[1]][key[2]]=value;}
else if(operation==1){child[key[0]][key[1]][key[2]]+=value;}
else if(operation==2){child[key[0]][key[1]][key[2]]-=value;}
else if(operation==3){child[key[0]][key[1]][key[2]]*=value;}
else if(operation==4){child[key[0]][key[1]][key[2]]/=value;}}
else if(len===4)
{if(operation===0){child[key[0]][key[1]][key[2]][key[3]]=value;}
else if(operation==1){child[key[0]][key[1]][key[2]][key[3]]+=value;}
else if(operation==2){child[key[0]][key[1]][key[2]][key[3]]-=value;}
else if(operation==3){child[key[0]][key[1]][key[2]][key[3]]*=value;}
else if(operation==4){child[key[0]][key[1]][key[2]][key[3]]/=value;}}
return true;};Phaser.Group.prototype.checkProperty=function(child,key,value,force){if(force===undefined){force=false;}
if(!Phaser.Utils.getProperty(child,key)&&force)
{return false;}
if(Phaser.Utils.getProperty(child,key)!==value)
{return false;}
return true;};Phaser.Group.prototype.set=function(child,key,value,checkAlive,checkVisible,operation,force){if(force===undefined){force=false;}
key=key.split('.');if(checkAlive===undefined){checkAlive=false;}
if(checkVisible===undefined){checkVisible=false;}
if((checkAlive===false||(checkAlive&&child.alive))&&(checkVisible===false||(checkVisible&&child.visible)))
{return this.setProperty(child,key,value,operation,force);}};Phaser.Group.prototype.setAll=function(key,value,checkAlive,checkVisible,operation,force){if(checkAlive===undefined){checkAlive=false;}
if(checkVisible===undefined){checkVisible=false;}
if(force===undefined){force=false;}
key=key.split('.');operation=operation||0;for(var i=0;i<this.children.length;i++)
{if((!checkAlive||(checkAlive&&this.children[i].alive))&&(!checkVisible||(checkVisible&&this.children[i].visible)))
{this.setProperty(this.children[i],key,value,operation,force);}}};Phaser.Group.prototype.setAllChildren=function(key,value,checkAlive,checkVisible,operation,force){if(checkAlive===undefined){checkAlive=false;}
if(checkVisible===undefined){checkVisible=false;}
if(force===undefined){force=false;}
operation=operation||0;for(var i=0;i<this.children.length;i++)
{if((!checkAlive||(checkAlive&&this.children[i].alive))&&(!checkVisible||(checkVisible&&this.children[i].visible)))
{if(this.children[i]instanceof Phaser.Group)
{this.children[i].setAllChildren(key,value,checkAlive,checkVisible,operation,force);}
else
{this.setProperty(this.children[i],key.split('.'),value,operation,force);}}}};Phaser.Group.prototype.checkAll=function(key,value,checkAlive,checkVisible,force){if(checkAlive===undefined){checkAlive=false;}
if(checkVisible===undefined){checkVisible=false;}
if(force===undefined){force=false;}
for(var i=0;i<this.children.length;i++)
{if((!checkAlive||(checkAlive&&this.children[i].alive))&&(!checkVisible||(checkVisible&&this.children[i].visible)))
{if(!this.checkProperty(this.children[i],key,value,force))
{return false;}}}
return true;};Phaser.Group.prototype.addAll=function(property,amount,checkAlive,checkVisible){this.setAll(property,amount,checkAlive,checkVisible,1);};Phaser.Group.prototype.subAll=function(property,amount,checkAlive,checkVisible){this.setAll(property,amount,checkAlive,checkVisible,2);};Phaser.Group.prototype.multiplyAll=function(property,amount,checkAlive,checkVisible){this.setAll(property,amount,checkAlive,checkVisible,3);};Phaser.Group.prototype.divideAll=function(property,amount,checkAlive,checkVisible){this.setAll(property,amount,checkAlive,checkVisible,4);};Phaser.Group.prototype.callAllExists=function(callback,existsValue){var args;if(arguments.length>2)
{args=[];for(var i=2;i<arguments.length;i++)
{args.push(arguments[i]);}}
for(var i=0;i<this.children.length;i++)
{if(this.children[i].exists===existsValue&&this.children[i][callback])
{this.children[i][callback].apply(this.children[i],args);}}};Phaser.Group.prototype.callbackFromArray=function(child,callback,length){if(length==1)
{if(child[callback[0]])
{return child[callback[0]];}}
else if(length==2)
{if(child[callback[0]][callback[1]])
{return child[callback[0]][callback[1]];}}
else if(length==3)
{if(child[callback[0]][callback[1]][callback[2]])
{return child[callback[0]][callback[1]][callback[2]];}}
else if(length==4)
{if(child[callback[0]][callback[1]][callback[2]][callback[3]])
{return child[callback[0]][callback[1]][callback[2]][callback[3]];}}
else
{if(child[callback])
{return child[callback];}}
return false;};Phaser.Group.prototype.callAll=function(method,context){if(method===undefined)
{return;}
method=method.split('.');var methodLength=method.length;if(context===undefined||context===null||context==='')
{context=null;}
else
{if(typeof context==='string')
{context=context.split('.');var contextLength=context.length;}}
var args;if(arguments.length>2)
{args=[];for(var i=2;i<arguments.length;i++)
{args.push(arguments[i]);}}
var callback=null;var callbackContext=null;for(var i=0;i<this.children.length;i++)
{callback=this.callbackFromArray(this.children[i],method,methodLength);if(context&&callback)
{callbackContext=this.callbackFromArray(this.children[i],context,contextLength);if(callback)
{callback.apply(callbackContext,args);}}
else if(callback)
{callback.apply(this.children[i],args);}}};Phaser.Group.prototype.preUpdate=function(){if(this.pendingDestroy)
{this.destroy();return false;}
if(!this.exists||!this.parent.exists)
{this.renderOrderID=-1;return false;}
var i=this.children.length;while(i--)
{this.children[i].preUpdate();}
return true;};Phaser.Group.prototype.update=function(){var i=this.children.length;while(i--)
{this.children[i].update();}};Phaser.Group.prototype.postUpdate=function(){if(this.fixedToCamera)
{this.x=this.game.camera.view.x+this.cameraOffset.x;this.y=this.game.camera.view.y+this.cameraOffset.y;}
var i=this.children.length;while(i--)
{this.children[i].postUpdate();}};Phaser.Group.prototype.filter=function(predicate,checkExists){var index=-1;var length=this.children.length;var results=[];while(++index<length)
{var child=this.children[index];if(!checkExists||(checkExists&&child.exists))
{if(predicate(child,index,this.children))
{results.push(child);}}}
return new Phaser.ArraySet(results);};Phaser.Group.prototype.forEach=function(callback,callbackContext,checkExists){if(checkExists===undefined){checkExists=false;}
if(arguments.length<=3)
{for(var i=0;i<this.children.length;i++)
{if(!checkExists||(checkExists&&this.children[i].exists))
{callback.call(callbackContext,this.children[i]);}}}
else
{var args=[null];for(var i=3;i<arguments.length;i++)
{args.push(arguments[i]);}
for(var i=0;i<this.children.length;i++)
{if(!checkExists||(checkExists&&this.children[i].exists))
{args[0]=this.children[i];callback.apply(callbackContext,args);}}}};Phaser.Group.prototype.forEachExists=function(callback,callbackContext){var args;if(arguments.length>2)
{args=[null];for(var i=2;i<arguments.length;i++)
{args.push(arguments[i]);}}
this.iterate('exists',true,Phaser.Group.RETURN_TOTAL,callback,callbackContext,args);};Phaser.Group.prototype.forEachAlive=function(callback,callbackContext){var args;if(arguments.length>2)
{args=[null];for(var i=2;i<arguments.length;i++)
{args.push(arguments[i]);}}
this.iterate('alive',true,Phaser.Group.RETURN_TOTAL,callback,callbackContext,args);};Phaser.Group.prototype.forEachDead=function(callback,callbackContext){var args;if(arguments.length>2)
{args=[null];for(var i=2;i<arguments.length;i++)
{args.push(arguments[i]);}}
this.iterate('alive',false,Phaser.Group.RETURN_TOTAL,callback,callbackContext,args);};Phaser.Group.prototype.sort=function(key,order){if(this.children.length<2)
{return;}
if(key===undefined){key='z';}
if(order===undefined){order=Phaser.Group.SORT_ASCENDING;}
this._sortProperty=key;if(order===Phaser.Group.SORT_ASCENDING)
{this.children.sort(this.ascendingSortHandler.bind(this));}
else
{this.children.sort(this.descendingSortHandler.bind(this));}
this.updateZ();};Phaser.Group.prototype.customSort=function(sortHandler,context){if(this.children.length<2)
{return;}
this.children.sort(sortHandler.bind(context));this.updateZ();};Phaser.Group.prototype.ascendingSortHandler=function(a,b){if(a[this._sortProperty]<b[this._sortProperty])
{return-1;}
else if(a[this._sortProperty]>b[this._sortProperty])
{return 1;}
else
{if(a.z<b.z)
{return-1;}
else
{return 1;}}};Phaser.Group.prototype.descendingSortHandler=function(a,b){if(a[this._sortProperty]<b[this._sortProperty])
{return 1;}
else if(a[this._sortProperty]>b[this._sortProperty])
{return-1;}
else
{return 0;}};Phaser.Group.prototype.iterate=function(key,value,returnType,callback,callbackContext,args){if(returnType===Phaser.Group.RETURN_TOTAL&&this.children.length===0)
{return 0;}
var total=0;for(var i=0;i<this.children.length;i++)
{if(this.children[i][key]===value)
{total++;if(callback)
{if(args)
{args[0]=this.children[i];callback.apply(callbackContext,args);}
else
{callback.call(callbackContext,this.children[i]);}}
if(returnType===Phaser.Group.RETURN_CHILD)
{return this.children[i];}}}
if(returnType===Phaser.Group.RETURN_TOTAL)
{return total;}
return null;};Phaser.Group.prototype.getFirstExists=function(exists,createIfNull,x,y,key,frame){if(createIfNull===undefined){createIfNull=false;}
if(typeof exists!=='boolean')
{exists=true;}
var child=this.iterate('exists',exists,Phaser.Group.RETURN_CHILD);return(child===null&&createIfNull)?this.create(x,y,key,frame):this.resetChild(child,x,y,key,frame);};Phaser.Group.prototype.getFirstAlive=function(createIfNull,x,y,key,frame){if(createIfNull===undefined){createIfNull=false;}
var child=this.iterate('alive',true,Phaser.Group.RETURN_CHILD);return(child===null&&createIfNull)?this.create(x,y,key,frame):this.resetChild(child,x,y,key,frame);};Phaser.Group.prototype.getFirstDead=function(createIfNull,x,y,key,frame){if(createIfNull===undefined){createIfNull=false;}
var child=this.iterate('alive',false,Phaser.Group.RETURN_CHILD);return(child===null&&createIfNull)?this.create(x,y,key,frame):this.resetChild(child,x,y,key,frame);};Phaser.Group.prototype.resetChild=function(child,x,y,key,frame){if(child===null)
{return null;}
if(x===undefined){x=null;}
if(y===undefined){y=null;}
if(x!==null&&y!==null)
{child.reset(x,y);}
if(key!==undefined)
{child.loadTexture(key,frame);}
return child;};Phaser.Group.prototype.getTop=function(){if(this.children.length>0)
{return this.children[this.children.length-1];}};Phaser.Group.prototype.getBottom=function(){if(this.children.length>0)
{return this.children[0];}};Phaser.Group.prototype.countLiving=function(){return this.iterate('alive',true,Phaser.Group.RETURN_TOTAL);};Phaser.Group.prototype.countDead=function(){return this.iterate('alive',false,Phaser.Group.RETURN_TOTAL);};Phaser.Group.prototype.getRandom=function(startIndex,length){if(this.children.length===0)
{return null;}
startIndex=startIndex||0;length=length||this.children.length;return Phaser.ArrayUtils.getRandomItem(this.children,startIndex,length);};Phaser.Group.prototype.remove=function(child,destroy,silent){if(destroy===undefined){destroy=false;}
if(silent===undefined){silent=false;}
if(this.children.length===0||this.children.indexOf(child)===-1)
{return false;}
if(!silent&&child.events&&!child.destroyPhase)
{child.events.onRemovedFromGroup$dispatch(child,this);}
var removed=this.removeChild(child);this.removeFromHash(child);this.updateZ();if(this.cursor===child)
{this.next();}
if(destroy&&removed)
{removed.destroy(true);}
return true;};Phaser.Group.prototype.moveAll=function(group,silent){if(silent===undefined){silent=false;}
if(this.children.length>0&&group instanceof Phaser.Group)
{do
{group.add(this.children[0],silent);}
while(this.children.length>0);this.hash=[];this.cursor=null;}
return group;};Phaser.Group.prototype.removeAll=function(destroy,silent){if(destroy===undefined){destroy=false;}
if(silent===undefined){silent=false;}
if(this.children.length===0)
{return;}
do
{if(!silent&&this.children[0].events)
{this.children[0].events.onRemovedFromGroup$dispatch(this.children[0],this);}
var removed=this.removeChild(this.children[0]);this.removeFromHash(removed);if(destroy&&removed)
{removed.destroy(true);}}
while(this.children.length>0);this.hash=[];this.cursor=null;};Phaser.Group.prototype.removeBetween=function(startIndex,endIndex,destroy,silent){if(endIndex===undefined){endIndex=this.children.length-1;}
if(destroy===undefined){destroy=false;}
if(silent===undefined){silent=false;}
if(this.children.length===0)
{return;}
if(startIndex>endIndex||startIndex<0||endIndex>this.children.length)
{return false;}
var i=endIndex;while(i>=startIndex)
{if(!silent&&this.children[i].events)
{this.children[i].events.onRemovedFromGroup$dispatch(this.children[i],this);}
var removed=this.removeChild(this.children[i]);this.removeFromHash(removed);if(destroy&&removed)
{removed.destroy(true);}
if(this.cursor===this.children[i])
{this.cursor=null;}
i--;}
this.updateZ();};Phaser.Group.prototype.destroy=function(destroyChildren,soft){if(this.game===null||this.ignoreDestroy){return;}
if(destroyChildren===undefined){destroyChildren=true;}
if(soft===undefined){soft=false;}
this.onDestroy.dispatch(this,destroyChildren,soft);this.removeAll(destroyChildren);this.cursor=null;this.filters=null;this.pendingDestroy=false;if(!soft)
{if(this.parent)
{this.parent.removeChild(this);}
this.game=null;this.exists=false;}};Object.defineProperty(Phaser.Group.prototype,"total",{get:function(){return this.iterate('exists',true,Phaser.Group.RETURN_TOTAL);}});Object.defineProperty(Phaser.Group.prototype,"length",{get:function(){return this.children.length;}});Object.defineProperty(Phaser.Group.prototype,"angle",{get:function(){return Phaser.Math.radToDeg(this.rotation);},set:function(value){this.rotation=Phaser.Math.degToRad(value);}});Phaser.World=function(game){Phaser.Group.call(this,game,null,'__world',false);this.bounds=new Phaser.Rectangle(0,0,game.width,game.height);this.camera=null;this._definedSize=false;this._width=game.width;this._height=game.height;this.game.state.onStateChange.add(this.stateChange,this);};Phaser.World.prototype=Object.create(Phaser.Group.prototype);Phaser.World.prototype.constructor=Phaser.World;Phaser.World.prototype.boot=function(){this.camera=new Phaser.Camera(this.game,0,0,0,this.game.width,this.game.height);this.camera.displayObject=this;this.camera.scale=this.scale;this.game.camera=this.camera;this.game.stage.addChild(this);};Phaser.World.prototype.stateChange=function(){this.x=0;this.y=0;this.camera.reset();};Phaser.World.prototype.setBounds=function(x,y,width,height){this._definedSize=true;this._width=width;this._height=height;this.bounds.setTo(x,y,width,height);this.x=x;this.y=y;if(this.camera.bounds)
{this.camera.bounds.setTo(x,y,Math.max(width,this.game.width),Math.max(height,this.game.height));}
this.game.physics.setBoundsToWorld();};Phaser.World.prototype.resize=function(width,height){if(this._definedSize)
{if(width<this._width)
{width=this._width;}
if(height<this._height)
{height=this._height;}}
this.bounds.width=width;this.bounds.height=height;this.game.camera.setBoundsToWorld();this.game.physics.setBoundsToWorld();};Phaser.World.prototype.shutdown=function(){this.destroy(true,true);};Phaser.World.prototype.wrap=function(sprite,padding,useBounds,horizontal,vertical){if(padding===undefined){padding=0;}
if(useBounds===undefined){useBounds=false;}
if(horizontal===undefined){horizontal=true;}
if(vertical===undefined){vertical=true;}
if(!useBounds)
{if(horizontal&&sprite.x+padding<this.bounds.x)
{sprite.x=this.bounds.right+padding;}
else if(horizontal&&sprite.x-padding>this.bounds.right)
{sprite.x=this.bounds.left-padding;}
if(vertical&&sprite.y+padding<this.bounds.top)
{sprite.y=this.bounds.bottom+padding;}
else if(vertical&&sprite.y-padding>this.bounds.bottom)
{sprite.y=this.bounds.top-padding;}}
else
{sprite.getBounds();if(horizontal)
{if((sprite.x+sprite._currentBounds.width)<this.bounds.x)
{sprite.x=this.bounds.right;}
else if(sprite.x>this.bounds.right)
{sprite.x=this.bounds.left;}}
if(vertical)
{if((sprite.y+sprite._currentBounds.height)<this.bounds.top)
{sprite.y=this.bounds.bottom;}
else if(sprite.y>this.bounds.bottom)
{sprite.y=this.bounds.top;}}}};Object.defineProperty(Phaser.World.prototype,"width",{get:function(){return this.bounds.width;},set:function(value){if(value<this.game.width)
{value=this.game.width;}
this.bounds.width=value;this._width=value;this._definedSize=true;}});Object.defineProperty(Phaser.World.prototype,"height",{get:function(){return this.bounds.height;},set:function(value){if(value<this.game.height)
{value=this.game.height;}
this.bounds.height=value;this._height=value;this._definedSize=true;}});Object.defineProperty(Phaser.World.prototype,"centerX",{get:function(){return this.bounds.halfWidth;}});Object.defineProperty(Phaser.World.prototype,"centerY",{get:function(){return this.bounds.halfHeight;}});Object.defineProperty(Phaser.World.prototype,"randomX",{get:function(){if(this.bounds.x<0)
{return this.game.rnd.between(this.bounds.x,(this.bounds.width-Math.abs(this.bounds.x)));}
else
{return this.game.rnd.between(this.bounds.x,this.bounds.width);}}});Object.defineProperty(Phaser.World.prototype,"randomY",{get:function(){if(this.bounds.y<0)
{return this.game.rnd.between(this.bounds.y,(this.bounds.height-Math.abs(this.bounds.y)));}
else
{return this.game.rnd.between(this.bounds.y,this.bounds.height);}}});Phaser.Game=function(width,height,renderer,parent,state,transparent,antialias,physicsConfig){this.id=Phaser.GAMES.push(this)-1;this.config=null;this.physicsConfig=physicsConfig;this.parent='';this.width=800;this.height=600;this.resolution=1;this._width=800;this._height=600;this.transparent=false;this.antialias=true;this.preserveDrawingBuffer=false;this.clearBeforeRender=true;this.renderer=null;this.renderType=Phaser.AUTO;this.state=null;this.isBooted=false;this.isRunning=false;this.raf=null;this.add=null;this.make=null;this.cache=null;this.input=null;this.load=null;this.math=null;this.net=null;this.scale=null;this.sound=null;this.stage=null;this.time=null;this.tweens=null;this.world=null;this.physics=null;this.plugins=null;this.rnd=null;this.device=Phaser.Device;this.camera=null;this.canvas=null;this.context=null;this.debug=null;this.particles=null;this.create=null;this.lockRender=false;this.stepping=false;this.pendingStep=false;this.stepCount=0;this.onPause=null;this.onResume=null;this.onBlur=null;this.onFocus=null;this._paused=false;this._codePaused=false;this.currentUpdateID=0;this.updatesThisFrame=1;this._deltaTime=0;this._lastCount=0;this._spiraling=0;this._kickstart=true;this.fpsProblemNotifier=new Phaser.Signal();this.forceSingleUpdate=false;this._nextFpsNotification=0;if(arguments.length===1&&typeof arguments[0]==='object')
{this.parseConfig(arguments[0]);}
else
{this.config={enableDebug:true};if(typeof width!=='undefined')
{this._width=width;}
if(typeof height!=='undefined')
{this._height=height;}
if(typeof renderer!=='undefined')
{this.renderType=renderer;}
if(typeof parent!=='undefined')
{this.parent=parent;}
if(typeof transparent!=='undefined')
{this.transparent=transparent;}
if(typeof antialias!=='undefined')
{this.antialias=antialias;}
this.rnd=new Phaser.RandomDataGenerator([(Date.now()*Math.random()).toString()]);this.state=new Phaser.StateManager(this,state);}
this.device.whenReady(this.boot,this);return this;};Phaser.Game.prototype={parseConfig:function(config){this.config=config;if(config['enableDebug']===undefined)
{this.config.enableDebug=true;}
if(config['width'])
{this._width=config['width'];}
if(config['height'])
{this._height=config['height'];}
if(config['renderer'])
{this.renderType=config['renderer'];}
if(config['parent'])
{this.parent=config['parent'];}
if(config['transparent'])
{this.transparent=config['transparent'];}
if(config['antialias'])
{this.antialias=config['antialias'];}
if(config['resolution'])
{this.resolution=config['resolution'];}
if(config['preserveDrawingBuffer'])
{this.preserveDrawingBuffer=config['preserveDrawingBuffer'];}
if(config['physicsConfig'])
{this.physicsConfig=config['physicsConfig'];}
var seed=[(Date.now()*Math.random()).toString()];if(config['seed'])
{seed=config['seed'];}
this.rnd=new Phaser.RandomDataGenerator(seed);var state=null;if(config['state'])
{state=config['state'];}
this.state=new Phaser.StateManager(this,state);},boot:function(){if(this.isBooted)
{return;}
this.onPause=new Phaser.Signal();this.onResume=new Phaser.Signal();this.onBlur=new Phaser.Signal();this.onFocus=new Phaser.Signal();this.isBooted=true;PIXI.game=this;this.math=Phaser.Math;this.scale=new Phaser.ScaleManager(this,this._width,this._height);this.stage=new Phaser.Stage(this);this.setUpRenderer();this.world=new Phaser.World(this);this.add=new Phaser.GameObjectFactory(this);this.make=new Phaser.GameObjectCreator(this);this.cache=new Phaser.Cache(this);this.load=new Phaser.Loader(this);this.time=new Phaser.Time(this);this.tweens=new Phaser.TweenManager(this);this.input=new Phaser.Input(this);this.sound=new Phaser.SoundManager(this);this.physics=new Phaser.Physics(this,this.physicsConfig);this.particles=new Phaser.Particles(this);this.create=new Phaser.Create(this);this.plugins=new Phaser.PluginManager(this);this.net=new Phaser.Net(this);this.time.boot();this.stage.boot();this.world.boot();this.scale.boot();this.input.boot();this.sound.boot();this.state.boot();if(this.config['enableDebug'])
{this.debug=new Phaser.Utils.Debug(this);this.debug.boot();}
else
{this.debug={preUpdate:function(){},update:function(){},reset:function(){}};}
this.showDebugHeader();this.isRunning=true;if(this.config&&this.config['forceSetTimeOut'])
{this.raf=new Phaser.RequestAnimationFrame(this,this.config['forceSetTimeOut']);}
else
{this.raf=new Phaser.RequestAnimationFrame(this,false);}
this._kickstart=true;if(window['focus'])
{if(!window['PhaserGlobal']||(window['PhaserGlobal']&&!window['PhaserGlobal'].stopFocus))
{window.focus();}}
this.raf.start();},showDebugHeader:function(){if(window['PhaserGlobal']&&window['PhaserGlobal'].hideBanner)
{return;}
var v=Phaser.VERSION;var r='Canvas';var a='HTML Audio';var c=1;if(this.renderType===Phaser.WEBGL)
{r='WebGL';c++;}
else if(this.renderType==Phaser.HEADLESS)
{r='Headless';}
if(this.device.webAudio)
{a='WebAudio';c++;}
if(this.device.chrome)
{var args=['%c %c %c Phaser v'+v+' | Pixi.js '+PIXI.VERSION+' | '+r+' | '+a+'  %c %c '+'%c http://phaser.io %c\u2665%c\u2665%c\u2665','background: #9854d8','background: #6c2ca7','color: #ffffff; background: #450f78;','background: #6c2ca7','background: #9854d8','background: #ffffff'];for(var i=0;i<3;i++)
{if(i<c)
{args.push('color: #ff2424; background: #fff');}
else
{args.push('color: #959595; background: #fff');}}
console.log.apply(console,args);}
else if(window['console'])
{console.log('Phaser v'+v+' | Pixi.js '+PIXI.VERSION+' | '+r+' | '+a+' | http://phaser.io');}},setUpRenderer:function(){this.canvas=Phaser.Canvas.create(this,this.width,this.height,this.config['canvasID'],true);if(this.config['canvasStyle'])
{this.canvas.style=this.config['canvasStyle'];}
else
{this.canvas.style['-webkit-full-screen']='width: 100%; height: 100%';}
if(this.renderType===Phaser.HEADLESS||this.renderType===Phaser.CANVAS||(this.renderType===Phaser.AUTO&&!this.device.webGL))
{if(this.device.canvas)
{this.renderType=Phaser.CANVAS;this.renderer=new PIXI.CanvasRenderer(this);this.context=this.renderer.context;}
else
{throw new Error('Phaser.Game - Cannot create Canvas or WebGL context, aborting.');}}
else
{this.renderType=Phaser.WEBGL;this.renderer=new PIXI.WebGLRenderer(this);this.context=null;this.canvas.addEventListener('webglcontextlost',this.contextLost.bind(this),false);this.canvas.addEventListener('webglcontextrestored',this.contextRestored.bind(this),false);}
if(this.device.cocoonJS)
{this.canvas.screencanvas=(this.renderType===Phaser.CANVAS)?true:false;}
if(this.renderType!==Phaser.HEADLESS)
{this.stage.smoothed=this.antialias;Phaser.Canvas.addToDOM(this.canvas,this.parent,false);Phaser.Canvas.setTouchAction(this.canvas);}},contextLost:function(event){event.preventDefault();this.renderer.contextLost=true;},contextRestored:function(){this.renderer.initContext();this.cache.clearGLTextures();this.renderer.contextLost=false;},update:function(time){this.time.update(time);if(this._kickstart)
{this.updateLogic(this.time.desiredFpsMult);this.stage.updateTransform();this.updateRender(this.time.slowMotion*this.time.desiredFps);this._kickstart=false;return;}
if(this._spiraling>1&&!this.forceSingleUpdate)
{if(this.time.time>this._nextFpsNotification)
{this._nextFpsNotification=this.time.time+10000;this.fpsProblemNotifier.dispatch();}
this._deltaTime=0;this._spiraling=0;this.updateRender(this.time.slowMotion*this.time.desiredFps);}
else
{var slowStep=this.time.slowMotion*1000.0 / this.time.desiredFps;this._deltaTime+=Math.max(Math.min(slowStep*3,this.time.elapsed),0);var count=0;this.updatesThisFrame=Math.floor(this._deltaTime / slowStep);if(this.forceSingleUpdate)
{this.updatesThisFrame=Math.min(1,this.updatesThisFrame);}
while(this._deltaTime>=slowStep)
{this._deltaTime-=slowStep;this.currentUpdateID=count;this.updateLogic(this.time.desiredFpsMult);this.stage.updateTransform();count++;if(this.forceSingleUpdate&&count===1)
{break;}
else
{this.time.refresh();}}
if(count>this._lastCount)
{this._spiraling++;}
else if(count<this._lastCount)
{this._spiraling=0;}
this._lastCount=count;this.updateRender(this._deltaTime / slowStep);}},updateLogic:function(timeStep){if(!this._paused&&!this.pendingStep)
{if(this.stepping)
{this.pendingStep=true;}
this.scale.preUpdate();this.debug.preUpdate();this.world.camera.preUpdate();this.physics.preUpdate();this.state.preUpdate(timeStep);this.plugins.preUpdate(timeStep);this.stage.preUpdate();this.state.update();this.stage.update();this.tweens.update();this.sound.update();this.input.update();this.physics.update();this.particles.update();this.plugins.update();this.stage.postUpdate();this.plugins.postUpdate();}
else
{this.scale.pauseUpdate();this.state.pauseUpdate();this.debug.preUpdate();}},updateRender:function(elapsedTime){if(this.lockRender)
{return;}
this.state.preRender(elapsedTime);this.renderer.render(this.stage);this.plugins.render(elapsedTime);this.state.render(elapsedTime);this.plugins.postRender(elapsedTime);},enableStep:function(){this.stepping=true;this.pendingStep=false;this.stepCount=0;},disableStep:function(){this.stepping=false;this.pendingStep=false;},step:function(){this.pendingStep=false;this.stepCount++;},destroy:function(){this.raf.stop();this.state.destroy();this.sound.destroy();this.scale.destroy();this.stage.destroy();this.input.destroy();this.physics.destroy();this.state=null;this.cache=null;this.input=null;this.load=null;this.sound=null;this.stage=null;this.time=null;this.world=null;this.isBooted=false;this.renderer.destroy(false);Phaser.Canvas.removeFromDOM(this.canvas);Phaser.GAMES[this.id]=null;},gamePaused:function(event){if(!this._paused)
{this._paused=true;this.time.gamePaused();this.sound.setMute();this.onPause.dispatch(event);if(this.device.cordova&&this.device.iOS)
{this.lockRender=true;}}},gameResumed:function(event){if(this._paused&&!this._codePaused)
{this._paused=false;this.time.gameResumed();this.input.reset();this.sound.unsetMute();this.onResume.dispatch(event);if(this.device.cordova&&this.device.iOS)
{this.lockRender=false;}}},focusLoss:function(event){this.onBlur.dispatch(event);if(!this.stage.disableVisibilityChange)
{this.gamePaused(event);}},focusGain:function(event){this.onFocus.dispatch(event);if(!this.stage.disableVisibilityChange)
{this.gameResumed(event);}}};Phaser.Game.prototype.constructor=Phaser.Game;Object.defineProperty(Phaser.Game.prototype,"paused",{get:function(){return this._paused;},set:function(value){if(value===true)
{if(this._paused===false)
{this._paused=true;this.sound.setMute();this.time.gamePaused();this.onPause.dispatch(this);}
this._codePaused=true;}
else
{if(this._paused)
{this._paused=false;this.input.reset();this.sound.unsetMute();this.time.gameResumed();this.onResume.dispatch(this);}
this._codePaused=false;}}});Phaser.Input=function(game){this.game=game;this.hitCanvas=null;this.hitContext=null;this.moveCallbacks=[];this.pollRate=0;this.enabled=true;this.multiInputOverride=Phaser.Input.MOUSE_TOUCH_COMBINE;this.position=null;this.speed=null;this.circle=null;this.scale=null;this.maxPointers=-1;this.tapRate=200;this.doubleTapRate=300;this.holdRate=2000;this.justPressedRate=200;this.justReleasedRate=200;this.recordPointerHistory=false;this.recordRate=100;this.recordLimit=100;this.pointer1=null;this.pointer2=null;this.pointer3=null;this.pointer4=null;this.pointer5=null;this.pointer6=null;this.pointer7=null;this.pointer8=null;this.pointer9=null;this.pointer10=null;this.pointers=[];this.activePointer=null;this.mousePointer=null;this.mouse=null;this.keyboard=null;this.touch=null;this.mspointer=null;this.gamepad=null;this.resetLocked=false;this.onDown=null;this.onUp=null;this.onTap=null;this.onHold=null;this.minPriorityID=0;this.interactiveItems=new Phaser.ArraySet();this._localPoint=new Phaser.Point();this._pollCounter=0;this._oldPosition=null;this._x=0;this._y=0;};Phaser.Input.MOUSE_OVERRIDES_TOUCH=0;Phaser.Input.TOUCH_OVERRIDES_MOUSE=1;Phaser.Input.MOUSE_TOUCH_COMBINE=2;Phaser.Input.MAX_POINTERS=10;Phaser.Input.prototype={boot:function(){this.mousePointer=new Phaser.Pointer(this.game,0,Phaser.PointerMode.CURSOR);this.addPointer();this.addPointer();this.mouse=new Phaser.Mouse(this.game);this.touch=new Phaser.Touch(this.game);this.mspointer=new Phaser.MSPointer(this.game);if(Phaser.Keyboard)
{this.keyboard=new Phaser.Keyboard(this.game);}
if(Phaser.Gamepad)
{this.gamepad=new Phaser.Gamepad(this.game);}
this.onDown=new Phaser.Signal();this.onUp=new Phaser.Signal();this.onTap=new Phaser.Signal();this.onHold=new Phaser.Signal();this.scale=new Phaser.Point(1,1);this.speed=new Phaser.Point();this.position=new Phaser.Point();this._oldPosition=new Phaser.Point();this.circle=new Phaser.Circle(0,0,44);this.activePointer=this.mousePointer;this.hitCanvas=PIXI.CanvasPool.create(this,1,1);this.hitContext=this.hitCanvas.getContext('2d');this.mouse.start();this.touch.start();this.mspointer.start();this.mousePointer.active=true;if(this.keyboard)
{this.keyboard.start();}
var _this=this;this._onClickTrampoline=function(event){_this.onClickTrampoline(event);};this.game.canvas.addEventListener('click',this._onClickTrampoline,false);},destroy:function(){this.mouse.stop();this.touch.stop();this.mspointer.stop();if(this.keyboard)
{this.keyboard.stop();}
if(this.gamepad)
{this.gamepad.stop();}
this.moveCallbacks=[];PIXI.CanvasPool.remove(this);this.game.canvas.removeEventListener('click',this._onClickTrampoline);},addMoveCallback:function(callback,context){this.moveCallbacks.push({callback:callback,context:context});},deleteMoveCallback:function(callback,context){var i=this.moveCallbacks.length;while(i--)
{if(this.moveCallbacks[i].callback===callback&&this.moveCallbacks[i].context===context)
{this.moveCallbacks.splice(i,1);return;}}},addPointer:function(){if(this.pointers.length>=Phaser.Input.MAX_POINTERS)
{console.warn("Phaser.Input.addPointer: Maximum limit of "+Phaser.Input.MAX_POINTERS+" pointers reached.");return null;}
var id=this.pointers.length+1;var pointer=new Phaser.Pointer(this.game,id,Phaser.PointerMode.TOUCH);this.pointers.push(pointer);this['pointer'+id]=pointer;return pointer;},update:function(){if(this.keyboard)
{this.keyboard.update();}
if(this.pollRate>0&&this._pollCounter<this.pollRate)
{this._pollCounter++;return;}
this.speed.x=this.position.x-this._oldPosition.x;this.speed.y=this.position.y-this._oldPosition.y;this._oldPosition.copyFrom(this.position);this.mousePointer.update();if(this.gamepad&&this.gamepad.active)
{this.gamepad.update();}
for(var i=0;i<this.pointers.length;i++)
{this.pointers[i].update();}
this._pollCounter=0;},reset:function(hard){if(!this.game.isBooted||this.resetLocked)
{return;}
if(hard===undefined){hard=false;}
this.mousePointer.reset();if(this.keyboard)
{this.keyboard.reset(hard);}
if(this.gamepad)
{this.gamepad.reset();}
for(var i=0;i<this.pointers.length;i++)
{this.pointers[i].reset();}
if(this.game.canvas.style.cursor!=='none')
{this.game.canvas.style.cursor='inherit';}
if(hard)
{this.onDown.dispose();this.onUp.dispose();this.onTap.dispose();this.onHold.dispose();this.onDown=new Phaser.Signal();this.onUp=new Phaser.Signal();this.onTap=new Phaser.Signal();this.onHold=new Phaser.Signal();this.moveCallbacks=[];}
this._pollCounter=0;},resetSpeed:function(x,y){this._oldPosition.setTo(x,y);this.speed.setTo(0,0);},startPointer:function(event){if(this.maxPointers>=0&&this.countActivePointers(this.maxPointers)>=this.maxPointers)
{return null;}
if(!this.pointer1.active)
{return this.pointer1.start(event);}
if(!this.pointer2.active)
{return this.pointer2.start(event);}
for(var i=2;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(!pointer.active)
{return pointer.start(event);}}
return null;},updatePointer:function(event){if(this.pointer1.active&&this.pointer1.identifier===event.identifier)
{return this.pointer1.move(event);}
if(this.pointer2.active&&this.pointer2.identifier===event.identifier)
{return this.pointer2.move(event);}
for(var i=2;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(pointer.active&&pointer.identifier===event.identifier)
{return pointer.move(event);}}
return null;},stopPointer:function(event){if(this.pointer1.active&&this.pointer1.identifier===event.identifier)
{return this.pointer1.stop(event);}
if(this.pointer2.active&&this.pointer2.identifier===event.identifier)
{return this.pointer2.stop(event);}
for(var i=2;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(pointer.active&&pointer.identifier===event.identifier)
{return pointer.stop(event);}}
return null;},countActivePointers:function(limit){if(limit===undefined){limit=this.pointers.length;}
var count=limit;for(var i=0;i<this.pointers.length&&count>0;i++)
{var pointer=this.pointers[i];if(pointer.active)
{count--;}}
return(limit-count);},getPointer:function(isActive){if(isActive===undefined){isActive=false;}
for(var i=0;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(pointer.active===isActive)
{return pointer;}}
return null;},getPointerFromIdentifier:function(identifier){for(var i=0;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(pointer.identifier===identifier)
{return pointer;}}
return null;},getPointerFromId:function(pointerId){for(var i=0;i<this.pointers.length;i++)
{var pointer=this.pointers[i];if(pointer.pointerId===pointerId)
{return pointer;}}
return null;},getLocalPosition:function(displayObject,pointer,output){if(output===undefined){output=new Phaser.Point();}
var wt=displayObject.worldTransform;var id=1 /(wt.a*wt.d+wt.c*-wt.b);return output.setTo(wt.d*id*pointer.x+ -wt.c*id*pointer.y+(wt.ty*wt.c-wt.tx*wt.d)*id,wt.a*id*pointer.y+ -wt.b*id*pointer.x+(-wt.ty*wt.a+wt.tx*wt.b)*id);},hitTest:function(displayObject,pointer,localPoint){if(!displayObject.worldVisible)
{return false;}
this.getLocalPosition(displayObject,pointer,this._localPoint);localPoint.copyFrom(this._localPoint);if(displayObject.hitArea&&displayObject.hitArea.contains)
{return(displayObject.hitArea.contains(this._localPoint.x,this._localPoint.y));}
else if(displayObject instanceof Phaser.TileSprite)
{var width=displayObject.width;var height=displayObject.height;var x1=-width*displayObject.anchor.x;if(this._localPoint.x>=x1&&this._localPoint.x<x1+width)
{var y1=-height*displayObject.anchor.y;if(this._localPoint.y>=y1&&this._localPoint.y<y1+height)
{return true;}}}
else if(displayObject instanceof PIXI.Sprite)
{var width=displayObject.texture.frame.width;var height=displayObject.texture.frame.height;var x1=-width*displayObject.anchor.x;if(this._localPoint.x>=x1&&this._localPoint.x<x1+width)
{var y1=-height*displayObject.anchor.y;if(this._localPoint.y>=y1&&this._localPoint.y<y1+height)
{return true;}}}
else if(displayObject instanceof Phaser.Graphics)
{for(var i=0;i<displayObject.graphicsData.length;i++)
{var data=displayObject.graphicsData[i];if(!data.fill)
{continue;}
if(data.shape&&data.shape.contains(this._localPoint.x,this._localPoint.y))
{return true;}}}
for(var i=0,len=displayObject.children.length;i<len;i++)
{if(this.hitTest(displayObject.children[i],pointer,localPoint))
{return true;}}
return false;},onClickTrampoline:function(){this.activePointer.processClickTrampolines();}};Phaser.Input.prototype.constructor=Phaser.Input;Object.defineProperty(Phaser.Input.prototype,"x",{get:function(){return this._x;},set:function(value){this._x=Math.floor(value);}});Object.defineProperty(Phaser.Input.prototype,"y",{get:function(){return this._y;},set:function(value){this._y=Math.floor(value);}});Object.defineProperty(Phaser.Input.prototype,"pollLocked",{get:function(){return(this.pollRate>0&&this._pollCounter<this.pollRate);}});Object.defineProperty(Phaser.Input.prototype,"totalInactivePointers",{get:function(){return this.pointers.length-this.countActivePointers();}});Object.defineProperty(Phaser.Input.prototype,"totalActivePointers",{get:function(){return this.countActivePointers();}});Object.defineProperty(Phaser.Input.prototype,"worldX",{get:function(){return this.game.camera.view.x+this.x;}});Object.defineProperty(Phaser.Input.prototype,"worldY",{get:function(){return this.game.camera.view.y+this.y;}});Phaser.Mouse=function(game){this.game=game;this.input=game.input;this.callbackContext=this.game;this.mouseDownCallback=null;this.mouseUpCallback=null;this.mouseOutCallback=null;this.mouseOverCallback=null;this.mouseWheelCallback=null;this.capture=false;this.button=-1;this.wheelDelta=0;this.enabled=true;this.locked=false;this.stopOnGameOut=false;this.pointerLock=new Phaser.Signal();this.event=null;this._onMouseDown=null;this._onMouseMove=null;this._onMouseUp=null;this._onMouseOut=null;this._onMouseOver=null;this._onMouseWheel=null;this._wheelEvent=null;};Phaser.Mouse.NO_BUTTON=-1;Phaser.Mouse.LEFT_BUTTON=0;Phaser.Mouse.MIDDLE_BUTTON=1;Phaser.Mouse.RIGHT_BUTTON=2;Phaser.Mouse.BACK_BUTTON=3;Phaser.Mouse.FORWARD_BUTTON=4;Phaser.Mouse.WHEEL_UP=1;Phaser.Mouse.WHEEL_DOWN=-1;Phaser.Mouse.prototype={start:function(){if(this.game.device.android&&this.game.device.chrome===false)
{return;}
if(this._onMouseDown!==null)
{return;}
var _this=this;this._onMouseDown=function(event){return _this.onMouseDown(event);};this._onMouseMove=function(event){return _this.onMouseMove(event);};this._onMouseUp=function(event){return _this.onMouseUp(event);};this._onMouseUpGlobal=function(event){return _this.onMouseUpGlobal(event);};this._onMouseOut=function(event){return _this.onMouseOut(event);};this._onMouseOver=function(event){return _this.onMouseOver(event);};this._onMouseWheel=function(event){return _this.onMouseWheel(event);};var canvas=this.game.canvas;canvas.addEventListener('mousedown',this._onMouseDown,true);canvas.addEventListener('mousemove',this._onMouseMove,true);canvas.addEventListener('mouseup',this._onMouseUp,true);if(!this.game.device.cocoonJS)
{window.addEventListener('mouseup',this._onMouseUpGlobal,true);canvas.addEventListener('mouseover',this._onMouseOver,true);canvas.addEventListener('mouseout',this._onMouseOut,true);}
var wheelEvent=this.game.device.wheelEvent;if(wheelEvent)
{canvas.addEventListener(wheelEvent,this._onMouseWheel,true);if(wheelEvent==='mousewheel')
{this._wheelEvent=new WheelEventProxy(-1/40,1);}
else if(wheelEvent==='DOMMouseScroll')
{this._wheelEvent=new WheelEventProxy(1,1);}}},onMouseDown:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.mouseDownCallback)
{this.mouseDownCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event['identifier']=0;this.input.mousePointer.start(event);},onMouseMove:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.mouseMoveCallback)
{this.mouseMoveCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event['identifier']=0;this.input.mousePointer.move(event);},onMouseUp:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.mouseUpCallback)
{this.mouseUpCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event['identifier']=0;this.input.mousePointer.stop(event);},onMouseUpGlobal:function(event){if(!this.input.mousePointer.withinGame)
{if(this.mouseUpCallback)
{this.mouseUpCallback.call(this.callbackContext,event);}
event['identifier']=0;this.input.mousePointer.stop(event);}},onMouseOut:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
this.input.mousePointer.withinGame=false;if(this.mouseOutCallback)
{this.mouseOutCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
if(this.stopOnGameOut)
{event['identifier']=0;this.input.mousePointer.stop(event);}},onMouseOver:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
this.input.mousePointer.withinGame=true;if(this.mouseOverCallback)
{this.mouseOverCallback.call(this.callbackContext,event);}},onMouseWheel:function(event){if(this._wheelEvent){event=this._wheelEvent.bindEvent(event);}
this.event=event;if(this.capture)
{event.preventDefault();}
this.wheelDelta=Phaser.Math.clamp(-event.deltaY,-1,1);if(this.mouseWheelCallback)
{this.mouseWheelCallback.call(this.callbackContext,event);}},requestPointerLock:function(){if(this.game.device.pointerLock)
{var element=this.game.canvas;element.requestPointerLock=element.requestPointerLock||element.mozRequestPointerLock||element.webkitRequestPointerLock;element.requestPointerLock();var _this=this;this._pointerLockChange=function(event){return _this.pointerLockChange(event);};document.addEventListener('pointerlockchange',this._pointerLockChange,true);document.addEventListener('mozpointerlockchange',this._pointerLockChange,true);document.addEventListener('webkitpointerlockchange',this._pointerLockChange,true);}},pointerLockChange:function(event){var element=this.game.canvas;if(document.pointerLockElement===element||document.mozPointerLockElement===element||document.webkitPointerLockElement===element)
{this.locked=true;this.pointerLock.dispatch(true,event);}
else
{this.locked=false;this.pointerLock.dispatch(false,event);}},releasePointerLock:function(){document.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock||document.webkitExitPointerLock;document.exitPointerLock();document.removeEventListener('pointerlockchange',this._pointerLockChange,true);document.removeEventListener('mozpointerlockchange',this._pointerLockChange,true);document.removeEventListener('webkitpointerlockchange',this._pointerLockChange,true);},stop:function(){var canvas=this.game.canvas;canvas.removeEventListener('mousedown',this._onMouseDown,true);canvas.removeEventListener('mousemove',this._onMouseMove,true);canvas.removeEventListener('mouseup',this._onMouseUp,true);canvas.removeEventListener('mouseover',this._onMouseOver,true);canvas.removeEventListener('mouseout',this._onMouseOut,true);var wheelEvent=this.game.device.wheelEvent;if(wheelEvent)
{canvas.removeEventListener(wheelEvent,this._onMouseWheel,true);}
window.removeEventListener('mouseup',this._onMouseUpGlobal,true);document.removeEventListener('pointerlockchange',this._pointerLockChange,true);document.removeEventListener('mozpointerlockchange',this._pointerLockChange,true);document.removeEventListener('webkitpointerlockchange',this._pointerLockChange,true);}};Phaser.Mouse.prototype.constructor=Phaser.Mouse;function WheelEventProxy(scaleFactor,deltaMode){this._scaleFactor=scaleFactor;this._deltaMode=deltaMode;this.originalEvent=null;}
WheelEventProxy.prototype={};WheelEventProxy.prototype.constructor=WheelEventProxy;WheelEventProxy.prototype.bindEvent=function(event){if(!WheelEventProxy._stubsGenerated&&event)
{var makeBinder=function(name){return function(){var v=this.originalEvent[name];return typeof v!=='function'?v:v.bind(this.originalEvent);};};for(var prop in event)
{if(!(prop in WheelEventProxy.prototype))
{Object.defineProperty(WheelEventProxy.prototype,prop,{get:makeBinder(prop)});}}
WheelEventProxy._stubsGenerated=true;}
this.originalEvent=event;return this;};Object.defineProperties(WheelEventProxy.prototype,{"type":{value:"wheel"},"deltaMode":{get:function(){return this._deltaMode;}},"deltaY":{get:function(){return(this._scaleFactor*(this.originalEvent.wheelDelta||this.originalEvent.detail))||0;}},"deltaX":{get:function(){return(this._scaleFactor*this.originalEvent.wheelDeltaX)||0;}},"deltaZ":{value:0}});Phaser.MSPointer=function(game){this.game=game;this.input=game.input;this.callbackContext=this.game;this.pointerDownCallback=null;this.pointerMoveCallback=null;this.pointerUpCallback=null;this.capture=true;this.button=-1;this.event=null;this.enabled=true;this._onMSPointerDown=null;this._onMSPointerMove=null;this._onMSPointerUp=null;this._onMSPointerUpGlobal=null;this._onMSPointerOut=null;this._onMSPointerOver=null;};Phaser.MSPointer.prototype={start:function(){if(this._onMSPointerDown!==null)
{return;}
var _this=this;if(this.game.device.mspointer)
{this._onMSPointerDown=function(event){return _this.onPointerDown(event);};this._onMSPointerMove=function(event){return _this.onPointerMove(event);};this._onMSPointerUp=function(event){return _this.onPointerUp(event);};this._onMSPointerUpGlobal=function(event){return _this.onPointerUpGlobal(event);};this._onMSPointerOut=function(event){return _this.onPointerOut(event);};this._onMSPointerOver=function(event){return _this.onPointerOver(event);};var canvas=this.game.canvas;canvas.addEventListener('MSPointerDown',this._onMSPointerDown,false);canvas.addEventListener('MSPointerMove',this._onMSPointerMove,false);canvas.addEventListener('MSPointerUp',this._onMSPointerUp,false);canvas.addEventListener('pointerdown',this._onMSPointerDown,false);canvas.addEventListener('pointermove',this._onMSPointerMove,false);canvas.addEventListener('pointerup',this._onMSPointerUp,false);canvas.style['-ms-content-zooming']='none';canvas.style['-ms-touch-action']='none';if(!this.game.device.cocoonJS)
{window.addEventListener('MSPointerUp',this._onMSPointerUpGlobal,true);canvas.addEventListener('MSPointerOver',this._onMSPointerOver,true);canvas.addEventListener('MSPointerOut',this._onMSPointerOut,true);window.addEventListener('pointerup',this._onMSPointerUpGlobal,true);canvas.addEventListener('pointerover',this._onMSPointerOver,true);canvas.addEventListener('pointerout',this._onMSPointerOut,true);}}},onPointerDown:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.pointerDownCallback)
{this.pointerDownCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event.identifier=event.pointerId;if(event.pointerType==='mouse'||event.pointerType===0x00000004)
{this.input.mousePointer.start(event);}
else
{this.input.startPointer(event);}},onPointerMove:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.pointerMoveCallback)
{this.pointerMoveCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event.identifier=event.pointerId;if(event.pointerType==='mouse'||event.pointerType===0x00000004)
{this.input.mousePointer.move(event);}
else
{this.input.updatePointer(event);}},onPointerUp:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(this.pointerUpCallback)
{this.pointerUpCallback.call(this.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
event.identifier=event.pointerId;if(event.pointerType==='mouse'||event.pointerType===0x00000004)
{this.input.mousePointer.stop(event);}
else
{this.input.stopPointer(event);}},onPointerUpGlobal:function(event){if((event.pointerType==='mouse'||event.pointerType===0x00000004)&&!this.input.mousePointer.withinGame)
{this.onPointerUp(event);}
else
{var pointer=this.input.getPointerFromIdentifier(event.identifier);if(pointer&&pointer.withinGame)
{this.onPointerUp(event);}}},onPointerOut:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(event.pointerType==='mouse'||event.pointerType===0x00000004)
{this.input.mousePointer.withinGame=false;}
else
{var pointer=this.input.getPointerFromIdentifier(event.identifier);if(pointer)
{pointer.withinGame=false;}}
if(this.input.mouse.mouseOutCallback)
{this.input.mouse.mouseOutCallback.call(this.input.mouse.callbackContext,event);}
if(!this.input.enabled||!this.enabled)
{return;}
if(this.input.mouse.stopOnGameOut)
{event['identifier']=0;if(pointer)
{pointer.stop(event);}
else
{this.input.mousePointer.stop(event);}}},onPointerOver:function(event){this.event=event;if(this.capture)
{event.preventDefault();}
if(event.pointerType==='mouse'||event.pointerType===0x00000004)
{this.input.mousePointer.withinGame=true;}
else
{var pointer=this.input.getPointerFromIdentifier(event.identifier);if(pointer)
{pointer.withinGame=true;}}
if(this.input.mouse.mouseOverCallback)
{this.input.mouse.mouseOverCallback.call(this.input.mouse.callbackContext,event);}},stop:function(){var canvas=this.game.canvas;canvas.removeEventListener('MSPointerDown',this._onMSPointerDown,false);canvas.removeEventListener('MSPointerMove',this._onMSPointerMove,false);canvas.removeEventListener('MSPointerUp',this._onMSPointerUp,false);canvas.removeEventListener('pointerdown',this._onMSPointerDown,false);canvas.removeEventListener('pointermove',this._onMSPointerMove,false);canvas.removeEventListener('pointerup',this._onMSPointerUp,false);window.removeEventListener('MSPointerUp',this._onMSPointerUpGlobal,true);canvas.removeEventListener('MSPointerOver',this._onMSPointerOver,true);canvas.removeEventListener('MSPointerOut',this._onMSPointerOut,true);window.removeEventListener('pointerup',this._onMSPointerUpGlobal,true);canvas.removeEventListener('pointerover',this._onMSPointerOver,true);canvas.removeEventListener('pointerout',this._onMSPointerOut,true);}};Phaser.MSPointer.prototype.constructor=Phaser.MSPointer;Phaser.DeviceButton=function(parent,buttonCode){this.parent=parent;this.game=parent.game;this.event=null;this.isDown=false;this.isUp=true;this.timeDown=0;this.timeUp=0;this.repeats=0;this.altKey=false;this.shiftKey=false;this.ctrlKey=false;this.value=0;this.buttonCode=buttonCode;this.onDown=new Phaser.Signal();this.onUp=new Phaser.Signal();this.onFloat=new Phaser.Signal();};Phaser.DeviceButton.prototype={start:function(event,value){if(this.isDown)
{return;}
this.isDown=true;this.isUp=false;this.timeDown=this.game.time.time;this.repeats=0;this.event=event;this.value=value;if(event)
{this.altKey=event.altKey;this.shiftKey=event.shiftKey;this.ctrlKey=event.ctrlKey;}
this.onDown.dispatch(this,value);},stop:function(event,value){if(this.isUp)
{return;}
this.isDown=false;this.isUp=true;this.timeUp=this.game.time.time;this.event=event;this.value=value;if(event)
{this.altKey=event.altKey;this.shiftKey=event.shiftKey;this.ctrlKey=event.ctrlKey;}
this.onUp.dispatch(this,value);},padFloat:function(value){this.value=value;this.onFloat.dispatch(this,value);},justPressed:function(duration){duration=duration||250;return(this.isDown&&(this.timeDown+duration)>this.game.time.time);},justReleased:function(duration){duration=duration||250;return(this.isUp&&(this.timeUp+duration)>this.game.time.time);},reset:function(){this.isDown=false;this.isUp=true;this.timeDown=this.game.time.time;this.repeats=0;this.altKey=false;this.shiftKey=false;this.ctrlKey=false;},destroy:function(){this.onDown.dispose();this.onUp.dispose();this.onFloat.dispose();this.parent=null;this.game=null;}};Phaser.DeviceButton.prototype.constructor=Phaser.DeviceButton;Object.defineProperty(Phaser.DeviceButton.prototype,"duration",{get:function(){if(this.isUp)
{return-1;}
return this.game.time.time-this.timeDown;}});Phaser.Pointer=function(game,id,pointerMode){this.game=game;this.id=id;this.type=Phaser.POINTER;this.exists=true;this.identifier=0;this.pointerId=null;this.pointerMode=pointerMode||(Phaser.PointerMode.CURSOR|Phaser.PointerMode.CONTACT);this.target=null;this.button=null;this.leftButton=new Phaser.DeviceButton(this,Phaser.Pointer.LEFT_BUTTON);this.middleButton=new Phaser.DeviceButton(this,Phaser.Pointer.MIDDLE_BUTTON);this.rightButton=new Phaser.DeviceButton(this,Phaser.Pointer.RIGHT_BUTTON);this.backButton=new Phaser.DeviceButton(this,Phaser.Pointer.BACK_BUTTON);this.forwardButton=new Phaser.DeviceButton(this,Phaser.Pointer.FORWARD_BUTTON);this.eraserButton=new Phaser.DeviceButton(this,Phaser.Pointer.ERASER_BUTTON);this._holdSent=false;this._history=[];this._nextDrop=0;this._stateReset=false;this.withinGame=false;this.clientX=-1;this.clientY=-1;this.pageX=-1;this.pageY=-1;this.screenX=-1;this.screenY=-1;this.rawMovementX=0;this.rawMovementY=0;this.movementX=0;this.movementY=0;this.x=-1;this.y=-1;this.isMouse=(id===0);this.isDown=false;this.isUp=true;this.timeDown=0;this.timeUp=0;this.previousTapTime=0;this.totalTouches=0;this.msSinceLastClick=Number.MAX_VALUE;this.targetObject=null;this.active=false;this.dirty=false;this.position=new Phaser.Point();this.positionDown=new Phaser.Point();this.positionUp=new Phaser.Point();this.circle=new Phaser.Circle(0,0,44);this._clickTrampolines=null;this._trampolineTargetObject=null;};Phaser.Pointer.NO_BUTTON=0;Phaser.Pointer.LEFT_BUTTON=1;Phaser.Pointer.RIGHT_BUTTON=2;Phaser.Pointer.MIDDLE_BUTTON=4;Phaser.Pointer.BACK_BUTTON=8;Phaser.Pointer.FORWARD_BUTTON=16;Phaser.Pointer.ERASER_BUTTON=32;Phaser.Pointer.prototype={resetButtons:function(){this.isDown=false;this.isUp=true;if(this.isMouse)
{this.leftButton.reset();this.middleButton.reset();this.rightButton.reset();this.backButton.reset();this.forwardButton.reset();this.eraserButton.reset();}},processButtonsDown:function(buttons,event){if(Phaser.Pointer.LEFT_BUTTON&buttons)
{this.leftButton.start(event);}
if(Phaser.Pointer.RIGHT_BUTTON&buttons)
{this.rightButton.start(event);}
if(Phaser.Pointer.MIDDLE_BUTTON&buttons)
{this.middleButton.start(event);}
if(Phaser.Pointer.BACK_BUTTON&buttons)
{this.backButton.start(event);}
if(Phaser.Pointer.FORWARD_BUTTON&buttons)
{this.forwardButton.start(event);}
if(Phaser.Pointer.ERASER_BUTTON&buttons)
{this.eraserButton.start(event);}},processButtonsUp:function(button,event){if(button===Phaser.Mouse.LEFT_BUTTON)
{this.leftButton.stop(event);}
if(button===Phaser.Mouse.RIGHT_BUTTON)
{this.rightButton.stop(event);}
if(button===Phaser.Mouse.MIDDLE_BUTTON)
{this.middleButton.stop(event);}
if(button===Phaser.Mouse.BACK_BUTTON)
{this.backButton.stop(event);}
if(button===Phaser.Mouse.FORWARD_BUTTON)
{this.forwardButton.stop(event);}
if(button===5)
{this.eraserButton.stop(event);}},updateButtons:function(event){this.button=event.button;var down=(event.type.toLowerCase().substr(-4)==='down');if(event.buttons!==undefined)
{if(down)
{this.processButtonsDown(event.buttons,event);}
else
{this.processButtonsUp(event.button,event);}}
else
{if(down)
{this.leftButton.start(event);}
else
{this.leftButton.stop(event);this.rightButton.stop(event);}}
if(event.ctrlKey&&this.leftButton.isDown)
{this.rightButton.start(event);}
this.isUp=true;this.isDown=false;if(this.leftButton.isDown||this.rightButton.isDown||this.middleButton.isDown||this.backButton.isDown||this.forwardButton.isDown||this.eraserButton.isDown)
{this.isUp=false;this.isDown=true;}},start:function(event){var input=this.game.input;if(event['pointerId'])
{this.pointerId=event.pointerId;}
this.identifier=event.identifier;this.target=event.target;if(this.isMouse)
{this.updateButtons(event);}
else
{this.isDown=true;this.isUp=false;}
this.active=true;this.withinGame=true;this.dirty=false;this._history=[];this._clickTrampolines=null;this._trampolineTargetObject=null;this.msSinceLastClick=this.game.time.time-this.timeDown;this.timeDown=this.game.time.time;this._holdSent=false;this.move(event,true);this.positionDown.setTo(this.x,this.y);if(input.multiInputOverride===Phaser.Input.MOUSE_OVERRIDES_TOUCH||input.multiInputOverride===Phaser.Input.MOUSE_TOUCH_COMBINE||(input.multiInputOverride===Phaser.Input.TOUCH_OVERRIDES_MOUSE&&input.totalActivePointers===0))
{input.x=this.x;input.y=this.y;input.position.setTo(this.x,this.y);input.onDown.dispatch(this,event);input.resetSpeed(this.x,this.y);}
this._stateReset=false;this.totalTouches++;if(this.targetObject!==null)
{this.targetObject._touchedHandler(this);}
return this;},update:function(){var input=this.game.input;if(this.active)
{if(this.dirty)
{if(input.interactiveItems.total>0)
{this.processInteractiveObjects(false);}
this.dirty=false;}
if(this._holdSent===false&&this.duration>=input.holdRate)
{if(input.multiInputOverride===Phaser.Input.MOUSE_OVERRIDES_TOUCH||input.multiInputOverride===Phaser.Input.MOUSE_TOUCH_COMBINE||(input.multiInputOverride===Phaser.Input.TOUCH_OVERRIDES_MOUSE&&input.totalActivePointers===0))
{input.onHold.dispatch(this);}
this._holdSent=true;}
if(input.recordPointerHistory&&this.game.time.time>=this._nextDrop)
{this._nextDrop=this.game.time.time+input.recordRate;this._history.push({x:this.position.x,y:this.position.y});if(this._history.length>input.recordLimit)
{this._history.shift();}}}},move:function(event,fromClick){var input=this.game.input;if(input.pollLocked)
{return;}
if(fromClick===undefined){fromClick=false;}
if(event.button!==undefined)
{this.button=event.button;}
if(fromClick&&this.isMouse)
{this.updateButtons(event);}
this.clientX=event.clientX;this.clientY=event.clientY;this.pageX=event.pageX;this.pageY=event.pageY;this.screenX=event.screenX;this.screenY=event.screenY;if(this.isMouse&&input.mouse.locked&&!fromClick)
{this.rawMovementX=event.movementX||event.mozMovementX||event.webkitMovementX||0;this.rawMovementY=event.movementY||event.mozMovementY||event.webkitMovementY||0;this.movementX+=this.rawMovementX;this.movementY+=this.rawMovementY;}
this.x=(this.pageX-this.game.scale.offset.x)*input.scale.x;this.y=(this.pageY-this.game.scale.offset.y)*input.scale.y;this.position.setTo(this.x,this.y);this.circle.x=this.x;this.circle.y=this.y;if(input.multiInputOverride===Phaser.Input.MOUSE_OVERRIDES_TOUCH||input.multiInputOverride===Phaser.Input.MOUSE_TOUCH_COMBINE||(input.multiInputOverride===Phaser.Input.TOUCH_OVERRIDES_MOUSE&&input.totalActivePointers===0))
{input.activePointer=this;input.x=this.x;input.y=this.y;input.position.setTo(input.x,input.y);input.circle.x=input.x;input.circle.y=input.y;}
this.withinGame=this.game.scale.bounds.contains(this.pageX,this.pageY);if(this.game.paused)
{return this;}
var i=input.moveCallbacks.length;while(i--)
{input.moveCallbacks[i].callback.call(input.moveCallbacks[i].context,this,this.x,this.y,fromClick);}
if(this.targetObject!==null&&this.targetObject.isDragged===true)
{if(this.targetObject.update(this)===false)
{this.targetObject=null;}}
else if(input.interactiveItems.total>0)
{this.processInteractiveObjects(fromClick);}
return this;},processInteractiveObjects:function(fromClick){var highestRenderOrderID=Number.MAX_VALUE;var highestInputPriorityID=-1;var candidateTarget=null;var currentNode=this.game.input.interactiveItems.first;while(currentNode)
{currentNode.checked=false;if(currentNode.validForInput(highestInputPriorityID,highestRenderOrderID,false))
{currentNode.checked=true;if((fromClick&&currentNode.checkPointerDown(this,true))||(!fromClick&&currentNode.checkPointerOver(this,true)))
{highestRenderOrderID=currentNode.sprite.renderOrderID;highestInputPriorityID=currentNode.priorityID;candidateTarget=currentNode;}}
currentNode=this.game.input.interactiveItems.next;}
var currentNode=this.game.input.interactiveItems.first;while(currentNode)
{if(!currentNode.checked&&currentNode.validForInput(highestInputPriorityID,highestRenderOrderID,true))
{if((fromClick&&currentNode.checkPointerDown(this,false))||(!fromClick&&currentNode.checkPointerOver(this,false)))
{highestRenderOrderID=currentNode.sprite.renderOrderID;highestInputPriorityID=currentNode.priorityID;candidateTarget=currentNode;}}
currentNode=this.game.input.interactiveItems.next;}
if(candidateTarget===null)
{if(this.targetObject)
{this.targetObject._pointerOutHandler(this);this.targetObject=null;}}
else
{if(this.targetObject===null)
{this.targetObject=candidateTarget;candidateTarget._pointerOverHandler(this);}
else
{if(this.targetObject===candidateTarget)
{if(candidateTarget.update(this)===false)
{this.targetObject=null;}}
else
{this.targetObject._pointerOutHandler(this);this.targetObject=candidateTarget;this.targetObject._pointerOverHandler(this);}}}
return(this.targetObject!==null);},leave:function(event){this.withinGame=false;this.move(event,false);},stop:function(event){var input=this.game.input;if(this._stateReset&&this.withinGame)
{event.preventDefault();return;}
this.timeUp=this.game.time.time;if(input.multiInputOverride===Phaser.Input.MOUSE_OVERRIDES_TOUCH||input.multiInputOverride===Phaser.Input.MOUSE_TOUCH_COMBINE||(input.multiInputOverride===Phaser.Input.TOUCH_OVERRIDES_MOUSE&&input.totalActivePointers===0))
{input.onUp.dispatch(this,event);if(this.duration>=0&&this.duration<=input.tapRate)
{if(this.timeUp-this.previousTapTime<input.doubleTapRate)
{input.onTap.dispatch(this,true);}
else
{input.onTap.dispatch(this,false);}
this.previousTapTime=this.timeUp;}}
if(this.isMouse)
{this.updateButtons(event);}
else
{this.isDown=false;this.isUp=true;}
if(this.id>0)
{this.active=false;}
this.withinGame=this.game.scale.bounds.contains(event.pageX,event.pageY);this.pointerId=null;this.identifier=null;this.positionUp.setTo(this.x,this.y);if(this.isMouse===false)
{input.currentPointers--;}
input.interactiveItems.callAll('_releasedHandler',this);if(this._clickTrampolines)
{this._trampolineTargetObject=this.targetObject;}
this.targetObject=null;return this;},justPressed:function(duration){duration=duration||this.game.input.justPressedRate;return(this.isDown===true&&(this.timeDown+duration)>this.game.time.time);},justReleased:function(duration){duration=duration||this.game.input.justReleasedRate;return(this.isUp&&(this.timeUp+duration)>this.game.time.time);},addClickTrampoline:function(name,callback,callbackContext,callbackArgs){if(!this.isDown)
{return;}
var trampolines=(this._clickTrampolines=this._clickTrampolines||[]);for(var i=0;i<trampolines.length;i++)
{if(trampolines[i].name===name)
{trampolines.splice(i,1);break;}}
trampolines.push({name:name,targetObject:this.targetObject,callback:callback,callbackContext:callbackContext,callbackArgs:callbackArgs});},processClickTrampolines:function(){var trampolines=this._clickTrampolines;if(!trampolines)
{return;}
for(var i=0;i<trampolines.length;i++)
{var trampoline=trampolines[i];if(trampoline.targetObject===this._trampolineTargetObject)
{trampoline.callback.apply(trampoline.callbackContext,trampoline.callbackArgs);}}
this._clickTrampolines=null;this._trampolineTargetObject=null;},reset:function(){if(this.isMouse===false)
{this.active=false;}
this.pointerId=null;this.identifier=null;this.dirty=false;this.totalTouches=0;this._holdSent=false;this._history.length=0;this._stateReset=true;this.resetButtons();if(this.targetObject)
{this.targetObject._releasedHandler(this);}
this.targetObject=null;},resetMovement:function(){this.movementX=0;this.movementY=0;}};Phaser.Pointer.prototype.constructor=Phaser.Pointer;Object.defineProperty(Phaser.Pointer.prototype,"duration",{get:function(){if(this.isUp)
{return-1;}
return this.game.time.time-this.timeDown;}});Object.defineProperty(Phaser.Pointer.prototype,"worldX",{get:function(){return this.game.world.camera.x+this.x;}});Object.defineProperty(Phaser.Pointer.prototype,"worldY",{get:function(){return this.game.world.camera.y+this.y;}});Phaser.PointerMode={CURSOR:1<<0,CONTACT:1<<1};Phaser.Touch=function(game){this.game=game;this.enabled=true;this.touchLockCallbacks=[];this.callbackContext=this.game;this.touchStartCallback=null;this.touchMoveCallback=null;this.touchEndCallback=null;this.touchEnterCallback=null;this.touchLeaveCallback=null;this.touchCancelCallback=null;this.preventDefault=true;this.event=null;this._onTouchStart=null;this._onTouchMove=null;this._onTouchEnd=null;this._onTouchEnter=null;this._onTouchLeave=null;this._onTouchCancel=null;this._onTouchMove=null;};Phaser.Touch.prototype={start:function(){if(this._onTouchStart!==null)
{return;}
var _this=this;if(this.game.device.touch)
{this._onTouchStart=function(event){return _this.onTouchStart(event);};this._onTouchMove=function(event){return _this.onTouchMove(event);};this._onTouchEnd=function(event){return _this.onTouchEnd(event);};this._onTouchEnter=function(event){return _this.onTouchEnter(event);};this._onTouchLeave=function(event){return _this.onTouchLeave(event);};this._onTouchCancel=function(event){return _this.onTouchCancel(event);};this.game.canvas.addEventListener('touchstart',this._onTouchStart,false);this.game.canvas.addEventListener('touchmove',this._onTouchMove,false);this.game.canvas.addEventListener('touchend',this._onTouchEnd,false);this.game.canvas.addEventListener('touchcancel',this._onTouchCancel,false);if(!this.game.device.cocoonJS)
{this.game.canvas.addEventListener('touchenter',this._onTouchEnter,false);this.game.canvas.addEventListener('touchleave',this._onTouchLeave,false);}}},consumeDocumentTouches:function(){this._documentTouchMove=function(event){event.preventDefault();};document.addEventListener('touchmove',this._documentTouchMove,false);},addTouchLockCallback:function(callback,context,onEnd){if(onEnd===undefined){onEnd=false;}
this.touchLockCallbacks.push({callback:callback,context:context,onEnd:onEnd});},removeTouchLockCallback:function(callback,context){var i=this.touchLockCallbacks.length;while(i--)
{if(this.touchLockCallbacks[i].callback===callback&&this.touchLockCallbacks[i].context===context)
{this.touchLockCallbacks.splice(i,1);return true;}}
return false;},onTouchStart:function(event){var i=this.touchLockCallbacks.length;while(i--)
{var cb=this.touchLockCallbacks[i];if(!cb.onEnd&&cb.callback.call(cb.context,this,event))
{this.touchLockCallbacks.splice(i,1);}}
this.event=event;if(!this.game.input.enabled||!this.enabled)
{return;}
if(this.touchStartCallback)
{this.touchStartCallback.call(this.callbackContext,event);}
if(this.preventDefault)
{event.preventDefault();}
for(var i=0;i<event.changedTouches.length;i++)
{this.game.input.startPointer(event.changedTouches[i]);}},onTouchCancel:function(event){this.event=event;if(this.touchCancelCallback)
{this.touchCancelCallback.call(this.callbackContext,event);}
if(!this.game.input.enabled||!this.enabled)
{return;}
if(this.preventDefault)
{event.preventDefault();}
for(var i=0;i<event.changedTouches.length;i++)
{this.game.input.stopPointer(event.changedTouches[i]);}},onTouchEnter:function(event){this.event=event;if(this.touchEnterCallback)
{this.touchEnterCallback.call(this.callbackContext,event);}
if(!this.game.input.enabled||!this.enabled)
{return;}
if(this.preventDefault)
{event.preventDefault();}},onTouchLeave:function(event){this.event=event;if(this.touchLeaveCallback)
{this.touchLeaveCallback.call(this.callbackContext,event);}
if(this.preventDefault)
{event.preventDefault();}},onTouchMove:function(event){this.event=event;if(this.touchMoveCallback)
{this.touchMoveCallback.call(this.callbackContext,event);}
if(this.preventDefault)
{event.preventDefault();}
for(var i=0;i<event.changedTouches.length;i++)
{this.game.input.updatePointer(event.changedTouches[i]);}},onTouchEnd:function(event){var i=this.touchLockCallbacks.length;while(i--)
{var cb=this.touchLockCallbacks[i];if(cb.onEnd&&cb.callback.call(cb.context,this,event))
{this.touchLockCallbacks.splice(i,1);}}
this.event=event;if(this.touchEndCallback)
{this.touchEndCallback.call(this.callbackContext,event);}
if(this.preventDefault)
{event.preventDefault();}
for(var i=0;i<event.changedTouches.length;i++)
{this.game.input.stopPointer(event.changedTouches[i]);}},stop:function(){if(this.game.device.touch)
{this.game.canvas.removeEventListener('touchstart',this._onTouchStart);this.game.canvas.removeEventListener('touchmove',this._onTouchMove);this.game.canvas.removeEventListener('touchend',this._onTouchEnd);this.game.canvas.removeEventListener('touchenter',this._onTouchEnter);this.game.canvas.removeEventListener('touchleave',this._onTouchLeave);this.game.canvas.removeEventListener('touchcancel',this._onTouchCancel);}}};Phaser.Touch.prototype.constructor=Phaser.Touch;Phaser.InputHandler=function(sprite){this.sprite=sprite;this.game=sprite.game;this.enabled=false;this.checked=false;this.priorityID=0;this.useHandCursor=false;this._setHandCursor=false;this.isDragged=false;this.allowHorizontalDrag=true;this.allowVerticalDrag=true;this.bringToTop=false;this.snapOffset=null;this.snapOnDrag=false;this.snapOnRelease=false;this.snapX=0;this.snapY=0;this.snapOffsetX=0;this.snapOffsetY=0;this.pixelPerfectOver=false;this.pixelPerfectClick=false;this.pixelPerfectAlpha=255;this.draggable=false;this.boundsRect=null;this.boundsSprite=null;this.consumePointerEvent=false;this.scaleLayer=false;this.dragOffset=new Phaser.Point();this.dragFromCenter=false;this.dragStartPoint=new Phaser.Point();this.snapPoint=new Phaser.Point();this._dragPoint=new Phaser.Point();this._dragPhase=false;this._wasEnabled=false;this._tempPoint=new Phaser.Point();this._pointerData=[];this._pointerData.push({id:0,x:0,y:0,isDown:false,isUp:false,isOver:false,isOut:false,timeOver:0,timeOut:0,timeDown:0,timeUp:0,downDuration:0,isDragged:false});};Phaser.InputHandler.prototype={start:function(priority,useHandCursor){priority=priority||0;if(useHandCursor===undefined){useHandCursor=false;}
if(this.enabled===false)
{this.game.input.interactiveItems.add(this);this.useHandCursor=useHandCursor;this.priorityID=priority;for(var i=0;i<10;i++)
{this._pointerData[i]={id:i,x:0,y:0,isDown:false,isUp:false,isOver:false,isOut:false,timeOver:0,timeOut:0,timeDown:0,timeUp:0,downDuration:0,isDragged:false};}
this.snapOffset=new Phaser.Point();this.enabled=true;this._wasEnabled=true;}
this.sprite.events.onAddedToGroup.add(this.addedToGroup,this);this.sprite.events.onRemovedFromGroup.add(this.removedFromGroup,this);this.flagged=false;return this.sprite;},addedToGroup:function(){if(this._dragPhase)
{return;}
if(this._wasEnabled&&!this.enabled)
{this.start();}},removedFromGroup:function(){if(this._dragPhase)
{return;}
if(this.enabled)
{this._wasEnabled=true;this.stop();}
else
{this._wasEnabled=false;}},reset:function(){this.enabled=false;this.flagged=false;for(var i=0;i<10;i++)
{this._pointerData[i]={id:i,x:0,y:0,isDown:false,isUp:false,isOver:false,isOut:false,timeOver:0,timeOut:0,timeDown:0,timeUp:0,downDuration:0,isDragged:false};}},stop:function(){if(this.enabled===false)
{return;}
else
{this.enabled=false;this.game.input.interactiveItems.remove(this);}},destroy:function(){if(this.sprite)
{if(this._setHandCursor)
{this.game.canvas.style.cursor="default";this._setHandCursor=false;}
this.enabled=false;this.game.input.interactiveItems.remove(this);this._pointerData.length=0;this.boundsRect=null;this.boundsSprite=null;this.sprite=null;}},validForInput:function(highestID,highestRenderID,includePixelPerfect){if(includePixelPerfect===undefined){includePixelPerfect=true;}
if(!this.enabled||this.sprite.scale.x===0||this.sprite.scale.y===0||this.priorityID<this.game.input.minPriorityID)
{return false;}
if(!includePixelPerfect&&(this.pixelPerfectClick||this.pixelPerfectOver))
{return false;}
if(this.priorityID>highestID||(this.priorityID===highestID&&this.sprite.renderOrderID<highestRenderID))
{return true;}
return false;},isPixelPerfect:function(){return(this.pixelPerfectClick||this.pixelPerfectOver);},pointerX:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].x;},pointerY:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].y;},pointerDown:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].isDown;},pointerUp:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].isUp;},pointerTimeDown:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].timeDown;},pointerTimeUp:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].timeUp;},pointerOver:function(pointerId){if(!this.enabled)
{return false;}
if(pointerId===undefined)
{for(var i=0;i<10;i++)
{if(this._pointerData[i].isOver)
{return true;}}}
else
{return this._pointerData[pointerId].isOver;}},pointerOut:function(pointerId){if(!this.enabled)
{return false;}
if(pointerId===undefined)
{for(var i=0;i<10;i++)
{if(this._pointerData[i].isOut)
{return true;}}}
else
{return this._pointerData[pointerId].isOut;}},pointerTimeOver:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].timeOver;},pointerTimeOut:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].timeOut;},pointerDragged:function(pointerId){pointerId=pointerId||0;return this._pointerData[pointerId].isDragged;},checkPointerDown:function(pointer,fastTest){if(!pointer.isDown||!this.enabled||!this.sprite||!this.sprite.parent||!this.sprite.visible||!this.sprite.parent.visible)
{return false;}
if(this.game.input.hitTest(this.sprite,pointer,this._tempPoint))
{if(fastTest===undefined)
{fastTest=false;}
if(!fastTest&&this.pixelPerfectClick)
{return this.checkPixel(this._tempPoint.x,this._tempPoint.y);}
else
{return true;}}
return false;},checkPointerOver:function(pointer,fastTest){if(!this.enabled||!this.sprite||!this.sprite.parent||!this.sprite.visible||!this.sprite.parent.visible)
{return false;}
if(this.game.input.hitTest(this.sprite,pointer,this._tempPoint))
{if(fastTest===undefined)
{fastTest=false;}
if(!fastTest&&this.pixelPerfectOver)
{return this.checkPixel(this._tempPoint.x,this._tempPoint.y);}
else
{return true;}}
return false;},checkPixel:function(x,y,pointer){if(this.sprite.texture.baseTexture.source)
{if(x===null&&y===null)
{this.game.input.getLocalPosition(this.sprite,pointer,this._tempPoint);var x=this._tempPoint.x;var y=this._tempPoint.y;}
if(this.sprite.anchor.x!==0)
{x-=-this.sprite.texture.frame.width*this.sprite.anchor.x;}
if(this.sprite.anchor.y!==0)
{y-=-this.sprite.texture.frame.height*this.sprite.anchor.y;}
x+=this.sprite.texture.frame.x;y+=this.sprite.texture.frame.y;if(this.sprite.texture.trim)
{x-=this.sprite.texture.trim.x;y-=this.sprite.texture.trim.y;if(x<this.sprite.texture.crop.x||x>this.sprite.texture.crop.right||y<this.sprite.texture.crop.y||y>this.sprite.texture.crop.bottom)
{this._dx=x;this._dy=y;return false;}}
this._dx=x;this._dy=y;this.game.input.hitContext.clearRect(0,0,1,1);this.game.input.hitContext.drawImage(this.sprite.texture.baseTexture.source,x,y,1,1,0,0,1,1);var rgb=this.game.input.hitContext.getImageData(0,0,1,1);if(rgb.data[3]>=this.pixelPerfectAlpha)
{return true;}}
return false;},update:function(pointer){if(this.sprite===null||this.sprite.parent===undefined)
{return;}
if(!this.enabled||!this.sprite.visible||!this.sprite.parent.visible)
{this._pointerOutHandler(pointer);return false;}
if(this.draggable&&this._draggedPointerID===pointer.id)
{return this.updateDrag(pointer);}
else if(this._pointerData[pointer.id].isOver)
{if(this.checkPointerOver(pointer))
{this._pointerData[pointer.id].x=pointer.x-this.sprite.x;this._pointerData[pointer.id].y=pointer.y-this.sprite.y;return true;}
else
{this._pointerOutHandler(pointer);return false;}}},_pointerOverHandler:function(pointer){if(this.sprite===null)
{return;}
var data=this._pointerData[pointer.id];if(data.isOver===false||pointer.dirty)
{data.isOver=true;data.isOut=false;data.timeOver=this.game.time.time;data.x=pointer.x-this.sprite.x;data.y=pointer.y-this.sprite.y;if(this.useHandCursor&&data.isDragged===false)
{this.game.canvas.style.cursor="pointer";this._setHandCursor=true;}
if(this.sprite&&this.sprite.events)
{this.sprite.events.onInputOver$dispatch(this.sprite,pointer);}}},_pointerOutHandler:function(pointer){if(this.sprite===null)
{return;}
var data=this._pointerData[pointer.id];data.isOver=false;data.isOut=true;data.timeOut=this.game.time.time;if(this.useHandCursor&&data.isDragged===false)
{this.game.canvas.style.cursor="default";this._setHandCursor=false;}
if(this.sprite&&this.sprite.events)
{this.sprite.events.onInputOut$dispatch(this.sprite,pointer);}},_touchedHandler:function(pointer){if(this.sprite===null)
{return;}
var data=this._pointerData[pointer.id];if(!data.isDown&&data.isOver)
{if(this.pixelPerfectClick&&!this.checkPixel(null,null,pointer))
{return;}
data.isDown=true;data.isUp=false;data.timeDown=this.game.time.time;if(this.sprite&&this.sprite.events)
{this.sprite.events.onInputDown$dispatch(this.sprite,pointer);}
pointer.dirty=true;if(this.draggable&&this.isDragged===false)
{this.startDrag(pointer);}
if(this.bringToTop)
{this.sprite.bringToTop();}}
return this.consumePointerEvent;},_releasedHandler:function(pointer){if(this.sprite===null)
{return;}
var data=this._pointerData[pointer.id];if(data.isDown&&pointer.isUp)
{data.isDown=false;data.isUp=true;data.timeUp=this.game.time.time;data.downDuration=data.timeUp-data.timeDown;var isOver=this.checkPointerOver(pointer);if(this.sprite&&this.sprite.events)
{this.sprite.events.onInputUp$dispatch(this.sprite,pointer,isOver);if(isOver)
{isOver=this.checkPointerOver(pointer);}}
data.isOver=isOver;if(!isOver&&this.useHandCursor)
{this.game.canvas.style.cursor="default";this._setHandCursor=false;}
pointer.dirty=true;if(this.draggable&&this.isDragged&&this._draggedPointerID===pointer.id)
{this.stopDrag(pointer);}}},updateDrag:function(pointer){if(pointer.isUp)
{this.stopDrag(pointer);return false;}
var px=this.globalToLocalX(pointer.x)+this._dragPoint.x+this.dragOffset.x;var py=this.globalToLocalY(pointer.y)+this._dragPoint.y+this.dragOffset.y;if(this.sprite.fixedToCamera)
{if(this.allowHorizontalDrag)
{this.sprite.cameraOffset.x=px;}
if(this.allowVerticalDrag)
{this.sprite.cameraOffset.y=py;}
if(this.boundsRect)
{this.checkBoundsRect();}
if(this.boundsSprite)
{this.checkBoundsSprite();}
if(this.snapOnDrag)
{this.sprite.cameraOffset.x=Math.round((this.sprite.cameraOffset.x-(this.snapOffsetX%this.snapX))/ this.snapX)*this.snapX+(this.snapOffsetX%this.snapX);this.sprite.cameraOffset.y=Math.round((this.sprite.cameraOffset.y-(this.snapOffsetY%this.snapY))/ this.snapY)*this.snapY+(this.snapOffsetY%this.snapY);this.snapPoint.set(this.sprite.cameraOffset.x,this.sprite.cameraOffset.y);}}
else
{if(this.allowHorizontalDrag)
{this.sprite.x=px;}
if(this.allowVerticalDrag)
{this.sprite.y=py;}
if(this.boundsRect)
{this.checkBoundsRect();}
if(this.boundsSprite)
{this.checkBoundsSprite();}
if(this.snapOnDrag)
{this.sprite.x=Math.round((this.sprite.x-(this.snapOffsetX%this.snapX))/ this.snapX)*this.snapX+(this.snapOffsetX%this.snapX);this.sprite.y=Math.round((this.sprite.y-(this.snapOffsetY%this.snapY))/ this.snapY)*this.snapY+(this.snapOffsetY%this.snapY);this.snapPoint.set(this.sprite.x,this.sprite.y);}}
this.sprite.events.onDragUpdate.dispatch(this.sprite,pointer,px,py,this.snapPoint);return true;},justOver:function(pointerId,delay){pointerId=pointerId||0;delay=delay||500;return(this._pointerData[pointerId].isOver&&this.overDuration(pointerId)<delay);},justOut:function(pointerId,delay){pointerId=pointerId||0;delay=delay||500;return(this._pointerData[pointerId].isOut&&(this.game.time.time-this._pointerData[pointerId].timeOut<delay));},justPressed:function(pointerId,delay){pointerId=pointerId||0;delay=delay||500;return(this._pointerData[pointerId].isDown&&this.downDuration(pointerId)<delay);},justReleased:function(pointerId,delay){pointerId=pointerId||0;delay=delay||500;return(this._pointerData[pointerId].isUp&&(this.game.time.time-this._pointerData[pointerId].timeUp<delay));},overDuration:function(pointerId){pointerId=pointerId||0;if(this._pointerData[pointerId].isOver)
{return this.game.time.time-this._pointerData[pointerId].timeOver;}
return-1;},downDuration:function(pointerId){pointerId=pointerId||0;if(this._pointerData[pointerId].isDown)
{return this.game.time.time-this._pointerData[pointerId].timeDown;}
return-1;},enableDrag:function(lockCenter,bringToTop,pixelPerfect,alphaThreshold,boundsRect,boundsSprite){if(lockCenter===undefined){lockCenter=false;}
if(bringToTop===undefined){bringToTop=false;}
if(pixelPerfect===undefined){pixelPerfect=false;}
if(alphaThreshold===undefined){alphaThreshold=255;}
if(boundsRect===undefined){boundsRect=null;}
if(boundsSprite===undefined){boundsSprite=null;}
this._dragPoint=new Phaser.Point();this.draggable=true;this.bringToTop=bringToTop;this.dragOffset=new Phaser.Point();this.dragFromCenter=lockCenter;this.pixelPerfectClick=pixelPerfect;this.pixelPerfectAlpha=alphaThreshold;if(boundsRect)
{this.boundsRect=boundsRect;}
if(boundsSprite)
{this.boundsSprite=boundsSprite;}},disableDrag:function(){if(this._pointerData)
{for(var i=0;i<10;i++)
{this._pointerData[i].isDragged=false;}}
this.draggable=false;this.isDragged=false;this._draggedPointerID=-1;},startDrag:function(pointer){var x=this.sprite.x;var y=this.sprite.y;this.isDragged=true;this._draggedPointerID=pointer.id;this._pointerData[pointer.id].isDragged=true;if(this.sprite.fixedToCamera)
{if(this.dragFromCenter)
{this.sprite.centerOn(pointer.x,pointer.y);this._dragPoint.setTo(this.sprite.cameraOffset.x-pointer.x,this.sprite.cameraOffset.y-pointer.y);}
else
{this._dragPoint.setTo(this.sprite.cameraOffset.x-pointer.x,this.sprite.cameraOffset.y-pointer.y);}}
else
{if(this.dragFromCenter)
{var bounds=this.sprite.getBounds();this.sprite.x=this.globalToLocalX(pointer.x)+(this.sprite.x-bounds.centerX);this.sprite.y=this.globalToLocalY(pointer.y)+(this.sprite.y-bounds.centerY);}
this._dragPoint.setTo(this.sprite.x-this.globalToLocalX(pointer.x),this.sprite.y-this.globalToLocalY(pointer.y));}
this.updateDrag(pointer);if(this.bringToTop)
{this._dragPhase=true;this.sprite.bringToTop();}
this.dragStartPoint.set(x,y);this.sprite.events.onDragStart$dispatch(this.sprite,pointer,x,y);},globalToLocalX:function(x){if(this.scaleLayer)
{x-=this.game.scale.grid.boundsFluid.x;x*=this.game.scale.grid.scaleFluidInversed.x;}
return x;},globalToLocalY:function(y){if(this.scaleLayer)
{y-=this.game.scale.grid.boundsFluid.y;y*=this.game.scale.grid.scaleFluidInversed.y;}
return y;},stopDrag:function(pointer){this.isDragged=false;this._draggedPointerID=-1;this._pointerData[pointer.id].isDragged=false;this._dragPhase=false;if(this.snapOnRelease)
{if(this.sprite.fixedToCamera)
{this.sprite.cameraOffset.x=Math.round((this.sprite.cameraOffset.x-(this.snapOffsetX%this.snapX))/ this.snapX)*this.snapX+(this.snapOffsetX%this.snapX);this.sprite.cameraOffset.y=Math.round((this.sprite.cameraOffset.y-(this.snapOffsetY%this.snapY))/ this.snapY)*this.snapY+(this.snapOffsetY%this.snapY);}
else
{this.sprite.x=Math.round((this.sprite.x-(this.snapOffsetX%this.snapX))/ this.snapX)*this.snapX+(this.snapOffsetX%this.snapX);this.sprite.y=Math.round((this.sprite.y-(this.snapOffsetY%this.snapY))/ this.snapY)*this.snapY+(this.snapOffsetY%this.snapY);}}
this.sprite.events.onDragStop$dispatch(this.sprite,pointer);if(this.checkPointerOver(pointer)===false)
{this._pointerOutHandler(pointer);}},setDragLock:function(allowHorizontal,allowVertical){if(allowHorizontal===undefined){allowHorizontal=true;}
if(allowVertical===undefined){allowVertical=true;}
this.allowHorizontalDrag=allowHorizontal;this.allowVerticalDrag=allowVertical;},enableSnap:function(snapX,snapY,onDrag,onRelease,snapOffsetX,snapOffsetY){if(onDrag===undefined){onDrag=true;}
if(onRelease===undefined){onRelease=false;}
if(snapOffsetX===undefined){snapOffsetX=0;}
if(snapOffsetY===undefined){snapOffsetY=0;}
this.snapX=snapX;this.snapY=snapY;this.snapOffsetX=snapOffsetX;this.snapOffsetY=snapOffsetY;this.snapOnDrag=onDrag;this.snapOnRelease=onRelease;},disableSnap:function(){this.snapOnDrag=false;this.snapOnRelease=false;},checkBoundsRect:function(){if(this.sprite.fixedToCamera)
{if(this.sprite.cameraOffset.x<this.boundsRect.left)
{this.sprite.cameraOffset.x=this.boundsRect.left;}
else if((this.sprite.cameraOffset.x+this.sprite.width)>this.boundsRect.right)
{this.sprite.cameraOffset.x=this.boundsRect.right-this.sprite.width;}
if(this.sprite.cameraOffset.y<this.boundsRect.top)
{this.sprite.cameraOffset.y=this.boundsRect.top;}
else if((this.sprite.cameraOffset.y+this.sprite.height)>this.boundsRect.bottom)
{this.sprite.cameraOffset.y=this.boundsRect.bottom-this.sprite.height;}}
else
{if(this.sprite.left<this.boundsRect.left)
{this.sprite.x=this.boundsRect.x+this.sprite.offsetX;}
else if(this.sprite.right>this.boundsRect.right)
{this.sprite.x=this.boundsRect.right-(this.sprite.width-this.sprite.offsetX);}
if(this.sprite.top<this.boundsRect.top)
{this.sprite.y=this.boundsRect.top+this.sprite.offsetY;}
else if(this.sprite.bottom>this.boundsRect.bottom)
{this.sprite.y=this.boundsRect.bottom-(this.sprite.height-this.sprite.offsetY);}}},checkBoundsSprite:function(){if(this.sprite.fixedToCamera&&this.boundsSprite.fixedToCamera)
{if(this.sprite.cameraOffset.x<this.boundsSprite.cameraOffset.x)
{this.sprite.cameraOffset.x=this.boundsSprite.cameraOffset.x;}
else if((this.sprite.cameraOffset.x+this.sprite.width)>(this.boundsSprite.cameraOffset.x+this.boundsSprite.width))
{this.sprite.cameraOffset.x=(this.boundsSprite.cameraOffset.x+this.boundsSprite.width)-this.sprite.width;}
if(this.sprite.cameraOffset.y<this.boundsSprite.cameraOffset.y)
{this.sprite.cameraOffset.y=this.boundsSprite.cameraOffset.y;}
else if((this.sprite.cameraOffset.y+this.sprite.height)>(this.boundsSprite.cameraOffset.y+this.boundsSprite.height))
{this.sprite.cameraOffset.y=(this.boundsSprite.cameraOffset.y+this.boundsSprite.height)-this.sprite.height;}}
else
{if(this.sprite.left<this.boundsSprite.left)
{this.sprite.x=this.boundsSprite.left+this.sprite.offsetX;}
else if(this.sprite.right>this.boundsSprite.right)
{this.sprite.x=this.boundsSprite.right-(this.sprite.width-this.sprite.offsetX);}
if(this.sprite.top<this.boundsSprite.top)
{this.sprite.y=this.boundsSprite.top+this.sprite.offsetY;}
else if(this.sprite.bottom>this.boundsSprite.bottom)
{this.sprite.y=this.boundsSprite.bottom-(this.sprite.height-this.sprite.offsetY);}}}};Phaser.InputHandler.prototype.constructor=Phaser.InputHandler;Phaser.Gamepad=function(game){this.game=game;this._gamepadIndexMap={};this._rawPads=[];this._active=false;this.enabled=true;this._gamepadSupportAvailable=!!navigator.webkitGetGamepads||!!navigator.webkitGamepads||(navigator.userAgent.indexOf('Firefox/')!=-1)||!!navigator.getGamepads;this._prevRawGamepadTypes=[];this._prevTimestamps=[];this.callbackContext=this;this.onConnectCallback=null;this.onDisconnectCallback=null;this.onDownCallback=null;this.onUpCallback=null;this.onAxisCallback=null;this.onFloatCallback=null;this._ongamepadconnected=null;this._gamepaddisconnected=null;this._gamepads=[new Phaser.SinglePad(game,this),new Phaser.SinglePad(game,this),new Phaser.SinglePad(game,this),new Phaser.SinglePad(game,this)];};Phaser.Gamepad.prototype={addCallbacks:function(context,callbacks){if(typeof callbacks!=='undefined')
{this.onConnectCallback=(typeof callbacks.onConnect==='function')?callbacks.onConnect:this.onConnectCallback;this.onDisconnectCallback=(typeof callbacks.onDisconnect==='function')?callbacks.onDisconnect:this.onDisconnectCallback;this.onDownCallback=(typeof callbacks.onDown==='function')?callbacks.onDown:this.onDownCallback;this.onUpCallback=(typeof callbacks.onUp==='function')?callbacks.onUp:this.onUpCallback;this.onAxisCallback=(typeof callbacks.onAxis==='function')?callbacks.onAxis:this.onAxisCallback;this.onFloatCallback=(typeof callbacks.onFloat==='function')?callbacks.onFloat:this.onFloatCallback;this.callbackContext=context;}},start:function(){if(this._active)
{return;}
this._active=true;var _this=this;this._onGamepadConnected=function(event){return _this.onGamepadConnected(event);};this._onGamepadDisconnected=function(event){return _this.onGamepadDisconnected(event);};window.addEventListener('gamepadconnected',this._onGamepadConnected,false);window.addEventListener('gamepaddisconnected',this._onGamepadDisconnected,false);},onGamepadConnected:function(event){var newPad=event.gamepad;this._rawPads.push(newPad);this._gamepads[newPad.index].connect(newPad);},onGamepadDisconnected:function(event){var removedPad=event.gamepad;for(var i in this._rawPads)
{if(this._rawPads[i].index===removedPad.index)
{this._rawPads.splice(i,1);}}
this._gamepads[removedPad.index].disconnect();},update:function(){this._pollGamepads();this.pad1.pollStatus();this.pad2.pollStatus();this.pad3.pollStatus();this.pad4.pollStatus();},_pollGamepads:function(){if(navigator['getGamepads'])
{var rawGamepads=navigator.getGamepads();}
else if(navigator['webkitGetGamepads'])
{var rawGamepads=navigator.webkitGetGamepads();}
else if(navigator['webkitGamepads'])
{var rawGamepads=navigator.webkitGamepads();}
if(rawGamepads)
{this._rawPads=[];var gamepadsChanged=false;for(var i=0;i<rawGamepads.length;i++)
{if(typeof rawGamepads[i]!==this._prevRawGamepadTypes[i])
{gamepadsChanged=true;this._prevRawGamepadTypes[i]=typeof rawGamepads[i];}
if(rawGamepads[i])
{this._rawPads.push(rawGamepads[i]);}
if(i===3)
{break;}}
if(gamepadsChanged)
{var validConnections={rawIndices:{},padIndices:{}};var singlePad;for(var j=0;j<this._gamepads.length;j++)
{singlePad=this._gamepads[j];if(singlePad.connected)
{for(var k=0;k<this._rawPads.length;k++)
{if(this._rawPads[k].index===singlePad.index)
{validConnections.rawIndices[singlePad.index]=true;validConnections.padIndices[j]=true;}}}}
for(var l=0;l<this._gamepads.length;l++)
{singlePad=this._gamepads[l];if(validConnections.padIndices[l])
{continue;}
if(this._rawPads.length<1)
{singlePad.disconnect();}
for(var m=0;m<this._rawPads.length;m++)
{if(validConnections.padIndices[l])
{break;}
var rawPad=this._rawPads[m];if(rawPad)
{if(validConnections.rawIndices[rawPad.index])
{singlePad.disconnect();continue;}
else
{singlePad.connect(rawPad);validConnections.rawIndices[rawPad.index]=true;validConnections.padIndices[l]=true;}}
else
{singlePad.disconnect();}}}}}},setDeadZones:function(value){for(var i=0;i<this._gamepads.length;i++)
{this._gamepads[i].deadZone=value;}},stop:function(){this._active=false;window.removeEventListener('gamepadconnected',this._onGamepadConnected);window.removeEventListener('gamepaddisconnected',this._onGamepadDisconnected);},reset:function(){this.update();for(var i=0;i<this._gamepads.length;i++)
{this._gamepads[i].reset();}},justPressed:function(buttonCode,duration){for(var i=0;i<this._gamepads.length;i++)
{if(this._gamepads[i].justPressed(buttonCode,duration)===true)
{return true;}}
return false;},justReleased:function(buttonCode,duration){for(var i=0;i<this._gamepads.length;i++)
{if(this._gamepads[i].justReleased(buttonCode,duration)===true)
{return true;}}
return false;},isDown:function(buttonCode){for(var i=0;i<this._gamepads.length;i++)
{if(this._gamepads[i].isDown(buttonCode)===true)
{return true;}}
return false;},destroy:function(){this.stop();for(var i=0;i<this._gamepads.length;i++)
{this._gamepads[i].destroy();}}};Phaser.Gamepad.prototype.constructor=Phaser.Gamepad;Object.defineProperty(Phaser.Gamepad.prototype,"active",{get:function(){return this._active;}});Object.defineProperty(Phaser.Gamepad.prototype,"supported",{get:function(){return this._gamepadSupportAvailable;}});Object.defineProperty(Phaser.Gamepad.prototype,"padsConnected",{get:function(){return this._rawPads.length;}});Object.defineProperty(Phaser.Gamepad.prototype,"pad1",{get:function(){return this._gamepads[0];}});Object.defineProperty(Phaser.Gamepad.prototype,"pad2",{get:function(){return this._gamepads[1];}});Object.defineProperty(Phaser.Gamepad.prototype,"pad3",{get:function(){return this._gamepads[2];}});Object.defineProperty(Phaser.Gamepad.prototype,"pad4",{get:function(){return this._gamepads[3];}});Phaser.Gamepad.BUTTON_0=0;Phaser.Gamepad.BUTTON_1=1;Phaser.Gamepad.BUTTON_2=2;Phaser.Gamepad.BUTTON_3=3;Phaser.Gamepad.BUTTON_4=4;Phaser.Gamepad.BUTTON_5=5;Phaser.Gamepad.BUTTON_6=6;Phaser.Gamepad.BUTTON_7=7;Phaser.Gamepad.BUTTON_8=8;Phaser.Gamepad.BUTTON_9=9;Phaser.Gamepad.BUTTON_10=10;Phaser.Gamepad.BUTTON_11=11;Phaser.Gamepad.BUTTON_12=12;Phaser.Gamepad.BUTTON_13=13;Phaser.Gamepad.BUTTON_14=14;Phaser.Gamepad.BUTTON_15=15;Phaser.Gamepad.AXIS_0=0;Phaser.Gamepad.AXIS_1=1;Phaser.Gamepad.AXIS_2=2;Phaser.Gamepad.AXIS_3=3;Phaser.Gamepad.AXIS_4=4;Phaser.Gamepad.AXIS_5=5;Phaser.Gamepad.AXIS_6=6;Phaser.Gamepad.AXIS_7=7;Phaser.Gamepad.AXIS_8=8;Phaser.Gamepad.AXIS_9=9;Phaser.Gamepad.XBOX360_A=0;Phaser.Gamepad.XBOX360_B=1;Phaser.Gamepad.XBOX360_X=2;Phaser.Gamepad.XBOX360_Y=3;Phaser.Gamepad.XBOX360_LEFT_BUMPER=4;Phaser.Gamepad.XBOX360_RIGHT_BUMPER=5;Phaser.Gamepad.XBOX360_LEFT_TRIGGER=6;Phaser.Gamepad.XBOX360_RIGHT_TRIGGER=7;Phaser.Gamepad.XBOX360_BACK=8;Phaser.Gamepad.XBOX360_START=9;Phaser.Gamepad.XBOX360_STICK_LEFT_BUTTON=10;Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON=11;Phaser.Gamepad.XBOX360_DPAD_LEFT=14;Phaser.Gamepad.XBOX360_DPAD_RIGHT=15;Phaser.Gamepad.XBOX360_DPAD_UP=12;Phaser.Gamepad.XBOX360_DPAD_DOWN=13;Phaser.Gamepad.XBOX360_STICK_LEFT_X=0;Phaser.Gamepad.XBOX360_STICK_LEFT_Y=1;Phaser.Gamepad.XBOX360_STICK_RIGHT_X=2;Phaser.Gamepad.XBOX360_STICK_RIGHT_Y=3;Phaser.Gamepad.PS3XC_X=0;Phaser.Gamepad.PS3XC_CIRCLE=1;Phaser.Gamepad.PS3XC_SQUARE=2;Phaser.Gamepad.PS3XC_TRIANGLE=3;Phaser.Gamepad.PS3XC_L1=4;Phaser.Gamepad.PS3XC_R1=5;Phaser.Gamepad.PS3XC_L2=6;Phaser.Gamepad.PS3XC_R2=7;Phaser.Gamepad.PS3XC_SELECT=8;Phaser.Gamepad.PS3XC_START=9;Phaser.Gamepad.PS3XC_STICK_LEFT_BUTTON=10;Phaser.Gamepad.PS3XC_STICK_RIGHT_BUTTON=11;Phaser.Gamepad.PS3XC_DPAD_UP=12;Phaser.Gamepad.PS3XC_DPAD_DOWN=13;Phaser.Gamepad.PS3XC_DPAD_LEFT=14;Phaser.Gamepad.PS3XC_DPAD_RIGHT=15;Phaser.Gamepad.PS3XC_STICK_LEFT_X=0;Phaser.Gamepad.PS3XC_STICK_LEFT_Y=1;Phaser.Gamepad.PS3XC_STICK_RIGHT_X=2;Phaser.Gamepad.PS3XC_STICK_RIGHT_Y=3;Phaser.SinglePad=function(game,padParent){this.game=game;this.index=null;this.connected=false;this.callbackContext=this;this.onConnectCallback=null;this.onDisconnectCallback=null;this.onDownCallback=null;this.onUpCallback=null;this.onAxisCallback=null;this.onFloatCallback=null;this.deadZone=0.26;this._padParent=padParent;this._rawPad=null;this._prevTimestamp=null;this._buttons=[];this._buttonsLen=0;this._axes=[];this._axesLen=0;};Phaser.SinglePad.prototype={addCallbacks:function(context,callbacks){if(typeof callbacks!=='undefined')
{this.onConnectCallback=(typeof callbacks.onConnect==='function')?callbacks.onConnect:this.onConnectCallback;this.onDisconnectCallback=(typeof callbacks.onDisconnect==='function')?callbacks.onDisconnect:this.onDisconnectCallback;this.onDownCallback=(typeof callbacks.onDown==='function')?callbacks.onDown:this.onDownCallback;this.onUpCallback=(typeof callbacks.onUp==='function')?callbacks.onUp:this.onUpCallback;this.onAxisCallback=(typeof callbacks.onAxis==='function')?callbacks.onAxis:this.onAxisCallback;this.onFloatCallback=(typeof callbacks.onFloat==='function')?callbacks.onFloat:this.onFloatCallback;}},getButton:function(buttonCode){if(this._buttons[buttonCode])
{return this._buttons[buttonCode];}
else
{return null;}},pollStatus:function(){if(!this.connected||!this.game.input.enabled||!this.game.input.gamepad.enabled||(this._rawPad.timestamp&&(this._rawPad.timestamp===this._prevTimestamp)))
{return;}
for(var i=0;i<this._buttonsLen;i++)
{var rawButtonVal=isNaN(this._rawPad.buttons[i])?this._rawPad.buttons[i].value:this._rawPad.buttons[i];if(rawButtonVal!==this._buttons[i].value)
{if(rawButtonVal===1)
{this.processButtonDown(i,rawButtonVal);}
else if(rawButtonVal===0)
{this.processButtonUp(i,rawButtonVal);}
else
{this.processButtonFloat(i,rawButtonVal);}}}
for(var index=0;index<this._axesLen;index++)
{var value=this._rawPad.axes[index];if((value>0&&value>this.deadZone)||(value<0&&value<-this.deadZone))
{this.processAxisChange(index,value);}
else
{this.processAxisChange(index,0);}}
this._prevTimestamp=this._rawPad.timestamp;},connect:function(rawPad){var triggerCallback=!this.connected;this.connected=true;this.index=rawPad.index;this._rawPad=rawPad;this._buttons=[];this._buttonsLen=rawPad.buttons.length;this._axes=[];this._axesLen=rawPad.axes.length;for(var a=0;a<this._axesLen;a++)
{this._axes[a]=rawPad.axes[a];}
for(var buttonCode in rawPad.buttons)
{buttonCode=parseInt(buttonCode,10);this._buttons[buttonCode]=new Phaser.DeviceButton(this,buttonCode);}
if(triggerCallback&&this._padParent.onConnectCallback)
{this._padParent.onConnectCallback.call(this._padParent.callbackContext,this.index);}
if(triggerCallback&&this.onConnectCallback)
{this.onConnectCallback.call(this.callbackContext);}},disconnect:function(){var triggerCallback=this.connected;var disconnectingIndex=this.index;this.connected=false;this.index=null;this._rawPad=undefined;for(var i=0;i<this._buttonsLen;i++)
{this._buttons[i].destroy();}
this._buttons=[];this._buttonsLen=0;this._axes=[];this._axesLen=0;if(triggerCallback&&this._padParent.onDisconnectCallback)
{this._padParent.onDisconnectCallback.call(this._padParent.callbackContext,disconnectingIndex);}
if(triggerCallback&&this.onDisconnectCallback)
{this.onDisconnectCallback.call(this.callbackContext);}},destroy:function(){this._rawPad=undefined;for(var i=0;i<this._buttonsLen;i++)
{this._buttons[i].destroy();}
this._buttons=[];this._buttonsLen=0;this._axes=[];this._axesLen=0;this.onConnectCallback=null;this.onDisconnectCallback=null;this.onDownCallback=null;this.onUpCallback=null;this.onAxisCallback=null;this.onFloatCallback=null;},processAxisChange:function(index,value){if(this._axes[index]===value)
{return;}
this._axes[index]=value;if(this._padParent.onAxisCallback)
{this._padParent.onAxisCallback.call(this._padParent.callbackContext,this,index,value);}
if(this.onAxisCallback)
{this.onAxisCallback.call(this.callbackContext,this,index,value);}},processButtonDown:function(buttonCode,value){if(this._padParent.onDownCallback)
{this._padParent.onDownCallback.call(this._padParent.callbackContext,buttonCode,value,this.index);}
if(this.onDownCallback)
{this.onDownCallback.call(this.callbackContext,buttonCode,value);}
if(this._buttons[buttonCode])
{this._buttons[buttonCode].start(null,value);}},processButtonUp:function(buttonCode,value){if(this._padParent.onUpCallback)
{this._padParent.onUpCallback.call(this._padParent.callbackContext,buttonCode,value,this.index);}
if(this.onUpCallback)
{this.onUpCallback.call(this.callbackContext,buttonCode,value);}
if(this._buttons[buttonCode])
{this._buttons[buttonCode].stop(null,value);}},processButtonFloat:function(buttonCode,value){if(this._padParent.onFloatCallback)
{this._padParent.onFloatCallback.call(this._padParent.callbackContext,buttonCode,value,this.index);}
if(this.onFloatCallback)
{this.onFloatCallback.call(this.callbackContext,buttonCode,value);}
if(this._buttons[buttonCode])
{this._buttons[buttonCode].padFloat(value);}},axis:function(axisCode){if(this._axes[axisCode])
{return this._axes[axisCode];}
return false;},isDown:function(buttonCode){if(this._buttons[buttonCode])
{return this._buttons[buttonCode].isDown;}
return false;},isUp:function(buttonCode){if(this._buttons[buttonCode])
{return this._buttons[buttonCode].isUp;}
return false;},justReleased:function(buttonCode,duration){if(this._buttons[buttonCode])
{return this._buttons[buttonCode].justReleased(duration);}},justPressed:function(buttonCode,duration){if(this._buttons[buttonCode])
{return this._buttons[buttonCode].justPressed(duration);}},buttonValue:function(buttonCode){if(this._buttons[buttonCode])
{return this._buttons[buttonCode].value;}
return null;},reset:function(){for(var j=0;j<this._axes.length;j++)
{this._axes[j]=0;}}};Phaser.SinglePad.prototype.constructor=Phaser.SinglePad;Phaser.Key=function(game,keycode){this.game=game;this._enabled=true;this.event=null;this.isDown=false;this.isUp=true;this.altKey=false;this.ctrlKey=false;this.shiftKey=false;this.timeDown=0;this.duration=0;this.timeUp=-2500;this.repeats=0;this.keyCode=keycode;this.onDown=new Phaser.Signal();this.onHoldCallback=null;this.onHoldContext=null;this.onUp=new Phaser.Signal();this._justDown=false;this._justUp=false;};Phaser.Key.prototype={update:function(){if(!this._enabled){return;}
if(this.isDown)
{this.duration=this.game.time.time-this.timeDown;this.repeats++;if(this.onHoldCallback)
{this.onHoldCallback.call(this.onHoldContext,this);}}},processKeyDown:function(event){if(!this._enabled){return;}
this.event=event;if(this.isDown)
{return;}
this.altKey=event.altKey;this.ctrlKey=event.ctrlKey;this.shiftKey=event.shiftKey;this.isDown=true;this.isUp=false;this.timeDown=this.game.time.time;this.duration=0;this.repeats=0;this._justDown=true;this.onDown.dispatch(this);},processKeyUp:function(event){if(!this._enabled){return;}
this.event=event;if(this.isUp)
{return;}
this.isDown=false;this.isUp=true;this.timeUp=this.game.time.time;this.duration=this.game.time.time-this.timeDown;this._justUp=true;this.onUp.dispatch(this);},reset:function(hard){if(hard===undefined){hard=true;}
this.isDown=false;this.isUp=true;this.timeUp=this.game.time.time;this.duration=0;this._enabled=true;this._justDown=false;this._justUp=false;if(hard)
{this.onDown.removeAll();this.onUp.removeAll();this.onHoldCallback=null;this.onHoldContext=null;}},downDuration:function(duration){if(duration===undefined){duration=50;}
return(this.isDown&&this.duration<duration);},upDuration:function(duration){if(duration===undefined){duration=50;}
return(!this.isDown&&((this.game.time.time-this.timeUp)<duration));}};Object.defineProperty(Phaser.Key.prototype,"justDown",{get:function(){var current=this._justDown;this._justDown=false;return current;}});Object.defineProperty(Phaser.Key.prototype,"justUp",{get:function(){var current=this._justUp;this._justUp=false;return current;}});Object.defineProperty(Phaser.Key.prototype,"enabled",{get:function(){return this._enabled;},set:function(value){value=!!value;if(value!==this._enabled)
{if(!value)
{this.reset(false);}
this._enabled=value;}}});Phaser.Key.prototype.constructor=Phaser.Key;Phaser.Keyboard=function(game){this.game=game;this.enabled=true;this.event=null;this.pressEvent=null;this.callbackContext=this;this.onDownCallback=null;this.onPressCallback=null;this.onUpCallback=null;this._keys=[];this._capture=[];this._onKeyDown=null;this._onKeyPress=null;this._onKeyUp=null;this._i=0;this._k=0;};Phaser.Keyboard.prototype={addCallbacks:function(context,onDown,onUp,onPress){this.callbackContext=context;if(onDown!==undefined&&onDown!==null)
{this.onDownCallback=onDown;}
if(onUp!==undefined&&onUp!==null)
{this.onUpCallback=onUp;}
if(onPress!==undefined&&onPress!==null)
{this.onPressCallback=onPress;}},addKey:function(keycode){if(!this._keys[keycode])
{this._keys[keycode]=new Phaser.Key(this.game,keycode);this.addKeyCapture(keycode);}
return this._keys[keycode];},addKeys:function(keys){var output={};for(var key in keys)
{output[key]=this.addKey(keys[key]);}
return output;},removeKey:function(keycode){if(this._keys[keycode])
{this._keys[keycode]=null;this.removeKeyCapture(keycode);}},createCursorKeys:function(){return this.addKeys({'up':Phaser.KeyCode.UP,'down':Phaser.KeyCode.DOWN,'left':Phaser.KeyCode.LEFT,'right':Phaser.KeyCode.RIGHT});},start:function(){if(this.game.device.cocoonJS)
{return;}
if(this._onKeyDown!==null)
{return;}
var _this=this;this._onKeyDown=function(event){return _this.processKeyDown(event);};this._onKeyUp=function(event){return _this.processKeyUp(event);};this._onKeyPress=function(event){return _this.processKeyPress(event);};window.addEventListener('keydown',this._onKeyDown,false);window.addEventListener('keyup',this._onKeyUp,false);window.addEventListener('keypress',this._onKeyPress,false);},stop:function(){window.removeEventListener('keydown',this._onKeyDown);window.removeEventListener('keyup',this._onKeyUp);window.removeEventListener('keypress',this._onKeyPress);this._onKeyDown=null;this._onKeyUp=null;this._onKeyPress=null;},destroy:function(){this.stop();this.clearCaptures();this._keys.length=0;this._i=0;},addKeyCapture:function(keycode){if(typeof keycode==='object')
{for(var key in keycode)
{this._capture[keycode[key]]=true;}}
else
{this._capture[keycode]=true;}},removeKeyCapture:function(keycode){delete this._capture[keycode];},clearCaptures:function(){this._capture={};},update:function(){this._i=this._keys.length;while(this._i--)
{if(this._keys[this._i])
{this._keys[this._i].update();}}},processKeyDown:function(event){this.event=event;if(!this.game.input.enabled||!this.enabled)
{return;}
if(this._capture[event.keyCode])
{event.preventDefault();}
if(!this._keys[event.keyCode])
{this._keys[event.keyCode]=new Phaser.Key(this.game,event.keyCode);}
this._keys[event.keyCode].processKeyDown(event);this._k=event.keyCode;if(this.onDownCallback)
{this.onDownCallback.call(this.callbackContext,event);}},processKeyPress:function(event){this.pressEvent=event;if(!this.game.input.enabled||!this.enabled)
{return;}
if(this.onPressCallback)
{this.onPressCallback.call(this.callbackContext,String.fromCharCode(event.charCode),event);}},processKeyUp:function(event){this.event=event;if(!this.game.input.enabled||!this.enabled)
{return;}
if(this._capture[event.keyCode])
{event.preventDefault();}
if(!this._keys[event.keyCode])
{this._keys[event.keyCode]=new Phaser.Key(this.game,event.keyCode);}
this._keys[event.keyCode].processKeyUp(event);if(this.onUpCallback)
{this.onUpCallback.call(this.callbackContext,event);}},reset:function(hard){if(hard===undefined){hard=true;}
this.event=null;var i=this._keys.length;while(i--)
{if(this._keys[i])
{this._keys[i].reset(hard);}}},downDuration:function(keycode,duration){if(this._keys[keycode])
{return this._keys[keycode].downDuration(duration);}
else
{return null;}},upDuration:function(keycode,duration){if(this._keys[keycode])
{return this._keys[keycode].upDuration(duration);}
else
{return null;}},isDown:function(keycode){if(this._keys[keycode])
{return this._keys[keycode].isDown;}
else
{return null;}}};Object.defineProperty(Phaser.Keyboard.prototype,"lastChar",{get:function(){if(this.event.charCode===32)
{return'';}
else
{return String.fromCharCode(this.pressEvent.charCode);}}});Object.defineProperty(Phaser.Keyboard.prototype,"lastKey",{get:function(){return this._keys[this._k];}});Phaser.Keyboard.prototype.constructor=Phaser.Keyboard;Phaser.KeyCode={A:"A".charCodeAt(0),B:"B".charCodeAt(0),C:"C".charCodeAt(0),D:"D".charCodeAt(0),E:"E".charCodeAt(0),F:"F".charCodeAt(0),G:"G".charCodeAt(0),H:"H".charCodeAt(0),I:"I".charCodeAt(0),J:"J".charCodeAt(0),K:"K".charCodeAt(0),L:"L".charCodeAt(0),M:"M".charCodeAt(0),N:"N".charCodeAt(0),O:"O".charCodeAt(0),P:"P".charCodeAt(0),Q:"Q".charCodeAt(0),R:"R".charCodeAt(0),S:"S".charCodeAt(0),T:"T".charCodeAt(0),U:"U".charCodeAt(0),V:"V".charCodeAt(0),W:"W".charCodeAt(0),X:"X".charCodeAt(0),Y:"Y".charCodeAt(0),Z:"Z".charCodeAt(0),ZERO:"0".charCodeAt(0),ONE:"1".charCodeAt(0),TWO:"2".charCodeAt(0),THREE:"3".charCodeAt(0),FOUR:"4".charCodeAt(0),FIVE:"5".charCodeAt(0),SIX:"6".charCodeAt(0),SEVEN:"7".charCodeAt(0),EIGHT:"8".charCodeAt(0),NINE:"9".charCodeAt(0),NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_ADD:107,NUMPAD_ENTER:108,NUMPAD_SUBTRACT:109,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,COLON:186,EQUALS:187,COMMA:188,UNDERSCORE:189,PERIOD:190,QUESTION_MARK:191,TILDE:192,OPEN_BRACKET:219,BACKWARD_SLASH:220,CLOSED_BRACKET:221,QUOTES:222,BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CONTROL:17,ALT:18,CAPS_LOCK:20,ESC:27,SPACEBAR:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,PLUS:43,MINUS:44,INSERT:45,DELETE:46,HELP:47,NUM_LOCK:144};for(var key in Phaser.KeyCode){if(Phaser.KeyCode.hasOwnProperty(key)&&!key.match(/[a-z]/)){Phaser.Keyboard[key]=Phaser.KeyCode[key];}}
Phaser.Component=function(){};Phaser.Component.Angle=function(){};Phaser.Component.Angle.prototype={angle:{get:function(){return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));},set:function(value){this.rotation=Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));}}};Phaser.Component.Animation=function(){};Phaser.Component.Animation.prototype={play:function(name,frameRate,loop,killOnComplete){if(this.animations)
{return this.animations.play(name,frameRate,loop,killOnComplete);}}};Phaser.Component.AutoCull=function(){};Phaser.Component.AutoCull.prototype={autoCull:false,inCamera:{get:function(){if(!this.autoCull&&!this.checkWorldBounds)
{this._bounds.copyFrom(this.getBounds());this._bounds.x+=this.game.camera.view.x;this._bounds.y+=this.game.camera.view.y;}
return this.game.world.camera.view.intersects(this._bounds);}}};Phaser.Component.Bounds=function(){};Phaser.Component.Bounds.prototype={offsetX:{get:function(){return this.anchor.x*this.width;}},offsetY:{get:function(){return this.anchor.y*this.height;}},left:{get:function(){return this.x-this.offsetX;}},right:{get:function(){return(this.x+this.width)-this.offsetX;}},top:{get:function(){return this.y-this.offsetY;}},bottom:{get:function(){return(this.y+this.height)-this.offsetY;}}};Phaser.Component.BringToTop=function(){};Phaser.Component.BringToTop.prototype.bringToTop=function(){if(this.parent)
{this.parent.bringToTop(this);}
return this;};Phaser.Component.BringToTop.prototype.sendToBack=function(){if(this.parent)
{this.parent.sendToBack(this);}
return this;};Phaser.Component.BringToTop.prototype.moveUp=function(){if(this.parent)
{this.parent.moveUp(this);}
return this;};Phaser.Component.BringToTop.prototype.moveDown=function(){if(this.parent)
{this.parent.moveDown(this);}
return this;};Phaser.Component.Core=function(){};Phaser.Component.Core.install=function(components){Phaser.Utils.mixinPrototype(this,Phaser.Component.Core.prototype);this.components={};for(var i=0;i<components.length;i++)
{var id=components[i];var replace=false;if(id==='Destroy')
{replace=true;}
Phaser.Utils.mixinPrototype(this,Phaser.Component[id].prototype,replace);this.components[id]=true;}};Phaser.Component.Core.init=function(game,x,y,key,frame){this.game=game;this.key=key;this.position.set(x,y);this.world=new Phaser.Point(x,y);this.previousPosition=new Phaser.Point(x,y);this.events=new Phaser.Events(this);this._bounds=new Phaser.Rectangle();if(this.components.PhysicsBody)
{this.body=this.body;}
if(this.components.Animation)
{this.animations=new Phaser.AnimationManager(this);}
if(this.components.LoadTexture&&key!==null)
{this.loadTexture(key,frame);}
if(this.components.FixedToCamera)
{this.cameraOffset=new Phaser.Point(x,y);}};Phaser.Component.Core.preUpdate=function(){if(this.pendingDestroy)
{this.destroy();return;}
this.previousPosition.set(this.world.x,this.world.y);this.previousRotation=this.rotation;if(!this.exists||!this.parent.exists)
{this.renderOrderID=-1;return false;}
this.world.setTo(this.game.camera.x+this.worldTransform.tx,this.game.camera.y+this.worldTransform.ty);if(this.visible)
{this.renderOrderID=this.game.stage.currentRenderOrderID++;}
if(this.texture)
{this.texture.requiresReTint=false;}
if(this.animations)
{this.animations.update();}
if(this.body)
{this.body.preUpdate();}
for(var i=0;i<this.children.length;i++)
{this.children[i].preUpdate();}
return true;};Phaser.Component.Core.prototype={game:null,name:'',components:{},z:0,events:undefined,animations:undefined,key:'',world:null,debug:false,previousPosition:null,previousRotation:0,renderOrderID:0,fresh:true,pendingDestroy:false,_bounds:null,_exists:true,exists:{get:function(){return this._exists;},set:function(value){if(value)
{this._exists=true;if(this.body&&this.body.type===Phaser.Physics.P2JS)
{this.body.addToWorld();}
this.visible=true;}
else
{this._exists=false;if(this.body&&this.body.type===Phaser.Physics.P2JS)
{this.body.removeFromWorld();}
this.visible=false;}}},update:function(){},postUpdate:function(){if(this.customRender)
{this.key.render();}
if(this.components.PhysicsBody)
{Phaser.Component.PhysicsBody.postUpdate.call(this);}
if(this.components.FixedToCamera)
{Phaser.Component.FixedToCamera.postUpdate.call(this);}
for(var i=0;i<this.children.length;i++)
{this.children[i].postUpdate();}}};Phaser.Component.Crop=function(){};Phaser.Component.Crop.prototype={cropRect:null,_crop:null,crop:function(rect,copy){if(copy===undefined){copy=false;}
if(rect)
{if(copy&&this.cropRect!==null)
{this.cropRect.setTo(rect.x,rect.y,rect.width,rect.height);}
else if(copy&&this.cropRect===null)
{this.cropRect=new Phaser.Rectangle(rect.x,rect.y,rect.width,rect.height);}
else
{this.cropRect=rect;}
this.updateCrop();}
else
{this._crop=null;this.cropRect=null;this.resetFrame();}},updateCrop:function(){if(!this.cropRect)
{return;}
this._crop=Phaser.Rectangle.clone(this.cropRect,this._crop);this._crop.x+=this._frame.x;this._crop.y+=this._frame.y;var cx=Math.max(this._frame.x,this._crop.x);var cy=Math.max(this._frame.y,this._crop.y);var cw=Math.min(this._frame.right,this._crop.right)-cx;var ch=Math.min(this._frame.bottom,this._crop.bottom)-cy;this.texture.crop.x=cx;this.texture.crop.y=cy;this.texture.crop.width=cw;this.texture.crop.height=ch;this.texture.frame.width=Math.min(cw,this.cropRect.width);this.texture.frame.height=Math.min(ch,this.cropRect.height);this.texture.width=this.texture.frame.width;this.texture.height=this.texture.frame.height;this.texture._updateUvs();}};Phaser.Component.Delta=function(){};Phaser.Component.Delta.prototype={deltaX:{get:function(){return this.world.x-this.previousPosition.x;}},deltaY:{get:function(){return this.world.y-this.previousPosition.y;}},deltaZ:{get:function(){return this.rotation-this.previousRotation;}}};Phaser.Component.Destroy=function(){};Phaser.Component.Destroy.prototype={destroyPhase:false,destroy:function(destroyChildren){if(this.game===null||this.destroyPhase){return;}
if(destroyChildren===undefined){destroyChildren=true;}
this.destroyPhase=true;if(this.events)
{this.events.onDestroy$dispatch(this);}
if(this.parent)
{if(this.parent instanceof Phaser.Group)
{this.parent.remove(this);}
else
{this.parent.removeChild(this);}}
if(this.input)
{this.input.destroy();}
if(this.animations)
{this.animations.destroy();}
if(this.body)
{this.body.destroy();}
if(this.events)
{this.events.destroy();}
var i=this.children.length;if(destroyChildren)
{while(i--)
{this.children[i].destroy(destroyChildren);}}
else
{while(i--)
{this.removeChild(this.children[i]);}}
if(this._crop)
{this._crop=null;}
if(this._frame)
{this._frame=null;}
if(Phaser.Video&&this.key instanceof Phaser.Video)
{this.key.onChangeSource.remove(this.resizeFrame,this);}
if(Phaser.BitmapText&&this._glyphs)
{this._glyphs=[];}
this.alive=false;this.exists=false;this.visible=false;this.filters=null;this.mask=null;this.game=null;this.renderable=false;if(this.transformCallback)
{this.transformCallback=null;this.transformCallbackContext=null;}
this.hitArea=null;this.parent=null;this.stage=null;this.worldTransform=null;this.filterArea=null;this._bounds=null;this._currentBounds=null;this._mask=null;this._destroyCachedSprite();this.destroyPhase=false;this.pendingDestroy=false;}};Phaser.Events=function(sprite){this.parent=sprite;};Phaser.Events.prototype={destroy:function(){this._parent=null;if(this._onDestroy){this._onDestroy.dispose();}
if(this._onAddedToGroup){this._onAddedToGroup.dispose();}
if(this._onRemovedFromGroup){this._onRemovedFromGroup.dispose();}
if(this._onRemovedFromWorld){this._onRemovedFromWorld.dispose();}
if(this._onKilled){this._onKilled.dispose();}
if(this._onRevived){this._onRevived.dispose();}
if(this._onEnterBounds){this._onEnterBounds.dispose();}
if(this._onOutOfBounds){this._onOutOfBounds.dispose();}
if(this._onInputOver){this._onInputOver.dispose();}
if(this._onInputOut){this._onInputOut.dispose();}
if(this._onInputDown){this._onInputDown.dispose();}
if(this._onInputUp){this._onInputUp.dispose();}
if(this._onDragStart){this._onDragStart.dispose();}
if(this._onDragUpdate){this._onDragUpdate.dispose();}
if(this._onDragStop){this._onDragStop.dispose();}
if(this._onAnimationStart){this._onAnimationStart.dispose();}
if(this._onAnimationComplete){this._onAnimationComplete.dispose();}
if(this._onAnimationLoop){this._onAnimationLoop.dispose();}},onAddedToGroup:null,onRemovedFromGroup:null,onRemovedFromWorld:null,onDestroy:null,onKilled:null,onRevived:null,onOutOfBounds:null,onEnterBounds:null,onInputOver:null,onInputOut:null,onInputDown:null,onInputUp:null,onDragStart:null,onDragUpdate:null,onDragStop:null,onAnimationStart:null,onAnimationComplete:null,onAnimationLoop:null};Phaser.Events.prototype.constructor=Phaser.Events;for(var prop in Phaser.Events.prototype)
{if(!Phaser.Events.prototype.hasOwnProperty(prop)||prop.indexOf('on')!==0||Phaser.Events.prototype[prop]!==null)
{continue;}
(function(prop,backing){'use strict';Object.defineProperty(Phaser.Events.prototype,prop,{get:function(){return this[backing]||(this[backing]=new Phaser.Signal());}});Phaser.Events.prototype[prop+'$dispatch']=function(){return this[backing]?this[backing].dispatch.apply(this[backing],arguments):null;};})(prop,'_'+prop);}
Phaser.Component.FixedToCamera=function(){};Phaser.Component.FixedToCamera.postUpdate=function(){if(this.fixedToCamera)
{this.position.x=(this.game.camera.view.x+this.cameraOffset.x)/ this.game.camera.scale.x;this.position.y=(this.game.camera.view.y+this.cameraOffset.y)/ this.game.camera.scale.y;}};Phaser.Component.FixedToCamera.prototype={_fixedToCamera:false,fixedToCamera:{get:function(){return this._fixedToCamera;},set:function(value){if(value)
{this._fixedToCamera=true;this.cameraOffset.set(this.x,this.y);}
else
{this._fixedToCamera=false;}}},cameraOffset:new Phaser.Point()};Phaser.Component.Health=function(){};Phaser.Component.Health.prototype={health:1,maxHealth:100,damage:function(amount){if(this.alive)
{this.health-=amount;if(this.health<=0)
{this.kill();}}
return this;},heal:function(amount){if(this.alive)
{this.health+=amount;if(this.health>this.maxHealth)
{this.health=this.maxHealth;}}
return this;}};Phaser.Component.InCamera=function(){};Phaser.Component.InCamera.prototype={inCamera:{get:function(){return this.game.world.camera.view.intersects(this._bounds);}}};Phaser.Component.InputEnabled=function(){};Phaser.Component.InputEnabled.prototype={input:null,inputEnabled:{get:function(){return(this.input&&this.input.enabled);},set:function(value){if(value)
{if(this.input===null)
{this.input=new Phaser.InputHandler(this);this.input.start();}
else if(this.input&&!this.input.enabled)
{this.input.start();}}
else
{if(this.input&&this.input.enabled)
{this.input.stop();}}}}};Phaser.Component.InWorld=function(){};Phaser.Component.InWorld.preUpdate=function(){if(this.autoCull||this.checkWorldBounds)
{this._bounds.copyFrom(this.getBounds());this._bounds.x+=this.game.camera.view.x;this._bounds.y+=this.game.camera.view.y;if(this.autoCull)
{if(this.game.world.camera.view.intersects(this._bounds))
{this.renderable=true;this.game.world.camera.totalInView++;}
else
{this.renderable=false;}}
if(this.checkWorldBounds)
{if(this._outOfBoundsFired&&this.game.world.bounds.intersects(this._bounds))
{this._outOfBoundsFired=false;this.events.onEnterBounds$dispatch(this);}
else if(!this._outOfBoundsFired&&!this.game.world.bounds.intersects(this._bounds))
{this._outOfBoundsFired=true;this.events.onOutOfBounds$dispatch(this);if(this.outOfBoundsKill)
{this.kill();return false;}}}}
return true;};Phaser.Component.InWorld.prototype={checkWorldBounds:false,outOfBoundsKill:false,_outOfBoundsFired:false,inWorld:{get:function(){return this.game.world.bounds.intersects(this.getBounds());}}};Phaser.Component.LifeSpan=function(){};Phaser.Component.LifeSpan.preUpdate=function(){if(this.lifespan>0)
{this.lifespan-=this.game.time.physicsElapsedMS;if(this.lifespan<=0)
{this.kill();return false;}}
return true;};Phaser.Component.LifeSpan.prototype={alive:true,lifespan:0,revive:function(health){if(health===undefined){health=1;}
this.alive=true;this.exists=true;this.visible=true;if(typeof this.heal==='function')
{this.heal(health);}
if(this.events)
{this.events.onRevived$dispatch(this);}
return this;},kill:function(){this.alive=false;this.exists=false;this.visible=false;if(this.events)
{this.events.onKilled$dispatch(this);}
return this;}};Phaser.Component.LoadTexture=function(){};Phaser.Component.LoadTexture.prototype={customRender:false,_frame:null,loadTexture:function(key,frame,stopAnimation){frame=frame||0;if((stopAnimation||stopAnimation===undefined)&&this.animations)
{this.animations.stop();}
this.key=key;this.customRender=false;var cache=this.game.cache;var setFrame=true;var smoothed=!this.texture.baseTexture.scaleMode;if(Phaser.RenderTexture&&key instanceof Phaser.RenderTexture)
{this.key=key.key;this.setTexture(key);}
else if(Phaser.BitmapData&&key instanceof Phaser.BitmapData)
{this.customRender=true;this.setTexture(key.texture);if(cache.hasFrameData(key.key,Phaser.Cache.BITMAPDATA))
{setFrame=!this.animations.loadFrameData(cache.getFrameData(key.key,Phaser.Cache.BITMAPDATA),frame);}}
else if(Phaser.Video&&key instanceof Phaser.Video)
{this.customRender=true;var valid=key.texture.valid;this.setTexture(key.texture);this.setFrame(key.texture.frame.clone());key.onChangeSource.add(this.resizeFrame,this);this.texture.valid=valid;}
else if(key instanceof PIXI.Texture)
{this.setTexture(key);}
else
{var img=cache.getImage(key,true);this.key=img.key;this.setTexture(new PIXI.Texture(img.base));setFrame=!this.animations.loadFrameData(img.frameData,frame);}
if(setFrame)
{this._frame=Phaser.Rectangle.clone(this.texture.frame);}
if(!smoothed)
{this.texture.baseTexture.scaleMode=1;}},setFrame:function(frame){this._frame=frame;this.texture.frame.x=frame.x;this.texture.frame.y=frame.y;this.texture.frame.width=frame.width;this.texture.frame.height=frame.height;this.texture.crop.x=frame.x;this.texture.crop.y=frame.y;this.texture.crop.width=frame.width;this.texture.crop.height=frame.height;if(frame.trimmed)
{if(this.texture.trim)
{this.texture.trim.x=frame.spriteSourceSizeX;this.texture.trim.y=frame.spriteSourceSizeY;this.texture.trim.width=frame.sourceSizeW;this.texture.trim.height=frame.sourceSizeH;}
else
{this.texture.trim={x:frame.spriteSourceSizeX,y:frame.spriteSourceSizeY,width:frame.sourceSizeW,height:frame.sourceSizeH};}
this.texture.width=frame.sourceSizeW;this.texture.height=frame.sourceSizeH;this.texture.frame.width=frame.sourceSizeW;this.texture.frame.height=frame.sourceSizeH;}
else if(!frame.trimmed&&this.texture.trim)
{this.texture.trim=null;}
if(this.cropRect)
{this.updateCrop();}
this.texture.requiresReTint=true;this.texture._updateUvs();if(this.tilingTexture)
{this.refreshTexture=true;}},resizeFrame:function(parent,width,height){this.texture.frame.resize(width,height);this.texture.setFrame(this.texture.frame);},resetFrame:function(){if(this._frame)
{this.setFrame(this._frame);}},frame:{get:function(){return this.animations.frame;},set:function(value){this.animations.frame=value;}},frameName:{get:function(){return this.animations.frameName;},set:function(value){this.animations.frameName=value;}}};Phaser.Component.Overlap=function(){};Phaser.Component.Overlap.prototype={overlap:function(displayObject){return Phaser.Rectangle.intersects(this.getBounds(),displayObject.getBounds());}};Phaser.Component.PhysicsBody=function(){};Phaser.Component.PhysicsBody.preUpdate=function(){if(this.fresh&&this.exists)
{this.world.setTo(this.parent.position.x+this.position.x,this.parent.position.y+this.position.y);this.worldTransform.tx=this.world.x;this.worldTransform.ty=this.world.y;this.previousPosition.set(this.world.x,this.world.y);this.previousRotation=this.rotation;if(this.body)
{this.body.preUpdate();}
this.fresh=false;return false;}
this.previousPosition.set(this.world.x,this.world.y);this.previousRotation=this.rotation;if(!this._exists||!this.parent.exists)
{this.renderOrderID=-1;return false;}
return true;};Phaser.Component.PhysicsBody.postUpdate=function(){if(this.exists&&this.body)
{this.body.postUpdate();}};Phaser.Component.PhysicsBody.prototype={body:null,x:{get:function(){return this.position.x;},set:function(value){this.position.x=value;if(this.body&&!this.body.dirty)
{this.body._reset=true;}}},y:{get:function(){return this.position.y;},set:function(value){this.position.y=value;if(this.body&&!this.body.dirty)
{this.body._reset=true;}}}};Phaser.Component.Reset=function(){};Phaser.Component.Reset.prototype.reset=function(x,y,health){if(health===undefined){health=1;}
this.world.set(x,y);this.position.set(x,y);this.fresh=true;this.exists=true;this.visible=true;this.renderable=true;if(this.components.InWorld)
{this._outOfBoundsFired=false;}
if(this.components.LifeSpan)
{this.alive=true;this.health=health;}
if(this.components.PhysicsBody)
{if(this.body)
{this.body.reset(x,y,false,false);}}
return this;};Phaser.Component.ScaleMinMax=function(){};Phaser.Component.ScaleMinMax.prototype={transformCallback:null,transformCallbackContext:this,scaleMin:null,scaleMax:null,checkTransform:function(wt){if(this.scaleMin)
{if(wt.a<this.scaleMin.x)
{wt.a=this.scaleMin.x;}
if(wt.d<this.scaleMin.y)
{wt.d=this.scaleMin.y;}}
if(this.scaleMax)
{if(wt.a>this.scaleMax.x)
{wt.a=this.scaleMax.x;}
if(wt.d>this.scaleMax.y)
{wt.d=this.scaleMax.y;}}},setScaleMinMax:function(minX,minY,maxX,maxY){if(minY===undefined)
{minY=maxX=maxY=minX;}
else if(maxX===undefined)
{maxX=maxY=minY;minY=minX;}
if(minX===null)
{this.scaleMin=null;}
else
{if(this.scaleMin)
{this.scaleMin.set(minX,minY);}
else
{this.scaleMin=new Phaser.Point(minX,minY);}}
if(maxX===null)
{this.scaleMax=null;}
else
{if(this.scaleMax)
{this.scaleMax.set(maxX,maxY);}
else
{this.scaleMax=new Phaser.Point(maxX,maxY);}}
if(this.scaleMin===null)
{this.transformCallback=null;}
else
{this.transformCallback=this.checkTransform;this.transformCallbackContext=this;}}};Phaser.Component.Smoothed=function(){};Phaser.Component.Smoothed.prototype={smoothed:{get:function(){return!this.texture.baseTexture.scaleMode;},set:function(value){if(value)
{if(this.texture)
{this.texture.baseTexture.scaleMode=0;}}
else
{if(this.texture)
{this.texture.baseTexture.scaleMode=1;}}}}};Phaser.GameObjectFactory=function(game){this.game=game;this.world=this.game.world;};Phaser.GameObjectFactory.prototype={existing:function(object){return this.world.add(object);},image:function(x,y,key,frame,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.Image(this.game,x,y,key,frame));},sprite:function(x,y,key,frame,group){if(group===undefined){group=this.world;}
return group.create(x,y,key,frame);},creature:function(x,y,key,mesh,group){if(group===undefined){group=this.world;}
var obj=new Phaser.Creature(this.game,x,y,key,mesh);group.add(obj);return obj;},tween:function(object){return this.game.tweens.create(object);},group:function(parent,name,addToStage,enableBody,physicsBodyType){return new Phaser.Group(this.game,parent,name,addToStage,enableBody,physicsBodyType);},physicsGroup:function(physicsBodyType,parent,name,addToStage){return new Phaser.Group(this.game,parent,name,addToStage,true,physicsBodyType);},spriteBatch:function(parent,name,addToStage){if(parent===undefined){parent=null;}
if(name===undefined){name='group';}
if(addToStage===undefined){addToStage=false;}
return new Phaser.SpriteBatch(this.game,parent,name,addToStage);},audio:function(key,volume,loop,connect){return this.game.sound.add(key,volume,loop,connect);},sound:function(key,volume,loop,connect){return this.game.sound.add(key,volume,loop,connect);},audioSprite:function(key){return this.game.sound.addSprite(key);},tileSprite:function(x,y,width,height,key,frame,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.TileSprite(this.game,x,y,width,height,key,frame));},rope:function(x,y,key,frame,points,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.Rope(this.game,x,y,key,frame,points));},text:function(x,y,text,style,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.Text(this.game,x,y,text,style));},button:function(x,y,key,callback,callbackContext,overFrame,outFrame,downFrame,upFrame,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.Button(this.game,x,y,key,callback,callbackContext,overFrame,outFrame,downFrame,upFrame));},graphics:function(x,y,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.Graphics(this.game,x,y));},emitter:function(x,y,maxParticles){return this.game.particles.add(new Phaser.Particles.Arcade.Emitter(this.game,x,y,maxParticles));},retroFont:function(font,characterWidth,characterHeight,chars,charsPerRow,xSpacing,ySpacing,xOffset,yOffset){return new Phaser.RetroFont(this.game,font,characterWidth,characterHeight,chars,charsPerRow,xSpacing,ySpacing,xOffset,yOffset);},bitmapText:function(x,y,font,text,size,group){if(group===undefined){group=this.world;}
return group.add(new Phaser.BitmapText(this.game,x,y,font,text,size));},tilemap:function(key,tileWidth,tileHeight,width,height){return new Phaser.Tilemap(this.game,key,tileWidth,tileHeight,width,height);},renderTexture:function(width,height,key,addToCache){if(key===undefined||key===''){key=this.game.rnd.uuid();}
if(addToCache===undefined){addToCache=false;}
var texture=new Phaser.RenderTexture(this.game,width,height,key);if(addToCache)
{this.game.cache.addRenderTexture(key,texture);}
return texture;},video:function(key,url){return new Phaser.Video(this.game,key,url);},bitmapData:function(width,height,key,addToCache){if(addToCache===undefined){addToCache=false;}
if(key===undefined||key===''){key=this.game.rnd.uuid();}
var texture=new Phaser.BitmapData(this.game,key,width,height);if(addToCache)
{this.game.cache.addBitmapData(key,texture);}
return texture;},filter:function(filter){var args=Array.prototype.slice.call(arguments,1);var filter=new Phaser.Filter[filter](this.game);filter.init.apply(filter,args);return filter;},plugin:function(plugin){return this.game.plugins.add(plugin);}};Phaser.GameObjectFactory.prototype.constructor=Phaser.GameObjectFactory;Phaser.GameObjectCreator=function(game){this.game=game;this.world=this.game.world;};Phaser.GameObjectCreator.prototype={image:function(x,y,key,frame){return new Phaser.Image(this.game,x,y,key,frame);},sprite:function(x,y,key,frame){return new Phaser.Sprite(this.game,x,y,key,frame);},tween:function(obj){return new Phaser.Tween(obj,this.game,this.game.tweens);},group:function(parent,name,addToStage,enableBody,physicsBodyType){return new Phaser.Group(this.game,parent,name,addToStage,enableBody,physicsBodyType);},spriteBatch:function(parent,name,addToStage){if(name===undefined){name='group';}
if(addToStage===undefined){addToStage=false;}
return new Phaser.SpriteBatch(this.game,parent,name,addToStage);},audio:function(key,volume,loop,connect){return this.game.sound.add(key,volume,loop,connect);},audioSprite:function(key){return this.game.sound.addSprite(key);},sound:function(key,volume,loop,connect){return this.game.sound.add(key,volume,loop,connect);},tileSprite:function(x,y,width,height,key,frame){return new Phaser.TileSprite(this.game,x,y,width,height,key,frame);},rope:function(x,y,key,frame,points){return new Phaser.Rope(this.game,x,y,key,frame,points);},text:function(x,y,text,style){return new Phaser.Text(this.game,x,y,text,style);},button:function(x,y,key,callback,callbackContext,overFrame,outFrame,downFrame,upFrame){return new Phaser.Button(this.game,x,y,key,callback,callbackContext,overFrame,outFrame,downFrame,upFrame);},graphics:function(x,y){return new Phaser.Graphics(this.game,x,y);},emitter:function(x,y,maxParticles){return new Phaser.Particles.Arcade.Emitter(this.game,x,y,maxParticles);},retroFont:function(font,characterWidth,characterHeight,chars,charsPerRow,xSpacing,ySpacing,xOffset,yOffset){return new Phaser.RetroFont(this.game,font,characterWidth,characterHeight,chars,charsPerRow,xSpacing,ySpacing,xOffset,yOffset);},bitmapText:function(x,y,font,text,size,align){return new Phaser.BitmapText(this.game,x,y,font,text,size,align);},tilemap:function(key,tileWidth,tileHeight,width,height){return new Phaser.Tilemap(this.game,key,tileWidth,tileHeight,width,height);},renderTexture:function(width,height,key,addToCache){if(key===undefined||key===''){key=this.game.rnd.uuid();}
if(addToCache===undefined){addToCache=false;}
var texture=new Phaser.RenderTexture(this.game,width,height,key);if(addToCache)
{this.game.cache.addRenderTexture(key,texture);}
return texture;},bitmapData:function(width,height,key,addToCache){if(addToCache===undefined){addToCache=false;}
if(key===undefined||key===''){key=this.game.rnd.uuid();}
var texture=new Phaser.BitmapData(this.game,key,width,height);if(addToCache)
{this.game.cache.addBitmapData(key,texture);}
return texture;},filter:function(filter){var args=Array.prototype.slice.call(arguments,1);var filter=new Phaser.Filter[filter](this.game);filter.init.apply(filter,args);return filter;}};Phaser.GameObjectCreator.prototype.constructor=Phaser.GameObjectCreator;Phaser.Sprite=function(game,x,y,key,frame){x=x||0;y=y||0;key=key||null;frame=frame||null;this.type=Phaser.SPRITE;this.physicsType=Phaser.SPRITE;PIXI.Sprite.call(this,PIXI.TextureCache['__default']);Phaser.Component.Core.init.call(this,game,x,y,key,frame);};Phaser.Sprite.prototype=Object.create(PIXI.Sprite.prototype);Phaser.Sprite.prototype.constructor=Phaser.Sprite;Phaser.Component.Core.install.call(Phaser.Sprite.prototype,['Angle','Animation','AutoCull','Bounds','BringToTop','Crop','Delta','Destroy','FixedToCamera','Health','InCamera','InputEnabled','InWorld','LifeSpan','LoadTexture','Overlap','PhysicsBody','Reset','ScaleMinMax','Smoothed']);Phaser.Sprite.prototype.preUpdatePhysics=Phaser.Component.PhysicsBody.preUpdate;Phaser.Sprite.prototype.preUpdateLifeSpan=Phaser.Component.LifeSpan.preUpdate;Phaser.Sprite.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.Sprite.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.Sprite.prototype.preUpdate=function(){if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.Image=function(game,x,y,key,frame){x=x||0;y=y||0;key=key||null;frame=frame||null;this.type=Phaser.IMAGE;PIXI.Sprite.call(this,PIXI.TextureCache['__default']);Phaser.Component.Core.init.call(this,game,x,y,key,frame);};Phaser.Image.prototype=Object.create(PIXI.Sprite.prototype);Phaser.Image.prototype.constructor=Phaser.Image;Phaser.Component.Core.install.call(Phaser.Image.prototype,['Angle','Animation','AutoCull','Bounds','BringToTop','Crop','Destroy','FixedToCamera','InputEnabled','LifeSpan','LoadTexture','Overlap','Reset','Smoothed']);Phaser.Image.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.Image.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.Image.prototype.preUpdate=function(){if(!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.Button=function(game,x,y,key,callback,callbackContext,overFrame,outFrame,downFrame,upFrame){x=x||0;y=y||0;key=key||null;callback=callback||null;callbackContext=callbackContext||this;Phaser.Image.call(this,game,x,y,key,outFrame);this.type=Phaser.BUTTON;this.physicsType=Phaser.SPRITE;this._onOverFrame=null;this._onOutFrame=null;this._onDownFrame=null;this._onUpFrame=null;this.onOverSound=null;this.onOutSound=null;this.onDownSound=null;this.onUpSound=null;this.onOverSoundMarker='';this.onOutSoundMarker='';this.onDownSoundMarker='';this.onUpSoundMarker='';this.onInputOver=new Phaser.Signal();this.onInputOut=new Phaser.Signal();this.onInputDown=new Phaser.Signal();this.onInputUp=new Phaser.Signal();this.onOverMouseOnly=true;this.justReleasedPreventsOver=Phaser.PointerMode.TOUCH;this.freezeFrames=false;this.forceOut=false;this.inputEnabled=true;this.input.start(0,true);this.input.useHandCursor=true;this.setFrames(overFrame,outFrame,downFrame,upFrame);if(callback!==null)
{this.onInputUp.add(callback,callbackContext);}
this.events.onInputOver.add(this.onInputOverHandler,this);this.events.onInputOut.add(this.onInputOutHandler,this);this.events.onInputDown.add(this.onInputDownHandler,this);this.events.onInputUp.add(this.onInputUpHandler,this);this.events.onRemovedFromWorld.add(this.removedFromWorld,this);};Phaser.Button.prototype=Object.create(Phaser.Image.prototype);Phaser.Button.prototype.constructor=Phaser.Button;var STATE_OVER='Over';var STATE_OUT='Out';var STATE_DOWN='Down';var STATE_UP='Up';Phaser.Button.prototype.clearFrames=function(){this.setFrames(null,null,null,null);};Phaser.Button.prototype.removedFromWorld=function(){this.inputEnabled=false;};Phaser.Button.prototype.setStateFrame=function(state,frame,switchImmediately)
{var frameKey='_on'+state+'Frame';if(frame!==null)
{this[frameKey]=frame;if(switchImmediately)
{this.changeStateFrame(state);}}
else
{this[frameKey]=null;}};Phaser.Button.prototype.changeStateFrame=function(state){if(this.freezeFrames)
{return false;}
var frameKey='_on'+state+'Frame';var frame=this[frameKey];if(typeof frame==='string')
{this.frameName=frame;return true;}
else if(typeof frame==='number')
{this.frame=frame;return true;}
else
{return false;}};Phaser.Button.prototype.setFrames=function(overFrame,outFrame,downFrame,upFrame){this.setStateFrame(STATE_OVER,overFrame,this.input.pointerOver());this.setStateFrame(STATE_OUT,outFrame,!this.input.pointerOver());this.setStateFrame(STATE_DOWN,downFrame,this.input.pointerDown());this.setStateFrame(STATE_UP,upFrame,this.input.pointerUp());};Phaser.Button.prototype.setStateSound=function(state,sound,marker){var soundKey='on'+state+'Sound';var markerKey='on'+state+'SoundMarker';if(sound instanceof Phaser.Sound||sound instanceof Phaser.AudioSprite)
{this[soundKey]=sound;this[markerKey]=typeof marker==='string'?marker:'';}
else
{this[soundKey]=null;this[markerKey]='';}};Phaser.Button.prototype.playStateSound=function(state){var soundKey='on'+state+'Sound';var sound=this[soundKey];if(sound)
{var markerKey='on'+state+'SoundMarker';var marker=this[markerKey];sound.play(marker);return true;}
else
{return false;}};Phaser.Button.prototype.setSounds=function(overSound,overMarker,downSound,downMarker,outSound,outMarker,upSound,upMarker){this.setStateSound(STATE_OVER,overSound,overMarker);this.setStateSound(STATE_OUT,outSound,outMarker);this.setStateSound(STATE_DOWN,downSound,downMarker);this.setStateSound(STATE_UP,upSound,upMarker);};Phaser.Button.prototype.setOverSound=function(sound,marker){this.setStateSound(STATE_OVER,sound,marker);};Phaser.Button.prototype.setOutSound=function(sound,marker){this.setStateSound(STATE_OUT,sound,marker);};Phaser.Button.prototype.setDownSound=function(sound,marker){this.setStateSound(STATE_DOWN,sound,marker);};Phaser.Button.prototype.setUpSound=function(sound,marker){this.setStateSound(STATE_UP,sound,marker);};Phaser.Button.prototype.onInputOverHandler=function(sprite,pointer){if(pointer.justReleased()&&(this.justReleasedPreventsOver&pointer.pointerMode)===pointer.pointerMode)
{return;}
this.changeStateFrame(STATE_OVER);if(this.onOverMouseOnly&&!pointer.isMouse)
{return;}
this.playStateSound(STATE_OVER);if(this.onInputOver)
{this.onInputOver.dispatch(this,pointer);}};Phaser.Button.prototype.onInputOutHandler=function(sprite,pointer){this.changeStateFrame(STATE_OUT);this.playStateSound(STATE_OUT);if(this.onInputOut)
{this.onInputOut.dispatch(this,pointer);}};Phaser.Button.prototype.onInputDownHandler=function(sprite,pointer){this.changeStateFrame(STATE_DOWN);this.playStateSound(STATE_DOWN);if(this.onInputDown)
{this.onInputDown.dispatch(this,pointer);}};Phaser.Button.prototype.onInputUpHandler=function(sprite,pointer,isOver){this.playStateSound(STATE_UP);if(this.onInputUp)
{this.onInputUp.dispatch(this,pointer,isOver);}
if(this.freezeFrames)
{return;}
if(this.forceOut===true||(this.forceOut&pointer.pointerMode)===pointer.pointerMode)
{this.changeStateFrame(STATE_OUT);}
else
{var changedUp=this.changeStateFrame(STATE_UP);if(!changedUp)
{if(isOver)
{this.changeStateFrame(STATE_OVER);}
else
{this.changeStateFrame(STATE_OUT);}}}};Phaser.SpriteBatch=function(game,parent,name,addToStage){if(parent===undefined||parent===null){parent=game.world;}
PIXI.SpriteBatch.call(this);Phaser.Group.call(this,game,parent,name,addToStage);this.type=Phaser.SPRITEBATCH;};Phaser.SpriteBatch.prototype=Phaser.Utils.extend(true,Phaser.SpriteBatch.prototype,Phaser.Group.prototype,PIXI.SpriteBatch.prototype);Phaser.SpriteBatch.prototype.constructor=Phaser.SpriteBatch;Phaser.BitmapData=function(game,key,width,height){if(width===undefined||width===0){width=256;}
if(height===undefined||height===0){height=256;}
this.game=game;this.key=key;this.width=width;this.height=height;this.canvas=PIXI.CanvasPool.create(this,width,height);this.context=this.canvas.getContext('2d',{alpha:true});this.ctx=this.context;this.imageData=this.context.getImageData(0,0,width,height);this.data=null;if(this.imageData)
{this.data=this.imageData.data;}
this.pixels=null;if(this.data)
{if(this.imageData.data.buffer)
{this.buffer=this.imageData.data.buffer;this.pixels=new Uint32Array(this.buffer);}
else
{if(window['ArrayBuffer'])
{this.buffer=new ArrayBuffer(this.imageData.data.length);this.pixels=new Uint32Array(this.buffer);}
else
{this.pixels=this.imageData.data;}}}
this.baseTexture=new PIXI.BaseTexture(this.canvas);this.texture=new PIXI.Texture(this.baseTexture);this.textureFrame=new Phaser.Frame(0,0,0,width,height,'bitmapData');this.texture.frame=this.textureFrame;this.type=Phaser.BITMAPDATA;this.disableTextureUpload=false;this.dirty=false;this.cls=this.clear;this._image=null;this._pos=new Phaser.Point();this._size=new Phaser.Point();this._scale=new Phaser.Point();this._rotate=0;this._alpha={prev:1,current:1};this._anchor=new Phaser.Point();this._tempR=0;this._tempG=0;this._tempB=0;this._circle=new Phaser.Circle();this._swapCanvas=PIXI.CanvasPool.create(this,width,height);};Phaser.BitmapData.prototype={move:function(x,y,wrap){if(x!==0)
{this.moveH(x,wrap);}
if(y!==0)
{this.moveV(y,wrap);}
return this;},moveH:function(distance,wrap){if(wrap===undefined){wrap=true;}
var c=this._swapCanvas;var ctx=c.getContext('2d');var h=this.height;var src=this.canvas;ctx.clearRect(0,0,this.width,this.height);if(distance<0)
{distance=Math.abs(distance);var w=this.width-distance;if(wrap)
{ctx.drawImage(src,0,0,distance,h,w,0,distance,h);}
ctx.drawImage(src,distance,0,w,h,0,0,w,h);}
else
{var w=this.width-distance;if(wrap)
{ctx.drawImage(src,w,0,distance,h,0,0,distance,h);}
ctx.drawImage(src,0,0,w,h,distance,0,w,h);}
this.clear();return this.copy(this._swapCanvas);},moveV:function(distance,wrap){if(wrap===undefined){wrap=true;}
var c=this._swapCanvas;var ctx=c.getContext('2d');var w=this.width;var src=this.canvas;ctx.clearRect(0,0,this.width,this.height);if(distance<0)
{distance=Math.abs(distance);var h=this.height-distance;if(wrap)
{ctx.drawImage(src,0,0,w,distance,0,h,w,distance);}
ctx.drawImage(src,0,distance,w,h,0,0,w,h);}
else
{var h=this.height-distance;if(wrap)
{ctx.drawImage(src,0,h,w,distance,0,0,w,distance);}
ctx.drawImage(src,0,0,w,h,0,distance,w,h);}
this.clear();return this.copy(this._swapCanvas);},add:function(object){if(Array.isArray(object))
{for(var i=0;i<object.length;i++)
{if(object[i]['loadTexture'])
{object[i].loadTexture(this);}}}
else
{object.loadTexture(this);}
return this;},load:function(source){if(typeof source==='string')
{source=this.game.cache.getImage(source);}
if(source)
{this.resize(source.width,source.height);this.cls();}
else
{return;}
this.draw(source);this.update();return this;},clear:function(x,y,width,height){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=this.width;}
if(height===undefined){height=this.height;}
this.context.clearRect(x,y,width,height);this.update();this.dirty=true;return this;},fill:function(r,g,b,a){if(a===undefined){a=1;}
this.context.fillStyle='rgba('+r+','+g+','+b+','+a+')';this.context.fillRect(0,0,this.width,this.height);this.dirty=true;return this;},generateTexture:function(key){var image=new Image();image.src=this.canvas.toDataURL("image/png");var obj=this.game.cache.addImage(key,'',image);return new PIXI.Texture(obj.base);},resize:function(width,height){if(width!==this.width||height!==this.height)
{this.width=width;this.height=height;this.canvas.width=width;this.canvas.height=height;this._swapCanvas.width=width;this._swapCanvas.height=height;this.baseTexture.width=width;this.baseTexture.height=height;this.textureFrame.width=width;this.textureFrame.height=height;this.texture.width=width;this.texture.height=height;this.texture.crop.width=width;this.texture.crop.height=height;this.update();this.dirty=true;}
return this;},update:function(x,y,width,height){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=Math.max(1,this.width);}
if(height===undefined){height=Math.max(1,this.height);}
this.imageData=this.context.getImageData(x,y,width,height);this.data=this.imageData.data;if(this.imageData.data.buffer)
{this.buffer=this.imageData.data.buffer;this.pixels=new Uint32Array(this.buffer);}
else
{if(window['ArrayBuffer'])
{this.buffer=new ArrayBuffer(this.imageData.data.length);this.pixels=new Uint32Array(this.buffer);}
else
{this.pixels=this.imageData.data;}}
return this;},processPixelRGB:function(callback,callbackContext,x,y,width,height){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=this.width;}
if(height===undefined){height=this.height;}
var w=x+width;var h=y+height;var pixel=Phaser.Color.createColor();var result={r:0,g:0,b:0,a:0};var dirty=false;for(var ty=y;ty<h;ty++)
{for(var tx=x;tx<w;tx++)
{Phaser.Color.unpackPixel(this.getPixel32(tx,ty),pixel);result=callback.call(callbackContext,pixel,tx,ty);if(result!==false&&result!==null&&result!==undefined)
{this.setPixel32(tx,ty,result.r,result.g,result.b,result.a,false);dirty=true;}}}
if(dirty)
{this.context.putImageData(this.imageData,0,0);this.dirty=true;}
return this;},processPixel:function(callback,callbackContext,x,y,width,height){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=this.width;}
if(height===undefined){height=this.height;}
var w=x+width;var h=y+height;var pixel=0;var result=0;var dirty=false;for(var ty=y;ty<h;ty++)
{for(var tx=x;tx<w;tx++)
{pixel=this.getPixel32(tx,ty);result=callback.call(callbackContext,pixel,tx,ty);if(result!==pixel)
{this.pixels[ty*this.width+tx]=result;dirty=true;}}}
if(dirty)
{this.context.putImageData(this.imageData,0,0);this.dirty=true;}
return this;},replaceRGB:function(r1,g1,b1,a1,r2,g2,b2,a2,region){var sx=0;var sy=0;var w=this.width;var h=this.height;var source=Phaser.Color.packPixel(r1,g1,b1,a1);if(region!==undefined&&region instanceof Phaser.Rectangle)
{sx=region.x;sy=region.y;w=region.width;h=region.height;}
for(var y=0;y<h;y++)
{for(var x=0;x<w;x++)
{if(this.getPixel32(sx+x,sy+y)===source)
{this.setPixel32(sx+x,sy+y,r2,g2,b2,a2,false);}}}
this.context.putImageData(this.imageData,0,0);this.dirty=true;return this;},setHSL:function(h,s,l,region){if(h===undefined||h===null){h=false;}
if(s===undefined||s===null){s=false;}
if(l===undefined||l===null){l=false;}
if(!h&&!s&&!l)
{return;}
if(region===undefined)
{region=new Phaser.Rectangle(0,0,this.width,this.height);}
var pixel=Phaser.Color.createColor();for(var y=region.y;y<region.bottom;y++)
{for(var x=region.x;x<region.right;x++)
{Phaser.Color.unpackPixel(this.getPixel32(x,y),pixel,true);if(h)
{pixel.h=h;}
if(s)
{pixel.s=s;}
if(l)
{pixel.l=l;}
Phaser.Color.HSLtoRGB(pixel.h,pixel.s,pixel.l,pixel);this.setPixel32(x,y,pixel.r,pixel.g,pixel.b,pixel.a,false);}}
this.context.putImageData(this.imageData,0,0);this.dirty=true;return this;},shiftHSL:function(h,s,l,region){if(h===undefined||h===null){h=false;}
if(s===undefined||s===null){s=false;}
if(l===undefined||l===null){l=false;}
if(!h&&!s&&!l)
{return;}
if(region===undefined)
{region=new Phaser.Rectangle(0,0,this.width,this.height);}
var pixel=Phaser.Color.createColor();for(var y=region.y;y<region.bottom;y++)
{for(var x=region.x;x<region.right;x++)
{Phaser.Color.unpackPixel(this.getPixel32(x,y),pixel,true);if(h)
{pixel.h=this.game.math.wrap(pixel.h+h,0,1);}
if(s)
{pixel.s=this.game.math.limitValue(pixel.s+s,0,1);}
if(l)
{pixel.l=this.game.math.limitValue(pixel.l+l,0,1);}
Phaser.Color.HSLtoRGB(pixel.h,pixel.s,pixel.l,pixel);this.setPixel32(x,y,pixel.r,pixel.g,pixel.b,pixel.a,false);}}
this.context.putImageData(this.imageData,0,0);this.dirty=true;return this;},setPixel32:function(x,y,red,green,blue,alpha,immediate){if(immediate===undefined){immediate=true;}
if(x>=0&&x<=this.width&&y>=0&&y<=this.height)
{if(Phaser.Device.LITTLE_ENDIAN)
{this.pixels[y*this.width+x]=(alpha<<24)|(blue<<16)|(green<<8)|red;}
else
{this.pixels[y*this.width+x]=(red<<24)|(green<<16)|(blue<<8)|alpha;}
if(immediate)
{this.context.putImageData(this.imageData,0,0);this.dirty=true;}}
return this;},setPixel:function(x,y,red,green,blue,immediate){return this.setPixel32(x,y,red,green,blue,255,immediate);},getPixel:function(x,y,out){if(!out)
{out=Phaser.Color.createColor();}
var index=~~(x+(y*this.width));index*=4;out.r=this.data[index];out.g=this.data[++index];out.b=this.data[++index];out.a=this.data[++index];return out;},getPixel32:function(x,y){if(x>=0&&x<=this.width&&y>=0&&y<=this.height)
{return this.pixels[y*this.width+x];}},getPixelRGB:function(x,y,out,hsl,hsv){return Phaser.Color.unpackPixel(this.getPixel32(x,y),out,hsl,hsv);},getPixels:function(rect){return this.context.getImageData(rect.x,rect.y,rect.width,rect.height);},getFirstPixel:function(direction){if(direction===undefined){direction=0;}
var pixel=Phaser.Color.createColor();var x=0;var y=0;var v=1;var scan=false;if(direction===1)
{v=-1;y=this.height;}
else if(direction===3)
{v=-1;x=this.width;}
do{Phaser.Color.unpackPixel(this.getPixel32(x,y),pixel);if(direction===0||direction===1)
{x++;if(x===this.width)
{x=0;y+=v;if(y>=this.height||y<=0)
{scan=true;}}}
else if(direction===2||direction===3)
{y++;if(y===this.height)
{y=0;x+=v;if(x>=this.width||x<=0)
{scan=true;}}}}
while(pixel.a===0&&!scan);pixel.x=x;pixel.y=y;return pixel;},getBounds:function(rect){if(rect===undefined){rect=new Phaser.Rectangle();}
rect.x=this.getFirstPixel(2).x;if(rect.x===this.width)
{return rect.setTo(0,0,0,0);}
rect.y=this.getFirstPixel(0).y;rect.width=(this.getFirstPixel(3).x-rect.x)+1;rect.height=(this.getFirstPixel(1).y-rect.y)+1;return rect;},addToWorld:function(x,y,anchorX,anchorY,scaleX,scaleY){scaleX=scaleX||1;scaleY=scaleY||1;var image=this.game.add.image(x,y,this);image.anchor.set(anchorX,anchorY);image.scale.set(scaleX,scaleY);return image;},copy:function(source,x,y,width,height,tx,ty,newWidth,newHeight,rotate,anchorX,anchorY,scaleX,scaleY,alpha,blendMode,roundPx){if(source===undefined||source===null){source=this;}
this._image=source;if(source instanceof Phaser.Sprite||source instanceof Phaser.Image||source instanceof Phaser.Text||source instanceof PIXI.Sprite)
{this._pos.set(source.texture.crop.x,source.texture.crop.y);this._size.set(source.texture.crop.width,source.texture.crop.height);this._scale.set(source.scale.x,source.scale.y);this._anchor.set(source.anchor.x,source.anchor.y);this._rotate=source.rotation;this._alpha.current=source.alpha;this._image=source.texture.baseTexture.source;if(tx===undefined||tx===null){tx=source.x;}
if(ty===undefined||ty===null){ty=source.y;}
if(source.texture.trim)
{tx+=source.texture.trim.x-source.anchor.x*source.texture.trim.width;ty+=source.texture.trim.y-source.anchor.y*source.texture.trim.height;}
if(source.tint!==0xFFFFFF)
{if(source.cachedTint!==source.tint)
{source.cachedTint=source.tint;source.tintedTexture=PIXI.CanvasTinter.getTintedTexture(source,source.tint);}
this._image=source.tintedTexture;}}
else
{this._pos.set(0);this._scale.set(1);this._anchor.set(0);this._rotate=0;this._alpha.current=1;if(source instanceof Phaser.BitmapData)
{this._image=source.canvas;}
else if(typeof source==='string')
{source=this.game.cache.getImage(source);if(source===null)
{return;}
else
{this._image=source;}}
this._size.set(this._image.width,this._image.height);}
if(x===undefined||x===null){x=0;}
if(y===undefined||y===null){y=0;}
if(width)
{this._size.x=width;}
if(height)
{this._size.y=height;}
if(tx===undefined||tx===null){tx=x;}
if(ty===undefined||ty===null){ty=y;}
if(newWidth===undefined||newWidth===null){newWidth=this._size.x;}
if(newHeight===undefined||newHeight===null){newHeight=this._size.y;}
if(typeof rotate==='number')
{this._rotate=rotate;}
if(typeof anchorX==='number')
{this._anchor.x=anchorX;}
if(typeof anchorY==='number')
{this._anchor.y=anchorY;}
if(typeof scaleX==='number')
{this._scale.x=scaleX;}
if(typeof scaleY==='number')
{this._scale.y=scaleY;}
if(typeof alpha==='number')
{this._alpha.current=alpha;}
if(blendMode===undefined){blendMode=null;}
if(roundPx===undefined){roundPx=false;}
if(this._alpha.current<=0||this._scale.x===0||this._scale.y===0||this._size.x===0||this._size.y===0)
{return;}
var ctx=this.context;this._alpha.prev=ctx.globalAlpha;ctx.save();ctx.globalAlpha=this._alpha.current;if(blendMode)
{this.op=blendMode;}
if(roundPx)
{tx|=0;ty|=0;}
ctx.translate(tx,ty);ctx.scale(this._scale.x,this._scale.y);ctx.rotate(this._rotate);ctx.drawImage(this._image,this._pos.x+x,this._pos.y+y,this._size.x,this._size.y,-newWidth*this._anchor.x,-newHeight*this._anchor.y,newWidth,newHeight);ctx.restore();ctx.globalAlpha=this._alpha.prev;this.dirty=true;return this;},copyRect:function(source,area,x,y,alpha,blendMode,roundPx){return this.copy(source,area.x,area.y,area.width,area.height,x,y,area.width,area.height,0,0,0,1,1,alpha,blendMode,roundPx);},draw:function(source,x,y,width,height,blendMode,roundPx){return this.copy(source,null,null,null,null,x,y,width,height,null,null,null,null,null,null,blendMode,roundPx);},drawGroup:function(group,blendMode,roundPx){if(group.total>0)
{group.forEachExists(this.copy,this,null,null,null,null,null,null,null,null,null,null,null,null,null,null,blendMode,roundPx);}
return this;},drawFull:function(parent,blendMode,roundPx){if(parent.worldVisible===false||parent.worldAlpha===0||(parent.hasOwnProperty('exists')&&parent.exists===false))
{return this;}
if(parent.type!==Phaser.GROUP&&parent.type!==Phaser.EMITTER&&parent.type!==Phaser.BITMAPTEXT)
{if(parent.type===Phaser.GRAPHICS)
{var bounds=parent.getBounds();this.ctx.save();this.ctx.translate(bounds.x,bounds.y);PIXI.CanvasGraphics.renderGraphics(parent,this.ctx);this.ctx.restore();}
else
{this.copy(parent,null,null,null,null,parent.worldPosition.x,parent.worldPosition.y,null,null,parent.worldRotation,null,null,parent.worldScale.x,parent.worldScale.y,parent.worldAlpha,blendMode,roundPx);}}
if(parent.children)
{for(var i=0;i<parent.children.length;i++)
{this.drawFull(parent.children[i],blendMode,roundPx);}}
return this;},shadow:function(color,blur,x,y){var ctx=this.context;if(color===undefined||color===null)
{ctx.shadowColor='rgba(0,0,0,0)';}
else
{ctx.shadowColor=color;ctx.shadowBlur=blur||5;ctx.shadowOffsetX=x||10;ctx.shadowOffsetY=y||10;}},alphaMask:function(source,mask,sourceRect,maskRect){if(maskRect===undefined||maskRect===null)
{this.draw(mask).blendSourceAtop();}
else
{this.draw(mask,maskRect.x,maskRect.y,maskRect.width,maskRect.height).blendSourceAtop();}
if(sourceRect===undefined||sourceRect===null)
{this.draw(source).blendReset();}
else
{this.draw(source,sourceRect.x,sourceRect.y,sourceRect.width,sourceRect.height).blendReset();}
return this;},extract:function(destination,r,g,b,a,resize,r2,g2,b2){if(a===undefined){a=255;}
if(resize===undefined){resize=false;}
if(r2===undefined){r2=r;}
if(g2===undefined){g2=g;}
if(b2===undefined){b2=b;}
if(resize)
{destination.resize(this.width,this.height);}
this.processPixelRGB(function(pixel,x,y)
{if(pixel.r===r&&pixel.g===g&&pixel.b===b)
{destination.setPixel32(x,y,r2,g2,b2,a,false);}
return false;},this);destination.context.putImageData(destination.imageData,0,0);destination.dirty=true;return destination;},rect:function(x,y,width,height,fillStyle){if(typeof fillStyle!=='undefined')
{this.context.fillStyle=fillStyle;}
this.context.fillRect(x,y,width,height);return this;},text:function(text,x,y,font,color,shadow){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(font===undefined){font='14px Courier';}
if(color===undefined){color='rgb(255,255,255)';}
if(shadow===undefined){shadow=true;}
var ctx=this.context;var prevFont=ctx.font;ctx.font=font;if(shadow)
{ctx.fillStyle='rgb(0,0,0)';ctx.fillText(text,x+1,y+1);}
ctx.fillStyle=color;ctx.fillText(text,x,y);ctx.font=prevFont;},circle:function(x,y,radius,fillStyle){var ctx=this.context;if(fillStyle!==undefined)
{ctx.fillStyle=fillStyle;}
ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2,false);ctx.closePath();ctx.fill();return this;},line:function(x1,y1,x2,y2,color,width){if(color===undefined){color='#fff';}
if(width===undefined){width=1;}
var ctx=this.context;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke();ctx.closePath();return this;},textureLine:function(line,image,repeat){if(repeat===undefined){repeat='repeat-x';}
if(typeof image==='string')
{image=this.game.cache.getImage(image);if(!image)
{return;}}
var width=line.length;if(repeat==='no-repeat'&&width>image.width)
{width=image.width;}
var ctx=this.context;ctx.fillStyle=ctx.createPattern(image,repeat);this._circle=new Phaser.Circle(line.start.x,line.start.y,image.height);this._circle.circumferencePoint(line.angle-1.5707963267948966,false,this._pos);ctx.save();ctx.translate(this._pos.x,this._pos.y);ctx.rotate(line.angle);ctx.fillRect(0,0,width,image.height);ctx.restore();this.dirty=true;return this;},render:function(){if(!this.disableTextureUpload&&this.dirty)
{this.baseTexture.dirty();this.dirty=false;}
return this;},destroy:function(){PIXI.CanvasPool.remove(this);},blendReset:function(){this.op='source-over';return this;},blendSourceOver:function(){this.op='source-over';return this;},blendSourceIn:function(){this.op='source-in';return this;},blendSourceOut:function(){this.op='source-out';return this;},blendSourceAtop:function(){this.op='source-atop';return this;},blendDestinationOver:function(){this.op='destination-over';return this;},blendDestinationIn:function(){this.op='destination-in';return this;},blendDestinationOut:function(){this.op='destination-out';return this;},blendDestinationAtop:function(){this.op='destination-atop';return this;},blendXor:function(){this.op='xor';return this;},blendAdd:function(){this.op='lighter';return this;},blendMultiply:function(){this.op='multiply';return this;},blendScreen:function(){this.op='screen';return this;},blendOverlay:function(){this.op='overlay';return this;},blendDarken:function(){this.op='darken';return this;},blendLighten:function(){this.op='lighten';return this;},blendColorDodge:function(){this.op='color-dodge';return this;},blendColorBurn:function(){this.op='color-burn';return this;},blendHardLight:function(){this.op='hard-light';return this;},blendSoftLight:function(){this.op='soft-light';return this;},blendDifference:function(){this.op='difference';return this;},blendExclusion:function(){this.op='exclusion';return this;},blendHue:function(){this.op='hue';return this;},blendSaturation:function(){this.op='saturation';return this;},blendColor:function(){this.op='color';return this;},blendLuminosity:function(){this.op='luminosity';return this;}};Object.defineProperty(Phaser.BitmapData.prototype,"smoothed",{get:function(){Phaser.Canvas.getSmoothingEnabled(this.context);},set:function(value){Phaser.Canvas.setSmoothingEnabled(this.context,value);}});Object.defineProperty(Phaser.BitmapData.prototype,"op",{get:function(){return this.context.globalCompositeOperation;},set:function(value){this.context.globalCompositeOperation=value;}});Phaser.BitmapData.getTransform=function(translateX,translateY,scaleX,scaleY,skewX,skewY){if(typeof translateX!=='number'){translateX=0;}
if(typeof translateY!=='number'){translateY=0;}
if(typeof scaleX!=='number'){scaleX=1;}
if(typeof scaleY!=='number'){scaleY=1;}
if(typeof skewX!=='number'){skewX=0;}
if(typeof skewY!=='number'){skewY=0;}
return{sx:scaleX,sy:scaleY,scaleX:scaleX,scaleY:scaleY,skewX:skewX,skewY:skewY,translateX:translateX,translateY:translateY,tx:translateX,ty:translateY};};Phaser.BitmapData.prototype.constructor=Phaser.BitmapData;PIXI.Graphics=function()
{PIXI.DisplayObjectContainer.call(this);this.renderable=true;this.fillAlpha=1;this.lineWidth=0;this.lineColor=0;this.graphicsData=[];this.tint=0xFFFFFF;this.blendMode=PIXI.blendModes.NORMAL;this.currentPath=null;this._webGL=[];this.isMask=false;this.boundsPadding=0;this._localBounds=new PIXI.Rectangle(0,0,1,1);this.dirty=true;this.webGLDirty=false;this.cachedSpriteDirty=false;};PIXI.Graphics.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);PIXI.Graphics.prototype.constructor=PIXI.Graphics;PIXI.Graphics.prototype.lineStyle=function(lineWidth,color,alpha)
{this.lineWidth=lineWidth||0;this.lineColor=color||0;this.lineAlpha=(alpha===undefined)?1:alpha;if(this.currentPath)
{if(this.currentPath.shape.points.length)
{this.drawShape(new PIXI.Polygon(this.currentPath.shape.points.slice(-2)));}
else
{this.currentPath.lineWidth=this.lineWidth;this.currentPath.lineColor=this.lineColor;this.currentPath.lineAlpha=this.lineAlpha;}}
return this;};PIXI.Graphics.prototype.moveTo=function(x,y)
{this.drawShape(new PIXI.Polygon([x,y]));return this;};PIXI.Graphics.prototype.lineTo=function(x,y)
{if(!this.currentPath)
{this.moveTo(0,0);}
this.currentPath.shape.points.push(x,y);this.dirty=true;return this;};PIXI.Graphics.prototype.quadraticCurveTo=function(cpX,cpY,toX,toY)
{if(this.currentPath)
{if(this.currentPath.shape.points.length===0)
{this.currentPath.shape.points=[0,0];}}
else
{this.moveTo(0,0);}
var xa,ya,n=20,points=this.currentPath.shape.points;if(points.length===0)
{this.moveTo(0,0);}
var fromX=points[points.length-2];var fromY=points[points.length-1];var j=0;for(var i=1;i<=n;++i)
{j=i / n;xa=fromX+((cpX-fromX)*j);ya=fromY+((cpY-fromY)*j);points.push(xa+(((cpX+((toX-cpX)*j))-xa)*j),ya+(((cpY+((toY-cpY)*j))-ya)*j));}
this.dirty=true;return this;};PIXI.Graphics.prototype.bezierCurveTo=function(cpX,cpY,cpX2,cpY2,toX,toY)
{if(this.currentPath)
{if(this.currentPath.shape.points.length===0)
{this.currentPath.shape.points=[0,0];}}
else
{this.moveTo(0,0);}
var n=20,dt,dt2,dt3,t2,t3,points=this.currentPath.shape.points;var fromX=points[points.length-2];var fromY=points[points.length-1];var j=0;for(var i=1;i<=n;++i)
{j=i / n;dt=(1-j);dt2=dt*dt;dt3=dt2*dt;t2=j*j;t3=t2*j;points.push(dt3*fromX+3*dt2*j*cpX+3*dt*t2*cpX2+t3*toX,dt3*fromY+3*dt2*j*cpY+3*dt*t2*cpY2+t3*toY);}
this.dirty=true;return this;};PIXI.Graphics.prototype.arcTo=function(x1,y1,x2,y2,radius)
{if(this.currentPath)
{if(this.currentPath.shape.points.length===0)
{this.currentPath.shape.points.push(x1,y1);}}
else
{this.moveTo(x1,y1);}
var points=this.currentPath.shape.points,fromX=points[points.length-2],fromY=points[points.length-1],a1=fromY-y1,b1=fromX-x1,a2=y2-y1,b2=x2-x1,mm=Math.abs(a1*b2-b1*a2);if(mm<1.0e-8||radius===0)
{if(points[points.length-2]!==x1||points[points.length-1]!==y1)
{points.push(x1,y1);}}
else
{var dd=a1*a1+b1*b1,cc=a2*a2+b2*b2,tt=a1*a2+b1*b2,k1=radius*Math.sqrt(dd)/ mm,k2=radius*Math.sqrt(cc)/ mm,j1=k1*tt / dd,j2=k2*tt / cc,cx=k1*b2+k2*b1,cy=k1*a2+k2*a1,px=b1*(k2+j1),py=a1*(k2+j1),qx=b2*(k1+j2),qy=a2*(k1+j2),startAngle=Math.atan2(py-cy,px-cx),endAngle=Math.atan2(qy-cy,qx-cx);this.arc(cx+x1,cy+y1,radius,startAngle,endAngle,b1*a2>b2*a1);}
this.dirty=true;return this;};PIXI.Graphics.prototype.arc=function(cx,cy,radius,startAngle,endAngle,anticlockwise)
{if(startAngle===endAngle)
{return this;}
if(anticlockwise===undefined){anticlockwise=false;}
if(!anticlockwise&&endAngle<=startAngle)
{endAngle+=Math.PI*2;}
else if(anticlockwise&&startAngle<=endAngle)
{startAngle+=Math.PI*2;}
var sweep=anticlockwise?(startAngle-endAngle)*-1:(endAngle-startAngle);var segs=Math.ceil(Math.abs(sweep)/(Math.PI*2))*40;if(sweep===0)
{return this;}
var startX=cx+Math.cos(startAngle)*radius;var startY=cy+Math.sin(startAngle)*radius;if(anticlockwise&&this.filling)
{this.moveTo(cx,cy);}
else
{this.moveTo(startX,startY);}
var points=this.currentPath.shape.points;var theta=sweep /(segs*2);var theta2=theta*2;var cTheta=Math.cos(theta);var sTheta=Math.sin(theta);var segMinus=segs-1;var remainder=(segMinus%1)/ segMinus;for(var i=0;i<=segMinus;i++)
{var real=i+remainder*i;var angle=((theta)+startAngle+(theta2*real));var c=Math.cos(angle);var s=-Math.sin(angle);points.push(((cTheta*c)+(sTheta*s))*radius+cx,((cTheta*-s)+(sTheta*c))*radius+cy);}
this.dirty=true;return this;};PIXI.Graphics.prototype.beginFill=function(color,alpha)
{this.filling=true;this.fillColor=color||0;this.fillAlpha=(alpha===undefined)?1:alpha;if(this.currentPath)
{if(this.currentPath.shape.points.length<=2)
{this.currentPath.fill=this.filling;this.currentPath.fillColor=this.fillColor;this.currentPath.fillAlpha=this.fillAlpha;}}
return this;};PIXI.Graphics.prototype.endFill=function()
{this.filling=false;this.fillColor=null;this.fillAlpha=1;return this;};PIXI.Graphics.prototype.drawRect=function(x,y,width,height)
{this.drawShape(new PIXI.Rectangle(x,y,width,height));return this;};PIXI.Graphics.prototype.drawRoundedRect=function(x,y,width,height,radius)
{this.drawShape(new PIXI.RoundedRectangle(x,y,width,height,radius));return this;};PIXI.Graphics.prototype.drawCircle=function(x,y,diameter)
{this.drawShape(new PIXI.Circle(x,y,diameter));return this;};PIXI.Graphics.prototype.drawEllipse=function(x,y,width,height)
{this.drawShape(new PIXI.Ellipse(x,y,width,height));return this;};PIXI.Graphics.prototype.drawPolygon=function(path)
{if(path instanceof Phaser.Polygon||path instanceof PIXI.Polygon)
{path=path.points;}
var points=path;if(!Array.isArray(points))
{points=new Array(arguments.length);for(var i=0;i<points.length;++i)
{points[i]=arguments[i];}}
this.drawShape(new Phaser.Polygon(points));return this;};PIXI.Graphics.prototype.clear=function()
{this.lineWidth=0;this.filling=false;this.dirty=true;this.clearDirty=true;this.graphicsData=[];return this;};PIXI.Graphics.prototype.generateTexture=function(resolution,scaleMode)
{resolution=resolution||1;var bounds=this.getBounds();var canvasBuffer=new PIXI.CanvasBuffer(bounds.width*resolution,bounds.height*resolution);var texture=PIXI.Texture.fromCanvas(canvasBuffer.canvas,scaleMode);texture.baseTexture.resolution=resolution;canvasBuffer.context.scale(resolution,resolution);canvasBuffer.context.translate(-bounds.x,-bounds.y);PIXI.CanvasGraphics.renderGraphics(this,canvasBuffer.context);return texture;};PIXI.Graphics.prototype._renderWebGL=function(renderSession)
{if(this.visible===false||this.alpha===0||this.isMask===true)return;if(this._cacheAsBitmap)
{if(this.dirty||this.cachedSpriteDirty)
{this._generateCachedSprite();this.updateCachedSpriteTexture();this.cachedSpriteDirty=false;this.dirty=false;}
this._cachedSprite.worldAlpha=this.worldAlpha;PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite,renderSession);return;}
else
{renderSession.spriteBatch.stop();renderSession.blendModeManager.setBlendMode(this.blendMode);if(this._mask)renderSession.maskManager.pushMask(this._mask,renderSession);if(this._filters)renderSession.filterManager.pushFilter(this._filterBlock);if(this.blendMode!==renderSession.spriteBatch.currentBlendMode)
{renderSession.spriteBatch.currentBlendMode=this.blendMode;var blendModeWebGL=PIXI.blendModesWebGL[renderSession.spriteBatch.currentBlendMode];renderSession.spriteBatch.gl.blendFunc(blendModeWebGL[0],blendModeWebGL[1]);}
if(this.webGLDirty)
{this.dirty=true;this.webGLDirty=false;}
PIXI.WebGLGraphics.renderGraphics(this,renderSession);if(this.children.length)
{renderSession.spriteBatch.start();for(var i=0;i<this.children.length;i++)
{this.children[i]._renderWebGL(renderSession);}
renderSession.spriteBatch.stop();}
if(this._filters)renderSession.filterManager.popFilter();if(this._mask)renderSession.maskManager.popMask(this.mask,renderSession);renderSession.drawCount++;renderSession.spriteBatch.start();}};PIXI.Graphics.prototype._renderCanvas=function(renderSession)
{if(this.visible===false||this.alpha===0||this.isMask===true)return;if(this._prevTint!==this.tint){this.dirty=true;this._prevTint=this.tint;}
if(this._cacheAsBitmap)
{if(this.dirty||this.cachedSpriteDirty)
{this._generateCachedSprite();this.updateCachedSpriteTexture();this.cachedSpriteDirty=false;this.dirty=false;}
this._cachedSprite.alpha=this.alpha;PIXI.Sprite.prototype._renderCanvas.call(this._cachedSprite,renderSession);return;}
else
{var context=renderSession.context;var transform=this.worldTransform;if(this.blendMode!==renderSession.currentBlendMode)
{renderSession.currentBlendMode=this.blendMode;context.globalCompositeOperation=PIXI.blendModesCanvas[renderSession.currentBlendMode];}
if(this._mask)
{renderSession.maskManager.pushMask(this._mask,renderSession);}
var resolution=renderSession.resolution;context.setTransform(transform.a*resolution,transform.b*resolution,transform.c*resolution,transform.d*resolution,transform.tx*resolution,transform.ty*resolution);PIXI.CanvasGraphics.renderGraphics(this,context);for(var i=0;i<this.children.length;i++)
{this.children[i]._renderCanvas(renderSession);}
if(this._mask)
{renderSession.maskManager.popMask(renderSession);}}};PIXI.Graphics.prototype.getBounds=function(matrix)
{if(!this._currentBounds)
{if(!this.renderable)
{return PIXI.EmptyRectangle;}
if(this.dirty)
{this.updateLocalBounds();this.webGLDirty=true;this.cachedSpriteDirty=true;this.dirty=false;}
var bounds=this._localBounds;var w0=bounds.x;var w1=bounds.width+bounds.x;var h0=bounds.y;var h1=bounds.height+bounds.y;var worldTransform=matrix||this.worldTransform;var a=worldTransform.a;var b=worldTransform.b;var c=worldTransform.c;var d=worldTransform.d;var tx=worldTransform.tx;var ty=worldTransform.ty;var x1=a*w1+c*h1+tx;var y1=d*h1+b*w1+ty;var x2=a*w0+c*h1+tx;var y2=d*h1+b*w0+ty;var x3=a*w0+c*h0+tx;var y3=d*h0+b*w0+ty;var x4=a*w1+c*h0+tx;var y4=d*h0+b*w1+ty;var maxX=x1;var maxY=y1;var minX=x1;var minY=y1;minX=x2<minX?x2:minX;minX=x3<minX?x3:minX;minX=x4<minX?x4:minX;minY=y2<minY?y2:minY;minY=y3<minY?y3:minY;minY=y4<minY?y4:minY;maxX=x2>maxX?x2:maxX;maxX=x3>maxX?x3:maxX;maxX=x4>maxX?x4:maxX;maxY=y2>maxY?y2:maxY;maxY=y3>maxY?y3:maxY;maxY=y4>maxY?y4:maxY;this._bounds.x=minX;this._bounds.width=maxX-minX;this._bounds.y=minY;this._bounds.height=maxY-minY;this._currentBounds=this._bounds;}
return this._currentBounds;};PIXI.Graphics.prototype.containsPoint=function(point)
{this.worldTransform.applyInverse(point,tempPoint);var graphicsData=this.graphicsData;for(var i=0;i<graphicsData.length;i++)
{var data=graphicsData[i];if(!data.fill)
{continue;}
if(data.shape)
{if(data.shape.contains(tempPoint.x,tempPoint.y))
{return true;}}}
return false;};PIXI.Graphics.prototype.updateLocalBounds=function()
{var minX=Infinity;var maxX=-Infinity;var minY=Infinity;var maxY=-Infinity;if(this.graphicsData.length)
{var shape,points,x,y,w,h;for(var i=0;i<this.graphicsData.length;i++)
{var data=this.graphicsData[i];var type=data.type;var lineWidth=data.lineWidth;shape=data.shape;if(type===PIXI.Graphics.RECT||type===PIXI.Graphics.RREC)
{x=shape.x-lineWidth / 2;y=shape.y-lineWidth / 2;w=shape.width+lineWidth;h=shape.height+lineWidth;minX=x<minX?x:minX;maxX=x+w>maxX?x+w:maxX;minY=y<minY?y:minY;maxY=y+h>maxY?y+h:maxY;}
else if(type===PIXI.Graphics.CIRC)
{x=shape.x;y=shape.y;w=shape.radius+lineWidth / 2;h=shape.radius+lineWidth / 2;minX=x-w<minX?x-w:minX;maxX=x+w>maxX?x+w:maxX;minY=y-h<minY?y-h:minY;maxY=y+h>maxY?y+h:maxY;}
else if(type===PIXI.Graphics.ELIP)
{x=shape.x;y=shape.y;w=shape.width+lineWidth / 2;h=shape.height+lineWidth / 2;minX=x-w<minX?x-w:minX;maxX=x+w>maxX?x+w:maxX;minY=y-h<minY?y-h:minY;maxY=y+h>maxY?y+h:maxY;}
else
{points=shape.points;for(var j=0;j<points.length;j++)
{if(points[j]instanceof Phaser.Point)
{x=points[j].x;y=points[j].y;}
else
{x=points[j];y=points[j+1];if(j<points.length-1)
{j++;}}
minX=x-lineWidth<minX?x-lineWidth:minX;maxX=x+lineWidth>maxX?x+lineWidth:maxX;minY=y-lineWidth<minY?y-lineWidth:minY;maxY=y+lineWidth>maxY?y+lineWidth:maxY;}}}}
else
{minX=0;maxX=0;minY=0;maxY=0;}
var padding=this.boundsPadding;this._localBounds.x=minX-padding;this._localBounds.width=(maxX-minX)+padding*2;this._localBounds.y=minY-padding;this._localBounds.height=(maxY-minY)+padding*2;};PIXI.Graphics.prototype._generateCachedSprite=function()
{var bounds=this.getLocalBounds();if(!this._cachedSprite)
{var canvasBuffer=new PIXI.CanvasBuffer(bounds.width,bounds.height);var texture=PIXI.Texture.fromCanvas(canvasBuffer.canvas);this._cachedSprite=new PIXI.Sprite(texture);this._cachedSprite.buffer=canvasBuffer;this._cachedSprite.worldTransform=this.worldTransform;}
else
{this._cachedSprite.buffer.resize(bounds.width,bounds.height);}
this._cachedSprite.anchor.x=-(bounds.x / bounds.width);this._cachedSprite.anchor.y=-(bounds.y / bounds.height);this._cachedSprite.buffer.context.translate(-bounds.x,-bounds.y);this.worldAlpha=1;PIXI.CanvasGraphics.renderGraphics(this,this._cachedSprite.buffer.context);this._cachedSprite.alpha=this.alpha;};PIXI.Graphics.prototype.updateCachedSpriteTexture=function()
{var cachedSprite=this._cachedSprite;var texture=cachedSprite.texture;var canvas=cachedSprite.buffer.canvas;texture.baseTexture.width=canvas.width;texture.baseTexture.height=canvas.height;texture.crop.width=texture.frame.width=canvas.width;texture.crop.height=texture.frame.height=canvas.height;cachedSprite._width=canvas.width;cachedSprite._height=canvas.height;texture.baseTexture.dirty();};PIXI.Graphics.prototype.destroyCachedSprite=function()
{this._cachedSprite.texture.destroy(true);this._cachedSprite=null;};PIXI.Graphics.prototype.drawShape=function(shape)
{if(this.currentPath)
{if(this.currentPath.shape.points.length<=2)
{this.graphicsData.pop();}}
this.currentPath=null;if(shape instanceof Phaser.Polygon)
{shape=shape.clone();shape.flatten();}
var data=new PIXI.GraphicsData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.filling,shape);this.graphicsData.push(data);if(data.type===PIXI.Graphics.POLY)
{data.shape.closed=this.filling;this.currentPath=data;}
this.dirty=true;return data;};Object.defineProperty(PIXI.Graphics.prototype,"cacheAsBitmap",{get:function(){return this._cacheAsBitmap;},set:function(value){this._cacheAsBitmap=value;if(this._cacheAsBitmap)
{this._generateCachedSprite();}
else
{this.destroyCachedSprite();this.dirty=true;}}});PIXI.GraphicsData=function(lineWidth,lineColor,lineAlpha,fillColor,fillAlpha,fill,shape){this.lineWidth=lineWidth;this.lineColor=lineColor;this.lineAlpha=lineAlpha;this._lineTint=lineColor;this.fillColor=fillColor;this.fillAlpha=fillAlpha;this._fillTint=fillColor;this.fill=fill;this.shape=shape;this.type=shape.type;};PIXI.GraphicsData.prototype.constructor=PIXI.GraphicsData;PIXI.GraphicsData.prototype.clone=function(){return new GraphicsData(this.lineWidth,this.lineColor,this.lineAlpha,this.fillColor,this.fillAlpha,this.fill,this.shape);};PIXI.PolyK={};PIXI.PolyK.Triangulate=function(p)
{var sign=true;var n=p.length>>1;if(n<3)return[];var tgs=[];var avl=[];for(var i=0;i<n;i++)avl.push(i);i=0;var al=n;while(al>3)
{var i0=avl[(i+0)%al];var i1=avl[(i+1)%al];var i2=avl[(i+2)%al];var ax=p[2*i0],ay=p[2*i0+1];var bx=p[2*i1],by=p[2*i1+1];var cx=p[2*i2],cy=p[2*i2+1];var earFound=false;if(PIXI.PolyK._convex(ax,ay,bx,by,cx,cy,sign))
{earFound=true;for(var j=0;j<al;j++)
{var vi=avl[j];if(vi===i0||vi===i1||vi===i2)continue;if(PIXI.PolyK._PointInTriangle(p[2*vi],p[2*vi+1],ax,ay,bx,by,cx,cy)){earFound=false;break;}}}
if(earFound)
{tgs.push(i0,i1,i2);avl.splice((i+1)%al,1);al--;i=0;}
else if(i++>3*al)
{if(sign)
{tgs=[];avl=[];for(i=0;i<n;i++)avl.push(i);i=0;al=n;sign=false;}
else
{return null;}}}
tgs.push(avl[0],avl[1],avl[2]);return tgs;};PIXI.PolyK._PointInTriangle=function(px,py,ax,ay,bx,by,cx,cy)
{var v0x=cx-ax;var v0y=cy-ay;var v1x=bx-ax;var v1y=by-ay;var v2x=px-ax;var v2y=py-ay;var dot00=v0x*v0x+v0y*v0y;var dot01=v0x*v1x+v0y*v1y;var dot02=v0x*v2x+v0y*v2y;var dot11=v1x*v1x+v1y*v1y;var dot12=v1x*v2x+v1y*v2y;var invDenom=1 /(dot00*dot11-dot01*dot01);var u=(dot11*dot02-dot01*dot12)*invDenom;var v=(dot00*dot12-dot01*dot02)*invDenom;return(u>=0)&&(v>=0)&&(u+v<1);};PIXI.PolyK._convex=function(ax,ay,bx,by,cx,cy,sign)
{return((ay-by)*(cx-bx)+(bx-ax)*(cy-by)>=0)===sign;};PIXI.WebGLGraphics=function()
{};PIXI.WebGLGraphics.renderGraphics=function(graphics,renderSession)
{var gl=renderSession.gl;var projection=renderSession.projection,offset=renderSession.offset,shader=renderSession.shaderManager.primitiveShader,webGLData;if(graphics.dirty)
{PIXI.WebGLGraphics.updateGraphics(graphics,gl);}
var webGL=graphics._webGL[gl.id];for(var i=0;i<webGL.data.length;i++)
{if(webGL.data[i].mode===1)
{webGLData=webGL.data[i];renderSession.stencilManager.pushStencil(graphics,webGLData,renderSession);gl.drawElements(gl.TRIANGLE_FAN,4,gl.UNSIGNED_SHORT,(webGLData.indices.length-4)*2);renderSession.stencilManager.popStencil(graphics,webGLData,renderSession);}
else
{webGLData=webGL.data[i];renderSession.shaderManager.setShader(shader);shader=renderSession.shaderManager.primitiveShader;gl.uniformMatrix3fv(shader.translationMatrix,false,graphics.worldTransform.toArray(true));gl.uniform1f(shader.flipY,1);gl.uniform2f(shader.projectionVector,projection.x,-projection.y);gl.uniform2f(shader.offsetVector,-offset.x,-offset.y);gl.uniform3fv(shader.tintColor,PIXI.hex2rgb(graphics.tint));gl.uniform1f(shader.alpha,graphics.worldAlpha);gl.bindBuffer(gl.ARRAY_BUFFER,webGLData.buffer);gl.vertexAttribPointer(shader.aVertexPosition,2,gl.FLOAT,false,4*6,0);gl.vertexAttribPointer(shader.colorAttribute,4,gl.FLOAT,false,4*6,2*4);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,webGLData.indexBuffer);gl.drawElements(gl.TRIANGLE_STRIP,webGLData.indices.length,gl.UNSIGNED_SHORT,0);}}};PIXI.WebGLGraphics.updateGraphics=function(graphics,gl)
{var webGL=graphics._webGL[gl.id];if(!webGL)webGL=graphics._webGL[gl.id]={lastIndex:0,data:[],gl:gl};graphics.dirty=false;var i;if(graphics.clearDirty)
{graphics.clearDirty=false;for(i=0;i<webGL.data.length;i++)
{var graphicsData=webGL.data[i];graphicsData.reset();PIXI.WebGLGraphics.graphicsDataPool.push(graphicsData);}
webGL.data=[];webGL.lastIndex=0;}
var webGLData;for(i=webGL.lastIndex;i<graphics.graphicsData.length;i++)
{var data=graphics.graphicsData[i];if(data.type===PIXI.Graphics.POLY)
{data.points=data.shape.points.slice();if(data.shape.closed)
{if(data.points[0]!==data.points[data.points.length-2]||data.points[1]!==data.points[data.points.length-1])
{data.points.push(data.points[0],data.points[1]);}}
if(data.fill)
{if(data.points.length>=6)
{if(data.points.length<6*2)
{webGLData=PIXI.WebGLGraphics.switchMode(webGL,0);var canDrawUsingSimple=PIXI.WebGLGraphics.buildPoly(data,webGLData);if(!canDrawUsingSimple)
{webGLData=PIXI.WebGLGraphics.switchMode(webGL,1);PIXI.WebGLGraphics.buildComplexPoly(data,webGLData);}}
else
{webGLData=PIXI.WebGLGraphics.switchMode(webGL,1);PIXI.WebGLGraphics.buildComplexPoly(data,webGLData);}}}
if(data.lineWidth>0)
{webGLData=PIXI.WebGLGraphics.switchMode(webGL,0);PIXI.WebGLGraphics.buildLine(data,webGLData);}}
else
{webGLData=PIXI.WebGLGraphics.switchMode(webGL,0);if(data.type===PIXI.Graphics.RECT)
{PIXI.WebGLGraphics.buildRectangle(data,webGLData);}
else if(data.type===PIXI.Graphics.CIRC||data.type===PIXI.Graphics.ELIP)
{PIXI.WebGLGraphics.buildCircle(data,webGLData);}
else if(data.type===PIXI.Graphics.RREC)
{PIXI.WebGLGraphics.buildRoundedRectangle(data,webGLData);}}
webGL.lastIndex++;}
for(i=0;i<webGL.data.length;i++)
{webGLData=webGL.data[i];if(webGLData.dirty)webGLData.upload();}};PIXI.WebGLGraphics.switchMode=function(webGL,type)
{var webGLData;if(!webGL.data.length)
{webGLData=PIXI.WebGLGraphics.graphicsDataPool.pop()||new PIXI.WebGLGraphicsData(webGL.gl);webGLData.mode=type;webGL.data.push(webGLData);}
else
{webGLData=webGL.data[webGL.data.length-1];if(webGLData.mode!==type||type===1)
{webGLData=PIXI.WebGLGraphics.graphicsDataPool.pop()||new PIXI.WebGLGraphicsData(webGL.gl);webGLData.mode=type;webGL.data.push(webGLData);}}
webGLData.dirty=true;return webGLData;};PIXI.WebGLGraphics.buildRectangle=function(graphicsData,webGLData)
{var rectData=graphicsData.shape;var x=rectData.x;var y=rectData.y;var width=rectData.width;var height=rectData.height;if(graphicsData.fill)
{var color=PIXI.hex2rgb(graphicsData.fillColor);var alpha=graphicsData.fillAlpha;var r=color[0]*alpha;var g=color[1]*alpha;var b=color[2]*alpha;var verts=webGLData.points;var indices=webGLData.indices;var vertPos=verts.length/6;verts.push(x,y);verts.push(r,g,b,alpha);verts.push(x+width,y);verts.push(r,g,b,alpha);verts.push(x,y+height);verts.push(r,g,b,alpha);verts.push(x+width,y+height);verts.push(r,g,b,alpha);indices.push(vertPos,vertPos,vertPos+1,vertPos+2,vertPos+3,vertPos+3);}
if(graphicsData.lineWidth)
{var tempPoints=graphicsData.points;graphicsData.points=[x,y,x+width,y,x+width,y+height,x,y+height,x,y];PIXI.WebGLGraphics.buildLine(graphicsData,webGLData);graphicsData.points=tempPoints;}};PIXI.WebGLGraphics.buildRoundedRectangle=function(graphicsData,webGLData)
{var rrectData=graphicsData.shape;var x=rrectData.x;var y=rrectData.y;var width=rrectData.width;var height=rrectData.height;var radius=rrectData.radius;var recPoints=[];recPoints.push(x,y+radius);recPoints=recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x,y+height-radius,x,y+height,x+radius,y+height));recPoints=recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x+width-radius,y+height,x+width,y+height,x+width,y+height-radius));recPoints=recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x+width,y+radius,x+width,y,x+width-radius,y));recPoints=recPoints.concat(PIXI.WebGLGraphics.quadraticBezierCurve(x+radius,y,x,y,x,y+radius));if(graphicsData.fill){var color=PIXI.hex2rgb(graphicsData.fillColor);var alpha=graphicsData.fillAlpha;var r=color[0]*alpha;var g=color[1]*alpha;var b=color[2]*alpha;var verts=webGLData.points;var indices=webGLData.indices;var vecPos=verts.length/6;var triangles=PIXI.PolyK.Triangulate(recPoints);var i=0;for(i=0;i<triangles.length;i+=3)
{indices.push(triangles[i]+vecPos);indices.push(triangles[i]+vecPos);indices.push(triangles[i+1]+vecPos);indices.push(triangles[i+2]+vecPos);indices.push(triangles[i+2]+vecPos);}
for(i=0;i<recPoints.length;i++)
{verts.push(recPoints[i],recPoints[++i],r,g,b,alpha);}}
if(graphicsData.lineWidth){var tempPoints=graphicsData.points;graphicsData.points=recPoints;PIXI.WebGLGraphics.buildLine(graphicsData,webGLData);graphicsData.points=tempPoints;}};PIXI.WebGLGraphics.quadraticBezierCurve=function(fromX,fromY,cpX,cpY,toX,toY){var xa,ya,xb,yb,x,y,n=20,points=[];function getPt(n1,n2,perc){var diff=n2-n1;return n1+(diff*perc);}
var j=0;for(var i=0;i<=n;i++)
{j=i / n;xa=getPt(fromX,cpX,j);ya=getPt(fromY,cpY,j);xb=getPt(cpX,toX,j);yb=getPt(cpY,toY,j);x=getPt(xa,xb,j);y=getPt(ya,yb,j);points.push(x,y);}
return points;};PIXI.WebGLGraphics.buildCircle=function(graphicsData,webGLData)
{var circleData=graphicsData.shape;var x=circleData.x;var y=circleData.y;var width;var height;if(graphicsData.type===PIXI.Graphics.CIRC)
{width=circleData.radius;height=circleData.radius;}
else
{width=circleData.width;height=circleData.height;}
var totalSegs=40;var seg=(Math.PI*2)/ totalSegs;var i=0;if(graphicsData.fill)
{var color=PIXI.hex2rgb(graphicsData.fillColor);var alpha=graphicsData.fillAlpha;var r=color[0]*alpha;var g=color[1]*alpha;var b=color[2]*alpha;var verts=webGLData.points;var indices=webGLData.indices;var vecPos=verts.length/6;indices.push(vecPos);for(i=0;i<totalSegs+1;i++)
{verts.push(x,y,r,g,b,alpha);verts.push(x+Math.sin(seg*i)*width,y+Math.cos(seg*i)*height,r,g,b,alpha);indices.push(vecPos++,vecPos++);}
indices.push(vecPos-1);}
if(graphicsData.lineWidth)
{var tempPoints=graphicsData.points;graphicsData.points=[];for(i=0;i<totalSegs+1;i++)
{graphicsData.points.push(x+Math.sin(seg*i)*width,y+Math.cos(seg*i)*height);}
PIXI.WebGLGraphics.buildLine(graphicsData,webGLData);graphicsData.points=tempPoints;}};PIXI.WebGLGraphics.buildLine=function(graphicsData,webGLData)
{var i=0;var points=graphicsData.points;if(points.length===0)return;if(graphicsData.lineWidth%2)
{for(i=0;i<points.length;i++){points[i]+=0.5;}}
var firstPoint=new PIXI.Point(points[0],points[1]);var lastPoint=new PIXI.Point(points[points.length-2],points[points.length-1]);if(firstPoint.x===lastPoint.x&&firstPoint.y===lastPoint.y)
{points=points.slice();points.pop();points.pop();lastPoint=new PIXI.Point(points[points.length-2],points[points.length-1]);var midPointX=lastPoint.x+(firstPoint.x-lastPoint.x)*0.5;var midPointY=lastPoint.y+(firstPoint.y-lastPoint.y)*0.5;points.unshift(midPointX,midPointY);points.push(midPointX,midPointY);}
var verts=webGLData.points;var indices=webGLData.indices;var length=points.length / 2;var indexCount=points.length;var indexStart=verts.length/6;var width=graphicsData.lineWidth / 2;var color=PIXI.hex2rgb(graphicsData.lineColor);var alpha=graphicsData.lineAlpha;var r=color[0]*alpha;var g=color[1]*alpha;var b=color[2]*alpha;var px,py,p1x,p1y,p2x,p2y,p3x,p3y;var perpx,perpy,perp2x,perp2y,perp3x,perp3y;var a1,b1,c1,a2,b2,c2;var denom,pdist,dist;p1x=points[0];p1y=points[1];p2x=points[2];p2y=points[3];perpx=-(p1y-p2y);perpy=p1x-p2x;dist=Math.sqrt(perpx*perpx+perpy*perpy);perpx /=dist;perpy /=dist;perpx*=width;perpy*=width;verts.push(p1x-perpx,p1y-perpy,r,g,b,alpha);verts.push(p1x+perpx,p1y+perpy,r,g,b,alpha);for(i=1;i<length-1;i++)
{p1x=points[(i-1)*2];p1y=points[(i-1)*2+1];p2x=points[(i)*2];p2y=points[(i)*2+1];p3x=points[(i+1)*2];p3y=points[(i+1)*2+1];perpx=-(p1y-p2y);perpy=p1x-p2x;dist=Math.sqrt(perpx*perpx+perpy*perpy);perpx /=dist;perpy /=dist;perpx*=width;perpy*=width;perp2x=-(p2y-p3y);perp2y=p2x-p3x;dist=Math.sqrt(perp2x*perp2x+perp2y*perp2y);perp2x /=dist;perp2y /=dist;perp2x*=width;perp2y*=width;a1=(-perpy+p1y)-(-perpy+p2y);b1=(-perpx+p2x)-(-perpx+p1x);c1=(-perpx+p1x)*(-perpy+p2y)-(-perpx+p2x)*(-perpy+p1y);a2=(-perp2y+p3y)-(-perp2y+p2y);b2=(-perp2x+p2x)-(-perp2x+p3x);c2=(-perp2x+p3x)*(-perp2y+p2y)-(-perp2x+p2x)*(-perp2y+p3y);denom=a1*b2-a2*b1;if(Math.abs(denom)<0.1)
{denom+=10.1;verts.push(p2x-perpx,p2y-perpy,r,g,b,alpha);verts.push(p2x+perpx,p2y+perpy,r,g,b,alpha);continue;}
px=(b1*c2-b2*c1)/denom;py=(a2*c1-a1*c2)/denom;pdist=(px-p2x)*(px-p2x)+(py-p2y)+(py-p2y);if(pdist>140*140)
{perp3x=perpx-perp2x;perp3y=perpy-perp2y;dist=Math.sqrt(perp3x*perp3x+perp3y*perp3y);perp3x /=dist;perp3y /=dist;perp3x*=width;perp3y*=width;verts.push(p2x-perp3x,p2y-perp3y);verts.push(r,g,b,alpha);verts.push(p2x+perp3x,p2y+perp3y);verts.push(r,g,b,alpha);verts.push(p2x-perp3x,p2y-perp3y);verts.push(r,g,b,alpha);indexCount++;}
else
{verts.push(px,py);verts.push(r,g,b,alpha);verts.push(p2x-(px-p2x),p2y-(py-p2y));verts.push(r,g,b,alpha);}}
p1x=points[(length-2)*2];p1y=points[(length-2)*2+1];p2x=points[(length-1)*2];p2y=points[(length-1)*2+1];perpx=-(p1y-p2y);perpy=p1x-p2x;dist=Math.sqrt(perpx*perpx+perpy*perpy);perpx /=dist;perpy /=dist;perpx*=width;perpy*=width;verts.push(p2x-perpx,p2y-perpy);verts.push(r,g,b,alpha);verts.push(p2x+perpx,p2y+perpy);verts.push(r,g,b,alpha);indices.push(indexStart);for(i=0;i<indexCount;i++)
{indices.push(indexStart++);}
indices.push(indexStart-1);};PIXI.WebGLGraphics.buildComplexPoly=function(graphicsData,webGLData)
{var points=graphicsData.points.slice();if(points.length<6)return;var indices=webGLData.indices;webGLData.points=points;webGLData.alpha=graphicsData.fillAlpha;webGLData.color=PIXI.hex2rgb(graphicsData.fillColor);var minX=Infinity;var maxX=-Infinity;var minY=Infinity;var maxY=-Infinity;var x,y;for(var i=0;i<points.length;i+=2)
{x=points[i];y=points[i+1];minX=x<minX?x:minX;maxX=x>maxX?x:maxX;minY=y<minY?y:minY;maxY=y>maxY?y:maxY;}
points.push(minX,minY,maxX,minY,maxX,maxY,minX,maxY);var length=points.length / 2;for(i=0;i<length;i++)
{indices.push(i);}};PIXI.WebGLGraphics.buildPoly=function(graphicsData,webGLData)
{var points=graphicsData.points;if(points.length<6)return;var verts=webGLData.points;var indices=webGLData.indices;var length=points.length / 2;var color=PIXI.hex2rgb(graphicsData.fillColor);var alpha=graphicsData.fillAlpha;var r=color[0]*alpha;var g=color[1]*alpha;var b=color[2]*alpha;var triangles=PIXI.PolyK.Triangulate(points);if(!triangles)return false;var vertPos=verts.length / 6;var i=0;for(i=0;i<triangles.length;i+=3)
{indices.push(triangles[i]+vertPos);indices.push(triangles[i]+vertPos);indices.push(triangles[i+1]+vertPos);indices.push(triangles[i+2]+vertPos);indices.push(triangles[i+2]+vertPos);}
for(i=0;i<length;i++)
{verts.push(points[i*2],points[i*2+1],r,g,b,alpha);}
return true;};PIXI.WebGLGraphics.graphicsDataPool=[];PIXI.WebGLGraphicsData=function(gl)
{this.gl=gl;this.color=[0,0,0];this.points=[];this.indices=[];this.buffer=gl.createBuffer();this.indexBuffer=gl.createBuffer();this.mode=1;this.alpha=1;this.dirty=true;};PIXI.WebGLGraphicsData.prototype.reset=function()
{this.points=[];this.indices=[];};PIXI.WebGLGraphicsData.prototype.upload=function()
{var gl=this.gl;this.glPoints=new PIXI.Float32Array(this.points);gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,this.glPoints,gl.STATIC_DRAW);this.glIndicies=new PIXI.Uint16Array(this.indices);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.glIndicies,gl.STATIC_DRAW);this.dirty=false;};PIXI.CanvasGraphics=function()
{};PIXI.CanvasGraphics.renderGraphics=function(graphics,context)
{var worldAlpha=graphics.worldAlpha;if(graphics.dirty)
{this.updateGraphicsTint(graphics);graphics.dirty=false;}
for(var i=0;i<graphics.graphicsData.length;i++)
{var data=graphics.graphicsData[i];var shape=data.shape;var fillColor=data._fillTint;var lineColor=data._lineTint;context.lineWidth=data.lineWidth;if(data.type===PIXI.Graphics.POLY)
{context.beginPath();var points=shape.points;context.moveTo(points[0],points[1]);for(var j=1;j<points.length/2;j++)
{context.lineTo(points[j*2],points[j*2+1]);}
if(shape.closed)
{context.lineTo(points[0],points[1]);}
if(points[0]===points[points.length-2]&&points[1]===points[points.length-1])
{context.closePath();}
if(data.fill)
{context.globalAlpha=data.fillAlpha*worldAlpha;context.fillStyle='#'+('00000'+(fillColor|0).toString(16)).substr(-6);context.fill();}
if(data.lineWidth)
{context.globalAlpha=data.lineAlpha*worldAlpha;context.strokeStyle='#'+('00000'+(lineColor|0).toString(16)).substr(-6);context.stroke();}}
else if(data.type===PIXI.Graphics.RECT)
{if(data.fillColor||data.fillColor===0)
{context.globalAlpha=data.fillAlpha*worldAlpha;context.fillStyle='#'+('00000'+(fillColor|0).toString(16)).substr(-6);context.fillRect(shape.x,shape.y,shape.width,shape.height);}
if(data.lineWidth)
{context.globalAlpha=data.lineAlpha*worldAlpha;context.strokeStyle='#'+('00000'+(lineColor|0).toString(16)).substr(-6);context.strokeRect(shape.x,shape.y,shape.width,shape.height);}}
else if(data.type===PIXI.Graphics.CIRC)
{context.beginPath();context.arc(shape.x,shape.y,shape.radius,0,2*Math.PI);context.closePath();if(data.fill)
{context.globalAlpha=data.fillAlpha*worldAlpha;context.fillStyle='#'+('00000'+(fillColor|0).toString(16)).substr(-6);context.fill();}
if(data.lineWidth)
{context.globalAlpha=data.lineAlpha*worldAlpha;context.strokeStyle='#'+('00000'+(lineColor|0).toString(16)).substr(-6);context.stroke();}}
else if(data.type===PIXI.Graphics.ELIP)
{var w=shape.width*2;var h=shape.height*2;var x=shape.x-w/2;var y=shape.y-h/2;context.beginPath();var kappa=0.5522848,ox=(w / 2)*kappa,oy=(h / 2)*kappa,xe=x+w,ye=y+h,xm=x+w / 2,ym=y+h / 2;context.moveTo(x,ym);context.bezierCurveTo(x,ym-oy,xm-ox,y,xm,y);context.bezierCurveTo(xm+ox,y,xe,ym-oy,xe,ym);context.bezierCurveTo(xe,ym+oy,xm+ox,ye,xm,ye);context.bezierCurveTo(xm-ox,ye,x,ym+oy,x,ym);context.closePath();if(data.fill)
{context.globalAlpha=data.fillAlpha*worldAlpha;context.fillStyle='#'+('00000'+(fillColor|0).toString(16)).substr(-6);context.fill();}
if(data.lineWidth)
{context.globalAlpha=data.lineAlpha*worldAlpha;context.strokeStyle='#'+('00000'+(lineColor|0).toString(16)).substr(-6);context.stroke();}}
else if(data.type===PIXI.Graphics.RREC)
{var rx=shape.x;var ry=shape.y;var width=shape.width;var height=shape.height;var radius=shape.radius;var maxRadius=Math.min(width,height)/ 2|0;radius=radius>maxRadius?maxRadius:radius;context.beginPath();context.moveTo(rx,ry+radius);context.lineTo(rx,ry+height-radius);context.quadraticCurveTo(rx,ry+height,rx+radius,ry+height);context.lineTo(rx+width-radius,ry+height);context.quadraticCurveTo(rx+width,ry+height,rx+width,ry+height-radius);context.lineTo(rx+width,ry+radius);context.quadraticCurveTo(rx+width,ry,rx+width-radius,ry);context.lineTo(rx+radius,ry);context.quadraticCurveTo(rx,ry,rx,ry+radius);context.closePath();if(data.fillColor||data.fillColor===0)
{context.globalAlpha=data.fillAlpha*worldAlpha;context.fillStyle='#'+('00000'+(fillColor|0).toString(16)).substr(-6);context.fill();}
if(data.lineWidth)
{context.globalAlpha=data.lineAlpha*worldAlpha;context.strokeStyle='#'+('00000'+(lineColor|0).toString(16)).substr(-6);context.stroke();}}}};PIXI.CanvasGraphics.renderGraphicsMask=function(graphics,context)
{var len=graphics.graphicsData.length;if(len===0)
{return;}
context.beginPath();for(var i=0;i<len;i++)
{var data=graphics.graphicsData[i];var shape=data.shape;if(data.type===PIXI.Graphics.POLY)
{var points=shape.points;context.moveTo(points[0],points[1]);for(var j=1;j<points.length/2;j++)
{context.lineTo(points[j*2],points[j*2+1]);}
if(points[0]===points[points.length-2]&&points[1]===points[points.length-1])
{context.closePath();}}
else if(data.type===PIXI.Graphics.RECT)
{context.rect(shape.x,shape.y,shape.width,shape.height);context.closePath();}
else if(data.type===PIXI.Graphics.CIRC)
{context.arc(shape.x,shape.y,shape.radius,0,2*Math.PI);context.closePath();}
else if(data.type===PIXI.Graphics.ELIP)
{var w=shape.width*2;var h=shape.height*2;var x=shape.x-w/2;var y=shape.y-h/2;var kappa=0.5522848,ox=(w / 2)*kappa,oy=(h / 2)*kappa,xe=x+w,ye=y+h,xm=x+w / 2,ym=y+h / 2;context.moveTo(x,ym);context.bezierCurveTo(x,ym-oy,xm-ox,y,xm,y);context.bezierCurveTo(xm+ox,y,xe,ym-oy,xe,ym);context.bezierCurveTo(xe,ym+oy,xm+ox,ye,xm,ye);context.bezierCurveTo(xm-ox,ye,x,ym+oy,x,ym);context.closePath();}
else if(data.type===PIXI.Graphics.RREC)
{var rx=shape.x;var ry=shape.y;var width=shape.width;var height=shape.height;var radius=shape.radius;var maxRadius=Math.min(width,height)/ 2|0;radius=radius>maxRadius?maxRadius:radius;context.moveTo(rx,ry+radius);context.lineTo(rx,ry+height-radius);context.quadraticCurveTo(rx,ry+height,rx+radius,ry+height);context.lineTo(rx+width-radius,ry+height);context.quadraticCurveTo(rx+width,ry+height,rx+width,ry+height-radius);context.lineTo(rx+width,ry+radius);context.quadraticCurveTo(rx+width,ry,rx+width-radius,ry);context.lineTo(rx+radius,ry);context.quadraticCurveTo(rx,ry,rx,ry+radius);context.closePath();}}};PIXI.CanvasGraphics.updateGraphicsTint=function(graphics)
{if(graphics.tint===0xFFFFFF)
{return;}
var tintR=(graphics.tint>>16&0xFF)/ 255;var tintG=(graphics.tint>>8&0xFF)/ 255;var tintB=(graphics.tint&0xFF)/ 255;for(var i=0;i<graphics.graphicsData.length;i++)
{var data=graphics.graphicsData[i];var fillColor=data.fillColor|0;var lineColor=data.lineColor|0;data._fillTint=(((fillColor>>16&0xFF)/ 255*tintR*255<<16)+((fillColor>>8&0xFF)/ 255*tintG*255<<8)+(fillColor&0xFF)/ 255*tintB*255);data._lineTint=(((lineColor>>16&0xFF)/ 255*tintR*255<<16)+((lineColor>>8&0xFF)/ 255*tintG*255<<8)+(lineColor&0xFF)/ 255*tintB*255);}};Phaser.Graphics=function(game,x,y){if(x===undefined){x=0;}
if(y===undefined){y=0;}
this.type=Phaser.GRAPHICS;this.physicsType=Phaser.SPRITE;PIXI.Graphics.call(this);Phaser.Component.Core.init.call(this,game,x,y,'',null);};Phaser.Graphics.prototype=Object.create(PIXI.Graphics.prototype);Phaser.Graphics.prototype.constructor=Phaser.Graphics;Phaser.Component.Core.install.call(Phaser.Graphics.prototype,['Angle','AutoCull','Bounds','Destroy','FixedToCamera','InputEnabled','InWorld','LifeSpan','PhysicsBody','Reset']);Phaser.Graphics.prototype.preUpdatePhysics=Phaser.Component.PhysicsBody.preUpdate;Phaser.Graphics.prototype.preUpdateLifeSpan=Phaser.Component.LifeSpan.preUpdate;Phaser.Graphics.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.Graphics.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.Graphics.prototype.preUpdate=function(){if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.Graphics.prototype.destroy=function(destroyChildren){this.clear();Phaser.Component.Destroy.prototype.destroy.call(this,destroyChildren);};Phaser.Graphics.prototype.drawTriangle=function(points,cull){if(cull===undefined){cull=false;}
var triangle=new Phaser.Polygon(points);if(cull)
{var cameraToFace=new Phaser.Point(this.game.camera.x-points[0].x,this.game.camera.y-points[0].y);var ab=new Phaser.Point(points[1].x-points[0].x,points[1].y-points[0].y);var cb=new Phaser.Point(points[1].x-points[2].x,points[1].y-points[2].y);var faceNormal=cb.cross(ab);if(cameraToFace.dot(faceNormal)>0)
{this.drawPolygon(triangle);}}
else
{this.drawPolygon(triangle);}};Phaser.Graphics.prototype.drawTriangles=function(vertices,indices,cull){if(cull===undefined){cull=false;}
var point1=new Phaser.Point();var point2=new Phaser.Point();var point3=new Phaser.Point();var points=[];var i;if(!indices)
{if(vertices[0]instanceof Phaser.Point)
{for(i=0;i<vertices.length / 3;i++)
{this.drawTriangle([vertices[i*3],vertices[i*3+1],vertices[i*3+2]],cull);}}
else
{for(i=0;i<vertices.length / 6;i++)
{point1.x=vertices[i*6+0];point1.y=vertices[i*6+1];point2.x=vertices[i*6+2];point2.y=vertices[i*6+3];point3.x=vertices[i*6+4];point3.y=vertices[i*6+5];this.drawTriangle([point1,point2,point3],cull);}}}
else
{if(vertices[0]instanceof Phaser.Point)
{for(i=0;i<indices.length /3;i++)
{points.push(vertices[indices[i*3]]);points.push(vertices[indices[i*3+1]]);points.push(vertices[indices[i*3+2]]);if(points.length===3)
{this.drawTriangle(points,cull);points=[];}}}
else
{for(i=0;i<indices.length;i++)
{point1.x=vertices[indices[i]*2];point1.y=vertices[indices[i]*2+1];points.push(point1.copyTo({}));if(points.length===3)
{this.drawTriangle(points,cull);points=[];}}}}};Phaser.RenderTexture=function(game,width,height,key,scaleMode,resolution){if(key===undefined){key='';}
if(scaleMode===undefined){scaleMode=Phaser.scaleModes.DEFAULT;}
if(resolution===undefined){resolution=1;}
this.game=game;this.key=key;this.type=Phaser.RENDERTEXTURE;this._tempMatrix=new PIXI.Matrix();PIXI.RenderTexture.call(this,width,height,this.game.renderer,scaleMode,resolution);this.render=Phaser.RenderTexture.prototype.render;};Phaser.RenderTexture.prototype=Object.create(PIXI.RenderTexture.prototype);Phaser.RenderTexture.prototype.constructor=Phaser.RenderTexture;Phaser.RenderTexture.prototype.renderXY=function(displayObject,x,y,clear){displayObject.updateTransform();this._tempMatrix.copyFrom(displayObject.worldTransform);this._tempMatrix.tx=x;this._tempMatrix.ty=y;if(this.renderer.type===PIXI.WEBGL_RENDERER)
{this.renderWebGL(displayObject,this._tempMatrix,clear);}
else
{this.renderCanvas(displayObject,this._tempMatrix,clear);}};Phaser.RenderTexture.prototype.renderRawXY=function(displayObject,x,y,clear){this._tempMatrix.identity().translate(x,y);if(this.renderer.type===PIXI.WEBGL_RENDERER)
{this.renderWebGL(displayObject,this._tempMatrix,clear);}
else
{this.renderCanvas(displayObject,this._tempMatrix,clear);}};Phaser.RenderTexture.prototype.render=function(displayObject,matrix,clear){if(matrix===undefined||matrix===null)
{this._tempMatrix.copyFrom(displayObject.worldTransform);}
else
{this._tempMatrix.copyFrom(matrix);}
if(this.renderer.type===PIXI.WEBGL_RENDERER)
{this.renderWebGL(displayObject,this._tempMatrix,clear);}
else
{this.renderCanvas(displayObject,this._tempMatrix,clear);}};Phaser.Text=function(game,x,y,text,style){x=x||0;y=y||0;if(text===undefined||text===null)
{text='';}
else
{text=text.toString();}
style=style||{};this.type=Phaser.TEXT;this.physicsType=Phaser.SPRITE;this.padding=new Phaser.Point();this.textBounds=null;this.canvas=PIXI.CanvasPool.create(this);this.context=this.canvas.getContext('2d');this.colors=[];this.strokeColors=[];this.fontStyles=[];this.fontWeights=[];this.autoRound=false;this._res=game.renderer.resolution;this._text=text;this._fontComponents=null;this._lineSpacing=0;this._charCount=0;this._width=0;this._height=0;Phaser.Sprite.call(this,game,x,y,PIXI.Texture.fromCanvas(this.canvas));this.setStyle(style);if(text!=='')
{this.updateText();}};Phaser.Text.prototype=Object.create(Phaser.Sprite.prototype);Phaser.Text.prototype.constructor=Phaser.Text;Phaser.Text.prototype.preUpdate=function(){if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.Text.prototype.update=function(){};Phaser.Text.prototype.destroy=function(destroyChildren){this.texture.destroy(true);PIXI.CanvasPool.remove(this);Phaser.Component.Destroy.prototype.destroy.call(this,destroyChildren);};Phaser.Text.prototype.setShadow=function(x,y,color,blur,shadowStroke,shadowFill){if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(color===undefined){color='rgba(0, 0, 0, 1)';}
if(blur===undefined){blur=0;}
if(shadowStroke===undefined){shadowStroke=true;}
if(shadowFill===undefined){shadowFill=true;}
this.style.shadowOffsetX=x;this.style.shadowOffsetY=y;this.style.shadowColor=color;this.style.shadowBlur=blur;this.style.shadowStroke=shadowStroke;this.style.shadowFill=shadowFill;this.dirty=true;return this;};Phaser.Text.prototype.setStyle=function(style){style=style||{};style.font=style.font||'bold 20pt Arial';style.backgroundColor=style.backgroundColor||null;style.fill=style.fill||'black';style.align=style.align||'left';style.boundsAlignH=style.boundsAlignH||'left';style.boundsAlignV=style.boundsAlignV||'top';style.stroke=style.stroke||'black';style.strokeThickness=style.strokeThickness||0;style.wordWrap=style.wordWrap||false;style.wordWrapWidth=style.wordWrapWidth||100;style.shadowOffsetX=style.shadowOffsetX||0;style.shadowOffsetY=style.shadowOffsetY||0;style.shadowColor=style.shadowColor||'rgba(0,0,0,0)';style.shadowBlur=style.shadowBlur||0;style.tabs=style.tabs||0;var components=this.fontToComponents(style.font);if(style.fontStyle)
{components.fontStyle=style.fontStyle;}
if(style.fontVariant)
{components.fontVariant=style.fontVariant;}
if(style.fontWeight)
{components.fontWeight=style.fontWeight;}
if(style.fontSize)
{if(typeof style.fontSize==='number')
{style.fontSize=style.fontSize+'px';}
components.fontSize=style.fontSize;}
this._fontComponents=components;style.font=this.componentsToFont(this._fontComponents);this.style=style;this.dirty=true;return this;};Phaser.Text.prototype.updateText=function(){this.texture.baseTexture.resolution=this._res;this.context.font=this.style.font;var outputText=this.text;if(this.style.wordWrap)
{outputText=this.runWordWrap(this.text);}
var lines=outputText.split(/(?:\r\n|\r|\n)/);var tabs=this.style.tabs;var lineWidths=[];var maxLineWidth=0;var fontProperties=this.determineFontProperties(this.style.font);for(var i=0;i<lines.length;i++)
{if(tabs===0)
{var lineWidth=this.context.measureText(lines[i]).width+this.style.strokeThickness+this.padding.x;if(this.style.wordWrap)
{lineWidth-=this.context.measureText(' ').width;}}
else
{var line=lines[i].split(/(?:\t)/);var lineWidth=this.padding.x+this.style.strokeThickness;if(Array.isArray(tabs))
{var tab=0;for(var c=0;c<line.length;c++)
{var section=Math.ceil(this.context.measureText(line[c]).width);if(c>0)
{tab+=tabs[c-1];}
lineWidth=tab+section;}}
else
{for(var c=0;c<line.length;c++)
{lineWidth+=Math.ceil(this.context.measureText(line[c]).width);var diff=this.game.math.snapToCeil(lineWidth,tabs)-lineWidth;lineWidth+=diff;}}}
lineWidths[i]=Math.ceil(lineWidth);maxLineWidth=Math.max(maxLineWidth,lineWidths[i]);}
this.canvas.width=maxLineWidth*this._res;var lineHeight=fontProperties.fontSize+this.style.strokeThickness+this.padding.y;var height=lineHeight*lines.length;var lineSpacing=this._lineSpacing;if(lineSpacing<0&&Math.abs(lineSpacing)>lineHeight)
{lineSpacing=-lineHeight;}
if(lineSpacing!==0)
{var diff=lineSpacing*(lines.length-1);height+=diff;}
this.canvas.height=height*this._res;this.context.scale(this._res,this._res);if(navigator.isCocoonJS)
{this.context.clearRect(0,0,this.canvas.width,this.canvas.height);}
if(this.style.backgroundColor)
{this.context.fillStyle=this.style.backgroundColor;this.context.fillRect(0,0,this.canvas.width,this.canvas.height);}
this.context.fillStyle=this.style.fill;this.context.font=this.style.font;this.context.strokeStyle=this.style.stroke;this.context.textBaseline='alphabetic';this.context.lineWidth=this.style.strokeThickness;this.context.lineCap='round';this.context.lineJoin='round';var linePositionX;var linePositionY;this._charCount=0;for(i=0;i<lines.length;i++)
{linePositionX=this.style.strokeThickness / 2;linePositionY=(this.style.strokeThickness / 2+i*lineHeight)+fontProperties.ascent;if(i>0)
{linePositionY+=(lineSpacing*i);}
if(this.style.align==='right')
{linePositionX+=maxLineWidth-lineWidths[i];}
else if(this.style.align==='center')
{linePositionX+=(maxLineWidth-lineWidths[i])/ 2;}
if(this.autoRound)
{linePositionX=Math.round(linePositionX);linePositionY=Math.round(linePositionY);}
if(this.colors.length>0||this.strokeColors.length>0||this.fontWeights.length>0||this.fontStyles.length>0)
{this.updateLine(lines[i],linePositionX,linePositionY);}
else
{if(this.style.stroke&&this.style.strokeThickness)
{this.updateShadow(this.style.shadowStroke);if(tabs===0)
{this.context.strokeText(lines[i],linePositionX,linePositionY);}
else
{this.renderTabLine(lines[i],linePositionX,linePositionY,false);}}
if(this.style.fill)
{this.updateShadow(this.style.shadowFill);if(tabs===0)
{this.context.fillText(lines[i],linePositionX,linePositionY);}
else
{this.renderTabLine(lines[i],linePositionX,linePositionY,true);}}}}
this.updateTexture();};Phaser.Text.prototype.renderTabLine=function(line,x,y,fill){var text=line.split(/(?:\t)/);var tabs=this.style.tabs;var snap=0;if(Array.isArray(tabs))
{var tab=0;for(var c=0;c<text.length;c++)
{if(c>0)
{tab+=tabs[c-1];}
snap=x+tab;if(fill)
{this.context.fillText(text[c],snap,y);}
else
{this.context.strokeText(text[c],snap,y);}}}
else
{for(var c=0;c<text.length;c++)
{var section=Math.ceil(this.context.measureText(text[c]).width);snap=this.game.math.snapToCeil(x,tabs);if(fill)
{this.context.fillText(text[c],snap,y);}
else
{this.context.strokeText(text[c],snap,y);}
x=snap+section;}}};Phaser.Text.prototype.updateShadow=function(state){if(state)
{this.context.shadowOffsetX=this.style.shadowOffsetX;this.context.shadowOffsetY=this.style.shadowOffsetY;this.context.shadowColor=this.style.shadowColor;this.context.shadowBlur=this.style.shadowBlur;}
else
{this.context.shadowOffsetX=0;this.context.shadowOffsetY=0;this.context.shadowColor=0;this.context.shadowBlur=0;}};Phaser.Text.prototype.updateLine=function(line,x,y){for(var i=0;i<line.length;i++)
{var letter=line[i];if(this.fontWeights.length>0||this.fontStyles.length>0)
{var components=this.fontToComponents(this.context.font);if(this.fontStyles[this._charCount])
{components.fontStyle=this.fontStyles[this._charCount];}
if(this.fontWeights[this._charCount])
{components.fontWeight=this.fontWeights[this._charCount];}
this.context.font=this.componentsToFont(components);}
if(this.style.stroke&&this.style.strokeThickness)
{if(this.strokeColors[this._charCount])
{this.context.strokeStyle=this.strokeColors[this._charCount];}
this.updateShadow(this.style.shadowStroke);this.context.strokeText(letter,x,y);}
if(this.style.fill)
{if(this.colors[this._charCount])
{this.context.fillStyle=this.colors[this._charCount];}
this.updateShadow(this.style.shadowFill);this.context.fillText(letter,x,y);}
x+=this.context.measureText(letter).width;this._charCount++;}};Phaser.Text.prototype.clearColors=function(){this.colors=[];this.strokeColors=[];this.dirty=true;return this;};Phaser.Text.prototype.clearFontValues=function(){this.fontStyles=[];this.fontWeights=[];this.dirty=true;return this;};Phaser.Text.prototype.addColor=function(color,position){this.colors[position]=color;this.dirty=true;return this;};Phaser.Text.prototype.addStrokeColor=function(color,position){this.strokeColors[position]=color;this.dirty=true;return this;};Phaser.Text.prototype.addFontStyle=function(style,position){this.fontStyles[position]=style;this.dirty=true;return this;};Phaser.Text.prototype.addFontWeight=function(weight,position){this.fontWeights[position]=weight;this.dirty=true;return this;};Phaser.Text.prototype.runWordWrap=function(text){var result='';var lines=text.split('\n');for(var i=0;i<lines.length;i++)
{var spaceLeft=this.style.wordWrapWidth;var words=lines[i].split(' ');for(var j=0;j<words.length;j++)
{var wordWidth=this.context.measureText(words[j]).width;var wordWidthWithSpace=wordWidth+this.context.measureText(' ').width;if(wordWidthWithSpace>spaceLeft)
{if(j>0)
{result+='\n';}
result+=words[j]+' ';spaceLeft=this.style.wordWrapWidth-wordWidth;}
else
{spaceLeft-=wordWidthWithSpace;result+=words[j]+' ';}}
if(i<lines.length-1)
{result+='\n';}}
return result;};Phaser.Text.prototype.updateFont=function(components){var font=this.componentsToFont(components);if(this.style.font!==font)
{this.style.font=font;this.dirty=true;if(this.parent)
{this.updateTransform();}}};Phaser.Text.prototype.fontToComponents=function(font){var m=font.match(/^\s*(?:\b(normal|italic|oblique|inherit)?\b)\s*(?:\b(normal|small-caps|inherit)?\b)\s*(?:\b(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)?\b)\s*(?:\b(xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller|0|\d*(?:[.]\d*)?(?:%|[a-z]{2,5}))?\b)\s*(.*)\s*$/);if(m)
{return{font:font,fontStyle:m[1]||'normal',fontVariant:m[2]||'normal',fontWeight:m[3]||'normal',fontSize:m[4]||'medium',fontFamily:m[5]};}
else
{console.warn("Phaser.Text - unparsable CSS font: "+font);return{font:font};}};Phaser.Text.prototype.componentsToFont=function(components){var parts=[];var v;v=components.fontStyle;if(v&&v!=='normal'){parts.push(v);}
v=components.fontVariant;if(v&&v!=='normal'){parts.push(v);}
v=components.fontWeight;if(v&&v!=='normal'){parts.push(v);}
v=components.fontSize;if(v&&v!=='medium'){parts.push(v);}
v=components.fontFamily;if(v){parts.push(v);}
if(!parts.length)
{parts.push(components.font);}
return parts.join(" ");};Phaser.Text.prototype.setText=function(text){this.text=text.toString()||'';this.dirty=true;return this;};Phaser.Text.prototype.parseList=function(list){if(!Array.isArray(list))
{return this;}
else
{var s="";for(var i=0;i<list.length;i++)
{if(Array.isArray(list[i]))
{s+=list[i].join("\t");if(i<list.length-1)
{s+="\n";}}
else
{s+=list[i];if(i<list.length-1)
{s+="\t";}}}}
this.text=s;this.dirty=true;return this;};Phaser.Text.prototype.setTextBounds=function(x,y,width,height){if(x===undefined)
{this.textBounds=null;}
else
{if(!this.textBounds)
{this.textBounds=new Phaser.Rectangle(x,y,width,height);}
else
{this.textBounds.setTo(x,y,width,height);}
if(this.style.wordWrapWidth>width)
{this.style.wordWrapWidth=width;}}
this.updateTexture();return this;};Phaser.Text.prototype.updateTexture=function(){var base=this.texture.baseTexture;var crop=this.texture.crop;var frame=this.texture.frame;var w=this.canvas.width;var h=this.canvas.height;base.width=w;base.height=h;crop.width=w;crop.height=h;frame.width=w;frame.height=h;this.texture.width=w;this.texture.height=h;this._width=w;this._height=h;if(this.textBounds)
{var x=this.textBounds.x;var y=this.textBounds.y;if(this.style.boundsAlignH==='right')
{x+=this.textBounds.width-this.canvas.width;}
else if(this.style.boundsAlignH==='center')
{x+=this.textBounds.halfWidth-(this.canvas.width / 2);}
if(this.style.boundsAlignV==='bottom')
{y+=this.textBounds.height-this.canvas.height;}
else if(this.style.boundsAlignV==='middle')
{y+=this.textBounds.halfHeight-(this.canvas.height / 2);}
this.pivot.x=-x;this.pivot.y=-y;}
this.renderable=(w!==0&&h!==0);this.texture.requiresReTint=true;this.texture.baseTexture.dirty();};Phaser.Text.prototype._renderWebGL=function(renderSession){if(this.dirty)
{this.updateText();this.dirty=false;}
PIXI.Sprite.prototype._renderWebGL.call(this,renderSession);};Phaser.Text.prototype._renderCanvas=function(renderSession){if(this.dirty)
{this.updateText();this.dirty=false;}
PIXI.Sprite.prototype._renderCanvas.call(this,renderSession);};Phaser.Text.prototype.determineFontProperties=function(fontStyle){var properties=Phaser.Text.fontPropertiesCache[fontStyle];if(!properties)
{properties={};var canvas=Phaser.Text.fontPropertiesCanvas;var context=Phaser.Text.fontPropertiesContext;context.font=fontStyle;var width=Math.ceil(context.measureText('|MÉq').width);var baseline=Math.ceil(context.measureText('|MÉq').width);var height=2*baseline;baseline=baseline*1.4|0;canvas.width=width;canvas.height=height;context.fillStyle='#f00';context.fillRect(0,0,width,height);context.font=fontStyle;context.textBaseline='alphabetic';context.fillStyle='#000';context.fillText('|MÉq',0,baseline);if(!context.getImageData(0,0,width,height))
{properties.ascent=baseline;properties.descent=baseline+6;properties.fontSize=properties.ascent+properties.descent;Phaser.Text.fontPropertiesCache[fontStyle]=properties;return properties;}
var imagedata=context.getImageData(0,0,width,height).data;var pixels=imagedata.length;var line=width*4;var i,j;var idx=0;var stop=false;for(i=0;i<baseline;i++)
{for(j=0;j<line;j+=4)
{if(imagedata[idx+j]!==255)
{stop=true;break;}}
if(!stop)
{idx+=line;}
else
{break;}}
properties.ascent=baseline-i;idx=pixels-line;stop=false;for(i=height;i>baseline;i--)
{for(j=0;j<line;j+=4)
{if(imagedata[idx+j]!==255)
{stop=true;break;}}
if(!stop)
{idx-=line;}
else
{break;}}
properties.descent=i-baseline;properties.descent+=6;properties.fontSize=properties.ascent+properties.descent;Phaser.Text.fontPropertiesCache[fontStyle]=properties;}
return properties;};Phaser.Text.prototype.getBounds=function(matrix){if(this.dirty)
{this.updateText();this.dirty=false;}
return PIXI.Sprite.prototype.getBounds.call(this,matrix);};Object.defineProperty(Phaser.Text.prototype,'text',{get:function(){return this._text;},set:function(value){if(value!==this._text)
{this._text=value.toString()||'';this.dirty=true;if(this.parent)
{this.updateTransform();}}}});Object.defineProperty(Phaser.Text.prototype,'cssFont',{get:function(){return this.componentsToFont(this._fontComponents);},set:function(value)
{value=value||'bold 20pt Arial';this._fontComponents=this.fontToComponents(value);this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'font',{get:function(){return this._fontComponents.fontFamily;},set:function(value){value=value||'Arial';value=value.trim();if(!/^(?:inherit|serif|sans-serif|cursive|fantasy|monospace)$/.exec(value)&&!/['",]/.exec(value))
{value="'"+value+"'";}
this._fontComponents.fontFamily=value;this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'fontSize',{get:function(){var size=this._fontComponents.fontSize;if(size&&/(?:^0$|px$)/.exec(size))
{return parseInt(size,10);}
else
{return size;}},set:function(value){value=value||'0';if(typeof value==='number')
{value=value+'px';}
this._fontComponents.fontSize=value;this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'fontWeight',{get:function(){return this._fontComponents.fontWeight||'normal';},set:function(value){value=value||'normal';this._fontComponents.fontWeight=value;this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'fontStyle',{get:function(){return this._fontComponents.fontStyle||'normal';},set:function(value){value=value||'normal';this._fontComponents.fontStyle=value;this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'fontVariant',{get:function(){return this._fontComponents.fontVariant||'normal';},set:function(value){value=value||'normal';this._fontComponents.fontVariant=value;this.updateFont(this._fontComponents);}});Object.defineProperty(Phaser.Text.prototype,'fill',{get:function(){return this.style.fill;},set:function(value){if(value!==this.style.fill)
{this.style.fill=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'align',{get:function(){return this.style.align;},set:function(value){if(value!==this.style.align)
{this.style.align=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'resolution',{get:function(){return this._res;},set:function(value){if(value!==this._res)
{this._res=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'tabs',{get:function(){return this.style.tabs;},set:function(value){if(value!==this.style.tabs)
{this.style.tabs=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'boundsAlignH',{get:function(){return this.style.boundsAlignH;},set:function(value){if(value!==this.style.boundsAlignH)
{this.style.boundsAlignH=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'boundsAlignV',{get:function(){return this.style.boundsAlignV;},set:function(value){if(value!==this.style.boundsAlignV)
{this.style.boundsAlignV=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'stroke',{get:function(){return this.style.stroke;},set:function(value){if(value!==this.style.stroke)
{this.style.stroke=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'strokeThickness',{get:function(){return this.style.strokeThickness;},set:function(value){if(value!==this.style.strokeThickness)
{this.style.strokeThickness=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'wordWrap',{get:function(){return this.style.wordWrap;},set:function(value){if(value!==this.style.wordWrap)
{this.style.wordWrap=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'wordWrapWidth',{get:function(){return this.style.wordWrapWidth;},set:function(value){if(value!==this.style.wordWrapWidth)
{this.style.wordWrapWidth=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'lineSpacing',{get:function(){return this._lineSpacing;},set:function(value){if(value!==this._lineSpacing)
{this._lineSpacing=parseFloat(value);this.dirty=true;if(this.parent)
{this.updateTransform();}}}});Object.defineProperty(Phaser.Text.prototype,'shadowOffsetX',{get:function(){return this.style.shadowOffsetX;},set:function(value){if(value!==this.style.shadowOffsetX)
{this.style.shadowOffsetX=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'shadowOffsetY',{get:function(){return this.style.shadowOffsetY;},set:function(value){if(value!==this.style.shadowOffsetY)
{this.style.shadowOffsetY=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'shadowColor',{get:function(){return this.style.shadowColor;},set:function(value){if(value!==this.style.shadowColor)
{this.style.shadowColor=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'shadowBlur',{get:function(){return this.style.shadowBlur;},set:function(value){if(value!==this.style.shadowBlur)
{this.style.shadowBlur=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'shadowStroke',{get:function(){return this.style.shadowStroke;},set:function(value){if(value!==this.style.shadowStroke)
{this.style.shadowStroke=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'shadowFill',{get:function(){return this.style.shadowFill;},set:function(value){if(value!==this.style.shadowFill)
{this.style.shadowFill=value;this.dirty=true;}}});Object.defineProperty(Phaser.Text.prototype,'width',{get:function(){if(this.dirty)
{this.updateText();this.dirty=false;}
return this.scale.x*this.texture.frame.width;},set:function(value){this.scale.x=value / this.texture.frame.width;this._width=value;}});Object.defineProperty(Phaser.Text.prototype,'height',{get:function(){if(this.dirty)
{this.updateText();this.dirty=false;}
return this.scale.y*this.texture.frame.height;},set:function(value){this.scale.y=value / this.texture.frame.height;this._height=value;}});Phaser.Text.fontPropertiesCache={};Phaser.Text.fontPropertiesCanvas=PIXI.CanvasPool.create(Phaser.Text.fontPropertiesCanvas);Phaser.Text.fontPropertiesContext=Phaser.Text.fontPropertiesCanvas.getContext('2d');Phaser.BitmapText=function(game,x,y,font,text,size,align){x=x||0;y=y||0;font=font||'';text=text||'';size=size||32;align=align||'left';PIXI.DisplayObjectContainer.call(this);this.type=Phaser.BITMAPTEXT;this.physicsType=Phaser.SPRITE;this.textWidth=0;this.textHeight=0;this.anchor=new Phaser.Point();this._prevAnchor=new Phaser.Point();this._glyphs=[];this._maxWidth=0;this._text=text;this._data=game.cache.getBitmapFont(font);this._font=font;this._fontSize=size;this._align=align;this._tint=0xFFFFFF;this.updateText();this.dirty=false;Phaser.Component.Core.init.call(this,game,x,y,'',null);};Phaser.BitmapText.prototype=Object.create(PIXI.DisplayObjectContainer.prototype);Phaser.BitmapText.prototype.constructor=Phaser.BitmapText;Phaser.Component.Core.install.call(Phaser.BitmapText.prototype,['Angle','AutoCull','Bounds','Destroy','FixedToCamera','InputEnabled','InWorld','LifeSpan','PhysicsBody','Reset']);Phaser.BitmapText.prototype.preUpdatePhysics=Phaser.Component.PhysicsBody.preUpdate;Phaser.BitmapText.prototype.preUpdateLifeSpan=Phaser.Component.LifeSpan.preUpdate;Phaser.BitmapText.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.BitmapText.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.BitmapText.prototype.preUpdate=function(){if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.BitmapText.prototype.postUpdate=function(){Phaser.Component.PhysicsBody.postUpdate.call(this);Phaser.Component.FixedToCamera.postUpdate.call(this);if(this.body&&this.body.type===Phaser.Physics.ARCADE)
{if((this.textWidth!==this.body.sourceWidth)||(this.textHeight!==this.body.sourceHeight))
{this.body.setSize(this.textWidth,this.textHeight);}}};Phaser.BitmapText.prototype.setText=function(text){this.text=text;};Phaser.BitmapText.prototype.scanLine=function(data,scale,text){var x=0;var w=0;var lastSpace=-1;var prevCharCode=null;var maxWidth=(this._maxWidth>0)?this._maxWidth:null;var chars=[];for(var i=0;i<text.length;i++)
{var end=(i===text.length-1)?true:false;if(/(?:\r\n|\r|\n)/.test(text.charAt(i)))
{return{width:w,text:text.substr(0,i),end:end,chars:chars};}
else
{var charCode=text.charCodeAt(i);var charData=data.chars[charCode];var c=0;if(!charData)
{continue;}
var kerning=(prevCharCode&&charData.kerning[prevCharCode])?charData.kerning[prevCharCode]:0;lastSpace=/(\s)/.test(text.charAt(i))?i:lastSpace;c=(kerning+charData.texture.width+charData.xOffset)*scale;if(maxWidth&&((w+c)>=maxWidth)&&lastSpace>-1)
{return{width:w,text:text.substr(0,i-(i-lastSpace)),end:end,chars:chars};}
else
{w+=charData.xAdvance*scale;chars.push(x+(charData.xOffset*scale));x+=charData.xAdvance*scale;prevCharCode=charCode;}}}
return{width:w,text:text,end:end,chars:chars};};Phaser.BitmapText.prototype.updateText=function(){var data=this._data.font;if(!data)
{return;}
var text=this.text;var scale=this._fontSize / data.size;var lines=[];var y=0;this.textWidth=0;do
{var line=this.scanLine(data,scale,text);line.y=y;lines.push(line);if(line.width>this.textWidth)
{this.textWidth=line.width;}
y+=(data.lineHeight*scale);text=text.substr(line.text.length+1);}while(line.end===false);this.textHeight=y;var t=0;var align=0;var ax=this.textWidth*this.anchor.x;var ay=this.textHeight*this.anchor.y;for(var i=0;i<lines.length;i++)
{var line=lines[i];if(this._align==='right')
{align=this.textWidth-line.width;}
else if(this._align==='center')
{align=(this.textWidth-line.width)/ 2;}
for(var c=0;c<line.text.length;c++)
{var charCode=line.text.charCodeAt(c);var charData=data.chars[charCode];var g=this._glyphs[t];if(g)
{g.texture=charData.texture;}
else
{g=new PIXI.Sprite(charData.texture);g.name=line.text[c];this._glyphs.push(g);}
g.position.x=(line.chars[c]+align)-ax;g.position.y=(line.y+(charData.yOffset*scale))-ay;g.scale.set(scale);g.tint=this.tint;g.texture.requiresReTint=true;if(!g.parent)
{this.addChild(g);}
t++;}}
for(i=t;i<this._glyphs.length;i++)
{this.removeChild(this._glyphs[i]);}};Phaser.BitmapText.prototype.purgeGlyphs=function(){var len=this._glyphs.length;var kept=[];for(var i=0;i<this._glyphs.length;i++)
{if(this._glyphs[i].parent!==this)
{this._glyphs[i].destroy();}
else
{kept.push(this._glyphs[i]);}}
this._glyphs=[];this._glyphs=kept;this.updateText();return len-kept.length;};Phaser.BitmapText.prototype.updateTransform=function(){if(this.dirty||!this.anchor.equals(this._prevAnchor))
{this.updateText();this.dirty=false;this._prevAnchor.copyFrom(this.anchor);}
PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);};Object.defineProperty(Phaser.BitmapText.prototype,'align',{get:function(){return this._align;},set:function(value){if(value!==this._align&&(value==='left'||value==='center'||value==='right'))
{this._align=value;this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'tint',{get:function(){return this._tint;},set:function(value){if(value!==this._tint)
{this._tint=value;this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'font',{get:function(){return this._font;},set:function(value){if(value!==this._font)
{this._font=value.trim();this._data=this.game.cache.getBitmapFont(this._font);this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'fontSize',{get:function(){return this._fontSize;},set:function(value){value=parseInt(value,10);if(value!==this._fontSize&&value>0)
{this._fontSize=value;this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'text',{get:function(){return this._text;},set:function(value){if(value!==this._text)
{this._text=value.toString()||'';this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'maxWidth',{get:function(){return this._maxWidth;},set:function(value){if(value!==this._maxWidth)
{this._maxWidth=value;this.updateText();}}});Object.defineProperty(Phaser.BitmapText.prototype,'smoothed',{get:function(){return!this._data.base.scaleMode;},set:function(value){if(value)
{this._data.base.scaleMode=0;}
else
{this._data.base.scaleMode=1;}}});Phaser.RetroFont=function(game,key,characterWidth,characterHeight,chars,charsPerRow,xSpacing,ySpacing,xOffset,yOffset){if(!game.cache.checkImageKey(key))
{return false;}
if(charsPerRow===undefined||charsPerRow===null)
{charsPerRow=game.cache.getImage(key).width / characterWidth;}
this.characterWidth=characterWidth;this.characterHeight=characterHeight;this.characterSpacingX=xSpacing||0;this.characterSpacingY=ySpacing||0;this.characterPerRow=charsPerRow;this.offsetX=xOffset||0;this.offsetY=yOffset||0;this.align="left";this.multiLine=false;this.autoUpperCase=true;this.customSpacingX=0;this.customSpacingY=0;this.fixedWidth=0;this.fontSet=game.cache.getImage(key);this._text='';this.grabData=[];this.frameData=new Phaser.FrameData();var currentX=this.offsetX;var currentY=this.offsetY;var r=0;for(var c=0;c<chars.length;c++)
{var frame=this.frameData.addFrame(new Phaser.Frame(c,currentX,currentY,this.characterWidth,this.characterHeight));this.grabData[chars.charCodeAt(c)]=frame.index;r++;if(r===this.characterPerRow)
{r=0;currentX=this.offsetX;currentY+=this.characterHeight+this.characterSpacingY;}
else
{currentX+=this.characterWidth+this.characterSpacingX;}}
game.cache.updateFrameData(key,this.frameData);this.stamp=new Phaser.Image(game,0,0,key,0);Phaser.RenderTexture.call(this,game,100,100,'',Phaser.scaleModes.NEAREST);this.type=Phaser.RETROFONT;};Phaser.RetroFont.prototype=Object.create(Phaser.RenderTexture.prototype);Phaser.RetroFont.prototype.constructor=Phaser.RetroFont;Phaser.RetroFont.ALIGN_LEFT="left";Phaser.RetroFont.ALIGN_RIGHT="right";Phaser.RetroFont.ALIGN_CENTER="center";Phaser.RetroFont.TEXT_SET1=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";Phaser.RetroFont.TEXT_SET2=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ";Phaser.RetroFont.TEXT_SET3="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";Phaser.RetroFont.TEXT_SET4="ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789";Phaser.RetroFont.TEXT_SET5="ABCDEFGHIJKLMNOPQRSTUVWXYZ.,/() '!?-*:0123456789";Phaser.RetroFont.TEXT_SET6="ABCDEFGHIJKLMNOPQRSTUVWXYZ!?:;0123456789\"(),-.' ";Phaser.RetroFont.TEXT_SET7="AGMSY+:4BHNTZ!;5CIOU.?06DJPV,(17EKQW\")28FLRX-'39";Phaser.RetroFont.TEXT_SET8="0123456789 .ABCDEFGHIJKLMNOPQRSTUVWXYZ";Phaser.RetroFont.TEXT_SET9="ABCDEFGHIJKLMNOPQRSTUVWXYZ()-0123456789.:,'\"?!";Phaser.RetroFont.TEXT_SET10="ABCDEFGHIJKLMNOPQRSTUVWXYZ";Phaser.RetroFont.TEXT_SET11="ABCDEFGHIJKLMNOPQRSTUVWXYZ.,\"-+!?()':;0123456789";Phaser.RetroFont.prototype.setFixedWidth=function(width,lineAlignment){if(lineAlignment===undefined){lineAlignment='left';}
this.fixedWidth=width;this.align=lineAlignment;};Phaser.RetroFont.prototype.setText=function(content,multiLine,characterSpacing,lineSpacing,lineAlignment,allowLowerCase){this.multiLine=multiLine||false;this.customSpacingX=characterSpacing||0;this.customSpacingY=lineSpacing||0;this.align=lineAlignment||'left';if(allowLowerCase)
{this.autoUpperCase=false;}
else
{this.autoUpperCase=true;}
if(content.length>0)
{this.text=content;}};Phaser.RetroFont.prototype.buildRetroFontText=function(){var cx=0;var cy=0;this.clear();if(this.multiLine)
{var lines=this._text.split("\n");if(this.fixedWidth>0)
{this.resize(this.fixedWidth,(lines.length*(this.characterHeight+this.customSpacingY))-this.customSpacingY,true);}
else
{this.resize(this.getLongestLine()*(this.characterWidth+this.customSpacingX),(lines.length*(this.characterHeight+this.customSpacingY))-this.customSpacingY,true);}
for(var i=0;i<lines.length;i++)
{cx=0;if(this.align===Phaser.RetroFont.ALIGN_RIGHT)
{cx=this.width-(lines[i].length*(this.characterWidth+this.customSpacingX));}
else if(this.align===Phaser.RetroFont.ALIGN_CENTER)
{cx=(this.width / 2)-((lines[i].length*(this.characterWidth+this.customSpacingX))/ 2);cx+=this.customSpacingX / 2;}
if(cx<0)
{cx=0;}
this.pasteLine(lines[i],cx,cy,this.customSpacingX);cy+=this.characterHeight+this.customSpacingY;}}
else
{if(this.fixedWidth>0)
{this.resize(this.fixedWidth,this.characterHeight,true);}
else
{this.resize(this._text.length*(this.characterWidth+this.customSpacingX),this.characterHeight,true);}
cx=0;if(this.align===Phaser.RetroFont.ALIGN_RIGHT)
{cx=this.width-(this._text.length*(this.characterWidth+this.customSpacingX));}
else if(this.align===Phaser.RetroFont.ALIGN_CENTER)
{cx=(this.width / 2)-((this._text.length*(this.characterWidth+this.customSpacingX))/ 2);cx+=this.customSpacingX / 2;}
if(cx<0)
{cx=0;}
this.pasteLine(this._text,cx,0,this.customSpacingX);}
this.requiresReTint=true;};Phaser.RetroFont.prototype.pasteLine=function(line,x,y,customSpacingX){for(var c=0;c<line.length;c++)
{if(line.charAt(c)===" ")
{x+=this.characterWidth+customSpacingX;}
else
{if(this.grabData[line.charCodeAt(c)]>=0)
{this.stamp.frame=this.grabData[line.charCodeAt(c)];this.renderXY(this.stamp,x,y,false);x+=this.characterWidth+customSpacingX;if(x>this.width)
{break;}}}}};Phaser.RetroFont.prototype.getLongestLine=function(){var longestLine=0;if(this._text.length>0)
{var lines=this._text.split("\n");for(var i=0;i<lines.length;i++)
{if(lines[i].length>longestLine)
{longestLine=lines[i].length;}}}
return longestLine;};Phaser.RetroFont.prototype.removeUnsupportedCharacters=function(stripCR){var newString="";for(var c=0;c<this._text.length;c++)
{var aChar=this._text[c];var code=aChar.charCodeAt(0);if(this.grabData[code]>=0||(!stripCR&&aChar==="\n"))
{newString=newString.concat(aChar);}}
return newString;};Phaser.RetroFont.prototype.updateOffset=function(x,y){if(this.offsetX===x&&this.offsetY===y)
{return;}
var diffX=x-this.offsetX;var diffY=y-this.offsetY;var frames=this.game.cache.getFrameData(this.stamp.key).getFrames();var i=frames.length;while(i--)
{frames[i].x+=diffX;frames[i].y+=diffY;}
this.buildRetroFontText();};Object.defineProperty(Phaser.RetroFont.prototype,"text",{get:function(){return this._text;},set:function(value){var newText;if(this.autoUpperCase)
{newText=value.toUpperCase();}
else
{newText=value;}
if(newText!==this._text)
{this._text=newText;this.removeUnsupportedCharacters(this.multiLine);this.buildRetroFontText();}}});Object.defineProperty(Phaser.RetroFont.prototype,"smoothed",{get:function(){return this.stamp.smoothed;},set:function(value){this.stamp.smoothed=value;this.buildRetroFontText();}});Phaser.Rope=function(game,x,y,key,frame,points){this.points=[];this.points=points;this._hasUpdateAnimation=false;this._updateAnimationCallback=null;x=x||0;y=y||0;key=key||null;frame=frame||null;this.type=Phaser.ROPE;PIXI.Rope.call(this,PIXI.TextureCache['__default'],this.points);Phaser.Component.Core.init.call(this,game,x,y,key,frame);};Phaser.Rope.prototype=Object.create(PIXI.Rope.prototype);Phaser.Rope.prototype.constructor=Phaser.Rope;Phaser.Component.Core.install.call(Phaser.Rope.prototype,['Angle','Animation','AutoCull','Bounds','BringToTop','Crop','Delta','Destroy','FixedToCamera','InWorld','LifeSpan','LoadTexture','Overlap','PhysicsBody','Reset','ScaleMinMax','Smoothed']);Phaser.Rope.prototype.preUpdatePhysics=Phaser.Component.PhysicsBody.preUpdate;Phaser.Rope.prototype.preUpdateLifeSpan=Phaser.Component.LifeSpan.preUpdate;Phaser.Rope.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.Rope.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.Rope.prototype.preUpdate=function(){if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.Rope.prototype.update=function(){if(this._hasUpdateAnimation)
{this.updateAnimation.call(this);}};Phaser.Rope.prototype.reset=function(x,y){Phaser.Component.Reset.prototype.reset.call(this,x,y);return this;};Object.defineProperty(Phaser.Rope.prototype,"updateAnimation",{get:function(){return this._updateAnimation;},set:function(value){if(value&&typeof value==='function')
{this._hasUpdateAnimation=true;this._updateAnimation=value;}
else
{this._hasUpdateAnimation=false;this._updateAnimation=null;}}});Object.defineProperty(Phaser.Rope.prototype,"segments",{get:function(){var segments=[];var index,x1,y1,x2,y2,width,height,rect;for(var i=0;i<this.points.length;i++)
{index=i*4;x1=this.vertices[index]*this.scale.x;y1=this.vertices[index+1]*this.scale.y;x2=this.vertices[index+4]*this.scale.x;y2=this.vertices[index+3]*this.scale.y;width=Phaser.Math.difference(x1,x2);height=Phaser.Math.difference(y1,y2);x1+=this.world.x;y1+=this.world.y;rect=new Phaser.Rectangle(x1,y1,width,height);segments.push(rect);}
return segments;}});Phaser.TileSprite=function(game,x,y,width,height,key,frame){x=x||0;y=y||0;width=width||256;height=height||256;key=key||null;frame=frame||null;this.type=Phaser.TILESPRITE;this.physicsType=Phaser.SPRITE;this._scroll=new Phaser.Point();var def=game.cache.getImage('__default',true);PIXI.TilingSprite.call(this,new PIXI.Texture(def.base),width,height);Phaser.Component.Core.init.call(this,game,x,y,key,frame);};Phaser.TileSprite.prototype=Object.create(PIXI.TilingSprite.prototype);Phaser.TileSprite.prototype.constructor=Phaser.TileSprite;Phaser.Component.Core.install.call(Phaser.TileSprite.prototype,['Angle','Animation','AutoCull','Bounds','BringToTop','Destroy','FixedToCamera','Health','InCamera','InputEnabled','InWorld','LifeSpan','LoadTexture','Overlap','PhysicsBody','Reset','Smoothed']);Phaser.TileSprite.prototype.preUpdatePhysics=Phaser.Component.PhysicsBody.preUpdate;Phaser.TileSprite.prototype.preUpdateLifeSpan=Phaser.Component.LifeSpan.preUpdate;Phaser.TileSprite.prototype.preUpdateInWorld=Phaser.Component.InWorld.preUpdate;Phaser.TileSprite.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.TileSprite.prototype.preUpdate=function(){if(this._scroll.x!==0)
{this.tilePosition.x+=this._scroll.x*this.game.time.physicsElapsed;}
if(this._scroll.y!==0)
{this.tilePosition.y+=this._scroll.y*this.game.time.physicsElapsed;}
if(!this.preUpdatePhysics()||!this.preUpdateLifeSpan()||!this.preUpdateInWorld())
{return false;}
return this.preUpdateCore();};Phaser.TileSprite.prototype.autoScroll=function(x,y){this._scroll.set(x,y);};Phaser.TileSprite.prototype.stopScroll=function(){this._scroll.set(0,0);};Phaser.TileSprite.prototype.destroy=function(destroyChildren){Phaser.Component.Destroy.prototype.destroy.call(this,destroyChildren);PIXI.TilingSprite.prototype.destroy.call(this);};Phaser.TileSprite.prototype.reset=function(x,y){Phaser.Component.Reset.prototype.reset.call(this,x,y);this.tilePosition.x=0;this.tilePosition.y=0;return this;};Phaser.Device=function(){this.deviceReadyAt=0;this.initialized=false;this.desktop=false;this.iOS=false;this.iOSVersion=0;this.cocoonJS=false;this.cocoonJSApp=false;this.cordova=false;this.node=false;this.nodeWebkit=false;this.electron=false;this.ejecta=false;this.crosswalk=false;this.android=false;this.chromeOS=false;this.linux=false;this.macOS=false;this.windows=false;this.windowsPhone=false;this.canvas=false;this.canvasBitBltShift=null;this.webGL=false;this.file=false;this.fileSystem=false;this.localStorage=false;this.worker=false;this.css3D=false;this.pointerLock=false;this.typedArray=false;this.vibration=false;this.getUserMedia=true;this.quirksMode=false;this.touch=false;this.mspointer=false;this.wheelEvent=null;this.arora=false;this.chrome=false;this.chromeVersion=0;this.epiphany=false;this.firefox=false;this.firefoxVersion=0;this.ie=false;this.ieVersion=0;this.trident=false;this.tridentVersion=0;this.mobileSafari=false;this.midori=false;this.opera=false;this.safari=false;this.webApp=false;this.silk=false;this.audioData=false;this.webAudio=false;this.ogg=false;this.opus=false;this.mp3=false;this.wav=false;this.m4a=false;this.webm=false;this.oggVideo=false;this.h264Video=false;this.mp4Video=false;this.webmVideo=false;this.vp9Video=false;this.hlsVideo=false;this.iPhone=false;this.iPhone4=false;this.iPad=false;this.pixelRatio=0;this.littleEndian=false;this.LITTLE_ENDIAN=false;this.support32bit=false;this.fullscreen=false;this.requestFullscreen='';this.cancelFullscreen='';this.fullscreenKeyboard=false;};Phaser.Device=new Phaser.Device();Phaser.Device.onInitialized=new Phaser.Signal();Phaser.Device.whenReady=function(callback,context,nonPrimer){var readyCheck=this._readyCheck;if(this.deviceReadyAt||!readyCheck)
{callback.call(context,this);}
else if(readyCheck._monitor||nonPrimer)
{readyCheck._queue=readyCheck._queue||[];readyCheck._queue.push([callback,context]);}
else
{readyCheck._monitor=readyCheck.bind(this);readyCheck._queue=readyCheck._queue||[];readyCheck._queue.push([callback,context]);var cordova=typeof window.cordova!=='undefined';var cocoonJS=navigator['isCocoonJS'];if(document.readyState==='complete'||document.readyState==='interactive')
{window.setTimeout(readyCheck._monitor,0);}
else if(cordova&&!cocoonJS)
{document.addEventListener('deviceready',readyCheck._monitor,false);}
else
{document.addEventListener('DOMContentLoaded',readyCheck._monitor,false);window.addEventListener('load',readyCheck._monitor,false);}}};Phaser.Device._readyCheck=function(){var readyCheck=this._readyCheck;if(!document.body)
{window.setTimeout(readyCheck._monitor,20);}
else if(!this.deviceReadyAt)
{this.deviceReadyAt=Date.now();document.removeEventListener('deviceready',readyCheck._monitor);document.removeEventListener('DOMContentLoaded',readyCheck._monitor);window.removeEventListener('load',readyCheck._monitor);this._initialize();this.initialized=true;this.onInitialized.dispatch(this);var item;while((item=readyCheck._queue.shift()))
{var callback=item[0];var context=item[1];callback.call(context,this);}
this._readyCheck=null;this._initialize=null;this.onInitialized=null;}};Phaser.Device._initialize=function(){var device=this;function _checkOS(){var ua=navigator.userAgent;if(/Playstation Vita/.test(ua))
{device.vita=true;}
else if(/Kindle/.test(ua)||/\bKF[A-Z][A-Z]+/.test(ua)||/Silk.*Mobile Safari/.test(ua))
{device.kindle=true;}
else if(/Android/.test(ua))
{device.android=true;}
else if(/CrOS/.test(ua))
{device.chromeOS=true;}
else if(/iP[ao]d|iPhone/i.test(ua))
{device.iOS=true;(navigator.appVersion).match(/OS (\d+)/);device.iOSVersion=parseInt(RegExp.$1,10);}
else if(/Linux/.test(ua))
{device.linux=true;}
else if(/Mac OS/.test(ua))
{device.macOS=true;}
else if(/Windows/.test(ua))
{device.windows=true;}
if(/Windows Phone/i.test(ua)||/IEMobile/i.test(ua))
{device.android=false;device.iOS=false;device.macOS=false;device.windows=true;device.windowsPhone=true;}
var silk=/Silk/.test(ua);if(device.windows||device.macOS||(device.linux&&!silk)||device.chromeOS)
{device.desktop=true;}
if(device.windowsPhone||((/Windows NT/i.test(ua))&&(/Touch/i.test(ua))))
{device.desktop=false;}}
function _checkFeatures(){device.canvas=!!window['CanvasRenderingContext2D']||device.cocoonJS;try{device.localStorage=!!localStorage.getItem;}catch(error){device.localStorage=false;}
device.file=!!window['File']&&!!window['FileReader']&&!!window['FileList']&&!!window['Blob'];device.fileSystem=!!window['requestFileSystem'];device.webGL=(function(){try{var canvas=document.createElement('canvas');canvas.screencanvas=false;return!!window.WebGLRenderingContext&&(canvas.getContext('webgl')||canvas.getContext('experimental-webgl'));}catch(e){return false;}})();device.webGL=!!device.webGL;device.worker=!!window['Worker'];device.pointerLock='pointerLockElement'in document||'mozPointerLockElement'in document||'webkitPointerLockElement'in document;device.quirksMode=(document.compatMode==='CSS1Compat')?false:true;navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia||navigator.oGetUserMedia;window.URL=window.URL||window.webkitURL||window.mozURL||window.msURL;device.getUserMedia=device.getUserMedia&&!!navigator.getUserMedia&&!!window.URL;if(device.firefox&&device.firefoxVersion<21)
{device.getUserMedia=false;}
if(!device.iOS&&(device.ie||device.firefox||device.chrome))
{device.canvasBitBltShift=true;}
if(device.safari||device.mobileSafari)
{device.canvasBitBltShift=false;}}
function _checkInput(){if('ontouchstart'in document.documentElement||(window.navigator.maxTouchPoints&&window.navigator.maxTouchPoints>=1))
{device.touch=true;}
if(window.navigator.msPointerEnabled||window.navigator.pointerEnabled)
{device.mspointer=true;}
if(!device.cocoonJS)
{if('onwheel'in window||(device.ie&&'WheelEvent'in window))
{device.wheelEvent='wheel';}
else if('onmousewheel'in window)
{device.wheelEvent='mousewheel';}
else if(device.firefox&&'MouseScrollEvent'in window)
{device.wheelEvent='DOMMouseScroll';}}}
function _checkFullScreenSupport(){var fs=['requestFullscreen','requestFullScreen','webkitRequestFullscreen','webkitRequestFullScreen','msRequestFullscreen','msRequestFullScreen','mozRequestFullScreen','mozRequestFullscreen'];var element=document.createElement('div');for(var i=0;i<fs.length;i++)
{if(element[fs[i]])
{device.fullscreen=true;device.requestFullscreen=fs[i];break;}}
var cfs=['cancelFullScreen','exitFullscreen','webkitCancelFullScreen','webkitExitFullscreen','msCancelFullScreen','msExitFullscreen','mozCancelFullScreen','mozExitFullscreen'];if(device.fullscreen)
{for(var i=0;i<cfs.length;i++)
{if(document[cfs[i]])
{device.cancelFullscreen=cfs[i];break;}}}
if(window['Element']&&Element['ALLOW_KEYBOARD_INPUT'])
{device.fullscreenKeyboard=true;}}
function _checkBrowser(){var ua=navigator.userAgent;if(/Arora/.test(ua))
{device.arora=true;}
else if(/Chrome\/(\d+)/.test(ua)&&!device.windowsPhone)
{device.chrome=true;device.chromeVersion=parseInt(RegExp.$1,10);}
else if(/Epiphany/.test(ua))
{device.epiphany=true;}
else if(/Firefox\D+(\d+)/.test(ua))
{device.firefox=true;device.firefoxVersion=parseInt(RegExp.$1,10);}
else if(/AppleWebKit/.test(ua)&&device.iOS)
{device.mobileSafari=true;}
else if(/MSIE (\d+\.\d+);/.test(ua))
{device.ie=true;device.ieVersion=parseInt(RegExp.$1,10);}
else if(/Midori/.test(ua))
{device.midori=true;}
else if(/Opera/.test(ua))
{device.opera=true;}
else if(/Safari/.test(ua)&&!device.windowsPhone)
{device.safari=true;}
else if(/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua))
{device.ie=true;device.trident=true;device.tridentVersion=parseInt(RegExp.$1,10);device.ieVersion=parseInt(RegExp.$3,10);}
if(/Silk/.test(ua))
{device.silk=true;}
if(navigator['standalone'])
{device.webApp=true;}
if(typeof window.cordova!=="undefined")
{device.cordova=true;}
if(typeof process!=="undefined"&&typeof require!=="undefined")
{device.node=true;}
if(device.node&&typeof process.versions==='object')
{device.nodeWebkit=!!process.versions['node-webkit'];device.electron=!!process.versions.electron;}
if(navigator['isCocoonJS'])
{device.cocoonJS=true;}
if(device.cocoonJS)
{try{device.cocoonJSApp=(typeof CocoonJS!=="undefined");}
catch(error)
{device.cocoonJSApp=false;}}
if(typeof window.ejecta!=="undefined")
{device.ejecta=true;}
if(/Crosswalk/.test(ua))
{device.crosswalk=true;}}
function _checkVideo(){var videoElement=document.createElement("video");var result=false;try{if(result=!!videoElement.canPlayType)
{if(videoElement.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,''))
{device.oggVideo=true;}
if(videoElement.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,''))
{device.h264Video=true;device.mp4Video=true;}
if(videoElement.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,''))
{device.webmVideo=true;}
if(videoElement.canPlayType('video/webm; codecs="vp9"').replace(/^no$/,''))
{device.vp9Video=true;}
if(videoElement.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').replace(/^no$/,''))
{device.hlsVideo=true;}}}catch(e){}}
function _checkAudio(){device.audioData=!!(window['Audio']);device.webAudio=!!(window['AudioContext']||window['webkitAudioContext']);var audioElement=document.createElement('audio');var result=false;try{if(result=!!audioElement.canPlayType)
{if(audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,''))
{device.ogg=true;}
if(audioElement.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,'')||audioElement.canPlayType('audio/opus;').replace(/^no$/,''))
{device.opus=true;}
if(audioElement.canPlayType('audio/mpeg;').replace(/^no$/,''))
{device.mp3=true;}
if(audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/,''))
{device.wav=true;}
if(audioElement.canPlayType('audio/x-m4a;')||audioElement.canPlayType('audio/aac;').replace(/^no$/,''))
{device.m4a=true;}
if(audioElement.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,''))
{device.webm=true;}}}catch(e){}}
function _checkDevice(){device.pixelRatio=window['devicePixelRatio']||1;device.iPhone=navigator.userAgent.toLowerCase().indexOf('iphone')!=-1;device.iPhone4=(device.pixelRatio==2&&device.iPhone);device.iPad=navigator.userAgent.toLowerCase().indexOf('ipad')!=-1;if(typeof Int8Array!=='undefined')
{device.typedArray=true;}
else
{device.typedArray=false;}
if(typeof ArrayBuffer!=='undefined'&&typeof Uint8Array!=='undefined'&&typeof Uint32Array!=='undefined')
{device.littleEndian=_checkIsLittleEndian();device.LITTLE_ENDIAN=device.littleEndian;}
device.support32bit=(typeof ArrayBuffer!=="undefined"&&typeof Uint8ClampedArray!=="undefined"&&typeof Int32Array!=="undefined"&&device.littleEndian!==null&&_checkIsUint8ClampedImageData());navigator.vibrate=navigator.vibrate||navigator.webkitVibrate||navigator.mozVibrate||navigator.msVibrate;if(navigator.vibrate)
{device.vibration=true;}}
function _checkIsLittleEndian(){var a=new ArrayBuffer(4);var b=new Uint8Array(a);var c=new Uint32Array(a);b[0]=0xa1;b[1]=0xb2;b[2]=0xc3;b[3]=0xd4;if(c[0]==0xd4c3b2a1)
{return true;}
if(c[0]==0xa1b2c3d4)
{return false;}
else
{return null;}}
function _checkIsUint8ClampedImageData(){if(Uint8ClampedArray===undefined)
{return false;}
var elem=PIXI.CanvasPool.create(this,1,1);var ctx=elem.getContext('2d');if(!ctx)
{return false;}
var image=ctx.createImageData(1,1);PIXI.CanvasPool.remove(this);return image.data instanceof Uint8ClampedArray;}
function _checkCSS3D(){var el=document.createElement('p');var has3d;var transforms={'webkitTransform':'-webkit-transform','OTransform':'-o-transform','msTransform':'-ms-transform','MozTransform':'-moz-transform','transform':'transform'};document.body.insertBefore(el,null);for(var t in transforms)
{if(el.style[t]!==undefined)
{el.style[t]="translate3d(1px,1px,1px)";has3d=window.getComputedStyle(el).getPropertyValue(transforms[t]);}}
document.body.removeChild(el);device.css3D=(has3d!==undefined&&has3d.length>0&&has3d!=="none");}
_checkOS();_checkAudio();_checkVideo();_checkBrowser();_checkCSS3D();_checkDevice();_checkFeatures();_checkFullScreenSupport();_checkInput();};Phaser.Device.canPlayAudio=function(type){if(type==='mp3'&&this.mp3)
{return true;}
else if(type==='ogg'&&(this.ogg||this.opus))
{return true;}
else if(type==='m4a'&&this.m4a)
{return true;}
else if(type==='opus'&&this.opus)
{return true;}
else if(type==='wav'&&this.wav)
{return true;}
else if(type==='webm'&&this.webm)
{return true;}
return false;};Phaser.Device.canPlayVideo=function(type){if(type==='webm'&&(this.webmVideo||this.vp9Video))
{return true;}
else if(type==='mp4'&&(this.mp4Video||this.h264Video))
{return true;}
else if((type==='ogg'||type==='ogv')&&this.oggVideo)
{return true;}
else if(type==='mpeg'&&this.hlsVideo)
{return true;}
return false;};Phaser.Device.isConsoleOpen=function(){if(window.console&&window.console['firebug'])
{return true;}
if(window.console)
{console.profile();console.profileEnd();if(console.clear)
{console.clear();}
if(console['profiles'])
{return console['profiles'].length>0;}}
return false;};Phaser.Device.isAndroidStockBrowser=function(){var matches=window.navigator.userAgent.match(/Android.*AppleWebKit\/([\d.]+)/);return matches&&matches[1]<537;};Phaser.Canvas={create:function(parent,width,height,id,skipPool){width=width||256;height=height||256;if(skipPool===undefined)
{var canvas=PIXI.CanvasPool.create(parent,width,height);}
else
{var canvas=document.createElement('canvas');}
if(typeof id==='string'&&id!=='')
{canvas.id=id;}
canvas.width=width;canvas.height=height;canvas.style.display='block';return canvas;},setBackgroundColor:function(canvas,color){color=color||'rgb(0,0,0)';canvas.style.backgroundColor=color;return canvas;},setTouchAction:function(canvas,value){value=value||'none';canvas.style.msTouchAction=value;canvas.style['ms-touch-action']=value;canvas.style['touch-action']=value;return canvas;},setUserSelect:function(canvas,value){value=value||'none';canvas.style['-webkit-touch-callout']=value;canvas.style['-webkit-user-select']=value;canvas.style['-khtml-user-select']=value;canvas.style['-moz-user-select']=value;canvas.style['-ms-user-select']=value;canvas.style['user-select']=value;canvas.style['-webkit-tap-highlight-color']='rgba(0, 0, 0, 0)';return canvas;},addToDOM:function(canvas,parent,overflowHidden){var target;if(overflowHidden===undefined){overflowHidden=true;}
if(parent)
{if(typeof parent==='string')
{target=document.getElementById(parent);}
else if(typeof parent==='object'&&parent.nodeType===1)
{target=parent;}}
if(!target)
{target=document.body;}
if(overflowHidden&&target.style)
{target.style.overflow='hidden';}
target.appendChild(canvas);return canvas;},removeFromDOM:function(canvas){if(canvas.parentNode)
{canvas.parentNode.removeChild(canvas);}},setTransform:function(context,translateX,translateY,scaleX,scaleY,skewX,skewY){context.setTransform(scaleX,skewX,skewY,scaleY,translateX,translateY);return context;},setSmoothingEnabled:function(context,value){var s=Phaser.Canvas.getSmoothingPrefix(context);if(s)
{context[s]=value;}
return context;},getSmoothingPrefix:function(context){var vendor=['i','webkitI','msI','mozI','oI'];for(var prefix in vendor)
{var s=vendor[prefix]+'mageSmoothingEnabled';if(s in context)
{return s;}}
return null;},getSmoothingEnabled:function(context){var s=Phaser.Canvas.getSmoothingPrefix(context);if(s)
{return context[s];}},setImageRenderingCrisp:function(canvas){var types=['optimizeSpeed','crisp-edges','-moz-crisp-edges','-webkit-optimize-contrast','optimize-contrast','pixelated'];for(var i=0;i<types.length;i++)
{canvas.style['image-rendering']=types[i];}
canvas.style.msInterpolationMode='nearest-neighbor';return canvas;},setImageRenderingBicubic:function(canvas){canvas.style['image-rendering']='auto';canvas.style.msInterpolationMode='bicubic';return canvas;}};Phaser.RequestAnimationFrame=function(game,forceSetTimeOut){if(forceSetTimeOut===undefined){forceSetTimeOut=false;}
this.game=game;this.isRunning=false;this.forceSetTimeOut=forceSetTimeOut;var vendors=['ms','moz','webkit','o'];for(var x=0;x<vendors.length&&!window.requestAnimationFrame;x++)
{window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];window.cancelAnimationFrame=window[vendors[x]+'CancelAnimationFrame'];}
this._isSetTimeOut=false;this._onLoop=null;this._timeOutID=null;};Phaser.RequestAnimationFrame.prototype={start:function(){this.isRunning=true;var _this=this;if(!window.requestAnimationFrame||this.forceSetTimeOut)
{this._isSetTimeOut=true;this._onLoop=function(){return _this.updateSetTimeout();};this._timeOutID=window.setTimeout(this._onLoop,0);}
else
{this._isSetTimeOut=false;this._onLoop=function(time){return _this.updateRAF(time);};this._timeOutID=window.requestAnimationFrame(this._onLoop);}},updateRAF:function(rafTime){this.game.update(Math.floor(rafTime));this._timeOutID=window.requestAnimationFrame(this._onLoop);},updateSetTimeout:function(){this.game.update(Date.now());this._timeOutID=window.setTimeout(this._onLoop,this.game.time.timeToCall);},stop:function(){if(this._isSetTimeOut)
{clearTimeout(this._timeOutID);}
else
{window.cancelAnimationFrame(this._timeOutID);}
this.isRunning=false;},isSetTimeOut:function(){return this._isSetTimeOut;},isRAF:function(){return(this._isSetTimeOut===false);}};Phaser.RequestAnimationFrame.prototype.constructor=Phaser.RequestAnimationFrame;Phaser.Math={PI2:Math.PI*2,fuzzyEqual:function(a,b,epsilon){if(epsilon===undefined){epsilon=0.0001;}
return Math.abs(a-b)<epsilon;},fuzzyLessThan:function(a,b,epsilon){if(epsilon===undefined){epsilon=0.0001;}
return a<b+epsilon;},fuzzyGreaterThan:function(a,b,epsilon){if(epsilon===undefined){epsilon=0.0001;}
return a>b-epsilon;},fuzzyCeil:function(val,epsilon){if(epsilon===undefined){epsilon=0.0001;}
return Math.ceil(val-epsilon);},fuzzyFloor:function(val,epsilon){if(epsilon===undefined){epsilon=0.0001;}
return Math.floor(val+epsilon);},average:function(){var sum=0;var len=arguments.length;for(var i=0;i<len;i++)
{sum+=(+arguments[i]);}
return sum / len;},shear:function(n){return n%1;},snapTo:function(input,gap,start){if(start===undefined){start=0;}
if(gap===0){return input;}
input-=start;input=gap*Math.round(input / gap);return start+input;},snapToFloor:function(input,gap,start){if(start===undefined){start=0;}
if(gap===0){return input;}
input-=start;input=gap*Math.floor(input / gap);return start+input;},snapToCeil:function(input,gap,start){if(start===undefined){start=0;}
if(gap===0){return input;}
input-=start;input=gap*Math.ceil(input / gap);return start+input;},roundTo:function(value,place,base){if(place===undefined){place=0;}
if(base===undefined){base=10;}
var p=Math.pow(base,-place);return Math.round(value*p)/ p;},floorTo:function(value,place,base){if(place===undefined){place=0;}
if(base===undefined){base=10;}
var p=Math.pow(base,-place);return Math.floor(value*p)/ p;},ceilTo:function(value,place,base){if(place===undefined){place=0;}
if(base===undefined){base=10;}
var p=Math.pow(base,-place);return Math.ceil(value*p)/ p;},angleBetween:function(x1,y1,x2,y2){return Math.atan2(y2-y1,x2-x1);},angleBetweenY:function(x1,y1,x2,y2){return Math.atan2(x2-x1,y2-y1);},angleBetweenPoints:function(point1,point2){return Math.atan2(point2.y-point1.y,point2.x-point1.x);},angleBetweenPointsY:function(point1,point2){return Math.atan2(point2.x-point1.x,point2.y-point1.y);},reverseAngle:function(angleRad){return this.normalizeAngle(angleRad+Math.PI,true);},normalizeAngle:function(angleRad){angleRad=angleRad%(2*Math.PI);return angleRad>=0?angleRad:angleRad+2*Math.PI;},maxAdd:function(value,amount,max){return Math.min(value+amount,max);},minSub:function(value,amount,min){return Math.max(value-amount,min);},wrap:function(value,min,max){var range=max-min;if(range<=0)
{return 0;}
var result=(value-min)%range;if(result<0)
{result+=range;}
return result+min;},wrapValue:function(value,amount,max){var diff;value=Math.abs(value);amount=Math.abs(amount);max=Math.abs(max);diff=(value+amount)%max;return diff;},isOdd:function(n){return!!(n&1);},isEven:function(n){return!(n&1);},min:function(){if(arguments.length===1&&typeof arguments[0]==='object')
{var data=arguments[0];}
else
{var data=arguments;}
for(var i=1,min=0,len=data.length;i<len;i++)
{if(data[i]<data[min])
{min=i;}}
return data[min];},max:function(){if(arguments.length===1&&typeof arguments[0]==='object')
{var data=arguments[0];}
else
{var data=arguments;}
for(var i=1,max=0,len=data.length;i<len;i++)
{if(data[i]>data[max])
{max=i;}}
return data[max];},minProperty:function(property){if(arguments.length===2&&typeof arguments[1]==='object')
{var data=arguments[1];}
else
{var data=arguments.slice(1);}
for(var i=1,min=0,len=data.length;i<len;i++)
{if(data[i][property]<data[min][property])
{min=i;}}
return data[min][property];},maxProperty:function(property){if(arguments.length===2&&typeof arguments[1]==='object')
{var data=arguments[1];}
else
{var data=arguments.slice(1);}
for(var i=1,max=0,len=data.length;i<len;i++)
{if(data[i][property]>data[max][property])
{max=i;}}
return data[max][property];},wrapAngle:function(angle,radians){return radians?this.wrap(angle,-Math.PI,Math.PI):this.wrap(angle,-180,180);},linearInterpolation:function(v,k){var m=v.length-1;var f=m*k;var i=Math.floor(f);if(k<0)
{return this.linear(v[0],v[1],f);}
if(k>1)
{return this.linear(v[m],v[m-1],m-f);}
return this.linear(v[i],v[i+1>m?m:i+1],f-i);},bezierInterpolation:function(v,k){var b=0;var n=v.length-1;for(var i=0;i<=n;i++)
{b+=Math.pow(1-k,n-i)*Math.pow(k,i)*v[i]*this.bernstein(n,i);}
return b;},catmullRomInterpolation:function(v,k){var m=v.length-1;var f=m*k;var i=Math.floor(f);if(v[0]===v[m])
{if(k<0)
{i=Math.floor(f=m*(1+k));}
return this.catmullRom(v[(i-1+m)%m],v[i],v[(i+1)%m],v[(i+2)%m],f-i);}
else
{if(k<0)
{return v[0]-(this.catmullRom(v[0],v[0],v[1],v[1],-f)-v[0]);}
if(k>1)
{return v[m]-(this.catmullRom(v[m],v[m],v[m-1],v[m-1],f-m)-v[m]);}
return this.catmullRom(v[i?i-1:0],v[i],v[m<i+1?m:i+1],v[m<i+2?m:i+2],f-i);}},linear:function(p0,p1,t){return(p1-p0)*t+p0;},bernstein:function(n,i){return this.factorial(n)/ this.factorial(i)/ this.factorial(n-i);},factorial:function(value){if(value===0)
{return 1;}
var res=value;while(--value)
{res*=value;}
return res;},catmullRom:function(p0,p1,p2,p3,t){var v0=(p2-p0)*0.5,v1=(p3-p1)*0.5,t2=t*t,t3=t*t2;return(2*p1-2*p2+v0+v1)*t3+(-3*p1+3*p2-2*v0-v1)*t2+v0*t+p1;},difference:function(a,b){return Math.abs(a-b);},roundAwayFromZero:function(value){return(value>0)?Math.ceil(value):Math.floor(value);},sinCosGenerator:function(length,sinAmplitude,cosAmplitude,frequency){if(sinAmplitude===undefined){sinAmplitude=1.0;}
if(cosAmplitude===undefined){cosAmplitude=1.0;}
if(frequency===undefined){frequency=1.0;}
var sin=sinAmplitude;var cos=cosAmplitude;var frq=frequency*Math.PI / length;var cosTable=[];var sinTable=[];for(var c=0;c<length;c++){cos-=sin*frq;sin+=cos*frq;cosTable[c]=cos;sinTable[c]=sin;}
return{sin:sinTable,cos:cosTable,length:length};},distance:function(x1,y1,x2,y2){var dx=x1-x2;var dy=y1-y2;return Math.sqrt(dx*dx+dy*dy);},distanceSq:function(x1,y1,x2,y2){var dx=x1-x2;var dy=y1-y2;return dx*dx+dy*dy;},distancePow:function(x1,y1,x2,y2,pow){if(pow===undefined){pow=2;}
return Math.sqrt(Math.pow(x2-x1,pow)+Math.pow(y2-y1,pow));},clamp:function(x,a,b){return(x<a)?a:((x>b)?b:x);},clampBottom:function(x,a){return x<a?a:x;},within:function(a,b,tolerance){return(Math.abs(a-b)<=tolerance);},mapLinear:function(x,a1,a2,b1,b2){return b1+(x-a1)*(b2-b1)/(a2-a1);},smoothstep:function(x,min,max){x=Math.max(0,Math.min(1,(x-min)/(max-min)));return x*x*(3-2*x);},smootherstep:function(x,min,max){x=Math.max(0,Math.min(1,(x-min)/(max-min)));return x*x*x*(x*(x*6-15)+10);},sign:function(x){return(x<0)?-1:((x>0)?1:0);},percent:function(a,b,base){if(base===undefined){base=0;}
if(a>b||base>b)
{return 1;}
else if(a<base||base>a)
{return 0;}
else
{return(a-base)/ b;}}};var degreeToRadiansFactor=Math.PI / 180;var radianToDegreesFactor=180 / Math.PI;Phaser.Math.degToRad=function degToRad(degrees){return degrees*degreeToRadiansFactor;};Phaser.Math.radToDeg=function radToDeg(radians){return radians*radianToDegreesFactor;};Phaser.RandomDataGenerator=function(seeds){if(seeds===undefined){seeds=[];}
this.c=1;this.s0=0;this.s1=0;this.s2=0;if(typeof seeds==='string')
{this.state(seeds);}
else
{this.sow(seeds);}};Phaser.RandomDataGenerator.prototype={rnd:function(){var t=2091639*this.s0+this.c*2.3283064365386963e-10;this.c=t|0;this.s0=this.s1;this.s1=this.s2;this.s2=t-this.c;return this.s2;},sow:function(seeds){this.s0=this.hash(' ');this.s1=this.hash(this.s0);this.s2=this.hash(this.s1);this.c=1;if(!seeds)
{return;}
for(var i=0;i<seeds.length&&(seeds[i]!=null);i++)
{var seed=seeds[i];this.s0-=this.hash(seed);this.s0+=~~(this.s0<0);this.s1-=this.hash(seed);this.s1+=~~(this.s1<0);this.s2-=this.hash(seed);this.s2+=~~(this.s2<0);}},hash:function(data){var h,i,n;n=0xefc8249d;data=data.toString();for(i=0;i<data.length;i++){n+=data.charCodeAt(i);h=0.02519603282416938*n;n=h>>>0;h-=n;h*=n;n=h>>>0;h-=n;n+=h*0x100000000;}
return(n>>>0)*2.3283064365386963e-10;},integer:function(){return this.rnd.apply(this)*0x100000000;},frac:function(){return this.rnd.apply(this)+(this.rnd.apply(this)*0x200000|0)*1.1102230246251565e-16;},real:function(){return this.integer()+this.frac();},integerInRange:function(min,max){return Math.floor(this.realInRange(0,max-min+1)+min);},between:function(min,max){return this.integerInRange(min,max);},realInRange:function(min,max){return this.frac()*(max-min)+min;},normal:function(){return 1-2*this.frac();},uuid:function(){var a='';var b='';for(b=a='';a++<36;b+=~a%5|a*3&4?(a^15?8^this.frac()*(a^20?16:4):4).toString(16):'-')
{}
return b;},pick:function(ary){return ary[this.integerInRange(0,ary.length-1)];},weightedPick:function(ary){return ary[~~(Math.pow(this.frac(),2)*(ary.length-1)+0.5)];},timestamp:function(min,max){return this.realInRange(min||946684800000,max||1577862000000);},angle:function(){return this.integerInRange(-180,180);},state:function(state){if(typeof state==='string'&&state.match(/^!rnd/))
{state=state.split(',');this.c=parseFloat(state[1]);this.s0=parseFloat(state[2]);this.s1=parseFloat(state[3]);this.s2=parseFloat(state[4]);}
return['!rnd',this.c,this.s0,this.s1,this.s2].join(',');}};Phaser.RandomDataGenerator.prototype.constructor=Phaser.RandomDataGenerator;Phaser.QuadTree=function(x,y,width,height,maxObjects,maxLevels,level){this.maxObjects=10;this.maxLevels=4;this.level=0;this.bounds={};this.objects=[];this.nodes=[];this._empty=[];this.reset(x,y,width,height,maxObjects,maxLevels,level);};Phaser.QuadTree.prototype={reset:function(x,y,width,height,maxObjects,maxLevels,level){this.maxObjects=maxObjects||10;this.maxLevels=maxLevels||4;this.level=level||0;this.bounds={x:Math.round(x),y:Math.round(y),width:width,height:height,subWidth:Math.floor(width / 2),subHeight:Math.floor(height / 2),right:Math.round(x)+Math.floor(width / 2),bottom:Math.round(y)+Math.floor(height / 2)};this.objects.length=0;this.nodes.length=0;},populate:function(group){group.forEach(this.populateHandler,this,true);},populateHandler:function(sprite){if(sprite.body&&sprite.exists)
{this.insert(sprite.body);}},split:function(){this.nodes[0]=new Phaser.QuadTree(this.bounds.right,this.bounds.y,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,(this.level+1));this.nodes[1]=new Phaser.QuadTree(this.bounds.x,this.bounds.y,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,(this.level+1));this.nodes[2]=new Phaser.QuadTree(this.bounds.x,this.bounds.bottom,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,(this.level+1));this.nodes[3]=new Phaser.QuadTree(this.bounds.right,this.bounds.bottom,this.bounds.subWidth,this.bounds.subHeight,this.maxObjects,this.maxLevels,(this.level+1));},insert:function(body){var i=0;var index;if(this.nodes[0]!=null)
{index=this.getIndex(body);if(index!==-1)
{this.nodes[index].insert(body);return;}}
this.objects.push(body);if(this.objects.length>this.maxObjects&&this.level<this.maxLevels)
{if(this.nodes[0]==null)
{this.split();}
while(i<this.objects.length)
{index=this.getIndex(this.objects[i]);if(index!==-1)
{this.nodes[index].insert(this.objects.splice(i,1)[0]);}
else
{i++;}}}},getIndex:function(rect){var index=-1;if(rect.x<this.bounds.right&&rect.right<this.bounds.right)
{if(rect.y<this.bounds.bottom&&rect.bottom<this.bounds.bottom)
{index=1;}
else if(rect.y>this.bounds.bottom)
{index=2;}}
else if(rect.x>this.bounds.right)
{if(rect.y<this.bounds.bottom&&rect.bottom<this.bounds.bottom)
{index=0;}
else if(rect.y>this.bounds.bottom)
{index=3;}}
return index;},retrieve:function(source){if(source instanceof Phaser.Rectangle)
{var returnObjects=this.objects;var index=this.getIndex(source);}
else
{if(!source.body)
{return this._empty;}
var returnObjects=this.objects;var index=this.getIndex(source.body);}
if(this.nodes[0])
{if(index!==-1)
{returnObjects=returnObjects.concat(this.nodes[index].retrieve(source));}
else
{returnObjects=returnObjects.concat(this.nodes[0].retrieve(source));returnObjects=returnObjects.concat(this.nodes[1].retrieve(source));returnObjects=returnObjects.concat(this.nodes[2].retrieve(source));returnObjects=returnObjects.concat(this.nodes[3].retrieve(source));}}
return returnObjects;},clear:function(){this.objects.length=0;var i=this.nodes.length;while(i--)
{this.nodes[i].clear();this.nodes.splice(i,1);}
this.nodes.length=0;}};Phaser.QuadTree.prototype.constructor=Phaser.QuadTree;Phaser.Net=function(game){this.game=game;};Phaser.Net.prototype={getHostName:function(){if(window.location&&window.location.hostname){return window.location.hostname;}
return null;},checkDomainName:function(domain){return window.location.hostname.indexOf(domain)!==-1;},updateQueryString:function(key,value,redirect,url){if(redirect===undefined){redirect=false;}
if(url===undefined||url===''){url=window.location.href;}
var output='';var re=new RegExp("([?|&])"+key+"=.*?(&|#|$)(.*)","gi");if(re.test(url))
{if(typeof value!=='undefined'&&value!==null)
{output=url.replace(re,'$1'+key+"="+value+'$2$3');}
else
{output=url.replace(re,'$1$3').replace(/(&|\?)$/,'');}}
else
{if(typeof value!=='undefined'&&value!==null)
{var separator=url.indexOf('?')!==-1?'&':'?';var hash=url.split('#');url=hash[0]+separator+key+'='+value;if(hash[1]){url+='#'+hash[1];}
output=url;}
else
{output=url;}}
if(redirect)
{window.location.href=output;}
else
{return output;}},getQueryString:function(parameter){if(parameter===undefined){parameter='';}
var output={};var keyValues=location.search.substring(1).split('&');for(var i in keyValues)
{var key=keyValues[i].split('=');if(key.length>1)
{if(parameter&&parameter==this.decodeURI(key[0]))
{return this.decodeURI(key[1]);}
else
{output[this.decodeURI(key[0])]=this.decodeURI(key[1]);}}}
return output;},decodeURI:function(value){return decodeURIComponent(value.replace(/\+/g," "));}};Phaser.Net.prototype.constructor=Phaser.Net;Phaser.TweenManager=function(game){this.game=game;this.frameBased=false;this._tweens=[];this._add=[];this.easeMap={"Power0":Phaser.Easing.Power0,"Power1":Phaser.Easing.Power1,"Power2":Phaser.Easing.Power2,"Power3":Phaser.Easing.Power3,"Power4":Phaser.Easing.Power4,"Linear":Phaser.Easing.Linear.None,"Quad":Phaser.Easing.Quadratic.Out,"Cubic":Phaser.Easing.Cubic.Out,"Quart":Phaser.Easing.Quartic.Out,"Quint":Phaser.Easing.Quintic.Out,"Sine":Phaser.Easing.Sinusoidal.Out,"Expo":Phaser.Easing.Exponential.Out,"Circ":Phaser.Easing.Circular.Out,"Elastic":Phaser.Easing.Elastic.Out,"Back":Phaser.Easing.Back.Out,"Bounce":Phaser.Easing.Bounce.Out,"Quad.easeIn":Phaser.Easing.Quadratic.In,"Cubic.easeIn":Phaser.Easing.Cubic.In,"Quart.easeIn":Phaser.Easing.Quartic.In,"Quint.easeIn":Phaser.Easing.Quintic.In,"Sine.easeIn":Phaser.Easing.Sinusoidal.In,"Expo.easeIn":Phaser.Easing.Exponential.In,"Circ.easeIn":Phaser.Easing.Circular.In,"Elastic.easeIn":Phaser.Easing.Elastic.In,"Back.easeIn":Phaser.Easing.Back.In,"Bounce.easeIn":Phaser.Easing.Bounce.In,"Quad.easeOut":Phaser.Easing.Quadratic.Out,"Cubic.easeOut":Phaser.Easing.Cubic.Out,"Quart.easeOut":Phaser.Easing.Quartic.Out,"Quint.easeOut":Phaser.Easing.Quintic.Out,"Sine.easeOut":Phaser.Easing.Sinusoidal.Out,"Expo.easeOut":Phaser.Easing.Exponential.Out,"Circ.easeOut":Phaser.Easing.Circular.Out,"Elastic.easeOut":Phaser.Easing.Elastic.Out,"Back.easeOut":Phaser.Easing.Back.Out,"Bounce.easeOut":Phaser.Easing.Bounce.Out,"Quad.easeInOut":Phaser.Easing.Quadratic.InOut,"Cubic.easeInOut":Phaser.Easing.Cubic.InOut,"Quart.easeInOut":Phaser.Easing.Quartic.InOut,"Quint.easeInOut":Phaser.Easing.Quintic.InOut,"Sine.easeInOut":Phaser.Easing.Sinusoidal.InOut,"Expo.easeInOut":Phaser.Easing.Exponential.InOut,"Circ.easeInOut":Phaser.Easing.Circular.InOut,"Elastic.easeInOut":Phaser.Easing.Elastic.InOut,"Back.easeInOut":Phaser.Easing.Back.InOut,"Bounce.easeInOut":Phaser.Easing.Bounce.InOut};this.game.onPause.add(this._pauseAll,this);this.game.onResume.add(this._resumeAll,this);};Phaser.TweenManager.prototype={getAll:function(){return this._tweens;},removeAll:function(){for(var i=0;i<this._tweens.length;i++)
{this._tweens[i].pendingDelete=true;}
this._add=[];},removeFrom:function(obj,children){if(children===undefined){children=true;}
var i;var len;if(Array.isArray(obj))
{for(i=0,len=obj.length;i<len;i++)
{this.removeFrom(obj[i]);}}
else if(obj.type===Phaser.GROUP&&children)
{for(var i=0,len=obj.children.length;i<len;i++)
{this.removeFrom(obj.children[i]);}}
else
{for(i=0,len=this._tweens.length;i<len;i++)
{if(obj===this._tweens[i].target)
{this.remove(this._tweens[i]);}}
for(i=0,len=this._add.length;i<len;i++)
{if(obj===this._add[i].target)
{this.remove(this._add[i]);}}}},add:function(tween){tween._manager=this;this._add.push(tween);},create:function(object){return new Phaser.Tween(object,this.game,this);},remove:function(tween){var i=this._tweens.indexOf(tween);if(i!==-1)
{this._tweens[i].pendingDelete=true;}
else
{i=this._add.indexOf(tween);if(i!==-1)
{this._add[i].pendingDelete=true;}}},update:function(){var addTweens=this._add.length;var numTweens=this._tweens.length;if(numTweens===0&&addTweens===0)
{return false;}
var i=0;while(i<numTweens)
{if(this._tweens[i].update(this.game.time.time))
{i++;}
else
{this._tweens.splice(i,1);numTweens--;}}
if(addTweens>0)
{this._tweens=this._tweens.concat(this._add);this._add.length=0;}
return true;},isTweening:function(object){return this._tweens.some(function(tween){return tween.target===object;});},_pauseAll:function(){for(var i=this._tweens.length-1;i>=0;i--)
{this._tweens[i]._pause();}},_resumeAll:function(){for(var i=this._tweens.length-1;i>=0;i--)
{this._tweens[i]._resume();}},pauseAll:function(){for(var i=this._tweens.length-1;i>=0;i--)
{this._tweens[i].pause();}},resumeAll:function(){for(var i=this._tweens.length-1;i>=0;i--)
{this._tweens[i].resume(true);}}};Phaser.TweenManager.prototype.constructor=Phaser.TweenManager;Phaser.Tween=function(target,game,manager){this.game=game;this.target=target;this.manager=manager;this.timeline=[];this.reverse=false;this.timeScale=1;this.repeatCounter=0;this.pendingDelete=false;this.onStart=new Phaser.Signal();this.onLoop=new Phaser.Signal();this.onRepeat=new Phaser.Signal();this.onChildComplete=new Phaser.Signal();this.onComplete=new Phaser.Signal();this.isRunning=false;this.current=0;this.properties={};this.chainedTween=null;this.isPaused=false;this.frameBased=manager.frameBased;this._onUpdateCallback=null;this._onUpdateCallbackContext=null;this._pausedTime=0;this._codePaused=false;this._hasStarted=false;};Phaser.Tween.prototype={to:function(properties,duration,ease,autoStart,delay,repeat,yoyo){if(duration===undefined||duration<=0){duration=1000;}
if(ease===undefined||ease===null){ease=Phaser.Easing.Default;}
if(autoStart===undefined){autoStart=false;}
if(delay===undefined){delay=0;}
if(repeat===undefined){repeat=0;}
if(yoyo===undefined){yoyo=false;}
if(typeof ease==='string'&&this.manager.easeMap[ease])
{ease=this.manager.easeMap[ease];}
if(this.isRunning)
{console.warn('Phaser.Tween.to cannot be called after Tween.start');return this;}
this.timeline.push(new Phaser.TweenData(this).to(properties,duration,ease,delay,repeat,yoyo));if(autoStart)
{this.start();}
return this;},from:function(properties,duration,ease,autoStart,delay,repeat,yoyo){if(duration===undefined){duration=1000;}
if(ease===undefined||ease===null){ease=Phaser.Easing.Default;}
if(autoStart===undefined){autoStart=false;}
if(delay===undefined){delay=0;}
if(repeat===undefined){repeat=0;}
if(yoyo===undefined){yoyo=false;}
if(typeof ease==='string'&&this.manager.easeMap[ease])
{ease=this.manager.easeMap[ease];}
if(this.isRunning)
{console.warn('Phaser.Tween.from cannot be called after Tween.start');return this;}
this.timeline.push(new Phaser.TweenData(this).from(properties,duration,ease,delay,repeat,yoyo));if(autoStart)
{this.start();}
return this;},start:function(index){if(index===undefined){index=0;}
if(this.game===null||this.target===null||this.timeline.length===0||this.isRunning)
{return this;}
for(var i=0;i<this.timeline.length;i++)
{for(var property in this.timeline[i].vEnd)
{this.properties[property]=this.target[property]||0;if(!Array.isArray(this.properties[property]))
{this.properties[property]*=1.0;}}}
for(var i=0;i<this.timeline.length;i++)
{this.timeline[i].loadValues();}
this.manager.add(this);this.isRunning=true;if(index<0||index>this.timeline.length-1)
{index=0;}
this.current=index;this.timeline[this.current].start();return this;},stop:function(complete){if(complete===undefined){complete=false;}
this.isRunning=false;this._onUpdateCallback=null;this._onUpdateCallbackContext=null;if(complete)
{this.onComplete.dispatch(this.target,this);if(this.chainedTween)
{this.chainedTween.start();}}
this.manager.remove(this);return this;},updateTweenData:function(property,value,index){if(this.timeline.length===0){return this;}
if(index===undefined){index=0;}
if(index===-1)
{for(var i=0;i<this.timeline.length;i++)
{this.timeline[i][property]=value;}}
else
{this.timeline[index][property]=value;}
return this;},delay:function(duration,index){return this.updateTweenData('delay',duration,index);},repeat:function(total,repeatDelay,index){if(repeatDelay===undefined){repeatDelay=0;}
this.updateTweenData('repeatCounter',total,index);return this.updateTweenData('repeatDelay',repeatDelay,index);},repeatDelay:function(duration,index){return this.updateTweenData('repeatDelay',duration,index);},yoyo:function(enable,yoyoDelay,index){if(yoyoDelay===undefined){yoyoDelay=0;}
this.updateTweenData('yoyo',enable,index);return this.updateTweenData('yoyoDelay',yoyoDelay,index);},yoyoDelay:function(duration,index){return this.updateTweenData('yoyoDelay',duration,index);},easing:function(ease,index){if(typeof ease==='string'&&this.manager.easeMap[ease])
{ease=this.manager.easeMap[ease];}
return this.updateTweenData('easingFunction',ease,index);},interpolation:function(interpolation,context,index){if(context===undefined){context=Phaser.Math;}
this.updateTweenData('interpolationFunction',interpolation,index);return this.updateTweenData('interpolationContext',context,index);},repeatAll:function(total){if(total===undefined){total=0;}
this.repeatCounter=total;return this;},chain:function(){var i=arguments.length;while(i--)
{if(i>0)
{arguments[i-1].chainedTween=arguments[i];}
else
{this.chainedTween=arguments[i];}}
return this;},loop:function(value){if(value===undefined){value=true;}
if(value)
{this.repeatAll(-1);}
else
{this.repeatCounter=0;}
return this;},onUpdateCallback:function(callback,callbackContext){this._onUpdateCallback=callback;this._onUpdateCallbackContext=callbackContext;return this;},pause:function(){this.isPaused=true;this._codePaused=true;this._pausedTime=this.game.time.time;},_pause:function(){if(!this._codePaused)
{this.isPaused=true;this._pausedTime=this.game.time.time;}},resume:function(){if(this.isPaused)
{this.isPaused=false;this._codePaused=false;for(var i=0;i<this.timeline.length;i++)
{if(!this.timeline[i].isRunning)
{this.timeline[i].startTime+=(this.game.time.time-this._pausedTime);}}}},_resume:function(){if(this._codePaused)
{return;}
else
{this.resume();}},update:function(time){if(this.pendingDelete)
{return false;}
if(this.isPaused)
{return true;}
var status=this.timeline[this.current].update(time);if(status===Phaser.TweenData.PENDING)
{return true;}
else if(status===Phaser.TweenData.RUNNING)
{if(!this._hasStarted)
{this.onStart.dispatch(this.target,this);this._hasStarted=true;}
if(this._onUpdateCallback!==null)
{this._onUpdateCallback.call(this._onUpdateCallbackContext,this,this.timeline[this.current].value,this.timeline[this.current]);}
return this.isRunning;}
else if(status===Phaser.TweenData.LOOPED)
{this.onLoop.dispatch(this.target,this);return true;}
else if(status===Phaser.TweenData.COMPLETE)
{var complete=false;if(this.reverse)
{this.current--;if(this.current<0)
{this.current=this.timeline.length-1;complete=true;}}
else
{this.current++;if(this.current===this.timeline.length)
{this.current=0;complete=true;}}
if(complete)
{if(this.repeatCounter===-1)
{this.timeline[this.current].start();this.onRepeat.dispatch(this.target,this);return true;}
else if(this.repeatCounter>0)
{this.repeatCounter--;this.timeline[this.current].start();this.onRepeat.dispatch(this.target,this);return true;}
else
{this.isRunning=false;this.onComplete.dispatch(this.target,this);if(this.chainedTween)
{this.chainedTween.start();}
return false;}}
else
{this.onChildComplete.dispatch(this.target,this);this.timeline[this.current].start();return true;}}},generateData:function(frameRate,data){if(this.game===null||this.target===null)
{return null;}
if(frameRate===undefined){frameRate=60;}
if(data===undefined){data=[];}
for(var i=0;i<this.timeline.length;i++)
{for(var property in this.timeline[i].vEnd)
{this.properties[property]=this.target[property]||0;if(!Array.isArray(this.properties[property]))
{this.properties[property]*=1.0;}}}
for(var i=0;i<this.timeline.length;i++)
{this.timeline[i].loadValues();}
for(var i=0;i<this.timeline.length;i++)
{data=data.concat(this.timeline[i].generateData(frameRate));}
return data;}};Object.defineProperty(Phaser.Tween.prototype,'totalDuration',{get:function(){var total=0;for(var i=0;i<this.timeline.length;i++)
{total+=this.timeline[i].duration;}
return total;}});Phaser.Tween.prototype.constructor=Phaser.Tween;Phaser.TweenData=function(parent){this.parent=parent;this.game=parent.game;this.vStart={};this.vStartCache={};this.vEnd={};this.vEndCache={};this.duration=1000;this.percent=0;this.value=0;this.repeatCounter=0;this.repeatDelay=0;this.interpolate=false;this.yoyo=false;this.yoyoDelay=0;this.inReverse=false;this.delay=0;this.dt=0;this.startTime=null;this.easingFunction=Phaser.Easing.Default;this.interpolationFunction=Phaser.Math.linearInterpolation;this.interpolationContext=Phaser.Math;this.isRunning=false;this.isFrom=false;};Phaser.TweenData.PENDING=0;Phaser.TweenData.RUNNING=1;Phaser.TweenData.LOOPED=2;Phaser.TweenData.COMPLETE=3;Phaser.TweenData.prototype={to:function(properties,duration,ease,delay,repeat,yoyo){this.vEnd=properties;this.duration=duration;this.easingFunction=ease;this.delay=delay;this.repeatCounter=repeat;this.yoyo=yoyo;this.isFrom=false;return this;},from:function(properties,duration,ease,delay,repeat,yoyo){this.vEnd=properties;this.duration=duration;this.easingFunction=ease;this.delay=delay;this.repeatCounter=repeat;this.yoyo=yoyo;this.isFrom=true;return this;},start:function(){this.startTime=this.game.time.time+this.delay;if(this.parent.reverse)
{this.dt=this.duration;}
else
{this.dt=0;}
if(this.delay>0)
{this.isRunning=false;}
else
{this.isRunning=true;}
if(this.isFrom)
{for(var property in this.vStartCache)
{this.vStart[property]=this.vEndCache[property];this.vEnd[property]=this.vStartCache[property];this.parent.target[property]=this.vStart[property];}}
this.value=0;this.yoyoCounter=0;return this;},loadValues:function(){for(var property in this.parent.properties)
{this.vStart[property]=this.parent.properties[property];if(Array.isArray(this.vEnd[property]))
{if(this.vEnd[property].length===0)
{continue;}
if(this.percent===0)
{this.vEnd[property]=[this.vStart[property]].concat(this.vEnd[property]);}}
if(typeof this.vEnd[property]!=='undefined')
{if(typeof this.vEnd[property]==='string')
{this.vEnd[property]=this.vStart[property]+parseFloat(this.vEnd[property],10);}
this.parent.properties[property]=this.vEnd[property];}
else
{this.vEnd[property]=this.vStart[property];}
this.vStartCache[property]=this.vStart[property];this.vEndCache[property]=this.vEnd[property];}
return this;},update:function(time){if(!this.isRunning)
{if(time>=this.startTime)
{this.isRunning=true;}
else
{return Phaser.TweenData.PENDING;}}
else
{if(time<this.startTime)
{return Phaser.TweenData.RUNNING;}}
var ms=(this.parent.frameBased)?this.game.time.physicsElapsedMS:this.game.time.elapsedMS;if(this.parent.reverse)
{this.dt-=ms*this.parent.timeScale;this.dt=Math.max(this.dt,0);}
else
{this.dt+=ms*this.parent.timeScale;this.dt=Math.min(this.dt,this.duration);}
this.percent=this.dt / this.duration;this.value=this.easingFunction(this.percent);for(var property in this.vEnd)
{var start=this.vStart[property];var end=this.vEnd[property];if(Array.isArray(end))
{this.parent.target[property]=this.interpolationFunction.call(this.interpolationContext,end,this.value);}
else
{this.parent.target[property]=start+((end-start)*this.value);}}
if((!this.parent.reverse&&this.percent===1)||(this.parent.reverse&&this.percent===0))
{return this.repeat();}
return Phaser.TweenData.RUNNING;},generateData:function(frameRate){if(this.parent.reverse)
{this.dt=this.duration;}
else
{this.dt=0;}
var data=[];var complete=false;var fps=(1 / frameRate)*1000;do
{if(this.parent.reverse)
{this.dt-=fps;this.dt=Math.max(this.dt,0);}
else
{this.dt+=fps;this.dt=Math.min(this.dt,this.duration);}
this.percent=this.dt / this.duration;this.value=this.easingFunction(this.percent);var blob={};for(var property in this.vEnd)
{var start=this.vStart[property];var end=this.vEnd[property];if(Array.isArray(end))
{blob[property]=this.interpolationFunction(end,this.value);}
else
{blob[property]=start+((end-start)*this.value);}}
data.push(blob);if((!this.parent.reverse&&this.percent===1)||(this.parent.reverse&&this.percent===0))
{complete=true;}}while(!complete);if(this.yoyo)
{var reversed=data.slice();reversed.reverse();data=data.concat(reversed);}
return data;},repeat:function(){if(this.yoyo)
{if(this.inReverse&&this.repeatCounter===0)
{return Phaser.TweenData.COMPLETE;}
this.inReverse=!this.inReverse;}
else
{if(this.repeatCounter===0)
{return Phaser.TweenData.COMPLETE;}}
if(this.inReverse)
{for(var property in this.vStartCache)
{this.vStart[property]=this.vEndCache[property];this.vEnd[property]=this.vStartCache[property];}}
else
{for(var property in this.vStartCache)
{this.vStart[property]=this.vStartCache[property];this.vEnd[property]=this.vEndCache[property];}
if(this.repeatCounter>0)
{this.repeatCounter--;}}
this.startTime=this.game.time.time;if(this.yoyo&&this.inReverse)
{this.startTime+=this.yoyoDelay;}
else if(!this.inReverse)
{this.startTime+=this.repeatDelay;}
if(this.parent.reverse)
{this.dt=this.duration;}
else
{this.dt=0;}
return Phaser.TweenData.LOOPED;}};Phaser.TweenData.prototype.constructor=Phaser.TweenData;Phaser.Easing={Linear:{None:function(k){return k;}},Quadratic:{In:function(k){return k*k;},Out:function(k){return k*(2-k);},InOut:function(k){if((k*=2)<1)return 0.5*k*k;return-0.5*(--k*(k-2)-1);}},Cubic:{In:function(k){return k*k*k;},Out:function(k){return--k*k*k+1;},InOut:function(k){if((k*=2)<1)return 0.5*k*k*k;return 0.5*((k-=2)*k*k+2);}},Quartic:{In:function(k){return k*k*k*k;},Out:function(k){return 1-(--k*k*k*k);},InOut:function(k){if((k*=2)<1)return 0.5*k*k*k*k;return-0.5*((k-=2)*k*k*k-2);}},Quintic:{In:function(k){return k*k*k*k*k;},Out:function(k){return--k*k*k*k*k+1;},InOut:function(k){if((k*=2)<1)return 0.5*k*k*k*k*k;return 0.5*((k-=2)*k*k*k*k+2);}},Sinusoidal:{In:function(k){if(k===0)return 0;if(k===1)return 1;return 1-Math.cos(k*Math.PI / 2);},Out:function(k){if(k===0)return 0;if(k===1)return 1;return Math.sin(k*Math.PI / 2);},InOut:function(k){if(k===0)return 0;if(k===1)return 1;return 0.5*(1-Math.cos(Math.PI*k));}},Exponential:{In:function(k){return k===0?0:Math.pow(1024,k-1);},Out:function(k){return k===1?1:1-Math.pow(2,-10*k);},InOut:function(k){if(k===0)return 0;if(k===1)return 1;if((k*=2)<1)return 0.5*Math.pow(1024,k-1);return 0.5*(-Math.pow(2,-10*(k-1))+2);}},Circular:{In:function(k){return 1-Math.sqrt(1-k*k);},Out:function(k){return Math.sqrt(1-(--k*k));},InOut:function(k){if((k*=2)<1)return-0.5*(Math.sqrt(1-k*k)-1);return 0.5*(Math.sqrt(1-(k-=2)*k)+1);}},Elastic:{In:function(k){var s,a=0.1,p=0.4;if(k===0)return 0;if(k===1)return 1;if(!a||a<1){a=1;s=p / 4;}
else s=p*Math.asin(1 / a)/(2*Math.PI);return-(a*Math.pow(2,10*(k-=1))*Math.sin((k-s)*(2*Math.PI)/ p));},Out:function(k){var s,a=0.1,p=0.4;if(k===0)return 0;if(k===1)return 1;if(!a||a<1){a=1;s=p / 4;}
else s=p*Math.asin(1 / a)/(2*Math.PI);return(a*Math.pow(2,-10*k)*Math.sin((k-s)*(2*Math.PI)/ p)+1);},InOut:function(k){var s,a=0.1,p=0.4;if(k===0)return 0;if(k===1)return 1;if(!a||a<1){a=1;s=p / 4;}
else s=p*Math.asin(1 / a)/(2*Math.PI);if((k*=2)<1)return-0.5*(a*Math.pow(2,10*(k-=1))*Math.sin((k-s)*(2*Math.PI)/ p));return a*Math.pow(2,-10*(k-=1))*Math.sin((k-s)*(2*Math.PI)/ p)*0.5+1;}},Back:{In:function(k){var s=1.70158;return k*k*((s+1)*k-s);},Out:function(k){var s=1.70158;return--k*k*((s+1)*k+s)+1;},InOut:function(k){var s=1.70158*1.525;if((k*=2)<1)return 0.5*(k*k*((s+1)*k-s));return 0.5*((k-=2)*k*((s+1)*k+s)+2);}},Bounce:{In:function(k){return 1-Phaser.Easing.Bounce.Out(1-k);},Out:function(k){if(k<(1 / 2.75)){return 7.5625*k*k;}else if(k<(2 / 2.75)){return 7.5625*(k-=(1.5 / 2.75))*k+0.75;}else if(k<(2.5 / 2.75)){return 7.5625*(k-=(2.25 / 2.75))*k+0.9375;}else{return 7.5625*(k-=(2.625 / 2.75))*k+0.984375;}},InOut:function(k){if(k<0.5)return Phaser.Easing.Bounce.In(k*2)*0.5;return Phaser.Easing.Bounce.Out(k*2-1)*0.5+0.5;}}};Phaser.Easing.Default=Phaser.Easing.Linear.None;Phaser.Easing.Power0=Phaser.Easing.Linear.None;Phaser.Easing.Power1=Phaser.Easing.Quadratic.Out;Phaser.Easing.Power2=Phaser.Easing.Cubic.Out;Phaser.Easing.Power3=Phaser.Easing.Quartic.Out;Phaser.Easing.Power4=Phaser.Easing.Quintic.Out;Phaser.Time=function(game){this.game=game;this.time=0;this.prevTime=0;this.now=0;this.elapsed=0;this.elapsedMS=0;this.physicsElapsed=1 / 60;this.physicsElapsedMS=(1 / 60)*1000;this.desiredFpsMult=1.0 / 60;this._desiredFps=60;this.suggestedFps=this.desiredFps;this.slowMotion=1.0;this.advancedTiming=false;this.frames=0;this.fps=0;this.fpsMin=1000;this.fpsMax=0;this.msMin=1000;this.msMax=0;this.pauseDuration=0;this.timeToCall=0;this.timeExpected=0;this.events=new Phaser.Timer(this.game,false);this._frameCount=0;this._elapsedAccumulator=0;this._started=0;this._timeLastSecond=0;this._pauseStarted=0;this._justResumed=false;this._timers=[];};Phaser.Time.prototype={boot:function(){this._started=Date.now();this.time=Date.now();this.events.start();this.timeExpected=this.time;},add:function(timer){this._timers.push(timer);return timer;},create:function(autoDestroy){if(autoDestroy===undefined){autoDestroy=true;}
var timer=new Phaser.Timer(this.game,autoDestroy);this._timers.push(timer);return timer;},removeAll:function(){for(var i=0;i<this._timers.length;i++)
{this._timers[i].destroy();}
this._timers=[];this.events.removeAll();},refresh:function(){var previousDateNow=this.time;this.time=Date.now();this.elapsedMS=this.time-previousDateNow;},update:function(time){var previousDateNow=this.time;this.time=Date.now();this.elapsedMS=this.time-previousDateNow;this.prevTime=this.now;this.now=time;this.elapsed=this.now-this.prevTime;if(this.game.raf._isSetTimeOut)
{this.timeToCall=Math.floor(Math.max(0,(1000.0 / this._desiredFps)-(this.timeExpected-time)));this.timeExpected=time+this.timeToCall;}
if(this.advancedTiming)
{this.updateAdvancedTiming();}
if(!this.game.paused)
{this.events.update(this.time);if(this._timers.length)
{this.updateTimers();}}},updateTimers:function(){var i=0;var len=this._timers.length;while(i<len)
{if(this._timers[i].update(this.time))
{i++;}
else
{this._timers.splice(i,1);len--;}}},updateAdvancedTiming:function(){this._frameCount++;this._elapsedAccumulator+=this.elapsed;if(this._frameCount>=this._desiredFps*2)
{this.suggestedFps=Math.floor(200 /(this._elapsedAccumulator / this._frameCount))*5;this._frameCount=0;this._elapsedAccumulator=0;}
this.msMin=Math.min(this.msMin,this.elapsed);this.msMax=Math.max(this.msMax,this.elapsed);this.frames++;if(this.now>this._timeLastSecond+1000)
{this.fps=Math.round((this.frames*1000)/(this.now-this._timeLastSecond));this.fpsMin=Math.min(this.fpsMin,this.fps);this.fpsMax=Math.max(this.fpsMax,this.fps);this._timeLastSecond=this.now;this.frames=0;}},gamePaused:function(){this._pauseStarted=Date.now();this.events.pause();var i=this._timers.length;while(i--)
{this._timers[i]._pause();}},gameResumed:function(){this.time=Date.now();this.pauseDuration=this.time-this._pauseStarted;this.events.resume();var i=this._timers.length;while(i--)
{this._timers[i]._resume();}},totalElapsedSeconds:function(){return(this.time-this._started)*0.001;},elapsedSince:function(since){return this.time-since;},elapsedSecondsSince:function(since){return(this.time-since)*0.001;},reset:function(){this._started=this.time;this.removeAll();}};Object.defineProperty(Phaser.Time.prototype,"desiredFps",{get:function(){return this._desiredFps;},set:function(value){this._desiredFps=value;this.physicsElapsed=1 / value;this.physicsElapsedMS=this.physicsElapsed*1000;this.desiredFpsMult=1.0 / value;}});Phaser.Time.prototype.constructor=Phaser.Time;Phaser.Timer=function(game,autoDestroy){if(autoDestroy===undefined){autoDestroy=true;}
this.game=game;this.running=false;this.autoDestroy=autoDestroy;this.expired=false;this.elapsed=0;this.events=[];this.onComplete=new Phaser.Signal();this.nextTick=0;this.timeCap=1000;this.paused=false;this._codePaused=false;this._started=0;this._pauseStarted=0;this._pauseTotal=0;this._now=Date.now();this._len=0;this._marked=0;this._i=0;this._diff=0;this._newTick=0;};Phaser.Timer.MINUTE=60000;Phaser.Timer.SECOND=1000;Phaser.Timer.HALF=500;Phaser.Timer.QUARTER=250;Phaser.Timer.prototype={create:function(delay,loop,repeatCount,callback,callbackContext,args){delay=Math.round(delay);var tick=delay;if(this._now===0)
{tick+=this.game.time.time;}
else
{tick+=this._now;}
var event=new Phaser.TimerEvent(this,delay,tick,repeatCount,loop,callback,callbackContext,args);this.events.push(event);this.order();this.expired=false;return event;},add:function(delay,callback,callbackContext){return this.create(delay,false,0,callback,callbackContext,Array.prototype.slice.call(arguments,3));},repeat:function(delay,repeatCount,callback,callbackContext){return this.create(delay,false,repeatCount,callback,callbackContext,Array.prototype.slice.call(arguments,4));},loop:function(delay,callback,callbackContext){return this.create(delay,true,0,callback,callbackContext,Array.prototype.slice.call(arguments,3));},start:function(delay){if(this.running)
{return;}
this._started=this.game.time.time+(delay||0);this.running=true;for(var i=0;i<this.events.length;i++)
{this.events[i].tick=this.events[i].delay+this._started;}},stop:function(clearEvents){this.running=false;if(clearEvents===undefined){clearEvents=true;}
if(clearEvents)
{this.events.length=0;}},remove:function(event){for(var i=0;i<this.events.length;i++)
{if(this.events[i]===event)
{this.events[i].pendingDelete=true;return true;}}
return false;},order:function(){if(this.events.length>0)
{this.events.sort(this.sortHandler);this.nextTick=this.events[0].tick;}},sortHandler:function(a,b){if(a.tick<b.tick)
{return-1;}
else if(a.tick>b.tick)
{return 1;}
return 0;},clearPendingEvents:function(){this._i=this.events.length;while(this._i--)
{if(this.events[this._i].pendingDelete)
{this.events.splice(this._i,1);}}
this._len=this.events.length;this._i=0;},update:function(time){if(this.paused)
{return true;}
this.elapsed=time-this._now;this._now=time;if(this.elapsed>this.timeCap)
{this.adjustEvents(time-this.elapsed);}
this._marked=0;this.clearPendingEvents();if(this.running&&this._now>=this.nextTick&&this._len>0)
{while(this._i<this._len&&this.running)
{if(this._now>=this.events[this._i].tick&&!this.events[this._i].pendingDelete)
{this._newTick=(this._now+this.events[this._i].delay)-(this._now-this.events[this._i].tick);if(this._newTick<0)
{this._newTick=this._now+this.events[this._i].delay;}
if(this.events[this._i].loop===true)
{this.events[this._i].tick=this._newTick;this.events[this._i].callback.apply(this.events[this._i].callbackContext,this.events[this._i].args);}
else if(this.events[this._i].repeatCount>0)
{this.events[this._i].repeatCount--;this.events[this._i].tick=this._newTick;this.events[this._i].callback.apply(this.events[this._i].callbackContext,this.events[this._i].args);}
else
{this._marked++;this.events[this._i].pendingDelete=true;this.events[this._i].callback.apply(this.events[this._i].callbackContext,this.events[this._i].args);}
this._i++;}
else
{break;}}
if(this.events.length>this._marked)
{this.order();}
else
{this.expired=true;this.onComplete.dispatch(this);}}
if(this.expired&&this.autoDestroy)
{return false;}
else
{return true;}},pause:function(){if(!this.running)
{return;}
this._codePaused=true;if(this.paused)
{return;}
this._pauseStarted=this.game.time.time;this.paused=true;},_pause:function(){if(this.paused||!this.running)
{return;}
this._pauseStarted=this.game.time.time;this.paused=true;},adjustEvents:function(baseTime){for(var i=0;i<this.events.length;i++)
{if(!this.events[i].pendingDelete)
{var t=this.events[i].tick-baseTime;if(t<0)
{t=0;}
this.events[i].tick=this._now+t;}}
var d=this.nextTick-baseTime;if(d<0)
{this.nextTick=this._now;}
else
{this.nextTick=this._now+d;}},resume:function(){if(!this.paused)
{return;}
var now=this.game.time.time;this._pauseTotal+=now-this._now;this._now=now;this.adjustEvents(this._pauseStarted);this.paused=false;this._codePaused=false;},_resume:function(){if(this._codePaused)
{return;}
else
{this.resume();}},removeAll:function(){this.onComplete.removeAll();this.events.length=0;this._len=0;this._i=0;},destroy:function(){this.onComplete.removeAll();this.running=false;this.events=[];this._len=0;this._i=0;}};Object.defineProperty(Phaser.Timer.prototype,"next",{get:function(){return this.nextTick;}});Object.defineProperty(Phaser.Timer.prototype,"duration",{get:function(){if(this.running&&this.nextTick>this._now)
{return this.nextTick-this._now;}
else
{return 0;}}});Object.defineProperty(Phaser.Timer.prototype,"length",{get:function(){return this.events.length;}});Object.defineProperty(Phaser.Timer.prototype,"ms",{get:function(){if(this.running)
{return this._now-this._started-this._pauseTotal;}
else
{return 0;}}});Object.defineProperty(Phaser.Timer.prototype,"seconds",{get:function(){if(this.running)
{return this.ms*0.001;}
else
{return 0;}}});Phaser.Timer.prototype.constructor=Phaser.Timer;Phaser.TimerEvent=function(timer,delay,tick,repeatCount,loop,callback,callbackContext,args){this.timer=timer;this.delay=delay;this.tick=tick;this.repeatCount=repeatCount-1;this.loop=loop;this.callback=callback;this.callbackContext=callbackContext;this.args=args;this.pendingDelete=false;};Phaser.TimerEvent.prototype.constructor=Phaser.TimerEvent;Phaser.AnimationManager=function(sprite){this.sprite=sprite;this.game=sprite.game;this.currentFrame=null;this.currentAnim=null;this.updateIfVisible=true;this.isLoaded=false;this._frameData=null;this._anims={};this._outputFrames=[];};Phaser.AnimationManager.prototype={loadFrameData:function(frameData,frame){if(frameData===undefined)
{return false;}
if(this.isLoaded)
{for(var anim in this._anims)
{this._anims[anim].updateFrameData(frameData);}}
this._frameData=frameData;if(frame===undefined||frame===null)
{this.frame=0;}
else
{if(typeof frame==='string')
{this.frameName=frame;}
else
{this.frame=frame;}}
this.isLoaded=true;return true;},copyFrameData:function(frameData,frame){this._frameData=frameData.clone();if(this.isLoaded)
{for(var anim in this._anims)
{this._anims[anim].updateFrameData(this._frameData);}}
if(frame===undefined||frame===null)
{this.frame=0;}
else
{if(typeof frame==='string')
{this.frameName=frame;}
else
{this.frame=frame;}}
this.isLoaded=true;return true;},add:function(name,frames,frameRate,loop,useNumericIndex){frames=frames||[];frameRate=frameRate||60;if(loop===undefined){loop=false;}
if(useNumericIndex===undefined)
{if(frames&&typeof frames[0]==='number')
{useNumericIndex=true;}
else
{useNumericIndex=false;}}
this._outputFrames=[];this._frameData.getFrameIndexes(frames,useNumericIndex,this._outputFrames);this._anims[name]=new Phaser.Animation(this.game,this.sprite,name,this._frameData,this._outputFrames,frameRate,loop);this.currentAnim=this._anims[name];if(this.sprite.tilingTexture)
{this.sprite.refreshTexture=true;}
return this._anims[name];},validateFrames:function(frames,useNumericIndex){if(useNumericIndex===undefined){useNumericIndex=true;}
for(var i=0;i<frames.length;i++)
{if(useNumericIndex===true)
{if(frames[i]>this._frameData.total)
{return false;}}
else
{if(this._frameData.checkFrameName(frames[i])===false)
{return false;}}}
return true;},play:function(name,frameRate,loop,killOnComplete){if(this._anims[name])
{if(this.currentAnim===this._anims[name])
{if(this.currentAnim.isPlaying===false)
{this.currentAnim.paused=false;return this.currentAnim.play(frameRate,loop,killOnComplete);}
return this.currentAnim;}
else
{if(this.currentAnim&&this.currentAnim.isPlaying)
{this.currentAnim.stop();}
this.currentAnim=this._anims[name];this.currentAnim.paused=false;this.currentFrame=this.currentAnim.currentFrame;return this.currentAnim.play(frameRate,loop,killOnComplete);}}},stop:function(name,resetFrame){if(resetFrame===undefined){resetFrame=false;}
if(typeof name==='string')
{if(this._anims[name])
{this.currentAnim=this._anims[name];this.currentAnim.stop(resetFrame);}}
else
{if(this.currentAnim)
{this.currentAnim.stop(resetFrame);}}},update:function(){if(this.updateIfVisible&&!this.sprite.visible)
{return false;}
if(this.currentAnim&&this.currentAnim.update())
{this.currentFrame=this.currentAnim.currentFrame;return true;}
return false;},next:function(quantity){if(this.currentAnim)
{this.currentAnim.next(quantity);this.currentFrame=this.currentAnim.currentFrame;}},previous:function(quantity){if(this.currentAnim)
{this.currentAnim.previous(quantity);this.currentFrame=this.currentAnim.currentFrame;}},getAnimation:function(name){if(typeof name==='string')
{if(this._anims[name])
{return this._anims[name];}}
return null;},refreshFrame:function(){this.sprite.setTexture(PIXI.TextureCache[this.currentFrame.uuid]);},destroy:function(){var anim=null;for(var anim in this._anims)
{if(this._anims.hasOwnProperty(anim))
{this._anims[anim].destroy();}}
this._anims={};this._outputFrames=[];this._frameData=null;this.currentAnim=null;this.currentFrame=null;this.sprite=null;this.game=null;}};Phaser.AnimationManager.prototype.constructor=Phaser.AnimationManager;Object.defineProperty(Phaser.AnimationManager.prototype,'frameData',{get:function(){return this._frameData;}});Object.defineProperty(Phaser.AnimationManager.prototype,'frameTotal',{get:function(){return this._frameData.total;}});Object.defineProperty(Phaser.AnimationManager.prototype,'paused',{get:function(){return this.currentAnim.isPaused;},set:function(value){this.currentAnim.paused=value;}});Object.defineProperty(Phaser.AnimationManager.prototype,'name',{get:function(){if(this.currentAnim)
{return this.currentAnim.name;}}});Object.defineProperty(Phaser.AnimationManager.prototype,'frame',{get:function(){if(this.currentFrame)
{return this.currentFrame.index;}},set:function(value){if(typeof value==='number'&&this._frameData&&this._frameData.getFrame(value)!==null)
{this.currentFrame=this._frameData.getFrame(value);if(this.currentFrame)
{this.sprite.setFrame(this.currentFrame);}}}});Object.defineProperty(Phaser.AnimationManager.prototype,'frameName',{get:function(){if(this.currentFrame)
{return this.currentFrame.name;}},set:function(value){if(typeof value==='string'&&this._frameData&&this._frameData.getFrameByName(value)!==null)
{this.currentFrame=this._frameData.getFrameByName(value);if(this.currentFrame)
{this._frameIndex=this.currentFrame.index;this.sprite.setFrame(this.currentFrame);}}
else
{console.warn('Cannot set frameName: '+value);}}});Phaser.Animation=function(game,parent,name,frameData,frames,frameRate,loop){if(loop===undefined){loop=false;}
this.game=game;this._parent=parent;this._frameData=frameData;this.name=name;this._frames=[];this._frames=this._frames.concat(frames);this.delay=1000 / frameRate;this.loop=loop;this.loopCount=0;this.killOnComplete=false;this.isFinished=false;this.isPlaying=false;this.isPaused=false;this._pauseStartTime=0;this._frameIndex=0;this._frameDiff=0;this._frameSkip=1;this.currentFrame=this._frameData.getFrame(this._frames[this._frameIndex]);this.onStart=new Phaser.Signal();this.onUpdate=null;this.onComplete=new Phaser.Signal();this.onLoop=new Phaser.Signal();this.game.onPause.add(this.onPause,this);this.game.onResume.add(this.onResume,this);};Phaser.Animation.prototype={play:function(frameRate,loop,killOnComplete){if(typeof frameRate==='number')
{this.delay=1000 / frameRate;}
if(typeof loop==='boolean')
{this.loop=loop;}
if(typeof killOnComplete!=='undefined')
{this.killOnComplete=killOnComplete;}
this.isPlaying=true;this.isFinished=false;this.paused=false;this.loopCount=0;this._timeLastFrame=this.game.time.time;this._timeNextFrame=this.game.time.time+this.delay;this._frameIndex=0;this.updateCurrentFrame(false,true);this._parent.events.onAnimationStart$dispatch(this._parent,this);this.onStart.dispatch(this._parent,this);this._parent.animations.currentAnim=this;this._parent.animations.currentFrame=this.currentFrame;return this;},restart:function(){this.isPlaying=true;this.isFinished=false;this.paused=false;this.loopCount=0;this._timeLastFrame=this.game.time.time;this._timeNextFrame=this.game.time.time+this.delay;this._frameIndex=0;this.currentFrame=this._frameData.getFrame(this._frames[this._frameIndex]);this._parent.setFrame(this.currentFrame);this._parent.animations.currentAnim=this;this._parent.animations.currentFrame=this.currentFrame;this.onStart.dispatch(this._parent,this);},setFrame:function(frameId,useLocalFrameIndex){var frameIndex;if(useLocalFrameIndex===undefined)
{useLocalFrameIndex=false;}
if(typeof frameId==="string")
{for(var i=0;i<this._frames.length;i++)
{if(this._frameData.getFrame(this._frames[i]).name===frameId)
{frameIndex=i;}}}
else if(typeof frameId==="number")
{if(useLocalFrameIndex)
{frameIndex=frameId;}
else
{for(var i=0;i<this._frames.length;i++)
{if(this._frames[i]===frameIndex)
{frameIndex=i;}}}}
if(frameIndex)
{this._frameIndex=frameIndex-1;this._timeNextFrame=this.game.time.time;this.update();}},stop:function(resetFrame,dispatchComplete){if(resetFrame===undefined){resetFrame=false;}
if(dispatchComplete===undefined){dispatchComplete=false;}
this.isPlaying=false;this.isFinished=true;this.paused=false;if(resetFrame)
{this.currentFrame=this._frameData.getFrame(this._frames[0]);this._parent.setFrame(this.currentFrame);}
if(dispatchComplete)
{this._parent.events.onAnimationComplete$dispatch(this._parent,this);this.onComplete.dispatch(this._parent,this);}},onPause:function(){if(this.isPlaying)
{this._frameDiff=this._timeNextFrame-this.game.time.time;}},onResume:function(){if(this.isPlaying)
{this._timeNextFrame=this.game.time.time+this._frameDiff;}},update:function(){if(this.isPaused)
{return false;}
if(this.isPlaying&&this.game.time.time>=this._timeNextFrame)
{this._frameSkip=1;this._frameDiff=this.game.time.time-this._timeNextFrame;this._timeLastFrame=this.game.time.time;if(this._frameDiff>this.delay)
{this._frameSkip=Math.floor(this._frameDiff / this.delay);this._frameDiff-=(this._frameSkip*this.delay);}
this._timeNextFrame=this.game.time.time+(this.delay-this._frameDiff);this._frameIndex+=this._frameSkip;if(this._frameIndex>=this._frames.length)
{if(this.loop)
{this._frameIndex%=this._frames.length;this.currentFrame=this._frameData.getFrame(this._frames[this._frameIndex]);if(this.currentFrame)
{this._parent.setFrame(this.currentFrame);}
this.loopCount++;this._parent.events.onAnimationLoop$dispatch(this._parent,this);this.onLoop.dispatch(this._parent,this);if(this.onUpdate)
{this.onUpdate.dispatch(this,this.currentFrame);return!!this._frameData;}
else
{return true;}}
else
{this.complete();return false;}}
else
{return this.updateCurrentFrame(true);}}
return false;},updateCurrentFrame:function(signalUpdate,fromPlay){if(fromPlay===undefined){fromPlay=false;}
if(!this._frameData)
{return false;}
var idx=this.currentFrame.index;this.currentFrame=this._frameData.getFrame(this._frames[this._frameIndex]);if(this.currentFrame&&(fromPlay||(!fromPlay&&idx!==this.currentFrame.index)))
{this._parent.setFrame(this.currentFrame);}
if(this.onUpdate&&signalUpdate)
{this.onUpdate.dispatch(this,this.currentFrame);return!!this._frameData;}
else
{return true;}},next:function(quantity){if(quantity===undefined){quantity=1;}
var frame=this._frameIndex+quantity;if(frame>=this._frames.length)
{if(this.loop)
{frame%=this._frames.length;}
else
{frame=this._frames.length-1;}}
if(frame!==this._frameIndex)
{this._frameIndex=frame;this.updateCurrentFrame(true);}},previous:function(quantity){if(quantity===undefined){quantity=1;}
var frame=this._frameIndex-quantity;if(frame<0)
{if(this.loop)
{frame=this._frames.length+frame;}
else
{frame++;}}
if(frame!==this._frameIndex)
{this._frameIndex=frame;this.updateCurrentFrame(true);}},updateFrameData:function(frameData){this._frameData=frameData;this.currentFrame=this._frameData?this._frameData.getFrame(this._frames[this._frameIndex%this._frames.length]):null;},destroy:function(){if(!this._frameData)
{return;}
this.game.onPause.remove(this.onPause,this);this.game.onResume.remove(this.onResume,this);this.game=null;this._parent=null;this._frames=null;this._frameData=null;this.currentFrame=null;this.isPlaying=false;this.onStart.dispose();this.onLoop.dispose();this.onComplete.dispose();if(this.onUpdate)
{this.onUpdate.dispose();}},complete:function(){this._frameIndex=this._frames.length-1;this.currentFrame=this._frameData.getFrame(this._frames[this._frameIndex]);this.isPlaying=false;this.isFinished=true;this.paused=false;this._parent.events.onAnimationComplete$dispatch(this._parent,this);this.onComplete.dispatch(this._parent,this);if(this.killOnComplete)
{this._parent.kill();}}};Phaser.Animation.prototype.constructor=Phaser.Animation;Object.defineProperty(Phaser.Animation.prototype,'paused',{get:function(){return this.isPaused;},set:function(value){this.isPaused=value;if(value)
{this._pauseStartTime=this.game.time.time;}
else
{if(this.isPlaying)
{this._timeNextFrame=this.game.time.time+this.delay;}}}});Object.defineProperty(Phaser.Animation.prototype,'frameTotal',{get:function(){return this._frames.length;}});Object.defineProperty(Phaser.Animation.prototype,'frame',{get:function(){if(this.currentFrame!==null)
{return this.currentFrame.index;}
else
{return this._frameIndex;}},set:function(value){this.currentFrame=this._frameData.getFrame(this._frames[value]);if(this.currentFrame!==null)
{this._frameIndex=value;this._parent.setFrame(this.currentFrame);if(this.onUpdate)
{this.onUpdate.dispatch(this,this.currentFrame);}}}});Object.defineProperty(Phaser.Animation.prototype,'speed',{get:function(){return Math.round(1000 / this.delay);},set:function(value){if(value>=1)
{this.delay=1000 / value;}}});Object.defineProperty(Phaser.Animation.prototype,'enableUpdate',{get:function(){return(this.onUpdate!==null);},set:function(value){if(value&&this.onUpdate===null)
{this.onUpdate=new Phaser.Signal();}
else if(!value&&this.onUpdate!==null)
{this.onUpdate.dispose();this.onUpdate=null;}}});Phaser.Animation.generateFrameNames=function(prefix,start,stop,suffix,zeroPad){if(suffix===undefined){suffix='';}
var output=[];var frame='';if(start<stop)
{for(var i=start;i<=stop;i++)
{if(typeof zeroPad==='number')
{frame=Phaser.Utils.pad(i.toString(),zeroPad,'0',1);}
else
{frame=i.toString();}
frame=prefix+frame+suffix;output.push(frame);}}
else
{for(var i=start;i>=stop;i--)
{if(typeof zeroPad==='number')
{frame=Phaser.Utils.pad(i.toString(),zeroPad,'0',1);}
else
{frame=i.toString();}
frame=prefix+frame+suffix;output.push(frame);}}
return output;};Phaser.Frame=function(index,x,y,width,height,name){this.index=index;this.x=x;this.y=y;this.width=width;this.height=height;this.name=name;this.centerX=Math.floor(width / 2);this.centerY=Math.floor(height / 2);this.distance=Phaser.Math.distance(0,0,width,height);this.rotated=false;this.rotationDirection='cw';this.trimmed=false;this.sourceSizeW=width;this.sourceSizeH=height;this.spriteSourceSizeX=0;this.spriteSourceSizeY=0;this.spriteSourceSizeW=0;this.spriteSourceSizeH=0;this.right=this.x+this.width;this.bottom=this.y+this.height;};Phaser.Frame.prototype={resize:function(width,height){this.width=width;this.height=height;this.centerX=Math.floor(width / 2);this.centerY=Math.floor(height / 2);this.distance=Phaser.Math.distance(0,0,width,height);this.sourceSizeW=width;this.sourceSizeH=height;this.right=this.x+width;this.bottom=this.y+height;},setTrim:function(trimmed,actualWidth,actualHeight,destX,destY,destWidth,destHeight){this.trimmed=trimmed;if(trimmed)
{this.sourceSizeW=actualWidth;this.sourceSizeH=actualHeight;this.centerX=Math.floor(actualWidth / 2);this.centerY=Math.floor(actualHeight / 2);this.spriteSourceSizeX=destX;this.spriteSourceSizeY=destY;this.spriteSourceSizeW=destWidth;this.spriteSourceSizeH=destHeight;}},clone:function(){var output=new Phaser.Frame(this.index,this.x,this.y,this.width,this.height,this.name);for(var prop in this)
{if(this.hasOwnProperty(prop))
{output[prop]=this[prop];}}
return output;},getRect:function(out){if(out===undefined)
{out=new Phaser.Rectangle(this.x,this.y,this.width,this.height);}
else
{out.setTo(this.x,this.y,this.width,this.height);}
return out;}};Phaser.Frame.prototype.constructor=Phaser.Frame;Phaser.FrameData=function(){this._frames=[];this._frameNames=[];};Phaser.FrameData.prototype={addFrame:function(frame){frame.index=this._frames.length;this._frames.push(frame);if(frame.name!=='')
{this._frameNames[frame.name]=frame.index;}
return frame;},getFrame:function(index){if(index>=this._frames.length)
{index=0;}
return this._frames[index];},getFrameByName:function(name){if(typeof this._frameNames[name]==='number')
{return this._frames[this._frameNames[name]];}
return null;},checkFrameName:function(name){if(this._frameNames[name]==null)
{return false;}
return true;},clone:function(){var output=new Phaser.FrameData();for(var i=0;i<this._frames.length;i++)
{output._frames.push(this._frames[i].clone());}
for(var p in this._frameNames)
{if(this._frameNames.hasOwnProperty(p))
{output._frameNames.push(this._frameNames[p]);}}
return output;},getFrameRange:function(start,end,output){if(output===undefined){output=[];}
for(var i=start;i<=end;i++)
{output.push(this._frames[i]);}
return output;},getFrames:function(frames,useNumericIndex,output){if(useNumericIndex===undefined){useNumericIndex=true;}
if(output===undefined){output=[];}
if(frames===undefined||frames.length===0)
{for(var i=0;i<this._frames.length;i++)
{output.push(this._frames[i]);}}
else
{for(var i=0;i<frames.length;i++)
{if(useNumericIndex)
{output.push(this.getFrame(frames[i]));}
else
{output.push(this.getFrameByName(frames[i]));}}}
return output;},getFrameIndexes:function(frames,useNumericIndex,output){if(useNumericIndex===undefined){useNumericIndex=true;}
if(output===undefined){output=[];}
if(frames===undefined||frames.length===0)
{for(var i=0;i<this._frames.length;i++)
{output.push(this._frames[i].index);}}
else
{for(var i=0;i<frames.length;i++)
{if(useNumericIndex)
{output.push(this._frames[frames[i]].index);}
else
{if(this.getFrameByName(frames[i]))
{output.push(this.getFrameByName(frames[i]).index);}}}}
return output;}};Phaser.FrameData.prototype.constructor=Phaser.FrameData;Object.defineProperty(Phaser.FrameData.prototype,"total",{get:function(){return this._frames.length;}});Phaser.AnimationParser={spriteSheet:function(game,key,frameWidth,frameHeight,frameMax,margin,spacing){var img=key;if(typeof key==='string')
{img=game.cache.getImage(key);}
if(img===null)
{return null;}
var width=img.width;var height=img.height;if(frameWidth<=0)
{frameWidth=Math.floor(-width / Math.min(-1,frameWidth));}
if(frameHeight<=0)
{frameHeight=Math.floor(-height / Math.min(-1,frameHeight));}
var row=Math.floor((width-margin)/(frameWidth+spacing));var column=Math.floor((height-margin)/(frameHeight+spacing));var total=row*column;if(frameMax!==-1)
{total=frameMax;}
if(width===0||height===0||width<frameWidth||height<frameHeight||total===0)
{console.warn("Phaser.AnimationParser.spriteSheet: '"+key+"'s width/height zero or width/height < given frameWidth/frameHeight");return null;}
var data=new Phaser.FrameData();var x=margin;var y=margin;for(var i=0;i<total;i++)
{data.addFrame(new Phaser.Frame(i,x,y,frameWidth,frameHeight,''));x+=frameWidth+spacing;if(x+frameWidth>width)
{x=margin;y+=frameHeight+spacing;}}
return data;},JSONData:function(game,json){if(!json['frames'])
{console.warn("Phaser.AnimationParser.JSONData: Invalid Texture Atlas JSON given, missing 'frames' array");console.log(json);return;}
var data=new Phaser.FrameData();var frames=json['frames'];var newFrame;for(var i=0;i<frames.length;i++)
{newFrame=data.addFrame(new Phaser.Frame(i,frames[i].frame.x,frames[i].frame.y,frames[i].frame.w,frames[i].frame.h,frames[i].filename));if(frames[i].trimmed)
{newFrame.setTrim(frames[i].trimmed,frames[i].sourceSize.w,frames[i].sourceSize.h,frames[i].spriteSourceSize.x,frames[i].spriteSourceSize.y,frames[i].spriteSourceSize.w,frames[i].spriteSourceSize.h);}}
return data;},JSONDataPyxel:function(game,json){var signature=['layers','tilewidth','tileheight','tileswide','tileshigh'];signature.forEach(function(key){if(!json[key])
{console.warn("Phaser.AnimationParser.JSONDataPyxel: Invalid Pyxel Tilemap JSON given, missing '"+key+"' key.");console.log(json);return;}});if(json['layers'].length!=1){console.warn("Phaser.AnimationParser.JSONDataPyxel: Too many layers, this parser only supports flat Tilemaps.");console.log(json);return;}
var data=new Phaser.FrameData();var tileheight=json['tileheight'];var tilewidth=json['tilewidth'];var frames=json['layers'][0]['tiles'];var newFrame;for(var i=0;i<frames.length;i++)
{newFrame=data.addFrame(new Phaser.Frame(i,frames[i].x,frames[i].y,tilewidth,tileheight,"frame_"+i));newFrame.setTrim(false);}
return data;},JSONDataHash:function(game,json){if(!json['frames'])
{console.warn("Phaser.AnimationParser.JSONDataHash: Invalid Texture Atlas JSON given, missing 'frames' object");console.log(json);return;}
var data=new Phaser.FrameData();var frames=json['frames'];var newFrame;var i=0;for(var key in frames)
{newFrame=data.addFrame(new Phaser.Frame(i,frames[key].frame.x,frames[key].frame.y,frames[key].frame.w,frames[key].frame.h,key));if(frames[key].trimmed)
{newFrame.setTrim(frames[key].trimmed,frames[key].sourceSize.w,frames[key].sourceSize.h,frames[key].spriteSourceSize.x,frames[key].spriteSourceSize.y,frames[key].spriteSourceSize.w,frames[key].spriteSourceSize.h);}
i++;}
return data;},XMLData:function(game,xml){if(!xml.getElementsByTagName('TextureAtlas'))
{console.warn("Phaser.AnimationParser.XMLData: Invalid Texture Atlas XML given, missing <TextureAtlas> tag");return;}
var data=new Phaser.FrameData();var frames=xml.getElementsByTagName('SubTexture');var newFrame;var name;var frame;var x;var y;var width;var height;var frameX;var frameY;var frameWidth;var frameHeight;for(var i=0;i<frames.length;i++)
{frame=frames[i].attributes;name=frame.name.value;x=parseInt(frame.x.value,10);y=parseInt(frame.y.value,10);width=parseInt(frame.width.value,10);height=parseInt(frame.height.value,10);frameX=null;frameY=null;if(frame.frameX)
{frameX=Math.abs(parseInt(frame.frameX.value,10));frameY=Math.abs(parseInt(frame.frameY.value,10));frameWidth=parseInt(frame.frameWidth.value,10);frameHeight=parseInt(frame.frameHeight.value,10);}
newFrame=data.addFrame(new Phaser.Frame(i,x,y,width,height,name));if(frameX!==null||frameY!==null)
{newFrame.setTrim(true,width,height,frameX,frameY,frameWidth,frameHeight);}}
return data;}};Phaser.Cache=function(game){this.game=game;this.autoResolveURL=false;this._cache={canvas:{},image:{},texture:{},sound:{},video:{},text:{},json:{},xml:{},physics:{},tilemap:{},binary:{},bitmapData:{},bitmapFont:{},shader:{},renderTexture:{}};this._urlMap={};this._urlResolver=new Image();this._urlTemp=null;this.onSoundUnlock=new Phaser.Signal();this._cacheMap=[];this._cacheMap[Phaser.Cache.CANVAS]=this._cache.canvas;this._cacheMap[Phaser.Cache.IMAGE]=this._cache.image;this._cacheMap[Phaser.Cache.TEXTURE]=this._cache.texture;this._cacheMap[Phaser.Cache.SOUND]=this._cache.sound;this._cacheMap[Phaser.Cache.TEXT]=this._cache.text;this._cacheMap[Phaser.Cache.PHYSICS]=this._cache.physics;this._cacheMap[Phaser.Cache.TILEMAP]=this._cache.tilemap;this._cacheMap[Phaser.Cache.BINARY]=this._cache.binary;this._cacheMap[Phaser.Cache.BITMAPDATA]=this._cache.bitmapData;this._cacheMap[Phaser.Cache.BITMAPFONT]=this._cache.bitmapFont;this._cacheMap[Phaser.Cache.JSON]=this._cache.json;this._cacheMap[Phaser.Cache.XML]=this._cache.xml;this._cacheMap[Phaser.Cache.VIDEO]=this._cache.video;this._cacheMap[Phaser.Cache.SHADER]=this._cache.shader;this._cacheMap[Phaser.Cache.RENDER_TEXTURE]=this._cache.renderTexture;this.addDefaultImage();this.addMissingImage();};Phaser.Cache.CANVAS=1;Phaser.Cache.IMAGE=2;Phaser.Cache.TEXTURE=3;Phaser.Cache.SOUND=4;Phaser.Cache.TEXT=5;Phaser.Cache.PHYSICS=6;Phaser.Cache.TILEMAP=7;Phaser.Cache.BINARY=8;Phaser.Cache.BITMAPDATA=9;Phaser.Cache.BITMAPFONT=10;Phaser.Cache.JSON=11;Phaser.Cache.XML=12;Phaser.Cache.VIDEO=13;Phaser.Cache.SHADER=14;Phaser.Cache.RENDER_TEXTURE=15;Phaser.Cache.prototype={addCanvas:function(key,canvas,context){if(context===undefined){context=canvas.getContext('2d');}
this._cache.canvas[key]={canvas:canvas,context:context};},addImage:function(key,url,data){if(this.checkImageKey(key))
{this.removeImage(key);}
var img={key:key,url:url,data:data,base:new PIXI.BaseTexture(data),frame:new Phaser.Frame(0,0,0,data.width,data.height,key),frameData:new Phaser.FrameData()};img.frameData.addFrame(new Phaser.Frame(0,0,0,data.width,data.height,url));this._cache.image[key]=img;this._resolveURL(url,img);return img;},addDefaultImage:function(){var img=new Image();img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==";var obj=this.addImage('__default',null,img);obj.base.skipRender=true;PIXI.TextureCache['__default']=new PIXI.Texture(obj.base);},addMissingImage:function(){var img=new Image();img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==";var obj=this.addImage('__missing',null,img);PIXI.TextureCache['__missing']=new PIXI.Texture(obj.base);},addSound:function(key,url,data,webAudio,audioTag){if(webAudio===undefined){webAudio=true;audioTag=false;}
if(audioTag===undefined){webAudio=false;audioTag=true;}
var decoded=false;if(audioTag)
{decoded=true;}
this._cache.sound[key]={url:url,data:data,isDecoding:false,decoded:decoded,webAudio:webAudio,audioTag:audioTag,locked:this.game.sound.touchLocked};this._resolveURL(url,this._cache.sound[key]);},addText:function(key,url,data){this._cache.text[key]={url:url,data:data};this._resolveURL(url,this._cache.text[key]);},addPhysicsData:function(key,url,JSONData,format){this._cache.physics[key]={url:url,data:JSONData,format:format};this._resolveURL(url,this._cache.physics[key]);},addTilemap:function(key,url,mapData,format){this._cache.tilemap[key]={url:url,data:mapData,format:format};this._resolveURL(url,this._cache.tilemap[key]);},addBinary:function(key,binaryData){this._cache.binary[key]=binaryData;},addBitmapData:function(key,bitmapData,frameData){bitmapData.key=key;if(frameData===undefined)
{frameData=new Phaser.FrameData();frameData.addFrame(bitmapData.textureFrame);}
this._cache.bitmapData[key]={data:bitmapData,frameData:frameData};return bitmapData;},addBitmapFont:function(key,url,data,atlasData,atlasType,xSpacing,ySpacing){var obj={url:url,data:data,font:null,base:new PIXI.BaseTexture(data)};if(xSpacing===undefined){xSpacing=0;}
if(ySpacing===undefined){ySpacing=0;}
if(atlasType==='json')
{obj.font=Phaser.LoaderParser.jsonBitmapFont(atlasData,obj.base,xSpacing,ySpacing);}
else
{obj.font=Phaser.LoaderParser.xmlBitmapFont(atlasData,obj.base,xSpacing,ySpacing);}
this._cache.bitmapFont[key]=obj;this._resolveURL(url,obj);},addJSON:function(key,url,data){this._cache.json[key]={url:url,data:data};this._resolveURL(url,this._cache.json[key]);},addXML:function(key,url,data){this._cache.xml[key]={url:url,data:data};this._resolveURL(url,this._cache.xml[key]);},addVideo:function(key,url,data,isBlob){this._cache.video[key]={url:url,data:data,isBlob:isBlob,locked:true};this._resolveURL(url,this._cache.video[key]);},addShader:function(key,url,data){this._cache.shader[key]={url:url,data:data};this._resolveURL(url,this._cache.shader[key]);},addRenderTexture:function(key,texture){this._cache.renderTexture[key]={texture:texture,frame:new Phaser.Frame(0,0,0,texture.width,texture.height,'','')};},addSpriteSheet:function(key,url,data,frameWidth,frameHeight,frameMax,margin,spacing){if(frameMax===undefined){frameMax=-1;}
if(margin===undefined){margin=0;}
if(spacing===undefined){spacing=0;}
var obj={key:key,url:url,data:data,frameWidth:frameWidth,frameHeight:frameHeight,margin:margin,spacing:spacing,base:new PIXI.BaseTexture(data),frameData:Phaser.AnimationParser.spriteSheet(this.game,data,frameWidth,frameHeight,frameMax,margin,spacing)};this._cache.image[key]=obj;this._resolveURL(url,obj);},addTextureAtlas:function(key,url,data,atlasData,format){var obj={key:key,url:url,data:data,base:new PIXI.BaseTexture(data)};if(format===Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
{obj.frameData=Phaser.AnimationParser.XMLData(this.game,atlasData,key);}
else if(format===Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL)
{obj.frameData=Phaser.AnimationParser.JSONDataPyxel(this.game,atlasData,key);}
else
{if(Array.isArray(atlasData.frames))
{obj.frameData=Phaser.AnimationParser.JSONData(this.game,atlasData,key);}
else
{obj.frameData=Phaser.AnimationParser.JSONDataHash(this.game,atlasData,key);}}
this._cache.image[key]=obj;this._resolveURL(url,obj);},reloadSound:function(key){var _this=this;var sound=this.getSound(key);if(sound)
{sound.data.src=sound.url;sound.data.addEventListener('canplaythrough',function(){return _this.reloadSoundComplete(key);},false);sound.data.load();}},reloadSoundComplete:function(key){var sound=this.getSound(key);if(sound)
{sound.locked=false;this.onSoundUnlock.dispatch(key);}},updateSound:function(key,property,value){var sound=this.getSound(key);if(sound)
{sound[property]=value;}},decodedSound:function(key,data){var sound=this.getSound(key);sound.data=data;sound.decoded=true;sound.isDecoding=false;},isSoundDecoded:function(key){var sound=this.getItem(key,Phaser.Cache.SOUND,'isSoundDecoded');if(sound)
{return sound.decoded;}},isSoundReady:function(key){var sound=this.getItem(key,Phaser.Cache.SOUND,'isSoundDecoded');if(sound)
{return(sound.decoded&&!this.game.sound.touchLocked);}},checkKey:function(cache,key){if(this._cacheMap[cache][key])
{return true;}
return false;},checkURL:function(url){if(this._urlMap[this._resolveURL(url)])
{return true;}
return false;},checkCanvasKey:function(key){return this.checkKey(Phaser.Cache.CANVAS,key);},checkImageKey:function(key){return this.checkKey(Phaser.Cache.IMAGE,key);},checkTextureKey:function(key){return this.checkKey(Phaser.Cache.TEXTURE,key);},checkSoundKey:function(key){return this.checkKey(Phaser.Cache.SOUND,key);},checkTextKey:function(key){return this.checkKey(Phaser.Cache.TEXT,key);},checkPhysicsKey:function(key){return this.checkKey(Phaser.Cache.PHYSICS,key);},checkTilemapKey:function(key){return this.checkKey(Phaser.Cache.TILEMAP,key);},checkBinaryKey:function(key){return this.checkKey(Phaser.Cache.BINARY,key);},checkBitmapDataKey:function(key){return this.checkKey(Phaser.Cache.BITMAPDATA,key);},checkBitmapFontKey:function(key){return this.checkKey(Phaser.Cache.BITMAPFONT,key);},checkJSONKey:function(key){return this.checkKey(Phaser.Cache.JSON,key);},checkXMLKey:function(key){return this.checkKey(Phaser.Cache.XML,key);},checkVideoKey:function(key){return this.checkKey(Phaser.Cache.VIDEO,key);},checkShaderKey:function(key){return this.checkKey(Phaser.Cache.SHADER,key);},checkRenderTextureKey:function(key){return this.checkKey(Phaser.Cache.RENDER_TEXTURE,key);},getItem:function(key,cache,method,property){if(!this.checkKey(cache,key))
{if(method)
{console.warn('Phaser.Cache.'+method+': Key "'+key+'" not found in Cache.');}}
else
{if(property===undefined)
{return this._cacheMap[cache][key];}
else
{return this._cacheMap[cache][key][property];}}
return null;},getCanvas:function(key){return this.getItem(key,Phaser.Cache.CANVAS,'getCanvas','canvas');},getImage:function(key,full){if(key===undefined||key===null)
{key='__default';}
if(full===undefined){full=false;}
var img=this.getItem(key,Phaser.Cache.IMAGE,'getImage');if(img===null)
{img=this.getItem('__missing',Phaser.Cache.IMAGE,'getImage');}
if(full)
{return img;}
else
{return img.data;}},getTextureFrame:function(key){return this.getItem(key,Phaser.Cache.TEXTURE,'getTextureFrame','frame');},getSound:function(key){return this.getItem(key,Phaser.Cache.SOUND,'getSound');},getSoundData:function(key){return this.getItem(key,Phaser.Cache.SOUND,'getSoundData','data');},getText:function(key){return this.getItem(key,Phaser.Cache.TEXT,'getText','data');},getPhysicsData:function(key,object,fixtureKey){var data=this.getItem(key,Phaser.Cache.PHYSICS,'getPhysicsData','data');if(data===null||object===undefined||object===null)
{return data;}
else
{if(data[object])
{var fixtures=data[object];if(fixtures&&fixtureKey)
{for(var fixture in fixtures)
{fixture=fixtures[fixture];if(fixture.fixtureKey===fixtureKey)
{return fixture;}}
console.warn('Phaser.Cache.getPhysicsData: Could not find given fixtureKey: "'+fixtureKey+' in '+key+'"');}
else
{return fixtures;}}
else
{console.warn('Phaser.Cache.getPhysicsData: Invalid key/object: "'+key+' / '+object+'"');}}
return null;},getTilemapData:function(key){return this.getItem(key,Phaser.Cache.TILEMAP,'getTilemapData');},getBinary:function(key){return this.getItem(key,Phaser.Cache.BINARY,'getBinary');},getBitmapData:function(key){return this.getItem(key,Phaser.Cache.BITMAPDATA,'getBitmapData','data');},getBitmapFont:function(key){return this.getItem(key,Phaser.Cache.BITMAPFONT,'getBitmapFont');},getJSON:function(key,clone){var data=this.getItem(key,Phaser.Cache.JSON,'getJSON','data');if(data)
{if(clone)
{return Phaser.Utils.extend(true,data);}
else
{return data;}}
else
{return null;}},getXML:function(key){return this.getItem(key,Phaser.Cache.XML,'getXML','data');},getVideo:function(key){return this.getItem(key,Phaser.Cache.VIDEO,'getVideo');},getShader:function(key){return this.getItem(key,Phaser.Cache.SHADER,'getShader','data');},getRenderTexture:function(key){return this.getItem(key,Phaser.Cache.RENDER_TEXTURE,'getRenderTexture');},getBaseTexture:function(key,cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
return this.getItem(key,cache,'getBaseTexture','base');},getFrame:function(key,cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
return this.getItem(key,cache,'getFrame','frame');},getFrameCount:function(key,cache){var data=this.getFrameData(key,cache);if(data)
{return data.total;}
else
{return 0;}},getFrameData:function(key,cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
return this.getItem(key,cache,'getFrameData','frameData');},hasFrameData:function(key,cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
return(this.getItem(key,cache,'','frameData')!==null);},updateFrameData:function(key,frameData,cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
if(this._cacheMap[cache][key])
{this._cacheMap[cache][key].frameData=frameData;}},getFrameByIndex:function(key,index,cache){var data=this.getFrameData(key,cache);if(data)
{return data.getFrame(index);}
else
{return null;}},getFrameByName:function(key,name,cache){var data=this.getFrameData(key,cache);if(data)
{return data.getFrameByName(name);}
else
{return null;}},getPixiTexture:function(key){if(PIXI.TextureCache[key])
{return PIXI.TextureCache[key];}
else
{var base=this.getPixiBaseTexture(key);if(base)
{return new PIXI.Texture(base);}
else
{return null;}}},getPixiBaseTexture:function(key){if(PIXI.BaseTextureCache[key])
{return PIXI.BaseTextureCache[key];}
else
{var img=this.getItem(key,Phaser.Cache.IMAGE,'getPixiBaseTexture');if(img!==null)
{return img.base;}
else
{return null;}}},getURL:function(url){var url=this._resolveURL(url);if(url)
{return this._urlMap[url];}
else
{console.warn('Phaser.Cache.getUrl: Invalid url: "'+url+'" or Cache.autoResolveURL was false');return null;}},getKeys:function(cache){if(cache===undefined){cache=Phaser.Cache.IMAGE;}
var out=[];if(this._cacheMap[cache])
{for(var key in this._cacheMap[cache])
{if(key!=='__default'&&key!=='__missing')
{out.push(key);}}}
return out;},removeCanvas:function(key){delete this._cache.canvas[key];},removeImage:function(key,removeFromPixi){if(removeFromPixi===undefined){removeFromPixi=true;}
var img=this.getImage(key,true);if(removeFromPixi&&img.base)
{img.base.destroy();}
delete this._cache.image[key];},removeSound:function(key){delete this._cache.sound[key];},removeText:function(key){delete this._cache.text[key];},removePhysics:function(key){delete this._cache.physics[key];},removeTilemap:function(key){delete this._cache.tilemap[key];},removeBinary:function(key){delete this._cache.binary[key];},removeBitmapData:function(key){delete this._cache.bitmapData[key];},removeBitmapFont:function(key){delete this._cache.bitmapFont[key];},removeJSON:function(key){delete this._cache.json[key];},removeXML:function(key){delete this._cache.xml[key];},removeVideo:function(key){delete this._cache.video[key];},removeShader:function(key){delete this._cache.shader[key];},removeRenderTexture:function(key){delete this._cache.renderTexture[key];},removeSpriteSheet:function(key){delete this._cache.spriteSheet[key];},removeTextureAtlas:function(key){delete this._cache.atlas[key];},clearGLTextures:function(){for(var key in this.cache.image)
{this.cache.image[key].base._glTextures=[];}},_resolveURL:function(url,data){if(!this.autoResolveURL)
{return null;}
this._urlResolver.src=this.game.load.baseURL+url;this._urlTemp=this._urlResolver.src;this._urlResolver.src='';if(data)
{this._urlMap[this._urlTemp]=data;}
return this._urlTemp;},destroy:function(){for(var i=0;i<this._cacheMap.length;i++)
{var cache=this._cacheMap[i];for(var key in cache)
{if(key!=='__default'&&key!=='__missing')
{if(cache[key]['destroy'])
{cache[key].destroy();}
delete cache[key];}}}
this._urlMap=null;this._urlResolver=null;this._urlTemp=null;}};Phaser.Cache.prototype.constructor=Phaser.Cache;Phaser.Loader=function(game){this.game=game;this.cache=game.cache;this.resetLocked=false;this.isLoading=false;this.hasLoaded=false;this.preloadSprite=null;this.crossOrigin=false;this.baseURL='';this.path='';this.onLoadStart=new Phaser.Signal();this.onLoadComplete=new Phaser.Signal();this.onPackComplete=new Phaser.Signal();this.onFileStart=new Phaser.Signal();this.onFileComplete=new Phaser.Signal();this.onFileError=new Phaser.Signal();this.useXDomainRequest=false;this._warnedAboutXDomainRequest=false;this.enableParallel=true;this.maxParallelDownloads=4;this._withSyncPointDepth=0;this._fileList=[];this._flightQueue=[];this._processingHead=0;this._fileLoadStarted=false;this._totalPackCount=0;this._totalFileCount=0;this._loadedPackCount=0;this._loadedFileCount=0;};Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY=0;Phaser.Loader.TEXTURE_ATLAS_JSON_HASH=1;Phaser.Loader.TEXTURE_ATLAS_XML_STARLING=2;Phaser.Loader.PHYSICS_LIME_CORONA_JSON=3;Phaser.Loader.PHYSICS_PHASER_JSON=4;Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL=5;Phaser.Loader.prototype={setPreloadSprite:function(sprite,direction){direction=direction||0;this.preloadSprite={sprite:sprite,direction:direction,width:sprite.width,height:sprite.height,rect:null};if(direction===0)
{this.preloadSprite.rect=new Phaser.Rectangle(0,0,1,sprite.height);}
else
{this.preloadSprite.rect=new Phaser.Rectangle(0,0,sprite.width,1);}
sprite.crop(this.preloadSprite.rect);sprite.visible=true;},resize:function(){if(this.preloadSprite&&this.preloadSprite.height!==this.preloadSprite.sprite.height)
{this.preloadSprite.rect.height=this.preloadSprite.sprite.height;}},checkKeyExists:function(type,key){return this.getAssetIndex(type,key)>-1;},getAssetIndex:function(type,key){var bestFound=-1;for(var i=0;i<this._fileList.length;i++)
{var file=this._fileList[i];if(file.type===type&&file.key===key)
{bestFound=i;if(!file.loaded&&!file.loading)
{break;}}}
return bestFound;},getAsset:function(type,key){var fileIndex=this.getAssetIndex(type,key);if(fileIndex>-1)
{return{index:fileIndex,file:this._fileList[fileIndex]};}
return false;},reset:function(hard,clearEvents){if(clearEvents===undefined){clearEvents=false;}
if(this.resetLocked)
{return;}
if(hard)
{this.preloadSprite=null;}
this.isLoading=false;this._processingHead=0;this._fileList.length=0;this._flightQueue.length=0;this._fileLoadStarted=false;this._totalFileCount=0;this._totalPackCount=0;this._loadedPackCount=0;this._loadedFileCount=0;if(clearEvents)
{this.onLoadStart.removeAll();this.onLoadComplete.removeAll();this.onPackComplete.removeAll();this.onFileStart.removeAll();this.onFileComplete.removeAll();this.onFileError.removeAll();}},addToFileList:function(type,key,url,properties,overwrite,extension){if(overwrite===undefined){overwrite=false;}
if(key===undefined||key==='')
{console.warn("Phaser.Loader: Invalid or no key given of type "+type);return this;}
if(url===undefined||url===null)
{if(extension)
{url=key+extension;}
else
{console.warn("Phaser.Loader: No URL given for file type: "+type+" key: "+key);return this;}}
var file={type:type,key:key,path:this.path,url:url,syncPoint:this._withSyncPointDepth>0,data:null,loading:false,loaded:false,error:false};if(properties)
{for(var prop in properties)
{file[prop]=properties[prop];}}
var fileIndex=this.getAssetIndex(type,key);if(overwrite&&fileIndex>-1)
{var currentFile=this._fileList[fileIndex];if(!currentFile.loading&&!currentFile.loaded)
{this._fileList[fileIndex]=file;}
else
{this._fileList.push(file);this._totalFileCount++;}}
else if(fileIndex===-1)
{this._fileList.push(file);this._totalFileCount++;}
return this;},replaceInFileList:function(type,key,url,properties){return this.addToFileList(type,key,url,properties,true);},pack:function(key,url,data,callbackContext){if(url===undefined){url=null;}
if(data===undefined){data=null;}
if(callbackContext===undefined){callbackContext=null;}
if(!url&&!data)
{console.warn('Phaser.Loader.pack - Both url and data are null. One must be set.');return this;}
var pack={type:'packfile',key:key,url:url,path:this.path,syncPoint:true,data:null,loading:false,loaded:false,error:false,callbackContext:callbackContext};if(data)
{if(typeof data==='string')
{data=JSON.parse(data);}
pack.data=data||{};pack.loaded=true;}
for(var i=0;i<this._fileList.length+1;i++)
{var file=this._fileList[i];if(!file||(!file.loaded&&!file.loading&&file.type!=='packfile'))
{this._fileList.splice(i,1,pack);this._totalPackCount++;break;}}
return this;},image:function(key,url,overwrite){return this.addToFileList('image',key,url,undefined,overwrite,'.png');},images:function(keys,urls){if(Array.isArray(urls))
{for(var i=0;i<keys.length;i++)
{this.image(keys[i],urls[i]);}}
else
{for(var i=0;i<keys.length;i++)
{this.image(keys[i]);}}
return this;},text:function(key,url,overwrite){return this.addToFileList('text',key,url,undefined,overwrite,'.txt');},json:function(key,url,overwrite){return this.addToFileList('json',key,url,undefined,overwrite,'.json');},shader:function(key,url,overwrite){return this.addToFileList('shader',key,url,undefined,overwrite,'.frag');},xml:function(key,url,overwrite){return this.addToFileList('xml',key,url,undefined,overwrite,'.xml');},script:function(key,url,callback,callbackContext){if(callback===undefined){callback=false;}
if(callback!==false&&callbackContext===undefined){callbackContext=this;}
return this.addToFileList('script',key,url,{syncPoint:true,callback:callback,callbackContext:callbackContext},false,'.js');},binary:function(key,url,callback,callbackContext){if(callback===undefined){callback=false;}
if(callback!==false&&callbackContext===undefined){callbackContext=callback;}
return this.addToFileList('binary',key,url,{callback:callback,callbackContext:callbackContext},false,'.bin');},spritesheet:function(key,url,frameWidth,frameHeight,frameMax,margin,spacing){if(frameMax===undefined){frameMax=-1;}
if(margin===undefined){margin=0;}
if(spacing===undefined){spacing=0;}
return this.addToFileList('spritesheet',key,url,{frameWidth:frameWidth,frameHeight:frameHeight,frameMax:frameMax,margin:margin,spacing:spacing},false,'.png');},audio:function(key,urls,autoDecode){if(this.game.sound.noAudio)
{return this;}
if(autoDecode===undefined){autoDecode=true;}
if(typeof urls==='string')
{urls=[urls];}
return this.addToFileList('audio',key,urls,{buffer:null,autoDecode:autoDecode});},audiosprite:function(key,urls,jsonURL,jsonData,autoDecode){if(this.game.sound.noAudio)
{return this;}
if(jsonURL===undefined){jsonURL=null;}
if(jsonData===undefined){jsonData=null;}
if(autoDecode===undefined){autoDecode=true;}
this.audio(key,urls,autoDecode);if(jsonURL)
{this.json(key+'-audioatlas',jsonURL);}
else if(jsonData)
{if(typeof jsonData==='string')
{jsonData=JSON.parse(jsonData);}
this.cache.addJSON(key+'-audioatlas','',jsonData);}
else
{console.warn('Phaser.Loader.audiosprite - You must specify either a jsonURL or provide a jsonData object');}
return this;},video:function(key,urls,loadEvent,asBlob){if(loadEvent===undefined)
{if(this.game.device.firefox)
{loadEvent='loadeddata';}
else
{loadEvent='canplaythrough';}}
if(asBlob===undefined){asBlob=false;}
if(typeof urls==='string')
{urls=[urls];}
return this.addToFileList('video',key,urls,{buffer:null,asBlob:asBlob,loadEvent:loadEvent});},tilemap:function(key,url,data,format){if(url===undefined){url=null;}
if(data===undefined){data=null;}
if(format===undefined){format=Phaser.Tilemap.CSV;}
if(!url&&!data)
{if(format===Phaser.Tilemap.CSV)
{url=key+'.csv';}
else
{url=key+'.json';}}
if(data)
{switch(format)
{case Phaser.Tilemap.CSV:break;case Phaser.Tilemap.TILED_JSON:if(typeof data==='string')
{data=JSON.parse(data);}
break;}
this.cache.addTilemap(key,null,data,format);}
else
{this.addToFileList('tilemap',key,url,{format:format});}
return this;},physics:function(key,url,data,format){if(url===undefined){url=null;}
if(data===undefined){data=null;}
if(format===undefined){format=Phaser.Physics.LIME_CORONA_JSON;}
if(!url&&!data)
{url=key+'.json';}
if(data)
{if(typeof data==='string')
{data=JSON.parse(data);}
this.cache.addPhysicsData(key,null,data,format);}
else
{this.addToFileList('physics',key,url,{format:format});}
return this;},bitmapFont:function(key,textureURL,atlasURL,atlasData,xSpacing,ySpacing){if(textureURL===undefined||textureURL===null)
{textureURL=key+'.png';}
if(atlasURL===undefined){atlasURL=null;}
if(atlasData===undefined){atlasData=null;}
if(atlasURL===null&&atlasData===null)
{atlasURL=key+'.xml';}
if(xSpacing===undefined){xSpacing=0;}
if(ySpacing===undefined){ySpacing=0;}
if(atlasURL)
{this.addToFileList('bitmapfont',key,textureURL,{atlasURL:atlasURL,xSpacing:xSpacing,ySpacing:ySpacing});}
else
{if(typeof atlasData==='string')
{var json,xml;try
{json=JSON.parse(atlasData);}
catch(e)
{xml=this.parseXml(atlasData);}
if(!xml&&!json)
{throw new Error("Phaser.Loader. Invalid Bitmap Font atlas given");}
this.addToFileList('bitmapfont',key,textureURL,{atlasURL:null,atlasData:json||xml,atlasType:(!!json?'json':'xml'),xSpacing:xSpacing,ySpacing:ySpacing});}}
return this;},atlasJSONArray:function(key,textureURL,atlasURL,atlasData){return this.atlas(key,textureURL,atlasURL,atlasData,Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);},atlasJSONHash:function(key,textureURL,atlasURL,atlasData){return this.atlas(key,textureURL,atlasURL,atlasData,Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);},atlasXML:function(key,textureURL,atlasURL,atlasData){if(atlasURL===undefined){atlasURL=null;}
if(atlasData===undefined){atlasData=null;}
if(!atlasURL&&!atlasData)
{atlasURL=key+'.xml';}
return this.atlas(key,textureURL,atlasURL,atlasData,Phaser.Loader.TEXTURE_ATLAS_XML_STARLING);},atlas:function(key,textureURL,atlasURL,atlasData,format){if(textureURL===undefined||textureURL===null)
{textureURL=key+'.png';}
if(atlasURL===undefined){atlasURL=null;}
if(atlasData===undefined){atlasData=null;}
if(format===undefined){format=Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY;}
if(!atlasURL&&!atlasData)
{if(format===Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
{atlasURL=key+'.xml';}
else
{atlasURL=key+'.json';}}
if(atlasURL)
{this.addToFileList('textureatlas',key,textureURL,{atlasURL:atlasURL,format:format});}
else
{switch(format)
{case Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY:if(typeof atlasData==='string')
{atlasData=JSON.parse(atlasData);}
break;case Phaser.Loader.TEXTURE_ATLAS_XML_STARLING:if(typeof atlasData==='string')
{var xml=this.parseXml(atlasData);if(!xml)
{throw new Error("Phaser.Loader. Invalid Texture Atlas XML given");}
atlasData=xml;}
break;}
this.addToFileList('textureatlas',key,textureURL,{atlasURL:null,atlasData:atlasData,format:format});}
return this;},withSyncPoint:function(callback,callbackContext){this._withSyncPointDepth++;try{callback.call(callbackContext||this,this);}finally{this._withSyncPointDepth--;}
return this;},addSyncPoint:function(type,key){var asset=this.getAsset(type,key);if(asset)
{asset.file.syncPoint=true;}
return this;},removeFile:function(type,key){var asset=this.getAsset(type,key);if(asset)
{if(!asset.loaded&&!asset.loading)
{this._fileList.splice(asset.index,1);}}},removeAll:function(){this._fileList.length=0;this._flightQueue.length=0;},start:function(){if(this.isLoading)
{return;}
this.hasLoaded=false;this.isLoading=true;this.updateProgress();this.processLoadQueue();},processLoadQueue:function(){if(!this.isLoading)
{console.warn('Phaser.Loader - active loading canceled / reset');this.finishedLoading(true);return;}
for(var i=0;i<this._flightQueue.length;i++)
{var file=this._flightQueue[i];if(file.loaded||file.error)
{this._flightQueue.splice(i,1);i--;file.loading=false;file.requestUrl=null;file.requestObject=null;if(file.error)
{this.onFileError.dispatch(file.key,file);}
if(file.type!=='packfile')
{this._loadedFileCount++;this.onFileComplete.dispatch(this.progress,file.key,!file.error,this._loadedFileCount,this._totalFileCount);}
else if(file.type==='packfile'&&file.error)
{this._loadedPackCount++;this.onPackComplete.dispatch(file.key,!file.error,this._loadedPackCount,this._totalPackCount);}}}
var syncblock=false;var inflightLimit=this.enableParallel?Phaser.Math.clamp(this.maxParallelDownloads,1,12):1;for(var i=this._processingHead;i<this._fileList.length;i++)
{var file=this._fileList[i];if(file.type==='packfile'&&!file.error&&file.loaded&&i===this._processingHead)
{this.processPack(file);this._loadedPackCount++;this.onPackComplete.dispatch(file.key,!file.error,this._loadedPackCount,this._totalPackCount);}
if(file.loaded||file.error)
{if(i===this._processingHead)
{this._processingHead=i+1;}}
else if(!file.loading&&this._flightQueue.length<inflightLimit)
{if(file.type==='packfile'&&!file.data)
{this._flightQueue.push(file);file.loading=true;this.loadFile(file);}
else if(!syncblock)
{if(!this._fileLoadStarted)
{this._fileLoadStarted=true;this.onLoadStart.dispatch();}
this._flightQueue.push(file);file.loading=true;this.onFileStart.dispatch(this.progress,file.key,file.url);this.loadFile(file);}}
if(!file.loaded&&file.syncPoint)
{syncblock=true;}
if(this._flightQueue.length>=inflightLimit||(syncblock&&this._loadedPackCount===this._totalPackCount))
{break;}}
this.updateProgress();if(this._processingHead>=this._fileList.length)
{this.finishedLoading();}
else if(!this._flightQueue.length)
{console.warn("Phaser.Loader - aborting: processing queue empty, loading may have stalled");var _this=this;setTimeout(function(){_this.finishedLoading(true);},2000);}},finishedLoading:function(abnormal){if(this.hasLoaded)
{return;}
this.hasLoaded=true;this.isLoading=false;if(!abnormal&&!this._fileLoadStarted)
{this._fileLoadStarted=true;this.onLoadStart.dispatch();}
this.onLoadComplete.dispatch();this.reset();this.game.state.loadComplete();},asyncComplete:function(file,errorMessage){if(errorMessage===undefined){errorMessage='';}
file.loaded=true;file.error=!!errorMessage;if(errorMessage)
{file.errorMessage=errorMessage;console.warn('Phaser.Loader - '+file.type+'['+file.key+']'+': '+errorMessage);}
this.processLoadQueue();},processPack:function(pack){var packData=pack.data[pack.key];if(!packData)
{console.warn('Phaser.Loader - '+pack.key+': pack has data, but not for pack key');return;}
for(var i=0;i<packData.length;i++)
{var file=packData[i];switch(file.type)
{case"image":this.image(file.key,file.url,file.overwrite);break;case"text":this.text(file.key,file.url,file.overwrite);break;case"json":this.json(file.key,file.url,file.overwrite);break;case"xml":this.xml(file.key,file.url,file.overwrite);break;case"script":this.script(file.key,file.url,file.callback,pack.callbackContext||this);break;case"binary":this.binary(file.key,file.url,file.callback,pack.callbackContext||this);break;case"spritesheet":this.spritesheet(file.key,file.url,file.frameWidth,file.frameHeight,file.frameMax,file.margin,file.spacing);break;case"video":this.video(file.key,file.urls);break;case"audio":this.audio(file.key,file.urls,file.autoDecode);break;case"audiosprite":this.audiosprite(file.key,file.urls,file.jsonURL,file.jsonData,file.autoDecode);break;case"tilemap":this.tilemap(file.key,file.url,file.data,Phaser.Tilemap[file.format]);break;case"physics":this.physics(file.key,file.url,file.data,Phaser.Loader[file.format]);break;case"bitmapFont":this.bitmapFont(file.key,file.textureURL,file.atlasURL,file.atlasData,file.xSpacing,file.ySpacing);break;case"atlasJSONArray":this.atlasJSONArray(file.key,file.textureURL,file.atlasURL,file.atlasData);break;case"atlasJSONHash":this.atlasJSONHash(file.key,file.textureURL,file.atlasURL,file.atlasData);break;case"atlasXML":this.atlasXML(file.key,file.textureURL,file.atlasURL,file.atlasData);break;case"atlas":this.atlas(file.key,file.textureURL,file.atlasURL,file.atlasData,Phaser.Loader[file.format]);break;case"shader":this.shader(file.key,file.url,file.overwrite);break;}}},transformUrl:function(url,file){if(!url)
{return false;}
if(url.match(/^(?:blob:|data:|http:\/\/|https:\/\/|\/\/)/))
{return url;}
else
{return this.baseURL+file.path+url;}},loadFile:function(file){switch(file.type)
{case'packfile':this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.fileComplete);break;case'image':case'spritesheet':case'textureatlas':case'bitmapfont':this.loadImageTag(file);break;case'audio':file.url=this.getAudioURL(file.url);if(file.url)
{if(this.game.sound.usingWebAudio)
{this.xhrLoad(file,this.transformUrl(file.url,file),'arraybuffer',this.fileComplete);}
else if(this.game.sound.usingAudioTag)
{this.loadAudioTag(file);}}
else
{this.fileError(file,null,'No supported audio URL specified or device does not have audio playback support');}
break;case'video':file.url=this.getVideoURL(file.url);if(file.url)
{if(file.asBlob)
{this.xhrLoad(file,this.transformUrl(file.url,file),'arraybuffer',this.fileComplete);}
else
{this.loadVideoTag(file);}}
else
{this.fileError(file,null,'No supported video URL specified or device does not have video playback support');}
break;case'json':this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.jsonLoadComplete);break;case'xml':this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.xmlLoadComplete);break;case'tilemap':if(file.format===Phaser.Tilemap.TILED_JSON)
{this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.jsonLoadComplete);}
else if(file.format===Phaser.Tilemap.CSV)
{this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.csvLoadComplete);}
else
{this.asyncComplete(file,"invalid Tilemap format: "+file.format);}
break;case'text':case'script':case'shader':case'physics':this.xhrLoad(file,this.transformUrl(file.url,file),'text',this.fileComplete);break;case'binary':this.xhrLoad(file,this.transformUrl(file.url,file),'arraybuffer',this.fileComplete);break;}},loadImageTag:function(file){var _this=this;file.data=new Image();file.data.name=file.key;if(this.crossOrigin)
{file.data.crossOrigin=this.crossOrigin;}
file.data.onload=function(){if(file.data.onload)
{file.data.onload=null;file.data.onerror=null;_this.fileComplete(file);}};file.data.onerror=function(){if(file.data.onload)
{file.data.onload=null;file.data.onerror=null;_this.fileError(file);}};file.data.src=this.transformUrl(file.url,file);if(file.data.complete&&file.data.width&&file.data.height)
{file.data.onload=null;file.data.onerror=null;this.fileComplete(file);}},loadVideoTag:function(file){var _this=this;file.data=document.createElement("video");file.data.name=file.key;file.data.controls=false;file.data.autoplay=false;var videoLoadEvent=function(){file.data.removeEventListener(file.loadEvent,videoLoadEvent,false);file.data.onerror=null;file.data.canplay=true;Phaser.GAMES[_this.game.id].load.fileComplete(file);};file.data.onerror=function(){file.data.removeEventListener(file.loadEvent,videoLoadEvent,false);file.data.onerror=null;file.data.canplay=false;_this.fileError(file);};file.data.addEventListener(file.loadEvent,videoLoadEvent,false);file.data.src=this.transformUrl(file.url,file);file.data.load();},loadAudioTag:function(file){var _this=this;if(this.game.sound.touchLocked)
{file.data=new Audio();file.data.name=file.key;file.data.preload='auto';file.data.src=this.transformUrl(file.url,file);this.fileComplete(file);}
else
{file.data=new Audio();file.data.name=file.key;var playThroughEvent=function(){file.data.removeEventListener('canplaythrough',playThroughEvent,false);file.data.onerror=null;Phaser.GAMES[_this.game.id].load.fileComplete(file);};file.data.onerror=function(){file.data.removeEventListener('canplaythrough',playThroughEvent,false);file.data.onerror=null;_this.fileError(file);};file.data.preload='auto';file.data.src=this.transformUrl(file.url,file);file.data.addEventListener('canplaythrough',playThroughEvent,false);file.data.load();}},xhrLoad:function(file,url,type,onload,onerror){if(this.useXDomainRequest&&window.XDomainRequest)
{this.xhrLoadWithXDR(file,url,type,onload,onerror);return;}
var xhr=new XMLHttpRequest();xhr.open("GET",url,true);xhr.responseType=type;onerror=onerror||this.fileError;var _this=this;xhr.onload=function(){try{return onload.call(_this,file,xhr);}catch(e){if(!_this.hasLoaded)
{_this.asyncComplete(file,e.message||'Exception');}
else
{if(window['console'])
{console.error(e);}}}};xhr.onerror=function(){try{return onerror.call(_this,file,xhr);}catch(e){if(!_this.hasLoaded)
{_this.asyncComplete(file,e.message||'Exception');}
else
{if(window['console'])
{console.error(e);}}}};file.requestObject=xhr;file.requestUrl=url;xhr.send();},xhrLoadWithXDR:function(file,url,type,onload,onerror){if(!this._warnedAboutXDomainRequest&&(!this.game.device.ie||this.game.device.ieVersion>=10))
{this._warnedAboutXDomainRequest=true;console.warn("Phaser.Loader - using XDomainRequest outside of IE 9");}
var xhr=new window.XDomainRequest();xhr.open('GET',url,true);xhr.responseType=type;xhr.timeout=3000;onerror=onerror||this.fileError;var _this=this;xhr.onerror=function(){try{return onerror.call(_this,file,xhr);}catch(e){_this.asyncComplete(file,e.message||'Exception');}};xhr.ontimeout=function(){try{return onerror.call(_this,file,xhr);}catch(e){_this.asyncComplete(file,e.message||'Exception');}};xhr.onprogress=function(){};xhr.onload=function(){try{return onload.call(_this,file,xhr);}catch(e){_this.asyncComplete(file,e.message||'Exception');}};file.requestObject=xhr;file.requestUrl=url;setTimeout(function(){xhr.send();},0);},getVideoURL:function(urls){for(var i=0;i<urls.length;i++)
{var url=urls[i];var videoType;if(url.uri)
{url=url.uri;videoType=url.type;}
else
{if(url.indexOf("blob:")===0||url.indexOf("data:")===0)
{return url;}
if(url.indexOf("?")>=0)
{url=url.substr(0,url.indexOf("?"));}
var extension=url.substr((Math.max(0,url.lastIndexOf("."))||Infinity)+1);videoType=extension.toLowerCase();}
if(this.game.device.canPlayVideo(videoType))
{return urls[i];}}
return null;},getAudioURL:function(urls){if(this.game.sound.noAudio)
{return null;}
for(var i=0;i<urls.length;i++)
{var url=urls[i];var audioType;if(url.uri)
{url=url.uri;audioType=url.type;}
else
{if(url.indexOf("blob:")===0||url.indexOf("data:")===0)
{return url;}
if(url.indexOf("?")>=0)
{url=url.substr(0,url.indexOf("?"));}
var extension=url.substr((Math.max(0,url.lastIndexOf("."))||Infinity)+1);audioType=extension.toLowerCase();}
if(this.game.device.canPlayAudio(audioType))
{return urls[i];}}
return null;},fileError:function(file,xhr,reason){var url=file.requestUrl||this.transformUrl(file.url,file);var message='error loading asset from URL '+url;if(!reason&&xhr)
{reason=xhr.status;}
if(reason)
{message=message+' ('+reason+')';}
this.asyncComplete(file,message);},fileComplete:function(file,xhr){var loadNext=true;switch(file.type)
{case'packfile':var data=JSON.parse(xhr.responseText);file.data=data||{};break;case'image':this.cache.addImage(file.key,file.url,file.data);break;case'spritesheet':this.cache.addSpriteSheet(file.key,file.url,file.data,file.frameWidth,file.frameHeight,file.frameMax,file.margin,file.spacing);break;case'textureatlas':if(file.atlasURL==null)
{this.cache.addTextureAtlas(file.key,file.url,file.data,file.atlasData,file.format);}
else
{loadNext=false;if(file.format==Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY||file.format==Phaser.Loader.TEXTURE_ATLAS_JSON_HASH||file.format==Phaser.Loader.TEXTURE_ATLAS_JSON_PYXEL)
{this.xhrLoad(file,this.transformUrl(file.atlasURL,file),'text',this.jsonLoadComplete);}
else if(file.format==Phaser.Loader.TEXTURE_ATLAS_XML_STARLING)
{this.xhrLoad(file,this.transformUrl(file.atlasURL,file),'text',this.xmlLoadComplete);}
else
{throw new Error("Phaser.Loader. Invalid Texture Atlas format: "+file.format);}}
break;case'bitmapfont':if(!file.atlasURL)
{this.cache.addBitmapFont(file.key,file.url,file.data,file.atlasData,file.atlasType,file.xSpacing,file.ySpacing);}
else
{loadNext=false;this.xhrLoad(file,this.transformUrl(file.atlasURL,file),'text',function(file,xhr){var json;try
{json=JSON.parse(xhr.responseText);}
catch(e){}
if(!!json)
{file.atlasType='json';this.jsonLoadComplete(file,xhr);}
else
{file.atlasType='xml';this.xmlLoadComplete(file,xhr);}});}
break;case'video':if(file.asBlob)
{try
{file.data=new Blob([new Uint8Array(xhr.response)]);}
catch(e)
{throw new Error("Phaser.Loader. Unable to parse video file as Blob: "+file.key);}}
this.cache.addVideo(file.key,file.url,file.data,file.asBlob);break;case'audio':if(this.game.sound.usingWebAudio)
{file.data=xhr.response;this.cache.addSound(file.key,file.url,file.data,true,false);if(file.autoDecode)
{this.game.sound.decode(file.key);}}
else
{this.cache.addSound(file.key,file.url,file.data,false,true);}
break;case'text':file.data=xhr.responseText;this.cache.addText(file.key,file.url,file.data);break;case'shader':file.data=xhr.responseText;this.cache.addShader(file.key,file.url,file.data);break;case'physics':var data=JSON.parse(xhr.responseText);this.cache.addPhysicsData(file.key,file.url,data,file.format);break;case'script':file.data=document.createElement('script');file.data.language='javascript';file.data.type='text/javascript';file.data.defer=false;file.data.text=xhr.responseText;document.head.appendChild(file.data);if(file.callback)
{file.data=file.callback.call(file.callbackContext,file.key,xhr.responseText);}
break;case'binary':if(file.callback)
{file.data=file.callback.call(file.callbackContext,file.key,xhr.response);}
else
{file.data=xhr.response;}
this.cache.addBinary(file.key,file.data);break;}
if(loadNext)
{this.asyncComplete(file);}},jsonLoadComplete:function(file,xhr){var data=JSON.parse(xhr.responseText);if(file.type==='tilemap')
{this.cache.addTilemap(file.key,file.url,data,file.format);}
else if(file.type==='bitmapfont')
{this.cache.addBitmapFont(file.key,file.url,file.data,data,file.atlasType,file.xSpacing,file.ySpacing);}
else if(file.type==='json')
{this.cache.addJSON(file.key,file.url,data);}
else
{this.cache.addTextureAtlas(file.key,file.url,file.data,data,file.format);}
this.asyncComplete(file);},csvLoadComplete:function(file,xhr){var data=xhr.responseText;this.cache.addTilemap(file.key,file.url,data,file.format);this.asyncComplete(file);},xmlLoadComplete:function(file,xhr){var data=xhr.responseText;var xml=this.parseXml(data);if(!xml)
{var responseType=xhr.responseType||xhr.contentType;console.warn('Phaser.Loader - '+file.key+': invalid XML ('+responseType+')');this.asyncComplete(file,"invalid XML");return;}
if(file.type==='bitmapfont')
{this.cache.addBitmapFont(file.key,file.url,file.data,xml,file.atlasType,file.xSpacing,file.ySpacing);}
else if(file.type==='textureatlas')
{this.cache.addTextureAtlas(file.key,file.url,file.data,xml,file.format);}
else if(file.type==='xml')
{this.cache.addXML(file.key,file.url,xml);}
this.asyncComplete(file);},parseXml:function(data){var xml;try
{if(window['DOMParser'])
{var domparser=new DOMParser();xml=domparser.parseFromString(data,"text/xml");}
else
{xml=new ActiveXObject("Microsoft.XMLDOM");xml.async='false';xml.loadXML(data);}}
catch(e)
{xml=null;}
if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length)
{return null;}
else
{return xml;}},updateProgress:function(){if(this.preloadSprite)
{if(this.preloadSprite.direction===0)
{this.preloadSprite.rect.width=Math.floor((this.preloadSprite.width / 100)*this.progress);}
else
{this.preloadSprite.rect.height=Math.floor((this.preloadSprite.height / 100)*this.progress);}
if(this.preloadSprite.sprite)
{this.preloadSprite.sprite.updateCrop();}
else
{this.preloadSprite=null;}}},totalLoadedFiles:function(){return this._loadedFileCount;},totalQueuedFiles:function(){return this._totalFileCount-this._loadedFileCount;},totalLoadedPacks:function(){return this._totalPackCount;},totalQueuedPacks:function(){return this._totalPackCount-this._loadedPackCount;}};Object.defineProperty(Phaser.Loader.prototype,"progressFloat",{get:function(){var progress=(this._loadedFileCount / this._totalFileCount)*100;return Phaser.Math.clamp(progress||0,0,100);}});Object.defineProperty(Phaser.Loader.prototype,"progress",{get:function(){return Math.round(this.progressFloat);}});Phaser.Loader.prototype.constructor=Phaser.Loader;Phaser.LoaderParser={bitmapFont:function(xml,baseTexture,xSpacing,ySpacing){return this.xmlBitmapFont(xml,baseTexture,xSpacing,ySpacing);},xmlBitmapFont:function(xml,baseTexture,xSpacing,ySpacing){var data={};var info=xml.getElementsByTagName('info')[0];var common=xml.getElementsByTagName('common')[0];data.font=info.getAttribute('face');data.size=parseInt(info.getAttribute('size'),10);data.lineHeight=parseInt(common.getAttribute('lineHeight'),10)+ySpacing;data.chars={};var letters=xml.getElementsByTagName('char');for(var i=0;i<letters.length;i++)
{var charCode=parseInt(letters[i].getAttribute('id'),10);data.chars[charCode]={x:parseInt(letters[i].getAttribute('x'),10),y:parseInt(letters[i].getAttribute('y'),10),width:parseInt(letters[i].getAttribute('width'),10),height:parseInt(letters[i].getAttribute('height'),10),xOffset:parseInt(letters[i].getAttribute('xoffset'),10),yOffset:parseInt(letters[i].getAttribute('yoffset'),10),xAdvance:parseInt(letters[i].getAttribute('xadvance'),10)+xSpacing,kerning:{}};}
var kernings=xml.getElementsByTagName('kerning');for(i=0;i<kernings.length;i++)
{var first=parseInt(kernings[i].getAttribute('first'),10);var second=parseInt(kernings[i].getAttribute('second'),10);var amount=parseInt(kernings[i].getAttribute('amount'),10);data.chars[second].kerning[first]=amount;}
return this.finalizeBitmapFont(baseTexture,data);},jsonBitmapFont:function(json,baseTexture,xSpacing,ySpacing){var data={font:json.font.info._face,size:parseInt(json.font.info._size,10),lineHeight:parseInt(json.font.common._lineHeight,10)+ySpacing,chars:{}};json.font.chars["char"].forEach(function parseChar(letter){var charCode=parseInt(letter._id,10);data.chars[charCode]={x:parseInt(letter._x,10),y:parseInt(letter._y,10),width:parseInt(letter._width,10),height:parseInt(letter._height,10),xOffset:parseInt(letter._xoffset,10),yOffset:parseInt(letter._yoffset,10),xAdvance:parseInt(letter._xadvance,10)+xSpacing,kerning:{}};});if(json.font.kernings&&json.font.kernings.kerning){json.font.kernings.kerning.forEach(function parseKerning(kerning){data.chars[kerning._second].kerning[kerning._first]=parseInt(kerning._amount,10);});}
return this.finalizeBitmapFont(baseTexture,data);},finalizeBitmapFont:function(baseTexture,bitmapFontData){Object.keys(bitmapFontData.chars).forEach(function addTexture(charCode){var letter=bitmapFontData.chars[charCode];letter.texture=new PIXI.Texture(baseTexture,new Phaser.Rectangle(letter.x,letter.y,letter.width,letter.height));});return bitmapFontData;}};Phaser.AudioSprite=function(game,key){this.game=game;this.key=key;this.config=this.game.cache.getJSON(key+'-audioatlas');this.autoplayKey=null;this.autoplay=false;this.sounds={};for(var k in this.config.spritemap)
{var marker=this.config.spritemap[k];var sound=this.game.add.sound(this.key);sound.addMarker(k,marker.start,(marker.end-marker.start),null,marker.loop);this.sounds[k]=sound;}
if(this.config.autoplay)
{this.autoplayKey=this.config.autoplay;this.play(this.autoplayKey);this.autoplay=this.sounds[this.autoplayKey];}};Phaser.AudioSprite.prototype={play:function(marker,volume){if(volume===undefined){volume=1;}
return this.sounds[marker].play(marker,null,volume);},stop:function(marker){if(!marker)
{for(var key in this.sounds)
{this.sounds[key].stop();}}
else
{this.sounds[marker].stop();}},get:function(marker){return this.sounds[marker];}};Phaser.AudioSprite.prototype.constructor=Phaser.AudioSprite;Phaser.Sound=function(game,key,volume,loop,connect){if(volume===undefined){volume=1;}
if(loop===undefined){loop=false;}
if(connect===undefined){connect=game.sound.connectToMaster;}
this.game=game;this.name=key;this.key=key;this.loop=loop;this.volume=volume;this.markers={};this.context=null;this.autoplay=false;this.totalDuration=0;this.startTime=0;this.currentTime=0;this.duration=0;this.durationMS=0;this.position=0;this.stopTime=0;this.paused=false;this.pausedPosition=0;this.pausedTime=0;this.isPlaying=false;this.currentMarker='';this.fadeTween=null;this.pendingPlayback=false;this.override=false;this.allowMultiple=false;this.usingWebAudio=this.game.sound.usingWebAudio;this.usingAudioTag=this.game.sound.usingAudioTag;this.externalNode=null;this.masterGainNode=null;this.gainNode=null;this._sound=null;if(this.usingWebAudio)
{this.context=this.game.sound.context;this.masterGainNode=this.game.sound.masterGain;if(this.context.createGain===undefined)
{this.gainNode=this.context.createGainNode();}
else
{this.gainNode=this.context.createGain();}
this.gainNode.gain.value=volume*this.game.sound.volume;if(connect)
{this.gainNode.connect(this.masterGainNode);}}
else if(this.usingAudioTag)
{if(this.game.cache.getSound(key)&&this.game.cache.isSoundReady(key))
{this._sound=this.game.cache.getSoundData(key);this.totalDuration=0;if(this._sound.duration)
{this.totalDuration=this._sound.duration;}}
else
{this.game.cache.onSoundUnlock.add(this.soundHasUnlocked,this);}}
this.onDecoded=new Phaser.Signal();this.onPlay=new Phaser.Signal();this.onPause=new Phaser.Signal();this.onResume=new Phaser.Signal();this.onLoop=new Phaser.Signal();this.onStop=new Phaser.Signal();this.onMute=new Phaser.Signal();this.onMarkerComplete=new Phaser.Signal();this.onFadeComplete=new Phaser.Signal();this._volume=volume;this._buffer=null;this._muted=false;this._tempMarker=0;this._tempPosition=0;this._tempVolume=0;this._muteVolume=0;this._tempLoop=0;this._paused=false;this._onDecodedEventDispatched=false;};Phaser.Sound.prototype={soundHasUnlocked:function(key){if(key===this.key)
{this._sound=this.game.cache.getSoundData(this.key);this.totalDuration=this._sound.duration;}},addMarker:function(name,start,duration,volume,loop){if(volume===undefined||volume===null){volume=1;}
if(loop===undefined){loop=false;}
this.markers[name]={name:name,start:start,stop:start+duration,volume:volume,duration:duration,durationMS:duration*1000,loop:loop};},removeMarker:function(name){delete this.markers[name];},onEndedHandler:function(){this._sound.onended=null;this.isPlaying=false;this.stop();},update:function(){if(!this.game.cache.checkSoundKey(this.key))
{this.destroy();return;}
if(this.isDecoded&&!this._onDecodedEventDispatched)
{this.onDecoded.dispatch(this);this._onDecodedEventDispatched=true;}
if(this.pendingPlayback&&this.game.cache.isSoundReady(this.key))
{this.pendingPlayback=false;this.play(this._tempMarker,this._tempPosition,this._tempVolume,this._tempLoop);}
if(this.isPlaying)
{this.currentTime=this.game.time.time-this.startTime;if(this.currentTime>=this.durationMS)
{if(this.usingWebAudio)
{if(this.loop)
{this.onLoop.dispatch(this);if(this.currentMarker==='')
{this.currentTime=0;this.startTime=this.game.time.time;}
else
{this.onMarkerComplete.dispatch(this.currentMarker,this);this.play(this.currentMarker,0,this.volume,true,true);}}
else
{if(this.currentMarker!=='')
{this.stop();}}}
else
{if(this.loop)
{this.onLoop.dispatch(this);this.play(this.currentMarker,0,this.volume,true,true);}
else
{this.stop();}}}}},loopFull:function(volume){this.play(null,0,volume,true);},play:function(marker,position,volume,loop,forceRestart){if(marker===undefined||marker===false||marker===null){marker='';}
if(forceRestart===undefined){forceRestart=true;}
if(this.isPlaying&&!this.allowMultiple&&!forceRestart&&!this.override)
{return this;}
if(this._sound&&this.isPlaying&&!this.allowMultiple&&(this.override||forceRestart))
{if(this.usingWebAudio)
{if(this.externalNode)
{this._sound.disconnect(this.externalNode);}
else
{this._sound.disconnect(this.gainNode);}
if(this._sound.stop===undefined)
{this._sound.noteOff(0);}
else
{try{this._sound.stop(0);}
catch(e){}}}
else if(this.usingAudioTag)
{this._sound.pause();this._sound.currentTime=0;}}
if(marker===''&&Object.keys(this.markers).length>0)
{return this;}
if(marker!=='')
{this.currentMarker=marker;if(this.markers[marker])
{this.position=this.markers[marker].start;this.volume=this.markers[marker].volume;this.loop=this.markers[marker].loop;this.duration=this.markers[marker].duration;this.durationMS=this.markers[marker].durationMS;if(typeof volume!=='undefined')
{this.volume=volume;}
if(typeof loop!=='undefined')
{this.loop=loop;}
this._tempMarker=marker;this._tempPosition=this.position;this._tempVolume=this.volume;this._tempLoop=this.loop;}
else
{return this;}}
else
{position=position||0;if(volume===undefined){volume=this._volume;}
if(loop===undefined){loop=this.loop;}
this.position=position;this.volume=volume;this.loop=loop;this.duration=0;this.durationMS=0;this._tempMarker=marker;this._tempPosition=position;this._tempVolume=volume;this._tempLoop=loop;}
if(this.usingWebAudio)
{if(this.game.cache.isSoundDecoded(this.key))
{this._sound=this.context.createBufferSource();if(this.externalNode)
{this._sound.connect(this.externalNode);}
else
{this._sound.connect(this.gainNode);}
this._buffer=this.game.cache.getSoundData(this.key);this._sound.buffer=this._buffer;if(this.loop&&marker==='')
{this._sound.loop=true;}
if(!this.loop&&marker==='')
{this._sound.onended=this.onEndedHandler.bind(this);}
this.totalDuration=this._sound.buffer.duration;if(this.duration===0)
{this.duration=this.totalDuration;this.durationMS=Math.ceil(this.totalDuration*1000);}
if(this._sound.start===undefined)
{this._sound.noteGrainOn(0,this.position,this.duration);}
else
{if(this.loop&&marker==='')
{this._sound.start(0,0);}
else
{this._sound.start(0,this.position,this.duration);}}
this.isPlaying=true;this.startTime=this.game.time.time;this.currentTime=0;this.stopTime=this.startTime+this.durationMS;this.onPlay.dispatch(this);}
else
{this.pendingPlayback=true;if(this.game.cache.getSound(this.key)&&this.game.cache.getSound(this.key).isDecoding===false)
{this.game.sound.decode(this.key,this);}}}
else
{if(this.game.cache.getSound(this.key)&&this.game.cache.getSound(this.key).locked)
{this.game.cache.reloadSound(this.key);this.pendingPlayback=true;}
else
{if(this._sound&&(this.game.device.cocoonJS||this._sound.readyState===4))
{this._sound.play();this.totalDuration=this._sound.duration;if(this.duration===0)
{this.duration=this.totalDuration;this.durationMS=this.totalDuration*1000;}
this._sound.currentTime=this.position;this._sound.muted=this._muted;if(this._muted)
{this._sound.volume=0;}
else
{this._sound.volume=this._volume;}
this.isPlaying=true;this.startTime=this.game.time.time;this.currentTime=0;this.stopTime=this.startTime+this.durationMS;this.onPlay.dispatch(this);}
else
{this.pendingPlayback=true;}}}
return this;},restart:function(marker,position,volume,loop){marker=marker||'';position=position||0;volume=volume||1;if(loop===undefined){loop=false;}
this.play(marker,position,volume,loop,true);},pause:function(){if(this.isPlaying&&this._sound)
{this.paused=true;this.pausedPosition=this.currentTime;this.pausedTime=this.game.time.time;this.onPause.dispatch(this);this.stop();}},resume:function(){if(this.paused&&this._sound)
{if(this.usingWebAudio)
{var p=this.position+(this.pausedPosition / 1000);this._sound=this.context.createBufferSource();this._sound.buffer=this._buffer;if(this.externalNode)
{this._sound.connect(this.externalNode);}
else
{this._sound.connect(this.gainNode);}
if(this.loop)
{this._sound.loop=true;}
if(!this.loop&&this.currentMarker==='')
{this._sound.onended=this.onEndedHandler.bind(this);}
var duration=this.duration-(this.pausedPosition / 1000);if(this._sound.start===undefined)
{this._sound.noteGrainOn(0,p,duration);}
else
{if(this.loop&&this.game.device.chrome)
{if(this.game.device.chromeVersion===42)
{this._sound.start(0);}
else
{this._sound.start(0,p);}}
else
{this._sound.start(0,p,duration);}}}
else
{this._sound.play();}
this.isPlaying=true;this.paused=false;this.startTime+=(this.game.time.time-this.pausedTime);this.onResume.dispatch(this);}},stop:function(){if(this.isPlaying&&this._sound)
{if(this.usingWebAudio)
{if(this.externalNode)
{this._sound.disconnect(this.externalNode);}
else
{this._sound.disconnect(this.gainNode);}
if(this._sound.stop===undefined)
{this._sound.noteOff(0);}
else
{try{this._sound.stop(0);}
catch(e)
{}}}
else if(this.usingAudioTag)
{this._sound.pause();this._sound.currentTime=0;}}
this.pendingPlayback=false;this.isPlaying=false;var prevMarker=this.currentMarker;if(this.currentMarker!=='')
{this.onMarkerComplete.dispatch(this.currentMarker,this);}
this.currentMarker='';if(this.fadeTween!==null)
{this.fadeTween.stop();}
if(!this.paused)
{this.onStop.dispatch(this,prevMarker);}},fadeIn:function(duration,loop,marker){if(loop===undefined){loop=false;}
if(marker===undefined){marker=this.currentMarker;}
if(this.paused)
{return;}
this.play(marker,0,0,loop);this.fadeTo(duration,1);},fadeOut:function(duration){this.fadeTo(duration,0);},fadeTo:function(duration,volume){if(!this.isPlaying||this.paused||volume===this.volume)
{return;}
if(duration===undefined){duration=1000;}
if(volume===undefined)
{console.warn("Phaser.Sound.fadeTo: No Volume Specified.");return;}
this.fadeTween=this.game.add.tween(this).to({volume:volume},duration,Phaser.Easing.Linear.None,true);this.fadeTween.onComplete.add(this.fadeComplete,this);},fadeComplete:function(){this.onFadeComplete.dispatch(this,this.volume);if(this.volume===0)
{this.stop();}},destroy:function(remove){if(remove===undefined){remove=true;}
this.stop();if(remove)
{this.game.sound.remove(this);}
else
{this.markers={};this.context=null;this._buffer=null;this.externalNode=null;this.onDecoded.dispose();this.onPlay.dispose();this.onPause.dispose();this.onResume.dispose();this.onLoop.dispose();this.onStop.dispose();this.onMute.dispose();this.onMarkerComplete.dispose();}}};Phaser.Sound.prototype.constructor=Phaser.Sound;Object.defineProperty(Phaser.Sound.prototype,"isDecoding",{get:function(){return this.game.cache.getSound(this.key).isDecoding;}});Object.defineProperty(Phaser.Sound.prototype,"isDecoded",{get:function(){return this.game.cache.isSoundDecoded(this.key);}});Object.defineProperty(Phaser.Sound.prototype,"mute",{get:function(){return(this._muted||this.game.sound.mute);},set:function(value){value=value||false;if(value===this._muted)
{return;}
if(value)
{this._muted=true;this._muteVolume=this._tempVolume;if(this.usingWebAudio)
{this.gainNode.gain.value=0;}
else if(this.usingAudioTag&&this._sound)
{this._sound.volume=0;}}
else
{this._muted=false;if(this.usingWebAudio)
{this.gainNode.gain.value=this._muteVolume;}
else if(this.usingAudioTag&&this._sound)
{this._sound.volume=this._muteVolume;}}
this.onMute.dispatch(this);}});Object.defineProperty(Phaser.Sound.prototype,"volume",{get:function(){return this._volume;},set:function(value){if(this.game.device.firefox&&this.usingAudioTag)
{value=this.game.math.clamp(value,0,1);}
if(this._muted)
{this._muteVolume=value;return;}
this._tempVolume=value;this._volume=value;if(this.usingWebAudio)
{this.gainNode.gain.value=value;}
else if(this.usingAudioTag&&this._sound)
{this._sound.volume=value;}}});Phaser.SoundManager=function(game){this.game=game;this.onSoundDecode=new Phaser.Signal();this.onVolumeChange=new Phaser.Signal();this.onMute=new Phaser.Signal();this.onUnMute=new Phaser.Signal();this.context=null;this.usingWebAudio=false;this.usingAudioTag=false;this.noAudio=false;this.connectToMaster=true;this.touchLocked=false;this.channels=32;this._codeMuted=false;this._muted=false;this._unlockSource=null;this._volume=1;this._sounds=[];this._watchList=new Phaser.ArraySet();this._watching=false;this._watchCallback=null;this._watchContext=null;};Phaser.SoundManager.prototype={boot:function(){if(this.game.device.iOS&&this.game.device.webAudio===false)
{this.channels=1;}
if(window['PhaserGlobal'])
{if(window['PhaserGlobal'].disableAudio===true)
{this.noAudio=true;this.touchLocked=false;return;}
if(window['PhaserGlobal'].disableWebAudio===true)
{this.usingAudioTag=true;this.touchLocked=false;return;}}
if(window['PhaserGlobal']&&window['PhaserGlobal'].audioContext)
{this.context=window['PhaserGlobal'].audioContext;}
else
{if(!!window['AudioContext'])
{try{this.context=new window['AudioContext']();}catch(error){this.context=null;this.usingWebAudio=false;this.touchLocked=false;}}
else if(!!window['webkitAudioContext'])
{try{this.context=new window['webkitAudioContext']();}catch(error){this.context=null;this.usingWebAudio=false;this.touchLocked=false;}}}
if(this.context===null)
{if(window['Audio']===undefined)
{this.noAudio=true;return;}
else
{this.usingAudioTag=true;}}
else
{this.usingWebAudio=true;if(this.context.createGain===undefined)
{this.masterGain=this.context.createGainNode();}
else
{this.masterGain=this.context.createGain();}
this.masterGain.gain.value=1;this.masterGain.connect(this.context.destination);}
if(!this.noAudio)
{if(!this.game.device.cocoonJS&&this.game.device.iOS||(window['PhaserGlobal']&&window['PhaserGlobal'].fakeiOSTouchLock))
{this.setTouchLock();}}},setTouchLock:function(){if(this.game.device.iOSVersion>8)
{this.game.input.touch.addTouchLockCallback(this.unlock,this,true);}
else
{this.game.input.touch.addTouchLockCallback(this.unlock,this);}
this.touchLocked=true;},unlock:function(){if(this.noAudio||!this.touchLocked||this._unlockSource!==null)
{return true;}
if(this.usingAudioTag)
{this.touchLocked=false;this._unlockSource=null;}
else if(this.usingWebAudio)
{var buffer=this.context.createBuffer(1,1,22050);this._unlockSource=this.context.createBufferSource();this._unlockSource.buffer=buffer;this._unlockSource.connect(this.context.destination);if(this._unlockSource.start===undefined)
{this._unlockSource.noteOn(0);}
else
{this._unlockSource.start(0);}}
return true;},stopAll:function(){if(this.noAudio)
{return;}
for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i])
{this._sounds[i].stop();}}},pauseAll:function(){if(this.noAudio)
{return;}
for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i])
{this._sounds[i].pause();}}},resumeAll:function(){if(this.noAudio)
{return;}
for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i])
{this._sounds[i].resume();}}},decode:function(key,sound){sound=sound||null;var soundData=this.game.cache.getSoundData(key);if(soundData)
{if(this.game.cache.isSoundDecoded(key)===false)
{this.game.cache.updateSound(key,'isDecoding',true);var _this=this;try{this.context.decodeAudioData(soundData,function(buffer){if(buffer)
{_this.game.cache.decodedSound(key,buffer);_this.onSoundDecode.dispatch(key,sound);}});}
catch(e){}}}},setDecodedCallback:function(files,callback,callbackContext){if(typeof files==='string')
{files=[files];}
this._watchList.reset();for(var i=0;i<files.length;i++)
{if(files[i]instanceof Phaser.Sound)
{if(!this.game.cache.isSoundDecoded(files[i].key))
{this._watchList.add(files[i].key);}}
else if(!this.game.cache.isSoundDecoded(files[i]))
{this._watchList.add(files[i]);}}
if(this._watchList.total===0)
{this._watching=false;callback.call(callbackContext);}
else
{this._watching=true;this._watchCallback=callback;this._watchContext=callbackContext;}},update:function(){if(this.noAudio)
{return;}
if(this.touchLocked&&this._unlockSource!==null&&(this._unlockSource.playbackState===this._unlockSource.PLAYING_STATE||this._unlockSource.playbackState===this._unlockSource.FINISHED_STATE))
{this.touchLocked=false;this._unlockSource=null;}
for(var i=0;i<this._sounds.length;i++)
{this._sounds[i].update();}
if(this._watching)
{var key=this._watchList.first;while(key)
{if(this.game.cache.isSoundDecoded(key))
{this._watchList.remove(key);}
key=this._watchList.next;}
if(this._watchList.total===0)
{this._watching=false;this._watchCallback.call(this._watchContext);}}},add:function(key,volume,loop,connect){if(volume===undefined){volume=1;}
if(loop===undefined){loop=false;}
if(connect===undefined){connect=this.connectToMaster;}
var sound=new Phaser.Sound(this.game,key,volume,loop,connect);this._sounds.push(sound);return sound;},addSprite:function(key){var audioSprite=new Phaser.AudioSprite(this.game,key);return audioSprite;},remove:function(sound){var i=this._sounds.length;while(i--)
{if(this._sounds[i]===sound)
{this._sounds[i].destroy(false);this._sounds.splice(i,1);return true;}}
return false;},removeByKey:function(key){var i=this._sounds.length;var removed=0;while(i--)
{if(this._sounds[i].key===key)
{this._sounds[i].destroy(false);this._sounds.splice(i,1);removed++;}}
return removed;},play:function(key,volume,loop){if(this.noAudio)
{return;}
var sound=this.add(key,volume,loop);sound.play();return sound;},setMute:function(){if(this._muted)
{return;}
this._muted=true;if(this.usingWebAudio)
{this._muteVolume=this.masterGain.gain.value;this.masterGain.gain.value=0;}
for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i].usingAudioTag)
{this._sounds[i].mute=true;}}
this.onMute.dispatch();},unsetMute:function(){if(!this._muted||this._codeMuted)
{return;}
this._muted=false;if(this.usingWebAudio)
{this.masterGain.gain.value=this._muteVolume;}
for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i].usingAudioTag)
{this._sounds[i].mute=false;}}
this.onUnMute.dispatch();},destroy:function(){this.stopAll();for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i])
{this._sounds[i].destroy();}}
this._sounds=[];this.onSoundDecode.dispose();if(this.context&&window['PhaserGlobal'])
{window['PhaserGlobal'].audioContext=this.context;}}};Phaser.SoundManager.prototype.constructor=Phaser.SoundManager;Object.defineProperty(Phaser.SoundManager.prototype,"mute",{get:function(){return this._muted;},set:function(value){value=value||false;if(value)
{if(this._muted)
{return;}
this._codeMuted=true;this.setMute();}
else
{if(!this._muted)
{return;}
this._codeMuted=false;this.unsetMute();}}});Object.defineProperty(Phaser.SoundManager.prototype,"volume",{get:function(){return this._volume;},set:function(value){if(value<0)
{value=0;}
else if(value>1)
{value=1;}
if(this._volume!==value)
{this._volume=value;if(this.usingWebAudio)
{this.masterGain.gain.value=value;}
else
{for(var i=0;i<this._sounds.length;i++)
{if(this._sounds[i].usingAudioTag)
{this._sounds[i].volume=this._sounds[i].volume*value;}}}
this.onVolumeChange.dispatch(value);}}});Phaser.ScaleManager=function(game,width,height){this.game=game;this.dom=Phaser.DOM;this.grid=null;this.width=0;this.height=0;this.minWidth=null;this.maxWidth=null;this.minHeight=null;this.maxHeight=null;this.offset=new Phaser.Point();this.forceLandscape=false;this.forcePortrait=false;this.incorrectOrientation=false;this._pageAlignHorizontally=false;this._pageAlignVertically=false;this.onOrientationChange=new Phaser.Signal();this.enterIncorrectOrientation=new Phaser.Signal();this.leaveIncorrectOrientation=new Phaser.Signal();this.fullScreenTarget=null;this._createdFullScreenTarget=null;this.onFullScreenInit=new Phaser.Signal();this.onFullScreenChange=new Phaser.Signal();this.onFullScreenError=new Phaser.Signal();this.screenOrientation=this.dom.getScreenOrientation();this.scaleFactor=new Phaser.Point(1,1);this.scaleFactorInversed=new Phaser.Point(1,1);this.margin={left:0,top:0,right:0,bottom:0,x:0,y:0};this.bounds=new Phaser.Rectangle();this.aspectRatio=0;this.sourceAspectRatio=0;this.event=null;this.windowConstraints={right:'layout',bottom:''};this.compatibility={supportsFullScreen:false,orientationFallback:null,noMargins:false,scrollTo:null,forceMinimumDocumentHeight:false,canExpandParent:true,clickTrampoline:''};this._scaleMode=Phaser.ScaleManager.NO_SCALE;this._fullScreenScaleMode=Phaser.ScaleManager.NO_SCALE;this.parentIsWindow=false;this.parentNode=null;this.parentScaleFactor=new Phaser.Point(1,1);this.trackParentInterval=2000;this.onSizeChange=new Phaser.Signal();this.onResize=null;this.onResizeContext=null;this._pendingScaleMode=null;this._fullScreenRestore=null;this._gameSize=new Phaser.Rectangle();this._userScaleFactor=new Phaser.Point(1,1);this._userScaleTrim=new Phaser.Point(0,0);this._lastUpdate=0;this._updateThrottle=0;this._updateThrottleReset=100;this._parentBounds=new Phaser.Rectangle();this._tempBounds=new Phaser.Rectangle();this._lastReportedCanvasSize=new Phaser.Rectangle();this._lastReportedGameSize=new Phaser.Rectangle();this._booted=false;if(game.config)
{this.parseConfig(game.config);}
this.setupScale(width,height);};Phaser.ScaleManager.EXACT_FIT=0;Phaser.ScaleManager.NO_SCALE=1;Phaser.ScaleManager.SHOW_ALL=2;Phaser.ScaleManager.RESIZE=3;Phaser.ScaleManager.USER_SCALE=4;Phaser.ScaleManager.prototype={boot:function(){var compat=this.compatibility;compat.supportsFullScreen=this.game.device.fullscreen&&!this.game.device.cocoonJS;if(!this.game.device.iPad&&!this.game.device.webApp&&!this.game.device.desktop)
{if(this.game.device.android&&!this.game.device.chrome)
{compat.scrollTo=new Phaser.Point(0,1);}
else
{compat.scrollTo=new Phaser.Point(0,0);}}
if(this.game.device.desktop)
{compat.orientationFallback='screen';compat.clickTrampoline='when-not-mouse';}
else
{compat.orientationFallback='';compat.clickTrampoline='';}
var _this=this;this._orientationChange=function(event){return _this.orientationChange(event);};this._windowResize=function(event){return _this.windowResize(event);};window.addEventListener('orientationchange',this._orientationChange,false);window.addEventListener('resize',this._windowResize,false);if(this.compatibility.supportsFullScreen)
{this._fullScreenChange=function(event){return _this.fullScreenChange(event);};this._fullScreenError=function(event){return _this.fullScreenError(event);};document.addEventListener('webkitfullscreenchange',this._fullScreenChange,false);document.addEventListener('mozfullscreenchange',this._fullScreenChange,false);document.addEventListener('MSFullscreenChange',this._fullScreenChange,false);document.addEventListener('fullscreenchange',this._fullScreenChange,false);document.addEventListener('webkitfullscreenerror',this._fullScreenError,false);document.addEventListener('mozfullscreenerror',this._fullScreenError,false);document.addEventListener('MSFullscreenError',this._fullScreenError,false);document.addEventListener('fullscreenerror',this._fullScreenError,false);}
this.game.onResume.add(this._gameResumed,this);this.dom.getOffset(this.game.canvas,this.offset);this.bounds.setTo(this.offset.x,this.offset.y,this.width,this.height);this.setGameSize(this.game.width,this.game.height);this.screenOrientation=this.dom.getScreenOrientation(this.compatibility.orientationFallback);if(Phaser.FlexGrid)
{this.grid=new Phaser.FlexGrid(this,this.width,this.height);}
this._booted=true;if(this._pendingScaleMode)
{this.scaleMode=this._pendingScaleMode;this._pendingScaleMode=null;}},parseConfig:function(config){if(config['scaleMode'])
{if(this._booted)
{this.scaleMode=config['scaleMode'];}
else
{this._pendingScaleMode=config['scaleMode'];}}
if(config['fullScreenScaleMode'])
{this.fullScreenScaleMode=config['fullScreenScaleMode'];}
if(config['fullScreenTarget'])
{this.fullScreenTarget=config['fullScreenTarget'];}},setupScale:function(width,height){var target;var rect=new Phaser.Rectangle();if(this.game.parent!=='')
{if(typeof this.game.parent==='string')
{target=document.getElementById(this.game.parent);}
else if(this.game.parent&&this.game.parent.nodeType===1)
{target=this.game.parent;}}
if(!target)
{this.parentNode=null;this.parentIsWindow=true;rect.width=this.dom.visualBounds.width;rect.height=this.dom.visualBounds.height;this.offset.set(0,0);}
else
{this.parentNode=target;this.parentIsWindow=false;this.getParentBounds(this._parentBounds);rect.width=this._parentBounds.width;rect.height=this._parentBounds.height;this.offset.set(this._parentBounds.x,this._parentBounds.y);}
var newWidth=0;var newHeight=0;if(typeof width==='number')
{newWidth=width;}
else
{this.parentScaleFactor.x=parseInt(width,10)/ 100;newWidth=rect.width*this.parentScaleFactor.x;}
if(typeof height==='number')
{newHeight=height;}
else
{this.parentScaleFactor.y=parseInt(height,10)/ 100;newHeight=rect.height*this.parentScaleFactor.y;}
this._gameSize.setTo(0,0,newWidth,newHeight);this.updateDimensions(newWidth,newHeight,false);},_gameResumed:function(){this.queueUpdate(true);},setGameSize:function(width,height){this._gameSize.setTo(0,0,width,height);if(this.currentScaleMode!==Phaser.ScaleManager.RESIZE)
{this.updateDimensions(width,height,true);}
this.queueUpdate(true);},setUserScale:function(hScale,vScale,hTrim,vTrim){this._userScaleFactor.setTo(hScale,vScale);this._userScaleTrim.setTo(hTrim|0,vTrim|0);this.queueUpdate(true);},setResizeCallback:function(callback,context){this.onResize=callback;this.onResizeContext=context;},signalSizeChange:function(){if(!Phaser.Rectangle.sameDimensions(this,this._lastReportedCanvasSize)||!Phaser.Rectangle.sameDimensions(this.game,this._lastReportedGameSize))
{var width=this.width;var height=this.height;this._lastReportedCanvasSize.setTo(0,0,width,height);this._lastReportedGameSize.setTo(0,0,this.game.width,this.game.height);if(this.grid)
{this.grid.onResize(width,height);}
this.onSizeChange.dispatch(this,width,height);if(this.currentScaleMode===Phaser.ScaleManager.RESIZE)
{this.game.state.resize(width,height);this.game.load.resize(width,height);}}},setMinMax:function(minWidth,minHeight,maxWidth,maxHeight){this.minWidth=minWidth;this.minHeight=minHeight;if(typeof maxWidth!=='undefined')
{this.maxWidth=maxWidth;}
if(typeof maxHeight!=='undefined')
{this.maxHeight=maxHeight;}},preUpdate:function(){if(this.game.time.time<(this._lastUpdate+this._updateThrottle))
{return;}
var prevThrottle=this._updateThrottle;this._updateThrottleReset=prevThrottle>=400?0:100;this.dom.getOffset(this.game.canvas,this.offset);var prevWidth=this._parentBounds.width;var prevHeight=this._parentBounds.height;var bounds=this.getParentBounds(this._parentBounds);var boundsChanged=bounds.width!==prevWidth||bounds.height!==prevHeight;var orientationChanged=this.updateOrientationState();if(boundsChanged||orientationChanged)
{if(this.onResize)
{this.onResize.call(this.onResizeContext,this,bounds);}
this.updateLayout();this.signalSizeChange();}
var throttle=this._updateThrottle*2;if(this._updateThrottle<prevThrottle)
{throttle=Math.min(prevThrottle,this._updateThrottleReset);}
this._updateThrottle=Phaser.Math.clamp(throttle,25,this.trackParentInterval);this._lastUpdate=this.game.time.time;},pauseUpdate:function(){this.preUpdate();this._updateThrottle=this.trackParentInterval;},updateDimensions:function(width,height,resize){this.width=width*this.parentScaleFactor.x;this.height=height*this.parentScaleFactor.y;this.game.width=this.width;this.game.height=this.height;this.sourceAspectRatio=this.width / this.height;this.updateScalingAndBounds();if(resize)
{this.game.renderer.resize(this.width,this.height);this.game.camera.setSize(this.width,this.height);this.game.world.resize(this.width,this.height);}},updateScalingAndBounds:function(){this.scaleFactor.x=this.game.width / this.width;this.scaleFactor.y=this.game.height / this.height;this.scaleFactorInversed.x=this.width / this.game.width;this.scaleFactorInversed.y=this.height / this.game.height;this.aspectRatio=this.width / this.height;if(this.game.canvas)
{this.dom.getOffset(this.game.canvas,this.offset);}
this.bounds.setTo(this.offset.x,this.offset.y,this.width,this.height);if(this.game.input&&this.game.input.scale)
{this.game.input.scale.setTo(this.scaleFactor.x,this.scaleFactor.y);}},forceOrientation:function(forceLandscape,forcePortrait){if(forcePortrait===undefined){forcePortrait=false;}
this.forceLandscape=forceLandscape;this.forcePortrait=forcePortrait;this.queueUpdate(true);},classifyOrientation:function(orientation){if(orientation==='portrait-primary'||orientation==='portrait-secondary')
{return'portrait';}
else if(orientation==='landscape-primary'||orientation==='landscape-secondary')
{return'landscape';}
else
{return null;}},updateOrientationState:function(){var previousOrientation=this.screenOrientation;var previouslyIncorrect=this.incorrectOrientation;this.screenOrientation=this.dom.getScreenOrientation(this.compatibility.orientationFallback);this.incorrectOrientation=(this.forceLandscape&&!this.isLandscape)||(this.forcePortrait&&!this.isPortrait);var changed=previousOrientation!==this.screenOrientation;var correctnessChanged=previouslyIncorrect!==this.incorrectOrientation;if(correctnessChanged)
{if(this.incorrectOrientation)
{this.enterIncorrectOrientation.dispatch();}
else
{this.leaveIncorrectOrientation.dispatch();}}
if(changed||correctnessChanged)
{this.onOrientationChange.dispatch(this,previousOrientation,previouslyIncorrect);}
return changed||correctnessChanged;},orientationChange:function(event){this.event=event;this.queueUpdate(true);},windowResize:function(event){this.event=event;this.queueUpdate(true);},scrollTop:function(){var scrollTo=this.compatibility.scrollTo;if(scrollTo)
{window.scrollTo(scrollTo.x,scrollTo.y);}},refresh:function(){this.scrollTop();this.queueUpdate(true);},updateLayout:function(){var scaleMode=this.currentScaleMode;if(scaleMode===Phaser.ScaleManager.RESIZE)
{this.reflowGame();return;}
this.scrollTop();if(this.compatibility.forceMinimumDocumentHeight)
{document.documentElement.style.minHeight=window.innerHeight+'px';}
if(this.incorrectOrientation)
{this.setMaximum();}
else
{if(scaleMode===Phaser.ScaleManager.EXACT_FIT)
{this.setExactFit();}
else if(scaleMode===Phaser.ScaleManager.SHOW_ALL)
{if(!this.isFullScreen&&this.boundingParent&&this.compatibility.canExpandParent)
{this.setShowAll(true);this.resetCanvas();this.setShowAll();}
else
{this.setShowAll();}}
else if(scaleMode===Phaser.ScaleManager.NO_SCALE)
{this.width=this.game.width;this.height=this.game.height;}
else if(scaleMode===Phaser.ScaleManager.USER_SCALE)
{this.width=(this.game.width*this._userScaleFactor.x)-this._userScaleTrim.x;this.height=(this.game.height*this._userScaleFactor.y)-this._userScaleTrim.y;}}
if(!this.compatibility.canExpandParent&&(scaleMode===Phaser.ScaleManager.SHOW_ALL||scaleMode===Phaser.ScaleManager.USER_SCALE))
{var bounds=this.getParentBounds(this._tempBounds);this.width=Math.min(this.width,bounds.width);this.height=Math.min(this.height,bounds.height);}
this.width=this.width|0;this.height=this.height|0;this.reflowCanvas();},getParentBounds:function(target){var bounds=target||new Phaser.Rectangle();var parentNode=this.boundingParent;var visualBounds=this.dom.visualBounds;var layoutBounds=this.dom.layoutBounds;if(!parentNode)
{bounds.setTo(0,0,visualBounds.width,visualBounds.height);}
else
{var clientRect=parentNode.getBoundingClientRect();var parentRect=(parentNode.offsetParent)?parentNode.offsetParent.getBoundingClientRect():parentNode.getBoundingClientRect();bounds.setTo(clientRect.left-parentRect.left,clientRect.top-parentRect.top,clientRect.width,clientRect.height);var wc=this.windowConstraints;if(wc.right)
{var windowBounds=wc.right==='layout'?layoutBounds:visualBounds;bounds.right=Math.min(bounds.right,windowBounds.width);}
if(wc.bottom)
{var windowBounds=wc.bottom==='layout'?layoutBounds:visualBounds;bounds.bottom=Math.min(bounds.bottom,windowBounds.height);}}
bounds.setTo(Math.round(bounds.x),Math.round(bounds.y),Math.round(bounds.width),Math.round(bounds.height));return bounds;},alignCanvas:function(horizontal,vertical){var parentBounds=this.getParentBounds(this._tempBounds);var canvas=this.game.canvas;var margin=this.margin;if(horizontal)
{margin.left=margin.right=0;var canvasBounds=canvas.getBoundingClientRect();if(this.width<parentBounds.width&&!this.incorrectOrientation)
{var currentEdge=canvasBounds.left-parentBounds.x;var targetEdge=(parentBounds.width / 2)-(this.width / 2);targetEdge=Math.max(targetEdge,0);var offset=targetEdge-currentEdge;margin.left=Math.round(offset);}
canvas.style.marginLeft=margin.left+'px';if(margin.left!==0)
{margin.right=-(parentBounds.width-canvasBounds.width-margin.left);canvas.style.marginRight=margin.right+'px';}}
if(vertical)
{margin.top=margin.bottom=0;var canvasBounds=canvas.getBoundingClientRect();if(this.height<parentBounds.height&&!this.incorrectOrientation)
{var currentEdge=canvasBounds.top-parentBounds.y;var targetEdge=(parentBounds.height / 2)-(this.height / 2);targetEdge=Math.max(targetEdge,0);var offset=targetEdge-currentEdge;margin.top=Math.round(offset);}
canvas.style.marginTop=margin.top+'px';if(margin.top!==0)
{margin.bottom=-(parentBounds.height-canvasBounds.height-margin.top);canvas.style.marginBottom=margin.bottom+'px';}}
margin.x=margin.left;margin.y=margin.top;},reflowGame:function(){this.resetCanvas('','');var bounds=this.getParentBounds(this._tempBounds);this.updateDimensions(bounds.width,bounds.height,true);},reflowCanvas:function(){if(!this.incorrectOrientation)
{this.width=Phaser.Math.clamp(this.width,this.minWidth||0,this.maxWidth||this.width);this.height=Phaser.Math.clamp(this.height,this.minHeight||0,this.maxHeight||this.height);}
this.resetCanvas();if(!this.compatibility.noMargins)
{if(this.isFullScreen&&this._createdFullScreenTarget)
{this.alignCanvas(true,true);}
else
{this.alignCanvas(this.pageAlignHorizontally,this.pageAlignVertically);}}
this.updateScalingAndBounds();},resetCanvas:function(cssWidth,cssHeight){if(cssWidth===undefined){cssWidth=this.width+'px';}
if(cssHeight===undefined){cssHeight=this.height+'px';}
var canvas=this.game.canvas;if(!this.compatibility.noMargins)
{canvas.style.marginLeft='';canvas.style.marginTop='';canvas.style.marginRight='';canvas.style.marginBottom='';}
canvas.style.width=cssWidth;canvas.style.height=cssHeight;},queueUpdate:function(force){if(force)
{this._parentBounds.width=0;this._parentBounds.height=0;}
this._updateThrottle=this._updateThrottleReset;},reset:function(clearWorld){if(clearWorld&&this.grid)
{this.grid.reset();}},setMaximum:function(){this.width=this.dom.visualBounds.width;this.height=this.dom.visualBounds.height;},setShowAll:function(expanding){var bounds=this.getParentBounds(this._tempBounds);var width=bounds.width;var height=bounds.height;var multiplier;if(expanding)
{multiplier=Math.max((height / this.game.height),(width / this.game.width));}
else
{multiplier=Math.min((height / this.game.height),(width / this.game.width));}
this.width=Math.round(this.game.width*multiplier);this.height=Math.round(this.game.height*multiplier);},setExactFit:function(){var bounds=this.getParentBounds(this._tempBounds);this.width=bounds.width;this.height=bounds.height;if(this.isFullScreen)
{return;}
if(this.maxWidth)
{this.width=Math.min(this.width,this.maxWidth);}
if(this.maxHeight)
{this.height=Math.min(this.height,this.maxHeight);}},createFullScreenTarget:function(){var fsTarget=document.createElement('div');fsTarget.style.margin='0';fsTarget.style.padding='0';fsTarget.style.background='#000';return fsTarget;},startFullScreen:function(antialias,allowTrampoline){if(this.isFullScreen)
{return false;}
if(!this.compatibility.supportsFullScreen)
{var _this=this;setTimeout(function(){_this.fullScreenError();},10);return;}
if(this.compatibility.clickTrampoline==='when-not-mouse')
{var input=this.game.input;if(input.activePointer&&input.activePointer!==input.mousePointer&&(allowTrampoline||allowTrampoline!==false))
{input.activePointer.addClickTrampoline("startFullScreen",this.startFullScreen,this,[antialias,false]);return;}}
if(typeof antialias!=='undefined'&&this.game.renderType===Phaser.CANVAS)
{this.game.stage.smoothed=antialias;}
var fsTarget=this.fullScreenTarget;if(!fsTarget)
{this.cleanupCreatedTarget();this._createdFullScreenTarget=this.createFullScreenTarget();fsTarget=this._createdFullScreenTarget;}
var initData={targetElement:fsTarget};this.onFullScreenInit.dispatch(this,initData);if(this._createdFullScreenTarget)
{var canvas=this.game.canvas;var parent=canvas.parentNode;parent.insertBefore(fsTarget,canvas);fsTarget.appendChild(canvas);}
if(this.game.device.fullscreenKeyboard)
{fsTarget[this.game.device.requestFullscreen](Element.ALLOW_KEYBOARD_INPUT);}
else
{fsTarget[this.game.device.requestFullscreen]();}
return true;},stopFullScreen:function(){if(!this.isFullScreen||!this.compatibility.supportsFullScreen)
{return false;}
document[this.game.device.cancelFullscreen]();return true;},cleanupCreatedTarget:function(){var fsTarget=this._createdFullScreenTarget;if(fsTarget&&fsTarget.parentNode)
{var parent=fsTarget.parentNode;parent.insertBefore(this.game.canvas,fsTarget);parent.removeChild(fsTarget);}
this._createdFullScreenTarget=null;},prepScreenMode:function(enteringFullscreen){var createdTarget=!!this._createdFullScreenTarget;var fsTarget=this._createdFullScreenTarget||this.fullScreenTarget;if(enteringFullscreen)
{if(createdTarget||this.fullScreenScaleMode===Phaser.ScaleManager.EXACT_FIT)
{if(fsTarget!==this.game.canvas)
{this._fullScreenRestore={targetWidth:fsTarget.style.width,targetHeight:fsTarget.style.height};fsTarget.style.width='100%';fsTarget.style.height='100%';}}}
else
{if(this._fullScreenRestore)
{fsTarget.style.width=this._fullScreenRestore.targetWidth;fsTarget.style.height=this._fullScreenRestore.targetHeight;this._fullScreenRestore=null;}
this.updateDimensions(this._gameSize.width,this._gameSize.height,true);this.resetCanvas();}},fullScreenChange:function(event){this.event=event;if(this.isFullScreen)
{this.prepScreenMode(true);this.updateLayout();this.queueUpdate(true);}
else
{this.prepScreenMode(false);this.cleanupCreatedTarget();this.updateLayout();this.queueUpdate(true);}
this.onFullScreenChange.dispatch(this,this.width,this.height);},fullScreenError:function(event){this.event=event;this.cleanupCreatedTarget();console.warn('Phaser.ScaleManager: requestFullscreen failed or device does not support the Fullscreen API');this.onFullScreenError.dispatch(this);},scaleSprite:function(sprite,width,height,letterBox){if(width===undefined){width=this.width;}
if(height===undefined){height=this.height;}
if(letterBox===undefined){letterBox=false;}
if(!sprite||!sprite['scale'])
{return sprite;}
sprite.scale.x=1;sprite.scale.y=1;if((sprite.width<=0)||(sprite.height<=0)||(width<=0)||(height<=0))
{return sprite;}
var scaleX1=width;var scaleY1=(sprite.height*width)/ sprite.width;var scaleX2=(sprite.width*height)/ sprite.height;var scaleY2=height;var scaleOnWidth=(scaleX2>width);if(scaleOnWidth)
{scaleOnWidth=letterBox;}
else
{scaleOnWidth=!letterBox;}
if(scaleOnWidth)
{sprite.width=Math.floor(scaleX1);sprite.height=Math.floor(scaleY1);}
else
{sprite.width=Math.floor(scaleX2);sprite.height=Math.floor(scaleY2);}
return sprite;},destroy:function(){this.game.onResume.remove(this._gameResumed,this);window.removeEventListener('orientationchange',this._orientationChange,false);window.removeEventListener('resize',this._windowResize,false);if(this.compatibility.supportsFullScreen)
{document.removeEventListener('webkitfullscreenchange',this._fullScreenChange,false);document.removeEventListener('mozfullscreenchange',this._fullScreenChange,false);document.removeEventListener('MSFullscreenChange',this._fullScreenChange,false);document.removeEventListener('fullscreenchange',this._fullScreenChange,false);document.removeEventListener('webkitfullscreenerror',this._fullScreenError,false);document.removeEventListener('mozfullscreenerror',this._fullScreenError,false);document.removeEventListener('MSFullscreenError',this._fullScreenError,false);document.removeEventListener('fullscreenerror',this._fullScreenError,false);}}};Phaser.ScaleManager.prototype.constructor=Phaser.ScaleManager;Object.defineProperty(Phaser.ScaleManager.prototype,"boundingParent",{get:function(){if(this.parentIsWindow||(this.isFullScreen&&!this._createdFullScreenTarget))
{return null;}
var parentNode=this.game.canvas&&this.game.canvas.parentNode;return parentNode||null;}});Object.defineProperty(Phaser.ScaleManager.prototype,"scaleMode",{get:function(){return this._scaleMode;},set:function(value){if(value!==this._scaleMode)
{if(!this.isFullScreen)
{this.updateDimensions(this._gameSize.width,this._gameSize.height,true);this.queueUpdate(true);}
this._scaleMode=value;}
return this._scaleMode;}});Object.defineProperty(Phaser.ScaleManager.prototype,"fullScreenScaleMode",{get:function(){return this._fullScreenScaleMode;},set:function(value){if(value!==this._fullScreenScaleMode)
{if(this.isFullScreen)
{this.prepScreenMode(false);this._fullScreenScaleMode=value;this.prepScreenMode(true);this.queueUpdate(true);}
else
{this._fullScreenScaleMode=value;}}
return this._fullScreenScaleMode;}});Object.defineProperty(Phaser.ScaleManager.prototype,"currentScaleMode",{get:function(){return this.isFullScreen?this._fullScreenScaleMode:this._scaleMode;}});Object.defineProperty(Phaser.ScaleManager.prototype,"pageAlignHorizontally",{get:function(){return this._pageAlignHorizontally;},set:function(value){if(value!==this._pageAlignHorizontally)
{this._pageAlignHorizontally=value;this.queueUpdate(true);}}});Object.defineProperty(Phaser.ScaleManager.prototype,"pageAlignVertically",{get:function(){return this._pageAlignVertically;},set:function(value){if(value!==this._pageAlignVertically)
{this._pageAlignVertically=value;this.queueUpdate(true);}}});Object.defineProperty(Phaser.ScaleManager.prototype,"isFullScreen",{get:function(){return!!(document['fullscreenElement']||document['webkitFullscreenElement']||document['mozFullScreenElement']||document['msFullscreenElement']);}});Object.defineProperty(Phaser.ScaleManager.prototype,"isPortrait",{get:function(){return this.classifyOrientation(this.screenOrientation)==='portrait';}});Object.defineProperty(Phaser.ScaleManager.prototype,"isLandscape",{get:function(){return this.classifyOrientation(this.screenOrientation)==='landscape';}});Object.defineProperty(Phaser.ScaleManager.prototype,"isGamePortrait",{get:function(){return(this.height>this.width);}});Object.defineProperty(Phaser.ScaleManager.prototype,"isGameLandscape",{get:function(){return(this.width>this.height);}});Phaser.Utils.Debug=function(game){this.game=game;this.sprite=null;this.bmd=null;this.canvas=null;this.context=null;this.font='14px Courier';this.columnWidth=100;this.lineHeight=16;this.renderShadow=true;this.currentX=0;this.currentY=0;this.currentAlpha=1;this.dirty=false;};Phaser.Utils.Debug.prototype={boot:function(){if(this.game.renderType===Phaser.CANVAS)
{this.context=this.game.context;}
else
{this.bmd=this.game.make.bitmapData(this.game.width,this.game.height);this.sprite=this.game.make.image(0,0,this.bmd);this.game.stage.addChild(this.sprite);this.canvas=PIXI.CanvasPool.create(this,this.game.width,this.game.height);this.context=this.canvas.getContext('2d');}},preUpdate:function(){if(this.dirty&&this.sprite)
{this.bmd.clear();this.bmd.draw(this.canvas,0,0);this.context.clearRect(0,0,this.game.width,this.game.height);this.dirty=false;}},reset:function(){if(this.context)
{this.context.clearRect(0,0,this.game.width,this.game.height);}
if(this.sprite)
{this.bmd.clear();}},start:function(x,y,color,columnWidth){if(typeof x!=='number'){x=0;}
if(typeof y!=='number'){y=0;}
color=color||'rgb(255,255,255)';if(columnWidth===undefined){columnWidth=0;}
this.currentX=x;this.currentY=y;this.currentColor=color;this.columnWidth=columnWidth;this.dirty=true;this.context.save();this.context.setTransform(1,0,0,1,0,0);this.context.strokeStyle=color;this.context.fillStyle=color;this.context.font=this.font;this.context.globalAlpha=this.currentAlpha;},stop:function(){this.context.restore();},line:function(){var x=this.currentX;for(var i=0;i<arguments.length;i++)
{if(this.renderShadow)
{this.context.fillStyle='rgb(0,0,0)';this.context.fillText(arguments[i],x+1,this.currentY+1);this.context.fillStyle=this.currentColor;}
this.context.fillText(arguments[i],x,this.currentY);x+=this.columnWidth;}
this.currentY+=this.lineHeight;},soundInfo:function(sound,x,y,color){this.start(x,y,color);this.line('Sound: '+sound.key+' Locked: '+sound.game.sound.touchLocked);this.line('Is Ready?: '+this.game.cache.isSoundReady(sound.key)+' Pending Playback: '+sound.pendingPlayback);this.line('Decoded: '+sound.isDecoded+' Decoding: '+sound.isDecoding);this.line('Total Duration: '+sound.totalDuration+' Playing: '+sound.isPlaying);this.line('Time: '+sound.currentTime);this.line('Volume: '+sound.volume+' Muted: '+sound.mute);this.line('WebAudio: '+sound.usingWebAudio+' Audio: '+sound.usingAudioTag);if(sound.currentMarker!=='')
{this.line('Marker: '+sound.currentMarker+' Duration: '+sound.duration+' (ms: '+sound.durationMS+')');this.line('Start: '+sound.markers[sound.currentMarker].start+' Stop: '+sound.markers[sound.currentMarker].stop);this.line('Position: '+sound.position);}
this.stop();},cameraInfo:function(camera,x,y,color){this.start(x,y,color);this.line('Camera ('+camera.width+' x '+camera.height+')');this.line('X: '+camera.x+' Y: '+camera.y);if(camera.bounds)
{this.line('Bounds x: '+camera.bounds.x+' Y: '+camera.bounds.y+' w: '+camera.bounds.width+' h: '+camera.bounds.height);}
this.line('View x: '+camera.view.x+' Y: '+camera.view.y+' w: '+camera.view.width+' h: '+camera.view.height);this.line('Total in view: '+camera.totalInView);this.stop();},timer:function(timer,x,y,color){this.start(x,y,color);this.line('Timer (running: '+timer.running+' expired: '+timer.expired+')');this.line('Next Tick: '+timer.next+' Duration: '+timer.duration);this.line('Paused: '+timer.paused+' Length: '+timer.length);this.stop();},pointer:function(pointer,hideIfUp,downColor,upColor,color){if(pointer==null)
{return;}
if(hideIfUp===undefined){hideIfUp=false;}
downColor=downColor||'rgba(0,255,0,0.5)';upColor=upColor||'rgba(255,0,0,0.5)';if(hideIfUp===true&&pointer.isUp===true)
{return;}
this.start(pointer.x,pointer.y-100,color);this.context.beginPath();this.context.arc(pointer.x,pointer.y,pointer.circle.radius,0,Math.PI*2);if(pointer.active)
{this.context.fillStyle=downColor;}
else
{this.context.fillStyle=upColor;}
this.context.fill();this.context.closePath();this.context.beginPath();this.context.moveTo(pointer.positionDown.x,pointer.positionDown.y);this.context.lineTo(pointer.position.x,pointer.position.y);this.context.lineWidth=2;this.context.stroke();this.context.closePath();this.line('ID: '+pointer.id+" Active: "+pointer.active);this.line('World X: '+pointer.worldX+" World Y: "+pointer.worldY);this.line('Screen X: '+pointer.x+" Screen Y: "+pointer.y+" In: "+pointer.withinGame);this.line('Duration: '+pointer.duration+" ms");this.line('is Down: '+pointer.isDown+" is Up: "+pointer.isUp);this.stop();},spriteInputInfo:function(sprite,x,y,color){this.start(x,y,color);this.line('Sprite Input: ('+sprite.width+' x '+sprite.height+')');this.line('x: '+sprite.input.pointerX().toFixed(1)+' y: '+sprite.input.pointerY().toFixed(1));this.line('over: '+sprite.input.pointerOver()+' duration: '+sprite.input.overDuration().toFixed(0));this.line('down: '+sprite.input.pointerDown()+' duration: '+sprite.input.downDuration().toFixed(0));this.line('just over: '+sprite.input.justOver()+' just out: '+sprite.input.justOut());this.stop();},key:function(key,x,y,color){this.start(x,y,color,150);this.line('Key:',key.keyCode,'isDown:',key.isDown);this.line('justDown:',key.justDown,'justUp:',key.justUp);this.line('Time Down:',key.timeDown.toFixed(0),'duration:',key.duration.toFixed(0));this.stop();},inputInfo:function(x,y,color){this.start(x,y,color);this.line('Input');this.line('X: '+this.game.input.x+' Y: '+this.game.input.y);this.line('World X: '+this.game.input.worldX+' World Y: '+this.game.input.worldY);this.line('Scale X: '+this.game.input.scale.x.toFixed(1)+' Scale Y: '+this.game.input.scale.x.toFixed(1));this.line('Screen X: '+this.game.input.activePointer.screenX+' Screen Y: '+this.game.input.activePointer.screenY);this.stop();},spriteBounds:function(sprite,color,filled){var bounds=sprite.getBounds();bounds.x+=this.game.camera.x;bounds.y+=this.game.camera.y;this.rectangle(bounds,color,filled);},ropeSegments:function(rope,color,filled){var segments=rope.segments;var self=this;segments.forEach(function(segment){self.rectangle(segment,color,filled);},this);},spriteInfo:function(sprite,x,y,color){this.start(x,y,color);this.line('Sprite: '+' ('+sprite.width+' x '+sprite.height+') anchor: '+sprite.anchor.x+' x '+sprite.anchor.y);this.line('x: '+sprite.x.toFixed(1)+' y: '+sprite.y.toFixed(1));this.line('angle: '+sprite.angle.toFixed(1)+' rotation: '+sprite.rotation.toFixed(1));this.line('visible: '+sprite.visible+' in camera: '+sprite.inCamera);this.line('bounds x: '+sprite._bounds.x.toFixed(1)+' y: '+sprite._bounds.y.toFixed(1)+' w: '+sprite._bounds.width.toFixed(1)+' h: '+sprite._bounds.height.toFixed(1));this.stop();},spriteCoords:function(sprite,x,y,color){this.start(x,y,color,100);if(sprite.name)
{this.line(sprite.name);}
this.line('x:',sprite.x.toFixed(2),'y:',sprite.y.toFixed(2));this.line('pos x:',sprite.position.x.toFixed(2),'pos y:',sprite.position.y.toFixed(2));this.line('world x:',sprite.world.x.toFixed(2),'world y:',sprite.world.y.toFixed(2));this.stop();},lineInfo:function(line,x,y,color){this.start(x,y,color,80);this.line('start.x:',line.start.x.toFixed(2),'start.y:',line.start.y.toFixed(2));this.line('end.x:',line.end.x.toFixed(2),'end.y:',line.end.y.toFixed(2));this.line('length:',line.length.toFixed(2),'angle:',line.angle);this.stop();},pixel:function(x,y,color,size){size=size||2;this.start();this.context.fillStyle=color;this.context.fillRect(x,y,size,size);this.stop();},geom:function(object,color,filled,forceType){if(filled===undefined){filled=true;}
if(forceType===undefined){forceType=0;}
color=color||'rgba(0,255,0,0.4)';this.start();this.context.fillStyle=color;this.context.strokeStyle=color;if(object instanceof Phaser.Rectangle||forceType===1)
{if(filled)
{this.context.fillRect(object.x-this.game.camera.x,object.y-this.game.camera.y,object.width,object.height);}
else
{this.context.strokeRect(object.x-this.game.camera.x,object.y-this.game.camera.y,object.width,object.height);}}
else if(object instanceof Phaser.Circle||forceType===2)
{this.context.beginPath();this.context.arc(object.x-this.game.camera.x,object.y-this.game.camera.y,object.radius,0,Math.PI*2,false);this.context.closePath();if(filled)
{this.context.fill();}
else
{this.context.stroke();}}
else if(object instanceof Phaser.Point||forceType===3)
{this.context.fillRect(object.x-this.game.camera.x,object.y-this.game.camera.y,4,4);}
else if(object instanceof Phaser.Line||forceType===4)
{this.context.lineWidth=1;this.context.beginPath();this.context.moveTo((object.start.x+0.5)-this.game.camera.x,(object.start.y+0.5)-this.game.camera.y);this.context.lineTo((object.end.x+0.5)-this.game.camera.x,(object.end.y+0.5)-this.game.camera.y);this.context.closePath();this.context.stroke();}
this.stop();},rectangle:function(object,color,filled){if(filled===undefined){filled=true;}
color=color||'rgba(0, 255, 0, 0.4)';this.start();if(filled)
{this.context.fillStyle=color;this.context.fillRect(object.x-this.game.camera.x,object.y-this.game.camera.y,object.width,object.height);}
else
{this.context.strokeStyle=color;this.context.strokeRect(object.x-this.game.camera.x,object.y-this.game.camera.y,object.width,object.height);}
this.stop();},text:function(text,x,y,color,font){color=color||'rgb(255,255,255)';font=font||'16px Courier';this.start();this.context.font=font;if(this.renderShadow)
{this.context.fillStyle='rgb(0,0,0)';this.context.fillText(text,x+1,y+1);}
this.context.fillStyle=color;this.context.fillText(text,x,y);this.stop();},quadTree:function(quadtree,color){color=color||'rgba(255,0,0,0.3)';this.start();var bounds=quadtree.bounds;if(quadtree.nodes.length===0)
{this.context.strokeStyle=color;this.context.strokeRect(bounds.x,bounds.y,bounds.width,bounds.height);this.text('size: '+quadtree.objects.length,bounds.x+4,bounds.y+16,'rgb(0,200,0)','12px Courier');this.context.strokeStyle='rgb(0,255,0)';for(var i=0;i<quadtree.objects.length;i++)
{this.context.strokeRect(quadtree.objects[i].x,quadtree.objects[i].y,quadtree.objects[i].width,quadtree.objects[i].height);}}
else
{for(var i=0;i<quadtree.nodes.length;i++)
{this.quadTree(quadtree.nodes[i]);}}
this.stop();},body:function(sprite,color,filled){if(sprite.body)
{this.start();if(sprite.body.type===Phaser.Physics.ARCADE)
{Phaser.Physics.Arcade.Body.render(this.context,sprite.body,color,filled);}
else if(sprite.body.type===Phaser.Physics.NINJA)
{Phaser.Physics.Ninja.Body.render(this.context,sprite.body,color,filled);}
else if(sprite.body.type===Phaser.Physics.BOX2D)
{Phaser.Physics.Box2D.renderBody(this.context,sprite.body,color);}
this.stop();}},bodyInfo:function(sprite,x,y,color){if(sprite.body)
{this.start(x,y,color,210);if(sprite.body.type===Phaser.Physics.ARCADE)
{Phaser.Physics.Arcade.Body.renderBodyInfo(this,sprite.body);}
else if(sprite.body.type===Phaser.Physics.BOX2D)
{this.game.physics.box2d.renderBodyInfo(this,sprite.body);}
this.stop();}},box2dWorld:function(){this.start();this.context.translate(-this.game.camera.view.x,-this.game.camera.view.y,0);this.game.physics.box2d.renderDebugDraw(this.context);this.stop();},box2dBody:function(body,color){this.start();Phaser.Physics.Box2D.renderBody(this.context,body,color);this.stop();},destroy:function(){PIXI.CanvasPool.remove(this);}};Phaser.Utils.Debug.prototype.constructor=Phaser.Utils.Debug;Phaser.DOM={getOffset:function(element,point){point=point||new Phaser.Point();var box=element.getBoundingClientRect();var scrollTop=Phaser.DOM.scrollY;var scrollLeft=Phaser.DOM.scrollX;var clientTop=document.documentElement.clientTop;var clientLeft=document.documentElement.clientLeft;point.x=box.left+scrollLeft-clientLeft;point.y=box.top+scrollTop-clientTop;return point;},getBounds:function(element,cushion){if(cushion===undefined){cushion=0;}
element=element&&!element.nodeType?element[0]:element;if(!element||element.nodeType!==1)
{return false;}
else
{return this.calibrate(element.getBoundingClientRect(),cushion);}},calibrate:function(coords,cushion){cushion=+cushion||0;var output={width:0,height:0,left:0,right:0,top:0,bottom:0};output.width=(output.right=coords.right+cushion)-(output.left=coords.left-cushion);output.height=(output.bottom=coords.bottom+cushion)-(output.top=coords.top-cushion);return output;},getAspectRatio:function(object){object=null==object?this.visualBounds:1===object.nodeType?this.getBounds(object):object;var w=object['width'];var h=object['height'];if(typeof w==='function')
{w=w.call(object);}
if(typeof h==='function')
{h=h.call(object);}
return w / h;},inLayoutViewport:function(element,cushion){var r=this.getBounds(element,cushion);return!!r&&r.bottom>=0&&r.right>=0&&r.top<=this.layoutBounds.width&&r.left<=this.layoutBounds.height;},getScreenOrientation:function(primaryFallback){var screen=window.screen;var orientation=screen.orientation||screen.mozOrientation||screen.msOrientation;if(orientation&&typeof orientation.type==='string')
{return orientation.type;}
else if(typeof orientation==='string')
{return orientation;}
var PORTRAIT='portrait-primary';var LANDSCAPE='landscape-primary';if(primaryFallback==='screen')
{return(screen.height>screen.width)?PORTRAIT:LANDSCAPE;}
else if(primaryFallback==='viewport')
{return(this.visualBounds.height>this.visualBounds.width)?PORTRAIT:LANDSCAPE;}
else if(primaryFallback==='window.orientation'&&typeof window.orientation==='number')
{return(window.orientation===0||window.orientation===180)?PORTRAIT:LANDSCAPE;}
else if(window.matchMedia)
{if(window.matchMedia("(orientation: portrait)").matches)
{return PORTRAIT;}
else if(window.matchMedia("(orientation: landscape)").matches)
{return LANDSCAPE;}}
return(this.visualBounds.height>this.visualBounds.width)?PORTRAIT:LANDSCAPE;},visualBounds:new Phaser.Rectangle(),layoutBounds:new Phaser.Rectangle(),documentBounds:new Phaser.Rectangle()};Phaser.Device.whenReady(function(device){var scrollX=window&&('pageXOffset'in window)?function(){return window.pageXOffset;}:function(){return document.documentElement.scrollLeft;};var scrollY=window&&('pageYOffset'in window)?function(){return window.pageYOffset;}:function(){return document.documentElement.scrollTop;};Object.defineProperty(Phaser.DOM,"scrollX",{get:scrollX});Object.defineProperty(Phaser.DOM,"scrollY",{get:scrollY});Object.defineProperty(Phaser.DOM.visualBounds,"x",{get:scrollX});Object.defineProperty(Phaser.DOM.visualBounds,"y",{get:scrollY});Object.defineProperty(Phaser.DOM.layoutBounds,"x",{value:0});Object.defineProperty(Phaser.DOM.layoutBounds,"y",{value:0});var treatAsDesktop=device.desktop&&(document.documentElement.clientWidth<=window.innerWidth)&&(document.documentElement.clientHeight<=window.innerHeight);if(treatAsDesktop)
{var clientWidth=function(){return Math.max(window.innerWidth,document.documentElement.clientWidth);};var clientHeight=function(){return Math.max(window.innerHeight,document.documentElement.clientHeight);};Object.defineProperty(Phaser.DOM.visualBounds,"width",{get:clientWidth});Object.defineProperty(Phaser.DOM.visualBounds,"height",{get:clientHeight});Object.defineProperty(Phaser.DOM.layoutBounds,"width",{get:clientWidth});Object.defineProperty(Phaser.DOM.layoutBounds,"height",{get:clientHeight});}else{Object.defineProperty(Phaser.DOM.visualBounds,"width",{get:function(){return window.innerWidth;}});Object.defineProperty(Phaser.DOM.visualBounds,"height",{get:function(){return window.innerHeight;}});Object.defineProperty(Phaser.DOM.layoutBounds,"width",{get:function(){var a=document.documentElement.clientWidth;var b=window.innerWidth;return a<b?b:a;}});Object.defineProperty(Phaser.DOM.layoutBounds,"height",{get:function(){var a=document.documentElement.clientHeight;var b=window.innerHeight;return a<b?b:a;}});}
Object.defineProperty(Phaser.DOM.documentBounds,"x",{value:0});Object.defineProperty(Phaser.DOM.documentBounds,"y",{value:0});Object.defineProperty(Phaser.DOM.documentBounds,"width",{get:function(){var d=document.documentElement;return Math.max(d.clientWidth,d.offsetWidth,d.scrollWidth);}});Object.defineProperty(Phaser.DOM.documentBounds,"height",{get:function(){var d=document.documentElement;return Math.max(d.clientHeight,d.offsetHeight,d.scrollHeight);}});},null,true);Phaser.ArraySet=function(list){this.position=0;this.list=list||[];};Phaser.ArraySet.prototype={add:function(item){if(!this.exists(item))
{this.list.push(item);}
return item;},getIndex:function(item){return this.list.indexOf(item);},getByKey:function(property,value){var i=this.list.length;while(i--)
{if(this.list[i][property]===value)
{return this.list[i];}}
return null;},exists:function(item){return(this.list.indexOf(item)>-1);},reset:function(){this.list.length=0;},remove:function(item){var idx=this.list.indexOf(item);if(idx>-1)
{this.list.splice(idx,1);return item;}},setAll:function(key,value){var i=this.list.length;while(i--)
{if(this.list[i])
{this.list[i][key]=value;}}},callAll:function(key){var args=Array.prototype.slice.call(arguments,1);var i=this.list.length;while(i--)
{if(this.list[i]&&this.list[i][key])
{this.list[i][key].apply(this.list[i],args);}}},removeAll:function(destroy){if(destroy===undefined){destroy=false;}
var i=this.list.length;while(i--)
{if(this.list[i])
{var item=this.remove(this.list[i]);if(destroy)
{item.destroy();}}}
this.position=0;this.list=[];}};Object.defineProperty(Phaser.ArraySet.prototype,"total",{get:function(){return this.list.length;}});Object.defineProperty(Phaser.ArraySet.prototype,"first",{get:function(){this.position=0;if(this.list.length>0)
{return this.list[0];}
else
{return null;}}});Object.defineProperty(Phaser.ArraySet.prototype,"next",{get:function(){if(this.position<this.list.length)
{this.position++;return this.list[this.position];}
else
{return null;}}});Phaser.ArraySet.prototype.constructor=Phaser.ArraySet;Phaser.ArrayUtils={getRandomItem:function(objects,startIndex,length){if(objects===null){return null;}
if(startIndex===undefined){startIndex=0;}
if(length===undefined){length=objects.length;}
var randomIndex=startIndex+Math.floor(Math.random()*length);return objects[randomIndex]===undefined?null:objects[randomIndex];},removeRandomItem:function(objects,startIndex,length){if(objects==null){return null;}
if(startIndex===undefined){startIndex=0;}
if(length===undefined){length=objects.length;}
var randomIndex=startIndex+Math.floor(Math.random()*length);if(randomIndex<objects.length)
{var removed=objects.splice(randomIndex,1);return removed[0]===undefined?null:removed[0];}
else
{return null;}},shuffle:function(array){for(var i=array.length-1;i>0;i--)
{var j=Math.floor(Math.random()*(i+1));var temp=array[i];array[i]=array[j];array[j]=temp;}
return array;},transposeMatrix:function(array){var sourceRowCount=array.length;var sourceColCount=array[0].length;var result=new Array(sourceColCount);for(var i=0;i<sourceColCount;i++)
{result[i]=new Array(sourceRowCount);for(var j=sourceRowCount-1;j>-1;j--)
{result[i][j]=array[j][i];}}
return result;},rotateMatrix:function(matrix,direction){if(typeof direction!=='string')
{direction=((direction%360)+360)%360;}
if(direction===90||direction===-270||direction==='rotateLeft')
{matrix=Phaser.ArrayUtils.transposeMatrix(matrix);matrix=matrix.reverse();}
else if(direction===-90||direction===270||direction==='rotateRight')
{matrix=matrix.reverse();matrix=Phaser.ArrayUtils.transposeMatrix(matrix);}
else if(Math.abs(direction)===180||direction==='rotate180')
{for(var i=0;i<matrix.length;i++)
{matrix[i].reverse();}
matrix=matrix.reverse();}
return matrix;},findClosest:function(value,arr){if(!arr.length)
{return NaN;}
else if(arr.length===1||value<arr[0])
{return arr[0];}
var i=1;while(arr[i]<value){i++;}
var low=arr[i-1];var high=(i<arr.length)?arr[i]:Number.POSITIVE_INFINITY;return((high-value)<=(value-low))?high:low;},rotate:function(array){var s=array.shift();array.push(s);return s;},numberArray:function(start,end){var result=[];for(var i=start;i<=end;i++)
{result.push(i);}
return result;},numberArrayStep:function(start,end,step){if(start===undefined||start===null){start=0;}
if(end===undefined||end===null)
{end=start;start=0;}
if(step===undefined){step=1;}
var result=[];var total=Math.max(Phaser.Math.roundAwayFromZero((end-start)/(step||1)),0);for(var i=0;i<total;i++)
{result.push(start);start+=step;}
return result;}};Phaser.LinkedList=function(){this.next=null;this.prev=null;this.first=null;this.last=null;this.total=0;};Phaser.LinkedList.prototype={add:function(item){if(this.total===0&&this.first===null&&this.last===null)
{this.first=item;this.last=item;this.next=item;item.prev=this;this.total++;return item;}
this.last.next=item;item.prev=this.last;this.last=item;this.total++;return item;},reset:function(){this.first=null;this.last=null;this.next=null;this.prev=null;this.total=0;},remove:function(item){if(this.total===1)
{this.reset();item.next=item.prev=null;return;}
if(item===this.first)
{this.first=this.first.next;}
else if(item===this.last)
{this.last=this.last.prev;}
if(item.prev)
{item.prev.next=item.next;}
if(item.next)
{item.next.prev=item.prev;}
item.next=item.prev=null;if(this.first===null)
{this.last=null;}
this.total--;},callAll:function(callback){if(!this.first||!this.last)
{return;}
var entity=this.first;do
{if(entity&&entity[callback])
{entity[callback].call(entity);}
entity=entity.next;}
while(entity!=this.last.next);}};Phaser.LinkedList.prototype.constructor=Phaser.LinkedList;Phaser.Create=function(game){this.game=game;this.bmd=null;this.canvas=null;this.ctx=null;this.palettes=[{0:'#000',1:'#9D9D9D',2:'#FFF',3:'#BE2633',4:'#E06F8B',5:'#493C2B',6:'#A46422',7:'#EB8931',8:'#F7E26B',9:'#2F484E',A:'#44891A',B:'#A3CE27',C:'#1B2632',D:'#005784',E:'#31A2F2',F:'#B2DCEF'},{0:'#000',1:'#191028',2:'#46af45',3:'#a1d685',4:'#453e78',5:'#7664fe',6:'#833129',7:'#9ec2e8',8:'#dc534b',9:'#e18d79',A:'#d6b97b',B:'#e9d8a1',C:'#216c4b',D:'#d365c8',E:'#afaab9',F:'#f5f4eb'},{0:'#000',1:'#2234d1',2:'#0c7e45',3:'#44aacc',4:'#8a3622',5:'#5c2e78',6:'#aa5c3d',7:'#b5b5b5',8:'#5e606e',9:'#4c81fb',A:'#6cd947',B:'#7be2f9',C:'#eb8a60',D:'#e23d69',E:'#ffd93f',F:'#fff'},{0:'#000',1:'#fff',2:'#8b4131',3:'#7bbdc5',4:'#8b41ac',5:'#6aac41',6:'#3931a4',7:'#d5de73',8:'#945a20',9:'#5a4100',A:'#bd736a',B:'#525252',C:'#838383',D:'#acee8b',E:'#7b73de',F:'#acacac'},{0:'#000',1:'#191028',2:'#46af45',3:'#a1d685',4:'#453e78',5:'#7664fe',6:'#833129',7:'#9ec2e8',8:'#dc534b',9:'#e18d79',A:'#d6b97b',B:'#e9d8a1',C:'#216c4b',D:'#d365c8',E:'#afaab9',F:'#fff'}];};Phaser.Create.PALETTE_ARNE=0;Phaser.Create.PALETTE_JMP=1;Phaser.Create.PALETTE_CGA=2;Phaser.Create.PALETTE_C64=3;Phaser.Create.PALETTE_JAPANESE_MACHINE=4;Phaser.Create.prototype={texture:function(key,data,pixelWidth,pixelHeight,palette){if(pixelWidth===undefined){pixelWidth=8;}
if(pixelHeight===undefined){pixelHeight=pixelWidth;}
if(palette===undefined){palette=0;}
var w=data[0].length*pixelWidth;var h=data.length*pixelHeight;if(this.bmd===null)
{this.bmd=this.game.make.bitmapData();this.canvas=this.bmd.canvas;this.ctx=this.bmd.context;}
this.bmd.resize(w,h);this.bmd.clear();for(var y=0;y<data.length;y++)
{var row=data[y];for(var x=0;x<row.length;x++)
{var d=row[x];if(d!=='.'&&d!==' ')
{this.ctx.fillStyle=this.palettes[palette][d];this.ctx.fillRect(x*pixelWidth,y*pixelHeight,pixelWidth,pixelHeight);}}}
return this.bmd.generateTexture(key);},grid:function(key,width,height,cellWidth,cellHeight,color){if(this.bmd===null)
{this.bmd=this.game.make.bitmapData();this.canvas=this.bmd.canvas;this.ctx=this.bmd.context;}
this.bmd.resize(width,height);this.ctx.fillStyle=color;for(var y=0;y<height;y+=cellHeight)
{this.ctx.fillRect(0,y,width,1);}
for(var x=0;x<width;x+=cellWidth)
{this.ctx.fillRect(x,0,1,height);}
return this.bmd.generateTexture(key);}};Phaser.Create.prototype.constructor=Phaser.Create;Phaser.FlexGrid=function(manager,width,height){this.game=manager.game;this.manager=manager;this.width=width;this.height=height;this.boundsCustom=new Phaser.Rectangle(0,0,width,height);this.boundsFluid=new Phaser.Rectangle(0,0,width,height);this.boundsFull=new Phaser.Rectangle(0,0,width,height);this.boundsNone=new Phaser.Rectangle(0,0,width,height);this.positionCustom=new Phaser.Point(0,0);this.positionFluid=new Phaser.Point(0,0);this.positionFull=new Phaser.Point(0,0);this.positionNone=new Phaser.Point(0,0);this.scaleCustom=new Phaser.Point(1,1);this.scaleFluid=new Phaser.Point(1,1);this.scaleFluidInversed=new Phaser.Point(1,1);this.scaleFull=new Phaser.Point(1,1);this.scaleNone=new Phaser.Point(1,1);this.customWidth=0;this.customHeight=0;this.customOffsetX=0;this.customOffsetY=0;this.ratioH=width / height;this.ratioV=height / width;this.multiplier=0;this.layers=[];};Phaser.FlexGrid.prototype={setSize:function(width,height){this.width=width;this.height=height;this.ratioH=width / height;this.ratioV=height / width;this.scaleNone=new Phaser.Point(1,1);this.boundsNone.width=this.width;this.boundsNone.height=this.height;this.refresh();},createCustomLayer:function(width,height,children,addToWorld){if(addToWorld===undefined){addToWorld=true;}
this.customWidth=width;this.customHeight=height;this.boundsCustom.width=width;this.boundsCustom.height=height;var layer=new Phaser.FlexLayer(this,this.positionCustom,this.boundsCustom,this.scaleCustom);if(addToWorld)
{this.game.world.add(layer);}
this.layers.push(layer);if(typeof children!=='undefined'&&typeof children!==null)
{layer.addMultiple(children);}
return layer;},createFluidLayer:function(children,addToWorld){if(addToWorld===undefined){addToWorld=true;}
var layer=new Phaser.FlexLayer(this,this.positionFluid,this.boundsFluid,this.scaleFluid);if(addToWorld)
{this.game.world.add(layer);}
this.layers.push(layer);if(typeof children!=='undefined'&&typeof children!==null)
{layer.addMultiple(children);}
return layer;},createFullLayer:function(children){var layer=new Phaser.FlexLayer(this,this.positionFull,this.boundsFull,this.scaleFluid);this.game.world.add(layer);this.layers.push(layer);if(typeof children!=='undefined')
{layer.addMultiple(children);}
return layer;},createFixedLayer:function(children){var layer=new Phaser.FlexLayer(this,this.positionNone,this.boundsNone,this.scaleNone);this.game.world.add(layer);this.layers.push(layer);if(typeof children!=='undefined')
{layer.addMultiple(children);}
return layer;},reset:function(){var i=this.layers.length;while(i--)
{if(!this.layers[i].persist)
{this.layers[i].position=null;this.layers[i].scale=null;this.layers.slice(i,1);}}},onResize:function(width,height){this.ratioH=width / height;this.ratioV=height / width;this.refresh(width,height);},refresh:function(){this.multiplier=Math.min((this.manager.height / this.height),(this.manager.width / this.width));this.boundsFluid.width=Math.round(this.width*this.multiplier);this.boundsFluid.height=Math.round(this.height*this.multiplier);this.scaleFluid.set(this.boundsFluid.width / this.width,this.boundsFluid.height / this.height);this.scaleFluidInversed.set(this.width / this.boundsFluid.width,this.height / this.boundsFluid.height);this.scaleFull.set(this.boundsFull.width / this.width,this.boundsFull.height / this.height);this.boundsFull.width=Math.round(this.manager.width*this.scaleFluidInversed.x);this.boundsFull.height=Math.round(this.manager.height*this.scaleFluidInversed.y);this.boundsFluid.centerOn(this.manager.bounds.centerX,this.manager.bounds.centerY);this.boundsNone.centerOn(this.manager.bounds.centerX,this.manager.bounds.centerY);this.positionFluid.set(this.boundsFluid.x,this.boundsFluid.y);this.positionNone.set(this.boundsNone.x,this.boundsNone.y);},fitSprite:function(sprite){this.manager.scaleSprite(sprite);sprite.x=this.manager.bounds.centerX;sprite.y=this.manager.bounds.centerY;},debug:function(){this.game.debug.text(this.boundsFluid.width+' x '+this.boundsFluid.height,this.boundsFluid.x+4,this.boundsFluid.y+16);this.game.debug.geom(this.boundsFluid,'rgba(255,0,0,0.9',false);}};Phaser.FlexGrid.prototype.constructor=Phaser.FlexGrid;Phaser.FlexLayer=function(manager,position,bounds,scale){Phaser.Group.call(this,manager.game,null,'__flexLayer'+manager.game.rnd.uuid(),false);this.manager=manager.manager;this.grid=manager;this.persist=false;this.position=position;this.bounds=bounds;this.scale=scale;this.topLeft=bounds.topLeft;this.topMiddle=new Phaser.Point(bounds.halfWidth,0);this.topRight=bounds.topRight;this.bottomLeft=bounds.bottomLeft;this.bottomMiddle=new Phaser.Point(bounds.halfWidth,bounds.bottom);this.bottomRight=bounds.bottomRight;};Phaser.FlexLayer.prototype=Object.create(Phaser.Group.prototype);Phaser.FlexLayer.prototype.constructor=Phaser.FlexLayer;Phaser.FlexLayer.prototype.resize=function(){};Phaser.FlexLayer.prototype.debug=function(){this.game.debug.text(this.bounds.width+' x '+this.bounds.height,this.bounds.x+4,this.bounds.y+16);this.game.debug.geom(this.bounds,'rgba(0,0,255,0.9',false);this.game.debug.geom(this.topLeft,'rgba(255,255,255,0.9');this.game.debug.geom(this.topMiddle,'rgba(255,255,255,0.9');this.game.debug.geom(this.topRight,'rgba(255,255,255,0.9');};Phaser.Color={packPixel:function(r,g,b,a){if(Phaser.Device.LITTLE_ENDIAN)
{return((a<<24)|(b<<16)|(g<<8)|r)>>>0;}
else
{return((r<<24)|(g<<16)|(b<<8)|a)>>>0;}},unpackPixel:function(rgba,out,hsl,hsv){if(out===undefined||out===null){out=Phaser.Color.createColor();}
if(hsl===undefined||hsl===null){hsl=false;}
if(hsv===undefined||hsv===null){hsv=false;}
if(Phaser.Device.LITTLE_ENDIAN)
{out.a=((rgba&0xff000000)>>>24);out.b=((rgba&0x00ff0000)>>>16);out.g=((rgba&0x0000ff00)>>>8);out.r=((rgba&0x000000ff));}
else
{out.r=((rgba&0xff000000)>>>24);out.g=((rgba&0x00ff0000)>>>16);out.b=((rgba&0x0000ff00)>>>8);out.a=((rgba&0x000000ff));}
out.color=rgba;out.rgba='rgba('+out.r+','+out.g+','+out.b+','+(out.a / 255)+')';if(hsl)
{Phaser.Color.RGBtoHSL(out.r,out.g,out.b,out);}
if(hsv)
{Phaser.Color.RGBtoHSV(out.r,out.g,out.b,out);}
return out;},fromRGBA:function(rgba,out){if(!out)
{out=Phaser.Color.createColor();}
out.r=((rgba&0xff000000)>>>24);out.g=((rgba&0x00ff0000)>>>16);out.b=((rgba&0x0000ff00)>>>8);out.a=((rgba&0x000000ff));out.rgba='rgba('+out.r+','+out.g+','+out.b+','+out.a+')';return out;},toRGBA:function(r,g,b,a){return(r<<24)|(g<<16)|(b<<8)|a;},RGBtoHSL:function(r,g,b,out){if(!out)
{out=Phaser.Color.createColor(r,g,b,1);}
r /=255;g /=255;b /=255;var min=Math.min(r,g,b);var max=Math.max(r,g,b);out.h=0;out.s=0;out.l=(max+min)/ 2;if(max!==min)
{var d=max-min;out.s=out.l>0.5?d /(2-max-min):d /(max+min);if(max===r)
{out.h=(g-b)/ d+(g<b?6:0);}
else if(max===g)
{out.h=(b-r)/ d+2;}
else if(max===b)
{out.h=(r-g)/ d+4;}
out.h /=6;}
return out;},HSLtoRGB:function(h,s,l,out){if(!out)
{out=Phaser.Color.createColor(l,l,l);}
else
{out.r=l;out.g=l;out.b=l;}
if(s!==0)
{var q=l<0.5?l*(1+s):l+s-l*s;var p=2*l-q;out.r=Phaser.Color.hueToColor(p,q,h+1 / 3);out.g=Phaser.Color.hueToColor(p,q,h);out.b=Phaser.Color.hueToColor(p,q,h-1 / 3);}
out.r=Math.floor((out.r*255|0));out.g=Math.floor((out.g*255|0));out.b=Math.floor((out.b*255|0));Phaser.Color.updateColor(out);return out;},RGBtoHSV:function(r,g,b,out){if(!out)
{out=Phaser.Color.createColor(r,g,b,255);}
r /=255;g /=255;b /=255;var min=Math.min(r,g,b);var max=Math.max(r,g,b);var d=max-min;out.h=0;out.s=max===0?0:d / max;out.v=max;if(max!==min)
{if(max===r)
{out.h=(g-b)/ d+(g<b?6:0);}
else if(max===g)
{out.h=(b-r)/ d+2;}
else if(max===b)
{out.h=(r-g)/ d+4;}
out.h /=6;}
return out;},HSVtoRGB:function(h,s,v,out){if(out===undefined){out=Phaser.Color.createColor(0,0,0,1,h,s,0,v);}
var r,g,b;var i=Math.floor(h*6);var f=h*6-i;var p=v*(1-s);var q=v*(1-f*s);var t=v*(1-(1-f)*s);switch(i%6)
{case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}
out.r=Math.floor(r*255);out.g=Math.floor(g*255);out.b=Math.floor(b*255);Phaser.Color.updateColor(out);return out;},hueToColor:function(p,q,t){if(t<0)
{t+=1;}
if(t>1)
{t-=1;}
if(t<1 / 6)
{return p+(q-p)*6*t;}
if(t<1 / 2)
{return q;}
if(t<2 / 3)
{return p+(q-p)*(2 / 3-t)*6;}
return p;},createColor:function(r,g,b,a,h,s,l,v){var out={r:r||0,g:g||0,b:b||0,a:a||1,h:h||0,s:s||0,l:l||0,v:v||0,color:0,color32:0,rgba:''};return Phaser.Color.updateColor(out);},updateColor:function(out){out.rgba='rgba('+out.r.toString()+','+out.g.toString()+','+out.b.toString()+','+out.a.toString()+')';out.color=Phaser.Color.getColor(out.r,out.g,out.b);out.color32=Phaser.Color.getColor32(out.a,out.r,out.g,out.b);return out;},getColor32:function(a,r,g,b){return a<<24|r<<16|g<<8|b;},getColor:function(r,g,b){return r<<16|g<<8|b;},RGBtoString:function(r,g,b,a,prefix){if(a===undefined){a=255;}
if(prefix===undefined){prefix='#';}
if(prefix==='#')
{return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
else
{return'0x'+Phaser.Color.componentToHex(a)+Phaser.Color.componentToHex(r)+Phaser.Color.componentToHex(g)+Phaser.Color.componentToHex(b);}},hexToRGB:function(hex){var rgb=Phaser.Color.hexToColor(hex);if(rgb)
{return Phaser.Color.getColor32(rgb.a,rgb.r,rgb.g,rgb.b);}},hexToColor:function(hex,out){hex=hex.replace(/^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i,function(m,r,g,b){return r+r+g+g+b+b;});var result=/^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);if(result)
{var r=parseInt(result[1],16);var g=parseInt(result[2],16);var b=parseInt(result[3],16);if(!out)
{out=Phaser.Color.createColor(r,g,b);}
else
{out.r=r;out.g=g;out.b=b;}}
return out;},webToColor:function(web,out){if(!out)
{out=Phaser.Color.createColor();}
var result=/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?))?\s*\)$/.exec(web);if(result)
{out.r=parseInt(result[1],10);out.g=parseInt(result[2],10);out.b=parseInt(result[3],10);out.a=result[4]!==undefined?parseFloat(result[4]):1;Phaser.Color.updateColor(out);}
return out;},valueToColor:function(value,out){if(!out)
{out=Phaser.Color.createColor();}
if(typeof value==='string')
{if(value.indexOf('rgb')===0)
{return Phaser.Color.webToColor(value,out);}
else
{out.a=1;return Phaser.Color.hexToColor(value,out);}}
else if(typeof value==='number')
{var tempColor=Phaser.Color.getRGB(value);out.r=tempColor.r;out.g=tempColor.g;out.b=tempColor.b;out.a=tempColor.a / 255;return out;}
else
{return out;}},componentToHex:function(color){var hex=color.toString(16);return hex.length==1?"0"+hex:hex;},HSVColorWheel:function(s,v){if(s===undefined){s=1.0;}
if(v===undefined){v=1.0;}
var colors=[];for(var c=0;c<=359;c++)
{colors.push(Phaser.Color.HSVtoRGB(c / 359,s,v));}
return colors;},HSLColorWheel:function(s,l){if(s===undefined){s=0.5;}
if(l===undefined){l=0.5;}
var colors=[];for(var c=0;c<=359;c++)
{colors.push(Phaser.Color.HSLtoRGB(c / 359,s,l));}
return colors;},interpolateColor:function(color1,color2,steps,currentStep,alpha){if(alpha===undefined){alpha=255;}
var src1=Phaser.Color.getRGB(color1);var src2=Phaser.Color.getRGB(color2);var r=(((src2.red-src1.red)*currentStep)/ steps)+src1.red;var g=(((src2.green-src1.green)*currentStep)/ steps)+src1.green;var b=(((src2.blue-src1.blue)*currentStep)/ steps)+src1.blue;return Phaser.Color.getColor32(alpha,r,g,b);},interpolateColorWithRGB:function(color,r,g,b,steps,currentStep){var src=Phaser.Color.getRGB(color);var or=(((r-src.red)*currentStep)/ steps)+src.red;var og=(((g-src.green)*currentStep)/ steps)+src.green;var ob=(((b-src.blue)*currentStep)/ steps)+src.blue;return Phaser.Color.getColor(or,og,ob);},interpolateRGB:function(r1,g1,b1,r2,g2,b2,steps,currentStep){var r=(((r2-r1)*currentStep)/ steps)+r1;var g=(((g2-g1)*currentStep)/ steps)+g1;var b=(((b2-b1)*currentStep)/ steps)+b1;return Phaser.Color.getColor(r,g,b);},getRandomColor:function(min,max,alpha){if(min===undefined){min=0;}
if(max===undefined){max=255;}
if(alpha===undefined){alpha=255;}
if(max>255||min>max)
{return Phaser.Color.getColor(255,255,255);}
var red=min+Math.round(Math.random()*(max-min));var green=min+Math.round(Math.random()*(max-min));var blue=min+Math.round(Math.random()*(max-min));return Phaser.Color.getColor32(alpha,red,green,blue);},getRGB:function(color){if(color>16777215)
{return{alpha:color>>>24,red:color>>16&0xFF,green:color>>8&0xFF,blue:color&0xFF,a:color>>>24,r:color>>16&0xFF,g:color>>8&0xFF,b:color&0xFF};}
else
{return{alpha:255,red:color>>16&0xFF,green:color>>8&0xFF,blue:color&0xFF,a:255,r:color>>16&0xFF,g:color>>8&0xFF,b:color&0xFF};}},getWebRGB:function(color){if(typeof color==='object')
{return'rgba('+color.r.toString()+','+color.g.toString()+','+color.b.toString()+','+(color.a / 255).toString()+')';}
else
{var rgb=Phaser.Color.getRGB(color);return'rgba('+rgb.r.toString()+','+rgb.g.toString()+','+rgb.b.toString()+','+(rgb.a / 255).toString()+')';}},getAlpha:function(color){return color>>>24;},getAlphaFloat:function(color){return(color>>>24)/ 255;},getRed:function(color){return color>>16&0xFF;},getGreen:function(color){return color>>8&0xFF;},getBlue:function(color){return color&0xFF;},blendNormal:function(a){return a;},blendLighten:function(a,b){return(b>a)?b:a;},blendDarken:function(a,b){return(b>a)?a:b;},blendMultiply:function(a,b){return(a*b)/ 255;},blendAverage:function(a,b){return(a+b)/ 2;},blendAdd:function(a,b){return Math.min(255,a+b);},blendSubtract:function(a,b){return Math.max(0,a+b-255);},blendDifference:function(a,b){return Math.abs(a-b);},blendNegation:function(a,b){return 255-Math.abs(255-a-b);},blendScreen:function(a,b){return 255-(((255-a)*(255-b))>>8);},blendExclusion:function(a,b){return a+b-2*a*b / 255;},blendOverlay:function(a,b){return b<128?(2*a*b / 255):(255-2*(255-a)*(255-b)/ 255);},blendSoftLight:function(a,b){return b<128?(2*((a>>1)+64))*(b / 255):255-(2*(255-((a>>1)+64))*(255-b)/ 255);},blendHardLight:function(a,b){return Phaser.Color.blendOverlay(b,a);},blendColorDodge:function(a,b){return b===255?b:Math.min(255,((a<<8)/(255-b)));},blendColorBurn:function(a,b){return b===0?b:Math.max(0,(255-((255-a)<<8)/ b));},blendLinearDodge:function(a,b){return Phaser.Color.blendAdd(a,b);},blendLinearBurn:function(a,b){return Phaser.Color.blendSubtract(a,b);},blendLinearLight:function(a,b){return b<128?Phaser.Color.blendLinearBurn(a,2*b):Phaser.Color.blendLinearDodge(a,(2*(b-128)));},blendVividLight:function(a,b){return b<128?Phaser.Color.blendColorBurn(a,2*b):Phaser.Color.blendColorDodge(a,(2*(b-128)));},blendPinLight:function(a,b){return b<128?Phaser.Color.blendDarken(a,2*b):Phaser.Color.blendLighten(a,(2*(b-128)));},blendHardMix:function(a,b){return Phaser.Color.blendVividLight(a,b)<128?0:255;},blendReflect:function(a,b){return b===255?b:Math.min(255,(a*a /(255-b)));},blendGlow:function(a,b){return Phaser.Color.blendReflect(b,a);},blendPhoenix:function(a,b){return Math.min(a,b)-Math.max(a,b)+255;}};Phaser.Physics=function(game,config){config=config||{};this.game=game;this.config=config;this.arcade=null;this.p2=null;this.ninja=null;this.box2d=null;this.chipmunk=null;this.matter=null;this.parseConfig();};Phaser.Physics.ARCADE=0;Phaser.Physics.P2JS=1;Phaser.Physics.NINJA=2;Phaser.Physics.BOX2D=3;Phaser.Physics.CHIPMUNK=4;Phaser.Physics.MATTERJS=5;Phaser.Physics.prototype={parseConfig:function(){if((!this.config.hasOwnProperty('arcade')||this.config['arcade']===true)&&Phaser.Physics.hasOwnProperty('Arcade'))
{this.arcade=new Phaser.Physics.Arcade(this.game);}
if(this.config.hasOwnProperty('ninja')&&this.config['ninja']===true&&Phaser.Physics.hasOwnProperty('Ninja'))
{this.ninja=new Phaser.Physics.Ninja(this.game);}
if(this.config.hasOwnProperty('p2')&&this.config['p2']===true&&Phaser.Physics.hasOwnProperty('P2'))
{this.p2=new Phaser.Physics.P2(this.game,this.config);}
if(this.config.hasOwnProperty('box2d')&&this.config['box2d']===true&&Phaser.Physics.hasOwnProperty('BOX2D'))
{this.box2d=new Phaser.Physics.BOX2D(this.game,this.config);}
if(this.config.hasOwnProperty('matter')&&this.config['matter']===true&&Phaser.Physics.hasOwnProperty('Matter'))
{this.matter=new Phaser.Physics.Matter(this.game,this.config);}},startSystem:function(system){if(system===Phaser.Physics.ARCADE)
{this.arcade=new Phaser.Physics.Arcade(this.game);}
else if(system===Phaser.Physics.P2JS)
{if(this.p2===null)
{this.p2=new Phaser.Physics.P2(this.game,this.config);}
else
{this.p2.reset();}}
else if(system===Phaser.Physics.NINJA)
{this.ninja=new Phaser.Physics.Ninja(this.game);}
else if(system===Phaser.Physics.BOX2D)
{if(this.box2d===null)
{this.box2d=new Phaser.Physics.Box2D(this.game,this.config);}
else
{this.box2d.reset();}}
else if(system===Phaser.Physics.MATTERJS)
{if(this.matter===null)
{this.matter=new Phaser.Physics.Matter(this.game,this.config);}
else
{this.matter.reset();}}},enable:function(object,system,debug){if(system===undefined){system=Phaser.Physics.ARCADE;}
if(debug===undefined){debug=false;}
if(system===Phaser.Physics.ARCADE)
{this.arcade.enable(object);}
else if(system===Phaser.Physics.P2JS&&this.p2)
{this.p2.enable(object,debug);}
else if(system===Phaser.Physics.NINJA&&this.ninja)
{this.ninja.enableAABB(object);}
else if(system===Phaser.Physics.BOX2D&&this.box2d)
{this.box2d.enable(object);}
else if(system===Phaser.Physics.MATTERJS&&this.matter)
{this.matter.enable(object);}},preUpdate:function(){if(this.p2)
{this.p2.preUpdate();}
if(this.box2d)
{this.box2d.preUpdate();}
if(this.matter)
{this.matter.preUpdate();}},update:function(){if(this.p2)
{this.p2.update();}
if(this.box2d)
{this.box2d.update();}
if(this.matter)
{this.matter.update();}},setBoundsToWorld:function(){if(this.arcade)
{this.arcade.setBoundsToWorld();}
if(this.ninja)
{this.ninja.setBoundsToWorld();}
if(this.p2)
{this.p2.setBoundsToWorld();}
if(this.box2d)
{this.box2d.setBoundsToWorld();}
if(this.matter)
{this.matter.setBoundsToWorld();}},clear:function(){if(this.p2)
{this.p2.clear();}
if(this.box2d)
{this.box2d.clear();}
if(this.matter)
{this.matter.clear();}},reset:function(){if(this.p2)
{this.p2.reset();}
if(this.box2d)
{this.box2d.reset();}
if(this.matter)
{this.matter.reset();}},destroy:function(){if(this.p2)
{this.p2.destroy();}
if(this.box2d)
{this.box2d.destroy();}
if(this.matter)
{this.matter.destroy();}
this.arcade=null;this.ninja=null;this.p2=null;this.box2d=null;this.matter=null;}};Phaser.Physics.prototype.constructor=Phaser.Physics;Phaser.Physics.Arcade=function(game){this.game=game;this.gravity=new Phaser.Point();this.bounds=new Phaser.Rectangle(0,0,game.world.width,game.world.height);this.checkCollision={up:true,down:true,left:true,right:true};this.maxObjects=10;this.maxLevels=4;this.OVERLAP_BIAS=4;this.forceX=false;this.sortDirection=Phaser.Physics.Arcade.LEFT_RIGHT;this.skipQuadTree=true;this.isPaused=false;this.quadTree=new Phaser.QuadTree(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height,this.maxObjects,this.maxLevels);this._total=0;this.setBoundsToWorld();};Phaser.Physics.Arcade.prototype.constructor=Phaser.Physics.Arcade;Phaser.Physics.Arcade.SORT_NONE=0;Phaser.Physics.Arcade.LEFT_RIGHT=1;Phaser.Physics.Arcade.RIGHT_LEFT=2;Phaser.Physics.Arcade.TOP_BOTTOM=3;Phaser.Physics.Arcade.BOTTOM_TOP=4;Phaser.Physics.Arcade.prototype={setBounds:function(x,y,width,height){this.bounds.setTo(x,y,width,height);},setBoundsToWorld:function(){this.bounds.copyFrom(this.game.world.bounds);},enable:function(object,children){if(children===undefined){children=true;}
var i=1;if(Array.isArray(object))
{i=object.length;while(i--)
{if(object[i]instanceof Phaser.Group)
{this.enable(object[i].children,children);}
else
{this.enableBody(object[i]);if(children&&object[i].hasOwnProperty('children')&&object[i].children.length>0)
{this.enable(object[i],true);}}}}
else
{if(object instanceof Phaser.Group)
{this.enable(object.children,children);}
else
{this.enableBody(object);if(children&&object.hasOwnProperty('children')&&object.children.length>0)
{this.enable(object.children,true);}}}},enableBody:function(object){if(object.hasOwnProperty('body')&&object.body===null)
{object.body=new Phaser.Physics.Arcade.Body(object);if(object.parent&&object.parent instanceof Phaser.Group)
{object.parent.addToHash(object);}}},updateMotion:function(body){var velocityDelta=this.computeVelocity(0,body,body.angularVelocity,body.angularAcceleration,body.angularDrag,body.maxAngular)-body.angularVelocity;body.angularVelocity+=velocityDelta;body.rotation+=(body.angularVelocity*this.game.time.physicsElapsed);body.velocity.x=this.computeVelocity(1,body,body.velocity.x,body.acceleration.x,body.drag.x,body.maxVelocity.x);body.velocity.y=this.computeVelocity(2,body,body.velocity.y,body.acceleration.y,body.drag.y,body.maxVelocity.y);},computeVelocity:function(axis,body,velocity,acceleration,drag,max){if(max===undefined){max=10000;}
if(axis===1&&body.allowGravity)
{velocity+=(this.gravity.x+body.gravity.x)*this.game.time.physicsElapsed;}
else if(axis===2&&body.allowGravity)
{velocity+=(this.gravity.y+body.gravity.y)*this.game.time.physicsElapsed;}
if(acceleration)
{velocity+=acceleration*this.game.time.physicsElapsed;}
else if(drag)
{drag*=this.game.time.physicsElapsed;if(velocity-drag>0)
{velocity-=drag;}
else if(velocity+drag<0)
{velocity+=drag;}
else
{velocity=0;}}
if(velocity>max)
{velocity=max;}
else if(velocity<-max)
{velocity=-max;}
return velocity;},overlap:function(object1,object2,overlapCallback,processCallback,callbackContext){overlapCallback=overlapCallback||null;processCallback=processCallback||null;callbackContext=callbackContext||overlapCallback;this._total=0;if(!Array.isArray(object1)&&Array.isArray(object2))
{for(var i=0;i<object2.length;i++)
{this.collideHandler(object1,object2[i],overlapCallback,processCallback,callbackContext,true);}}
else if(Array.isArray(object1)&&!Array.isArray(object2))
{for(var i=0;i<object1.length;i++)
{this.collideHandler(object1[i],object2,overlapCallback,processCallback,callbackContext,true);}}
else if(Array.isArray(object1)&&Array.isArray(object2))
{for(var i=0;i<object1.length;i++)
{for(var j=0;j<object2.length;j++)
{this.collideHandler(object1[i],object2[j],overlapCallback,processCallback,callbackContext,true);}}}
else
{this.collideHandler(object1,object2,overlapCallback,processCallback,callbackContext,true);}
return(this._total>0);},collide:function(object1,object2,collideCallback,processCallback,callbackContext){collideCallback=collideCallback||null;processCallback=processCallback||null;callbackContext=callbackContext||collideCallback;this._total=0;if(!Array.isArray(object1)&&Array.isArray(object2))
{for(var i=0;i<object2.length;i++)
{this.collideHandler(object1,object2[i],collideCallback,processCallback,callbackContext,false);}}
else if(Array.isArray(object1)&&!Array.isArray(object2))
{for(var i=0;i<object1.length;i++)
{this.collideHandler(object1[i],object2,collideCallback,processCallback,callbackContext,false);}}
else if(Array.isArray(object1)&&Array.isArray(object2))
{for(var i=0;i<object1.length;i++)
{for(var j=0;j<object2.length;j++)
{this.collideHandler(object1[i],object2[j],collideCallback,processCallback,callbackContext,false);}}}
else
{this.collideHandler(object1,object2,collideCallback,processCallback,callbackContext,false);}
return(this._total>0);},sortLeftRight:function(a,b){if(!a.body||!b.body)
{return 0;}
return a.body.x-b.body.x;},sortRightLeft:function(a,b){if(!a.body||!b.body)
{return 0;}
return b.body.x-a.body.x;},sortTopBottom:function(a,b){if(!a.body||!b.body)
{return 0;}
return a.body.y-b.body.y;},sortBottomTop:function(a,b){if(!a.body||!b.body)
{return 0;}
return b.body.y-a.body.y;},sort:function(group,sortDirection){if(group.physicsSortDirection!==null)
{sortDirection=group.physicsSortDirection;}
else
{if(sortDirection===undefined){sortDirection=this.sortDirection;}}
if(sortDirection===Phaser.Physics.Arcade.LEFT_RIGHT)
{group.hash.sort(this.sortLeftRight);}
else if(sortDirection===Phaser.Physics.Arcade.RIGHT_LEFT)
{group.hash.sort(this.sortRightLeft);}
else if(sortDirection===Phaser.Physics.Arcade.TOP_BOTTOM)
{group.hash.sort(this.sortTopBottom);}
else if(sortDirection===Phaser.Physics.Arcade.BOTTOM_TOP)
{group.hash.sort(this.sortBottomTop);}},collideHandler:function(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly){if(object2===undefined&&object1.physicsType===Phaser.GROUP)
{this.sort(object1);this.collideGroupVsSelf(object1,collideCallback,processCallback,callbackContext,overlapOnly);return;}
if(!object1||!object2||!object1.exists||!object2.exists)
{return;}
if(this.sortDirection!==Phaser.Physics.Arcade.SORT_NONE)
{if(object1.physicsType===Phaser.GROUP)
{this.sort(object1);}
if(object2.physicsType===Phaser.GROUP)
{this.sort(object2);}}
if(object1.physicsType===Phaser.SPRITE)
{if(object2.physicsType===Phaser.SPRITE)
{this.collideSpriteVsSprite(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}
else if(object2.physicsType===Phaser.GROUP)
{this.collideSpriteVsGroup(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}
else if(object2.physicsType===Phaser.TILEMAPLAYER)
{this.collideSpriteVsTilemapLayer(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}}
else if(object1.physicsType===Phaser.GROUP)
{if(object2.physicsType===Phaser.SPRITE)
{this.collideSpriteVsGroup(object2,object1,collideCallback,processCallback,callbackContext,overlapOnly);}
else if(object2.physicsType===Phaser.GROUP)
{this.collideGroupVsGroup(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}
else if(object2.physicsType===Phaser.TILEMAPLAYER)
{this.collideGroupVsTilemapLayer(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}}
else if(object1.physicsType===Phaser.TILEMAPLAYER)
{if(object2.physicsType===Phaser.SPRITE)
{this.collideSpriteVsTilemapLayer(object2,object1,collideCallback,processCallback,callbackContext,overlapOnly);}
else if(object2.physicsType===Phaser.GROUP)
{this.collideGroupVsTilemapLayer(object2,object1,collideCallback,processCallback,callbackContext,overlapOnly);}}},collideSpriteVsSprite:function(sprite1,sprite2,collideCallback,processCallback,callbackContext,overlapOnly){if(!sprite1.body||!sprite2.body)
{return false;}
if(this.separate(sprite1.body,sprite2.body,processCallback,callbackContext,overlapOnly))
{if(collideCallback)
{collideCallback.call(callbackContext,sprite1,sprite2);}
this._total++;}
return true;},collideSpriteVsGroup:function(sprite,group,collideCallback,processCallback,callbackContext,overlapOnly){if(group.length===0||!sprite.body)
{return;}
var body;if(this.skipQuadTree||sprite.body.skipQuadTree)
{for(var i=0;i<group.hash.length;i++)
{if(!group.hash[i]||!group.hash[i].exists||!group.hash[i].body)
{continue;}
body=group.hash[i].body;if(this.sortDirection===Phaser.Physics.Arcade.LEFT_RIGHT)
{if(sprite.body.right<body.x)
{break;}
else if(body.right<sprite.body.x)
{continue;}}
else if(this.sortDirection===Phaser.Physics.Arcade.RIGHT_LEFT)
{if(sprite.body.x>body.right)
{break;}
else if(body.x>sprite.body.right)
{continue;}}
else if(this.sortDirection===Phaser.Physics.Arcade.TOP_BOTTOM)
{if(sprite.body.bottom<body.y)
{break;}
else if(body.bottom<sprite.body.y)
{continue;}}
else if(this.sortDirection===Phaser.Physics.Arcade.BOTTOM_TOP)
{if(sprite.body.y>body.bottom)
{break;}
else if(body.y>sprite.body.bottom)
{continue;}}
this.collideSpriteVsSprite(sprite,group.hash[i],collideCallback,processCallback,callbackContext,overlapOnly);}}
else
{this.quadTree.clear();this.quadTree.reset(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height,this.maxObjects,this.maxLevels);this.quadTree.populate(group);var items=this.quadTree.retrieve(sprite);for(var i=0;i<items.length;i++)
{if(this.separate(sprite.body,items[i],processCallback,callbackContext,overlapOnly))
{if(collideCallback)
{collideCallback.call(callbackContext,sprite,items[i].sprite);}
this._total++;}}}},collideGroupVsSelf:function(group,collideCallback,processCallback,callbackContext,overlapOnly){if(group.length===0)
{return;}
for(var i=0;i<group.hash.length;i++)
{if(!group.hash[i]||!group.hash[i].exists||!group.hash[i].body)
{continue;}
var object1=group.hash[i];for(var j=i+1;j<group.hash.length;j++)
{if(!group.hash[j]||!group.hash[j].exists||!group.hash[j].body)
{continue;}
var object2=group.hash[j];if(this.sortDirection===Phaser.Physics.Arcade.LEFT_RIGHT)
{if(object1.body.right<object2.body.x)
{break;}
else if(object2.body.right<object1.body.x)
{continue;}}
else if(this.sortDirection===Phaser.Physics.Arcade.RIGHT_LEFT)
{if(object1.body.x>object2.body.right)
{continue;}
else if(object2.body.x>object1.body.right)
{break;}}
else if(this.sortDirection===Phaser.Physics.Arcade.TOP_BOTTOM)
{if(object1.body.bottom<object2.body.y)
{continue;}
else if(object2.body.bottom<object1.body.y)
{break;}}
else if(this.sortDirection===Phaser.Physics.Arcade.BOTTOM_TOP)
{if(object1.body.y>object2.body.bottom)
{continue;}
else if(object2.body.y>object1.body.bottom)
{break;}}
this.collideSpriteVsSprite(object1,object2,collideCallback,processCallback,callbackContext,overlapOnly);}}},collideGroupVsGroup:function(group1,group2,collideCallback,processCallback,callbackContext,overlapOnly){if(group1.length===0||group2.length===0)
{return;}
for(var i=0;i<group1.children.length;i++)
{if(group1.children[i].exists)
{if(group1.children[i].physicsType===Phaser.GROUP)
{this.collideGroupVsGroup(group1.children[i],group2,collideCallback,processCallback,callbackContext,overlapOnly);}
else
{this.collideSpriteVsGroup(group1.children[i],group2,collideCallback,processCallback,callbackContext,overlapOnly);}}}},separate:function(body1,body2,processCallback,callbackContext,overlapOnly){if(!body1.enable||!body2.enable||!this.intersects(body1,body2))
{return false;}
if(processCallback&&processCallback.call(callbackContext,body1.sprite,body2.sprite)===false)
{return false;}
var result=false;if(this.forceX||Math.abs(this.gravity.y+body1.gravity.y)<Math.abs(this.gravity.x+body1.gravity.x))
{result=(this.separateX(body1,body2,overlapOnly)||this.separateY(body1,body2,overlapOnly));}
else
{result=(this.separateY(body1,body2,overlapOnly)||this.separateX(body1,body2,overlapOnly));}
if(overlapOnly)
{return true;}
else
{return result;}},intersects:function(body1,body2){if(body1.right<=body2.position.x)
{return false;}
if(body1.bottom<=body2.position.y)
{return false;}
if(body1.position.x>=body2.right)
{return false;}
if(body1.position.y>=body2.bottom)
{return false;}
return true;},separateX:function(body1,body2,overlapOnly){if(body1.immovable&&body2.immovable)
{return false;}
var overlap=0;if(this.intersects(body1,body2))
{var maxOverlap=body1.deltaAbsX()+body2.deltaAbsX()+this.OVERLAP_BIAS;if(body1.deltaX()===0&&body2.deltaX()===0)
{body1.embedded=true;body2.embedded=true;}
else if(body1.deltaX()>body2.deltaX())
{overlap=body1.right-body2.x;if((overlap>maxOverlap)||body1.checkCollision.right===false||body2.checkCollision.left===false)
{overlap=0;}
else
{body1.touching.none=false;body1.touching.right=true;body2.touching.none=false;body2.touching.left=true;}}
else if(body1.deltaX()<body2.deltaX())
{overlap=body1.x-body2.width-body2.x;if((-overlap>maxOverlap)||body1.checkCollision.left===false||body2.checkCollision.right===false)
{overlap=0;}
else
{body1.touching.none=false;body1.touching.left=true;body2.touching.none=false;body2.touching.right=true;}}
body1.overlapX=overlap;body2.overlapX=overlap;if(overlap!==0)
{if(overlapOnly||body1.customSeparateX||body2.customSeparateX)
{return true;}
var v1=body1.velocity.x;var v2=body2.velocity.x;if(!body1.immovable&&!body2.immovable)
{overlap*=0.5;body1.x=body1.x-overlap;body2.x+=overlap;var nv1=Math.sqrt((v2*v2*body2.mass)/ body1.mass)*((v2>0)?1:-1);var nv2=Math.sqrt((v1*v1*body1.mass)/ body2.mass)*((v1>0)?1:-1);var avg=(nv1+nv2)*0.5;nv1-=avg;nv2-=avg;body1.velocity.x=avg+nv1*body1.bounce.x;body2.velocity.x=avg+nv2*body2.bounce.x;}
else if(!body1.immovable)
{body1.x=body1.x-overlap;body1.velocity.x=v2-v1*body1.bounce.x;if(body2.moves)
{body1.y+=(body2.y-body2.prev.y)*body2.friction.y;}}
else if(!body2.immovable)
{body2.x+=overlap;body2.velocity.x=v1-v2*body2.bounce.x;if(body1.moves)
{body2.y+=(body1.y-body1.prev.y)*body1.friction.y;}}
return true;}}
return false;},separateY:function(body1,body2,overlapOnly){if(body1.immovable&&body2.immovable)
{return false;}
var overlap=0;if(this.intersects(body1,body2))
{var maxOverlap=body1.deltaAbsY()+body2.deltaAbsY()+this.OVERLAP_BIAS;if(body1.deltaY()===0&&body2.deltaY()===0)
{body1.embedded=true;body2.embedded=true;}
else if(body1.deltaY()>body2.deltaY())
{overlap=body1.bottom-body2.y;if((overlap>maxOverlap)||body1.checkCollision.down===false||body2.checkCollision.up===false)
{overlap=0;}
else
{body1.touching.none=false;body1.touching.down=true;body2.touching.none=false;body2.touching.up=true;}}
else if(body1.deltaY()<body2.deltaY())
{overlap=body1.y-body2.bottom;if((-overlap>maxOverlap)||body1.checkCollision.up===false||body2.checkCollision.down===false)
{overlap=0;}
else
{body1.touching.none=false;body1.touching.up=true;body2.touching.none=false;body2.touching.down=true;}}
body1.overlapY=overlap;body2.overlapY=overlap;if(overlap!==0)
{if(overlapOnly||body1.customSeparateY||body2.customSeparateY)
{return true;}
var v1=body1.velocity.y;var v2=body2.velocity.y;if(!body1.immovable&&!body2.immovable)
{overlap*=0.5;body1.y=body1.y-overlap;body2.y+=overlap;var nv1=Math.sqrt((v2*v2*body2.mass)/ body1.mass)*((v2>0)?1:-1);var nv2=Math.sqrt((v1*v1*body1.mass)/ body2.mass)*((v1>0)?1:-1);var avg=(nv1+nv2)*0.5;nv1-=avg;nv2-=avg;body1.velocity.y=avg+nv1*body1.bounce.y;body2.velocity.y=avg+nv2*body2.bounce.y;}
else if(!body1.immovable)
{body1.y=body1.y-overlap;body1.velocity.y=v2-v1*body1.bounce.y;if(body2.moves)
{body1.x+=(body2.x-body2.prev.x)*body2.friction.x;}}
else if(!body2.immovable)
{body2.y+=overlap;body2.velocity.y=v1-v2*body2.bounce.y;if(body1.moves)
{body2.x+=(body1.x-body1.prev.x)*body1.friction.x;}}
return true;}}
return false;},getObjectsUnderPointer:function(pointer,group,callback,callbackContext){if(group.length===0||!pointer.exists)
{return;}
return this.getObjectsAtLocation(pointer.x,pointer.y,group,callback,callbackContext,pointer);},getObjectsAtLocation:function(x,y,group,callback,callbackContext,callbackArg){this.quadTree.clear();this.quadTree.reset(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height,this.maxObjects,this.maxLevels);this.quadTree.populate(group);var rect=new Phaser.Rectangle(x,y,1,1);var output=[];var items=this.quadTree.retrieve(rect);for(var i=0;i<items.length;i++)
{if(items[i].hitTest(x,y))
{if(callback)
{callback.call(callbackContext,callbackArg,items[i].sprite);}
output.push(items[i].sprite);}}
return output;},moveToObject:function(displayObject,destination,speed,maxTime){if(speed===undefined){speed=60;}
if(maxTime===undefined){maxTime=0;}
var angle=Math.atan2(destination.y-displayObject.y,destination.x-displayObject.x);if(maxTime>0)
{speed=this.distanceBetween(displayObject,destination)/(maxTime / 1000);}
displayObject.body.velocity.x=Math.cos(angle)*speed;displayObject.body.velocity.y=Math.sin(angle)*speed;return angle;},moveToPointer:function(displayObject,speed,pointer,maxTime){if(speed===undefined){speed=60;}
pointer=pointer||this.game.input.activePointer;if(maxTime===undefined){maxTime=0;}
var angle=this.angleToPointer(displayObject,pointer);if(maxTime>0)
{speed=this.distanceToPointer(displayObject,pointer)/(maxTime / 1000);}
displayObject.body.velocity.x=Math.cos(angle)*speed;displayObject.body.velocity.y=Math.sin(angle)*speed;return angle;},moveToXY:function(displayObject,x,y,speed,maxTime){if(speed===undefined){speed=60;}
if(maxTime===undefined){maxTime=0;}
var angle=Math.atan2(y-displayObject.y,x-displayObject.x);if(maxTime>0)
{speed=this.distanceToXY(displayObject,x,y)/(maxTime / 1000);}
displayObject.body.velocity.x=Math.cos(angle)*speed;displayObject.body.velocity.y=Math.sin(angle)*speed;return angle;},velocityFromAngle:function(angle,speed,point){if(speed===undefined){speed=60;}
point=point||new Phaser.Point();return point.setTo((Math.cos(this.game.math.degToRad(angle))*speed),(Math.sin(this.game.math.degToRad(angle))*speed));},velocityFromRotation:function(rotation,speed,point){if(speed===undefined){speed=60;}
point=point||new Phaser.Point();return point.setTo((Math.cos(rotation)*speed),(Math.sin(rotation)*speed));},accelerationFromRotation:function(rotation,speed,point){if(speed===undefined){speed=60;}
point=point||new Phaser.Point();return point.setTo((Math.cos(rotation)*speed),(Math.sin(rotation)*speed));},accelerateToObject:function(displayObject,destination,speed,xSpeedMax,ySpeedMax){if(speed===undefined){speed=60;}
if(xSpeedMax===undefined){xSpeedMax=1000;}
if(ySpeedMax===undefined){ySpeedMax=1000;}
var angle=this.angleBetween(displayObject,destination);displayObject.body.acceleration.setTo(Math.cos(angle)*speed,Math.sin(angle)*speed);displayObject.body.maxVelocity.setTo(xSpeedMax,ySpeedMax);return angle;},accelerateToPointer:function(displayObject,pointer,speed,xSpeedMax,ySpeedMax){if(speed===undefined){speed=60;}
if(pointer===undefined){pointer=this.game.input.activePointer;}
if(xSpeedMax===undefined){xSpeedMax=1000;}
if(ySpeedMax===undefined){ySpeedMax=1000;}
var angle=this.angleToPointer(displayObject,pointer);displayObject.body.acceleration.setTo(Math.cos(angle)*speed,Math.sin(angle)*speed);displayObject.body.maxVelocity.setTo(xSpeedMax,ySpeedMax);return angle;},accelerateToXY:function(displayObject,x,y,speed,xSpeedMax,ySpeedMax){if(speed===undefined){speed=60;}
if(xSpeedMax===undefined){xSpeedMax=1000;}
if(ySpeedMax===undefined){ySpeedMax=1000;}
var angle=this.angleToXY(displayObject,x,y);displayObject.body.acceleration.setTo(Math.cos(angle)*speed,Math.sin(angle)*speed);displayObject.body.maxVelocity.setTo(xSpeedMax,ySpeedMax);return angle;},distanceBetween:function(source,target){var dx=source.x-target.x;var dy=source.y-target.y;return Math.sqrt(dx*dx+dy*dy);},distanceToXY:function(displayObject,x,y){var dx=displayObject.x-x;var dy=displayObject.y-y;return Math.sqrt(dx*dx+dy*dy);},distanceToPointer:function(displayObject,pointer){pointer=pointer||this.game.input.activePointer;var dx=displayObject.x-pointer.worldX;var dy=displayObject.y-pointer.worldY;return Math.sqrt(dx*dx+dy*dy);},angleBetween:function(source,target){var dx=target.x-source.x;var dy=target.y-source.y;return Math.atan2(dy,dx);},angleToXY:function(displayObject,x,y){var dx=x-displayObject.x;var dy=y-displayObject.y;return Math.atan2(dy,dx);},angleToPointer:function(displayObject,pointer){pointer=pointer||this.game.input.activePointer;var dx=pointer.worldX-displayObject.x;var dy=pointer.worldY-displayObject.y;return Math.atan2(dy,dx);}};Phaser.Physics.Arcade.Body=function(sprite){this.sprite=sprite;this.game=sprite.game;this.type=Phaser.Physics.ARCADE;this.enable=true;this.offset=new Phaser.Point();this.position=new Phaser.Point(sprite.x,sprite.y);this.prev=new Phaser.Point(this.position.x,this.position.y);this.allowRotation=true;this.rotation=sprite.rotation;this.preRotation=sprite.rotation;this.width=sprite.width;this.height=sprite.height;this.sourceWidth=sprite.width;this.sourceHeight=sprite.height;if(sprite.texture)
{this.sourceWidth=sprite.texture.frame.width;this.sourceHeight=sprite.texture.frame.height;}
this.halfWidth=Math.abs(sprite.width / 2);this.halfHeight=Math.abs(sprite.height / 2);this.center=new Phaser.Point(sprite.x+this.halfWidth,sprite.y+this.halfHeight);this.velocity=new Phaser.Point();this.newVelocity=new Phaser.Point(0,0);this.deltaMax=new Phaser.Point(0,0);this.acceleration=new Phaser.Point();this.drag=new Phaser.Point();this.allowGravity=true;this.gravity=new Phaser.Point(0,0);this.bounce=new Phaser.Point();this.maxVelocity=new Phaser.Point(10000,10000);this.friction=new Phaser.Point(1,0);this.angularVelocity=0;this.angularAcceleration=0;this.angularDrag=0;this.maxAngular=1000;this.mass=1;this.angle=0;this.speed=0;this.facing=Phaser.NONE;this.immovable=false;this.moves=true;this.customSeparateX=false;this.customSeparateY=false;this.overlapX=0;this.overlapY=0;this.embedded=false;this.collideWorldBounds=false;this.checkCollision={none:false,any:true,up:true,down:true,left:true,right:true};this.touching={none:true,up:false,down:false,left:false,right:false};this.wasTouching={none:true,up:false,down:false,left:false,right:false};this.blocked={up:false,down:false,left:false,right:false};this.tilePadding=new Phaser.Point();this.dirty=false;this.skipQuadTree=false;this.syncBounds=false;this._reset=true;this._sx=sprite.scale.x;this._sy=sprite.scale.y;this._dx=0;this._dy=0;};Phaser.Physics.Arcade.Body.prototype={updateBounds:function(){if(this.syncBounds)
{var b=this.sprite.getBounds();b.ceilAll();if(b.width!==this.width||b.height!==this.height)
{this.width=b.width;this.height=b.height;this._reset=true;}}
else
{var asx=Math.abs(this.sprite.scale.x);var asy=Math.abs(this.sprite.scale.y);if(asx!==this._sx||asy!==this._sy)
{this.width=this.sourceWidth*asx;this.height=this.sourceHeight*asy;this._sx=asx;this._sy=asy;this._reset=true;}}
if(this._reset)
{this.halfWidth=Math.floor(this.width / 2);this.halfHeight=Math.floor(this.height / 2);this.center.setTo(this.position.x+this.halfWidth,this.position.y+this.halfHeight);}},preUpdate:function(){if(!this.enable||this.game.physics.arcade.isPaused)
{return;}
this.dirty=true;this.wasTouching.none=this.touching.none;this.wasTouching.up=this.touching.up;this.wasTouching.down=this.touching.down;this.wasTouching.left=this.touching.left;this.wasTouching.right=this.touching.right;this.touching.none=true;this.touching.up=false;this.touching.down=false;this.touching.left=false;this.touching.right=false;this.blocked.up=false;this.blocked.down=false;this.blocked.left=false;this.blocked.right=false;this.embedded=false;this.updateBounds();this.position.x=(this.sprite.world.x-(this.sprite.anchor.x*this.width))+this.offset.x;this.position.y=(this.sprite.world.y-(this.sprite.anchor.y*this.height))+this.offset.y;this.rotation=this.sprite.angle;this.preRotation=this.rotation;if(this._reset||this.sprite.fresh)
{this.prev.x=this.position.x;this.prev.y=this.position.y;}
if(this.moves)
{this.game.physics.arcade.updateMotion(this);this.newVelocity.set(this.velocity.x*this.game.time.physicsElapsed,this.velocity.y*this.game.time.physicsElapsed);this.position.x+=this.newVelocity.x;this.position.y+=this.newVelocity.y;if(this.position.x!==this.prev.x||this.position.y!==this.prev.y)
{this.speed=Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y);this.angle=Math.atan2(this.velocity.y,this.velocity.x);}
if(this.collideWorldBounds)
{this.checkWorldBounds();}}
this._dx=this.deltaX();this._dy=this.deltaY();this._reset=false;},postUpdate:function(){if(!this.enable||!this.dirty)
{return;}
this.dirty=false;if(this.deltaX()<0)
{this.facing=Phaser.LEFT;}
else if(this.deltaX()>0)
{this.facing=Phaser.RIGHT;}
if(this.deltaY()<0)
{this.facing=Phaser.UP;}
else if(this.deltaY()>0)
{this.facing=Phaser.DOWN;}
if(this.moves)
{this._dx=this.deltaX();this._dy=this.deltaY();if(this.deltaMax.x!==0&&this._dx!==0)
{if(this._dx<0&&this._dx<-this.deltaMax.x)
{this._dx=-this.deltaMax.x;}
else if(this._dx>0&&this._dx>this.deltaMax.x)
{this._dx=this.deltaMax.x;}}
if(this.deltaMax.y!==0&&this._dy!==0)
{if(this._dy<0&&this._dy<-this.deltaMax.y)
{this._dy=-this.deltaMax.y;}
else if(this._dy>0&&this._dy>this.deltaMax.y)
{this._dy=this.deltaMax.y;}}
this.sprite.position.x+=this._dx;this.sprite.position.y+=this._dy;this._reset=true;}
this.center.setTo(this.position.x+this.halfWidth,this.position.y+this.halfHeight);if(this.allowRotation)
{this.sprite.angle+=this.deltaZ();}
this.prev.x=this.position.x;this.prev.y=this.position.y;},destroy:function(){if(this.sprite.parent&&this.sprite.parent instanceof Phaser.Group)
{this.sprite.parent.removeFromHash(this.sprite);}
this.sprite.body=null;this.sprite=null;},checkWorldBounds:function(){var pos=this.position;var bounds=this.game.physics.arcade.bounds;var check=this.game.physics.arcade.checkCollision;if(pos.x<bounds.x&&check.left)
{pos.x=bounds.x;this.velocity.x*=-this.bounce.x;this.blocked.left=true;}
else if(this.right>bounds.right&&check.right)
{pos.x=bounds.right-this.width;this.velocity.x*=-this.bounce.x;this.blocked.right=true;}
if(pos.y<bounds.y&&check.up)
{pos.y=bounds.y;this.velocity.y*=-this.bounce.y;this.blocked.up=true;}
else if(this.bottom>bounds.bottom&&check.down)
{pos.y=bounds.bottom-this.height;this.velocity.y*=-this.bounce.y;this.blocked.down=true;}},setSize:function(width,height,offsetX,offsetY){if(offsetX===undefined){offsetX=this.offset.x;}
if(offsetY===undefined){offsetY=this.offset.y;}
this.sourceWidth=width;this.sourceHeight=height;this.width=this.sourceWidth*this._sx;this.height=this.sourceHeight*this._sy;this.halfWidth=Math.floor(this.width / 2);this.halfHeight=Math.floor(this.height / 2);this.offset.setTo(offsetX,offsetY);this.center.setTo(this.position.x+this.halfWidth,this.position.y+this.halfHeight);},reset:function(x,y){this.velocity.set(0);this.acceleration.set(0);this.speed=0;this.angularVelocity=0;this.angularAcceleration=0;this.position.x=(x-(this.sprite.anchor.x*this.width))+this.offset.x;this.position.y=(y-(this.sprite.anchor.y*this.height))+this.offset.y;this.prev.x=this.position.x;this.prev.y=this.position.y;this.rotation=this.sprite.angle;this.preRotation=this.rotation;this._sx=this.sprite.scale.x;this._sy=this.sprite.scale.y;this.center.setTo(this.position.x+this.halfWidth,this.position.y+this.halfHeight);},hitTest:function(x,y){return Phaser.Rectangle.contains(this,x,y);},onFloor:function(){return this.blocked.down;},onWall:function(){return(this.blocked.left||this.blocked.right);},deltaAbsX:function(){return(this.deltaX()>0?this.deltaX():-this.deltaX());},deltaAbsY:function(){return(this.deltaY()>0?this.deltaY():-this.deltaY());},deltaX:function(){return this.position.x-this.prev.x;},deltaY:function(){return this.position.y-this.prev.y;},deltaZ:function(){return this.rotation-this.preRotation;}};Object.defineProperty(Phaser.Physics.Arcade.Body.prototype,"bottom",{get:function(){return this.position.y+this.height;}});Object.defineProperty(Phaser.Physics.Arcade.Body.prototype,"right",{get:function(){return this.position.x+this.width;}});Object.defineProperty(Phaser.Physics.Arcade.Body.prototype,"x",{get:function(){return this.position.x;},set:function(value){this.position.x=value;}});Object.defineProperty(Phaser.Physics.Arcade.Body.prototype,"y",{get:function(){return this.position.y;},set:function(value){this.position.y=value;}});Phaser.Physics.Arcade.Body.render=function(context,body,color,filled){if(filled===undefined){filled=true;}
color=color||'rgba(0,255,0,0.4)';if(filled)
{context.fillStyle=color;context.fillRect(body.position.x-body.game.camera.x,body.position.y-body.game.camera.y,body.width,body.height);}
else
{context.strokeStyle=color;context.strokeRect(body.position.x-body.game.camera.x,body.position.y-body.game.camera.y,body.width,body.height);}};Phaser.Physics.Arcade.Body.renderBodyInfo=function(debug,body){debug.line('x: '+body.x.toFixed(2),'y: '+body.y.toFixed(2),'width: '+body.width,'height: '+body.height);debug.line('velocity x: '+body.velocity.x.toFixed(2),'y: '+body.velocity.y.toFixed(2),'deltaX: '+body._dx.toFixed(2),'deltaY: '+body._dy.toFixed(2));debug.line('acceleration x: '+body.acceleration.x.toFixed(2),'y: '+body.acceleration.y.toFixed(2),'speed: '+body.speed.toFixed(2),'angle: '+body.angle.toFixed(2));debug.line('gravity x: '+body.gravity.x,'y: '+body.gravity.y,'bounce x: '+body.bounce.x.toFixed(2),'y: '+body.bounce.y.toFixed(2));debug.line('touching left: '+body.touching.left,'right: '+body.touching.right,'up: '+body.touching.up,'down: '+body.touching.down);debug.line('blocked left: '+body.blocked.left,'right: '+body.blocked.right,'up: '+body.blocked.up,'down: '+body.blocked.down);};Phaser.Physics.Arcade.Body.prototype.constructor=Phaser.Physics.Arcade.Body;Phaser.Physics.Arcade.TilemapCollision=function(){};Phaser.Physics.Arcade.TilemapCollision.prototype={TILE_BIAS:16,collideSpriteVsTilemapLayer:function(sprite,tilemapLayer,collideCallback,processCallback,callbackContext,overlapOnly){if(!sprite.body)
{return;}
var mapData=tilemapLayer.getTiles(sprite.body.position.x-sprite.body.tilePadding.x,sprite.body.position.y-sprite.body.tilePadding.y,sprite.body.width+sprite.body.tilePadding.x,sprite.body.height+sprite.body.tilePadding.y,false,false);if(mapData.length===0)
{return;}
for(var i=0;i<mapData.length;i++)
{if(processCallback)
{if(processCallback.call(callbackContext,sprite,mapData[i]))
{if(this.separateTile(i,sprite.body,mapData[i],overlapOnly))
{this._total++;if(collideCallback)
{collideCallback.call(callbackContext,sprite,mapData[i]);}}}}
else
{if(this.separateTile(i,sprite.body,mapData[i],overlapOnly))
{this._total++;if(collideCallback)
{collideCallback.call(callbackContext,sprite,mapData[i]);}}}}},collideGroupVsTilemapLayer:function(group,tilemapLayer,collideCallback,processCallback,callbackContext,overlapOnly){if(group.length===0)
{return;}
for(var i=0;i<group.children.length;i++)
{if(group.children[i].exists)
{this.collideSpriteVsTilemapLayer(group.children[i],tilemapLayer,collideCallback,processCallback,callbackContext,overlapOnly);}}},separateTile:function(i,body,tile,overlapOnly){if(!body.enable)
{return false;}
if(!tile.intersects(body.position.x,body.position.y,body.right,body.bottom))
{return false;}
else if(overlapOnly)
{return true;}
if(tile.collisionCallback&&!tile.collisionCallback.call(tile.collisionCallbackContext,body.sprite,tile))
{return false;}
else if(tile.layer.callbacks[tile.index]&&!tile.layer.callbacks[tile.index].callback.call(tile.layer.callbacks[tile.index].callbackContext,body.sprite,tile))
{return false;}
if(!tile.faceLeft&&!tile.faceRight&&!tile.faceTop&&!tile.faceBottom)
{return false;}
var ox=0;var oy=0;var minX=0;var minY=1;if(body.deltaAbsX()>body.deltaAbsY())
{minX=-1;}
else if(body.deltaAbsX()<body.deltaAbsY())
{minY=-1;}
if(body.deltaX()!==0&&body.deltaY()!==0&&(tile.faceLeft||tile.faceRight)&&(tile.faceTop||tile.faceBottom))
{minX=Math.min(Math.abs(body.position.x-tile.right),Math.abs(body.right-tile.left));minY=Math.min(Math.abs(body.position.y-tile.bottom),Math.abs(body.bottom-tile.top));}
if(minX<minY)
{if(tile.faceLeft||tile.faceRight)
{ox=this.tileCheckX(body,tile);if(ox!==0&&!tile.intersects(body.position.x,body.position.y,body.right,body.bottom))
{return true;}}
if(tile.faceTop||tile.faceBottom)
{oy=this.tileCheckY(body,tile);}}
else
{if(tile.faceTop||tile.faceBottom)
{oy=this.tileCheckY(body,tile);if(oy!==0&&!tile.intersects(body.position.x,body.position.y,body.right,body.bottom))
{return true;}}
if(tile.faceLeft||tile.faceRight)
{ox=this.tileCheckX(body,tile);}}
return(ox!==0||oy!==0);},tileCheckX:function(body,tile){var ox=0;if(body.deltaX()<0&&!body.blocked.left&&tile.collideRight&&body.checkCollision.left)
{if(tile.faceRight&&body.x<tile.right)
{ox=body.x-tile.right;if(ox<-this.TILE_BIAS)
{ox=0;}}}
else if(body.deltaX()>0&&!body.blocked.right&&tile.collideLeft&&body.checkCollision.right)
{if(tile.faceLeft&&body.right>tile.left)
{ox=body.right-tile.left;if(ox>this.TILE_BIAS)
{ox=0;}}}
if(ox!==0)
{if(body.customSeparateX)
{body.overlapX=ox;}
else
{this.processTileSeparationX(body,ox);}}
return ox;},tileCheckY:function(body,tile){var oy=0;if(body.deltaY()<0&&!body.blocked.up&&tile.collideDown&&body.checkCollision.up)
{if(tile.faceBottom&&body.y<tile.bottom)
{oy=body.y-tile.bottom;if(oy<-this.TILE_BIAS)
{oy=0;}}}
else if(body.deltaY()>0&&!body.blocked.down&&tile.collideUp&&body.checkCollision.down)
{if(tile.faceTop&&body.bottom>tile.top)
{oy=body.bottom-tile.top;if(oy>this.TILE_BIAS)
{oy=0;}}}
if(oy!==0)
{if(body.customSeparateY)
{body.overlapY=oy;}
else
{this.processTileSeparationY(body,oy);}}
return oy;},processTileSeparationX:function(body,x){if(x<0)
{body.blocked.left=true;}
else if(x>0)
{body.blocked.right=true;}
body.position.x-=x;if(body.bounce.x===0)
{body.velocity.x=0;}
else
{body.velocity.x=-body.velocity.x*body.bounce.x;}},processTileSeparationY:function(body,y){if(y<0)
{body.blocked.up=true;}
else if(y>0)
{body.blocked.down=true;}
body.position.y-=y;if(body.bounce.y===0)
{body.velocity.y=0;}
else
{body.velocity.y=-body.velocity.y*body.bounce.y;}}};Phaser.Utils.mixinPrototype(Phaser.Physics.Arcade.prototype,Phaser.Physics.Arcade.TilemapCollision.prototype);p2.Body.prototype.parent=null;p2.Spring.prototype.parent=null;Phaser.Physics.P2=function(game,config){this.game=game;if(config===undefined)
{config={gravity:[0,0],broadphase:new p2.SAPBroadphase()};}
else
{if(!config.hasOwnProperty('gravity'))
{config.gravity=[0,0];}
if(!config.hasOwnProperty('broadphase'))
{config.broadphase=new p2.SAPBroadphase();}}
this.config=config;this.world=new p2.World(this.config);this.frameRate=1 / 60;this.useElapsedTime=false;this.paused=false;this.materials=[];this.gravity=new Phaser.Physics.P2.InversePointProxy(this,this.world.gravity);this.walls={left:null,right:null,top:null,bottom:null};this.onBodyAdded=new Phaser.Signal();this.onBodyRemoved=new Phaser.Signal();this.onSpringAdded=new Phaser.Signal();this.onSpringRemoved=new Phaser.Signal();this.onConstraintAdded=new Phaser.Signal();this.onConstraintRemoved=new Phaser.Signal();this.onContactMaterialAdded=new Phaser.Signal();this.onContactMaterialRemoved=new Phaser.Signal();this.postBroadphaseCallback=null;this.callbackContext=null;this.onBeginContact=new Phaser.Signal();this.onEndContact=new Phaser.Signal();if(config.hasOwnProperty('mpx')&&config.hasOwnProperty('pxm')&&config.hasOwnProperty('mpxi')&&config.hasOwnProperty('pxmi'))
{this.mpx=config.mpx;this.mpxi=config.mpxi;this.pxm=config.pxm;this.pxmi=config.pxmi;}
this.world.on("beginContact",this.beginContactHandler,this);this.world.on("endContact",this.endContactHandler,this);this.collisionGroups=[];this.nothingCollisionGroup=new Phaser.Physics.P2.CollisionGroup(1);this.boundsCollisionGroup=new Phaser.Physics.P2.CollisionGroup(2);this.everythingCollisionGroup=new Phaser.Physics.P2.CollisionGroup(2147483648);this.boundsCollidesWith=[];this._toRemove=[];this._collisionGroupID=2;this._boundsLeft=true;this._boundsRight=true;this._boundsTop=true;this._boundsBottom=true;this._boundsOwnGroup=false;this.setBoundsToWorld(true,true,true,true,false);};Phaser.Physics.P2.prototype={removeBodyNextStep:function(body){this._toRemove.push(body);},preUpdate:function(){var i=this._toRemove.length;while(i--)
{this.removeBody(this._toRemove[i]);}
this._toRemove.length=0;},enable:function(object,debug,children){if(debug===undefined){debug=false;}
if(children===undefined){children=true;}
var i=1;if(Array.isArray(object))
{i=object.length;while(i--)
{if(object[i]instanceof Phaser.Group)
{this.enable(object[i].children,debug,children);}
else
{this.enableBody(object[i],debug);if(children&&object[i].hasOwnProperty('children')&&object[i].children.length>0)
{this.enable(object[i],debug,true);}}}}
else
{if(object instanceof Phaser.Group)
{this.enable(object.children,debug,children);}
else
{this.enableBody(object,debug);if(children&&object.hasOwnProperty('children')&&object.children.length>0)
{this.enable(object.children,debug,true);}}}},enableBody:function(object,debug){if(object.hasOwnProperty('body')&&object.body===null)
{object.body=new Phaser.Physics.P2.Body(this.game,object,object.x,object.y,1);object.body.debug=debug;if(typeof object.anchor!=='undefined'){object.anchor.set(0.5);}}},setImpactEvents:function(state){if(state)
{this.world.on("impact",this.impactHandler,this);}
else
{this.world.off("impact",this.impactHandler,this);}},setPostBroadphaseCallback:function(callback,context){this.postBroadphaseCallback=callback;this.callbackContext=context;if(callback!==null)
{this.world.on("postBroadphase",this.postBroadphaseHandler,this);}
else
{this.world.off("postBroadphase",this.postBroadphaseHandler,this);}},postBroadphaseHandler:function(event){if(!this.postBroadphaseCallback||event.pairs.length===0)
{return;}
for(var i=event.pairs.length-2;i>=0;i-=2)
{if(event.pairs[i].parent&&event.pairs[i+1].parent&&!this.postBroadphaseCallback.call(this.callbackContext,event.pairs[i].parent,event.pairs[i+1].parent))
{event.pairs.splice(i,2);}}},impactHandler:function(event){if(event.bodyA.parent&&event.bodyB.parent)
{var a=event.bodyA.parent;var b=event.bodyB.parent;if(a._bodyCallbacks[event.bodyB.id])
{a._bodyCallbacks[event.bodyB.id].call(a._bodyCallbackContext[event.bodyB.id],a,b,event.shapeA,event.shapeB);}
if(b._bodyCallbacks[event.bodyA.id])
{b._bodyCallbacks[event.bodyA.id].call(b._bodyCallbackContext[event.bodyA.id],b,a,event.shapeB,event.shapeA);}
if(a._groupCallbacks[event.shapeB.collisionGroup])
{a._groupCallbacks[event.shapeB.collisionGroup].call(a._groupCallbackContext[event.shapeB.collisionGroup],a,b,event.shapeA,event.shapeB);}
if(b._groupCallbacks[event.shapeA.collisionGroup])
{b._groupCallbacks[event.shapeA.collisionGroup].call(b._groupCallbackContext[event.shapeA.collisionGroup],b,a,event.shapeB,event.shapeA);}}},beginContactHandler:function(event){if(event.bodyA&&event.bodyB)
{this.onBeginContact.dispatch(event.bodyA,event.bodyB,event.shapeA,event.shapeB,event.contactEquations);if(event.bodyA.parent)
{event.bodyA.parent.onBeginContact.dispatch(event.bodyB.parent,event.bodyB,event.shapeA,event.shapeB,event.contactEquations);}
if(event.bodyB.parent)
{event.bodyB.parent.onBeginContact.dispatch(event.bodyA.parent,event.bodyA,event.shapeB,event.shapeA,event.contactEquations);}}},endContactHandler:function(event){if(event.bodyA&&event.bodyB)
{this.onEndContact.dispatch(event.bodyA,event.bodyB,event.shapeA,event.shapeB);if(event.bodyA.parent)
{event.bodyA.parent.onEndContact.dispatch(event.bodyB.parent,event.bodyB,event.shapeA,event.shapeB);}
if(event.bodyB.parent)
{event.bodyB.parent.onEndContact.dispatch(event.bodyA.parent,event.bodyA,event.shapeB,event.shapeA);}}},setBoundsToWorld:function(left,right,top,bottom,setCollisionGroup){this.setBounds(this.game.world.bounds.x,this.game.world.bounds.y,this.game.world.bounds.width,this.game.world.bounds.height,left,right,top,bottom,setCollisionGroup);},setWorldMaterial:function(material,left,right,top,bottom){if(left===undefined){left=true;}
if(right===undefined){right=true;}
if(top===undefined){top=true;}
if(bottom===undefined){bottom=true;}
if(left&&this.walls.left)
{this.walls.left.shapes[0].material=material;}
if(right&&this.walls.right)
{this.walls.right.shapes[0].material=material;}
if(top&&this.walls.top)
{this.walls.top.shapes[0].material=material;}
if(bottom&&this.walls.bottom)
{this.walls.bottom.shapes[0].material=material;}},updateBoundsCollisionGroup:function(setCollisionGroup){var mask=this.everythingCollisionGroup.mask;if(setCollisionGroup===undefined){mask=this.boundsCollisionGroup.mask;}
if(this.walls.left)
{this.walls.left.shapes[0].collisionGroup=mask;}
if(this.walls.right)
{this.walls.right.shapes[0].collisionGroup=mask;}
if(this.walls.top)
{this.walls.top.shapes[0].collisionGroup=mask;}
if(this.walls.bottom)
{this.walls.bottom.shapes[0].collisionGroup=mask;}},setBounds:function(x,y,width,height,left,right,top,bottom,setCollisionGroup){if(left===undefined){left=this._boundsLeft;}
if(right===undefined){right=this._boundsRight;}
if(top===undefined){top=this._boundsTop;}
if(bottom===undefined){bottom=this._boundsBottom;}
if(setCollisionGroup===undefined){setCollisionGroup=this._boundsOwnGroup;}
if(this.walls.left)
{this.world.removeBody(this.walls.left);}
if(this.walls.right)
{this.world.removeBody(this.walls.right);}
if(this.walls.top)
{this.world.removeBody(this.walls.top);}
if(this.walls.bottom)
{this.world.removeBody(this.walls.bottom);}
if(left)
{this.walls.left=new p2.Body({mass:0,position:[this.pxmi(x),this.pxmi(y)],angle:1.5707963267948966});this.walls.left.addShape(new p2.Plane());if(setCollisionGroup)
{this.walls.left.shapes[0].collisionGroup=this.boundsCollisionGroup.mask;}
this.world.addBody(this.walls.left);}
if(right)
{this.walls.right=new p2.Body({mass:0,position:[this.pxmi(x+width),this.pxmi(y)],angle:-1.5707963267948966});this.walls.right.addShape(new p2.Plane());if(setCollisionGroup)
{this.walls.right.shapes[0].collisionGroup=this.boundsCollisionGroup.mask;}
this.world.addBody(this.walls.right);}
if(top)
{this.walls.top=new p2.Body({mass:0,position:[this.pxmi(x),this.pxmi(y)],angle:-3.141592653589793});this.walls.top.addShape(new p2.Plane());if(setCollisionGroup)
{this.walls.top.shapes[0].collisionGroup=this.boundsCollisionGroup.mask;}
this.world.addBody(this.walls.top);}
if(bottom)
{this.walls.bottom=new p2.Body({mass:0,position:[this.pxmi(x),this.pxmi(y+height)]});this.walls.bottom.addShape(new p2.Plane());if(setCollisionGroup)
{this.walls.bottom.shapes[0].collisionGroup=this.boundsCollisionGroup.mask;}
this.world.addBody(this.walls.bottom);}
this._boundsLeft=left;this._boundsRight=right;this._boundsTop=top;this._boundsBottom=bottom;this._boundsOwnGroup=setCollisionGroup;},pause:function(){this.paused=true;},resume:function(){this.paused=false;},update:function(){if(this.paused)
{return;}
if(this.useElapsedTime)
{this.world.step(this.game.time.physicsElapsed);}
else
{this.world.step(this.frameRate);}},reset:function(){this.world.on("beginContact",this.beginContactHandler,this);this.world.on("endContact",this.endContactHandler,this);this.nothingCollisionGroup=new Phaser.Physics.P2.CollisionGroup(1);this.boundsCollisionGroup=new Phaser.Physics.P2.CollisionGroup(2);this.everythingCollisionGroup=new Phaser.Physics.P2.CollisionGroup(2147483648);this._collisionGroupID=2;this.setBoundsToWorld(true,true,true,true,false);},clear:function(){this.world.time=0;this.world.fixedStepTime=0;if(this.world.solver&&this.world.solver.equations.length)
{this.world.solver.removeAllEquations();}
var cs=this.world.constraints;for(var i=cs.length-1;i>=0;i--)
{this.world.removeConstraint(cs[i]);}
var bodies=this.world.bodies;for(var i=bodies.length-1;i>=0;i--)
{this.world.removeBody(bodies[i]);}
var springs=this.world.springs;for(var i=springs.length-1;i>=0;i--)
{this.world.removeSpring(springs[i]);}
var cms=this.world.contactMaterials;for(var i=cms.length-1;i>=0;i--)
{this.world.removeContactMaterial(cms[i]);}
this.world.off("beginContact",this.beginContactHandler,this);this.world.off("endContact",this.endContactHandler,this);this.postBroadphaseCallback=null;this.callbackContext=null;this.impactCallback=null;this.collisionGroups=[];this._toRemove=[];this.boundsCollidesWith=[];},destroy:function(){this.clear();this.game=null;},addBody:function(body){if(body.data.world)
{return false;}
else
{this.world.addBody(body.data);this.onBodyAdded.dispatch(body);return true;}},removeBody:function(body){if(body.data.world==this.world)
{this.world.removeBody(body.data);this.onBodyRemoved.dispatch(body);}
return body;},addSpring:function(spring){if(spring instanceof Phaser.Physics.P2.Spring||spring instanceof Phaser.Physics.P2.RotationalSpring)
{this.world.addSpring(spring.data);}
else
{this.world.addSpring(spring);}
this.onSpringAdded.dispatch(spring);return spring;},removeSpring:function(spring){if(spring instanceof Phaser.Physics.P2.Spring||spring instanceof Phaser.Physics.P2.RotationalSpring)
{this.world.removeSpring(spring.data);}
else
{this.world.removeSpring(spring);}
this.onSpringRemoved.dispatch(spring);return spring;},createDistanceConstraint:function(bodyA,bodyB,distance,localAnchorA,localAnchorB,maxForce){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Constraint, invalid body objects given');}
else
{return this.addConstraint(new Phaser.Physics.P2.DistanceConstraint(this,bodyA,bodyB,distance,localAnchorA,localAnchorB,maxForce));}},createGearConstraint:function(bodyA,bodyB,angle,ratio){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Constraint, invalid body objects given');}
else
{return this.addConstraint(new Phaser.Physics.P2.GearConstraint(this,bodyA,bodyB,angle,ratio));}},createRevoluteConstraint:function(bodyA,pivotA,bodyB,pivotB,maxForce,worldPivot){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Constraint, invalid body objects given');}
else
{return this.addConstraint(new Phaser.Physics.P2.RevoluteConstraint(this,bodyA,pivotA,bodyB,pivotB,maxForce,worldPivot));}},createLockConstraint:function(bodyA,bodyB,offset,angle,maxForce){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Constraint, invalid body objects given');}
else
{return this.addConstraint(new Phaser.Physics.P2.LockConstraint(this,bodyA,bodyB,offset,angle,maxForce));}},createPrismaticConstraint:function(bodyA,bodyB,lockRotation,anchorA,anchorB,axis,maxForce){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Constraint, invalid body objects given');}
else
{return this.addConstraint(new Phaser.Physics.P2.PrismaticConstraint(this,bodyA,bodyB,lockRotation,anchorA,anchorB,axis,maxForce));}},addConstraint:function(constraint){this.world.addConstraint(constraint);this.onConstraintAdded.dispatch(constraint);return constraint;},removeConstraint:function(constraint){this.world.removeConstraint(constraint);this.onConstraintRemoved.dispatch(constraint);return constraint;},addContactMaterial:function(material){this.world.addContactMaterial(material);this.onContactMaterialAdded.dispatch(material);return material;},removeContactMaterial:function(material){this.world.removeContactMaterial(material);this.onContactMaterialRemoved.dispatch(material);return material;},getContactMaterial:function(materialA,materialB){return this.world.getContactMaterial(materialA,materialB);},setMaterial:function(material,bodies){var i=bodies.length;while(i--)
{bodies[i].setMaterial(material);}},createMaterial:function(name,body){name=name||'';var material=new Phaser.Physics.P2.Material(name);this.materials.push(material);if(typeof body!=='undefined')
{body.setMaterial(material);}
return material;},createContactMaterial:function(materialA,materialB,options){if(materialA===undefined){materialA=this.createMaterial();}
if(materialB===undefined){materialB=this.createMaterial();}
var contact=new Phaser.Physics.P2.ContactMaterial(materialA,materialB,options);return this.addContactMaterial(contact);},getBodies:function(){var output=[];var i=this.world.bodies.length;while(i--)
{output.push(this.world.bodies[i].parent);}
return output;},getBody:function(object){if(object instanceof p2.Body)
{return object;}
else if(object instanceof Phaser.Physics.P2.Body)
{return object.data;}
else if(object['body']&&object['body'].type===Phaser.Physics.P2JS)
{return object.body.data;}
return null;},getSprings:function(){var output=[];var i=this.world.springs.length;while(i--)
{output.push(this.world.springs[i].parent);}
return output;},getConstraints:function(){var output=[];var i=this.world.constraints.length;while(i--)
{output.push(this.world.constraints[i]);}
return output;},hitTest:function(worldPoint,bodies,precision,filterStatic){if(bodies===undefined){bodies=this.world.bodies;}
if(precision===undefined){precision=5;}
if(filterStatic===undefined){filterStatic=false;}
var physicsPosition=[this.pxmi(worldPoint.x),this.pxmi(worldPoint.y)];var query=[];var i=bodies.length;while(i--)
{if(bodies[i]instanceof Phaser.Physics.P2.Body&&!(filterStatic&&bodies[i].data.type===p2.Body.STATIC))
{query.push(bodies[i].data);}
else if(bodies[i]instanceof p2.Body&&bodies[i].parent&&!(filterStatic&&bodies[i].type===p2.Body.STATIC))
{query.push(bodies[i]);}
else if(bodies[i]instanceof Phaser.Sprite&&bodies[i].hasOwnProperty('body')&&!(filterStatic&&bodies[i].body.data.type===p2.Body.STATIC))
{query.push(bodies[i].body.data);}}
return this.world.hitTest(physicsPosition,query,precision);},toJSON:function(){return this.world.toJSON();},createCollisionGroup:function(object){var bitmask=Math.pow(2,this._collisionGroupID);if(this.walls.left)
{this.walls.left.shapes[0].collisionMask=this.walls.left.shapes[0].collisionMask|bitmask;}
if(this.walls.right)
{this.walls.right.shapes[0].collisionMask=this.walls.right.shapes[0].collisionMask|bitmask;}
if(this.walls.top)
{this.walls.top.shapes[0].collisionMask=this.walls.top.shapes[0].collisionMask|bitmask;}
if(this.walls.bottom)
{this.walls.bottom.shapes[0].collisionMask=this.walls.bottom.shapes[0].collisionMask|bitmask;}
this._collisionGroupID++;var group=new Phaser.Physics.P2.CollisionGroup(bitmask);this.collisionGroups.push(group);if(object)
{this.setCollisionGroup(object,group);}
return group;},setCollisionGroup:function(object,group){if(object instanceof Phaser.Group)
{for(var i=0;i<object.total;i++)
{if(object.children[i]['body']&&object.children[i]['body'].type===Phaser.Physics.P2JS)
{object.children[i].body.setCollisionGroup(group);}}}
else
{object.body.setCollisionGroup(group);}},createSpring:function(bodyA,bodyB,restLength,stiffness,damping,worldA,worldB,localA,localB){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Spring, invalid body objects given');}
else
{return this.addSpring(new Phaser.Physics.P2.Spring(this,bodyA,bodyB,restLength,stiffness,damping,worldA,worldB,localA,localB));}},createRotationalSpring:function(bodyA,bodyB,restAngle,stiffness,damping){bodyA=this.getBody(bodyA);bodyB=this.getBody(bodyB);if(!bodyA||!bodyB)
{console.warn('Cannot create Rotational Spring, invalid body objects given');}
else
{return this.addSpring(new Phaser.Physics.P2.RotationalSpring(this,bodyA,bodyB,restAngle,stiffness,damping));}},createBody:function(x,y,mass,addToWorld,options,data){if(addToWorld===undefined){addToWorld=false;}
var body=new Phaser.Physics.P2.Body(this.game,null,x,y,mass);if(data)
{var result=body.addPolygon(options,data);if(!result)
{return false;}}
if(addToWorld)
{this.world.addBody(body.data);}
return body;},createParticle:function(x,y,mass,addToWorld,options,data){if(addToWorld===undefined){addToWorld=false;}
var body=new Phaser.Physics.P2.Body(this.game,null,x,y,mass);if(data)
{var result=body.addPolygon(options,data);if(!result)
{return false;}}
if(addToWorld)
{this.world.addBody(body.data);}
return body;},convertCollisionObjects:function(map,layer,addToWorld){if(addToWorld===undefined){addToWorld=true;}
var output=[];for(var i=0,len=map.collision[layer].length;i<len;i++)
{var object=map.collision[layer][i];var body=this.createBody(object.x,object.y,0,addToWorld,{},object.polyline);if(body)
{output.push(body);}}
return output;},clearTilemapLayerBodies:function(map,layer){layer=map.getLayer(layer);var i=map.layers[layer].bodies.length;while(i--)
{map.layers[layer].bodies[i].destroy();}
map.layers[layer].bodies.length=0;},convertTilemap:function(map,layer,addToWorld,optimize){layer=map.getLayer(layer);if(addToWorld===undefined){addToWorld=true;}
if(optimize===undefined){optimize=true;}
this.clearTilemapLayerBodies(map,layer);var width=0;var sx=0;var sy=0;for(var y=0,h=map.layers[layer].height;y<h;y++)
{width=0;for(var x=0,w=map.layers[layer].width;x<w;x++)
{var tile=map.layers[layer].data[y][x];if(tile&&tile.index>-1&&tile.collides)
{if(optimize)
{var right=map.getTileRight(layer,x,y);if(width===0)
{sx=tile.x*tile.width;sy=tile.y*tile.height;width=tile.width;}
if(right&&right.collides)
{width+=tile.width;}
else
{var body=this.createBody(sx,sy,0,false);body.addRectangle(width,tile.height,width / 2,tile.height / 2,0);if(addToWorld)
{this.addBody(body);}
map.layers[layer].bodies.push(body);width=0;}}
else
{var body=this.createBody(tile.x*tile.width,tile.y*tile.height,0,false);body.addRectangle(tile.width,tile.height,tile.width / 2,tile.height / 2,0);if(addToWorld)
{this.addBody(body);}
map.layers[layer].bodies.push(body);}}}}
return map.layers[layer].bodies;},mpx:function(v){return v*=20;},pxm:function(v){return v*0.05;},mpxi:function(v){return v*=-20;},pxmi:function(v){return v*-0.05;}};Object.defineProperty(Phaser.Physics.P2.prototype,"friction",{get:function(){return this.world.defaultContactMaterial.friction;},set:function(value){this.world.defaultContactMaterial.friction=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"restitution",{get:function(){return this.world.defaultContactMaterial.restitution;},set:function(value){this.world.defaultContactMaterial.restitution=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"contactMaterial",{get:function(){return this.world.defaultContactMaterial;},set:function(value){this.world.defaultContactMaterial=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"applySpringForces",{get:function(){return this.world.applySpringForces;},set:function(value){this.world.applySpringForces=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"applyDamping",{get:function(){return this.world.applyDamping;},set:function(value){this.world.applyDamping=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"applyGravity",{get:function(){return this.world.applyGravity;},set:function(value){this.world.applyGravity=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"solveConstraints",{get:function(){return this.world.solveConstraints;},set:function(value){this.world.solveConstraints=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"time",{get:function(){return this.world.time;}});Object.defineProperty(Phaser.Physics.P2.prototype,"emitImpactEvent",{get:function(){return this.world.emitImpactEvent;},set:function(value){this.world.emitImpactEvent=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"sleepMode",{get:function(){return this.world.sleepMode;},set:function(value){this.world.sleepMode=value;}});Object.defineProperty(Phaser.Physics.P2.prototype,"total",{get:function(){return this.world.bodies.length;}});Phaser.Physics.P2.FixtureList=function(list){if(!Array.isArray(list))
{list=[list];}
this.rawList=list;this.init();this.parse(this.rawList);};Phaser.Physics.P2.FixtureList.prototype={init:function(){this.namedFixtures={};this.groupedFixtures=[];this.allFixtures=[];},setCategory:function(bit,fixtureKey){var setter=function(fixture){fixture.collisionGroup=bit;};this.getFixtures(fixtureKey).forEach(setter);},setMask:function(bit,fixtureKey){var setter=function(fixture){fixture.collisionMask=bit;};this.getFixtures(fixtureKey).forEach(setter);},setSensor:function(value,fixtureKey){var setter=function(fixture){fixture.sensor=value;};this.getFixtures(fixtureKey).forEach(setter);},setMaterial:function(material,fixtureKey){var setter=function(fixture){fixture.material=material;};this.getFixtures(fixtureKey).forEach(setter);},getFixtures:function(keys){var fixtures=[];if(keys)
{if(!(keys instanceof Array))
{keys=[keys];}
var self=this;keys.forEach(function(key){if(self.namedFixtures[key])
{fixtures.push(self.namedFixtures[key]);}});return this.flatten(fixtures);}
else
{return this.allFixtures;}},getFixtureByKey:function(key){return this.namedFixtures[key];},getGroup:function(groupID){return this.groupedFixtures[groupID];},parse:function(){var key,value,_ref,_results;_ref=this.rawList;_results=[];for(key in _ref)
{value=_ref[key];if(!isNaN(key-0))
{this.groupedFixtures[key]=this.groupedFixtures[key]||[];this.groupedFixtures[key]=this.groupedFixtures[key].concat(value);}
else
{this.namedFixtures[key]=this.flatten(value);}
_results.push(this.allFixtures=this.flatten(this.groupedFixtures));}},flatten:function(array){var result,self;result=[];self=arguments.callee;array.forEach(function(item){return Array.prototype.push.apply(result,(Array.isArray(item)?self(item):[item]));});return result;}};Phaser.Physics.P2.PointProxy=function(world,destination){this.world=world;this.destination=destination;};Phaser.Physics.P2.PointProxy.prototype.constructor=Phaser.Physics.P2.PointProxy;Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype,"x",{get:function(){return this.world.mpx(this.destination[0]);},set:function(value){this.destination[0]=this.world.pxm(value);}});Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype,"y",{get:function(){return this.world.mpx(this.destination[1]);},set:function(value){this.destination[1]=this.world.pxm(value);}});Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype,"mx",{get:function(){return this.destination[0];},set:function(value){this.destination[0]=value;}});Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype,"my",{get:function(){return this.destination[1];},set:function(value){this.destination[1]=value;}});Phaser.Physics.P2.InversePointProxy=function(world,destination){this.world=world;this.destination=destination;};Phaser.Physics.P2.InversePointProxy.prototype.constructor=Phaser.Physics.P2.InversePointProxy;Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype,"x",{get:function(){return this.world.mpxi(this.destination[0]);},set:function(value){this.destination[0]=this.world.pxmi(value);}});Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype,"y",{get:function(){return this.world.mpxi(this.destination[1]);},set:function(value){this.destination[1]=this.world.pxmi(value);}});Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype,"mx",{get:function(){return this.destination[0];},set:function(value){this.destination[0]=-value;}});Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype,"my",{get:function(){return this.destination[1];},set:function(value){this.destination[1]=-value;}});Phaser.Physics.P2.Body=function(game,sprite,x,y,mass){sprite=sprite||null;x=x||0;y=y||0;if(mass===undefined){mass=1;}
this.game=game;this.world=game.physics.p2;this.sprite=sprite;this.type=Phaser.Physics.P2JS;this.offset=new Phaser.Point();this.data=new p2.Body({position:[this.world.pxmi(x),this.world.pxmi(y)],mass:mass});this.data.parent=this;this.velocity=new Phaser.Physics.P2.InversePointProxy(this.world,this.data.velocity);this.force=new Phaser.Physics.P2.InversePointProxy(this.world,this.data.force);this.gravity=new Phaser.Point();this.onBeginContact=new Phaser.Signal();this.onEndContact=new Phaser.Signal();this.collidesWith=[];this.removeNextStep=false;this.debugBody=null;this.dirty=false;this._collideWorldBounds=true;this._bodyCallbacks={};this._bodyCallbackContext={};this._groupCallbacks={};this._groupCallbackContext={};this._reset=false;if(sprite)
{this.setRectangleFromSprite(sprite);if(sprite.exists)
{this.game.physics.p2.addBody(this);}}};Phaser.Physics.P2.Body.prototype={createBodyCallback:function(object,callback,callbackContext){var id=-1;if(object['id'])
{id=object.id;}
else if(object['body'])
{id=object.body.id;}
if(id>-1)
{if(callback===null)
{delete(this._bodyCallbacks[id]);delete(this._bodyCallbackContext[id]);}
else
{this._bodyCallbacks[id]=callback;this._bodyCallbackContext[id]=callbackContext;}}},createGroupCallback:function(group,callback,callbackContext){if(callback===null)
{delete(this._groupCallbacks[group.mask]);delete(this._groupCallbackContext[group.mask]);}
else
{this._groupCallbacks[group.mask]=callback;this._groupCallbackContext[group.mask]=callbackContext;}},getCollisionMask:function(){var mask=0;if(this._collideWorldBounds)
{mask=this.game.physics.p2.boundsCollisionGroup.mask;}
for(var i=0;i<this.collidesWith.length;i++)
{mask=mask|this.collidesWith[i].mask;}
return mask;},updateCollisionMask:function(shape){var mask=this.getCollisionMask();if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{this.data.shapes[i].collisionMask=mask;}}
else
{shape.collisionMask=mask;}},setCollisionGroup:function(group,shape){var mask=this.getCollisionMask();if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{this.data.shapes[i].collisionGroup=group.mask;this.data.shapes[i].collisionMask=mask;}}
else
{shape.collisionGroup=group.mask;shape.collisionMask=mask;}},clearCollision:function(clearGroup,clearMask,shape){if(clearGroup===undefined){clearGroup=true;}
if(clearMask===undefined){clearMask=true;}
if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{if(clearGroup)
{this.data.shapes[i].collisionGroup=null;}
if(clearMask)
{this.data.shapes[i].collisionMask=null;}}}
else
{if(clearGroup)
{shape.collisionGroup=null;}
if(clearMask)
{shape.collisionMask=null;}}
if(clearGroup)
{this.collidesWith.length=0;}},removeCollisionGroup:function(group,clearCallback,shape){if(clearCallback===undefined){clearCallback=true;}
var index;if(Array.isArray(group))
{for(var i=0;i<group.length;i++)
{index=this.collidesWith.indexOf(group[i]);if(index>-1)
{this.collidesWith.splice(index,1);if(clearCallback)
{delete(this._groupCallbacks[group.mask]);delete(this._groupCallbackContext[group.mask]);}}}}
else
{index=this.collidesWith.indexOf(group);if(index>-1)
{this.collidesWith.splice(index,1);if(clearCallback)
{delete(this._groupCallbacks[group.mask]);delete(this._groupCallbackContext[group.mask]);}}}
var mask=this.getCollisionMask();if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{this.data.shapes[i].collisionMask=mask;}}
else
{shape.collisionMask=mask;}},collides:function(group,callback,callbackContext,shape){if(Array.isArray(group))
{for(var i=0;i<group.length;i++)
{if(this.collidesWith.indexOf(group[i])===-1)
{this.collidesWith.push(group[i]);if(callback)
{this.createGroupCallback(group[i],callback,callbackContext);}}}}
else
{if(this.collidesWith.indexOf(group)===-1)
{this.collidesWith.push(group);if(callback)
{this.createGroupCallback(group,callback,callbackContext);}}}
var mask=this.getCollisionMask();if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{this.data.shapes[i].collisionMask=mask;}}
else
{shape.collisionMask=mask;}},adjustCenterOfMass:function(){this.data.adjustCenterOfMass();this.shapeChanged();},getVelocityAtPoint:function(result,relativePoint){return this.data.getVelocityAtPoint(result,relativePoint);},applyDamping:function(dt){this.data.applyDamping(dt);},applyImpulse:function(impulse,worldX,worldY){this.data.applyImpulse(impulse,[this.world.pxmi(worldX),this.world.pxmi(worldY)]);},applyImpulseLocal:function(impulse,localX,localY){this.data.applyImpulseLocal(impulse,[this.world.pxmi(localX),this.world.pxmi(localY)]);},applyForce:function(force,worldX,worldY){this.data.applyForce(force,[this.world.pxmi(worldX),this.world.pxmi(worldY)]);},setZeroForce:function(){this.data.setZeroForce();},setZeroRotation:function(){this.data.angularVelocity=0;},setZeroVelocity:function(){this.data.velocity[0]=0;this.data.velocity[1]=0;},setZeroDamping:function(){this.data.damping=0;this.data.angularDamping=0;},toLocalFrame:function(out,worldPoint){return this.data.toLocalFrame(out,worldPoint);},toWorldFrame:function(out,localPoint){return this.data.toWorldFrame(out,localPoint);},rotateLeft:function(speed){this.data.angularVelocity=this.world.pxm(-speed);},rotateRight:function(speed){this.data.angularVelocity=this.world.pxm(speed);},moveForward:function(speed){var magnitude=this.world.pxmi(-speed);var angle=this.data.angle+Math.PI / 2;this.data.velocity[0]=magnitude*Math.cos(angle);this.data.velocity[1]=magnitude*Math.sin(angle);},moveBackward:function(speed){var magnitude=this.world.pxmi(-speed);var angle=this.data.angle+Math.PI / 2;this.data.velocity[0]=-(magnitude*Math.cos(angle));this.data.velocity[1]=-(magnitude*Math.sin(angle));},thrust:function(speed){var magnitude=this.world.pxmi(-speed);var angle=this.data.angle+Math.PI / 2;this.data.force[0]+=magnitude*Math.cos(angle);this.data.force[1]+=magnitude*Math.sin(angle);},reverse:function(speed){var magnitude=this.world.pxmi(-speed);var angle=this.data.angle+Math.PI / 2;this.data.force[0]-=magnitude*Math.cos(angle);this.data.force[1]-=magnitude*Math.sin(angle);},moveLeft:function(speed){this.data.velocity[0]=this.world.pxmi(-speed);},moveRight:function(speed){this.data.velocity[0]=this.world.pxmi(speed);},moveUp:function(speed){this.data.velocity[1]=this.world.pxmi(-speed);},moveDown:function(speed){this.data.velocity[1]=this.world.pxmi(speed);},preUpdate:function(){this.dirty=true;if(this.removeNextStep)
{this.removeFromWorld();this.removeNextStep=false;}},postUpdate:function(){this.sprite.x=this.world.mpxi(this.data.position[0]);this.sprite.y=this.world.mpxi(this.data.position[1]);if(!this.fixedRotation)
{this.sprite.rotation=this.data.angle;}
if(this.debugBody)
{this.debugBody.updateSpriteTransform();}
this.dirty=false;},reset:function(x,y,resetDamping,resetMass){if(resetDamping===undefined){resetDamping=false;}
if(resetMass===undefined){resetMass=false;}
this.setZeroForce();this.setZeroVelocity();this.setZeroRotation();if(resetDamping)
{this.setZeroDamping();}
if(resetMass)
{this.mass=1;}
this.x=x;this.y=y;},addToWorld:function(){if(this.game.physics.p2._toRemove)
{for(var i=0;i<this.game.physics.p2._toRemove.length;i++)
{if(this.game.physics.p2._toRemove[i]===this)
{this.game.physics.p2._toRemove.splice(i,1);}}}
if(this.data.world!==this.game.physics.p2.world)
{this.game.physics.p2.addBody(this);}},removeFromWorld:function(){if(this.data.world===this.game.physics.p2.world)
{this.game.physics.p2.removeBodyNextStep(this);}},destroy:function(){this.removeFromWorld();this.clearShapes();this._bodyCallbacks={};this._bodyCallbackContext={};this._groupCallbacks={};this._groupCallbackContext={};if(this.debugBody)
{this.debugBody.destroy(true,true);}
this.debugBody=null;if(this.sprite)
{this.sprite.body=null;this.sprite=null;}},clearShapes:function(){var i=this.data.shapes.length;while(i--)
{this.data.removeShape(this.data.shapes[i]);}
this.shapeChanged();},addShape:function(shape,offsetX,offsetY,rotation){if(offsetX===undefined){offsetX=0;}
if(offsetY===undefined){offsetY=0;}
if(rotation===undefined){rotation=0;}
this.data.addShape(shape,[this.world.pxmi(offsetX),this.world.pxmi(offsetY)],rotation);this.shapeChanged();return shape;},addCircle:function(radius,offsetX,offsetY,rotation){var shape=new p2.Circle({radius:this.world.pxm(radius)});return this.addShape(shape,offsetX,offsetY,rotation);},addRectangle:function(width,height,offsetX,offsetY,rotation){var shape=new p2.Box({width:this.world.pxm(width),height:this.world.pxm(height)});return this.addShape(shape,offsetX,offsetY,rotation);},addPlane:function(offsetX,offsetY,rotation){var shape=new p2.Plane();return this.addShape(shape,offsetX,offsetY,rotation);},addParticle:function(offsetX,offsetY,rotation){var shape=new p2.Particle();return this.addShape(shape,offsetX,offsetY,rotation);},addLine:function(length,offsetX,offsetY,rotation){var shape=new p2.Line({length:this.world.pxm(length)});return this.addShape(shape,offsetX,offsetY,rotation);},addCapsule:function(length,radius,offsetX,offsetY,rotation){var shape=new p2.Capsule({length:this.world.pxm(length),radius:this.world.pxm(radius)});return this.addShape(shape,offsetX,offsetY,rotation);},addPolygon:function(options,points){options=options||{};if(!Array.isArray(points))
{points=Array.prototype.slice.call(arguments,1);}
var path=[];if(points.length===1&&Array.isArray(points[0]))
{path=points[0].slice(0);}
else if(Array.isArray(points[0]))
{path=points.slice();}
else if(typeof points[0]==='number')
{for(var i=0,len=points.length;i<len;i+=2)
{path.push([points[i],points[i+1]]);}}
var idx=path.length-1;if(path[idx][0]===path[0][0]&&path[idx][1]===path[0][1])
{path.pop();}
for(var p=0;p<path.length;p++)
{path[p][0]=this.world.pxmi(path[p][0]);path[p][1]=this.world.pxmi(path[p][1]);}
var result=this.data.fromPolygon(path,options);this.shapeChanged();return result;},removeShape:function(shape){var result=this.data.removeShape(shape);this.shapeChanged();return result;},setCircle:function(radius,offsetX,offsetY,rotation){this.clearShapes();return this.addCircle(radius,offsetX,offsetY,rotation);},setRectangle:function(width,height,offsetX,offsetY,rotation){if(width===undefined){width=16;}
if(height===undefined){height=16;}
this.clearShapes();return this.addRectangle(width,height,offsetX,offsetY,rotation);},setRectangleFromSprite:function(sprite){if(sprite===undefined){sprite=this.sprite;}
this.clearShapes();return this.addRectangle(sprite.width,sprite.height,0,0,sprite.rotation);},setMaterial:function(material,shape){if(shape===undefined)
{for(var i=this.data.shapes.length-1;i>=0;i--)
{this.data.shapes[i].material=material;}}
else
{shape.material=material;}},shapeChanged:function(){if(this.debugBody)
{this.debugBody.draw();}},addPhaserPolygon:function(key,object){var data=this.game.cache.getPhysicsData(key,object);var createdFixtures=[];for(var i=0;i<data.length;i++)
{var fixtureData=data[i];var shapesOfFixture=this.addFixture(fixtureData);createdFixtures[fixtureData.filter.group]=createdFixtures[fixtureData.filter.group]||[];createdFixtures[fixtureData.filter.group]=createdFixtures[fixtureData.filter.group].concat(shapesOfFixture);if(fixtureData.fixtureKey)
{createdFixtures[fixtureData.fixtureKey]=shapesOfFixture;}}
this.data.aabbNeedsUpdate=true;this.shapeChanged();return createdFixtures;},addFixture:function(fixtureData){var generatedShapes=[];if(fixtureData.circle)
{var shape=new p2.Circle({radius:this.world.pxm(fixtureData.circle.radius)});shape.collisionGroup=fixtureData.filter.categoryBits;shape.collisionMask=fixtureData.filter.maskBits;shape.sensor=fixtureData.isSensor;var offset=p2.vec2.create();offset[0]=this.world.pxmi(fixtureData.circle.position[0]-this.sprite.width/2);offset[1]=this.world.pxmi(fixtureData.circle.position[1]-this.sprite.height/2);this.data.addShape(shape,offset);generatedShapes.push(shape);}
else
{var polygons=fixtureData.polygons;var cm=p2.vec2.create();for(var i=0;i<polygons.length;i++)
{var shapes=polygons[i];var vertices=[];for(var s=0;s<shapes.length;s+=2)
{vertices.push([this.world.pxmi(shapes[s]),this.world.pxmi(shapes[s+1])]);}
var shape=new p2.Convex({vertices:vertices});for(var j=0;j!==shape.vertices.length;j++)
{var v=shape.vertices[j];p2.vec2.sub(v,v,shape.centerOfMass);}
p2.vec2.scale(cm,shape.centerOfMass,1);cm[0]-=this.world.pxmi(this.sprite.width / 2);cm[1]-=this.world.pxmi(this.sprite.height / 2);shape.updateTriangles();shape.updateCenterOfMass();shape.updateBoundingRadius();shape.collisionGroup=fixtureData.filter.categoryBits;shape.collisionMask=fixtureData.filter.maskBits;shape.sensor=fixtureData.isSensor;this.data.addShape(shape,cm);generatedShapes.push(shape);}}
return generatedShapes;},loadPolygon:function(key,object){if(key===null)
{var data=object;}
else
{var data=this.game.cache.getPhysicsData(key,object);}
var cm=p2.vec2.create();for(var i=0;i<data.length;i++)
{var vertices=[];for(var s=0;s<data[i].shape.length;s+=2)
{vertices.push([this.world.pxmi(data[i].shape[s]),this.world.pxmi(data[i].shape[s+1])]);}
var c=new p2.Convex({vertices:vertices});for(var j=0;j!==c.vertices.length;j++)
{var v=c.vertices[j];p2.vec2.sub(v,v,c.centerOfMass);}
p2.vec2.scale(cm,c.centerOfMass,1);cm[0]-=this.world.pxmi(this.sprite.width / 2);cm[1]-=this.world.pxmi(this.sprite.height / 2);c.updateTriangles();c.updateCenterOfMass();c.updateBoundingRadius();this.data.addShape(c,cm);}
this.data.aabbNeedsUpdate=true;this.shapeChanged();return true;}};Phaser.Physics.P2.Body.prototype.constructor=Phaser.Physics.P2.Body;Phaser.Physics.P2.Body.DYNAMIC=1;Phaser.Physics.P2.Body.STATIC=2;Phaser.Physics.P2.Body.KINEMATIC=4;Object.defineProperty(Phaser.Physics.P2.Body.prototype,"static",{get:function(){return(this.data.type===Phaser.Physics.P2.Body.STATIC);},set:function(value){if(value&&this.data.type!==Phaser.Physics.P2.Body.STATIC)
{this.data.type=Phaser.Physics.P2.Body.STATIC;this.mass=0;}
else if(!value&&this.data.type===Phaser.Physics.P2.Body.STATIC)
{this.data.type=Phaser.Physics.P2.Body.DYNAMIC;this.mass=1;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"dynamic",{get:function(){return(this.data.type===Phaser.Physics.P2.Body.DYNAMIC);},set:function(value){if(value&&this.data.type!==Phaser.Physics.P2.Body.DYNAMIC)
{this.data.type=Phaser.Physics.P2.Body.DYNAMIC;this.mass=1;}
else if(!value&&this.data.type===Phaser.Physics.P2.Body.DYNAMIC)
{this.data.type=Phaser.Physics.P2.Body.STATIC;this.mass=0;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"kinematic",{get:function(){return(this.data.type===Phaser.Physics.P2.Body.KINEMATIC);},set:function(value){if(value&&this.data.type!==Phaser.Physics.P2.Body.KINEMATIC)
{this.data.type=Phaser.Physics.P2.Body.KINEMATIC;this.mass=4;}
else if(!value&&this.data.type===Phaser.Physics.P2.Body.KINEMATIC)
{this.data.type=Phaser.Physics.P2.Body.STATIC;this.mass=0;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"allowSleep",{get:function(){return this.data.allowSleep;},set:function(value){if(value!==this.data.allowSleep)
{this.data.allowSleep=value;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"angle",{get:function(){return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.data.angle));},set:function(value){this.data.angle=Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"angularDamping",{get:function(){return this.data.angularDamping;},set:function(value){this.data.angularDamping=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"angularForce",{get:function(){return this.data.angularForce;},set:function(value){this.data.angularForce=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"angularVelocity",{get:function(){return this.data.angularVelocity;},set:function(value){this.data.angularVelocity=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"damping",{get:function(){return this.data.damping;},set:function(value){this.data.damping=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"fixedRotation",{get:function(){return this.data.fixedRotation;},set:function(value){if(value!==this.data.fixedRotation)
{this.data.fixedRotation=value;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"inertia",{get:function(){return this.data.inertia;},set:function(value){this.data.inertia=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"mass",{get:function(){return this.data.mass;},set:function(value){if(value!==this.data.mass)
{this.data.mass=value;this.data.updateMassProperties();}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"motionState",{get:function(){return this.data.type;},set:function(value){if(value!==this.data.type)
{this.data.type=value;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"rotation",{get:function(){return this.data.angle;},set:function(value){this.data.angle=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"sleepSpeedLimit",{get:function(){return this.data.sleepSpeedLimit;},set:function(value){this.data.sleepSpeedLimit=value;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"x",{get:function(){return this.world.mpxi(this.data.position[0]);},set:function(value){this.data.position[0]=this.world.pxmi(value);}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"y",{get:function(){return this.world.mpxi(this.data.position[1]);},set:function(value){this.data.position[1]=this.world.pxmi(value);}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"id",{get:function(){return this.data.id;}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"debug",{get:function(){return(this.debugBody!==null);},set:function(value){if(value&&!this.debugBody)
{this.debugBody=new Phaser.Physics.P2.BodyDebug(this.game,this.data);}
else if(!value&&this.debugBody)
{this.debugBody.destroy();this.debugBody=null;}}});Object.defineProperty(Phaser.Physics.P2.Body.prototype,"collideWorldBounds",{get:function(){return this._collideWorldBounds;},set:function(value){if(value&&!this._collideWorldBounds)
{this._collideWorldBounds=true;this.updateCollisionMask();}
else if(!value&&this._collideWorldBounds)
{this._collideWorldBounds=false;this.updateCollisionMask();}}});Phaser.Physics.P2.BodyDebug=function(game,body,settings){Phaser.Group.call(this,game);var defaultSettings={pixelsPerLengthUnit:game.physics.p2.mpx(1),debugPolygons:false,lineWidth:1,alpha:0.5};this.settings=Phaser.Utils.extend(defaultSettings,settings);this.ppu=this.settings.pixelsPerLengthUnit;this.ppu=-1*this.ppu;this.body=body;this.canvas=new Phaser.Graphics(game);this.canvas.alpha=this.settings.alpha;this.add(this.canvas);this.draw();this.updateSpriteTransform();};Phaser.Physics.P2.BodyDebug.prototype=Object.create(Phaser.Group.prototype);Phaser.Physics.P2.BodyDebug.prototype.constructor=Phaser.Physics.P2.BodyDebug;Phaser.Utils.extend(Phaser.Physics.P2.BodyDebug.prototype,{updateSpriteTransform:function(){this.position.x=this.body.position[0]*this.ppu;this.position.y=this.body.position[1]*this.ppu;this.rotation=this.body.angle;},draw:function(){var angle,child,color,i,j,lineColor,lw,obj,offset,sprite,v,verts,vrot,_j,_ref1;obj=this.body;sprite=this.canvas;sprite.clear();color=parseInt(this.randomPastelHex(),16);lineColor=0xff0000;lw=this.lineWidth;if(obj instanceof p2.Body&&obj.shapes.length)
{var l=obj.shapes.length;i=0;while(i!==l)
{child=obj.shapes[i];offset=child.position||0;angle=child.angle||0;if(child instanceof p2.Circle)
{this.drawCircle(sprite,offset[0]*this.ppu,offset[1]*this.ppu,angle,child.radius*this.ppu,color,lw);}
else if(child instanceof p2.Capsule)
{this.drawCapsule(sprite,offset[0]*this.ppu,offset[1]*this.ppu,angle,child.length*this.ppu,child.radius*this.ppu,lineColor,color,lw);}
else if(child instanceof p2.Plane)
{this.drawPlane(sprite,offset[0]*this.ppu,-offset[1]*this.ppu,color,lineColor,lw*5,lw*10,lw*10,this.ppu*100,angle);}
else if(child instanceof p2.Line)
{this.drawLine(sprite,child.length*this.ppu,lineColor,lw);}
else if(child instanceof p2.Box)
{this.drawRectangle(sprite,offset[0]*this.ppu,offset[1]*this.ppu,angle,child.width*this.ppu,child.height*this.ppu,lineColor,color,lw);}
else if(child instanceof p2.Convex)
{verts=[];vrot=p2.vec2.create();for(j=_j=0,_ref1=child.vertices.length;0<=_ref1?_j<_ref1:_j>_ref1;j=0<=_ref1?++_j:--_j)
{v=child.vertices[j];p2.vec2.rotate(vrot,v,angle);verts.push([(vrot[0]+offset[0])*this.ppu,-(vrot[1]+offset[1])*this.ppu]);}
this.drawConvex(sprite,verts,child.triangles,lineColor,color,lw,this.settings.debugPolygons,[offset[0]*this.ppu,-offset[1]*this.ppu]);}
i++;}}},drawRectangle:function(g,x,y,angle,w,h,color,fillColor,lineWidth){if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0x000000;}
g.lineStyle(lineWidth,color,1);g.beginFill(fillColor);g.drawRect(x-w / 2,y-h / 2,w,h);},drawCircle:function(g,x,y,angle,radius,color,lineWidth){if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0xffffff;}
g.lineStyle(lineWidth,0x000000,1);g.beginFill(color,1.0);g.drawCircle(x,y,-radius*2);g.endFill();g.moveTo(x,y);g.lineTo(x+radius*Math.cos(-angle),y+radius*Math.sin(-angle));},drawLine:function(g,len,color,lineWidth){if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0x000000;}
g.lineStyle(lineWidth*5,color,1);g.moveTo(-len / 2,0);g.lineTo(len / 2,0);},drawConvex:function(g,verts,triangles,color,fillColor,lineWidth,debug,offset){var colors,i,v,v0,v1,x,x0,x1,y,y0,y1;if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0x000000;}
if(!debug)
{g.lineStyle(lineWidth,color,1);g.beginFill(fillColor);i=0;while(i!==verts.length)
{v=verts[i];x=v[0];y=v[1];if(i===0)
{g.moveTo(x,-y);}
else
{g.lineTo(x,-y);}
i++;}
g.endFill();if(verts.length>2)
{g.moveTo(verts[verts.length-1][0],-verts[verts.length-1][1]);return g.lineTo(verts[0][0],-verts[0][1]);}}
else
{colors=[0xff0000,0x00ff00,0x0000ff];i=0;while(i!==verts.length+1)
{v0=verts[i%verts.length];v1=verts[(i+1)%verts.length];x0=v0[0];y0=v0[1];x1=v1[0];y1=v1[1];g.lineStyle(lineWidth,colors[i%colors.length],1);g.moveTo(x0,-y0);g.lineTo(x1,-y1);g.drawCircle(x0,-y0,lineWidth*2);i++;}
g.lineStyle(lineWidth,0x000000,1);return g.drawCircle(offset[0],offset[1],lineWidth*2);}},drawPath:function(g,path,color,fillColor,lineWidth){var area,i,lastx,lasty,p1x,p1y,p2x,p2y,p3x,p3y,v,x,y;if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0x000000;}
g.lineStyle(lineWidth,color,1);if(typeof fillColor==="number")
{g.beginFill(fillColor);}
lastx=null;lasty=null;i=0;while(i<path.length)
{v=path[i];x=v[0];y=v[1];if(x!==lastx||y!==lasty)
{if(i===0)
{g.moveTo(x,y);}
else
{p1x=lastx;p1y=lasty;p2x=x;p2y=y;p3x=path[(i+1)%path.length][0];p3y=path[(i+1)%path.length][1];area=((p2x-p1x)*(p3y-p1y))-((p3x-p1x)*(p2y-p1y));if(area!==0)
{g.lineTo(x,y);}}
lastx=x;lasty=y;}
i++;}
if(typeof fillColor==="number")
{g.endFill();}
if(path.length>2&&typeof fillColor==="number")
{g.moveTo(path[path.length-1][0],path[path.length-1][1]);g.lineTo(path[0][0],path[0][1]);}},drawPlane:function(g,x0,x1,color,lineColor,lineWidth,diagMargin,diagSize,maxLength,angle){var max,xd,yd;if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0xffffff;}
g.lineStyle(lineWidth,lineColor,11);g.beginFill(color);max=maxLength;g.moveTo(x0,-x1);xd=x0+Math.cos(angle)*this.game.width;yd=x1+Math.sin(angle)*this.game.height;g.lineTo(xd,-yd);g.moveTo(x0,-x1);xd=x0+Math.cos(angle)*-this.game.width;yd=x1+Math.sin(angle)*-this.game.height;g.lineTo(xd,-yd);},drawCapsule:function(g,x,y,angle,len,radius,color,fillColor,lineWidth){if(lineWidth===undefined){lineWidth=1;}
if(color===undefined){color=0x000000;}
g.lineStyle(lineWidth,color,1);var c=Math.cos(angle);var s=Math.sin(angle);g.beginFill(fillColor,1);g.drawCircle(-len/2*c+x,-len/2*s+y,-radius*2);g.drawCircle(len/2*c+x,len/2*s+y,-radius*2);g.endFill();g.lineStyle(lineWidth,color,0);g.beginFill(fillColor,1);g.moveTo(-len/2*c+radius*s+x,-len/2*s+radius*c+y);g.lineTo(len/2*c+radius*s+x,len/2*s+radius*c+y);g.lineTo(len/2*c-radius*s+x,len/2*s-radius*c+y);g.lineTo(-len/2*c-radius*s+x,-len/2*s-radius*c+y);g.endFill();g.lineStyle(lineWidth,color,1);g.moveTo(-len/2*c+radius*s+x,-len/2*s+radius*c+y);g.lineTo(len/2*c+radius*s+x,len/2*s+radius*c+y);g.moveTo(-len/2*c-radius*s+x,-len/2*s-radius*c+y);g.lineTo(len/2*c-radius*s+x,len/2*s-radius*c+y);},randomPastelHex:function(){var blue,green,mix,red;mix=[255,255,255];red=Math.floor(Math.random()*256);green=Math.floor(Math.random()*256);blue=Math.floor(Math.random()*256);red=Math.floor((red+3*mix[0])/ 4);green=Math.floor((green+3*mix[1])/ 4);blue=Math.floor((blue+3*mix[2])/ 4);return this.rgbToHex(red,green,blue);},rgbToHex:function(r,g,b){return this.componentToHex(r)+this.componentToHex(g)+this.componentToHex(b);},componentToHex:function(c){var hex;hex=c.toString(16);if(hex.len===2)
{return hex;}
else
{return hex+'0';}}});Phaser.Physics.P2.Spring=function(world,bodyA,bodyB,restLength,stiffness,damping,worldA,worldB,localA,localB){this.game=world.game;this.world=world;if(restLength===undefined){restLength=1;}
if(stiffness===undefined){stiffness=100;}
if(damping===undefined){damping=1;}
restLength=world.pxm(restLength);var options={restLength:restLength,stiffness:stiffness,damping:damping};if(typeof worldA!=='undefined'&&worldA!==null)
{options.worldAnchorA=[world.pxm(worldA[0]),world.pxm(worldA[1])];}
if(typeof worldB!=='undefined'&&worldB!==null)
{options.worldAnchorB=[world.pxm(worldB[0]),world.pxm(worldB[1])];}
if(typeof localA!=='undefined'&&localA!==null)
{options.localAnchorA=[world.pxm(localA[0]),world.pxm(localA[1])];}
if(typeof localB!=='undefined'&&localB!==null)
{options.localAnchorB=[world.pxm(localB[0]),world.pxm(localB[1])];}
this.data=new p2.LinearSpring(bodyA,bodyB,options);this.data.parent=this;};Phaser.Physics.P2.Spring.prototype.constructor=Phaser.Physics.P2.Spring;Phaser.Physics.P2.RotationalSpring=function(world,bodyA,bodyB,restAngle,stiffness,damping){this.game=world.game;this.world=world;if(restAngle===undefined){restAngle=null;}
if(stiffness===undefined){stiffness=100;}
if(damping===undefined){damping=1;}
if(restAngle)
{restAngle=world.pxm(restAngle);}
var options={restAngle:restAngle,stiffness:stiffness,damping:damping};this.data=new p2.RotationalSpring(bodyA,bodyB,options);this.data.parent=this;};Phaser.Physics.P2.Spring.prototype.constructor=Phaser.Physics.P2.Spring;Phaser.Physics.P2.Material=function(name){this.name=name;p2.Material.call(this);};Phaser.Physics.P2.Material.prototype=Object.create(p2.Material.prototype);Phaser.Physics.P2.Material.prototype.constructor=Phaser.Physics.P2.Material;Phaser.Physics.P2.ContactMaterial=function(materialA,materialB,options){p2.ContactMaterial.call(this,materialA,materialB,options);};Phaser.Physics.P2.ContactMaterial.prototype=Object.create(p2.ContactMaterial.prototype);Phaser.Physics.P2.ContactMaterial.prototype.constructor=Phaser.Physics.P2.ContactMaterial;Phaser.Physics.P2.CollisionGroup=function(bitmask){this.mask=bitmask;};Phaser.Physics.P2.DistanceConstraint=function(world,bodyA,bodyB,distance,localAnchorA,localAnchorB,maxForce){if(distance===undefined){distance=100;}
if(localAnchorA===undefined){localAnchorA=[0,0];}
if(localAnchorB===undefined){localAnchorB=[0,0];}
if(maxForce===undefined){maxForce=Number.MAX_VALUE;}
this.game=world.game;this.world=world;distance=world.pxm(distance);localAnchorA=[world.pxmi(localAnchorA[0]),world.pxmi(localAnchorA[1])];localAnchorB=[world.pxmi(localAnchorB[0]),world.pxmi(localAnchorB[1])];var options={distance:distance,localAnchorA:localAnchorA,localAnchorB:localAnchorB,maxForce:maxForce};p2.DistanceConstraint.call(this,bodyA,bodyB,options);};Phaser.Physics.P2.DistanceConstraint.prototype=Object.create(p2.DistanceConstraint.prototype);Phaser.Physics.P2.DistanceConstraint.prototype.constructor=Phaser.Physics.P2.DistanceConstraint;Phaser.Physics.P2.GearConstraint=function(world,bodyA,bodyB,angle,ratio){if(angle===undefined){angle=0;}
if(ratio===undefined){ratio=1;}
this.game=world.game;this.world=world;var options={angle:angle,ratio:ratio};p2.GearConstraint.call(this,bodyA,bodyB,options);};Phaser.Physics.P2.GearConstraint.prototype=Object.create(p2.GearConstraint.prototype);Phaser.Physics.P2.GearConstraint.prototype.constructor=Phaser.Physics.P2.GearConstraint;Phaser.Physics.P2.LockConstraint=function(world,bodyA,bodyB,offset,angle,maxForce){if(offset===undefined){offset=[0,0];}
if(angle===undefined){angle=0;}
if(maxForce===undefined){maxForce=Number.MAX_VALUE;}
this.game=world.game;this.world=world;offset=[world.pxm(offset[0]),world.pxm(offset[1])];var options={localOffsetB:offset,localAngleB:angle,maxForce:maxForce};p2.LockConstraint.call(this,bodyA,bodyB,options);};Phaser.Physics.P2.LockConstraint.prototype=Object.create(p2.LockConstraint.prototype);Phaser.Physics.P2.LockConstraint.prototype.constructor=Phaser.Physics.P2.LockConstraint;Phaser.Physics.P2.PrismaticConstraint=function(world,bodyA,bodyB,lockRotation,anchorA,anchorB,axis,maxForce){if(lockRotation===undefined){lockRotation=true;}
if(anchorA===undefined){anchorA=[0,0];}
if(anchorB===undefined){anchorB=[0,0];}
if(axis===undefined){axis=[0,0];}
if(maxForce===undefined){maxForce=Number.MAX_VALUE;}
this.game=world.game;this.world=world;anchorA=[world.pxmi(anchorA[0]),world.pxmi(anchorA[1])];anchorB=[world.pxmi(anchorB[0]),world.pxmi(anchorB[1])];var options={localAnchorA:anchorA,localAnchorB:anchorB,localAxisA:axis,maxForce:maxForce,disableRotationalLock:!lockRotation};p2.PrismaticConstraint.call(this,bodyA,bodyB,options);};Phaser.Physics.P2.PrismaticConstraint.prototype=Object.create(p2.PrismaticConstraint.prototype);Phaser.Physics.P2.PrismaticConstraint.prototype.constructor=Phaser.Physics.P2.PrismaticConstraint;Phaser.Physics.P2.RevoluteConstraint=function(world,bodyA,pivotA,bodyB,pivotB,maxForce,worldPivot){if(maxForce===undefined){maxForce=Number.MAX_VALUE;}
if(worldPivot===undefined){worldPivot=null;}
this.game=world.game;this.world=world;pivotA=[world.pxmi(pivotA[0]),world.pxmi(pivotA[1])];pivotB=[world.pxmi(pivotB[0]),world.pxmi(pivotB[1])];if(worldPivot)
{worldPivot=[world.pxmi(worldPivot[0]),world.pxmi(worldPivot[1])];}
var options={worldPivot:worldPivot,localPivotA:pivotA,localPivotB:pivotB,maxForce:maxForce};p2.RevoluteConstraint.call(this,bodyA,bodyB,options);};Phaser.Physics.P2.RevoluteConstraint.prototype=Object.create(p2.RevoluteConstraint.prototype);Phaser.Physics.P2.RevoluteConstraint.prototype.constructor=Phaser.Physics.P2.RevoluteConstraint;Phaser.ImageCollection=function(name,firstgid,width,height,margin,spacing,properties){if(width===undefined||width<=0){width=32;}
if(height===undefined||height<=0){height=32;}
if(margin===undefined){margin=0;}
if(spacing===undefined){spacing=0;}
this.name=name;this.firstgid=firstgid|0;this.imageWidth=width|0;this.imageHeight=height|0;this.imageMargin=margin|0;this.imageSpacing=spacing|0;this.properties=properties||{};this.images=[];this.total=0;};Phaser.ImageCollection.prototype={containsImageIndex:function(imageIndex){return(imageIndex>=this.firstgid&&imageIndex<(this.firstgid+this.total));},addImage:function(gid,image){this.images.push({gid:gid,image:image});this.total++;}};Phaser.ImageCollection.prototype.constructor=Phaser.ImageCollection;Phaser.Tile=function(layer,index,x,y,width,height){this.layer=layer;this.index=index;this.x=x;this.y=y;this.rotation=0;this.flipped=false;this.worldX=x*width;this.worldY=y*height;this.width=width;this.height=height;this.centerX=Math.abs(width / 2);this.centerY=Math.abs(height / 2);this.alpha=1;this.properties={};this.scanned=false;this.faceTop=false;this.faceBottom=false;this.faceLeft=false;this.faceRight=false;this.collideLeft=false;this.collideRight=false;this.collideUp=false;this.collideDown=false;this.collisionCallback=null;this.collisionCallbackContext=this;};Phaser.Tile.prototype={containsPoint:function(x,y){return!(x<this.worldX||y<this.worldY||x>this.right||y>this.bottom);},intersects:function(x,y,right,bottom){if(right<=this.worldX)
{return false;}
if(bottom<=this.worldY)
{return false;}
if(x>=this.worldX+this.width)
{return false;}
if(y>=this.worldY+this.height)
{return false;}
return true;},setCollisionCallback:function(callback,context){this.collisionCallback=callback;this.collisionCallbackContext=context;},destroy:function(){this.collisionCallback=null;this.collisionCallbackContext=null;this.properties=null;},setCollision:function(left,right,up,down){this.collideLeft=left;this.collideRight=right;this.collideUp=up;this.collideDown=down;this.faceLeft=left;this.faceRight=right;this.faceTop=up;this.faceBottom=down;},resetCollision:function(){this.collideLeft=false;this.collideRight=false;this.collideUp=false;this.collideDown=false;this.faceTop=false;this.faceBottom=false;this.faceLeft=false;this.faceRight=false;},isInteresting:function(collides,faces){if(collides&&faces)
{return(this.collideLeft||this.collideRight||this.collideUp||this.collideDown||this.faceTop||this.faceBottom||this.faceLeft||this.faceRight||this.collisionCallback);}
else if(collides)
{return(this.collideLeft||this.collideRight||this.collideUp||this.collideDown);}
else if(faces)
{return(this.faceTop||this.faceBottom||this.faceLeft||this.faceRight);}
return false;},copy:function(tile){this.index=tile.index;this.alpha=tile.alpha;this.properties=tile.properties;this.collideUp=tile.collideUp;this.collideDown=tile.collideDown;this.collideLeft=tile.collideLeft;this.collideRight=tile.collideRight;this.collisionCallback=tile.collisionCallback;this.collisionCallbackContext=tile.collisionCallbackContext;}};Phaser.Tile.prototype.constructor=Phaser.Tile;Object.defineProperty(Phaser.Tile.prototype,"collides",{get:function(){return(this.collideLeft||this.collideRight||this.collideUp||this.collideDown);}});Object.defineProperty(Phaser.Tile.prototype,"canCollide",{get:function(){return(this.collideLeft||this.collideRight||this.collideUp||this.collideDown||this.collisionCallback);}});Object.defineProperty(Phaser.Tile.prototype,"left",{get:function(){return this.worldX;}});Object.defineProperty(Phaser.Tile.prototype,"right",{get:function(){return this.worldX+this.width;}});Object.defineProperty(Phaser.Tile.prototype,"top",{get:function(){return this.worldY;}});Object.defineProperty(Phaser.Tile.prototype,"bottom",{get:function(){return this.worldY+this.height;}});Phaser.Tilemap=function(game,key,tileWidth,tileHeight,width,height){this.game=game;this.key=key;var data=Phaser.TilemapParser.parse(this.game,key,tileWidth,tileHeight,width,height);if(data===null)
{return;}
this.width=data.width;this.height=data.height;this.tileWidth=data.tileWidth;this.tileHeight=data.tileHeight;this.orientation=data.orientation;this.format=data.format;this.version=data.version;this.properties=data.properties;this.widthInPixels=data.widthInPixels;this.heightInPixels=data.heightInPixels;this.layers=data.layers;this.tilesets=data.tilesets;this.imagecollections=data.imagecollections;this.tiles=data.tiles;this.objects=data.objects;this.collideIndexes=[];this.collision=data.collision;this.images=data.images;this.currentLayer=0;this.debugMap=[];this._results=[];this._tempA=0;this._tempB=0;};Phaser.Tilemap.CSV=0;Phaser.Tilemap.TILED_JSON=1;Phaser.Tilemap.NORTH=0;Phaser.Tilemap.EAST=1;Phaser.Tilemap.SOUTH=2;Phaser.Tilemap.WEST=3;Phaser.Tilemap.prototype={create:function(name,width,height,tileWidth,tileHeight,group){if(group===undefined){group=this.game.world;}
this.width=width;this.height=height;this.setTileSize(tileWidth,tileHeight);this.layers.length=0;return this.createBlankLayer(name,width,height,tileWidth,tileHeight,group);},setTileSize:function(tileWidth,tileHeight){this.tileWidth=tileWidth;this.tileHeight=tileHeight;this.widthInPixels=this.width*tileWidth;this.heightInPixels=this.height*tileHeight;},addTilesetImage:function(tileset,key,tileWidth,tileHeight,tileMargin,tileSpacing,gid){if(tileset===undefined){return null;}
if(tileWidth===undefined){tileWidth=this.tileWidth;}
if(tileHeight===undefined){tileHeight=this.tileHeight;}
if(tileMargin===undefined){tileMargin=0;}
if(tileSpacing===undefined){tileSpacing=0;}
if(gid===undefined){gid=0;}
if(tileWidth===0)
{tileWidth=32;}
if(tileHeight===0)
{tileHeight=32;}
var img=null;if(key===undefined||key===null)
{key=tileset;}
if(key instanceof Phaser.BitmapData)
{img=key.canvas;}
else
{if(!this.game.cache.checkImageKey(key))
{console.warn('Phaser.Tilemap.addTilesetImage: Invalid image key given: "'+key+'"');return null;}
img=this.game.cache.getImage(key);}
var idx=this.getTilesetIndex(tileset);if(idx===null&&this.format===Phaser.Tilemap.TILED_JSON)
{console.warn('Phaser.Tilemap.addTilesetImage: No data found in the JSON matching the tileset name: "'+key+'"');return null;}
if(this.tilesets[idx])
{this.tilesets[idx].setImage(img);return this.tilesets[idx];}
else
{var newSet=new Phaser.Tileset(tileset,gid,tileWidth,tileHeight,tileMargin,tileSpacing,{});newSet.setImage(img);this.tilesets.push(newSet);var i=this.tilesets.length-1;var x=tileMargin;var y=tileMargin;var count=0;var countX=0;var countY=0;for(var t=gid;t<gid+newSet.total;t++)
{this.tiles[t]=[x,y,i];x+=tileWidth+tileSpacing;count++;if(count===newSet.total)
{break;}
countX++;if(countX===newSet.columns)
{x=tileMargin;y+=tileHeight+tileSpacing;countX=0;countY++;if(countY===newSet.rows)
{break;}}}
return newSet;}
return null;},createFromObjects:function(name,gid,key,frame,exists,autoCull,group,CustomClass,adjustY){if(exists===undefined){exists=true;}
if(autoCull===undefined){autoCull=false;}
if(group===undefined){group=this.game.world;}
if(CustomClass===undefined){CustomClass=Phaser.Sprite;}
if(adjustY===undefined){adjustY=true;}
if(!this.objects[name])
{console.warn('Tilemap.createFromObjects: Invalid objectgroup name given: '+name);return;}
for(var i=0;i<this.objects[name].length;i++)
{var found=false;var obj=this.objects[name][i];if(obj.gid!==undefined&&typeof gid==='number'&&obj.gid===gid)
{found=true;}
else if(obj.id!==undefined&&typeof gid==='number'&&obj.id===gid)
{found=true;}
else if(obj.name!==undefined&&typeof gid==='string'&&obj.name===gid)
{found=true;}
if(found)
{var sprite=new CustomClass(this.game,parseFloat(obj.x,10),parseFloat(obj.y,10),key,frame);sprite.name=obj.name;sprite.visible=obj.visible;sprite.autoCull=autoCull;sprite.exists=exists;if(obj.width)
{sprite.width=obj.width;}
if(obj.height)
{sprite.height=obj.height;}
if(obj.rotation)
{sprite.angle=obj.rotation;}
if(adjustY)
{sprite.y-=sprite.height;}
group.add(sprite);for(var property in obj.properties)
{group.set(sprite,property,obj.properties[property],false,false,0,true);}}}},createFromTiles:function(tiles,replacements,key,layer,group,properties){if(typeof tiles==='number'){tiles=[tiles];}
if(replacements===undefined||replacements===null)
{replacements=[];}
else if(typeof replacements==='number')
{replacements=[replacements];}
layer=this.getLayer(layer);if(group===undefined){group=this.game.world;}
if(properties===undefined){properties={};}
if(properties.customClass===undefined)
{properties.customClass=Phaser.Sprite;}
if(properties.adjustY===undefined)
{properties.adjustY=true;}
var lw=this.layers[layer].width;var lh=this.layers[layer].height;this.copy(0,0,lw,lh,layer);if(this._results.length<2)
{return 0;}
var total=0;var sprite;for(var i=1,len=this._results.length;i<len;i++)
{if(tiles.indexOf(this._results[i].index)!==-1)
{sprite=new properties.customClass(this.game,this._results[i].worldX,this._results[i].worldY,key);for(var property in properties)
{sprite[property]=properties[property];}
group.add(sprite);total++;}}
if(replacements.length===1)
{for(i=0;i<tiles.length;i++)
{this.replace(tiles[i],replacements[0],0,0,lw,lh,layer);}}
else if(replacements.length>1)
{for(i=0;i<tiles.length;i++)
{this.replace(tiles[i],replacements[i],0,0,lw,lh,layer);}}
return total;},createLayer:function(layer,width,height,group){if(width===undefined){width=this.game.width;}
if(height===undefined){height=this.game.height;}
if(group===undefined){group=this.game.world;}
var index=layer;if(typeof layer==='string')
{index=this.getLayerIndex(layer);}
if(index===null||index>this.layers.length)
{console.warn('Tilemap.createLayer: Invalid layer ID given: '+index);return;}
return group.add(new Phaser.TilemapLayer(this.game,this,index,width,height));},createBlankLayer:function(name,width,height,tileWidth,tileHeight,group){if(group===undefined){group=this.game.world;}
if(this.getLayerIndex(name)!==null)
{console.warn('Tilemap.createBlankLayer: Layer with matching name already exists');return;}
var layer={name:name,x:0,y:0,width:width,height:height,widthInPixels:width*tileWidth,heightInPixels:height*tileHeight,alpha:1,visible:true,properties:{},indexes:[],callbacks:[],bodies:[],data:null};var row;var output=[];for(var y=0;y<height;y++)
{row=[];for(var x=0;x<width;x++)
{row.push(new Phaser.Tile(layer,-1,x,y,tileWidth,tileHeight));}
output.push(row);}
layer.data=output;this.layers.push(layer);this.currentLayer=this.layers.length-1;var w=layer.widthInPixels;var h=layer.heightInPixels;if(w>this.game.width)
{w=this.game.width;}
if(h>this.game.height)
{h=this.game.height;}
var output=new Phaser.TilemapLayer(this.game,this,this.layers.length-1,w,h);output.name=name;return group.add(output);},getIndex:function(location,name){for(var i=0;i<location.length;i++)
{if(location[i].name===name)
{return i;}}
return null;},getLayerIndex:function(name){return this.getIndex(this.layers,name);},getTilesetIndex:function(name){return this.getIndex(this.tilesets,name);},getImageIndex:function(name){return this.getIndex(this.images,name);},getObjectIndex:function(name){return this.getIndex(this.objects,name);},setTileIndexCallback:function(indexes,callback,callbackContext,layer){layer=this.getLayer(layer);if(typeof indexes==='number')
{this.layers[layer].callbacks[indexes]={callback:callback,callbackContext:callbackContext};}
else
{for(var i=0,len=indexes.length;i<len;i++)
{this.layers[layer].callbacks[indexes[i]]={callback:callback,callbackContext:callbackContext};}}},setTileLocationCallback:function(x,y,width,height,callback,callbackContext,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
for(var i=1;i<this._results.length;i++)
{this._results[i].setCollisionCallback(callback,callbackContext);}},setCollision:function(indexes,collides,layer,recalculate){if(collides===undefined){collides=true;}
if(recalculate===undefined){recalculate=true;}
layer=this.getLayer(layer);if(typeof indexes==='number')
{return this.setCollisionByIndex(indexes,collides,layer,true);}
else if(Array.isArray(indexes))
{for(var i=0;i<indexes.length;i++)
{this.setCollisionByIndex(indexes[i],collides,layer,false);}
if(recalculate)
{this.calculateFaces(layer);}}},setCollisionBetween:function(start,stop,collides,layer,recalculate){if(collides===undefined){collides=true;}
if(recalculate===undefined){recalculate=true;}
layer=this.getLayer(layer);if(start>stop)
{return;}
for(var index=start;index<=stop;index++)
{this.setCollisionByIndex(index,collides,layer,false);}
if(recalculate)
{this.calculateFaces(layer);}},setCollisionByExclusion:function(indexes,collides,layer,recalculate){if(collides===undefined){collides=true;}
if(recalculate===undefined){recalculate=true;}
layer=this.getLayer(layer);for(var i=0,len=this.tiles.length;i<len;i++)
{if(indexes.indexOf(i)===-1)
{this.setCollisionByIndex(i,collides,layer,false);}}
if(recalculate)
{this.calculateFaces(layer);}},setCollisionByIndex:function(index,collides,layer,recalculate){if(collides===undefined){collides=true;}
if(layer===undefined){layer=this.currentLayer;}
if(recalculate===undefined){recalculate=true;}
if(collides)
{this.collideIndexes.push(index);}
else
{var i=this.collideIndexes.indexOf(index);if(i>-1)
{this.collideIndexes.splice(i,1);}}
for(var y=0;y<this.layers[layer].height;y++)
{for(var x=0;x<this.layers[layer].width;x++)
{var tile=this.layers[layer].data[y][x];if(tile&&tile.index===index)
{if(collides)
{tile.setCollision(true,true,true,true);}
else
{tile.resetCollision();}
tile.faceTop=collides;tile.faceBottom=collides;tile.faceLeft=collides;tile.faceRight=collides;}}}
if(recalculate)
{this.calculateFaces(layer);}
return layer;},getLayer:function(layer){if(layer===undefined)
{layer=this.currentLayer;}
else if(typeof layer==='string')
{layer=this.getLayerIndex(layer);}
else if(layer instanceof Phaser.TilemapLayer)
{layer=layer.index;}
return layer;},setPreventRecalculate:function(value){if(value===true&&this.preventingRecalculate!==true)
{this.preventingRecalculate=true;this.needToRecalculate={};}
if(value===false&&this.preventingRecalculate===true)
{this.preventingRecalculate=false;for(var i in this.needToRecalculate)
{this.calculateFaces(i);}
this.needToRecalculate=false;}},calculateFaces:function(layer){if(this.preventingRecalculate)
{this.needToRecalculate[layer]=true;return;}
var above=null;var below=null;var left=null;var right=null;for(var y=0,h=this.layers[layer].height;y<h;y++)
{for(var x=0,w=this.layers[layer].width;x<w;x++)
{var tile=this.layers[layer].data[y][x];if(tile)
{above=this.getTileAbove(layer,x,y);below=this.getTileBelow(layer,x,y);left=this.getTileLeft(layer,x,y);right=this.getTileRight(layer,x,y);if(tile.collides)
{tile.faceTop=true;tile.faceBottom=true;tile.faceLeft=true;tile.faceRight=true;}
if(above&&above.collides)
{tile.faceTop=false;}
if(below&&below.collides)
{tile.faceBottom=false;}
if(left&&left.collides)
{tile.faceLeft=false;}
if(right&&right.collides)
{tile.faceRight=false;}}}}},getTileAbove:function(layer,x,y){if(y>0)
{return this.layers[layer].data[y-1][x];}
return null;},getTileBelow:function(layer,x,y){if(y<this.layers[layer].height-1)
{return this.layers[layer].data[y+1][x];}
return null;},getTileLeft:function(layer,x,y){if(x>0)
{return this.layers[layer].data[y][x-1];}
return null;},getTileRight:function(layer,x,y){if(x<this.layers[layer].width-1)
{return this.layers[layer].data[y][x+1];}
return null;},setLayer:function(layer){layer=this.getLayer(layer);if(this.layers[layer])
{this.currentLayer=layer;}},hasTile:function(x,y,layer){layer=this.getLayer(layer);return(this.layers[layer].data[y][x].index>-1);},removeTile:function(x,y,layer){layer=this.getLayer(layer);if(x>=0&&x<this.layers[layer].width&&y>=0&&y<this.layers[layer].height)
{if(this.hasTile(x,y,layer))
{var tile=this.layers[layer].data[y][x];this.layers[layer].data[y][x]=new Phaser.Tile(this.layers[layer],-1,x,y,this.tileWidth,this.tileHeight);this.layers[layer].dirty=true;this.calculateFaces(layer);return tile;}}},removeTileWorldXY:function(x,y,tileWidth,tileHeight,layer){layer=this.getLayer(layer);x=this.game.math.snapToFloor(x,tileWidth)/ tileWidth;y=this.game.math.snapToFloor(y,tileHeight)/ tileHeight;return this.removeTile(x,y,layer);},putTile:function(tile,x,y,layer){if(tile===null)
{return this.removeTile(x,y,layer);}
layer=this.getLayer(layer);if(x>=0&&x<this.layers[layer].width&&y>=0&&y<this.layers[layer].height)
{var index;if(tile instanceof Phaser.Tile)
{index=tile.index;if(this.hasTile(x,y,layer))
{this.layers[layer].data[y][x].copy(tile);}
else
{this.layers[layer].data[y][x]=new Phaser.Tile(layer,index,x,y,tile.width,tile.height);}}
else
{index=tile;if(this.hasTile(x,y,layer))
{this.layers[layer].data[y][x].index=index;}
else
{this.layers[layer].data[y][x]=new Phaser.Tile(this.layers[layer],index,x,y,this.tileWidth,this.tileHeight);}}
if(this.collideIndexes.indexOf(index)>-1)
{this.layers[layer].data[y][x].setCollision(true,true,true,true);}
else
{this.layers[layer].data[y][x].resetCollision();}
this.layers[layer].dirty=true;this.calculateFaces(layer);return this.layers[layer].data[y][x];}
return null;},putTileWorldXY:function(tile,x,y,tileWidth,tileHeight,layer){layer=this.getLayer(layer);x=this.game.math.snapToFloor(x,tileWidth)/ tileWidth;y=this.game.math.snapToFloor(y,tileHeight)/ tileHeight;return this.putTile(tile,x,y,layer);},searchTileIndex:function(index,skip,reverse,layer){if(skip===undefined){skip=0;}
if(reverse===undefined){reverse=false;}
layer=this.getLayer(layer);var c=0;if(reverse)
{for(var y=this.layers[layer].height-1;y>=0;y--)
{for(var x=this.layers[layer].width-1;x>=0;x--)
{if(this.layers[layer].data[y][x].index===index)
{if(c===skip)
{return this.layers[layer].data[y][x];}
else
{c++;}}}}}
else
{for(var y=0;y<this.layers[layer].height;y++)
{for(var x=0;x<this.layers[layer].width;x++)
{if(this.layers[layer].data[y][x].index===index)
{if(c===skip)
{return this.layers[layer].data[y][x];}
else
{c++;}}}}}
return null;},getTile:function(x,y,layer,nonNull){if(nonNull===undefined){nonNull=false;}
layer=this.getLayer(layer);if(x>=0&&x<this.layers[layer].width&&y>=0&&y<this.layers[layer].height)
{if(this.layers[layer].data[y][x].index===-1)
{if(nonNull)
{return this.layers[layer].data[y][x];}
else
{return null;}}
else
{return this.layers[layer].data[y][x];}}
else
{return null;}},getTileWorldXY:function(x,y,tileWidth,tileHeight,layer,nonNull){if(tileWidth===undefined){tileWidth=this.tileWidth;}
if(tileHeight===undefined){tileHeight=this.tileHeight;}
layer=this.getLayer(layer);x=this.game.math.snapToFloor(x,tileWidth)/ tileWidth;y=this.game.math.snapToFloor(y,tileHeight)/ tileHeight;return this.getTile(x,y,layer,nonNull);},copy:function(x,y,width,height,layer){layer=this.getLayer(layer);if(!this.layers[layer])
{this._results.length=0;return;}
if(x===undefined){x=0;}
if(y===undefined){y=0;}
if(width===undefined){width=this.layers[layer].width;}
if(height===undefined){height=this.layers[layer].height;}
if(x<0)
{x=0;}
if(y<0)
{y=0;}
if(width>this.layers[layer].width)
{width=this.layers[layer].width;}
if(height>this.layers[layer].height)
{height=this.layers[layer].height;}
this._results.length=0;this._results.push({x:x,y:y,width:width,height:height,layer:layer});for(var ty=y;ty<y+height;ty++)
{for(var tx=x;tx<x+width;tx++)
{this._results.push(this.layers[layer].data[ty][tx]);}}
return this._results;},paste:function(x,y,tileblock,layer){if(x===undefined){x=0;}
if(y===undefined){y=0;}
layer=this.getLayer(layer);if(!tileblock||tileblock.length<2)
{return;}
var diffX=x-tileblock[1].x;var diffY=y-tileblock[1].y;for(var i=1;i<tileblock.length;i++)
{this.layers[layer].data[diffY+tileblock[i].y][diffX+tileblock[i].x].copy(tileblock[i]);}
this.layers[layer].dirty=true;this.calculateFaces(layer);},swap:function(tileA,tileB,x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
this._tempA=tileA;this._tempB=tileB;this._results.forEach(this.swapHandler,this);this.paste(x,y,this._results,layer);},swapHandler:function(value){if(value.index===this._tempA)
{value.index=this._tempB;}
else if(value.index===this._tempB)
{value.index=this._tempA;}},forEach:function(callback,context,x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
this._results.forEach(callback,context);this.paste(x,y,this._results,layer);},replace:function(source,dest,x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
for(var i=1;i<this._results.length;i++)
{if(this._results[i].index===source)
{this._results[i].index=dest;}}
this.paste(x,y,this._results,layer);},random:function(x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
var indexes=[];for(var t=1;t<this._results.length;t++)
{if(this._results[t].index)
{var idx=this._results[t].index;if(indexes.indexOf(idx)===-1)
{indexes.push(idx);}}}
for(var i=1;i<this._results.length;i++)
{this._results[i].index=this.game.rnd.pick(indexes);}
this.paste(x,y,this._results,layer);},shuffle:function(x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
var indexes=[];for(var t=1;t<this._results.length;t++)
{if(this._results[t].index)
{indexes.push(this._results[t].index);}}
Phaser.ArrayUtils.shuffle(indexes);for(var i=1;i<this._results.length;i++)
{this._results[i].index=indexes[i-1];}
this.paste(x,y,this._results,layer);},fill:function(index,x,y,width,height,layer){layer=this.getLayer(layer);this.copy(x,y,width,height,layer);if(this._results.length<2)
{return;}
for(var i=1;i<this._results.length;i++)
{this._results[i].index=index;}
this.paste(x,y,this._results,layer);},removeAllLayers:function(){this.layers.length=0;this.currentLayer=0;},dump:function(){var txt='';var args=[''];for(var y=0;y<this.layers[this.currentLayer].height;y++)
{for(var x=0;x<this.layers[this.currentLayer].width;x++)
{txt+="%c  ";if(this.layers[this.currentLayer].data[y][x]>1)
{if(this.debugMap[this.layers[this.currentLayer].data[y][x]])
{args.push("background: "+this.debugMap[this.layers[this.currentLayer].data[y][x]]);}
else
{args.push("background: #ffffff");}}
else
{args.push("background: rgb(0, 0, 0)");}}
txt+="\n";}
args[0]=txt;console.log.apply(console,args);},destroy:function(){this.removeAllLayers();this.data=[];this.game=null;}};Phaser.Tilemap.prototype.constructor=Phaser.Tilemap;Object.defineProperty(Phaser.Tilemap.prototype,"layer",{get:function(){return this.layers[this.currentLayer];},set:function(value){if(value!==this.currentLayer)
{this.setLayer(value);}}});Phaser.TilemapLayer=function(game,tilemap,index,width,height){width|=0;height|=0;Phaser.Sprite.call(this,game,0,0);this.map=tilemap;this.index=index;this.layer=tilemap.layers[index];this.canvas=PIXI.CanvasPool.create(this,width,height);this.context=this.canvas.getContext('2d');this.setTexture(new PIXI.Texture(new PIXI.BaseTexture(this.canvas)));this.type=Phaser.TILEMAPLAYER;this.physicsType=Phaser.TILEMAPLAYER;this.renderSettings={enableScrollDelta:false,overdrawRatio:0.20,copyCanvas:null};this.debug=false;this.exists=true;this.debugSettings={missingImageFill:'rgb(255,255,255)',debuggedTileOverfill:'rgba(0,255,0,0.4)',forceFullRedraw:true,debugAlpha:0.5,facingEdgeStroke:'rgba(0,255,0,1)',collidingTileOverfill:'rgba(0,255,0,0.2)'};this.scrollFactorX=1;this.scrollFactorY=1;this.dirty=true;this.rayStepRate=4;this._wrap=false;this._mc={scrollX:0,scrollY:0,renderWidth:0,renderHeight:0,tileWidth:tilemap.tileWidth,tileHeight:tilemap.tileHeight,cw:tilemap.tileWidth,ch:tilemap.tileHeight,tilesets:[]};this._scrollX=0;this._scrollY=0;this._results=[];if(!game.device.canvasBitBltShift)
{this.renderSettings.copyCanvas=Phaser.TilemapLayer.ensureSharedCopyCanvas();}
this.fixedToCamera=true;};Phaser.TilemapLayer.prototype=Object.create(Phaser.Sprite.prototype);Phaser.TilemapLayer.prototype.constructor=Phaser.TilemapLayer;Phaser.TilemapLayer.prototype.preUpdateCore=Phaser.Component.Core.preUpdate;Phaser.TilemapLayer.sharedCopyCanvas=null;Phaser.TilemapLayer.ensureSharedCopyCanvas=function(){if(!this.sharedCopyCanvas)
{this.sharedCopyCanvas=Phaser.Canvas.create(2,2);}
return this.sharedCopyCanvas;};Phaser.TilemapLayer.prototype.preUpdate=function(){return this.preUpdateCore();};Phaser.TilemapLayer.prototype.postUpdate=function(){Phaser.Component.FixedToCamera.postUpdate.call(this);var camera=this.game.camera;this.scrollX=camera.x*this.scrollFactorX / this.scale.x;this.scrollY=camera.y*this.scrollFactorY / this.scale.y;this.render();};Phaser.TilemapLayer.prototype.destroy=function(){PIXI.CanvasPool.remove(this);Phaser.Component.Destroy.prototype.destroy.call(this);};Phaser.TilemapLayer.prototype.resize=function(width,height){this.canvas.width=width;this.canvas.height=height;this.texture.frame.resize(width,height);this.texture.width=width;this.texture.height=height;this.texture.crop.width=width;this.texture.crop.height=height;this.texture.baseTexture.width=width;this.texture.baseTexture.height=height;this.texture.baseTexture.dirty();this.texture.requiresUpdate=true;this.texture._updateUvs();this.dirty=true;};Phaser.TilemapLayer.prototype.resizeWorld=function(){this.game.world.setBounds(0,0,this.layer.widthInPixels*this.scale.x,this.layer.heightInPixels*this.scale.y);};Phaser.TilemapLayer.prototype._fixX=function(x){if(x<0)
{x=0;}
if(this.scrollFactorX===1)
{return x;}
return this._scrollX+(x-(this._scrollX / this.scrollFactorX));};Phaser.TilemapLayer.prototype._unfixX=function(x){if(this.scrollFactorX===1)
{return x;}
return(this._scrollX / this.scrollFactorX)+(x-this._scrollX);};Phaser.TilemapLayer.prototype._fixY=function(y){if(y<0)
{y=0;}
if(this.scrollFactorY===1)
{return y;}
return this._scrollY+(y-(this._scrollY / this.scrollFactorY));};Phaser.TilemapLayer.prototype._unfixY=function(y){if(this.scrollFactorY===1)
{return y;}
return(this._scrollY / this.scrollFactorY)+(y-this._scrollY);};Phaser.TilemapLayer.prototype.getTileX=function(x){return Math.floor(this._fixX(x)/ this._mc.tileWidth);};Phaser.TilemapLayer.prototype.getTileY=function(y){return Math.floor(this._fixY(y)/ this._mc.tileHeight);};Phaser.TilemapLayer.prototype.getTileXY=function(x,y,point){point.x=this.getTileX(x);point.y=this.getTileY(y);return point;};Phaser.TilemapLayer.prototype.getRayCastTiles=function(line,stepRate,collides,interestingFace){if(!stepRate){stepRate=this.rayStepRate;}
if(collides===undefined){collides=false;}
if(interestingFace===undefined){interestingFace=false;}
var tiles=this.getTiles(line.x,line.y,line.width,line.height,collides,interestingFace);if(tiles.length===0)
{return[];}
var coords=line.coordinatesOnLine(stepRate);var results=[];for(var i=0;i<tiles.length;i++)
{for(var t=0;t<coords.length;t++)
{var tile=tiles[i];var coord=coords[t];if(tile.containsPoint(coord[0],coord[1]))
{results.push(tile);break;}}}
return results;};Phaser.TilemapLayer.prototype.getTiles=function(x,y,width,height,collides,interestingFace){if(collides===undefined){collides=false;}
if(interestingFace===undefined){interestingFace=false;}
var fetchAll=!(collides||interestingFace);x=this._fixX(x);y=this._fixY(y);var tx=Math.floor(x /(this._mc.cw*this.scale.x));var ty=Math.floor(y /(this._mc.ch*this.scale.y));var tw=Math.ceil((x+width)/(this._mc.cw*this.scale.x))-tx;var th=Math.ceil((y+height)/(this._mc.ch*this.scale.y))-ty;while(this._results.length)
{this._results.pop();}
for(var wy=ty;wy<ty+th;wy++)
{for(var wx=tx;wx<tx+tw;wx++)
{var row=this.layer.data[wy];if(row&&row[wx])
{if(fetchAll||row[wx].isInteresting(collides,interestingFace))
{this._results.push(row[wx]);}}}}
return this._results.slice();};Phaser.TilemapLayer.prototype.resolveTileset=function(tileIndex){var tilesets=this._mc.tilesets;if(tileIndex<2000)
{while(tilesets.length<tileIndex)
{tilesets.push(undefined);}}
var setIndex=this.map.tiles[tileIndex]&&this.map.tiles[tileIndex][2];if(setIndex!=null)
{var tileset=this.map.tilesets[setIndex];if(tileset&&tileset.containsTileIndex(tileIndex))
{return(tilesets[tileIndex]=tileset);}}
return(tilesets[tileIndex]=null);};Phaser.TilemapLayer.prototype.resetTilesetCache=function(){var tilesets=this._mc.tilesets;while(tilesets.length)
{tilesets.pop();}};Phaser.TilemapLayer.prototype.setScale=function(xScale,yScale){xScale=xScale||1;yScale=yScale||xScale;for(var y=0;y<this.layer.data.length;y++)
{var row=this.layer.data[y];for(var x=0;x<row.length;x++)
{var tile=row[x];tile.width=this.map.tileWidth*xScale;tile.height=this.map.tileHeight*yScale;tile.worldX=tile.x*tile.width;tile.worldY=tile.y*tile.height;}}
this.scale.setTo(xScale,yScale);};Phaser.TilemapLayer.prototype.shiftCanvas=function(context,x,y){var canvas=context.canvas;var copyW=canvas.width-Math.abs(x);var copyH=canvas.height-Math.abs(y);var dx=0;var dy=0;var sx=x;var sy=y;if(x<0)
{dx=-x;sx=0;}
if(y<0)
{dy=-y;sy=0;}
var copyCanvas=this.renderSettings.copyCanvas;if(copyCanvas)
{if(copyCanvas.width<copyW||copyCanvas.height<copyH)
{copyCanvas.width=copyW;copyCanvas.height=copyH;}
var copyContext=copyCanvas.getContext('2d');copyContext.clearRect(0,0,copyW,copyH);copyContext.drawImage(canvas,dx,dy,copyW,copyH,0,0,copyW,copyH);context.clearRect(sx,sy,copyW,copyH);context.drawImage(copyCanvas,0,0,copyW,copyH,sx,sy,copyW,copyH);}
else
{context.save();context.globalCompositeOperation='copy';context.drawImage(canvas,dx,dy,copyW,copyH,sx,sy,copyW,copyH);context.restore();}};Phaser.TilemapLayer.prototype.renderRegion=function(scrollX,scrollY,left,top,right,bottom){var context=this.context;var width=this.layer.width;var height=this.layer.height;var tw=this._mc.tileWidth;var th=this._mc.tileHeight;var tilesets=this._mc.tilesets;var lastAlpha=NaN;if(!this._wrap)
{if(left<=right)
{left=Math.max(0,left);right=Math.min(width-1,right);}
if(top<=bottom)
{top=Math.max(0,top);bottom=Math.min(height-1,bottom);}}
var baseX=(left*tw)-scrollX;var baseY=(top*th)-scrollY;var normStartX=(left+((1<<20)*width))%width;var normStartY=(top+((1<<20)*height))%height;var tx,ty,x,y,xmax,ymax;context.fillStyle=this.tileColor;for(y=normStartY,ymax=bottom-top,ty=baseY;ymax>=0;y++,ymax--,ty+=th)
{if(y>=height){y-=height;}
var row=this.layer.data[y];for(x=normStartX,xmax=right-left,tx=baseX;xmax>=0;x++,xmax--,tx+=tw)
{if(x>=width){x-=width;}
var tile=row[x];if(!tile||tile.index<0)
{continue;}
var index=tile.index;var set=tilesets[index];if(set===undefined)
{set=this.resolveTileset(index);}
if(tile.alpha!==lastAlpha&&!this.debug)
{context.globalAlpha=tile.alpha;lastAlpha=tile.alpha;}
if(set)
{if(tile.rotation||tile.flipped)
{context.save();context.translate(tx+tile.centerX,ty+tile.centerY);context.rotate(tile.rotation);if(tile.flipped)
{context.scale(-1,1);}
set.draw(context,-tile.centerX,-tile.centerY,index);context.restore();}
else
{set.draw(context,tx,ty,index);}}
else if(this.debugSettings.missingImageFill)
{context.fillStyle=this.debugSettings.missingImageFill;context.fillRect(tx,ty,tw,th);}
if(tile.debug&&this.debugSettings.debuggedTileOverfill)
{context.fillStyle=this.debugSettings.debuggedTileOverfill;context.fillRect(tx,ty,tw,th);}}}};Phaser.TilemapLayer.prototype.renderDeltaScroll=function(shiftX,shiftY){var scrollX=this._mc.scrollX;var scrollY=this._mc.scrollY;var renderW=this.canvas.width;var renderH=this.canvas.height;var tw=this._mc.tileWidth;var th=this._mc.tileHeight;var left=0;var right=-tw;var top=0;var bottom=-th;if(shiftX<0)
{left=renderW+shiftX;right=renderW-1;}
else if(shiftX>0)
{right=shiftX;}
if(shiftY<0)
{top=renderH+shiftY;bottom=renderH-1;}
else if(shiftY>0)
{bottom=shiftY;}
this.shiftCanvas(this.context,shiftX,shiftY);left=Math.floor((left+scrollX)/ tw);right=Math.floor((right+scrollX)/ tw);top=Math.floor((top+scrollY)/ th);bottom=Math.floor((bottom+scrollY)/ th);if(left<=right)
{this.context.clearRect(((left*tw)-scrollX),0,(right-left+1)*tw,renderH);var trueTop=Math.floor((0+scrollY)/ th);var trueBottom=Math.floor((renderH-1+scrollY)/ th);this.renderRegion(scrollX,scrollY,left,trueTop,right,trueBottom);}
if(top<=bottom)
{this.context.clearRect(0,((top*th)-scrollY),renderW,(bottom-top+1)*th);var trueLeft=Math.floor((0+scrollX)/ tw);var trueRight=Math.floor((renderW-1+scrollX)/ tw);this.renderRegion(scrollX,scrollY,trueLeft,top,trueRight,bottom);}};Phaser.TilemapLayer.prototype.renderFull=function(){var scrollX=this._mc.scrollX;var scrollY=this._mc.scrollY;var renderW=this.canvas.width;var renderH=this.canvas.height;var tw=this._mc.tileWidth;var th=this._mc.tileHeight;var left=Math.floor(scrollX / tw);var right=Math.floor((renderW-1+scrollX)/ tw);var top=Math.floor(scrollY / th);var bottom=Math.floor((renderH-1+scrollY)/ th);this.context.clearRect(0,0,renderW,renderH);this.renderRegion(scrollX,scrollY,left,top,right,bottom);};Phaser.TilemapLayer.prototype.render=function(){var redrawAll=false;if(!this.visible)
{return;}
if(this.dirty||this.layer.dirty)
{this.layer.dirty=false;redrawAll=true;}
var renderWidth=this.canvas.width;var renderHeight=this.canvas.height;var scrollX=this._scrollX|0;var scrollY=this._scrollY|0;var mc=this._mc;var shiftX=mc.scrollX-scrollX;var shiftY=mc.scrollY-scrollY;if(!redrawAll&&shiftX===0&&shiftY===0&&mc.renderWidth===renderWidth&&mc.renderHeight===renderHeight)
{return;}
this.context.save();mc.scrollX=scrollX;mc.scrollY=scrollY;if(mc.renderWidth!==renderWidth||mc.renderHeight!==renderHeight)
{mc.renderWidth=renderWidth;mc.renderHeight=renderHeight;}
if(this.debug)
{this.context.globalAlpha=this.debugSettings.debugAlpha;if(this.debugSettings.forceFullRedraw)
{redrawAll=true;}}
if(!redrawAll&&this.renderSettings.enableScrollDelta&&(Math.abs(shiftX)+Math.abs(shiftY))<Math.min(renderWidth,renderHeight))
{this.renderDeltaScroll(shiftX,shiftY);}
else
{this.renderFull();}
if(this.debug)
{this.context.globalAlpha=1;this.renderDebug();}
this.texture.baseTexture.dirty();this.dirty=false;this.context.restore();return true;};Phaser.TilemapLayer.prototype.renderDebug=function(){var scrollX=this._mc.scrollX;var scrollY=this._mc.scrollY;var context=this.context;var renderW=this.canvas.width;var renderH=this.canvas.height;var width=this.layer.width;var height=this.layer.height;var tw=this._mc.tileWidth;var th=this._mc.tileHeight;var left=Math.floor(scrollX / tw);var right=Math.floor((renderW-1+scrollX)/ tw);var top=Math.floor(scrollY / th);var bottom=Math.floor((renderH-1+scrollY)/ th);var baseX=(left*tw)-scrollX;var baseY=(top*th)-scrollY;var normStartX=(left+((1<<20)*width))%width;var normStartY=(top+((1<<20)*height))%height;var tx,ty,x,y,xmax,ymax;context.strokeStyle=this.debugSettings.facingEdgeStroke;for(y=normStartY,ymax=bottom-top,ty=baseY;ymax>=0;y++,ymax--,ty+=th)
{if(y>=height){y-=height;}
var row=this.layer.data[y];for(x=normStartX,xmax=right-left,tx=baseX;xmax>=0;x++,xmax--,tx+=tw)
{if(x>=width){x-=width;}
var tile=row[x];if(!tile||tile.index<0||!tile.collides)
{continue;}
if(this.debugSettings.collidingTileOverfill)
{context.fillStyle=this.debugSettings.collidingTileOverfill;context.fillRect(tx,ty,this._mc.cw,this._mc.ch);}
if(this.debugSettings.facingEdgeStroke)
{context.beginPath();if(tile.faceTop)
{context.moveTo(tx,ty);context.lineTo(tx+this._mc.cw,ty);}
if(tile.faceBottom)
{context.moveTo(tx,ty+this._mc.ch);context.lineTo(tx+this._mc.cw,ty+this._mc.ch);}
if(tile.faceLeft)
{context.moveTo(tx,ty);context.lineTo(tx,ty+this._mc.ch);}
if(tile.faceRight)
{context.moveTo(tx+this._mc.cw,ty);context.lineTo(tx+this._mc.cw,ty+this._mc.ch);}
context.stroke();}}}};Object.defineProperty(Phaser.TilemapLayer.prototype,"wrap",{get:function(){return this._wrap;},set:function(value){this._wrap=value;this.dirty=true;}});Object.defineProperty(Phaser.TilemapLayer.prototype,"scrollX",{get:function(){return this._scrollX;},set:function(value){this._scrollX=value;}});Object.defineProperty(Phaser.TilemapLayer.prototype,"scrollY",{get:function(){return this._scrollY;},set:function(value){this._scrollY=value;}});Object.defineProperty(Phaser.TilemapLayer.prototype,"collisionWidth",{get:function(){return this._mc.cw;},set:function(value){this._mc.cw=value|0;this.dirty=true;}});Object.defineProperty(Phaser.TilemapLayer.prototype,"collisionHeight",{get:function(){return this._mc.ch;},set:function(value){this._mc.ch=value|0;this.dirty=true;}});Phaser.TilemapParser={INSERT_NULL:false,parse:function(game,key,tileWidth,tileHeight,width,height){if(tileWidth===undefined){tileWidth=32;}
if(tileHeight===undefined){tileHeight=32;}
if(width===undefined){width=10;}
if(height===undefined){height=10;}
if(key===undefined)
{return this.getEmptyData();}
if(key===null)
{return this.getEmptyData(tileWidth,tileHeight,width,height);}
var map=game.cache.getTilemapData(key);if(map)
{if(map.format===Phaser.Tilemap.CSV)
{return this.parseCSV(key,map.data,tileWidth,tileHeight);}
else if(!map.format||map.format===Phaser.Tilemap.TILED_JSON)
{return this.parseTiledJSON(map.data);}}
else
{console.warn('Phaser.TilemapParser.parse - No map data found for key '+key);}},parseCSV:function(key,data,tileWidth,tileHeight){var map=this.getEmptyData();data=data.trim();var output=[];var rows=data.split("\n");var height=rows.length;var width=0;for(var y=0;y<rows.length;y++)
{output[y]=[];var column=rows[y].split(",");for(var x=0;x<column.length;x++)
{output[y][x]=new Phaser.Tile(map.layers[0],parseInt(column[x],10),x,y,tileWidth,tileHeight);}
if(width===0)
{width=column.length;}}
map.format=Phaser.Tilemap.CSV;map.name=key;map.width=width;map.height=height;map.tileWidth=tileWidth;map.tileHeight=tileHeight;map.widthInPixels=width*tileWidth;map.heightInPixels=height*tileHeight;map.layers[0].width=width;map.layers[0].height=height;map.layers[0].widthInPixels=map.widthInPixels;map.layers[0].heightInPixels=map.heightInPixels;map.layers[0].data=output;return map;},getEmptyData:function(tileWidth,tileHeight,width,height){var map={};map.width=0;map.height=0;map.tileWidth=0;map.tileHeight=0;if(typeof tileWidth!=='undefined'&&tileWidth!==null){map.tileWidth=tileWidth;}
if(typeof tileHeight!=='undefined'&&tileHeight!==null){map.tileHeight=tileHeight;}
if(typeof width!=='undefined'&&width!==null){map.width=width;}
if(typeof height!=='undefined'&&height!==null){map.height=height;}
map.orientation='orthogonal';map.version='1';map.properties={};map.widthInPixels=0;map.heightInPixels=0;var layers=[];var layer={name:'layer',x:0,y:0,width:0,height:0,widthInPixels:0,heightInPixels:0,alpha:1,visible:true,properties:{},indexes:[],callbacks:[],bodies:[],data:[]};layers.push(layer);map.layers=layers;map.images=[];map.objects={};map.collision={};map.tilesets=[];map.tiles=[];return map;},parseTiledJSON:function(json){if(json.orientation!=='orthogonal')
{console.warn('TilemapParser.parseTiledJSON - Only orthogonal map types are supported in this version of Phaser');return null;}
var map={};map.width=json.width;map.height=json.height;map.tileWidth=json.tilewidth;map.tileHeight=json.tileheight;map.orientation=json.orientation;map.format=Phaser.Tilemap.TILED_JSON;map.version=json.version;map.properties=json.properties;map.widthInPixels=map.width*map.tileWidth;map.heightInPixels=map.height*map.tileHeight;var layers=[];for(var i=0;i<json.layers.length;i++)
{if(json.layers[i].type!=='tilelayer')
{continue;}
var curl=json.layers[i];if(!curl.compression&&curl.encoding&&curl.encoding==="base64"){var binaryString=window.atob(curl.data);var len=binaryString.length;var bytes=new Array(len);for(var i=0;i<len;i+=4){bytes[i/4]=(binaryString.charCodeAt(i)|binaryString.charCodeAt(i+1)<<8|binaryString.charCodeAt(i+2)<<16|binaryString.charCodeAt(i+3)<<24)>>>0;}
curl.data=bytes;}
var layer={name:curl.name,x:curl.x,y:curl.y,width:curl.width,height:curl.height,widthInPixels:curl.width*json.tilewidth,heightInPixels:curl.height*json.tileheight,alpha:curl.opacity,visible:curl.visible,properties:{},indexes:[],callbacks:[],bodies:[]};if(curl.properties)
{layer.properties=curl.properties;}
var x=0;var row=[];var output=[];var rotation,flipped,flippedVal,gid;for(var t=0,len=curl.data.length;t<len;t++)
{rotation=0;flipped=false;gid=curl.data[t];if(gid>0x20000000)
{flippedVal=0;if(gid>0x80000000)
{gid-=0x80000000;flippedVal+=4;}
if(gid>0x40000000)
{gid-=0x40000000;flippedVal+=2;}
if(gid>0x20000000)
{gid-=0x20000000;flippedVal+=1;}
switch(flippedVal)
{case 5:rotation=Math.PI/2;break;case 6:rotation=Math.PI;break;case 3:rotation=3*Math.PI/2;break;case 4:rotation=0;flipped=true;break;case 7:rotation=Math.PI/2;flipped=true;break;case 2:rotation=Math.PI;flipped=true;break;case 1:rotation=3*Math.PI/2;flipped=true;break;}}
if(gid>0)
{row.push(new Phaser.Tile(layer,gid,x,output.length,json.tilewidth,json.tileheight));row[row.length-1].rotation=rotation;row[row.length-1].flipped=flipped;}
else
{if(Phaser.TilemapParser.INSERT_NULL)
{row.push(null);}
else
{row.push(new Phaser.Tile(layer,-1,x,output.length,json.tilewidth,json.tileheight));}}
x++;if(x===curl.width)
{output.push(row);x=0;row=[];}}
layer.data=output;layers.push(layer);}
map.layers=layers;var images=[];for(var i=0;i<json.layers.length;i++)
{if(json.layers[i].type!=='imagelayer')
{continue;}
var curi=json.layers[i];var image={name:curi.name,image:curi.image,x:curi.x,y:curi.y,alpha:curi.opacity,visible:curi.visible,properties:{}};if(curi.properties)
{image.properties=curi.properties;}
images.push(image);}
map.images=images;var tilesets=[];var imagecollections=[];for(var i=0;i<json.tilesets.length;i++)
{var set=json.tilesets[i];if(set.image)
{var newSet=new Phaser.Tileset(set.name,set.firstgid,set.tilewidth,set.tileheight,set.margin,set.spacing,set.properties);if(set.tileproperties)
{newSet.tileProperties=set.tileproperties;}
newSet.updateTileData(set.imagewidth,set.imageheight);tilesets.push(newSet);}
else
{var newCollection=new Phaser.ImageCollection(set.name,set.firstgid,set.tilewidth,set.tileheight,set.margin,set.spacing,set.properties);for(var i in set.tiles)
{var image=set.tiles[i].image;var gid=set.firstgid+parseInt(i,10);newCollection.addImage(gid,image);}
imagecollections.push(newCollection);}}
map.tilesets=tilesets;map.imagecollections=imagecollections;var objects={};var collision={};function slice(obj,fields){var sliced={};for(var k in fields)
{var key=fields[k];if(typeof obj[key]!=='undefined')
{sliced[key]=obj[key];}}
return sliced;}
for(var i=0;i<json.layers.length;i++)
{if(json.layers[i].type!=='objectgroup')
{continue;}
var curo=json.layers[i];objects[curo.name]=[];collision[curo.name]=[];for(var v=0,len=curo.objects.length;v<len;v++)
{if(curo.objects[v].gid)
{var object={gid:curo.objects[v].gid,name:curo.objects[v].name,type:curo.objects[v].hasOwnProperty("type")?curo.objects[v].type:"",x:curo.objects[v].x,y:curo.objects[v].y,visible:curo.objects[v].visible,properties:curo.objects[v].properties};if(curo.objects[v].rotation)
{object.rotation=curo.objects[v].rotation;}
objects[curo.name].push(object);}
else if(curo.objects[v].polyline)
{var object={name:curo.objects[v].name,type:curo.objects[v].type,x:curo.objects[v].x,y:curo.objects[v].y,width:curo.objects[v].width,height:curo.objects[v].height,visible:curo.objects[v].visible,properties:curo.objects[v].properties};if(curo.objects[v].rotation)
{object.rotation=curo.objects[v].rotation;}
object.polyline=[];for(var p=0;p<curo.objects[v].polyline.length;p++)
{object.polyline.push([curo.objects[v].polyline[p].x,curo.objects[v].polyline[p].y]);}
collision[curo.name].push(object);objects[curo.name].push(object);}
else if(curo.objects[v].polygon)
{var object=slice(curo.objects[v],["name","type","x","y","visible","rotation","properties"]);object.polygon=[];for(var p=0;p<curo.objects[v].polygon.length;p++)
{object.polygon.push([curo.objects[v].polygon[p].x,curo.objects[v].polygon[p].y]);}
objects[curo.name].push(object);}
else if(curo.objects[v].ellipse)
{var object=slice(curo.objects[v],["name","type","ellipse","x","y","width","height","visible","rotation","properties"]);objects[curo.name].push(object);}
else
{var object=slice(curo.objects[v],["name","type","x","y","width","height","visible","rotation","properties"]);object.rectangle=true;objects[curo.name].push(object);}}}
map.objects=objects;map.collision=collision;map.tiles=[];for(var i=0;i<map.tilesets.length;i++)
{var set=map.tilesets[i];var x=set.tileMargin;var y=set.tileMargin;var count=0;var countX=0;var countY=0;for(var t=set.firstgid;t<set.firstgid+set.total;t++)
{map.tiles[t]=[x,y,i];x+=set.tileWidth+set.tileSpacing;count++;if(count===set.total)
{break;}
countX++;if(countX===set.columns)
{x=set.tileMargin;y+=set.tileHeight+set.tileSpacing;countX=0;countY++;if(countY===set.rows)
{break;}}}}
var layer;var tile;var sid;var set;for(var i=0;i<map.layers.length;i++)
{layer=map.layers[i];for(var j=0;j<layer.data.length;j++)
{row=layer.data[j];for(var k=0;k<row.length;k++)
{tile=row[k];if(tile===null||tile.index<0)
{continue;}
sid=map.tiles[tile.index][2];set=map.tilesets[sid];if(set.tileProperties&&set.tileProperties[tile.index-set.firstgid])
{tile.properties=Phaser.Utils.mixin(set.tileProperties[tile.index-set.firstgid],tile.properties);}}}}
return map;}};Phaser.Tileset=function(name,firstgid,width,height,margin,spacing,properties){if(width===undefined||width<=0){width=32;}
if(height===undefined||height<=0){height=32;}
if(margin===undefined){margin=0;}
if(spacing===undefined){spacing=0;}
this.name=name;this.firstgid=firstgid|0;this.tileWidth=width|0;this.tileHeight=height|0;this.tileMargin=margin|0;this.tileSpacing=spacing|0;this.properties=properties||{};this.image=null;this.rows=0;this.columns=0;this.total=0;this.drawCoords=[];};Phaser.Tileset.prototype={draw:function(context,x,y,index){var coordIndex=(index-this.firstgid)<<1;if(coordIndex>=0&&(coordIndex+1)<this.drawCoords.length)
{context.drawImage(this.image,this.drawCoords[coordIndex],this.drawCoords[coordIndex+1],this.tileWidth,this.tileHeight,x,y,this.tileWidth,this.tileHeight);}},containsTileIndex:function(tileIndex){return(tileIndex>=this.firstgid&&tileIndex<(this.firstgid+this.total));},setImage:function(image){this.image=image;this.updateTileData(image.width,image.height);},setSpacing:function(margin,spacing){this.tileMargin=margin|0;this.tileSpacing=spacing|0;if(this.image)
{this.updateTileData(this.image.width,this.image.height);}},updateTileData:function(imageWidth,imageHeight){var rowCount=(imageHeight-this.tileMargin*2+this.tileSpacing)/(this.tileHeight+this.tileSpacing);var colCount=(imageWidth-this.tileMargin*2+this.tileSpacing)/(this.tileWidth+this.tileSpacing);if(rowCount%1!==0||colCount%1!==0)
{console.warn("Phaser.Tileset - image tile area is not an even multiple of tile size");}
rowCount=Math.floor(rowCount);colCount=Math.floor(colCount);if((this.rows&&this.rows!==rowCount)||(this.columns&&this.columns!==colCount))
{console.warn("Phaser.Tileset - actual and expected number of tile rows and columns differ");}
this.rows=rowCount;this.columns=colCount;this.total=rowCount*colCount;this.drawCoords.length=0;var tx=this.tileMargin;var ty=this.tileMargin;for(var y=0;y<this.rows;y++)
{for(var x=0;x<this.columns;x++)
{this.drawCoords.push(tx);this.drawCoords.push(ty);tx+=this.tileWidth+this.tileSpacing;}
tx=this.tileMargin;ty+=this.tileHeight+this.tileSpacing;}}};Phaser.Tileset.prototype.constructor=Phaser.Tileset;Phaser.Particle=function(game,x,y,key,frame){Phaser.Sprite.call(this,game,x,y,key,frame);this.autoScale=false;this.scaleData=null;this._s=0;this.autoAlpha=false;this.alphaData=null;this._a=0;};Phaser.Particle.prototype=Object.create(Phaser.Sprite.prototype);Phaser.Particle.prototype.constructor=Phaser.Particle;Phaser.Particle.prototype.update=function(){if(this.autoScale)
{this._s--;if(this._s)
{this.scale.set(this.scaleData[this._s].x,this.scaleData[this._s].y);}
else
{this.autoScale=false;}}
if(this.autoAlpha)
{this._a--;if(this._a)
{this.alpha=this.alphaData[this._a].v;}
else
{this.autoAlpha=false;}}};Phaser.Particle.prototype.onEmit=function(){};Phaser.Particle.prototype.setAlphaData=function(data){this.alphaData=data;this._a=data.length-1;this.alpha=this.alphaData[this._a].v;this.autoAlpha=true;};Phaser.Particle.prototype.setScaleData=function(data){this.scaleData=data;this._s=data.length-1;this.scale.set(this.scaleData[this._s].x,this.scaleData[this._s].y);this.autoScale=true;};Phaser.Particle.prototype.reset=function(x,y,health){Phaser.Component.Reset.prototype.reset.call(this,x,y,health);this.alpha=1;this.scale.set(1);this.autoScale=false;this.autoAlpha=false;return this;};Phaser.Particles=function(game){this.game=game;this.emitters={};this.ID=0;};Phaser.Particles.prototype={add:function(emitter){this.emitters[emitter.name]=emitter;return emitter;},remove:function(emitter){delete this.emitters[emitter.name];},update:function(){for(var key in this.emitters)
{if(this.emitters[key].exists)
{this.emitters[key].update();}}}};Phaser.Particles.prototype.constructor=Phaser.Particles;Phaser.Particles.Arcade={};Phaser.Particles.Arcade.Emitter=function(game,x,y,maxParticles){this.maxParticles=maxParticles||50;Phaser.Group.call(this,game);this.name='emitter'+this.game.particles.ID++;this.type=Phaser.EMITTER;this.physicsType=Phaser.GROUP;this.area=new Phaser.Rectangle(x,y,1,1);this.minParticleSpeed=new Phaser.Point(-100,-100);this.maxParticleSpeed=new Phaser.Point(100,100);this.minParticleScale=1;this.maxParticleScale=1;this.scaleData=null;this.minRotation=-360;this.maxRotation=360;this.minParticleAlpha=1;this.maxParticleAlpha=1;this.alphaData=null;this.gravity=100;this.particleClass=Phaser.Particle;this.particleDrag=new Phaser.Point();this.angularDrag=0;this.frequency=100;this.lifespan=2000;this.bounce=new Phaser.Point();this.on=false;this.particleAnchor=new Phaser.Point(0.5,0.5);this.blendMode=Phaser.blendModes.NORMAL;this.emitX=x;this.emitY=y;this.autoScale=false;this.autoAlpha=false;this.particleBringToTop=false;this.particleSendToBack=false;this._minParticleScale=new Phaser.Point(1,1);this._maxParticleScale=new Phaser.Point(1,1);this._quantity=0;this._timer=0;this._counter=0;this._flowQuantity=0;this._flowTotal=0;this._explode=true;this._frames=null;};Phaser.Particles.Arcade.Emitter.prototype=Object.create(Phaser.Group.prototype);Phaser.Particles.Arcade.Emitter.prototype.constructor=Phaser.Particles.Arcade.Emitter;Phaser.Particles.Arcade.Emitter.prototype.update=function(){if(this.on&&this.game.time.time>=this._timer)
{this._timer=this.game.time.time+this.frequency*this.game.time.slowMotion;if(this._flowTotal!==0)
{if(this._flowQuantity>0)
{for(var i=0;i<this._flowQuantity;i++)
{if(this.emitParticle())
{this._counter++;if(this._flowTotal!==-1&&this._counter>=this._flowTotal)
{this.on=false;break;}}}}
else
{if(this.emitParticle())
{this._counter++;if(this._flowTotal!==-1&&this._counter>=this._flowTotal)
{this.on=false;}}}}
else
{if(this.emitParticle())
{this._counter++;if(this._quantity>0&&this._counter>=this._quantity)
{this.on=false;}}}}
var i=this.children.length;while(i--)
{if(this.children[i].exists)
{this.children[i].update();}}};Phaser.Particles.Arcade.Emitter.prototype.makeParticles=function(keys,frames,quantity,collide,collideWorldBounds){if(frames===undefined){frames=0;}
if(quantity===undefined){quantity=this.maxParticles;}
if(collide===undefined){collide=false;}
if(collideWorldBounds===undefined){collideWorldBounds=false;}
var particle;var i=0;var rndKey=keys;var rndFrame=frames;this._frames=frames;if(quantity>this.maxParticles)
{this.maxParticles=quantity;}
while(i<quantity)
{if(Array.isArray(keys))
{rndKey=this.game.rnd.pick(keys);}
if(Array.isArray(frames))
{rndFrame=this.game.rnd.pick(frames);}
particle=new this.particleClass(this.game,0,0,rndKey,rndFrame);this.game.physics.arcade.enable(particle,false);if(collide)
{particle.body.checkCollision.any=true;particle.body.checkCollision.none=false;}
else
{particle.body.checkCollision.none=true;}
particle.body.collideWorldBounds=collideWorldBounds;particle.body.skipQuadTree=true;particle.exists=false;particle.visible=false;particle.anchor.copyFrom(this.particleAnchor);this.add(particle);i++;}
return this;};Phaser.Particles.Arcade.Emitter.prototype.kill=function(){this.on=false;this.alive=false;this.exists=false;};Phaser.Particles.Arcade.Emitter.prototype.revive=function(){this.alive=true;this.exists=true;};Phaser.Particles.Arcade.Emitter.prototype.explode=function(lifespan,quantity){this._flowTotal=0;this.start(true,lifespan,0,quantity,false);};Phaser.Particles.Arcade.Emitter.prototype.flow=function(lifespan,frequency,quantity,total,immediate){if(quantity===undefined||quantity===0){quantity=1;}
if(total===undefined){total=-1;}
if(immediate===undefined){immediate=true;}
if(quantity>this.maxParticles)
{quantity=this.maxParticles;}
this._counter=0;this._flowQuantity=quantity;this._flowTotal=total;if(immediate)
{this.start(true,lifespan,frequency,quantity);this._counter+=quantity;this.on=true;this._timer=this.game.time.time+frequency*this.game.time.slowMotion;}
else
{this.start(false,lifespan,frequency,quantity);}};Phaser.Particles.Arcade.Emitter.prototype.start=function(explode,lifespan,frequency,quantity,forceQuantity){if(explode===undefined){explode=true;}
if(lifespan===undefined){lifespan=0;}
if(frequency===undefined||frequency===null){frequency=250;}
if(quantity===undefined){quantity=0;}
if(forceQuantity===undefined){forceQuantity=false;}
if(quantity>this.maxParticles)
{quantity=this.maxParticles;}
this.revive();this.visible=true;this.lifespan=lifespan;this.frequency=frequency;if(explode||forceQuantity)
{for(var i=0;i<quantity;i++)
{this.emitParticle();}}
else
{this.on=true;this._quantity+=quantity;this._counter=0;this._timer=this.game.time.time+frequency*this.game.time.slowMotion;}};Phaser.Particles.Arcade.Emitter.prototype.emitParticle=function(x,y,key,frame){if(x===undefined){x=null;}
if(y===undefined){y=null;}
var particle=this.getFirstExists(false);if(particle===null)
{return false;}
var rnd=this.game.rnd;if(key!==undefined&&frame!==undefined)
{particle.loadTexture(key,frame);}
else if(key!==undefined)
{particle.loadTexture(key);}
var emitX=this.emitX;var emitY=this.emitY;if(x!==null)
{emitX=x;}
else if(this.width>1)
{emitX=rnd.between(this.left,this.right);}
if(y!==null)
{emitY=y;}
else if(this.height>1)
{emitY=rnd.between(this.top,this.bottom);}
particle.reset(emitX,emitY);particle.angle=0;particle.lifespan=this.lifespan;if(this.particleBringToTop)
{this.bringToTop(particle);}
else if(this.particleSendToBack)
{this.sendToBack(particle);}
if(this.autoScale)
{particle.setScaleData(this.scaleData);}
else if(this.minParticleScale!==1||this.maxParticleScale!==1)
{particle.scale.set(rnd.realInRange(this.minParticleScale,this.maxParticleScale));}
else if((this._minParticleScale.x!==this._maxParticleScale.x)||(this._minParticleScale.y!==this._maxParticleScale.y))
{particle.scale.set(rnd.realInRange(this._minParticleScale.x,this._maxParticleScale.x),rnd.realInRange(this._minParticleScale.y,this._maxParticleScale.y));}
if(frame===undefined)
{if(Array.isArray(this._frames))
{particle.frame=this.game.rnd.pick(this._frames);}
else
{particle.frame=this._frames;}}
if(this.autoAlpha)
{particle.setAlphaData(this.alphaData);}
else
{particle.alpha=rnd.realInRange(this.minParticleAlpha,this.maxParticleAlpha);}
particle.blendMode=this.blendMode;var body=particle.body;body.updateBounds();body.bounce.copyFrom(this.bounce);body.drag.copyFrom(this.particleDrag);body.velocity.x=rnd.between(this.minParticleSpeed.x,this.maxParticleSpeed.x);body.velocity.y=rnd.between(this.minParticleSpeed.y,this.maxParticleSpeed.y);body.angularVelocity=rnd.between(this.minRotation,this.maxRotation);body.gravity.y=this.gravity;body.angularDrag=this.angularDrag;particle.onEmit();return true;};Phaser.Particles.Arcade.Emitter.prototype.destroy=function(){this.game.particles.remove(this);Phaser.Group.prototype.destroy.call(this,true,false);};Phaser.Particles.Arcade.Emitter.prototype.setSize=function(width,height){this.area.width=width;this.area.height=height;};Phaser.Particles.Arcade.Emitter.prototype.setXSpeed=function(min,max){min=min||0;max=max||0;this.minParticleSpeed.x=min;this.maxParticleSpeed.x=max;};Phaser.Particles.Arcade.Emitter.prototype.setYSpeed=function(min,max){min=min||0;max=max||0;this.minParticleSpeed.y=min;this.maxParticleSpeed.y=max;};Phaser.Particles.Arcade.Emitter.prototype.setRotation=function(min,max){min=min||0;max=max||0;this.minRotation=min;this.maxRotation=max;};Phaser.Particles.Arcade.Emitter.prototype.setAlpha=function(min,max,rate,ease,yoyo){if(min===undefined){min=1;}
if(max===undefined){max=1;}
if(rate===undefined){rate=0;}
if(ease===undefined){ease=Phaser.Easing.Linear.None;}
if(yoyo===undefined){yoyo=false;}
this.minParticleAlpha=min;this.maxParticleAlpha=max;this.autoAlpha=false;if(rate>0&&min!==max)
{var tweenData={v:min};var tween=this.game.make.tween(tweenData).to({v:max},rate,ease);tween.yoyo(yoyo);this.alphaData=tween.generateData(60);this.alphaData.reverse();this.autoAlpha=true;}};Phaser.Particles.Arcade.Emitter.prototype.setScale=function(minX,maxX,minY,maxY,rate,ease,yoyo){if(minX===undefined){minX=1;}
if(maxX===undefined){maxX=1;}
if(minY===undefined){minY=1;}
if(maxY===undefined){maxY=1;}
if(rate===undefined){rate=0;}
if(ease===undefined){ease=Phaser.Easing.Linear.None;}
if(yoyo===undefined){yoyo=false;}
this.minParticleScale=1;this.maxParticleScale=1;this._minParticleScale.set(minX,minY);this._maxParticleScale.set(maxX,maxY);this.autoScale=false;if(rate>0&&((minX!==maxX)||(minY!==maxY)))
{var tweenData={x:minX,y:minY};var tween=this.game.make.tween(tweenData).to({x:maxX,y:maxY},rate,ease);tween.yoyo(yoyo);this.scaleData=tween.generateData(60);this.scaleData.reverse();this.autoScale=true;}};Phaser.Particles.Arcade.Emitter.prototype.at=function(object){if(object.center)
{this.emitX=object.center.x;this.emitY=object.center.y;}
else
{this.emitX=object.world.x+(object.anchor.x*object.width);this.emitY=object.world.y+(object.anchor.y*object.height);}};Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"width",{get:function(){return this.area.width;},set:function(value){this.area.width=value;}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"height",{get:function(){return this.area.height;},set:function(value){this.area.height=value;}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"x",{get:function(){return this.emitX;},set:function(value){this.emitX=value;}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"y",{get:function(){return this.emitY;},set:function(value){this.emitY=value;}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"left",{get:function(){return Math.floor(this.x-(this.area.width / 2));}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"right",{get:function(){return Math.floor(this.x+(this.area.width / 2));}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"top",{get:function(){return Math.floor(this.y-(this.area.height / 2));}});Object.defineProperty(Phaser.Particles.Arcade.Emitter.prototype,"bottom",{get:function(){return Math.floor(this.y+(this.area.height / 2));}});Phaser.Video=function(game,key,url){if(key===undefined){key=null;}
if(url===undefined){url=null;}
this.game=game;this.key=key;this.width=0;this.height=0;this.type=Phaser.VIDEO;this.disableTextureUpload=false;this.touchLocked=false;this.onPlay=new Phaser.Signal();this.onChangeSource=new Phaser.Signal();this.onComplete=new Phaser.Signal();this.onAccess=new Phaser.Signal();this.onError=new Phaser.Signal();this.onTimeout=new Phaser.Signal();this.timeout=15000;this._timeOutID=null;this.video=null;this.videoStream=null;this.isStreaming=false;this.retryLimit=20;this.retry=0;this.retryInterval=500;this._retryID=null;this._codeMuted=false;this._muted=false;this._codePaused=false;this._paused=false;this._pending=false;this._autoplay=false;if(key&&this.game.cache.checkVideoKey(key))
{var _video=this.game.cache.getVideo(key);if(_video.isBlob)
{this.createVideoFromBlob(_video.data);}
else
{this.video=_video.data;}
this.width=this.video.videoWidth;this.height=this.video.videoHeight;}
else if(url)
{this.createVideoFromURL(url,false);}
if(this.video&&!url)
{this.baseTexture=new PIXI.BaseTexture(this.video);this.baseTexture.forceLoaded(this.width,this.height);}
else
{this.baseTexture=new PIXI.BaseTexture(PIXI.TextureCache['__default'].baseTexture.source);this.baseTexture.forceLoaded(this.width,this.height);}
this.texture=new PIXI.Texture(this.baseTexture);this.textureFrame=new Phaser.Frame(0,0,0,this.width,this.height,'video');this.texture.setFrame(this.textureFrame);this.texture.valid=false;if(key!==null&&this.video)
{this.texture.valid=this.video.canplay;}
this.snapshot=null;if(Phaser.BitmapData)
{this.snapshot=new Phaser.BitmapData(this.game,'',this.width,this.height);}
if(!this.game.device.cocoonJS&&(this.game.device.iOS||this.game.device.android)||(window['PhaserGlobal']&&window['PhaserGlobal'].fakeiOSTouchLock))
{this.setTouchLock();}
else
{if(_video)
{_video.locked=false;}}};Phaser.Video.prototype={connectToMediaStream:function(video,stream){if(video&&stream)
{this.video=video;this.videoStream=stream;this.isStreaming=true;this.baseTexture.source=this.video;this.updateTexture(null,this.video.videoWidth,this.video.videoHeight);this.onAccess.dispatch(this);}
return this;},startMediaStream:function(captureAudio,width,height){if(captureAudio===undefined){captureAudio=false;}
if(width===undefined){width=null;}
if(height===undefined){height=null;}
if(!this.game.device.getUserMedia)
{this.onError.dispatch(this,'No getUserMedia');return false;}
if(this.videoStream!==null)
{if(this.videoStream['active'])
{this.videoStream.active=false;}
else
{this.videoStream.stop();}}
this.removeVideoElement();this.video=document.createElement("video");this.video.setAttribute('autoplay','autoplay');if(width!==null)
{this.video.width=width;}
if(height!==null)
{this.video.height=height;}
this._timeOutID=window.setTimeout(this.getUserMediaTimeout.bind(this),this.timeout);try{navigator.getUserMedia({"audio":captureAudio,"video":true},this.getUserMediaSuccess.bind(this),this.getUserMediaError.bind(this));}
catch(error)
{this.getUserMediaError(error);}
return this;},getUserMediaTimeout:function(){clearTimeout(this._timeOutID);this.onTimeout.dispatch(this);},getUserMediaError:function(event){clearTimeout(this._timeOutID);this.onError.dispatch(this,event);},getUserMediaSuccess:function(stream){clearTimeout(this._timeOutID);this.videoStream=stream;if(this.video.mozSrcObject!==undefined)
{this.video.mozSrcObject=stream;}
else
{this.video.src=(window.URL&&window.URL.createObjectURL(stream))||stream;}
var self=this;this.video.onloadeddata=function(){var retry=10;function checkStream(){if(retry>0)
{if(self.video.videoWidth>0)
{var width=self.video.videoWidth;var height=self.video.videoHeight;if(isNaN(self.video.videoHeight))
{height=width /(4/3);}
self.video.play();self.isStreaming=true;self.baseTexture.source=self.video;self.updateTexture(null,width,height);self.onAccess.dispatch(self);}
else
{window.setTimeout(checkStream,500);}}
else
{console.warn('Unable to connect to video stream. Webcam error?');}
retry--;}
checkStream();};},createVideoFromBlob:function(blob){var _this=this;this.video=document.createElement("video");this.video.controls=false;this.video.setAttribute('autoplay','autoplay');this.video.addEventListener('loadeddata',function(event){_this.updateTexture(event);},true);this.video.src=window.URL.createObjectURL(blob);this.video.canplay=true;return this;},createVideoFromURL:function(url,autoplay){if(autoplay===undefined){autoplay=false;}
if(this.texture)
{this.texture.valid=false;}
this.video=document.createElement("video");this.video.controls=false;if(autoplay)
{this.video.setAttribute('autoplay','autoplay');}
this.video.src=url;this.video.canplay=true;this.video.load();this.retry=this.retryLimit;this._retryID=window.setTimeout(this.checkVideoProgress.bind(this),this.retryInterval);this.key=url;return this;},updateTexture:function(event,width,height){var change=false;if(width===undefined||width===null){width=this.video.videoWidth;change=true;}
if(height===undefined||height===null){height=this.video.videoHeight;}
this.width=width;this.height=height;if(this.baseTexture.source!==this.video)
{this.baseTexture.source=this.video;}
this.baseTexture.forceLoaded(width,height);this.texture.frame.resize(width,height);this.texture.width=width;this.texture.height=height;this.texture.valid=true;if(this.snapshot)
{this.snapshot.resize(width,height);}
if(change&&this.key!==null)
{this.onChangeSource.dispatch(this,width,height);if(this._autoplay)
{this.video.play();this.onPlay.dispatch(this,this.loop,this.playbackRate);}}},complete:function(){this.onComplete.dispatch(this);},play:function(loop,playbackRate){if(loop===undefined){loop=false;}
if(playbackRate===undefined){playbackRate=1;}
if(this.game.sound.onMute)
{this.game.sound.onMute.add(this.setMute,this);this.game.sound.onUnMute.add(this.unsetMute,this);if(this.game.sound.mute)
{this.setMute();}}
this.game.onPause.add(this.setPause,this);this.game.onResume.add(this.setResume,this);this.video.addEventListener('ended',this.complete.bind(this),true);if(loop)
{this.video.loop='loop';}
else
{this.video.loop='';}
this.video.playbackRate=playbackRate;if(this.touchLocked)
{this._pending=true;}
else
{this._pending=false;if(this.key!==null)
{if(this.video.readyState!==4)
{this.retry=this.retryLimit;this._retryID=window.setTimeout(this.checkVideoProgress.bind(this),this.retryInterval);}
else
{this.video.addEventListener('playing',this.playHandler.bind(this),true);}}
this.video.play();this.onPlay.dispatch(this,loop,playbackRate);}
return this;},playHandler:function(){this.video.removeEventListener('playing',this.playHandler.bind(this));this.updateTexture();},stop:function(){if(this.game.sound.onMute)
{this.game.sound.onMute.remove(this.setMute,this);this.game.sound.onUnMute.remove(this.unsetMute,this);}
this.game.onPause.remove(this.setPause,this);this.game.onResume.remove(this.setResume,this);if(this.isStreaming)
{if(this.video.mozSrcObject)
{this.video.mozSrcObject.stop();this.video.src=null;}
else
{this.video.src="";if(this.videoStream['active'])
{this.videoStream.active=false;}
else
{this.videoStream.stop();}}
this.videoStream=null;this.isStreaming=false;}
else
{this.video.removeEventListener('ended',this.complete.bind(this),true);this.video.removeEventListener('playing',this.playHandler.bind(this),true);if(this.touchLocked)
{this._pending=false;}
else
{this.video.pause();}}
return this;},add:function(object){if(Array.isArray(object))
{for(var i=0;i<object.length;i++)
{if(object[i]['loadTexture'])
{object[i].loadTexture(this);}}}
else
{object.loadTexture(this);}
return this;},addToWorld:function(x,y,anchorX,anchorY,scaleX,scaleY){scaleX=scaleX||1;scaleY=scaleY||1;var image=this.game.add.image(x,y,this);image.anchor.set(anchorX,anchorY);image.scale.set(scaleX,scaleY);return image;},render:function(){if(!this.disableTextureUpload&&this.playing)
{this.baseTexture.dirty();}},setMute:function(){if(this._muted)
{return;}
this._muted=true;this.video.muted=true;},unsetMute:function(){if(!this._muted||this._codeMuted)
{return;}
this._muted=false;this.video.muted=false;},setPause:function(){if(this._paused||this.touchLocked)
{return;}
this._paused=true;this.video.pause();},setResume:function(){if(!this._paused||this._codePaused||this.touchLocked)
{return;}
this._paused=false;if(!this.video.ended)
{this.video.play();}},changeSource:function(src,autoplay){if(autoplay===undefined){autoplay=true;}
this.texture.valid=false;this.video.pause();this.retry=this.retryLimit;this._retryID=window.setTimeout(this.checkVideoProgress.bind(this),this.retryInterval);this.video.src=src;this.video.load();this._autoplay=autoplay;if(!autoplay)
{this.paused=true;}
return this;},checkVideoProgress:function(){if(this.video.readyState===4)
{this.updateTexture();}
else
{this.retry--;if(this.retry>0)
{this._retryID=window.setTimeout(this.checkVideoProgress.bind(this),this.retryInterval);}
else
{console.warn('Phaser.Video: Unable to start downloading video in time',this.isStreaming);}}},setTouchLock:function(){this.game.input.touch.addTouchLockCallback(this.unlock,this);this.touchLocked=true;},unlock:function(){this.touchLocked=false;this.video.play();this.onPlay.dispatch(this,this.loop,this.playbackRate);if(this.key)
{var _video=this.game.cache.getVideo(this.key);if(_video&&!_video.isBlob)
{_video.locked=false;}}
return true;},grab:function(clear,alpha,blendMode){if(clear===undefined){clear=false;}
if(alpha===undefined){alpha=1;}
if(blendMode===undefined){blendMode=null;}
if(this.snapshot===null)
{console.warn('Video.grab cannot run because Phaser.BitmapData is unavailable');return;}
if(clear)
{this.snapshot.cls();}
this.snapshot.copy(this.video,0,0,this.width,this.height,0,0,this.width,this.height,0,0,0,1,1,alpha,blendMode);return this.snapshot;},removeVideoElement:function(){if(!this.video)
{return;}
if(this.video.parentNode)
{this.video.parentNode.removeChild(this.video);}
while(this.video.hasChildNodes())
{this.video.removeChild(this.video.firstChild);}
this.video.removeAttribute('autoplay');this.video.removeAttribute('src');this.video=null;},destroy:function(){this.stop();this.removeVideoElement();if(this.touchLocked)
{this.game.input.touch.removeTouchLockCallback(this.unlock,this);}
if(this._retryID)
{window.clearTimeout(this._retryID);}}};Object.defineProperty(Phaser.Video.prototype,"currentTime",{get:function(){return(this.video)?this.video.currentTime:0;},set:function(value){this.video.currentTime=value;}});Object.defineProperty(Phaser.Video.prototype,"duration",{get:function(){return(this.video)?this.video.duration:0;}});Object.defineProperty(Phaser.Video.prototype,"progress",{get:function(){return(this.video)?(this.video.currentTime / this.video.duration):0;}});Object.defineProperty(Phaser.Video.prototype,"mute",{get:function(){return this._muted;},set:function(value){value=value||null;if(value)
{if(this._muted)
{return;}
this._codeMuted=true;this.setMute();}
else
{if(!this._muted)
{return;}
this._codeMuted=false;this.unsetMute();}}});Object.defineProperty(Phaser.Video.prototype,"paused",{get:function(){return this._paused;},set:function(value){value=value||null;if(this.touchLocked)
{return;}
if(value)
{if(this._paused)
{return;}
this._codePaused=true;this.setPause();}
else
{if(!this._paused)
{return;}
this._codePaused=false;this.setResume();}}});Object.defineProperty(Phaser.Video.prototype,"volume",{get:function(){return(this.video)?this.video.volume:1;},set:function(value){if(value<0)
{value=0;}
else if(value>1)
{value=1;}
if(this.video)
{this.video.volume=value;}}});Object.defineProperty(Phaser.Video.prototype,"playbackRate",{get:function(){return(this.video)?this.video.playbackRate:1;},set:function(value){if(this.video)
{this.video.playbackRate=value;}}});Object.defineProperty(Phaser.Video.prototype,"loop",{get:function(){return(this.video)?this.video.loop:false;},set:function(value){if(value&&this.video)
{this.video.loop='loop';}
else if(this.video)
{this.video.loop='';}}});Object.defineProperty(Phaser.Video.prototype,"playing",{get:function(){return!(this.video.paused&&this.video.ended);}});Phaser.Video.prototype.constructor=Phaser.Video;if(PIXI.blendModes===undefined)
{PIXI.blendModes=Phaser.blendModes;}
if(PIXI.scaleModes===undefined)
{PIXI.scaleModes=Phaser.scaleModes;}
if(PIXI.Texture.emptyTexture===undefined)
{PIXI.Texture.emptyTexture=new PIXI.Texture(new PIXI.BaseTexture());}
if(PIXI.DisplayObject._tempMatrix===undefined)
{PIXI.DisplayObject._tempMatrix=new PIXI.Matrix();}
if(PIXI.RenderTexture.tempMatrix===undefined)
{PIXI.RenderTexture.tempMatrix=new PIXI.Matrix();}
if(PIXI.Graphics&&PIXI.Graphics.POLY===undefined)
{PIXI.Graphics.POLY=Phaser.POLYGON;PIXI.Graphics.RECT=Phaser.RECTANGLE;PIXI.Graphics.CIRC=Phaser.CIRCLE;PIXI.Graphics.ELIP=Phaser.ELLIPSE;PIXI.Graphics.RREC=Phaser.ROUNDEDRECTANGLE;}
PIXI.TextureSilentFail=true;if(typeof exports!=='undefined'){if(typeof module!=='undefined'&&module.exports){exports=module.exports=Phaser;}
exports.Phaser=Phaser;}else if(typeof define!=='undefined'&&define.amd){define('Phaser',(function(){return root.Phaser=Phaser;})());}else{root.Phaser=Phaser;}
return Phaser;}).call(this);
