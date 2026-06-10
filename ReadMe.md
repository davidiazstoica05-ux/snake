# Juego de Snake (Responsive)

Un clon clásico del juego Snake desarrollado puramente con tecnologías web estándar (Vanilla JavaScript, HTML5 Canvas y CSS3). El juego cuenta con un motor gráfico matemático diseñado para adaptar automáticamente la cuadrícula y el tamaño de la partida a cualquier resolución de pantalla.

## Características

- **Canvas 100% Responsivo:** El tablero calcula dinámicamente el ancho y alto de la ventana (`window.innerWidth` / `innerHeight`) manteniendo siempre una matriz lógica de 20x20 casillas.
- **Sistema de Puntuaciones:** Seguimiento de la puntuación actual y de la puntuación máxima (_High Score_) de la sesión.
- **Prevención de colisiones ilógicas:** Controles filtrados para evitar que la serpiente gire 180 grados sobre sí misma de golpe.
- **Interfaz HUD Clean:** Diseño oscuro minimalista de alto contraste inspirado en interfaces modernas.

## Tecnologías Utilizadas

- **HTML5** (Estructura y etiqueta `<canvas>`)
- **CSS3** (Flexbox, variables de entorno y diseño responsivo)
- **JavaScript (ES6+)** (Lógica de colisiones, bucle de juego con `setInterval` y manipulación del DOM)

## Cómo Jugar

1. Clona este repositorio o descarga los archivos.
2. Abre el archivo `index.html` en cualquier navegador web moderno.
3. Utiliza las **Flechas del teclado** (Arriba, Abajo, Izquierda, Derecha) para mover la serpiente.
4. Come las manzanas rojas para crecer y sumar puntos.
5. Evita chocar contra los bordes de la pantalla o contra tu propio cuerpo.
6. Si pierdes, pulsa **'Enter'** o la **'Barra espaciadora'** para reiniciar la partida.

## Próximas Mejoras (Roadmap)

Este proyecto está en evolución. Las próximas características a implementar incluyen:

- Que un modelo de IA juegue al snake.
- Un modo de enfrentamiento donde un modelo de IA generativa sea la que mueve la serpiente y otro modelo de IA generativa sea la que coloca las frutas.
