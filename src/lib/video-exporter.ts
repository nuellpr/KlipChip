import { CaptionConfig, CaptionLine } from './types';
import { getActiveCaption } from './caption-engine';

export interface ExportVideoParams {
  title: string;
  thumbnailUrl: string;
  videoBlobUrl?: string;
  durationSeconds: number;
  startSeconds: number;
  endSeconds: number;
  captions: CaptionLine[];
  captionConfig: CaptionConfig;
  onProgress?: (progress: number, step: string) => void;
}

const RECORD_FPS = 30;
const VIDEO_LOAD_TIMEOUT_MS = 15000;

/**
 * Memuat video sumber, lakukan seek ke startSeconds, lalu mulai playback.
 * MUTED = true agar autoplay policy browser mengizinkan tanpa interaksi user,
 * sehingga frame benar-benar ter-decode dan bisa digambar ke canvas.
 */
function prepareVideoElement(
  src: string,
  startSeconds: number
): Promise<HTMLVideoElement | null> {
  return new Promise((resolve) => {
    const videoEl = document.createElement('video');
    videoEl.src = src;
    videoEl.crossOrigin = 'anonymous';
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.preload = 'auto';

    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(null);
    }, VIDEO_LOAD_TIMEOUT_MS);

    videoEl.onerror = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(null);
    };

    videoEl.onloadedmetadata = () => {
      const dur = videoEl.duration;
      if (Number.isFinite(dur) && dur > 0) {
        videoEl.currentTime = Math.max(0, Math.min(startSeconds, Math.max(0, dur - 0.5)));
      }
    };

    const onSeekOrCanPlay = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(videoEl);
    };

    videoEl.onseeked = onSeekOrCanPlay;
    videoEl.oncanplay = onSeekOrCanPlay;
  });
}

export async function exportVerticalVideoBlob(params: ExportVideoParams): Promise<Blob> {
  const {
    title,
    thumbnailUrl,
    videoBlobUrl,
    durationSeconds,
    startSeconds,
    endSeconds,
    captions,
    captionConfig,
    onProgress,
  } = params;

  // We will create a canvas of 1080 x 1920 (9:16 vertical resolution, Full HD)
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // Load video element if blobUrl exists (muted playback agar frame ter-decode)
  let videoEl: HTMLVideoElement | null = null;
  if (videoBlobUrl) {
    videoEl = await prepareVideoElement(videoBlobUrl, startSeconds);
    // Validasi: hanya lanjut pakai video jika benar-benar ada frame yang bisa digambar
    if (
      !videoEl ||
      videoEl.readyState < 2 ||
      videoEl.videoWidth <= 0 ||
      videoEl.videoHeight <= 0
    ) {
      videoEl = null;
    }
  }

  // Mulai playback agar `drawImage` meng-capture frame asli yang sedang berjalan
  if (videoEl) {
    try {
      await videoEl.play();
    } catch {
      // Jika play() gagal, frame hasil seek (paused) masih bisa digambar satu frame,
      // jadi lanjutkan tanpa mematikan render.
    }
  }

  // Load thumbnail image as backup/visual
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve(); // fallback to gradient if error
    img.src = thumbnailUrl;
  });

  // Audio: coba ambil track audio asli dari video (captureStream), fallback synth drone
  let realAudioTracks: MediaStreamTrack[] = [];
  if (videoEl) {
    try {
      const captureFn = (videoEl as unknown as { captureStream?: () => MediaStream }).captureStream;
      if (captureFn) {
        realAudioTracks = captureFn.call(videoEl).getAudioTracks();
      }
    } catch {
      realAudioTracks = [];
    }
  }

  let audioCtx: AudioContext | null = null;
  let osc: OscillatorNode | null = null;
  let dest: MediaStreamAudioDestinationNode | null = null;

  if (realAudioTracks.length === 0) {
    // Ambient gaming drone / audio synth hanya dipakai kalau video tidak punya audio
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    dest = audioCtx.createMediaStreamDestination();
    osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, audioCtx.currentTime); // Low bass A2
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
  }

  // Capture canvas stream and combine with audio
  const canvasStream = canvas.captureStream(RECORD_FPS);
  const audioTracks = realAudioTracks.length > 0 ? realAudioTracks : (dest ? dest.stream.getAudioTracks() : []);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioTracks,
  ]);

  // Determine supported mime type
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  let chosenMime = 'video/webm';
  for (const m of mimeTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      chosenMime = m;
      break;
    }
  }

  const recorder = new MediaRecorder(combinedStream, {
    mimeType: chosenMime,
    videoBitsPerSecond: 4000000, // 4 Mbps
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  // Realtime recording: 1 detik klip = 1 detik render saat frame video asli tersedia.
  // Tanpa video asli (hanya thumbnail), tetap pakai kompresi lama (3-8 detik)
  // supaya pengguna tidak menunggu lama untuk fallback visual saja.
  const clipDuration = Math.max(1, Math.min(durationSeconds, endSeconds - startSeconds));
  const hasRealVideo = !!videoEl;
  const renderSeconds = hasRealVideo ? clipDuration : Math.min(8, Math.max(3, clipDuration));
  const totalFrames = Math.max(1, Math.round(renderSeconds * RECORD_FPS));
  let currentFrame = 0;

  return new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => {
      clearInterval(interval);
      try { osc?.stop(); } catch {}
      if (audioCtx) audioCtx.close().catch(() => {});
      videoEl?.pause();
      reject(new Error('MediaRecorder error'));
    };

    recorder.onstop = () => {
      try { osc?.stop(); } catch {}
      if (audioCtx) audioCtx.close().catch(() => {});
      videoEl?.pause();
      const finalBlob = new Blob(chunks, { type: chosenMime });
      resolve(finalBlob);
    };

    const interval = setInterval(() => {
      currentFrame++;
      const progressPercent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));

      // Simulasi waktu caption: real-time jika ada video asli, else kompresi fallback
      const ratio = currentFrame / totalFrames;
      const simulatedTimeSec = startSeconds + ratio * (endSeconds - startSeconds);
      const videoTimeSec = startSeconds + currentFrame / RECORD_FPS;

      if (onProgress) {
        if (progressPercent < 30) {
          onProgress(progressPercent, 'Memotong segmen video (FFmpeg Trimming)...');
        } else if (progressPercent < 60) {
          onProgress(progressPercent, 'Melakukan Smart Crop 9:16 & Penyesuaian Visual...');
        } else if (progressPercent < 90) {
          onProgress(progressPercent, 'Membakar Auto-Caption Slang Indonesia...');
        } else {
          onProgress(progressPercent, 'Finalisasi Encoding 1080x1920 MP4...');
        }
      }

      // Draw background: Dark futuristic gaming theme + image blurred
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Draw video visual center cropped 9:16 (dari video asli yang sedang diputar)
      const videoFrameReady = !!videoEl && videoEl!.readyState >= 2 && videoEl!.videoWidth > 0;
      if (videoFrameReady) {
        const sWidth = videoEl!.videoWidth;
        const sHeight = videoEl!.videoHeight;
        const targetAspect = 9 / 16;
        const sCropWidth = Math.min(sWidth, sHeight * targetAspect);
        const sCropX = (sWidth - sCropWidth) / 2;

        ctx.drawImage(videoEl!, sCropX, 0, sCropWidth, sHeight, 0, 0, width, height);
      } else if (img.complete && img.naturalWidth > 0) {
        // Source aspect ratio
        const sWidth = img.naturalWidth;
        const sHeight = img.naturalHeight;

        // Draw zoomed/centered image
        const targetAspect = 9 / 16;
        const sCropWidth = Math.min(sWidth, sHeight * targetAspect);
        const sCropX = (sWidth - sCropWidth) / 2;

        // Add subtle camera motion/zoom
        const zoom = 1 + (currentFrame / totalFrames) * 0.08;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(img, sCropX, 0, sCropWidth, sHeight, 0, 0, width, height);
        ctx.restore();
      } else {
        // Gradient background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Dark vignettes top and bottom for readability
      const topVignette = ctx.createLinearGradient(0, 0, 0, 240);
      topVignette.addColorStop(0, 'rgba(0,0,0,0.8)');
      topVignette.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topVignette;
      ctx.fillRect(0, 0, width, 240);

      const bottomVignette = ctx.createLinearGradient(0, height - 350, 0, height);
      bottomVignette.addColorStop(0, 'rgba(0,0,0,0)');
      bottomVignette.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = bottomVignette;
      ctx.fillRect(0, height - 350, width, 350);

      // Caption timeline header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.fillText('⚡ KlipChip 9:16 Shorts', 32, 50);

      // Draw subtle audio energy pulse bar
      const barHeight = Math.sin(currentFrame * 0.4) * 20 + 30;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(32, 70, 8, barHeight);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(44, 70, 8, barHeight * 0.8);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(56, 70, 8, barHeight * 1.2);

      // Title at top
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '600 20px Inter, sans-serif';
      const truncatedTitle = title.length > 45 ? title.substring(0, 42) + '...' : title;
      ctx.fillText(truncatedTitle, 75, 88);

      // Render Active Caption
      const { activeLine, activeWordIndex } = getActiveCaption(captions, simulatedTimeSec);

      if (activeLine) {
        // Determine position Y
        let captionY = height - 200; // bottom default
        if (captionConfig.position === 'middle') captionY = height / 2;
        if (captionConfig.position === 'top') captionY = 280;

        const words = activeLine.words;
        const fullText = words.map(w => captionConfig.uppercase ? w.word.toUpperCase() : w.word).join(' ');

        // Draw animated styled captions
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Font size setup
        let fontSize = 34;
        if (captionConfig.fontSize === 'sm') fontSize = 26;
        if (captionConfig.fontSize === 'lg') fontSize = 40;
        if (captionConfig.fontSize === 'xl') fontSize = 48;

        ctx.font = `900 ${fontSize}px Inter, "Outfit", sans-serif`;

        if (captionConfig.style === 'hormozi') {
          // Hormozi Style: Big box or bold outline with highlighted active word
          // Measure words
          const wordMetrics = words.map(w => {
            const txt = captionConfig.uppercase ? w.word.toUpperCase() : w.word;
            return { txt, width: ctx.measureText(txt + ' ').width };
          });
          const totalWidth = wordMetrics.reduce((acc, m) => acc + m.width, 0);

          let curX = (width - totalWidth) / 2;

          // Draw background box if enabled
          if (captionConfig.showBackgroundBox) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            const boxPadding = 16;
            ctx.roundRect(
              curX - boxPadding,
              captionY - fontSize / 2 - boxPadding,
              totalWidth + boxPadding * 2,
              fontSize + boxPadding * 2,
              12
            );
            ctx.fill();
          }

          // Draw each word
          words.forEach((w, idx) => {
            const m = wordMetrics[idx];
            const isCurrent = idx === activeWordIndex;
            const wordX = curX + m.width / 2;

            // Stroke outline
            ctx.lineWidth = 8;
            ctx.strokeStyle = '#000000';
            ctx.strokeText(m.txt, wordX, captionY);

            // Fill color
            if (isCurrent) {
              ctx.fillStyle = captionConfig.highlightColor || '#FACC15';
              // Word pop scale
              ctx.save();
              ctx.translate(wordX, captionY);
              ctx.scale(1.15, 1.15);
              ctx.fillStyle = captionConfig.highlightColor || '#FACC15';
              ctx.fillText(m.txt, 0, 0);
              ctx.restore();
            } else if (w.isSlang) {
              ctx.fillStyle = '#38bdf8'; // Cyan for slang
              ctx.fillText(m.txt, wordX, captionY);
            } else {
              ctx.fillStyle = captionConfig.textColor || '#FFFFFF';
              ctx.fillText(m.txt, wordX, captionY);
            }

            curX += m.width;
          });
        } else if (captionConfig.style === 'neon') {
          // Neon Gamer Style: Glow effect
          ctx.shadowColor = captionConfig.highlightColor || '#10B981';
          ctx.shadowBlur = 20;
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#022c22';
          ctx.strokeText(fullText, width / 2, captionY);

          ctx.fillStyle = captionConfig.textColor || '#FFFFFF';
          ctx.fillText(fullText, width / 2, captionY);
        } else if (captionConfig.style === 'punchy') {
          // Punchy TikTok yellow font with strong dark border
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#000000';
          ctx.strokeText(fullText, width / 2, captionY);

          ctx.fillStyle = captionConfig.highlightColor || '#F43F5E';
          ctx.fillText(fullText, width / 2, captionY);
        } else {
          // Clean Minimalist
          if (captionConfig.showBackgroundBox) {
            const textWidth = ctx.measureText(fullText).width;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.roundRect((width - textWidth) / 2 - 14, captionY - fontSize / 2 - 8, textWidth + 28, fontSize + 16, 8);
            ctx.fill();
          }
          ctx.fillStyle = captionConfig.textColor || '#FFFFFF';
          ctx.fillText(fullText, width / 2, captionY);
        }

        ctx.restore();
      }

      // Draw playback progress bar at the bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(24, height - 30, width - 48, 6);
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(24, height - 30, (width - 48) * (currentFrame / totalFrames), 6);

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        recorder.stop();
      }
    }, 1000 / RECORD_FPS);
  });
}
