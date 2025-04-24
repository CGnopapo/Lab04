
/* ==================================================
    lab04.js

    Autores:

    NUSP - Nome:
    NUSP - Nome:
    NUSP - Nome:

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
// constantes globais usadas na geração do vídeo

const FUNDO = [0.50, 0.50, 0.50, 1.0];

// as cores são replicadas para os demais vertices do cubo como uma lista circular
const COR0 = [vec4(1,1,0,1), vec4(0,0,1,0)];  // do eixo central
const COR1 = [vec4[1,0,0,1]];  // R
const COR2 = [vec4[0,1,0,1]];  // G
const COR3 = [vec4[0,0,1,1]];  // B
"use strict";

// ==================================================================
// constantes globais




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
    vista: mat4(),     // view matrix, inicialmente identidade
    perspectiva: mat4(), // projection matrix
}

// vértices e cores da esfera
var gaPosicoes = [];
var gaCores = [];

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

    // interface
    crieInterface();

    // Crie objetos aqui
    gObjetos.push(new Cubo(vec3(0.0, 0.0, 0.0), vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0),
        vec3(0,0,0), vec3(2,0,0)));



    // Inicializações feitas apenas 1 vez
    gl.viewport(0, 0, gCanvas.width, gCanvas.height);
    gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);
    gl.enable(gl.DEPTH_TEST);

    // shaders
    crieShaders();

    // finalmente...
    render();
};

// ==================================================================
/**
 * Cria e configura os elementos da interface e funções de callback
 */
function crieInterface() {
    document.getElementById("xButton").onclick = function () {
        gCtx.axis = EIXO_X;
    };
    document.getElementById("yButton").onclick = function () {
        gCtx.axis = EIXO_Y;
    };
    document.getElementById("zButton").onclick = function () {
        gCtx.axis = EIXO_Z;
    };
    document.getElementById("pButton").onclick = function () {
        gCtx.pause = !gCtx.pause;
    };
};

// ==================================================================
/**
 * cria e configura os shaders
 */
function crieShaders() {
    //  cria o programa
    gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
    gl.useProgram(gShader.program);

    // buffer dos vértices
    var bufVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gaPosicoes), gl.STATIC_DRAW);

    var aPosition = gl.getAttribLocation(gShader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // buffer das cores
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
    let eye = vec3(10, 10, 10);
    let at = vec3(0, 0, 0);
    let up = vec3(0, 1, 0);
    gCtx.vista = lookAt(eye, at, up);
};

// ==================================================================
/**
 * Usa o shader para desenhar.
 * Assume que os dados já foram carregados e são estáticos.
 */
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);


    if (!gCtx.pause){
        let num_vertices_ate_agr=0;
        for (let i = 0; i < gObjetos.length; i++) {

            gObjetos[i].atualiza_model(1)
            gl.uniformMatrix4fv(gShader.uModelView, false, flatten(gObjetos[i].model));
            console.log(gObjetos[i].num_vertices)
            gl.drawArrays(gl.TRIANGLES, num_vertices_ate_agr, gObjetos[i].num_vertices);
            num_vertices_ate_agr += gObjetos[i].num_vertices;

        }
    }



    window.requestAnimationFrame(render);
};

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

/* ==================================================================
    Funções para criar uma esfera de raio unitário centrada na origem.
*/
function Cubo(translacao, rotacao, escala, vel_trans,vel_rota) {
    this.translacao = translacao;
    this.rotacao = rotacao;
    this.escala = escala;
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

    let cores = [
        vec4(0.0, 0.0, 0.0, 1.0), // preto
        vec4(1.0, 0.0, 0.0, 1.0), // vermelho
        vec4(1.0, 1.0, 0.0, 1.0), // amarelo
        vec4(0.0, 1.0, 0.0, 1.0), // verde
        vec4(0.0, 0.0, 1.0, 1.0), // azul
        vec4(1.0, 0.0, 1.0, 1.0), // magenta
        vec4(1.0, 1.0, 1.0, 1.0), // branco
        vec4(0.0, 1.0, 1.0, 1.0)  // ciano
    ];

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




function Esfera(translacao, rotacao,escala,vel_trans,vel_rota) {

    this.translacao = translacao;
    this.rotacao = rotacao;
    this.escala = escala;
    this.vel_trans = vel_trans;
    this.vel_rota = vel_rota;

    let S = scale(escala[0],escala[1],escala[2]);
    let rx = rotateX(rotacao[0]);
    let ry = rotateY(rotacao[1]);
    let rz = rotateZ(rotacao[2]);
    let R = mult(rz, mult(ry, rx));
    let T = translate(translacao[0],translacao[1],translacao[2]);

    this.model = mult(T, mult(R, S));
    this.num_vertices=0;
    crieEsfera(2,this)

    this.atualiza_model = function(delta){

        this.translacao = add(this.translacao, mult(delta, this.vel_trans));

        this.rotacao = add(this.rotacao, mult(delta, this.vel_rota));

        let S = scale(escala[0], escala[1], escala[2]);
        let rx = rotateX(rotacao[0]);
        let ry = rotateY(rotacao[1]);
        let rz = rotateZ(rotacao[2]);
        let R = mult(rz, mult(ry, rx));
        let T = translate(translacao[0], translacao[1], translacao[2]);
        this.model = mult(T, mult(R, S));


    }
}

function crieEsfera(ndivisoes = 2,objeto){
    let vp = [
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0),
    ];

    let vn = [
        vec3(-1.0, 0.0, 0.0),
        vec3(0.0, -1.0, 0.0),
        vec3(0.0, 0.0, -1.0),
    ];

    let triangulo = [
        [vp[0], vp[1], vp[2]],
        [vp[0], vp[1], vn[2]],

        [vp[0], vn[1], vp[2]],
        [vp[0], vn[1], vn[2]],

        [vn[0], vp[1], vp[2]],
        [vn[0], vp[1], vn[2]],

        [vn[0], vn[1], vp[2]],
        [vn[0], vn[1], vn[2]],
    ];

    for (let i = 0; i < triangulo.length; i++) {
        let a, b, c;
        [a, b, c] = triangulo[i];
        dividaTriangulo(a, b, c, ndivisoes,objeto);
    }
};

function dividaTriangulo(a, b, c, ndivs,objeto) {
    // Cada nível quebra um triângulo em 4 subtriângulos
    // a, b, c em ordem mão direita
    //    c
    // a  b

    // caso base
    if (ndivs > 0) {
        let ab = mix(a, b, 0.5);
        let bc = mix(b, c, 0.5);
        let ca = mix(c, a, 0.5);

        ab = normalize(ab);
        bc = normalize(bc);
        ca = normalize(ca);

        dividaTriangulo(a, ab, ca, ndivs - 1,objeto);
        dividaTriangulo(b, bc, ab, ndivs - 1,objeto);
        dividaTriangulo(c, ca, bc, ndivs - 1,objeto);
        dividaTriangulo(ab, bc, ca, ndivs - 1,objeto);
    }

    else {
        insiraTriangulo(a, b, c,objeto);
    }
};

function insiraTriangulo(a, b, c,objeto) {

    gaPosicoes.push(a);
    gaPosicoes.push(b);
    gaPosicoes.push(c);
    objeto.num_vertices = objeto.num_vertices+3;
    let cor = COR_ESFERA;

    if (!COR_SOLIDA) cor = sorteieCorRGBA();
    gaCores.push(cor);
    if (!COR_SOLIDA) cor = sorteieCorRGBA();
    gaCores.push(cor);
    if (!COR_SOLIDA) cor = sorteieCorRGBA();
    gaCores.push(cor);
}
