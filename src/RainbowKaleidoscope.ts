import * as THREE from "three";

export default class App {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  cube: THREE.Mesh;
  material: THREE.ShaderMaterial;
  time: number;
  zoomIn: boolean;
  nexPosition: THREE.Vec2;

  constructor() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const width = (canvas.width = 500);
    const height = (canvas.height = 500);

    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.time = 0.01;

    const plane = new THREE.PlaneGeometry(2, 2);
    const fragmentShader = `
    precision highp float;

    uniform float u_time;
    
    vec3 hsl2rgb( in vec3 c ) { // © 2014 Inigo Quilez, MIT license, see https://www.shadertoy.com/view/lsS3Wc
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
    #define rotate(angle) mat2(cos(angle),-sin(angle), sin(angle),cos(angle));


    void main()
    {

      vec2 uv = gl_FragCoord.xy / vec2(500,500);
      vec2 coord = uv * 2.0 - 1.0;
      float f = u_time;
      vec3 p = vec3(coord, 0.0);

      for (float i = 0.0; i < 9.0; i++)
      {
          f += 0.5 / length(p);
          p = abs(p) / dot(p,p) - (0.4 + sin(u_time/10.) / 20.0);
      }

      vec3 hsl = vec3(sin(f), 0.5, 0.5);
      gl_FragColor = vec4(hsl2rgb(hsl), 1);
  }

`;

    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
      },
    });

    this.cube = new THREE.Mesh(plane, this.material);
    this.scene.add(this.cube);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 1;
  }

  Start() {
    this.running = true;
    this.tick();
  }

  Stop() {
    this.running = false;
  }

  running: boolean;

  tick() {
    if (!this.running) return;
    this.material.uniforms.u_time.value += 0.01;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame((n) => this.tick());
  }
}
