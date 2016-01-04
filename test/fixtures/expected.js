"use strict";

var str = "hello";
console.log(str);

console.log("#define GLSLIFY 1\nhighp float random(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\nvoid main () {\n  gl_Position = vec4(vec3(1.,1.,1.), 1.0);\n}");
console.log(function () {
  console.log("Testing es2015");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjdHVhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQTtBQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUdoQixPQUFPLENBQUMsR0FBRyxDQUFDLGtVQUFrVSxDQUFDLENBQUE7QUFDL1UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQUUsU0FBTyxDQUFDLEdBQUcsa0JBQWtCLENBQUE7Q0FBRSxDQUFDLENBQUEiLCJmaWxlIjoiYWN0dWFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgc3RyID0gXCJoZWxsb1wiXG5jb25zb2xlLmxvZyhzdHIpXG5cblxuY29uc29sZS5sb2coXCIjZGVmaW5lIEdMU0xJRlkgMVxcbmhpZ2hwIGZsb2F0IHJhbmRvbSh2ZWMyIGNvKVxcbntcXG4gICAgaGlnaHAgZmxvYXQgYSA9IDEyLjk4OTg7XFxuICAgIGhpZ2hwIGZsb2F0IGIgPSA3OC4yMzM7XFxuICAgIGhpZ2hwIGZsb2F0IGMgPSA0Mzc1OC41NDUzO1xcbiAgICBoaWdocCBmbG9hdCBkdD0gZG90KGNvLnh5ICx2ZWMyKGEsYikpO1xcbiAgICBoaWdocCBmbG9hdCBzbj0gbW9kKGR0LDMuMTQpO1xcbiAgICByZXR1cm4gZnJhY3Qoc2luKHNuKSAqIGMpO1xcbn1cXG5cXG52b2lkIG1haW4gKCkge1xcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KHZlYzMoMS4sMS4sMS4pLCAxLjApO1xcbn1cIilcbmNvbnNvbGUubG9nKCgpID0+IHsgY29uc29sZS5sb2coYFRlc3RpbmcgZXMyMDE1YCkgfSlcbiJdfQ==