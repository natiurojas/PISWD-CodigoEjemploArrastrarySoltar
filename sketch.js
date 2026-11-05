// ============================================================
// Arrastrar y soltar VARIOS objetos con p5.js
// ============================================================

let imgH;              // Imagen que van a compartir todos los personajes
let personajes = [];   // Array donde se guardan TODOS los objetos de la clase simp
let arrastrado = null; // Referencia al personaje que se está moviendo (null = ninguno)
let offsetX = 0;       // Distancia entre el clic y el borde izquierdo del objeto
let offsetY = 0;       // Distancia entre el clic y el borde superior del objeto

async function setup() {
  createCanvas(400, 400);                 // Crea el lienzo de 400 x 400 píxeles

  // loadImage es asíncrona: await espera a que la imagen termine de cargar
  imgH = await loadImage('hom.gif');

  // Creamos varios personajes con posiciones y tamaños distintos
  personajes.push(new simp(imgH,  40,  40, 60));
  personajes.push(new simp(imgH, 210,  50, 80));
  personajes.push(new simp(imgH,  60, 220, 70));
  personajes.push(new simp(imgH, 250, 230, 90));
}

function draw() {
  background(200);                        // Pinta el fondo de gris claro en cada frame

  // Recorre el array y dibuja cada personaje (el orden del array = orden de dibujo)
  for (let i = 0; i < personajes.length; i++) {
    personajes[i].mostrar();
  }
}

// Se ejecuta una sola vez, al presionar el botón del mouse
function mousePressed() {
  // Recorremos el array al revés porque el último dibujado está "encima"
  for (let i = personajes.length - 1; i >= 0; i--) {
    let p = personajes[i];

    // Preguntamos si el cursor está dentro de este personaje
    if (p.coordenadas(mouseX, mouseY)) {
      arrastrado = p;                     // Guardamos cuál vamos a mover

      // Guardamos el desplazamiento para que el objeto NO salte al cursor
      offsetX = mouseX - p.x;
      offsetY = mouseY - p.y;

      // Lo pasamos al final del array para que se dibuje último (quede encima)
      personajes.splice(i, 1);
      personajes.push(p);

      break;                              // Solo agarramos un objeto por clic
    }
  }
}

// Se ejecuta repetidamente mientras el mouse se mueve con el botón apretado
function mouseDragged() {
  if (arrastrado !== null) {
    // Movemos el objeto manteniendo el punto donde se lo agarró
    arrastrado.mover(mouseX - offsetX, mouseY - offsetY);

    // Limitamos la posición para que no se salga del lienzo
    arrastrado.x = constrain(arrastrado.x, 0, width  - arrastrado.tam);
    arrastrado.y = constrain(arrastrado.y, 0, height - arrastrado.alto);
  }
}

// Se ejecuta cuando se suelta el botón del mouse
function mouseReleased() {
  arrastrado = null;                      // "Soltamos" el objeto
}

class simp {
  constructor(img, x, y, tam) {
    this.img  = img;                      // Imagen del personaje
    this.x    = x;                        // Posición horizontal (esquina superior izquierda)
    this.y    = y;                        // Posición vertical (esquina superior izquierda)
    this.tam  = tam;                      // Ancho del personaje
    this.alto = tam + 20;                 // Alto del personaje (igual que en el dibujo original)
  }

  // Dibuja la imagen en su posición y con su tamaño
  mostrar() {
    image(this.img, this.x, this.y, this.tam, this.alto);
  }

  // Cambia la posición del personaje
  mover(x, y) {
    this.x = x;
    this.y = y;
  }

  // Devuelve true si el punto (xx, yy) está dentro del rectángulo del personaje
  coordenadas(xx, yy) {
    return xx > this.x && xx < this.x + this.tam &&
           yy > this.y && yy < this.y + this.alto;
  }
}
