// Galaxy.js - WebGL Galaxy Background using OGL
// Converted from React component to vanilla JS

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

// Simple OGL classes for vanilla JS
class Renderer {
    constructor(options = {}) {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl', options);
        this.gl = gl;
        this.canvas = canvas;
    }

    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    render({ scene }) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        scene.draw();
    }
}

class Program {
    constructor(gl, { vertex, fragment, uniforms }) {
        this.gl = gl;
        this.uniforms = uniforms || {};
        
        const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex);
        const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment);
        
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(this.program));
        }
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    use() {
        this.gl.useProgram(this.program);
        
        // Set uniforms
        for (const [name, uniform] of Object.entries(this.uniforms)) {
            const location = this.gl.getUniformLocation(this.program, name);
            if (location === null) continue;
            
            const value = uniform.value;
            if (typeof value === 'number') {
                this.gl.uniform1f(location, value);
            } else if (typeof value === 'boolean') {
                this.gl.uniform1i(location, value ? 1 : 0);
            } else if (value.length === 2) {
                this.gl.uniform2fv(location, value);
            } else if (value.length === 3 || (value.r !== undefined)) {
                this.gl.uniform3f(location, value.r || value[0], value.g || value[1], value.b || value[2]);
            }
        }
    }
}

class Triangle {
    constructor(gl) {
        this.gl = gl;
        const vertices = new Float32Array([
            -1, -1,  0, 0,
             3, -1,  2, 0,
            -1,  3,  0, 2
        ]);
        
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    }
}

class Mesh {
    constructor(gl, { geometry, program }) {
        this.gl = gl;
        this.geometry = geometry;
        this.program = program;
    }

    draw() {
        const gl = this.gl;
        this.program.use();
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);
        
        const posLoc = gl.getAttribLocation(this.program.program, 'position');
        const uvLoc = gl.getAttribLocation(this.program.program, 'uv');
        
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
        
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

// Galaxy class
class Galaxy {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            focal: options.focal || [0.5, 0.5],
            rotation: options.rotation || [1.0, 0.0],
            starSpeed: options.starSpeed || 0.5,
            density: options.density || 1,
            hueShift: options.hueShift || 140,
            speed: options.speed || 1.0,
            mouseInteraction: options.mouseInteraction !== undefined ? options.mouseInteraction : true,
            glowIntensity: options.glowIntensity || 0.3,
            saturation: options.saturation || 0.0,
            mouseRepulsion: options.mouseRepulsion !== undefined ? options.mouseRepulsion : true,
            repulsionStrength: options.repulsionStrength || 2,
            twinkleIntensity: options.twinkleIntensity || 0.3,
            rotationSpeed: options.rotationSpeed || 0.1,
            autoCenterRepulsion: options.autoCenterRepulsion || 0,
            transparent: options.transparent !== undefined ? options.transparent : false
        };

        this.targetMousePos = { x: 0.5, y: 0.5 };
        this.smoothMousePos = { x: 0.5, y: 0.5 };
        this.targetMouseActive = 0.0;
        this.smoothMouseActive = 0.0;

        this.init();
    }

    init() {
        const renderer = new Renderer({ 
            alpha: this.options.transparent,
            premultipliedAlpha: false 
        });
        const gl = renderer.gl;
        this.gl = gl;
        this.renderer = renderer;

        if (this.options.transparent) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 0, 0, 0);
        } else {
            gl.clearColor(0, 0, 0, 1);
        }

        this.resize();
        window.addEventListener('resize', () => this.resize());

        const geometry = new Triangle(gl);
        this.program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: {
                    value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
                },
                uFocal: { value: new Float32Array(this.options.focal) },
                uRotation: { value: new Float32Array(this.options.rotation) },
                uStarSpeed: { value: this.options.starSpeed },
                uDensity: { value: this.options.density },
                uHueShift: { value: this.options.hueShift },
                uSpeed: { value: this.options.speed },
                uMouse: { value: new Float32Array([0.5, 0.5]) },
                uGlowIntensity: { value: this.options.glowIntensity },
                uSaturation: { value: this.options.saturation },
                uMouseRepulsion: { value: this.options.mouseRepulsion },
                uTwinkleIntensity: { value: this.options.twinkleIntensity },
                uRotationSpeed: { value: this.options.rotationSpeed },
                uRepulsionStrength: { value: this.options.repulsionStrength },
                uMouseActiveFactor: { value: 0.0 },
                uAutoCenterRepulsion: { value: this.options.autoCenterRepulsion },
                uTransparent: { value: this.options.transparent }
            }
        });

        this.mesh = new Mesh(gl, { geometry, program: this.program });

        if (this.options.mouseInteraction) {
            this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        }

        this.container.appendChild(gl.canvas);
        this.animate();
    }

    resize() {
        const scale = 1;
        this.renderer.setSize(
            this.container.offsetWidth * scale,
            this.container.offsetHeight * scale
        );
        if (this.program) {
            this.program.uniforms.uResolution.value = new Color(
                this.gl.canvas.width,
                this.gl.canvas.height,
                this.gl.canvas.width / this.gl.canvas.height
            );
        }
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        this.targetMousePos = { x, y };
        this.targetMouseActive = 1.0;
    }

    handleMouseLeave() {
        this.targetMouseActive = 0.0;
    }

    animate(t = 0) {
        requestAnimationFrame((time) => this.animate(time));

        this.program.uniforms.uTime.value = t * 0.001;
        this.program.uniforms.uStarSpeed.value = (t * 0.001 * this.options.starSpeed) / 10.0;

        const lerpFactor = 0.05;
        this.smoothMousePos.x += (this.targetMousePos.x - this.smoothMousePos.x) * lerpFactor;
        this.smoothMousePos.y += (this.targetMousePos.y - this.smoothMousePos.y) * lerpFactor;
        this.smoothMouseActive += (this.targetMouseActive - this.smoothMouseActive) * lerpFactor;

        this.program.uniforms.uMouse.value[0] = this.smoothMousePos.x;
        this.program.uniforms.uMouse.value[1] = this.smoothMousePos.y;
        this.program.uniforms.uMouseActiveFactor.value = this.smoothMouseActive;

        this.renderer.render({ scene: this.mesh });
    }
}

// Initialize Galaxy on element
if (typeof window !== 'undefined') {
    window.Galaxy = Galaxy;
    window.initGalaxy = function(elementId, options) {
        const container = document.getElementById(elementId);
        if (container) {
            return new Galaxy(container, options);
        }
    };
}
