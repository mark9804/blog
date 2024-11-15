interface WaveConfig {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  strokeStyle: string;
  backgroundColor: string;
  offset: number;
  amplitudeRatio?: number;
  periodMultiplier?: number;
  phaseShift?: number;
  waveCount?: number;
  lineWidth?: number;
  verticalPosition?: number;
}

export function drawWaves(config: WaveConfig) {
  const {
    ctx,
    width,
    height,
    strokeStyle,
    backgroundColor,
    offset,
    amplitudeRatio = 0.06,
    periodMultiplier = 0.008,
    phaseShift = Math.PI / 4,
    waveCount = 5,
    lineWidth = 2,
    verticalPosition = 0.5,
  } = config;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.translate(0, height * verticalPosition);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;

  const waveAmplitude = height * amplitudeRatio;

  for (let k = 1; k <= waveCount; k++) {
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      const y =
        waveAmplitude *
        Math.sin(x * periodMultiplier + offset + phaseShift * k);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function initCanvas(canvas: HTMLCanvasElement, windowHeight: number) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = windowHeight * dpr;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
}

export interface WaveAnimationController {
  start: () => void;
  stop: () => void;
  resize: (windowHeight: number) => void;
}

export function createWaveAnimation(
  canvas: HTMLCanvasElement,
  config: Omit<WaveConfig, "ctx" | "width" | "height" | "offset">,
  windowHeight: number,
  preferReducedMotion: boolean = false
): WaveAnimationController {
  let offset = 0;
  let animationFrameId: number | null = null;

  const drawStaticWave = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawWaves({
      ...config,
      ctx,
      width: canvas.width,
      height: canvas.height,
      offset: 0,
    });
  };

  const animate = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    offset -= 0.01;
    drawWaves({
      ...config,
      ctx,
      width: canvas.width,
      height: canvas.height,
      offset,
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  const start = () => {
    if (preferReducedMotion) {
      initCanvas(canvas, windowHeight);
      drawStaticWave();
    } else {
      initCanvas(canvas, windowHeight);
      animate();
    }
  };

  const stop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  const resize = (newWindowHeight: number) => {
    initCanvas(canvas, newWindowHeight);
    if (preferReducedMotion) {
      drawStaticWave();
    }
  };

  return {
    start,
    stop,
    resize,
  };
}
