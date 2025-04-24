/* ==================================================
    lab04.js

    Autores:

    NUSP - Nome: 13653559 - Francisco de Castro Leal Henriques
    NUSP - Nome: 11795381 - Gabriela Victor
    NUSP - Nome: 11796260 - Andre Luiz Batista Bueno

    Ao preencher esse cabeçalho com os nomes e número USP dos participantes,
    declaramos que todas as partes originais desse exercício programa (EP)
    foram desenvolvidas e implementadas por nosso time e que portanto não
    constituem desonestidade acadêmica ou plágio.

    Declaramos também que somos responsáveis por todas as cópias desse
    programa e que não distribuímos ou facilitamos a sua distribuição.
    Estamos cientes que os casos de plágio e desonestidade acadêmica
    serão tratados segundo os critérios divulgados na página da
    disciplina.
    Entendemos que EPs sem assinatura devem receber nota zero e, ainda
    assim, poderão ser punidos por desonestidade acadêmica.

================================================== */
/**
 * Esqueleto de um programa usando WegGL
 * Dessa vez usando as bibliotecas
 * macWebglUtils.js
 * MVnew.js do livro do Angel -- Interactive Computer Graphics
 */
"use strict";

// ==================================================================
// constantes globais

const FUNDO = [0.0, 0.0, 0.0, 1.0];
const EIXO_X = 0;
const EIXO_Y = 1;
const EIXO_Z = 2;
const RADIUS = 1.0;

const RED = [
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
    ];

const GREEN = [
        vec4(0.0, 1.0, 0.0, 1.0), // verde
        vec4(0.0, 1.0, 0.0, 1.0), // verde
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
];

const BLUE = [
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
];

const BLUE_AND_YELLOW = [
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
        vec4(1.0, 1.0, 0.0, 1.0),
];

// ==================================================================
// variáveis globais
var gl;
var gCanvas;
var gShader = {};  // encapsula globais do shader

// Os códigos fonte dos shaders serão descritos em
// strings para serem compilados e passados a GPU
var gVertexShaderSrc;
var gFragmentShaderSrc;

// guarda dados da interface e contexto do desenho
var gCtx = {
  axis: 0,   // eixo rodando
  theta: [0, 0, 0],  // angulos por eixo
  pause: false,        //
  numV: 36,          // número de vertices
  vista: mat4(),     // view matrix, inicialmente identidade
  perspectiva: mat4(), // projection matrix
}

var gCamera = {
  eye: vec3(2.75, 2.75, 2.75),
  at: vec3(0, 0, 0),
  up: vec3(0, 1, 0),
  vang: 0,
  hang: 0,
}

// posições dos 8 vértices de um cubo de lado 1
// centrado na origem
var gaPosicoes = [
  vec3(-0.5, -0.5, 0.5),
  vec3(-0.5, 0.5, 0.5),
  vec3(0.5, 0.5, 0.5),
  vec3(0.5, -0.5, 0.5),
  vec3(-0.5, -0.5, -0.5),
  vec3(-0.5, 0.5, -0.5),
  vec3(0.5, 0.5, -0.5),
  vec3(0.5, -0.5, -0.5)
];

// cores associadas a cada vértice
var gaCores = [
  // vec4(0.0, 0.0, 0.0, 1.0),  // black
  // vec4(1.0, 0.0, 0.0, 1.0),  // red
  // vec4(1.0, 1.0, 0.0, 1.0),  // yellow
  // vec4(0.0, 1.0, 0.0, 1.0),  // green
  // vec4(0.0, 0.0, 1.0, 1.0),  // blue
  // vec4(1.0, 0.0, 1.0, 1.0),  // magenta
  // vec4(1.0, 1.0, 1.0, 1.0),  // white
  // vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

// indices para cada um dos 12 triângulos, 2 por face, que definem o cubo.

var gaIndices = [
  1, 0, 3,
  3, 2, 1,
  2, 3, 7,
  7, 6, 2,
  3, 0, 4,
  4, 7, 3,
  6, 5, 1,
  1, 2, 6,
  4, 5, 6,
  6, 7, 4,
  5, 4, 0,
  0, 1, 5
];

var gObjetos = [];

// ==================================================================
// chama a main quando terminar de carregar a janela
window.onload = main;

/**
 * programa principal.
 */
function main() {
  // ambiente
  gCanvas = document.getElementById("glcanvas");
  gl = gCanvas.getContext('webgl2');
  if (!gl) alert("Vixe! Não achei WebGL 2.0 aqui :-(");

  console.log("Canvas: ", gCanvas.width, gCanvas.height);

  crieInterface();

  gObjetos.push(new Cubo(vec3(0.0, 0.0, 0.0), vec3(0.0,0.0,0.0), vec3(0.2, 1.5, 0.2), RED,
      vec3(0,0,0), vec3(0,2,0)));
  gObjetos.push(new Cubo(vec3(0.5, 0, 0.5), vec3(0.0,0.0,0.0),  vec3(0.25, 0.25, 0.25),GREEN,
                         vec3(0, 0, 0), vec3(0, 2, 0)));
  gObjetos.push(new Cubo(vec3(0.5, 0, -0.5), vec3(0.0,0.0,0.0),  vec3(0.25, 0.25, 0.25),BLUE,
                         vec3(0, 0, 0), vec3(0, 2, 0)));
  gObjetos.push(new Cubo(vec3(-0.5, 0, -0.5), vec3(0.0,0.0,0.0),  vec3(0.25, 0.25, 0.25),BLUE,
                         vec3(0, 0, 0), vec3(0, 2, 0)));

      // console.log(gaCores);
  // Inicializações feitas apenas 1 vez
  gl.viewport(0, 0, gCanvas.width, gCanvas.height);
  gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);
  gl.enable(gl.DEPTH_TEST);

  // shaders
  crieShaders();

  // finalmente...
  render();
}

// ==================================================================
/**
 * Cria e configura os elementos da interface e funções de callback
 */
function crieInterface() {
  window.onkeydown = moveCamera;

}


function moveCamera(e) {
  console.log(e.key);
  switch(e.key) {
    case "ArrowUp":
      gCamera.vang += 10;
      if (gCamera.vang > 90) gCamera.vang = 90
      break;
    case "ArrowDown":
      gCamera.vang -= 10;
      if (gCamera.vang < -90) gCamera.vang = -90
      break;
    case "ArrowLeft":
      gCamera.hang -= 10;
      if (gCamera.hang < -180) gCamera.hang = -180
      break;
    case "ArrowRight":
      gCamera.hang += 10;
      if (gCamera.hang > 180) gCamera.hang = 180
      break;
  }
  console.log(gCamera.vang + " " + gCamera.hang);
  gCamera.eye = vec3(Math.sin(gCamera.hang * Math.PI/360), Math.sin(gCamera.vang * Math.PI/360) * RADIUS, Math.cos(gCamera.hang * Math.PI/360))
  gCtx.vista = lookAt(gCamera.eye, gCamera.at, gCamera.up);
}

// ==================================================================
/**
 * cria e configura os shaders
 */
function crieShaders() {
  //  cria o programa
  gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
  gl.useProgram(gShader.program);

  const cube1_vao = gl.createVertexArray();
  const cube2_vao = gl.createVertexArray();
  const cube3_vao = gl.createVertexArray();
  const cube4_vao = gl.createVertexArray();

  gl.bindVertexArray(cube1_vao);



  gl.bindVertexArray(cube2_vao);
  gl.bindVertexArray(cube3_vao);
  gl.bindVertexArray(cube4_vao);

  // buffer dos índices dos vértices
  var bufIndices = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufIndices);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(gaIndices), gl.STATIC_DRAW);

  // buffer dos vértices
  var bufVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(gaPosicoes), gl.STATIC_DRAW);

  var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  // buffer de cores
  var bufCores = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufCores);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(gaCores), gl.STATIC_DRAW);

  var aColor = gl.getAttribLocation(gShader.program, "aColor");
  gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aColor);

  // resolve os uniforms
  gShader.uModelView = gl.getUniformLocation(gShader.program, "uModelView");
  gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");

  // calcula a matriz de transformação perpectiva (fovy, aspect, near, far)
  // que é feita apenas 1 vez
  gCtx.perspectiva = perspective(60, 1, 0.1, 5);
  gl.uniformMatrix4fv(gShader.uPerspective, false, flatten(gCtx.perspectiva));

  // calcula a matriz de transformação da camera, apenas 1 vez
  gCtx.vista = lookAt(gCamera.eye, gCamera.at, gCamera.up);
};

// ==================================================================
/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function render() {
  // gaCores = [];
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // modelo muda a cada frame da animação
  // if (!gCtx.pause) gCtx.theta[gCtx.axis] += 2.0;

  // let rx = rotateX(gCtx.theta[EIXO_X]);
  // let ry = rotateY(gCtx.theta[EIXO_Y]);
  // let rz = rotateZ(gCtx.theta[EIXO_Z]);
  // let model = mult(rz, mult(ry, rx));

  if (gCtx.pause) return;

  let num_vertices_ate_agr=0;

  for (let i = 0; i < gObjetos.length; i++) {

      gObjetos[i].atualiza_model(1)
      gl.uniformMatrix4fv(gShader.uModelView, false, flatten(mult(gCtx.vista, gObjetos[i].model)));
    // gaCores.push(gObjetos[i].cor);
    gaCores = gObjetos[i].cores;
    gl.drawElements(gl.TRIANGLES, gObjetos[i].num_vertices, gl.UNSIGNED_BYTE, 0);
      num_vertices_ate_agr += gObjetos[i].num_vertices;

  }
  // gl.uniformMatrix4fv(gShader.uModelView, false, flatten(mult(gCtx.vista, model)));
  // gl.drawElements(gl.TRIANGLES, gCtx.numV, gl.UNSIGNED_BYTE, 0);

  window.requestAnimationFrame(render);
}
// ========================================================
// Código fonte dos shaders em GLSL
// a primeira linha deve conter "#version 300 es"
// para WebGL 2.0

gVertexShaderSrc = `#version 300 es

// aPosition é um buffer de entrada
in vec3 aPosition;
uniform mat4 uModelView;
uniform mat4 uPerspective;

in vec4 aColor;  // buffer com a cor de cada vértice
out vec4 vColor; // varying -> passado ao fShader

void main() {
    gl_Position = uPerspective * uModelView * vec4(aPosition, 1);
    vColor = aColor;
}
`;

gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec4 vColor;
out vec4 outColor;

void main() {
  outColor = vColor;
}
`;

function Cubo(translacao, rotacao, escala, cor, vel_trans, vel_rota) {
    this.translacao = translacao;
    this.rotacao = rotacao;
    this.escala = escala;
  this.cor = cor;
    this.vel_trans = vel_trans;
    this.vel_rota = vel_rota;
    let S = scale(escala[0], escala[1], escala[2]);
    let rx = rotateX(rotacao[0]);
    let ry = rotateY(rotacao[1]);
    let rz = rotateZ(rotacao[2]);
    let R = mult(rz, mult(ry, rx));
    let T = translate(translacao[0], translacao[1], translacao[2]);

    this.model = mult(T, mult(R, S));
    this.num_vertices = 0;
    crie_cubo(this)

    this.atualiza_model = function(delta){

        this.translacao = add(this.translacao, mult(delta, this.vel_trans));

        this.rotacao = add(this.rotacao, mult(delta, this.vel_rota));

        let S = scale(this.escala[0], this.escala[1], this.escala[2]);
        let rx = rotateX(this.rotacao[0]);
        let ry = rotateY(this.rotacao[1]);
        let rz = rotateZ(this.rotacao[2]);
        let R = mult(rz, mult(ry, rx));
        let T = translate(this.translacao[0], this.translacao[1], this.translacao[2]);
        this.model = mult(T, mult(R, S));


    }
}
function crie_cubo(objeto) {
    let vertices = [
        vec3(-0.5, -0.5, 0.5),  // 0
        vec3(-0.5,  0.5, 0.5),  // 1
        vec3( 0.5,  0.5, 0.5),  // 2
        vec3( 0.5, -0.5, 0.5),  // 3
        vec3(-0.5, -0.5, -0.5), // 4
        vec3(-0.5,  0.5, -0.5), // 5
        vec3( 0.5,  0.5, -0.5), // 6
        vec3( 0.5, -0.5, -0.5)  // 7
    ];

    // let cores = [
    //     vec4(0.0, 0.0, 0.0, 1.0), preto
    //     vec4(1.0, 0.0, 0.0, 1.0), vermelho
    //     vec4(1.0, 1.0, 0.0, 1.0), amarelo
    //     vec4(0.0, 1.0, 0.0, 1.0), // verde
    //     vec4(0.0, 0.0, 1.0, 1.0), azul
    //     vec4(1.0, 0.0, 1.0, 1.0), magenta
    //     vec4(1.0, 1.0, 1.0, 1.0), branco
    //     vec4(0.0, 1.0, 1.0, 1.0)  ciano
    // ];
  let cores = objeto.cor;

    let indices = [
        1, 0, 3,  3, 2, 1,  // frente
        2, 3, 7,  7, 6, 2,  // direita
        3, 0, 4,  4, 7, 3,  // baixo
        6, 5, 1,  1, 2, 6,  // cima
        4, 5, 6,  6, 7, 4,  // trás
        5, 4, 0,  0, 1, 5   // esquerda
    ];

    for (let i = 0; i < indices.length; i++) {
        let idx = indices[i];
        gaPosicoes.push(vertices[idx]);
        gaCores.push(cores[idx]);
    }

    objeto.num_vertices = indices.length;
};
