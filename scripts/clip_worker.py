import os
import sys
import json
import subprocess
import re
import shutil
import tempfile
import time
import urllib.request
import urllib.error

try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

FONT_SIZE_MAP = {'sm': 46, 'md': 58, 'lg': 70, 'xl': 86}

# Kamus slang Indonesia (sinkron dengan src/data/slang-dictionary.ts)
SLANG_SET = {
    'bjir','anjir','ggwp','gg','wp','rata','lu','rata lu','bocil','kematian','bocil kematian',
    'clutch','hoki','seumur','hidup','hoki seumur hidup','kocak','gaming','kocak gaming',
    'mabar','mati','konyol','mati konyol','pursuit','fail','rp','fail rp','speedrun',
    'water','bucket','water bucket clutch','retri','indomaret','retri indomaret',
    'cringe','gokil','nt','one','shot','kill','one shot one kill','kebanting','pursuit',
    'bocil','ggwp','clutch','gokil','anjir','rata','hoki','cringe','nt','kebanting'
}

_whisper_model = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is not None:
        return _whisper_model
    try:
        import whisper
        # Pastikan ffmpeg ada di PATH untuk whisper.load_audio
        ffmpeg_exe = get_ffmpeg_path()
        ffmpeg_dir = os.path.dirname(ffmpeg_exe)
        if ffmpeg_dir and ffmpeg_dir not in os.environ.get("PATH", ""):
            os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
        print("[Whisper] Memuat model base (pertama kali ~150MB, cache di ~/.cache/whisper)...")
        _whisper_model = whisper.load_model("base")
        print("[Whisper] Model base siap")
        return _whisper_model
    except Exception as e:
        print(f"[Whisper] Gagal memuat model: {e}")
        return None

def transcribe_with_whisper(video_path, clip_start, clip_end, language='auto'):
    """Transkripsi audio dengan Whisper openai-whisper, mengembalikan CaptionLine list atau None."""
    # Fallback jika file bukan http (mis. upload lokal tanpa speech) -> skip agar tidak lambat
    try:
        import whisper  # noqa: F401
    except ImportError:
        print("[Whisper] openai-whisper tidak terinstall, skip transkripsi")
        return None
    try:
        ffmpeg_exe = get_ffmpeg_path()
        wav_path = video_path + ".whisper.wav"
        # Ekstrak audio 16k mono PCM
        dur = max(1.0, clip_end - clip_start)
        cmd = [ffmpeg_exe, "-y", "-i", video_path, "-vn", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav_path]
        print(f"[Whisper] Ekstrak audio {dur:.1f}s -> {wav_path}")
        res = subprocess.run(cmd, capture_output=True, text=True)
        if not os.path.exists(wav_path) or os.path.getsize(wav_path) < 1000:
            print(f"[Whisper] Gagal ekstrak audio: {res.stderr[:200]}")
            return None
        model = get_whisper_model()
        if model is None:
            return None
        # Transkripsi dengan bahasa yang dipilih (None = auto-detect)
        lang_arg = None if language in ('auto', '') else language
        print(f"[Whisper] Mulai transkripsi bahasa={language or 'auto'}...")
        result = model.transcribe(wav_path, language=lang_arg, word_timestamps=True, verbose=False, fp16=False)
        segments = result.get("segments") or []
        if not segments:
            # fallback tanpa word_timestamps
            text = (result.get("text") or "").strip()
            if text:
                return [{
                    "id": f"whisper-{int(clip_start*1000)}",
                    "startSeconds": clip_start,
                    "endSeconds": clip_end,
                    "text": text,
                    "words": [],
                    "confidence": 88,
                    "hasSlang": any(s in text.lower() for s in SLANG_SET)
                }]
            return None
        captions = []
        for seg in segments:
            seg_start = float(seg.get("start", 0))
            seg_end = float(seg.get("end", seg_start + 2))
            text = (seg.get("text") or "").strip()
            if not text:
                continue
            abs_start = clip_start + seg_start
            abs_end = clip_start + seg_end
            # clamp ke rentang clip
            abs_start = max(clip_start, min(abs_start, clip_end))
            abs_end = max(abs_start + 0.3, min(abs_end, clip_end))
            words = []
            for w in seg.get("words") or []:
                w_text = (w.get("word") or "").strip()
                if not w_text:
                    continue
                w_start = float(w.get("start", seg_start))
                w_end = float(w.get("end", w_start + 0.4))
                # offset relatif terhadap awal segment
                start_off = max(0.0, w_start - seg_start)
                end_off = max(start_off + 0.1, w_end - seg_start)
                clean = w_text.strip().strip(".,!?;:\"'").lower()
                is_slang = clean in SLANG_SET
                words.append({
                    "word": w_text,
                    "startOffset": round(start_off, 2),
                    "endOffset": round(end_off, 2),
                    "isSlang": is_slang,
                    **({"normalizedFrom": clean} if is_slang else {})
                })
            # fallback words jika tidak ada word_timestamps
            if not words:
                toks = text.split()
                if toks:
                    per = (abs_end - abs_start) / max(1, len(toks))
                    for i, tok in enumerate(toks):
                        clean = tok.strip().strip(".,!?;:\"'").lower()
                        words.append({
                            "word": tok,
                            "startOffset": round(i * per, 2),
                            "endOffset": round((i + 1) * per, 2),
                            "isSlang": clean in SLANG_SET
                        })
            has_slang = any(ww.get("isSlang") for ww in words)
            captions.append({
                "id": f"whisper-{int(abs_start*1000)}-{len(captions)}",
                "startSeconds": abs_start,
                "endSeconds": abs_end,
                "text": text,
                "words": words,
                "confidence": 92,
                "hasSlang": has_slang
            })
        try:
            os.remove(wav_path)
        except Exception:
            pass
        if captions:
            print(f"[Whisper] Sukses {len(captions)} segmen, contoh: '{captions[0]['text'][:60]}'")
            return captions
        return None
    except Exception as e:
        print(f"[Whisper] Error transkripsi: {e}")
        import traceback; traceback.print_exc()
        return None
    finally:
        try:
            if 'wav_path' in locals() and os.path.exists(wav_path):
                os.remove(wav_path)
        except Exception:
            pass


def download_youtube_subtitles(url, clip_start, clip_end, language='auto'):
    """Unduh subtitle YouTube (auto/manual) via yt-dlp, kembalikan CaptionLine list untuk rentang klip."""
    try:
        tmp_dir = tempfile.mkdtemp(prefix='kc-sub-')
        sub_lang = language if language in ('auto', '') else language
        cmd = [
            sys.executable, '-m', 'yt_dlp',
            '--write-auto-sub', '--write-subs',
            '--sub-lang', sub_lang if sub_lang != 'auto' else 'id,en',
            '--skip-download',
            '--convert-subs', 'srt',
            '-o', os.path.join(tmp_dir, '%(id)s.%(ext)s'),
            url
        ]
        print(f"[Subtitle] Unduh caption YouTube (lang={sub_lang})...")
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        srt_files = [f for f in os.listdir(tmp_dir) if f.endswith('.srt')]
        if not srt_files:
            print(f"[Subtitle] Tidak ada subtitle: {res.stderr[:200]}")
            return None
        srt_path = os.path.join(tmp_dir, srt_files[0])
        with open(srt_path, 'r', encoding='utf-8', errors='replace') as f:
            srt = f.read()
        blocks = re.split(r'\r?\n\r?\n', srt)
        captions = []
        for b in blocks:
            lines = b.strip().splitlines()
            if len(lines) < 3:
                continue
            time_match = re.match(r'(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)', lines[1] or '')
            if not time_match:
                continue
            t = [int(x) for x in time_match.groups()]
            seg_start = t[0] * 3600 + t[1] * 60 + t[2] + t[3] / 1000
            seg_end = t[4] * 3600 + t[5] * 60 + t[6] + t[7] / 1000
            text = re.sub(r'<[^>]+>', ' ', ' '.join(lines[2:])).strip()
            if not text:
                continue
            abs_start = max(clip_start, min(seg_start, clip_end))
            abs_end = max(abs_start + 0.3, min(seg_end, clip_end))
            if abs_end - abs_start < 0.3 or abs_start >= clip_end:
                continue
            toks = text.split()
            per = (abs_end - abs_start) / max(1, len(toks))
            words = []
            for i, tok in enumerate(toks):
                clean = tok.strip().strip('.,!?;:\'"').lower()
                words.append({
                    'word': tok,
                    'startOffset': round(i * per, 2),
                    'endOffset': round((i + 1) * per, 2),
                    'isSlang': clean in SLANG_SET,
                })
            has_slang = any(w.get('isSlang') for w in words)
            captions.append({
                'id': f'yt-{int(abs_start * 1000)}-{len(captions)}',
                'startSeconds': abs_start,
                'endSeconds': abs_end,
                'text': text,
                'words': words,
                'confidence': 85,
                'hasSlang': has_slang,
            })
        if captions:
            print(f"[Subtitle] Sukses {len(captions)} baris caption YouTube")
            return captions
        return None
    except Exception as e:
        print(f"[Subtitle] Error unduh caption YouTube: {e}")
        return None
    finally:
        try:
            shutil.rmtree(tmp_dir, ignore_errors=True)
        except Exception:
            pass


def get_video_dimensions_cv2(video_path):
    try:
        import cv2
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        if w > 0 and h > 0:
            return (w, h)
    except Exception:
        pass
    return None


def detect_face_center(video_path):
    """Deteksi posisi X tengah wajah terbesar (median dari beberapa frame)."""
    try:
        import cv2
    except ImportError:
        return None
    try:
        cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        if cascade.empty():
            return None
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None
        centers = []
        frame_idx = 0
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        step = max(1, int(fps * 0.4))
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % step == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5, minSize=(60, 60))
                if len(faces) > 0:
                    largest = max(faces, key=lambda r: r[2] * r[3])
                    x, y, w, h = largest
                    centers.append(x + w / 2)
            frame_idx += 1
        cap.release()
        if not centers:
            return None
        centers.sort()
        return centers[len(centers) // 2]
    except Exception as e:
        print(f"[Face] detection error: {e}")
        return None


def get_ffmpeg_path():
    # Use local bin/ffmpeg.exe if present
    local_bin = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'bin', 'ffmpeg.exe')
    if os.path.exists(local_bin):
        return local_bin
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return 'ffmpeg'


def hex_to_ass_color(hex_color, alpha=0):
    """Konversi #RRGGBB menjadi &HAABBGGRR (format warna ASS)."""
    h = str(hex_color or '#FFFFFF').strip().lstrip('#')
    if len(h) != 6:
        h = 'FFFFFF'
    r, g, b = h[0:2], h[2:4], h[4:6]
    return f"&H{alpha:02X}{b}{g}{r}".upper()


def ass_time(seconds):
    """Format waktu ASS: h:mm:ss.cc (centiseconds)."""
    seconds = max(0.0, float(seconds))
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds - h * 3600 - m * 60
    return f"{h}:{m:02d}:{s:05.2f}"


def clean_ass_text(text, uppercase):
    t = str(text or '')
    if uppercase:
        t = t.upper()
    # Hindari konflik dengan override block ASS
    t = t.replace('{', '(').replace('}', ')').replace('\\', '/').replace('\n', ' ')
    return t.strip()


def translate_lines(lines, target):
    """Terjemahkan baris caption via Forge (batch hemat panggilan).
    Gagal apa pun -> [] agar render berbayar lanjut single-track."""
    try:
        api_key = os.environ.get('FORGE_API_KEY') or ''
        if not api_key or not lines:
            return []
        base_url = (os.environ.get('FORGE_BASE_URL') or 'https://run.forgeapi.org/v1').rstrip('/')
        model = os.environ.get('FORGE_MODEL') or 'MiniMax-M3'
        capped = [str(t or '') for t in lines][:120]
        batch_size = 22
        result = []
        for start in range(0, len(capped), batch_size):
            batch = capped[start:start + batch_size]
            numbered = '\n'.join(f"{i + 1}.| {t}" for i, t in enumerate(batch))
            prompt = (
                f"Translate each numbered subtitle line to {target}. "
                "Reply with the SAME numbering format 'N.| translated text', one per line, "
                "no commentary. Natural, concise, spoken style.\n\n" + numbered
            )
            out = [''] * len(batch)
            for attempt in range(2):
                try:
                    req = urllib.request.Request(
                        base_url + '/chat/completions',
                        data=json.dumps({
                            'model': model,
                            'messages': [{'role': 'user', 'content': prompt}],
                        }).encode('utf-8'),
                        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
                        method='POST',
                    )
                    with urllib.request.urlopen(req, timeout=30) as resp:
                        data = json.loads(resp.read().decode('utf-8'))
                    content = str((data.get('choices') or [{}])[0].get('message', {}).get('content') or '')
                    got = {}
                    for raw in content.splitlines():
                        mm = re.match(r'^\s*(\d+)\.\|\s*(.*)$', raw)
                        if mm and 1 <= int(mm.group(1)) <= len(batch):
                            got[int(mm.group(1))] = mm.group(2).strip()
                    out = [got.get(i + 1, '') for i in range(len(batch))]
                    break
                except urllib.error.HTTPError as he:
                    if attempt == 0 and (he.code == 429 or he.code >= 500):
                        time.sleep(1.5)
                        continue
                    break
                except Exception:
                    if attempt == 0:
                        time.sleep(1.5)
                        continue
            result.extend(out)
        return result if any(str(t or '').strip() for t in result) else []
    except Exception as e:
        print(f"[Worker] Translate gagal, lanjut single-track: {e}")
        return []


def build_ass_file(captions, config, clip_start, clip_end, ass_path, translations=None):
    """Bangun file subtitle .ass dari data caption KlipChip (mendukung karaoke per kata)."""
    style = str(config.get('style') or 'hormozi')
    position = str(config.get('position') or 'bottom')
    font_size = FONT_SIZE_MAP.get(str(config.get('fontSize') or 'lg'), 70)
    text_colour = hex_to_ass_color(config.get('textColor') or '#FFFFFF')
    highlight_colour = hex_to_ass_color(config.get('highlightColor') or '#FACC15')
    show_box = bool(config.get('showBackgroundBox', True))
    uppercase = bool(config.get('uppercase', True))

    bold = -1 if style in ('hormozi', 'punchy') else 0
    karaoke = style == 'hormozi'
    outline_w = 4 if style == 'punchy' else 2
    if show_box:
        border_style = 3
        outline_w = 8  # pada BorderStyle 3, Outline berfungsi sebagai padding box
    else:
        border_style = 1

    alignment = {'bottom': 2, 'middle': 5, 'top': 8}.get(position, 2)
    margin_v = 0 if position == 'middle' else 140

    back_colour = '&H96000000' if show_box else '&H00000000'
    outline_colour = '&H00000000'

    # Untuk karaoke: PrimaryColour = warna setelah sweep (highlight),
    # SecondaryColour = warna sebelum sweep (teks biasa).
    primary = highlight_colour if karaoke else text_colour
    secondary = text_colour

    clip_duration = clip_end - clip_start

    subs = [str(t or '').strip() for t in (translations or [])]
    has_subs = any(subs)
    sub_font_size = int(font_size * 0.6)

    header = (
        "[Script Info]\n"
        "Title: KlipChip Auto-Caption\n"
        "ScriptType: v4.00+\n"
        "PlayResX: 1080\n"
        "PlayResY: 1920\n"
        "WrapStyle: 2\n"
        "ScaledBorderAndShadow: yes\n"
        "\n"
        "[V4+ Styles]\n"
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, "
        "BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, "
        "BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n"
        f"Style: Caption,Arial,{font_size},{primary},{secondary},{outline_colour},{back_colour},"
        f"{bold},0,0,0,100,100,0,0,{border_style},{outline_w},0,{alignment},60,60,{margin_v},1\n"
        + (
            f"Style: CaptionSub,Arial,{sub_font_size},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,"
            f"0,0,0,100,100,0,0,1,3,0,2,60,60,60,1\n"
            if has_subs else ""
        )
        + "\n"
        "[Events]\n"
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
    )

    lines = [header]
    style_name = config.get('style', 'hormozi')
    primary_color = hex_to_ass_color(config.get('textColor') or '#FFFFFF')
    highlight_color = hex_to_ass_color(config.get('highlightColor') or '#FACC15')
    use_uppercase = config.get('uppercase', True)

    for ci, cap in enumerate(captions):
        line_start = float(cap.get('startSeconds', 0)) - clip_start
        line_end = float(cap.get('endSeconds', 0)) - clip_start

        if line_end <= 0 or line_start >= clip_duration:
            continue

        rel_start = max(0.0, line_start)
        rel_end = min(clip_duration, line_end)
        if rel_end - rel_start < 0.2:
            continue

        sub_text = subs[ci] if has_subs and ci < len(subs) else ''

        words = cap.get('words') or []
        if not words and cap.get('text'):
            # fallback jika tidak ada kata per kata
            parts = []
            text = clean_ass_text(cap.get('text'), use_uppercase)
            if text:
                lines.append(f"Dialogue: 0,{ass_time(rel_start)},{ass_time(rel_end)},Caption,,0,0,0,,{text}")
                if sub_text:
                    lines.append(f"Dialogue: 1,{ass_time(rel_start)},{ass_time(rel_end)},CaptionSub,,0,0,0,,{clean_ass_text(sub_text, False)}")
            continue

        # Bangun teks dengan inline override tags sesuai gaya
        styled_parts = []
        if style_name == 'hormozi':
            # karaoke per kata
            prev = 0.0
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                abs_end = line_start + float(w.get('endOffset', 0))
                rel_end_w = abs_end - rel_start
                cs = max(0, int(round((rel_end_w - prev) * 100)))
                prev = rel_end_w
                styled_parts.append(f"{{\\kf{cs}}}{word}")
        elif style_name == 'smart-bg-focus':
            # background semi-transparent dengan border (pakai \4c: backcolour box, bukan \3c)
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\bord3\\4c&H80000000&\\3c&H000000&\\c{primary_color}}}{word}")
        elif style_name == 'box-highlight':
            # kotak berwarna highlight untuk setiap kata
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\bord2\\3c{highlight_color}\\c{primary_color}}}{word}")
        elif style_name == 'word-focus':
            # kata aktif diperbesar dan berwarna putih
            # kita tidak tahu kata mana yang aktif, jadi kita buat semua sama
            # atau kita bisa buat semacam karaoke tetapi dengan efek perbesar?
            # untuk simpel, kita buat semua dengan warna highlight dan ukuran besar
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\fs{int(font_size*1.5)}\\c{highlight_color}}}{word}")
        elif style_name == 'underline-focus':
            # garis bawah pada semua kata, tidak ada efek dinamis dalam ASS statis
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\u1\\c{primary_color}}}{word}")
        elif style_name == 'gradient-glow':
            # setiap kata warna berbeda berdasarkan indeks
            for i, w in enumerate(words):
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                hue = (i / max(1, len(words))) * 360
                # konversi HSV ke hex tidak praktis, gunakan warna pelangi sederhana
                # kita bisa gunakan warna dasar dengan variasi
                color = hex_to_ass_color(f"#{int(255*(i/len(words))):02x}{int(128*(i/len(words))):02x}{int(255*(1-i/len(words))):02x}")
                styled_parts.append(f"{{\\c{color}}}{word}")
        elif style_name == 'game-streamer':
            # tebal, neon, outline hitam
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\b1\\bord2\\3c&H000000&\\c{highlight_color}}}{word}")
        else:
            # clean default
            for w in words:
                word = clean_ass_text(w.get('word'), use_uppercase)
                if not word:
                    continue
                styled_parts.append(f"{{\\c{primary_color}}}{word}")

        text = ' '.join(styled_parts) if styled_parts else clean_ass_text(cap.get('text'), use_uppercase)
        if not text:
            continue

        lines.append(f"Dialogue: 0,{ass_time(rel_start)},{ass_time(rel_end)},Caption,,0,0,0,,{text}")
        if sub_text:
            lines.append(f"Dialogue: 1,{ass_time(rel_start)},{ass_time(rel_end)},CaptionSub,,0,0,0,,{clean_ass_text(sub_text, False)}")

    with open(ass_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')


def has_audio_stream(video_path, ffmpeg_exe):
    """Cek apakah file video punya stream audio (menggunakan ffmpeg)."""
    try:
        res = subprocess.run(
            [ffmpeg_exe, '-hide_banner', '-i', video_path],
            capture_output=True, text=True, timeout=30
        )
        info = (res.stderr or '') + (res.stdout or '')
        return bool(re.search(r'Stream #\d+:\d+[^\n]*Audio', info))
    except Exception:
        return False


def ensure_audio_stream(video_path, url, ffmpeg_exe, output_dir, cookies_path=None, start_sec=None, end_sec=None):
    """Jika raw video tidak punya audio, unduh audio terpisah lalu mux dengan ffmpeg."""
    if has_audio_stream(video_path, ffmpeg_exe):
        return video_path

    print("[Audio] Video tanpa track audio! Mencoba unduh audio terpisah...")
    audio_path = video_path + '.audio.m4a'
    cmd = [
        sys.executable, '-m', 'yt_dlp',
        '-f', 'bestaudio/best',
        '-o', audio_path,
        '--no-playlist',
        '--ffmpeg-location', os.path.dirname(ffmpeg_exe),
    ]
    if start_sec is not None and end_sec is not None:
        cmd += ['--download-sections', f'*{start_sec}-{end_sec}']
    if cookies_path and os.path.exists(cookies_path):
        cmd += ['--cookies', cookies_path]
    cmd.append(url)

    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        audio_candidates = [
            os.path.join(output_dir, f)
            for f in os.listdir(output_dir)
            if f.startswith(os.path.basename(audio_path).replace('.m4a', '')) and f.endswith(('.m4a', '.webm', '.opus', '.mp3'))
        ]
        chosen_audio = next((c for c in audio_candidates if os.path.exists(c) and os.path.getsize(c) > 10000), None)
        if not chosen_audio:
            print(f"[Audio] Gagal unduh audio: {res.stderr[:200]}")
            return video_path
        merged = video_path + '.merged.mp4'
        mux_cmd = [
            ffmpeg_exe, '-y',
            '-i', video_path,
            '-i', chosen_audio,
            '-map', '0:v:0', '-map', '1:a:0',
            '-c:v', 'copy',
            '-c:a', 'aac', '-b:a', '160k',
            '-shortest',
            merged,
        ]
        mux_res = subprocess.run(mux_cmd, capture_output=True, text=True, timeout=300)
        if os.path.exists(merged) and os.path.getsize(merged) > 10000:
            os.replace(merged, video_path)
            try:
                os.remove(chosen_audio)
            except Exception:
                pass
            print("[Audio] Mux audio BERHASIL -> video kini memiliki track audio")
            return video_path
        print(f"[Audio] Mux gagal: {mux_res.stderr[:200]}")
    except Exception as e:
        print(f"[Audio] ensure_audio_stream error: {e}")
    return video_path


def process_clip(url, start_sec, end_sec, output_path, cookies_path=None, job_path=None):
    ffmpeg_exe = get_ffmpeg_path()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)

    start_sec = max(0.0, float(start_sec))
    end_sec = float(end_sec)
    duration = max(3.0, end_sec - start_sec)

    print(f"[KlipChip Worker] Processing: {url}")
    print(f"[KlipChip Worker] Time Range: {start_sec}s -> {end_sec}s ({duration}s)")
    print(f"[KlipChip Worker] FFmpeg: {ffmpeg_exe}")

    output_abs = os.path.abspath(output_path)
    output_dir = os.path.dirname(output_abs)
    os.makedirs(output_dir, exist_ok=True)
    temp_raw = output_abs.replace(".mp4", "_raw.mp4")

    # Check cookies
    has_valid_cookies = cookies_path and os.path.exists(cookies_path) and os.path.getsize(cookies_path) > 100

    # Download Strategies inspired by Anil-matcha & jipraks repos
    strategies = []

    # Strategy 1: VisionOS / Default extractor with format fallback (Proven 100% working)
    strategies.append([
        sys.executable, '-m', 'yt_dlp',
        '--extractor-args', 'youtube:player_client=visionos,android,web',
        '--download-sections', f'*{start_sec}-{end_sec}',
        '--force-keyframes-at-cuts',
        '-f', '137+140/136+140/bv*[height<=1080]+ba*/bestvideo[height<=1080]+bestaudio/best',
        '-o', temp_raw,
        '--no-playlist',
        '--ffmpeg-location', ffmpeg_dir,
        url
    ])

    # Strategy 2: Direct 137+140 without extractor args
    strategies.append([
        sys.executable, '-m', 'yt_dlp',
        '--download-sections', f'*{start_sec}-{end_sec}',
        '--force-keyframes-at-cuts',
        '-f', '135+140/bestvideo[height<=1080]+bestaudio/best',
        '-o', temp_raw,
        '--no-playlist',
        '--ffmpeg-location', ffmpeg_dir,
        url
    ])

    # Strategy 3: Cookies strategy (if provided)
    if has_valid_cookies:
        strategies.append([
            sys.executable, '-m', 'yt_dlp',
            '--cookies', cookies_path,
            '--download-sections', f'*{start_sec}-{end_sec}',
            '--force-keyframes-at-cuts',
            '-f', '134+140/bestvideo+bestaudio/best',
            '-o', temp_raw,
            '--no-playlist',
            '--ffmpeg-location', ffmpeg_dir,
            url
        ])

    chosen_raw = None
    last_error = ""

    for idx, cmd in enumerate(strategies, 1):
        print(f"\n[Worker] Trying Download Strategy #{idx}...")
        try:
            res = subprocess.run(cmd, capture_output=True, text=True)

            # Check if temp_raw was generated
            raw_candidates = [
                os.path.join(os.path.dirname(output_abs), f)
                for f in os.listdir(os.path.dirname(output_abs))
                if f.startswith(os.path.basename(temp_raw).replace(".mp4", "")) and f.endswith(".mp4")
            ]

            if os.path.exists(temp_raw):
                chosen_raw = temp_raw
                print(f"[Worker] Strategy #{idx} Succeeded!")
                break
            elif raw_candidates:
                chosen_raw = raw_candidates[0]
                print(f"[Worker] Strategy #{idx} Succeeded (matched candidate): {chosen_raw}")
                break
            else:
                last_error = res.stderr or res.stdout
                print(f"[Worker] Strategy #{idx} failed, stderr: {res.stderr[:200]}")
        except Exception as e:
            last_error = str(e)
            print(f"[Worker] Strategy #{idx} exception: {e}")

    if not chosen_raw or not os.path.exists(chosen_raw):
        raise RuntimeError(f"Gagal mengunduh klip YouTube. Error: {last_error[:300]}")

    # 1b. Pastikan segment punya audio (yt-dlp kadang mengembalikan video-only)
    chosen_raw = ensure_audio_stream(chosen_raw, url, ffmpeg_exe, os.path.dirname(chosen_raw), cookies_path if has_valid_cookies else None, start_sec, end_sec)

    # 2. Dapatkan caption sesuai subtitleSource: whisper / youtube / manual / none
    captions = []
    config = {}
    language = 'auto'
    layout = 'auto'
    subtitle_source = 'auto'
    bilingual = False
    secondary_language = 'en'
    if job_path and os.path.exists(job_path):
        try:
            with open(job_path, 'r', encoding='utf-8') as jf:
                job = json.load(jf)
            captions = job.get('captions') or []
            config = job.get('captionConfig') or {}
            language = job.get('language') or 'auto'
            layout = job.get('layout') or 'auto'
            subtitle_source = job.get('subtitleSource') or 'auto'
            bilingual = bool(job.get('bilingualSubtitles') or False)
            secondary_language = job.get('secondaryLanguage') or 'en'
        except Exception as e:
            print(f"[Worker] Gagal baca job JSON: {e}")

    is_http_source = bool(url.startswith('http'))

    # Sumber subtitle: none = tanpa subtitle
    if subtitle_source == 'none':
        captions = []
        print("[Worker] Subtitle dimatikan (subtitleSource=none)")

    # Transkripsi real via Whisper (auto / whisper)
    elif subtitle_source in ('auto', 'whisper') and is_http_source and chosen_raw and os.path.exists(chosen_raw):
        whisper_caps = transcribe_with_whisper(chosen_raw, start_sec, end_sec, language)
        if whisper_caps:
            captions = whisper_caps
            print(f"[Worker] Menggunakan {len(captions)} caption REAL dari Whisper (lang={language})")
        else:
            print("[Worker] Whisper gagal/tidak ada, fallback ke caption job JSON")

    # Caption bawaan YouTube via yt-dlp SRT
    elif subtitle_source == 'youtube' and is_http_source:
        yt_caps = download_youtube_subtitles(url, start_sec, end_sec, language)
        if yt_caps:
            captions = yt_caps
        else:
            print("[Worker] Caption YouTube tidak tersedia, fallback ke caption job JSON")

    # manual / auto tanpa whisper: pakai caption dari job JSON (hasil edit pengguna)

    # 3. Bangun file ASS bila ada captions
    translations = []
    if bilingual and captions:
        try:
            texts = [str(c.get('text') or '') for c in captions]
            print(f"[Worker] Menerjemahkan {len(texts)} baris ke '{secondary_language}'...")
            translations = translate_lines(texts, secondary_language)
            if not any(str(t or '').strip() for t in translations):
                translations = []
                print("[Worker] Terjemahan kosong, lanjut single-track")
            else:
                print(f"[Worker] Terjemahan siap untuk {sum(1 for t in translations if t.strip())} baris")
        except Exception as e:
            print(f"[Worker] Translate error, lanjut single-track: {e}")
            translations = []

    ass_path = None
    if captions:
        try:
            ass_path = os.path.splitext(output_abs)[0] + '.ass'
            build_ass_file(captions, config, start_sec, end_sec, ass_path, translations)
            print(f"[Worker] Caption ASS dibuat: {ass_path} ({len(captions)} baris)")
        except Exception as e:
            print(f"[Worker] Gagal membuat subtitle ASS, lanjut tanpa caption: {e}")
            ass_path = None

    # 3. Face-aware crop (seperti KlipAja Face Tracking) + 9:16 scaling + burn caption
    sub_arg = os.path.basename(ass_path) if ass_path else None
    center_crop = "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,setsar=1"

    if layout in ('fit_blur', 'crop_1_1_blur', 'split'):
        # === Filter complex: background blur / split screen ===
        if layout == 'split':
            # Belah layar kiri-kanan (gameplay + kamera stream)
            fc = (
                "[0:v]crop=iw/2:ih:0:0,scale=540:1920:flags=lanczos[left];"
                "[0:v]crop=iw/2:ih:iw/2:0,scale=540:1920:flags=lanczos[right];"
                "[left][right]hstack,setsar=1[vout]"
            )
            print("[Layout] Split screen (kiri-kanan) 2x540x1920")
        elif layout == 'crop_1_1_blur':
            # Crop persegi 1:1 di tengah, sisanya diisi background blur
            fc = (
                "[0:v]split=2[bg][fg];"
                "[bg]crop=ih:ih:(iw-ih)/2:0,scale=1080:1920:force_original_aspect_ratio=increase,"
                "crop=1080:1920,boxblur=20:5[bgb];"
                "[fg]crop=ih:ih:(iw-ih)/2:0,scale=1080:1080:flags=lanczos[fgf];"
                "[bgb][fgf]overlay=0:(H-h)/2,setsar=1[vout]"
            )
            print("[Layout] Crop 1:1 + background blur")
        else:
            # Fit penuh 9:16 di tengah + background blur (letterbox blur)
            fc = (
                "[0:v]split=2[bg][fg];"
                "[bg]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bgb];"
                "[fg]scale=1080:1920:force_original_aspect_ratio=decrease:flags=lanczos[fgf];"
                "[bgb][fgf]overlay=(W-w)/2:(H-h)/2,setsar=1[vout]"
            )
            print("[Layout] Fit penuh + background blur")

        if sub_arg:
            fc += f",subtitles={sub_arg}"

        ffmpeg_cmd = [
            ffmpeg_exe,
            '-y',
            '-i', chosen_raw,
            '-filter_complex', fc,
            '-map', '[vout]',
            '-map', '0:a:0?',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '20',
            '-c:a', 'aac',
            '-b:a', '192k',
            output_abs
        ]

        print("\n[FFmpeg] Encoding 1080x1920 Vertical 9:16 MP4 (layout complex) dengan caption terbakar...")
        ff_res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, cwd=output_dir)

    else:
        # === Layout sederhana: gameplay / face / auto (center crop) ===
        face_center = None
        if layout in ('auto', 'face'):
            face_center = detect_face_center(chosen_raw)

        if face_center is not None:
            dims = get_video_dimensions_cv2(chosen_raw)
            if dims:
                w, h = dims
                crop_w = h * 9 / 16
                x = int(face_center - crop_w / 2)
                x = max(0, min(x, int(w - crop_w)))
                vf_filter = f"crop=ih*9/16:ih:{x}:0,scale=1080:1920:flags=lanczos,setsar=1"
                print(f"[Face] Face tracking aktif: center_x={face_center:.0f}, crop_x={x} (video {w}x{h})")
            else:
                vf_filter = center_crop
                print("[Face] Gagal baca dimensi, fallback center crop")
        else:
            vf_filter = center_crop
            if layout in ('auto', 'face'):
                print("[Face] Tidak ada wajah terdeteksi, fallback center crop")

        if sub_arg:
            vf_filter += f",subtitles={sub_arg}"

        ffmpeg_cmd = [
            ffmpeg_exe,
            '-y',
            '-i', chosen_raw,
            '-vf', vf_filter,
            '-map', '0:v:0',
            '-map', '0:a:0?',
            '-c:v', 'libx264',
            '-preset', 'medium',
            '-crf', '20',
            '-c:a', 'aac',
            '-b:a', '192k',
            output_abs
        ]

        print("\n[FFmpeg] Encoding 1080x1920 Vertical 9:16 MP4 dengan caption terbakar...")
        ff_res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, cwd=output_dir)

    # Cleanup raw temporary download & ass
    try:
        if os.path.exists(chosen_raw) and chosen_raw != output_abs:
            os.remove(chosen_raw)
    except Exception as e:
        print("Note on cleanup:", e)
    try:
        if ass_path and os.path.exists(ass_path):
            os.remove(ass_path)
    except Exception as e:
        print("Note on ass cleanup:", e)

    if not os.path.exists(output_abs):
        raise RuntimeError(f"FFmpeg error: {ff_res.stderr[:300]}")

    file_size_mb = os.path.getsize(output_abs) / (1024 * 1024)
    print(f"\n[SUCCESS] 9:16 Video Ready: {output_abs} ({file_size_mb:.2f} MB)")
    return output_abs


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python clip_worker.py <url> <start_sec> <end_sec> <output_path> [cookies_path] [job_json_path]")
        sys.exit(1)

    url_arg = sys.argv[1]
    start_arg = float(sys.argv[2])
    end_arg = float(sys.argv[3])
    out_arg = sys.argv[4]
    cook_arg = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] else None
    job_arg = sys.argv[6] if len(sys.argv) > 6 and sys.argv[6] else None

    process_clip(url_arg, start_arg, end_arg, out_arg, cook_arg, job_arg)
