precision highp float;
uniform float u_time;
uniform vec2 u_size;
uniform vec2 u_pos;

vec3 hsl2rgb(in vec3 c) { // © 2014 Inigo Quilez, MIT license, see https://www.shadertoy.com/view/lsS3Wc
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {

    vec2 scale = u_size / vec2(500, 500);
    vec2 uv = gl_FragCoord.xy / u_size;
    vec2 coord = uv * scale - scale / 2.0;
    float f = u_time;
    vec3 p = vec3(coord, 0.0);

    for(float i = 0.0; i < length(u_pos) * 40.0; i++) {
        f += 0.5 / length(p);
        p = abs(p) / dot(p, p) - (0.4 + sin(u_time / 10.) / 20.0);
    }

    vec3 hsl = vec3(sin(f), 0.5, 0.5);
    gl_FragColor = vec4(hsl2rgb(hsl), 1);
}
