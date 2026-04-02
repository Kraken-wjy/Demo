'use client'
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

#define R iResolution.xy
#define N normalize
#define v2 vec2
#define v3 vec3
#define v4 vec4

const float pi = acos(-1.);

vec4 h4(vec4 X) {
    uvec4 x = uvec4(abs(X + 1e4) * 1e5);
    x = ((x >> 16U) ^ x.yzwx) * 11111111U;
    x = ((x >> 16U) ^ x.yzwx) * 11111111U;
    x = ((x >> 16U) ^ x.yzwx) * 11111111U;
    x = ((x >> 16U) ^ x.yzwx) * 11111111U;
    return vec4(x) / float(0xffffffffU);
}

float s(vec3 p, vec3 a) {
    p = fract(p) - 0.5;
    p = a * dot(p, a) - cross(a, p);
    return length(vec2(p.z, max(0., length(max(vec2(0), abs(p.xy) - vec2(.2, .3))) - .06))) - .01;
}

void main() {
    vec2 F = vUv * iResolution;
    F = (F + F - R) / R.y;
    vec3 t = N(vec3(F, 1.));
    vec3 sp = vec3(0, 0, iTime);
    vec3 p = t / (max(abs(t.x), abs(t.y)) + 1e-4) + sp;
    vec3 D, o;

    for (int d = 0; d < 30; d++) {
        o = N(mix(h4(vec4(floor(p), floor(iTime))).xyz,
                  h4(vec4(floor(p), floor(iTime + 1.))).xyz,
                  fract(iTime)) - 0.5);
        D = (step(0., t) - fract(p)) / t;
        float S = s(p, o);
        p += t * (min(S, 1e-4 + min(D.z, min(D.x, D.y))));
    }

    vec4 O = vec4(1);
    vec3 P = o * dot(fract(p) - 0.5, o) - cross(o, fract(p) - 0.5);
    vec2 U = P.xy;
    float l = length(max(vec2(0), abs(U) - vec2(.2, .3)));

    if (P.z < 0.) {
        O.gb -= smoothstep(.025, 0., l == 0. ? mod(dot(vec2(1), floor(U * 50.)), 2.) : abs(l - .03));
    } else {
        vec4 H = h4(floor(vec4(p, iTime)));
        int n = int(H.x * 4.) % 4;
        float d = 1e4;

        if (n == 0) {
            d = length(vec2(abs(U.x), U.y) - 0.5 * min(abs(U.x) + U.y, .1));
            O.gb -= step(d, .05);
        } else if (n == 1) {
            O.gb -= step(abs(U.x) + abs(U.y), .08);
        } else if (n == 2) {
            d = length(vec2(abs(U.x), -U.y) - 0.5 * min(abs(U.x) - U.y, .1));
            d = min(d, length(vec2(max(0., abs(U.x) - .05), U.y + .12)) + .03);
            d = min(d, length(vec2(max(0., abs(U.y + .05) - .05), U.x)) + .03);
            O -= step(d, .05);
        } else {
            d = length(vec2(abs(U.x) - .05, U.y));
            d = min(d, length(vec2(abs(U.x), U.y - .075)));
            d = min(d, length(vec2(max(0., abs(U.y + .05) - .05), U.x)) + .03);
            O -= step(d, .05);
        }
    }

    O *= exp(-.4 * length(sp - p));
    gl_FragColor = O;
}
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { size, viewport } = useThree()

  const uniforms = useRef({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(size.width, size.height) }
  })

  useEffect(() => {
    uniforms.current.iResolution.value.set(size.width, size.height)
  }, [size])

  useFrame((state) => {
    uniforms.current.iTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export default function FloatingCards3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      style={{ position: 'absolute', width: '100%', height: '100%' }}
      gl={{ antialias: false }}
    >
      <ShaderPlane />
    </Canvas>
  )
}
