var scene,renderer,camera,lon=90,lat=0,phi=0,theta=0,touchX,touchY,center,controls,effect,params,manager;
var target= new THREE.Vector3();

function init() {
    center=document.getElementById("center");
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    renderer=new THREE.CSS3DRenderer();
    renderer.setSize(innerWidth,innerHeight);
    controls=new THREE.VRControls(camera);
    controls.standing=true;
    effect=new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth,window.innerHeight);
    params = {
        hideButton: false, // Default: false.
        isUndistorted: false // Default: false.
    };
    manager = new WebVRManager(renderer, effect, params);

    var sides=[ {url: './images/px.jpg', position: [-512, 0, 0], rotation: [0, Math.PI / 2, 0]},
                {url: './images/nx.jpg', position: [512, 0, 0], rotation: [0, -Math.PI / 2, 0]},
                {url: './images/py.jpg', position: [0, 512, 0], rotation: [Math.PI / 2, 0, Math.PI]},
                {url: './images/ny.jpg', position: [0, -512, 0], rotation: [-Math.PI / 2, 0, Math.PI]},
                {url: './images/pz.jpg', position: [0, 0, 512], rotation: [0, Math.PI, 0]},
                {url: './images/nz.jpg',position: [0, 0, -512], rotation: [0, 0, 0]}];

    for (var i=0;i<sides.length;i++){
        var side=sides[i];
        var element=document.createElement("div");
        element.style.backgroundImage="url("+side.url+")";
        element.style.backgroundSize="cover";
        element.style.width="1028px";
        element.style.height="1028px";
        center.appendChild(element);
        element.id="section_"+i;
        var object=new THREE.CSS3DObject(element);
        object.position.set(side.position[0],side.position[1],side.position[2]);
        object.rotation.set(side.rotation[0],side.rotation[1],side.rotation[2]);
        scene.add(object);
    }
    center.appendChild(renderer.domElement);

    document.addEventListener("mousedown",onDocumentMouseDown,false);
    document.addEventListener("mousewheel",onDocumentMouseWheel,false);
    document.addEventListener("touchstart",onDocumentTouchStart,false);
    document.addEventListener("touchmove",onDocumentTouchMove,false);
    window.addEventListener("resize",onWindowResize,false);
    //监听
    render();
}

function render() {
    requestAnimationFrame(render);
    //lon= Math.max(-180, Math.min(180, lon));//限制固定角度内旋转
    lon += 0.1;//自动旋转
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);
    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);
    camera.lookAt(target);
    renderer.render(scene, camera);
    controls.update();
    manager.render(scene, camera, 0);
}

//窗体大小
function onWindowResize() {
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
}
function onDocumentMouseDown(event) {
    //event.preventDefault();
    document.addEventListener("mousemove",onDocumentMouseMove,false);
    document.addEventListener("mouseup",onDocumentMouseUp,false);
}
function onDocumentMouseMove(event) {
    var movementX=event.movementX;
    var movementY=event.movementY;
    lon -=movementX*0.1;
    lat +=movementY*0.1;
}
function onDocumentMouseUp(event) {
    document.removeEventListener("mousemove",onDocumentMouseMove);
    document.removeEventListener("mouseup",onDocumentMouseUp);
}
//滚轮改变焦距，后续更改为双指
function onDocumentMouseWheel(event) {
    camera.fov -=event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();
}
function onDocumentTouchStart(event) {
    //event.preventDefault(); //阻止浏览器默认行为
    var touch=event.touches[0];
    touchX=touch.screenX;
    touchY=touch.screenY;
}
function onDocumentTouchMove(event) {
    //event.preventDefault();
    var touch=event.touches[0];
    lon -=(touch.screenX-touchX)*0.1;
    lat +=(touch.screenY-touchY)*0.1;
    touchX=touch.screenX;
    touchY=touch.screenY;
}

window.onload=function (ev) {

    init();
}