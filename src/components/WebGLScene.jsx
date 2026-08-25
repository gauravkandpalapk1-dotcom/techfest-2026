import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLScene() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, .1, 100);
    camera.position.set(0,0,14);

    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000,0);
    el.appendChild(renderer.domElement);

    const count = window.innerWidth < 700 ? 420 : 850;
    const positions = new Float32Array(count*3);
    const colors = new Float32Array(count*3);
    const velocities = new Float32Array(count*3);
    const palette = [
      new THREE.Color('#00e5ff'),
      new THREE.Color('#8b5cf6'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#f59e0b')
    ];

    for(let i=0;i<count;i++){
      positions[i*3]=(Math.random()-.5)*20;
      positions[i*3+1]=(Math.random()-.5)*13;
      positions[i*3+2]=(Math.random()-.5)*12;
      velocities[i*3]=(Math.random()-.5)*.0015;
      velocities[i*3+1]=(Math.random()-.5)*.0015;
      velocities[i*3+2]=(Math.random()-.5)*.001;
      const a = palette[Math.floor(Math.random() * palette.length)];
      const b = palette[Math.floor(Math.random() * palette.length)];
      const c = a.clone().lerp(b, Math.random() * 0.55);
      colors.set([c.r,c.g,c.b],i*3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const mat = new THREE.PointsMaterial({size:.055,vertexColors:true,transparent:true,opacity:.65,blending:THREE.AdditiveBlending});
    const points = new THREE.Points(geo,mat);
    scene.add(points);

    const ring = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.8,.018,160,10),
      new THREE.MeshBasicMaterial({color:'#8b5cf6',wireframe:true,transparent:true,opacity:.18})
    );
    ring.rotation.x=.9;
    scene.add(ring);

    // Secondary warm ring adds depth to the aurora palette without
    // overwhelming the HTML content.
    const warmRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.65,.012,24,160),
      new THREE.MeshBasicMaterial({color:'#f59e0b',wireframe:true,transparent:true,opacity:.12})
    );
    warmRing.rotation.set(.55,-.35,.25);
    scene.add(warmRing);

    const mouse={x:0,y:0};
    const onMove=(e)=>{
      mouse.x=(e.clientX/window.innerWidth-.5)*2;
      mouse.y=(e.clientY/window.innerHeight-.5)*-2;
    };
    window.addEventListener('mousemove',onMove);

    const clock=new THREE.Clock();
    let frame;
    const animate=()=>{
      frame=requestAnimationFrame(animate);
      const t=clock.getElapsedTime();
      points.rotation.y=t*.018+mouse.x*.025;
      points.rotation.x=mouse.y*.02;
      ring.rotation.z=t*.12;
      ring.rotation.y=t*.08+mouse.x*.18;
      renderer.render(scene,camera);
    };
    animate();

    const resize=()=>{
      const w=el.clientWidth,h=el.clientHeight;
      camera.aspect=w/h; camera.updateProjectionMatrix();
      renderer.setSize(w,h);
    };
    const ro=new ResizeObserver(resize);
    ro.observe(el);

    return ()=>{
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('mousemove',onMove);
      geo.dispose(); mat.dispose();
      ring.geometry.dispose(); ring.material.dispose();
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  },[]);

  return <div ref={mount} className="webgl-scene" aria-hidden="true" />;
}
