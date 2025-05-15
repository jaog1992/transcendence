## oath2 explanation:

[User] ──> [GET /login42] ──> Redirect to 42 API ──> Login on 42

[42 API redirects with ?code=...] ──> [GET /callback] ──> Exchange code for 42 access_token

[GET /v2/me] with 42 token ──> Fetch user data ──> Register/Login in Django

[Generate JWT tokens] ──> Redirect to frontend with tokens

[User clicks "Logout"] ──> Delete local JWT tokens

[Optional: User clicks "Logout from 42 as well"] ──> Redirect to the intra to click on the logout button

## update vs renderizado

### Actualización (Update)
Maneja la lógica del juego
No dibuja nada visualmente
Calcula nuevas posiciones y estados

### Renderizado (Render)
Solo se encarga de dibujar en pantalla
No modifica la lógica del juego
Refleja visualmente el estado actual
Game Loop

La separación entre actualización y renderizado permite:
- Mayor control sobre el rendimiento
- Código más mantenible
- Facilita testing
- Mejor depuración

## beginPath() explanation
/*
SIN beginPath():
   ____
  /    \    Las figuras se conectan
 |      |   entre sí con líneas no
  \____/    deseadas
   |  |
   ____
  /    \
 |      |
  \____/

CON beginPath():
   ____
  /    \    Cada figura es independiente
 |      |   No hay conexiones
  \____/    no deseadas

   ____
  /    \
 |      |
  \____/
*/

drawBall() {
  // 1. Limpia rastros anteriores
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  // 2. Inicia nueva figura aislada
  this.ctx.beginPath();
  
  // 3. Dibuja círculo perfecto
  this.ctx.arc(
    this.ball.x,    // posición X 
    this.ball.y,    // posición Y
    10,             // radio
    0,              // ángulo inicio
    Math.PI * 2     // ángulo fin (360°)
  );
  
  // 4. Rellena solo este círculo
  this.ctx.fill();
}

## Movimiento de la bola

### checkCollisions()
- Ball-Paddle collisions
- Ball-Wall collisions
- Score detection
- Bounce physics

checkCollisions() {
  // 1. Ball-Paddle Collisions
  // Left paddle
  if (this.ball.x - this.ball.radius <= this.leftPaddle.x + this.leftPaddle.width &&
      this.ball.y >= this.leftPaddle.y &&
      this.ball.y <= this.leftPaddle.y + this.leftPaddle.height) {
    // Reverse horizontal direction
    this.ball.dx = Math.abs(this.ball.dx);
    // Add spin based on paddle movement
    this.ball.dy += this.leftPaddle.dy * 0.2;
  }

  // Right paddle
  if (this.ball.x + this.ball.radius >= this.rightPaddle.x &&
      this.ball.y >= this.rightPaddle.y &&
      this.ball.y <= this.rightPaddle.y + this.rightPaddle.height) {
    // Reverse horizontal direction
    this.ball.dx = -Math.abs(this.ball.dx);
    // Add spin based on paddle movement
    this.ball.dy += this.rightPaddle.dy * 0.2;
  }

  // 2. Wall Collisions
  // Top and bottom walls
  if (this.ball.y + this.ball.radius >= this.canvas.height ||
      this.ball.y - this.ball.radius <= 0) {
    this.ball.dy = -this.ball.dy;
  }

  // 3. Score Detection
  // Left wall (right player scores)
  if (this.ball.x - this.ball.radius <= 0) {
    this.score.right++;
    this.resetBall('right');
  }

  // Right wall (left player scores)
  if (this.ball.x + this.ball.radius >= this.canvas.width) {
    this.score.left++;
    this.resetBall('left');
  }
}

- ball.radius: Ball size
- ball.dx/dy: Ball direction and speed
- paddle.dy: Paddle movement speed
- canvas.width/height: Game boundaries

## IA

En función de la dificultad de la IA y de la trayectoria de la bola, que no deja de ser cartesiana, jugamos con 3 valores:

- reactionTime;
- predictionError;
- maxSpeed;

class MatchComponent {
  // AI Configuration
  private aiConfig = {
    difficulty: 'medium',
    reactionTime: 50,
    maxSpeed: 5,
    predictionError: 0.2
  };

  updateAI() {
    // 1. Predict ball position
    const futureBallY = this.predictBallPosition();
    
    // 2. Calculate paddle target position
    const targetY = this.calculatePaddleTarget(futureBallY);
    
    // 3. Move AI paddle with reaction delay
    setTimeout(() => {
      if (this.rightPaddle.y < targetY - this.aiConfig.maxSpeed) {
        this.rightPaddle.dy = this.aiConfig.maxSpeed;
      } else if (this.rightPaddle.y > targetY + this.aiConfig.maxSpeed) {
        this.rightPaddle.dy = -this.aiConfig.maxSpeed;
      } else {
        this.rightPaddle.dy = 0;
      }
    }, this.aiConfig.reactionTime);
  }

  private predictBallPosition(): number {
    // Calculate future Y position when ball reaches paddle
    const timeToReach = (this.rightPaddle.x - this.ball.x) / this.ball.dx;
    let predictedY = this.ball.y + (this.ball.dy * timeToReach);
    
    // Add intentional error based on difficulty
    predictedY += (Math.random() - 0.5) * this.aiConfig.predictionError * this.canvas.height;
    
    return predictedY;
  }

  private calculatePaddleTarget(ballY: number): number {
    // Center paddle to ball with some offset
    return ballY - (this.rightPaddle.height / 2);
  }

  setAIDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
    switch(difficulty) {
      case 'easy':
        this.aiConfig.reactionTime = 100;
        this.aiConfig.predictionError = 0.3;
        this.aiConfig.maxSpeed = 3;
        break;
      case 'medium':
        this.aiConfig.reactionTime = 50;
        this.aiConfig.predictionError = 0.2;
        this.aiConfig.maxSpeed = 5;
        break;
      case 'hard':
        this.aiConfig.reactionTime = 20;
        this.aiConfig.predictionError = 0.1;
        this.aiConfig.maxSpeed = 7;
        break;
    }
  }
}

## 1. "¿Cómo funciona el sistema de matchmaking?"

Plan for Matchmaking System
Components
Player search
Player selection
Queue management
Match creation
Data Flow
Search players
Add/remove players
Create match
Start game

2. "¿Cómo se gestionan las desconexiones?"

Componentes principales
Campo de búsqueda
Lista de resultados
Gestión de jugadores seleccionados
Indicadores de carga
Flujo del proceso
Usuario escribe en la barra de búsqueda
Sistema muestra spinner de carga
Hace petición al backend
Muestra resultados encontrados
Permite seleccionar jugadores
Controla límite de jugadores según modo
Estados de la búsqueda
Vacío (input sin texto)
Buscando (loading spinner)
Con resultados
Sin resultados
Error
Limitaciones
Solo busca si hay espacio para más jugadores
Solo muestra resultados si hay texto
No permite seleccionar al mismo jugador dos veces
Muestra spinner mientras busca
Control de longitud mínima de búsqueda
Interacción
Input con búsqueda en tiempo real
Botón de eliminar para cada jugador seleccionado
Autocompletado de nombres
Feedback visual del estado de búsqueda
El sistema está diseñado para ser intuitivo y dar feedback constante al usuario sobre el estado de la búsqueda.
   
4. "¿Cómo funciona el modo torneo?"

6. "¿Qué eventos/animaciones hay al marcar punto?"
   
8. "¿Cómo se maneja el input lag y la sincronización?"
Recolección de Inputs
El juego captura constantemente los inputs del usuario (movimientos de paleta)
Se guardan con timestamp para saber cuándo ocurrieron
Se envían al servidor periódicamente
Buffer de Estados
El juego mantiene un buffer de 3 estados anteriores
Permite interpolar entre estados para movimiento suave
Ayuda a manejar latencia de red
Sincronización
Cada frame se compara el estado local con el del servidor
Si hay diferencia mayor a un umbral, se corrige
Se aplica interpolación para que la corrección sea suave
Compensación de Lag
Se usa predicción de movimientos
Input delay de 2-3 frames para igualar jugadores
Sistema de timestamping para ordenar eventos
Optimizaciones
Prioridad a inputs locales para sensación de respuesta inmediata
Reconciliación cuando llegan datos del servidor
Ajuste dinámico del buffer según latencia
WebSocket
Conexión persistente para datos en tiempo real
Medición constante de latencia (ping cada 1s)
Ajuste automático de parámetros según calidad de conexión
Esta arquitectura permite una experiencia fluida incluso con latencias de hasta 100-150ms.


10. "¿Qué estados tiene una partida? (pausa, fin, etc)"
11. "¿Cómo se guardan las estadísticas?"

    Types of Statistics Tracked
Matches played
Wins/losses
Points scored
Game duration
Player performance metrics
Tournament results
Ladder rankings
Storage Flow

Game events generate statistics

Statistics service captures events

Data buffered during match

Batch updates to database

Real-time updates for critical stats

Storage Locations

PostgreSQL database for permanent storage
Redis cache for active games
Local storage for temporary stats
Backend API endpoints for CRUD
Key Statistics Tracked
games_played
games_won
total_points
win_ratio
max_score
tournament_wins
ladder_position
average_points_per_game
Update Triggers
Match end
Point scored
Tournament completion
Ladder position change
Achievement unlocked
Season reset
The statistics system uses a combination of real-time updates for critical data and batch processing for performance metrics, with redundancy between PostgreSQL and Redis for reliability.

13. "¿Qué powerups o mecánicas especiales hay?"
