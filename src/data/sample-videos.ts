import { SourceVideo, HighlightCandidate, CaptionLine } from '@/lib/types';

export interface PresetVideoItem {
  video: SourceVideo;
  highlights: HighlightCandidate[];
  captionsMap: Record<string, CaptionLine[]>; // key is highlightId
}

// Data preset dibuat dari ANALISIS ASLI (/api/extract-metadata) terhadap video YouTube:
// transcript auto-caption (id) + envelope audio RMS + scoring data-driven.
// Jangan diedit manual; regenerate via scripts/build-presets.cjs
export const PRESET_VIDEOS: PresetVideoItem[] = [
  {
    "video": {
      "id": "video-1",
      "platform": "youtube",
      "sourceUrl": "https://www.youtube.com/watch?v=tdkHDRAD-W0",
      "externalId": "tdkHDRAD-W0",
      "title": "KITA MERAMPOK CASINO TERBESAR DAN TERKAYA! GTA Online",
      "channelName": "Windah Basudara",
      "durationSeconds": 10425,
      "thumbnailUrl": "https://i.ytimg.com/vi/tdkHDRAD-W0/maxresdefault.jpg",
      "viewsCount": "3.598.087 views",
      "status": "ready",
      "audioWaveform": [
        88,
        80,
        80,
        21,
        80,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12
      ],
      "chatVelocity": [
        20,
        3,
        4,
        5,
        5,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    "highlights": [
      {
        "id": "hl-video-1-1",
        "sourceVideoId": "video-1",
        "title": "Puncak reaksi dan kali ini Guys kita bakal",
        "startSeconds": 10,
        "endSeconds": 40,
        "duration": 30,
        "audioScore": 95,
        "chatScore": 75,
        "totalScore": 82,
        "tags": [
          "BOCIL",
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"dan kali ini Guys kita bakal main GTA online lagi bersama teman-teman dari online lagi bersama teman-teman dari\" â 1 slang terdeteksi di window ini.",
        "chatSpikeReason": "Audio peak 100/100 â¢ 44 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-1-2",
        "sourceVideoId": "video-1",
        "title": "Puncak reaksi terus kapan dong",
        "startSeconds": 960,
        "endSeconds": 990,
        "duration": 30,
        "audioScore": 95,
        "chatScore": 74,
        "totalScore": 81,
        "tags": [
          "BOCIL",
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"terus kapan dong terus kapan dong bukan ini salah salah bukan ke situ yang\" â 1 slang terdeteksi di window ini.",
        "chatSpikeReason": "Audio peak 100/100 â¢ 22 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-1-3",
        "sourceVideoId": "video-1",
        "title": "Puncak reaksi kita absen dulu ada Sandy ada",
        "startSeconds": 60,
        "endSeconds": 90,
        "duration": 30,
        "audioScore": 95,
        "chatScore": 74,
        "totalScore": 80,
        "tags": [
          "BOCIL",
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"kita absen dulu ada Sandy ada rijat ada kita absen dulu ada Sandy ada rijat ada Bocil morder Semoga tidak ada\" â 1 slang terdeteksi di window ini.",
        "chatSpikeReason": "Audio peak 100/100 â¢ 30 aktivitas/tdk pada momen ini"
      }
    ],
    "captionsMap": {
      "hl-video-1-1": [
        {
          "id": "cap-hl-tdkHDRAD-W0-1-10000-0",
          "startSeconds": 10,
          "endSeconds": 11.27,
          "text": "dan kali ini Guys kita bakal main GTA online lagi bersama teman-teman dari",
          "words": [
            {
              "word": "dan",
              "startOffset": 0,
              "endOffset": 0.1
            },
            {
              "word": "kali",
              "startOffset": 0.1,
              "endOffset": 0.2
            },
            {
              "word": "ini",
              "startOffset": 0.2,
              "endOffset": 0.29
            },
            {
              "word": "Guys",
              "startOffset": 0.29,
              "endOffset": 0.39
            },
            {
              "word": "kita",
              "startOffset": 0.39,
              "endOffset": 0.49
            },
            {
              "word": "bakal",
              "startOffset": 0.49,
              "endOffset": 0.59
            },
            {
              "word": "main",
              "startOffset": 0.59,
              "endOffset": 0.68
            },
            {
              "word": "GTA",
              "startOffset": 0.68,
              "endOffset": 0.78
            },
            {
              "word": "online",
              "startOffset": 0.78,
              "endOffset": 0.88
            },
            {
              "word": "lagi",
              "startOffset": 0.88,
              "endOffset": 0.98
            },
            {
              "word": "bersama",
              "startOffset": 0.98,
              "endOffset": 1.07
            },
            {
              "word": "teman-teman",
              "startOffset": 1.07,
              "endOffset": 1.17
            },
            {
              "word": "dari",
              "startOffset": 1.17,
              "endOffset": 1.27
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-11280-1",
          "startSeconds": 11.28,
          "endSeconds": 14.21,
          "text": "online lagi bersama teman-teman dari Jaya sprot ya Ada Bang rijat Ada Bang",
          "words": [
            {
              "word": "online",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "lagi",
              "startOffset": 0.23,
              "endOffset": 0.45
            },
            {
              "word": "bersama",
              "startOffset": 0.45,
              "endOffset": 0.68
            },
            {
              "word": "teman-teman",
              "startOffset": 0.68,
              "endOffset": 0.9
            },
            {
              "word": "dari",
              "startOffset": 0.9,
              "endOffset": 1.13
            },
            {
              "word": "Jaya",
              "startOffset": 1.13,
              "endOffset": 1.35
            },
            {
              "word": "sprot",
              "startOffset": 1.35,
              "endOffset": 1.58
            },
            {
              "word": "ya",
              "startOffset": 1.58,
              "endOffset": 1.8
            },
            {
              "word": "Ada",
              "startOffset": 1.8,
              "endOffset": 2.03
            },
            {
              "word": "Bang",
              "startOffset": 2.03,
              "endOffset": 2.25
            },
            {
              "word": "rijat",
              "startOffset": 2.25,
              "endOffset": 2.48
            },
            {
              "word": "Ada",
              "startOffset": 2.48,
              "endOffset": 2.7
            },
            {
              "word": "Bang",
              "startOffset": 2.7,
              "endOffset": 2.93
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-14219-2",
          "startSeconds": 14.22,
          "endSeconds": 16.49,
          "text": "Jaya sprot ya Ada Bang rijat Ada Bang Rio Bang Sandi dan kali ini guys",
          "words": [
            {
              "word": "Jaya",
              "startOffset": 0,
              "endOffset": 0.15
            },
            {
              "word": "sprot",
              "startOffset": 0.15,
              "endOffset": 0.3
            },
            {
              "word": "ya",
              "startOffset": 0.3,
              "endOffset": 0.45
            },
            {
              "word": "Ada",
              "startOffset": 0.45,
              "endOffset": 0.61
            },
            {
              "word": "Bang",
              "startOffset": 0.61,
              "endOffset": 0.76
            },
            {
              "word": "rijat",
              "startOffset": 0.76,
              "endOffset": 0.91
            },
            {
              "word": "Ada",
              "startOffset": 0.91,
              "endOffset": 1.06
            },
            {
              "word": "Bang",
              "startOffset": 1.06,
              "endOffset": 1.21
            },
            {
              "word": "Rio",
              "startOffset": 1.21,
              "endOffset": 1.36
            },
            {
              "word": "Bang",
              "startOffset": 1.36,
              "endOffset": 1.51
            },
            {
              "word": "Sandi",
              "startOffset": 1.51,
              "endOffset": 1.67
            },
            {
              "word": "dan",
              "startOffset": 1.67,
              "endOffset": 1.82
            },
            {
              "word": "kali",
              "startOffset": 1.82,
              "endOffset": 1.97
            },
            {
              "word": "ini",
              "startOffset": 1.97,
              "endOffset": 2.12
            },
            {
              "word": "guys",
              "startOffset": 2.12,
              "endOffset": 2.27
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-16500-3",
          "startSeconds": 16.5,
          "endSeconds": 18.17,
          "text": "Rio Bang Sandi dan kali ini guys sebelumnya gua udah bikin konten sama",
          "words": [
            {
              "word": "Rio",
              "startOffset": 0,
              "endOffset": 0.13
            },
            {
              "word": "Bang",
              "startOffset": 0.13,
              "endOffset": 0.26
            },
            {
              "word": "Sandi",
              "startOffset": 0.26,
              "endOffset": 0.39
            },
            {
              "word": "dan",
              "startOffset": 0.39,
              "endOffset": 0.51
            },
            {
              "word": "kali",
              "startOffset": 0.51,
              "endOffset": 0.64
            },
            {
              "word": "ini",
              "startOffset": 0.64,
              "endOffset": 0.77
            },
            {
              "word": "guys",
              "startOffset": 0.77,
              "endOffset": 0.9
            },
            {
              "word": "sebelumnya",
              "startOffset": 0.9,
              "endOffset": 1.03
            },
            {
              "word": "gua",
              "startOffset": 1.03,
              "endOffset": 1.16
            },
            {
              "word": "udah",
              "startOffset": 1.16,
              "endOffset": 1.28
            },
            {
              "word": "bikin",
              "startOffset": 1.28,
              "endOffset": 1.41
            },
            {
              "word": "konten",
              "startOffset": 1.41,
              "endOffset": 1.54
            },
            {
              "word": "sama",
              "startOffset": 1.54,
              "endOffset": 1.67
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-18180-4",
          "startSeconds": 18.18,
          "endSeconds": 19.69,
          "text": "sebelumnya gua udah bikin konten sama anak-anak",
          "words": [
            {
              "word": "sebelumnya",
              "startOffset": 0,
              "endOffset": 0.22
            },
            {
              "word": "gua",
              "startOffset": 0.22,
              "endOffset": 0.43
            },
            {
              "word": "udah",
              "startOffset": 0.43,
              "endOffset": 0.65
            },
            {
              "word": "bikin",
              "startOffset": 0.65,
              "endOffset": 0.86
            },
            {
              "word": "konten",
              "startOffset": 0.86,
              "endOffset": 1.08
            },
            {
              "word": "sama",
              "startOffset": 1.08,
              "endOffset": 1.29
            },
            {
              "word": "anak-anak",
              "startOffset": 1.29,
              "endOffset": 1.51
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-19699-5",
          "startSeconds": 19.7,
          "endSeconds": 22.13,
          "text": "anak-anak rampok kayak perico Sekarang kita mau",
          "words": [
            {
              "word": "anak-anak",
              "startOffset": 0,
              "endOffset": 0.35
            },
            {
              "word": "rampok",
              "startOffset": 0.35,
              "endOffset": 0.69
            },
            {
              "word": "kayak",
              "startOffset": 0.69,
              "endOffset": 1.04
            },
            {
              "word": "perico",
              "startOffset": 1.04,
              "endOffset": 1.39
            },
            {
              "word": "Sekarang",
              "startOffset": 1.39,
              "endOffset": 1.74
            },
            {
              "word": "kita",
              "startOffset": 1.74,
              "endOffset": 2.08
            },
            {
              "word": "mau",
              "startOffset": 2.08,
              "endOffset": 2.43
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-22140-6",
          "startSeconds": 22.14,
          "endSeconds": 24.83,
          "text": "rampok kayak perico Sekarang kita mau merampok Diamond Heist atau Casino",
          "words": [
            {
              "word": "rampok",
              "startOffset": 0,
              "endOffset": 0.24
            },
            {
              "word": "kayak",
              "startOffset": 0.24,
              "endOffset": 0.49
            },
            {
              "word": "perico",
              "startOffset": 0.49,
              "endOffset": 0.73
            },
            {
              "word": "Sekarang",
              "startOffset": 0.73,
              "endOffset": 0.98
            },
            {
              "word": "kita",
              "startOffset": 0.98,
              "endOffset": 1.22
            },
            {
              "word": "mau",
              "startOffset": 1.22,
              "endOffset": 1.47
            },
            {
              "word": "merampok",
              "startOffset": 1.47,
              "endOffset": 1.71
            },
            {
              "word": "Diamond",
              "startOffset": 1.71,
              "endOffset": 1.96
            },
            {
              "word": "Heist",
              "startOffset": 1.96,
              "endOffset": 2.2
            },
            {
              "word": "atau",
              "startOffset": 2.2,
              "endOffset": 2.45
            },
            {
              "word": "Casino",
              "startOffset": 2.45,
              "endOffset": 2.69
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-24840-7",
          "startSeconds": 24.84,
          "endSeconds": 27.65,
          "text": "merampok Diamond Heist atau Casino terbesar ya Semoga nggak ada Bocil mode",
          "words": [
            {
              "word": "merampok",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "Diamond",
              "startOffset": 0.23,
              "endOffset": 0.47
            },
            {
              "word": "Heist",
              "startOffset": 0.47,
              "endOffset": 0.7
            },
            {
              "word": "atau",
              "startOffset": 0.7,
              "endOffset": 0.94
            },
            {
              "word": "Casino",
              "startOffset": 0.94,
              "endOffset": 1.17
            },
            {
              "word": "terbesar",
              "startOffset": 1.17,
              "endOffset": 1.4
            },
            {
              "word": "ya",
              "startOffset": 1.4,
              "endOffset": 1.64
            },
            {
              "word": "Semoga",
              "startOffset": 1.64,
              "endOffset": 1.87
            },
            {
              "word": "nggak",
              "startOffset": 1.87,
              "endOffset": 2.11
            },
            {
              "word": "ada",
              "startOffset": 2.11,
              "endOffset": 2.34
            },
            {
              "word": "Bocil",
              "startOffset": 2.34,
              "endOffset": 2.58,
              "isSlang": true,
              "normalizedFrom": "bocil"
            },
            {
              "word": "mode",
              "startOffset": 2.58,
              "endOffset": 2.81
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-27660-8",
          "startSeconds": 27.66,
          "endSeconds": 29.87,
          "text": "terbesar ya Semoga nggak ada Bocil mode teman-teman dan lancar ya",
          "words": [
            {
              "word": "terbesar",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "ya",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "Semoga",
              "startOffset": 0.4,
              "endOffset": 0.6
            },
            {
              "word": "nggak",
              "startOffset": 0.6,
              "endOffset": 0.8
            },
            {
              "word": "ada",
              "startOffset": 0.8,
              "endOffset": 1
            },
            {
              "word": "Bocil",
              "startOffset": 1,
              "endOffset": 1.21,
              "isSlang": true,
              "normalizedFrom": "bocil"
            },
            {
              "word": "mode",
              "startOffset": 1.21,
              "endOffset": 1.41
            },
            {
              "word": "teman-teman",
              "startOffset": 1.41,
              "endOffset": 1.61
            },
            {
              "word": "dan",
              "startOffset": 1.61,
              "endOffset": 1.81
            },
            {
              "word": "lancar",
              "startOffset": 1.81,
              "endOffset": 2.01
            },
            {
              "word": "ya",
              "startOffset": 2.01,
              "endOffset": 2.21
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-29880-9",
          "startSeconds": 29.88,
          "endSeconds": 33.23,
          "text": "teman-teman dan lancar ya sampai di tujuan dengan selamat coy dan",
          "words": [
            {
              "word": "teman-teman",
              "startOffset": 0,
              "endOffset": 0.3
            },
            {
              "word": "dan",
              "startOffset": 0.3,
              "endOffset": 0.61
            },
            {
              "word": "lancar",
              "startOffset": 0.61,
              "endOffset": 0.91
            },
            {
              "word": "ya",
              "startOffset": 0.91,
              "endOffset": 1.22
            },
            {
              "word": "sampai",
              "startOffset": 1.22,
              "endOffset": 1.52
            },
            {
              "word": "di",
              "startOffset": 1.52,
              "endOffset": 1.83
            },
            {
              "word": "tujuan",
              "startOffset": 1.83,
              "endOffset": 2.13
            },
            {
              "word": "dengan",
              "startOffset": 2.13,
              "endOffset": 2.44
            },
            {
              "word": "selamat",
              "startOffset": 2.44,
              "endOffset": 2.74
            },
            {
              "word": "coy",
              "startOffset": 2.74,
              "endOffset": 3.04
            },
            {
              "word": "dan",
              "startOffset": 3.04,
              "endOffset": 3.35
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-33239-10",
          "startSeconds": 33.24,
          "endSeconds": 34.73,
          "text": "sampai di tujuan dengan selamat coy dan jangan lupa subscribe teman-teman gua",
          "words": [
            {
              "word": "sampai",
              "startOffset": 0,
              "endOffset": 0.12
            },
            {
              "word": "di",
              "startOffset": 0.12,
              "endOffset": 0.25
            },
            {
              "word": "tujuan",
              "startOffset": 0.25,
              "endOffset": 0.37
            },
            {
              "word": "dengan",
              "startOffset": 0.37,
              "endOffset": 0.5
            },
            {
              "word": "selamat",
              "startOffset": 0.5,
              "endOffset": 0.62
            },
            {
              "word": "coy",
              "startOffset": 0.62,
              "endOffset": 0.75
            },
            {
              "word": "dan",
              "startOffset": 0.75,
              "endOffset": 0.87
            },
            {
              "word": "jangan",
              "startOffset": 0.87,
              "endOffset": 0.99
            },
            {
              "word": "lupa",
              "startOffset": 0.99,
              "endOffset": 1.12
            },
            {
              "word": "subscribe",
              "startOffset": 1.12,
              "endOffset": 1.24
            },
            {
              "word": "teman-teman",
              "startOffset": 1.24,
              "endOffset": 1.37
            },
            {
              "word": "gua",
              "startOffset": 1.37,
              "endOffset": 1.49
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-34739-11",
          "startSeconds": 34.74,
          "endSeconds": 37.67,
          "text": "jangan lupa subscribe teman-teman gua linknya ada di deskripsi udah pada 100",
          "words": [
            {
              "word": "jangan",
              "startOffset": 0,
              "endOffset": 0.24
            },
            {
              "word": "lupa",
              "startOffset": 0.24,
              "endOffset": 0.49
            },
            {
              "word": "subscribe",
              "startOffset": 0.49,
              "endOffset": 0.73
            },
            {
              "word": "teman-teman",
              "startOffset": 0.73,
              "endOffset": 0.98
            },
            {
              "word": "gua",
              "startOffset": 0.98,
              "endOffset": 1.22
            },
            {
              "word": "linknya",
              "startOffset": 1.22,
              "endOffset": 1.47
            },
            {
              "word": "ada",
              "startOffset": 1.47,
              "endOffset": 1.71
            },
            {
              "word": "di",
              "startOffset": 1.71,
              "endOffset": 1.95
            },
            {
              "word": "deskripsi",
              "startOffset": 1.95,
              "endOffset": 2.2
            },
            {
              "word": "udah",
              "startOffset": 2.2,
              "endOffset": 2.44
            },
            {
              "word": "pada",
              "startOffset": 2.44,
              "endOffset": 2.69
            },
            {
              "word": "100",
              "startOffset": 2.69,
              "endOffset": 2.93
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-1-37680-12",
          "startSeconds": 37.68,
          "endSeconds": 40,
          "text": "linknya ada di deskripsi udah pada 100 ribu semua guys Bang Reza sedikit lagi",
          "words": [
            {
              "word": "linknya",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "ada",
              "startOffset": 0.17,
              "endOffset": 0.33
            },
            {
              "word": "di",
              "startOffset": 0.33,
              "endOffset": 0.5
            },
            {
              "word": "deskripsi",
              "startOffset": 0.5,
              "endOffset": 0.66
            },
            {
              "word": "udah",
              "startOffset": 0.66,
              "endOffset": 0.83
            },
            {
              "word": "pada",
              "startOffset": 0.83,
              "endOffset": 0.99
            },
            {
              "word": "100",
              "startOffset": 0.99,
              "endOffset": 1.16
            },
            {
              "word": "ribu",
              "startOffset": 1.16,
              "endOffset": 1.33
            },
            {
              "word": "semua",
              "startOffset": 1.33,
              "endOffset": 1.49
            },
            {
              "word": "guys",
              "startOffset": 1.49,
              "endOffset": 1.66
            },
            {
              "word": "Bang",
              "startOffset": 1.66,
              "endOffset": 1.82
            },
            {
              "word": "Reza",
              "startOffset": 1.82,
              "endOffset": 1.99
            },
            {
              "word": "sedikit",
              "startOffset": 1.99,
              "endOffset": 2.15
            },
            {
              "word": "lagi",
              "startOffset": 2.15,
              "endOffset": 2.32
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-1-2": [
        {
          "id": "cap-hl-tdkHDRAD-W0-2-968880-0",
          "startSeconds": 968.88,
          "endSeconds": 972.71,
          "text": "terus kapan dong bukan ini salah salah bukan ke situ yang",
          "words": [
            {
              "word": "terus",
              "startOffset": 0,
              "endOffset": 0.35
            },
            {
              "word": "kapan",
              "startOffset": 0.35,
              "endOffset": 0.7
            },
            {
              "word": "dong",
              "startOffset": 0.7,
              "endOffset": 1.04
            },
            {
              "word": "bukan",
              "startOffset": 1.04,
              "endOffset": 1.39
            },
            {
              "word": "ini",
              "startOffset": 1.39,
              "endOffset": 1.74
            },
            {
              "word": "salah",
              "startOffset": 1.74,
              "endOffset": 2.09
            },
            {
              "word": "salah",
              "startOffset": 2.09,
              "endOffset": 2.44
            },
            {
              "word": "bukan",
              "startOffset": 2.44,
              "endOffset": 2.79
            },
            {
              "word": "ke",
              "startOffset": 2.79,
              "endOffset": 3.13
            },
            {
              "word": "situ",
              "startOffset": 3.13,
              "endOffset": 3.48
            },
            {
              "word": "yang",
              "startOffset": 3.48,
              "endOffset": 3.83
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-972720-1",
          "startSeconds": 972.72,
          "endSeconds": 974.57,
          "text": "bukan ini salah salah bukan ke situ yang gambar mobil cok",
          "words": [
            {
              "word": "bukan",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "ini",
              "startOffset": 0.17,
              "endOffset": 0.34
            },
            {
              "word": "salah",
              "startOffset": 0.34,
              "endOffset": 0.5
            },
            {
              "word": "salah",
              "startOffset": 0.5,
              "endOffset": 0.67
            },
            {
              "word": "bukan",
              "startOffset": 0.67,
              "endOffset": 0.84
            },
            {
              "word": "ke",
              "startOffset": 0.84,
              "endOffset": 1.01
            },
            {
              "word": "situ",
              "startOffset": 1.01,
              "endOffset": 1.18
            },
            {
              "word": "yang",
              "startOffset": 1.18,
              "endOffset": 1.34
            },
            {
              "word": "gambar",
              "startOffset": 1.34,
              "endOffset": 1.51
            },
            {
              "word": "mobil",
              "startOffset": 1.51,
              "endOffset": 1.68
            },
            {
              "word": "cok",
              "startOffset": 1.68,
              "endOffset": 1.85
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-974579-2",
          "startSeconds": 974.58,
          "endSeconds": 978.53,
          "text": "gambar mobil cok sorry maaf maaf salah salah Bocil botnya",
          "words": [
            {
              "word": "gambar",
              "startOffset": 0,
              "endOffset": 0.4
            },
            {
              "word": "mobil",
              "startOffset": 0.4,
              "endOffset": 0.79
            },
            {
              "word": "cok",
              "startOffset": 0.79,
              "endOffset": 1.19
            },
            {
              "word": "sorry",
              "startOffset": 1.19,
              "endOffset": 1.58
            },
            {
              "word": "maaf",
              "startOffset": 1.58,
              "endOffset": 1.98
            },
            {
              "word": "maaf",
              "startOffset": 1.98,
              "endOffset": 2.37
            },
            {
              "word": "salah",
              "startOffset": 2.37,
              "endOffset": 2.77
            },
            {
              "word": "salah",
              "startOffset": 2.77,
              "endOffset": 3.16
            },
            {
              "word": "Bocil",
              "startOffset": 3.16,
              "endOffset": 3.56,
              "isSlang": true,
              "normalizedFrom": "bocil"
            },
            {
              "word": "botnya",
              "startOffset": 3.56,
              "endOffset": 3.95
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-978540-3",
          "startSeconds": 978.54,
          "endSeconds": 980.71,
          "text": "sorry maaf maaf salah salah Bocil botnya guys",
          "words": [
            {
              "word": "sorry",
              "startOffset": 0,
              "endOffset": 0.27
            },
            {
              "word": "maaf",
              "startOffset": 0.27,
              "endOffset": 0.54
            },
            {
              "word": "maaf",
              "startOffset": 0.54,
              "endOffset": 0.81
            },
            {
              "word": "salah",
              "startOffset": 0.81,
              "endOffset": 1.09
            },
            {
              "word": "salah",
              "startOffset": 1.09,
              "endOffset": 1.36
            },
            {
              "word": "Bocil",
              "startOffset": 1.36,
              "endOffset": 1.63,
              "isSlang": true,
              "normalizedFrom": "bocil"
            },
            {
              "word": "botnya",
              "startOffset": 1.63,
              "endOffset": 1.9
            },
            {
              "word": "guys",
              "startOffset": 1.9,
              "endOffset": 2.17
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-983459-4",
          "startSeconds": 983.46,
          "endSeconds": 985.37,
          "text": "udah dari pagi mainnya guys udah dari pagi main udah lelah sudah",
          "words": [
            {
              "word": "udah",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "dari",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "pagi",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "mainnya",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "guys",
              "startOffset": 0.64,
              "endOffset": 0.8
            },
            {
              "word": "udah",
              "startOffset": 0.8,
              "endOffset": 0.96
            },
            {
              "word": "dari",
              "startOffset": 0.96,
              "endOffset": 1.11
            },
            {
              "word": "pagi",
              "startOffset": 1.11,
              "endOffset": 1.27
            },
            {
              "word": "main",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "udah",
              "startOffset": 1.43,
              "endOffset": 1.59
            },
            {
              "word": "lelah",
              "startOffset": 1.59,
              "endOffset": 1.75
            },
            {
              "word": "sudah",
              "startOffset": 1.75,
              "endOffset": 1.91
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-985380-5",
          "startSeconds": 985.38,
          "endSeconds": 987.47,
          "text": "udah dari pagi main udah lelah sudah enggak fokus guys",
          "words": [
            {
              "word": "udah",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "dari",
              "startOffset": 0.21,
              "endOffset": 0.42
            },
            {
              "word": "pagi",
              "startOffset": 0.42,
              "endOffset": 0.63
            },
            {
              "word": "main",
              "startOffset": 0.63,
              "endOffset": 0.84
            },
            {
              "word": "udah",
              "startOffset": 0.84,
              "endOffset": 1.05
            },
            {
              "word": "lelah",
              "startOffset": 1.05,
              "endOffset": 1.25
            },
            {
              "word": "sudah",
              "startOffset": 1.25,
              "endOffset": 1.46
            },
            {
              "word": "enggak",
              "startOffset": 1.46,
              "endOffset": 1.67
            },
            {
              "word": "fokus",
              "startOffset": 1.67,
              "endOffset": 1.88
            },
            {
              "word": "guys",
              "startOffset": 1.88,
              "endOffset": 2.09
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-2-987480-6",
          "startSeconds": 987.48,
          "endSeconds": 990,
          "text": "enggak fokus guys sudah pusing guys Sudah tak fokus ini",
          "words": [
            {
              "word": "enggak",
              "startOffset": 0,
              "endOffset": 0.25
            },
            {
              "word": "fokus",
              "startOffset": 0.25,
              "endOffset": 0.5
            },
            {
              "word": "guys",
              "startOffset": 0.5,
              "endOffset": 0.76
            },
            {
              "word": "sudah",
              "startOffset": 0.76,
              "endOffset": 1.01
            },
            {
              "word": "pusing",
              "startOffset": 1.01,
              "endOffset": 1.26
            },
            {
              "word": "guys",
              "startOffset": 1.26,
              "endOffset": 1.51
            },
            {
              "word": "Sudah",
              "startOffset": 1.51,
              "endOffset": 1.76
            },
            {
              "word": "tak",
              "startOffset": 1.76,
              "endOffset": 2.02
            },
            {
              "word": "fokus",
              "startOffset": 2.02,
              "endOffset": 2.27
            },
            {
              "word": "ini",
              "startOffset": 2.27,
              "endOffset": 2.52
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-1-3": [
        {
          "id": "cap-hl-tdkHDRAD-W0-3-61920-0",
          "startSeconds": 61.92,
          "endSeconds": 67.27,
          "text": "kita absen dulu ada Sandy ada rijat ada Bocil morder Semoga tidak ada",
          "words": [
            {
              "word": "kita",
              "startOffset": 0,
              "endOffset": 0.41
            },
            {
              "word": "absen",
              "startOffset": 0.41,
              "endOffset": 0.82
            },
            {
              "word": "dulu",
              "startOffset": 0.82,
              "endOffset": 1.23
            },
            {
              "word": "ada",
              "startOffset": 1.23,
              "endOffset": 1.65
            },
            {
              "word": "Sandy",
              "startOffset": 1.65,
              "endOffset": 2.06
            },
            {
              "word": "ada",
              "startOffset": 2.06,
              "endOffset": 2.47
            },
            {
              "word": "rijat",
              "startOffset": 2.47,
              "endOffset": 2.88
            },
            {
              "word": "ada",
              "startOffset": 2.88,
              "endOffset": 3.29
            },
            {
              "word": "Bocil",
              "startOffset": 3.29,
              "endOffset": 3.7,
              "isSlang": true,
              "normalizedFrom": "bocil"
            },
            {
              "word": "morder",
              "startOffset": 3.7,
              "endOffset": 4.12
            },
            {
              "word": "Semoga",
              "startOffset": 4.12,
              "endOffset": 4.53
            },
            {
              "word": "tidak",
              "startOffset": 4.53,
              "endOffset": 4.94
            },
            {
              "word": "ada",
              "startOffset": 4.94,
              "endOffset": 5.35
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-70380-1",
          "startSeconds": 70.38,
          "endSeconds": 72.25,
          "text": "ini ada live ketujuh gua sangat produktif sekali hari ini teman-teman",
          "words": [
            {
              "word": "ini",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "ada",
              "startOffset": 0.17,
              "endOffset": 0.34
            },
            {
              "word": "live",
              "startOffset": 0.34,
              "endOffset": 0.51
            },
            {
              "word": "ketujuh",
              "startOffset": 0.51,
              "endOffset": 0.68
            },
            {
              "word": "gua",
              "startOffset": 0.68,
              "endOffset": 0.85
            },
            {
              "word": "sangat",
              "startOffset": 0.85,
              "endOffset": 1.02
            },
            {
              "word": "produktif",
              "startOffset": 1.02,
              "endOffset": 1.19
            },
            {
              "word": "sekali",
              "startOffset": 1.19,
              "endOffset": 1.36
            },
            {
              "word": "hari",
              "startOffset": 1.36,
              "endOffset": 1.53
            },
            {
              "word": "ini",
              "startOffset": 1.53,
              "endOffset": 1.7
            },
            {
              "word": "teman-teman",
              "startOffset": 1.7,
              "endOffset": 1.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-72260-2",
          "startSeconds": 72.26,
          "endSeconds": 74.95,
          "text": "produktif sekali hari ini teman-teman semoga masih bisa memberikan tenaga",
          "words": [
            {
              "word": "produktif",
              "startOffset": 0,
              "endOffset": 0.27
            },
            {
              "word": "sekali",
              "startOffset": 0.27,
              "endOffset": 0.54
            },
            {
              "word": "hari",
              "startOffset": 0.54,
              "endOffset": 0.81
            },
            {
              "word": "ini",
              "startOffset": 0.81,
              "endOffset": 1.08
            },
            {
              "word": "teman-teman",
              "startOffset": 1.08,
              "endOffset": 1.34
            },
            {
              "word": "semoga",
              "startOffset": 1.34,
              "endOffset": 1.61
            },
            {
              "word": "masih",
              "startOffset": 1.61,
              "endOffset": 1.88
            },
            {
              "word": "bisa",
              "startOffset": 1.88,
              "endOffset": 2.15
            },
            {
              "word": "memberikan",
              "startOffset": 2.15,
              "endOffset": 2.42
            },
            {
              "word": "tenaga",
              "startOffset": 2.42,
              "endOffset": 2.69
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-74960-3",
          "startSeconds": 74.96,
          "endSeconds": 77.11,
          "text": "semoga masih bisa memberikan tenaga sisa-sisa terakhir",
          "words": [
            {
              "word": "semoga",
              "startOffset": 0,
              "endOffset": 0.31
            },
            {
              "word": "masih",
              "startOffset": 0.31,
              "endOffset": 0.61
            },
            {
              "word": "bisa",
              "startOffset": 0.61,
              "endOffset": 0.92
            },
            {
              "word": "memberikan",
              "startOffset": 0.92,
              "endOffset": 1.23
            },
            {
              "word": "tenaga",
              "startOffset": 1.23,
              "endOffset": 1.54
            },
            {
              "word": "sisa-sisa",
              "startOffset": 1.54,
              "endOffset": 1.84
            },
            {
              "word": "terakhir",
              "startOffset": 1.84,
              "endOffset": 2.15
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-77119-4",
          "startSeconds": 77.12,
          "endSeconds": 81.17,
          "text": "sisa-sisa terakhir Semangat Bro untuk game 3 game lagi",
          "words": [
            {
              "word": "sisa-sisa",
              "startOffset": 0,
              "endOffset": 0.45
            },
            {
              "word": "terakhir",
              "startOffset": 0.45,
              "endOffset": 0.9
            },
            {
              "word": "Semangat",
              "startOffset": 0.9,
              "endOffset": 1.35
            },
            {
              "word": "Bro",
              "startOffset": 1.35,
              "endOffset": 1.8
            },
            {
              "word": "untuk",
              "startOffset": 1.8,
              "endOffset": 2.25
            },
            {
              "word": "game",
              "startOffset": 2.25,
              "endOffset": 2.7
            },
            {
              "word": "3",
              "startOffset": 2.7,
              "endOffset": 3.15
            },
            {
              "word": "game",
              "startOffset": 3.15,
              "endOffset": 3.6
            },
            {
              "word": "lagi",
              "startOffset": 3.6,
              "endOffset": 4.05
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-81180-5",
          "startSeconds": 81.18,
          "endSeconds": 83.87,
          "text": "Semangat Bro untuk game 3 game lagi dan Guys kita harus membeli yang namanya",
          "words": [
            {
              "word": "Semangat",
              "startOffset": 0,
              "endOffset": 0.19
            },
            {
              "word": "Bro",
              "startOffset": 0.19,
              "endOffset": 0.38
            },
            {
              "word": "untuk",
              "startOffset": 0.38,
              "endOffset": 0.58
            },
            {
              "word": "game",
              "startOffset": 0.58,
              "endOffset": 0.77
            },
            {
              "word": "3",
              "startOffset": 0.77,
              "endOffset": 0.96
            },
            {
              "word": "game",
              "startOffset": 0.96,
              "endOffset": 1.15
            },
            {
              "word": "lagi",
              "startOffset": 1.15,
              "endOffset": 1.34
            },
            {
              "word": "dan",
              "startOffset": 1.34,
              "endOffset": 1.54
            },
            {
              "word": "Guys",
              "startOffset": 1.54,
              "endOffset": 1.73
            },
            {
              "word": "kita",
              "startOffset": 1.73,
              "endOffset": 1.92
            },
            {
              "word": "harus",
              "startOffset": 1.92,
              "endOffset": 2.11
            },
            {
              "word": "membeli",
              "startOffset": 2.11,
              "endOffset": 2.31
            },
            {
              "word": "yang",
              "startOffset": 2.31,
              "endOffset": 2.5
            },
            {
              "word": "namanya",
              "startOffset": 2.5,
              "endOffset": 2.69
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-83880-6",
          "startSeconds": 83.88,
          "endSeconds": 86.63,
          "text": "dan Guys kita harus membeli yang namanya arcade dulu ya gua udah diajarin Bang",
          "words": [
            {
              "word": "dan",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "Guys",
              "startOffset": 0.2,
              "endOffset": 0.39
            },
            {
              "word": "kita",
              "startOffset": 0.39,
              "endOffset": 0.59
            },
            {
              "word": "harus",
              "startOffset": 0.59,
              "endOffset": 0.79
            },
            {
              "word": "membeli",
              "startOffset": 0.79,
              "endOffset": 0.98
            },
            {
              "word": "yang",
              "startOffset": 0.98,
              "endOffset": 1.18
            },
            {
              "word": "namanya",
              "startOffset": 1.18,
              "endOffset": 1.38
            },
            {
              "word": "arcade",
              "startOffset": 1.38,
              "endOffset": 1.57
            },
            {
              "word": "dulu",
              "startOffset": 1.57,
              "endOffset": 1.77
            },
            {
              "word": "ya",
              "startOffset": 1.77,
              "endOffset": 1.96
            },
            {
              "word": "gua",
              "startOffset": 1.96,
              "endOffset": 2.16
            },
            {
              "word": "udah",
              "startOffset": 2.16,
              "endOffset": 2.36
            },
            {
              "word": "diajarin",
              "startOffset": 2.36,
              "endOffset": 2.55
            },
            {
              "word": "Bang",
              "startOffset": 2.55,
              "endOffset": 2.75
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-86640-7",
          "startSeconds": 86.64,
          "endSeconds": 89.21,
          "text": "arcade dulu ya gua udah diajarin Bang reject juga kita harus membeli arcket",
          "words": [
            {
              "word": "arcade",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "dulu",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "ya",
              "startOffset": 0.4,
              "endOffset": 0.59
            },
            {
              "word": "gua",
              "startOffset": 0.59,
              "endOffset": 0.79
            },
            {
              "word": "udah",
              "startOffset": 0.79,
              "endOffset": 0.99
            },
            {
              "word": "diajarin",
              "startOffset": 0.99,
              "endOffset": 1.19
            },
            {
              "word": "Bang",
              "startOffset": 1.19,
              "endOffset": 1.38
            },
            {
              "word": "reject",
              "startOffset": 1.38,
              "endOffset": 1.58
            },
            {
              "word": "juga",
              "startOffset": 1.58,
              "endOffset": 1.78
            },
            {
              "word": "kita",
              "startOffset": 1.78,
              "endOffset": 1.98
            },
            {
              "word": "harus",
              "startOffset": 1.98,
              "endOffset": 2.17
            },
            {
              "word": "membeli",
              "startOffset": 2.17,
              "endOffset": 2.37
            },
            {
              "word": "arcket",
              "startOffset": 2.37,
              "endOffset": 2.57
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-tdkHDRAD-W0-3-89220-8",
          "startSeconds": 89.22,
          "endSeconds": 90,
          "text": "reject juga kita harus membeli arcket teman-teman untuk membuat",
          "words": [
            {
              "word": "reject",
              "startOffset": 0,
              "endOffset": 0.09
            },
            {
              "word": "juga",
              "startOffset": 0.09,
              "endOffset": 0.17
            },
            {
              "word": "kita",
              "startOffset": 0.17,
              "endOffset": 0.26
            },
            {
              "word": "harus",
              "startOffset": 0.26,
              "endOffset": 0.35
            },
            {
              "word": "membeli",
              "startOffset": 0.35,
              "endOffset": 0.43
            },
            {
              "word": "arcket",
              "startOffset": 0.43,
              "endOffset": 0.52
            },
            {
              "word": "teman-teman",
              "startOffset": 0.52,
              "endOffset": 0.61
            },
            {
              "word": "untuk",
              "startOffset": 0.61,
              "endOffset": 0.69
            },
            {
              "word": "membuat",
              "startOffset": 0.69,
              "endOffset": 0.78
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ]
    }
  },
  {
    "video": {
      "id": "video-2",
      "platform": "youtube",
      "sourceUrl": "https://www.youtube.com/watch?v=xGnq6uL4FSU",
      "externalId": "xGnq6uL4FSU",
      "title": "MELAWAN PARTY PEMEGANG LEADERBOARD MLBB SEASON 37 !! TOP GLOBAL 1 NATAN MOBILE LEGENDS !!",
      "channelName": "Akhdannn",
      "durationSeconds": 1208,
      "thumbnailUrl": "https://i.ytimg.com/vi/xGnq6uL4FSU/maxresdefault.jpg",
      "viewsCount": "223.282 views",
      "status": "ready",
      "audioWaveform": [
        80,
        60,
        43,
        39,
        87,
        80,
        50,
        50,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12
      ],
      "chatVelocity": [
        38,
        44,
        52,
        48,
        48,
        45,
        48,
        39,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    "highlights": [
      {
        "id": "hl-video-2-1",
        "sourceVideoId": "video-2",
        "title": "Puncak reaksi Seperti biasa, kita akan melawa...",
        "startSeconds": 50,
        "endSeconds": 80,
        "duration": 30,
        "audioScore": 95,
        "chatScore": 74,
        "totalScore": 79,
        "tags": [
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"Seperti biasa, kita akan melawan Grenger di sini. Jadi langsung aja bikin sepatu di sini. Jadi langsung aja bikin sepatu\" â Momen dengan intensitas chat tertinggi.",
        "chatSpikeReason": "Audio peak 100/100 â¢ 53 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-2-2",
        "sourceVideoId": "video-2",
        "title": "Puncak reaksi kita bakal hajar, Guys. Oke, dia",
        "startSeconds": 200,
        "endSeconds": 230,
        "duration": 30,
        "audioScore": 92,
        "chatScore": 74,
        "totalScore": 79,
        "tags": [
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"kita bakal hajar, Guys. Oke, dia udah ngedes. Langsung aja ulti, ya. Kita ngedes. Langsung aja ulti, ya. Kita\" â Momen dengan intensitas chat tertinggi.",
        "chatSpikeReason": "Audio peak 95/100 â¢ 54 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-2-3",
        "sourceVideoId": "video-2",
        "title": "Puncak reaksi Tin. Nice. Sepatu armor. Jadi, nah",
        "startSeconds": 100,
        "endSeconds": 130,
        "duration": 30,
        "audioScore": 95,
        "chatScore": 73,
        "totalScore": 79,
        "tags": [
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"Tin. Nice. Sepatu armor. Jadi, nah kita boleh maju dikit-dikit, Guys. Buat apa? boleh maju dikit-dikit, Guys. Buat apa?\" â Momen dengan intensitas chat tertinggi.",
        "chatSpikeReason": "Audio peak 100/100 â¢ 51 aktivitas/tdk pada momen ini"
      }
    ],
    "captionsMap": {
      "hl-video-2-1": [
        {
          "id": "cap-hl-xGnq6uL4FSU-1-50320-0",
          "startSeconds": 50.32,
          "endSeconds": 53.23,
          "text": "di sini. Jadi langsung aja bikin sepatu armor ya tanpa ragu, Guys. Karena sepatu",
          "words": [
            {
              "word": "di",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "sini.",
              "startOffset": 0.21,
              "endOffset": 0.42
            },
            {
              "word": "Jadi",
              "startOffset": 0.42,
              "endOffset": 0.62
            },
            {
              "word": "langsung",
              "startOffset": 0.62,
              "endOffset": 0.83
            },
            {
              "word": "aja",
              "startOffset": 0.83,
              "endOffset": 1.04
            },
            {
              "word": "bikin",
              "startOffset": 1.04,
              "endOffset": 1.25
            },
            {
              "word": "sepatu",
              "startOffset": 1.25,
              "endOffset": 1.45
            },
            {
              "word": "armor",
              "startOffset": 1.45,
              "endOffset": 1.66
            },
            {
              "word": "ya",
              "startOffset": 1.66,
              "endOffset": 1.87
            },
            {
              "word": "tanpa",
              "startOffset": 1.87,
              "endOffset": 2.08
            },
            {
              "word": "ragu,",
              "startOffset": 2.08,
              "endOffset": 2.29
            },
            {
              "word": "Guys.",
              "startOffset": 2.29,
              "endOffset": 2.49
            },
            {
              "word": "Karena",
              "startOffset": 2.49,
              "endOffset": 2.7
            },
            {
              "word": "sepatu",
              "startOffset": 2.7,
              "endOffset": 2.91
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-53239-1",
          "startSeconds": 53.24,
          "endSeconds": 55.87,
          "text": "armor ya tanpa ragu, Guys. Karena sepatu armor ini berguna banget buat ngebantu",
          "words": [
            {
              "word": "armor",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "ya",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "tanpa",
              "startOffset": 0.4,
              "endOffset": 0.61
            },
            {
              "word": "ragu,",
              "startOffset": 0.61,
              "endOffset": 0.81
            },
            {
              "word": "Guys.",
              "startOffset": 0.81,
              "endOffset": 1.01
            },
            {
              "word": "Karena",
              "startOffset": 1.01,
              "endOffset": 1.21
            },
            {
              "word": "sepatu",
              "startOffset": 1.21,
              "endOffset": 1.42
            },
            {
              "word": "armor",
              "startOffset": 1.42,
              "endOffset": 1.62
            },
            {
              "word": "ini",
              "startOffset": 1.62,
              "endOffset": 1.82
            },
            {
              "word": "berguna",
              "startOffset": 1.82,
              "endOffset": 2.02
            },
            {
              "word": "banget",
              "startOffset": 2.02,
              "endOffset": 2.23
            },
            {
              "word": "buat",
              "startOffset": 2.23,
              "endOffset": 2.43
            },
            {
              "word": "ngebantu",
              "startOffset": 2.43,
              "endOffset": 2.63
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-55879-2",
          "startSeconds": 55.88,
          "endSeconds": 58.35,
          "text": "armor ini berguna banget buat ngebantu kalian landing pass ngelawan Grenger ya.",
          "words": [
            {
              "word": "armor",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "ini",
              "startOffset": 0.21,
              "endOffset": 0.41
            },
            {
              "word": "berguna",
              "startOffset": 0.41,
              "endOffset": 0.62
            },
            {
              "word": "banget",
              "startOffset": 0.62,
              "endOffset": 0.82
            },
            {
              "word": "buat",
              "startOffset": 0.82,
              "endOffset": 1.03
            },
            {
              "word": "ngebantu",
              "startOffset": 1.03,
              "endOffset": 1.23
            },
            {
              "word": "kalian",
              "startOffset": 1.23,
              "endOffset": 1.44
            },
            {
              "word": "landing",
              "startOffset": 1.44,
              "endOffset": 1.65
            },
            {
              "word": "pass",
              "startOffset": 1.65,
              "endOffset": 1.85
            },
            {
              "word": "ngelawan",
              "startOffset": 1.85,
              "endOffset": 2.06
            },
            {
              "word": "Grenger",
              "startOffset": 2.06,
              "endOffset": 2.26
            },
            {
              "word": "ya.",
              "startOffset": 2.26,
              "endOffset": 2.47
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-58359-3",
          "startSeconds": 58.36,
          "endSeconds": 60.43,
          "text": "kalian landing pass ngelawan Grenger ya. Karena Grenger itu harus lincah kalian,",
          "words": [
            {
              "word": "kalian",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "landing",
              "startOffset": 0.17,
              "endOffset": 0.35
            },
            {
              "word": "pass",
              "startOffset": 0.35,
              "endOffset": 0.52
            },
            {
              "word": "ngelawan",
              "startOffset": 0.52,
              "endOffset": 0.69
            },
            {
              "word": "Grenger",
              "startOffset": 0.69,
              "endOffset": 0.86
            },
            {
              "word": "ya.",
              "startOffset": 0.86,
              "endOffset": 1.04
            },
            {
              "word": "Karena",
              "startOffset": 1.04,
              "endOffset": 1.21
            },
            {
              "word": "Grenger",
              "startOffset": 1.21,
              "endOffset": 1.38
            },
            {
              "word": "itu",
              "startOffset": 1.38,
              "endOffset": 1.55
            },
            {
              "word": "harus",
              "startOffset": 1.55,
              "endOffset": 1.73
            },
            {
              "word": "lincah",
              "startOffset": 1.73,
              "endOffset": 1.9
            },
            {
              "word": "kalian,",
              "startOffset": 1.9,
              "endOffset": 2.07
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-60440-4",
          "startSeconds": 60.44,
          "endSeconds": 63.75,
          "text": "Karena Grenger itu harus lincah kalian, Guys. Dan sepatu armor juga ngasih",
          "words": [
            {
              "word": "Karena",
              "startOffset": 0,
              "endOffset": 0.28
            },
            {
              "word": "Grenger",
              "startOffset": 0.28,
              "endOffset": 0.55
            },
            {
              "word": "itu",
              "startOffset": 0.55,
              "endOffset": 0.83
            },
            {
              "word": "harus",
              "startOffset": 0.83,
              "endOffset": 1.1
            },
            {
              "word": "lincah",
              "startOffset": 1.1,
              "endOffset": 1.38
            },
            {
              "word": "kalian,",
              "startOffset": 1.38,
              "endOffset": 1.66
            },
            {
              "word": "Guys.",
              "startOffset": 1.66,
              "endOffset": 1.93
            },
            {
              "word": "Dan",
              "startOffset": 1.93,
              "endOffset": 2.21
            },
            {
              "word": "sepatu",
              "startOffset": 2.21,
              "endOffset": 2.48
            },
            {
              "word": "armor",
              "startOffset": 2.48,
              "endOffset": 2.76
            },
            {
              "word": "juga",
              "startOffset": 2.76,
              "endOffset": 3.03
            },
            {
              "word": "ngasih",
              "startOffset": 3.03,
              "endOffset": 3.31
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-63760-5",
          "startSeconds": 63.76,
          "endSeconds": 65.91,
          "text": "Guys. Dan sepatu armor juga ngasih armornya cukup banyak ya dari pasifnya",
          "words": [
            {
              "word": "Guys.",
              "startOffset": 0,
              "endOffset": 0.18
            },
            {
              "word": "Dan",
              "startOffset": 0.18,
              "endOffset": 0.36
            },
            {
              "word": "sepatu",
              "startOffset": 0.36,
              "endOffset": 0.54
            },
            {
              "word": "armor",
              "startOffset": 0.54,
              "endOffset": 0.72
            },
            {
              "word": "juga",
              "startOffset": 0.72,
              "endOffset": 0.9
            },
            {
              "word": "ngasih",
              "startOffset": 0.9,
              "endOffset": 1.07
            },
            {
              "word": "armornya",
              "startOffset": 1.07,
              "endOffset": 1.25
            },
            {
              "word": "cukup",
              "startOffset": 1.25,
              "endOffset": 1.43
            },
            {
              "word": "banyak",
              "startOffset": 1.43,
              "endOffset": 1.61
            },
            {
              "word": "ya",
              "startOffset": 1.61,
              "endOffset": 1.79
            },
            {
              "word": "dari",
              "startOffset": 1.79,
              "endOffset": 1.97
            },
            {
              "word": "pasifnya",
              "startOffset": 1.97,
              "endOffset": 2.15
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-65920-6",
          "startSeconds": 65.92,
          "endSeconds": 68.43,
          "text": "armornya cukup banyak ya dari pasifnya itu kayak sekitar 40 kalau enggak salah.",
          "words": [
            {
              "word": "armornya",
              "startOffset": 0,
              "endOffset": 0.19
            },
            {
              "word": "cukup",
              "startOffset": 0.19,
              "endOffset": 0.39
            },
            {
              "word": "banyak",
              "startOffset": 0.39,
              "endOffset": 0.58
            },
            {
              "word": "ya",
              "startOffset": 0.58,
              "endOffset": 0.77
            },
            {
              "word": "dari",
              "startOffset": 0.77,
              "endOffset": 0.97
            },
            {
              "word": "pasifnya",
              "startOffset": 0.97,
              "endOffset": 1.16
            },
            {
              "word": "itu",
              "startOffset": 1.16,
              "endOffset": 1.35
            },
            {
              "word": "kayak",
              "startOffset": 1.35,
              "endOffset": 1.54
            },
            {
              "word": "sekitar",
              "startOffset": 1.54,
              "endOffset": 1.74
            },
            {
              "word": "40",
              "startOffset": 1.74,
              "endOffset": 1.93
            },
            {
              "word": "kalau",
              "startOffset": 1.93,
              "endOffset": 2.12
            },
            {
              "word": "enggak",
              "startOffset": 2.12,
              "endOffset": 2.32
            },
            {
              "word": "salah.",
              "startOffset": 2.32,
              "endOffset": 2.51
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-68439-7",
          "startSeconds": 68.44,
          "endSeconds": 70.03,
          "text": "itu kayak sekitar 40 kalau enggak salah. Karena gara-gara face clear di sini kita",
          "words": [
            {
              "word": "itu",
              "startOffset": 0,
              "endOffset": 0.11
            },
            {
              "word": "kayak",
              "startOffset": 0.11,
              "endOffset": 0.23
            },
            {
              "word": "sekitar",
              "startOffset": 0.23,
              "endOffset": 0.34
            },
            {
              "word": "40",
              "startOffset": 0.34,
              "endOffset": 0.45
            },
            {
              "word": "kalau",
              "startOffset": 0.45,
              "endOffset": 0.57
            },
            {
              "word": "enggak",
              "startOffset": 0.57,
              "endOffset": 0.68
            },
            {
              "word": "salah.",
              "startOffset": 0.68,
              "endOffset": 0.8
            },
            {
              "word": "Karena",
              "startOffset": 0.8,
              "endOffset": 0.91
            },
            {
              "word": "gara-gara",
              "startOffset": 0.91,
              "endOffset": 1.02
            },
            {
              "word": "face",
              "startOffset": 1.02,
              "endOffset": 1.14
            },
            {
              "word": "clear",
              "startOffset": 1.14,
              "endOffset": 1.25
            },
            {
              "word": "di",
              "startOffset": 1.25,
              "endOffset": 1.36
            },
            {
              "word": "sini",
              "startOffset": 1.36,
              "endOffset": 1.48
            },
            {
              "word": "kita",
              "startOffset": 1.48,
              "endOffset": 1.59
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-70040-8",
          "startSeconds": 70.04,
          "endSeconds": 71.75,
          "text": "Karena gara-gara face clear di sini kita juga ikutan face clear aja, Guys. Jangan",
          "words": [
            {
              "word": "Karena",
              "startOffset": 0,
              "endOffset": 0.12
            },
            {
              "word": "gara-gara",
              "startOffset": 0.12,
              "endOffset": 0.24
            },
            {
              "word": "face",
              "startOffset": 0.24,
              "endOffset": 0.37
            },
            {
              "word": "clear",
              "startOffset": 0.37,
              "endOffset": 0.49
            },
            {
              "word": "di",
              "startOffset": 0.49,
              "endOffset": 0.61
            },
            {
              "word": "sini",
              "startOffset": 0.61,
              "endOffset": 0.73
            },
            {
              "word": "kita",
              "startOffset": 0.73,
              "endOffset": 0.85
            },
            {
              "word": "juga",
              "startOffset": 0.85,
              "endOffset": 0.98
            },
            {
              "word": "ikutan",
              "startOffset": 0.98,
              "endOffset": 1.1
            },
            {
              "word": "face",
              "startOffset": 1.1,
              "endOffset": 1.22
            },
            {
              "word": "clear",
              "startOffset": 1.22,
              "endOffset": 1.34
            },
            {
              "word": "aja,",
              "startOffset": 1.34,
              "endOffset": 1.46
            },
            {
              "word": "Guys.",
              "startOffset": 1.46,
              "endOffset": 1.59
            },
            {
              "word": "Jangan",
              "startOffset": 1.59,
              "endOffset": 1.71
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-71759-9",
          "startSeconds": 71.76,
          "endSeconds": 74.31,
          "text": "juga ikutan face clear aja, Guys. Jangan mau kalah, Guys. Sambil kita lihatin, ya",
          "words": [
            {
              "word": "juga",
              "startOffset": 0,
              "endOffset": 0.18
            },
            {
              "word": "ikutan",
              "startOffset": 0.18,
              "endOffset": 0.36
            },
            {
              "word": "face",
              "startOffset": 0.36,
              "endOffset": 0.55
            },
            {
              "word": "clear",
              "startOffset": 0.55,
              "endOffset": 0.73
            },
            {
              "word": "aja,",
              "startOffset": 0.73,
              "endOffset": 0.91
            },
            {
              "word": "Guys.",
              "startOffset": 0.91,
              "endOffset": 1.09
            },
            {
              "word": "Jangan",
              "startOffset": 1.09,
              "endOffset": 1.28
            },
            {
              "word": "mau",
              "startOffset": 1.28,
              "endOffset": 1.46
            },
            {
              "word": "kalah,",
              "startOffset": 1.46,
              "endOffset": 1.64
            },
            {
              "word": "Guys.",
              "startOffset": 1.64,
              "endOffset": 1.82
            },
            {
              "word": "Sambil",
              "startOffset": 1.82,
              "endOffset": 2
            },
            {
              "word": "kita",
              "startOffset": 2,
              "endOffset": 2.19
            },
            {
              "word": "lihatin,",
              "startOffset": 2.19,
              "endOffset": 2.37
            },
            {
              "word": "ya",
              "startOffset": 2.37,
              "endOffset": 2.55
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-74320-10",
          "startSeconds": 74.32,
          "endSeconds": 76.51,
          "text": "mau kalah, Guys. Sambil kita lihatin, ya kelomangnya kita ganggu-gangguin. Siapa",
          "words": [
            {
              "word": "mau",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "kalah,",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "Guys.",
              "startOffset": 0.4,
              "endOffset": 0.6
            },
            {
              "word": "Sambil",
              "startOffset": 0.6,
              "endOffset": 0.8
            },
            {
              "word": "kita",
              "startOffset": 0.8,
              "endOffset": 1
            },
            {
              "word": "lihatin,",
              "startOffset": 1,
              "endOffset": 1.19
            },
            {
              "word": "ya",
              "startOffset": 1.19,
              "endOffset": 1.39
            },
            {
              "word": "kelomangnya",
              "startOffset": 1.39,
              "endOffset": 1.59
            },
            {
              "word": "kita",
              "startOffset": 1.59,
              "endOffset": 1.79
            },
            {
              "word": "ganggu-gangguin.",
              "startOffset": 1.79,
              "endOffset": 1.99
            },
            {
              "word": "Siapa",
              "startOffset": 1.99,
              "endOffset": 2.19
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-76520-11",
          "startSeconds": 76.52,
          "endSeconds": 77.87,
          "text": "kelomangnya kita ganggu-gangguin. Siapa tahu dapat.",
          "words": [
            {
              "word": "kelomangnya",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "kita",
              "startOffset": 0.23,
              "endOffset": 0.45
            },
            {
              "word": "ganggu-gangguin.",
              "startOffset": 0.45,
              "endOffset": 0.68
            },
            {
              "word": "Siapa",
              "startOffset": 0.68,
              "endOffset": 0.9
            },
            {
              "word": "tahu",
              "startOffset": 0.9,
              "endOffset": 1.13
            },
            {
              "word": "dapat.",
              "startOffset": 1.13,
              "endOffset": 1.35
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-1-77880-12",
          "startSeconds": 77.88,
          "endSeconds": 79.75,
          "text": "tahu dapat. Tapi kita diusir, ya sama Grengernya.",
          "words": [
            {
              "word": "tahu",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "dapat.",
              "startOffset": 0.23,
              "endOffset": 0.47
            },
            {
              "word": "Tapi",
              "startOffset": 0.47,
              "endOffset": 0.7
            },
            {
              "word": "kita",
              "startOffset": 0.7,
              "endOffset": 0.93
            },
            {
              "word": "diusir,",
              "startOffset": 0.93,
              "endOffset": 1.17
            },
            {
              "word": "ya",
              "startOffset": 1.17,
              "endOffset": 1.4
            },
            {
              "word": "sama",
              "startOffset": 1.4,
              "endOffset": 1.64
            },
            {
              "word": "Grengernya.",
              "startOffset": 1.64,
              "endOffset": 1.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-2-2": [
        {
          "id": "cap-hl-xGnq6uL4FSU-2-200319-0",
          "startSeconds": 200.32,
          "endSeconds": 202.95,
          "text": "ngedes. Langsung aja ulti, ya. Kita menangin darahnya di sini. Nice banget",
          "words": [
            {
              "word": "ngedes.",
              "startOffset": 0,
              "endOffset": 0.22
            },
            {
              "word": "Langsung",
              "startOffset": 0.22,
              "endOffset": 0.44
            },
            {
              "word": "aja",
              "startOffset": 0.44,
              "endOffset": 0.66
            },
            {
              "word": "ulti,",
              "startOffset": 0.66,
              "endOffset": 0.88
            },
            {
              "word": "ya.",
              "startOffset": 0.88,
              "endOffset": 1.1
            },
            {
              "word": "Kita",
              "startOffset": 1.1,
              "endOffset": 1.32
            },
            {
              "word": "menangin",
              "startOffset": 1.32,
              "endOffset": 1.53
            },
            {
              "word": "darahnya",
              "startOffset": 1.53,
              "endOffset": 1.75
            },
            {
              "word": "di",
              "startOffset": 1.75,
              "endOffset": 1.97
            },
            {
              "word": "sini.",
              "startOffset": 1.97,
              "endOffset": 2.19
            },
            {
              "word": "Nice",
              "startOffset": 2.19,
              "endOffset": 2.41
            },
            {
              "word": "banget",
              "startOffset": 2.41,
              "endOffset": 2.63
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-202959-1",
          "startSeconds": 202.96,
          "endSeconds": 205.71,
          "text": "menangin darahnya di sini. Nice banget sih. Kita menang darah jadinya ya, Guys",
          "words": [
            {
              "word": "menangin",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "darahnya",
              "startOffset": 0.21,
              "endOffset": 0.42
            },
            {
              "word": "di",
              "startOffset": 0.42,
              "endOffset": 0.63
            },
            {
              "word": "sini.",
              "startOffset": 0.63,
              "endOffset": 0.85
            },
            {
              "word": "Nice",
              "startOffset": 0.85,
              "endOffset": 1.06
            },
            {
              "word": "banget",
              "startOffset": 1.06,
              "endOffset": 1.27
            },
            {
              "word": "sih.",
              "startOffset": 1.27,
              "endOffset": 1.48
            },
            {
              "word": "Kita",
              "startOffset": 1.48,
              "endOffset": 1.69
            },
            {
              "word": "menang",
              "startOffset": 1.69,
              "endOffset": 1.9
            },
            {
              "word": "darah",
              "startOffset": 1.9,
              "endOffset": 2.12
            },
            {
              "word": "jadinya",
              "startOffset": 2.12,
              "endOffset": 2.33
            },
            {
              "word": "ya,",
              "startOffset": 2.33,
              "endOffset": 2.54
            },
            {
              "word": "Guys",
              "startOffset": 2.54,
              "endOffset": 2.75
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-205720-2",
          "startSeconds": 205.72,
          "endSeconds": 207.75,
          "text": "sih. Kita menang darah jadinya ya, Guys ya. Langsung aja kita amanin rumput",
          "words": [
            {
              "word": "sih.",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "Kita",
              "startOffset": 0.16,
              "endOffset": 0.31
            },
            {
              "word": "menang",
              "startOffset": 0.31,
              "endOffset": 0.47
            },
            {
              "word": "darah",
              "startOffset": 0.47,
              "endOffset": 0.62
            },
            {
              "word": "jadinya",
              "startOffset": 0.62,
              "endOffset": 0.78
            },
            {
              "word": "ya,",
              "startOffset": 0.78,
              "endOffset": 0.94
            },
            {
              "word": "Guys",
              "startOffset": 0.94,
              "endOffset": 1.09
            },
            {
              "word": "ya.",
              "startOffset": 1.09,
              "endOffset": 1.25
            },
            {
              "word": "Langsung",
              "startOffset": 1.25,
              "endOffset": 1.41
            },
            {
              "word": "aja",
              "startOffset": 1.41,
              "endOffset": 1.56
            },
            {
              "word": "kita",
              "startOffset": 1.56,
              "endOffset": 1.72
            },
            {
              "word": "amanin",
              "startOffset": 1.72,
              "endOffset": 1.87
            },
            {
              "word": "rumput",
              "startOffset": 1.87,
              "endOffset": 2.03
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-207760-3",
          "startSeconds": 207.76,
          "endSeconds": 210.55,
          "text": "ya. Langsung aja kita amanin rumput depan sini tapi kita kelihatan. Jadi",
          "words": [
            {
              "word": "ya.",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "Langsung",
              "startOffset": 0.23,
              "endOffset": 0.47
            },
            {
              "word": "aja",
              "startOffset": 0.47,
              "endOffset": 0.7
            },
            {
              "word": "kita",
              "startOffset": 0.7,
              "endOffset": 0.93
            },
            {
              "word": "amanin",
              "startOffset": 0.93,
              "endOffset": 1.16
            },
            {
              "word": "rumput",
              "startOffset": 1.16,
              "endOffset": 1.4
            },
            {
              "word": "depan",
              "startOffset": 1.4,
              "endOffset": 1.63
            },
            {
              "word": "sini",
              "startOffset": 1.63,
              "endOffset": 1.86
            },
            {
              "word": "tapi",
              "startOffset": 1.86,
              "endOffset": 2.09
            },
            {
              "word": "kita",
              "startOffset": 2.09,
              "endOffset": 2.33
            },
            {
              "word": "kelihatan.",
              "startOffset": 2.33,
              "endOffset": 2.56
            },
            {
              "word": "Jadi",
              "startOffset": 2.56,
              "endOffset": 2.79
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-210560-4",
          "startSeconds": 210.56,
          "endSeconds": 212.63,
          "text": "depan sini tapi kita kelihatan. Jadi kita face clear aja guys karena cipnya",
          "words": [
            {
              "word": "depan",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "sini",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "tapi",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "kita",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "kelihatan.",
              "startOffset": 0.64,
              "endOffset": 0.8
            },
            {
              "word": "Jadi",
              "startOffset": 0.8,
              "endOffset": 0.96
            },
            {
              "word": "kita",
              "startOffset": 0.96,
              "endOffset": 1.11
            },
            {
              "word": "face",
              "startOffset": 1.11,
              "endOffset": 1.27
            },
            {
              "word": "clear",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "aja",
              "startOffset": 1.43,
              "endOffset": 1.59
            },
            {
              "word": "guys",
              "startOffset": 1.59,
              "endOffset": 1.75
            },
            {
              "word": "karena",
              "startOffset": 1.75,
              "endOffset": 1.91
            },
            {
              "word": "cipnya",
              "startOffset": 1.91,
              "endOffset": 2.07
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-212640-5",
          "startSeconds": 212.64,
          "endSeconds": 215.23,
          "text": "kita face clear aja guys karena cipnya mau ke bawah ya. Langsung kita face",
          "words": [
            {
              "word": "kita",
              "startOffset": 0,
              "endOffset": 0.18
            },
            {
              "word": "face",
              "startOffset": 0.18,
              "endOffset": 0.37
            },
            {
              "word": "clear",
              "startOffset": 0.37,
              "endOffset": 0.55
            },
            {
              "word": "aja",
              "startOffset": 0.55,
              "endOffset": 0.74
            },
            {
              "word": "guys",
              "startOffset": 0.74,
              "endOffset": 0.92
            },
            {
              "word": "karena",
              "startOffset": 0.92,
              "endOffset": 1.11
            },
            {
              "word": "cipnya",
              "startOffset": 1.11,
              "endOffset": 1.29
            },
            {
              "word": "mau",
              "startOffset": 1.29,
              "endOffset": 1.48
            },
            {
              "word": "ke",
              "startOffset": 1.48,
              "endOffset": 1.66
            },
            {
              "word": "bawah",
              "startOffset": 1.66,
              "endOffset": 1.85
            },
            {
              "word": "ya.",
              "startOffset": 1.85,
              "endOffset": 2.03
            },
            {
              "word": "Langsung",
              "startOffset": 2.03,
              "endOffset": 2.22
            },
            {
              "word": "kita",
              "startOffset": 2.22,
              "endOffset": 2.4
            },
            {
              "word": "face",
              "startOffset": 2.4,
              "endOffset": 2.59
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-215239-6",
          "startSeconds": 215.24,
          "endSeconds": 215.91,
          "text": "mau ke bawah ya. Langsung kita face clear aja.",
          "words": [
            {
              "word": "mau",
              "startOffset": 0,
              "endOffset": 0.07
            },
            {
              "word": "ke",
              "startOffset": 0.07,
              "endOffset": 0.15
            },
            {
              "word": "bawah",
              "startOffset": 0.15,
              "endOffset": 0.22
            },
            {
              "word": "ya.",
              "startOffset": 0.22,
              "endOffset": 0.3
            },
            {
              "word": "Langsung",
              "startOffset": 0.3,
              "endOffset": 0.37
            },
            {
              "word": "kita",
              "startOffset": 0.37,
              "endOffset": 0.45
            },
            {
              "word": "face",
              "startOffset": 0.45,
              "endOffset": 0.52
            },
            {
              "word": "clear",
              "startOffset": 0.52,
              "endOffset": 0.6
            },
            {
              "word": "aja.",
              "startOffset": 0.6,
              "endOffset": 0.67
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-215920-7",
          "startSeconds": 215.92,
          "endSeconds": 218.03,
          "text": "clear aja. Bayangan semakin menyebar jika kita",
          "words": [
            {
              "word": "clear",
              "startOffset": 0,
              "endOffset": 0.3
            },
            {
              "word": "aja.",
              "startOffset": 0.3,
              "endOffset": 0.6
            },
            {
              "word": "Bayangan",
              "startOffset": 0.6,
              "endOffset": 0.9
            },
            {
              "word": "semakin",
              "startOffset": 0.9,
              "endOffset": 1.21
            },
            {
              "word": "menyebar",
              "startOffset": 1.21,
              "endOffset": 1.51
            },
            {
              "word": "jika",
              "startOffset": 1.51,
              "endOffset": 1.81
            },
            {
              "word": "kita",
              "startOffset": 1.81,
              "endOffset": 2.11
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-218040-8",
          "startSeconds": 218.04,
          "endSeconds": 219.03,
          "text": "Bayangan semakin menyebar jika kita tidak bergegas.",
          "words": [
            {
              "word": "Bayangan",
              "startOffset": 0,
              "endOffset": 0.14
            },
            {
              "word": "semakin",
              "startOffset": 0.14,
              "endOffset": 0.28
            },
            {
              "word": "menyebar",
              "startOffset": 0.28,
              "endOffset": 0.42
            },
            {
              "word": "jika",
              "startOffset": 0.42,
              "endOffset": 0.57
            },
            {
              "word": "kita",
              "startOffset": 0.57,
              "endOffset": 0.71
            },
            {
              "word": "tidak",
              "startOffset": 0.71,
              "endOffset": 0.85
            },
            {
              "word": "bergegas.",
              "startOffset": 0.85,
              "endOffset": 0.99
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-219040-9",
          "startSeconds": 219.04,
          "endSeconds": 220.83,
          "text": "tidak bergegas. Oke karena kita baru nge-clear dan mana",
          "words": [
            {
              "word": "tidak",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "bergegas.",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "Oke",
              "startOffset": 0.4,
              "endOffset": 0.6
            },
            {
              "word": "karena",
              "startOffset": 0.6,
              "endOffset": 0.8
            },
            {
              "word": "kita",
              "startOffset": 0.8,
              "endOffset": 0.99
            },
            {
              "word": "baru",
              "startOffset": 0.99,
              "endOffset": 1.19
            },
            {
              "word": "nge-clear",
              "startOffset": 1.19,
              "endOffset": 1.39
            },
            {
              "word": "dan",
              "startOffset": 1.39,
              "endOffset": 1.59
            },
            {
              "word": "mana",
              "startOffset": 1.59,
              "endOffset": 1.79
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-220840-10",
          "startSeconds": 220.84,
          "endSeconds": 222.99,
          "text": "Oke karena kita baru nge-clear dan mana kita habis. Kita boleh banget pulang ya,",
          "words": [
            {
              "word": "Oke",
              "startOffset": 0,
              "endOffset": 0.15
            },
            {
              "word": "karena",
              "startOffset": 0.15,
              "endOffset": 0.31
            },
            {
              "word": "kita",
              "startOffset": 0.31,
              "endOffset": 0.46
            },
            {
              "word": "baru",
              "startOffset": 0.46,
              "endOffset": 0.61
            },
            {
              "word": "nge-clear",
              "startOffset": 0.61,
              "endOffset": 0.77
            },
            {
              "word": "dan",
              "startOffset": 0.77,
              "endOffset": 0.92
            },
            {
              "word": "mana",
              "startOffset": 0.92,
              "endOffset": 1.08
            },
            {
              "word": "kita",
              "startOffset": 1.08,
              "endOffset": 1.23
            },
            {
              "word": "habis.",
              "startOffset": 1.23,
              "endOffset": 1.38
            },
            {
              "word": "Kita",
              "startOffset": 1.38,
              "endOffset": 1.54
            },
            {
              "word": "boleh",
              "startOffset": 1.54,
              "endOffset": 1.69
            },
            {
              "word": "banget",
              "startOffset": 1.69,
              "endOffset": 1.84
            },
            {
              "word": "pulang",
              "startOffset": 1.84,
              "endOffset": 2
            },
            {
              "word": "ya,",
              "startOffset": 2,
              "endOffset": 2.15
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-223000-11",
          "startSeconds": 223,
          "endSeconds": 226.19,
          "text": "kita habis. Kita boleh banget pulang ya, Guys ya. ngriset biar mananya penuh lagi",
          "words": [
            {
              "word": "kita",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "habis.",
              "startOffset": 0.23,
              "endOffset": 0.46
            },
            {
              "word": "Kita",
              "startOffset": 0.46,
              "endOffset": 0.68
            },
            {
              "word": "boleh",
              "startOffset": 0.68,
              "endOffset": 0.91
            },
            {
              "word": "banget",
              "startOffset": 0.91,
              "endOffset": 1.14
            },
            {
              "word": "pulang",
              "startOffset": 1.14,
              "endOffset": 1.37
            },
            {
              "word": "ya,",
              "startOffset": 1.37,
              "endOffset": 1.59
            },
            {
              "word": "Guys",
              "startOffset": 1.59,
              "endOffset": 1.82
            },
            {
              "word": "ya.",
              "startOffset": 1.82,
              "endOffset": 2.05
            },
            {
              "word": "ngriset",
              "startOffset": 2.05,
              "endOffset": 2.28
            },
            {
              "word": "biar",
              "startOffset": 2.28,
              "endOffset": 2.51
            },
            {
              "word": "mananya",
              "startOffset": 2.51,
              "endOffset": 2.73
            },
            {
              "word": "penuh",
              "startOffset": 2.73,
              "endOffset": 2.96
            },
            {
              "word": "lagi",
              "startOffset": 2.96,
              "endOffset": 3.19
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-226200-12",
          "startSeconds": 226.2,
          "endSeconds": 226.95,
          "text": "Guys ya. ngriset biar mananya penuh lagi mulai dari awal",
          "words": [
            {
              "word": "Guys",
              "startOffset": 0,
              "endOffset": 0.07
            },
            {
              "word": "ya.",
              "startOffset": 0.07,
              "endOffset": 0.15
            },
            {
              "word": "ngriset",
              "startOffset": 0.15,
              "endOffset": 0.22
            },
            {
              "word": "biar",
              "startOffset": 0.22,
              "endOffset": 0.3
            },
            {
              "word": "mananya",
              "startOffset": 0.3,
              "endOffset": 0.37
            },
            {
              "word": "penuh",
              "startOffset": 0.37,
              "endOffset": 0.45
            },
            {
              "word": "lagi",
              "startOffset": 0.45,
              "endOffset": 0.52
            },
            {
              "word": "mulai",
              "startOffset": 0.52,
              "endOffset": 0.6
            },
            {
              "word": "dari",
              "startOffset": 0.6,
              "endOffset": 0.67
            },
            {
              "word": "awal",
              "startOffset": 0.67,
              "endOffset": 0.75
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-226959-13",
          "startSeconds": 226.96,
          "endSeconds": 228.87,
          "text": "mulai dari awal dan kita pas balik ke land juga aman",
          "words": [
            {
              "word": "mulai",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "dari",
              "startOffset": 0.17,
              "endOffset": 0.35
            },
            {
              "word": "awal",
              "startOffset": 0.35,
              "endOffset": 0.52
            },
            {
              "word": "dan",
              "startOffset": 0.52,
              "endOffset": 0.69
            },
            {
              "word": "kita",
              "startOffset": 0.69,
              "endOffset": 0.87
            },
            {
              "word": "pas",
              "startOffset": 0.87,
              "endOffset": 1.04
            },
            {
              "word": "balik",
              "startOffset": 1.04,
              "endOffset": 1.22
            },
            {
              "word": "ke",
              "startOffset": 1.22,
              "endOffset": 1.39
            },
            {
              "word": "land",
              "startOffset": 1.39,
              "endOffset": 1.56
            },
            {
              "word": "juga",
              "startOffset": 1.56,
              "endOffset": 1.74
            },
            {
              "word": "aman",
              "startOffset": 1.74,
              "endOffset": 1.91
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-2-228879-14",
          "startSeconds": 228.88,
          "endSeconds": 230,
          "text": "dan kita pas balik ke land juga aman karena minion baru aja keluar guysunggu",
          "words": [
            {
              "word": "dan",
              "startOffset": 0,
              "endOffset": 0.08
            },
            {
              "word": "kita",
              "startOffset": 0.08,
              "endOffset": 0.16
            },
            {
              "word": "pas",
              "startOffset": 0.16,
              "endOffset": 0.24
            },
            {
              "word": "balik",
              "startOffset": 0.24,
              "endOffset": 0.32
            },
            {
              "word": "ke",
              "startOffset": 0.32,
              "endOffset": 0.4
            },
            {
              "word": "land",
              "startOffset": 0.4,
              "endOffset": 0.48
            },
            {
              "word": "juga",
              "startOffset": 0.48,
              "endOffset": 0.56
            },
            {
              "word": "aman",
              "startOffset": 0.56,
              "endOffset": 0.64
            },
            {
              "word": "karena",
              "startOffset": 0.64,
              "endOffset": 0.72
            },
            {
              "word": "minion",
              "startOffset": 0.72,
              "endOffset": 0.8
            },
            {
              "word": "baru",
              "startOffset": 0.8,
              "endOffset": 0.88
            },
            {
              "word": "aja",
              "startOffset": 0.88,
              "endOffset": 0.96
            },
            {
              "word": "keluar",
              "startOffset": 0.96,
              "endOffset": 1.04
            },
            {
              "word": "guysunggu",
              "startOffset": 1.04,
              "endOffset": 1.12
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-2-3": [
        {
          "id": "cap-hl-xGnq6uL4FSU-3-100000-0",
          "startSeconds": 100,
          "endSeconds": 100.87,
          "text": "Tin. Nice. Sepatu armor. Jadi, nah kita boleh maju dikit-dikit, Guys. Buat apa?",
          "words": [
            {
              "word": "Tin.",
              "startOffset": 0,
              "endOffset": 0.07
            },
            {
              "word": "Nice.",
              "startOffset": 0.07,
              "endOffset": 0.13
            },
            {
              "word": "Sepatu",
              "startOffset": 0.13,
              "endOffset": 0.2
            },
            {
              "word": "armor.",
              "startOffset": 0.2,
              "endOffset": 0.27
            },
            {
              "word": "Jadi,",
              "startOffset": 0.27,
              "endOffset": 0.33
            },
            {
              "word": "nah",
              "startOffset": 0.33,
              "endOffset": 0.4
            },
            {
              "word": "kita",
              "startOffset": 0.4,
              "endOffset": 0.47
            },
            {
              "word": "boleh",
              "startOffset": 0.47,
              "endOffset": 0.54
            },
            {
              "word": "maju",
              "startOffset": 0.54,
              "endOffset": 0.6
            },
            {
              "word": "dikit-dikit,",
              "startOffset": 0.6,
              "endOffset": 0.67
            },
            {
              "word": "Guys.",
              "startOffset": 0.67,
              "endOffset": 0.74
            },
            {
              "word": "Buat",
              "startOffset": 0.74,
              "endOffset": 0.8
            },
            {
              "word": "apa?",
              "startOffset": 0.8,
              "endOffset": 0.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-100880-1",
          "startSeconds": 100.88,
          "endSeconds": 104.11,
          "text": "boleh maju dikit-dikit, Guys. Buat apa? Ambil duit flatingnya dikit, ya. Nah, 16",
          "words": [
            {
              "word": "boleh",
              "startOffset": 0,
              "endOffset": 0.25
            },
            {
              "word": "maju",
              "startOffset": 0.25,
              "endOffset": 0.5
            },
            {
              "word": "dikit-dikit,",
              "startOffset": 0.5,
              "endOffset": 0.75
            },
            {
              "word": "Guys.",
              "startOffset": 0.75,
              "endOffset": 0.99
            },
            {
              "word": "Buat",
              "startOffset": 0.99,
              "endOffset": 1.24
            },
            {
              "word": "apa?",
              "startOffset": 1.24,
              "endOffset": 1.49
            },
            {
              "word": "Ambil",
              "startOffset": 1.49,
              "endOffset": 1.74
            },
            {
              "word": "duit",
              "startOffset": 1.74,
              "endOffset": 1.99
            },
            {
              "word": "flatingnya",
              "startOffset": 1.99,
              "endOffset": 2.24
            },
            {
              "word": "dikit,",
              "startOffset": 2.24,
              "endOffset": 2.48
            },
            {
              "word": "ya.",
              "startOffset": 2.48,
              "endOffset": 2.73
            },
            {
              "word": "Nah,",
              "startOffset": 2.73,
              "endOffset": 2.98
            },
            {
              "word": "16",
              "startOffset": 2.98,
              "endOffset": 3.23
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-104119-2",
          "startSeconds": 104.12,
          "endSeconds": 107.43,
          "text": "Ambil duit flatingnya dikit, ya. Nah, 16 lumayan ya. 16 juga itu duit, Guys.",
          "words": [
            {
              "word": "Ambil",
              "startOffset": 0,
              "endOffset": 0.24
            },
            {
              "word": "duit",
              "startOffset": 0.24,
              "endOffset": 0.47
            },
            {
              "word": "flatingnya",
              "startOffset": 0.47,
              "endOffset": 0.71
            },
            {
              "word": "dikit,",
              "startOffset": 0.71,
              "endOffset": 0.95
            },
            {
              "word": "ya.",
              "startOffset": 0.95,
              "endOffset": 1.18
            },
            {
              "word": "Nah,",
              "startOffset": 1.18,
              "endOffset": 1.42
            },
            {
              "word": "16",
              "startOffset": 1.42,
              "endOffset": 1.66
            },
            {
              "word": "lumayan",
              "startOffset": 1.66,
              "endOffset": 1.89
            },
            {
              "word": "ya.",
              "startOffset": 1.89,
              "endOffset": 2.13
            },
            {
              "word": "16",
              "startOffset": 2.13,
              "endOffset": 2.36
            },
            {
              "word": "juga",
              "startOffset": 2.36,
              "endOffset": 2.6
            },
            {
              "word": "itu",
              "startOffset": 2.6,
              "endOffset": 2.84
            },
            {
              "word": "duit,",
              "startOffset": 2.84,
              "endOffset": 3.07
            },
            {
              "word": "Guys.",
              "startOffset": 3.07,
              "endOffset": 3.31
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-107439-3",
          "startSeconds": 107.44,
          "endSeconds": 109.71,
          "text": "lumayan ya. 16 juga itu duit, Guys. Oke, untuk next itemnya bulu seperti",
          "words": [
            {
              "word": "lumayan",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "ya.",
              "startOffset": 0.17,
              "endOffset": 0.35
            },
            {
              "word": "16",
              "startOffset": 0.35,
              "endOffset": 0.52
            },
            {
              "word": "juga",
              "startOffset": 0.52,
              "endOffset": 0.7
            },
            {
              "word": "itu",
              "startOffset": 0.7,
              "endOffset": 0.87
            },
            {
              "word": "duit,",
              "startOffset": 0.87,
              "endOffset": 1.05
            },
            {
              "word": "Guys.",
              "startOffset": 1.05,
              "endOffset": 1.22
            },
            {
              "word": "Oke,",
              "startOffset": 1.22,
              "endOffset": 1.4
            },
            {
              "word": "untuk",
              "startOffset": 1.4,
              "endOffset": 1.57
            },
            {
              "word": "next",
              "startOffset": 1.57,
              "endOffset": 1.75
            },
            {
              "word": "itemnya",
              "startOffset": 1.75,
              "endOffset": 1.92
            },
            {
              "word": "bulu",
              "startOffset": 1.92,
              "endOffset": 2.1
            },
            {
              "word": "seperti",
              "startOffset": 2.1,
              "endOffset": 2.27
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-109719-4",
          "startSeconds": 109.72,
          "endSeconds": 112.35,
          "text": "Oke, untuk next itemnya bulu seperti biasa ya, item Kornatan. Nah, kita diri",
          "words": [
            {
              "word": "Oke,",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "untuk",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "next",
              "startOffset": 0.4,
              "endOffset": 0.61
            },
            {
              "word": "itemnya",
              "startOffset": 0.61,
              "endOffset": 0.81
            },
            {
              "word": "bulu",
              "startOffset": 0.81,
              "endOffset": 1.01
            },
            {
              "word": "seperti",
              "startOffset": 1.01,
              "endOffset": 1.21
            },
            {
              "word": "biasa",
              "startOffset": 1.21,
              "endOffset": 1.42
            },
            {
              "word": "ya,",
              "startOffset": 1.42,
              "endOffset": 1.62
            },
            {
              "word": "item",
              "startOffset": 1.62,
              "endOffset": 1.82
            },
            {
              "word": "Kornatan.",
              "startOffset": 1.82,
              "endOffset": 2.02
            },
            {
              "word": "Nah,",
              "startOffset": 2.02,
              "endOffset": 2.23
            },
            {
              "word": "kita",
              "startOffset": 2.23,
              "endOffset": 2.43
            },
            {
              "word": "diri",
              "startOffset": 2.43,
              "endOffset": 2.63
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-112360-5",
          "startSeconds": 112.36,
          "endSeconds": 114.07,
          "text": "biasa ya, item Kornatan. Nah, kita diri di rumput sini buat nyari info siapa",
          "words": [
            {
              "word": "biasa",
              "startOffset": 0,
              "endOffset": 0.12
            },
            {
              "word": "ya,",
              "startOffset": 0.12,
              "endOffset": 0.24
            },
            {
              "word": "item",
              "startOffset": 0.24,
              "endOffset": 0.37
            },
            {
              "word": "Kornatan.",
              "startOffset": 0.37,
              "endOffset": 0.49
            },
            {
              "word": "Nah,",
              "startOffset": 0.49,
              "endOffset": 0.61
            },
            {
              "word": "kita",
              "startOffset": 0.61,
              "endOffset": 0.73
            },
            {
              "word": "diri",
              "startOffset": 0.73,
              "endOffset": 0.85
            },
            {
              "word": "di",
              "startOffset": 0.85,
              "endOffset": 0.98
            },
            {
              "word": "rumput",
              "startOffset": 0.98,
              "endOffset": 1.1
            },
            {
              "word": "sini",
              "startOffset": 1.1,
              "endOffset": 1.22
            },
            {
              "word": "buat",
              "startOffset": 1.22,
              "endOffset": 1.34
            },
            {
              "word": "nyari",
              "startOffset": 1.34,
              "endOffset": 1.46
            },
            {
              "word": "info",
              "startOffset": 1.46,
              "endOffset": 1.59
            },
            {
              "word": "siapa",
              "startOffset": 1.59,
              "endOffset": 1.71
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-114079-6",
          "startSeconds": 114.08,
          "endSeconds": 116.07,
          "text": "di rumput sini buat nyari info siapa tahu ada Yansin, Guys. Karena lagi",
          "words": [
            {
              "word": "di",
              "startOffset": 0,
              "endOffset": 0.15
            },
            {
              "word": "rumput",
              "startOffset": 0.15,
              "endOffset": 0.31
            },
            {
              "word": "sini",
              "startOffset": 0.31,
              "endOffset": 0.46
            },
            {
              "word": "buat",
              "startOffset": 0.46,
              "endOffset": 0.61
            },
            {
              "word": "nyari",
              "startOffset": 0.61,
              "endOffset": 0.77
            },
            {
              "word": "info",
              "startOffset": 0.77,
              "endOffset": 0.92
            },
            {
              "word": "siapa",
              "startOffset": 0.92,
              "endOffset": 1.07
            },
            {
              "word": "tahu",
              "startOffset": 1.07,
              "endOffset": 1.22
            },
            {
              "word": "ada",
              "startOffset": 1.22,
              "endOffset": 1.38
            },
            {
              "word": "Yansin,",
              "startOffset": 1.38,
              "endOffset": 1.53
            },
            {
              "word": "Guys.",
              "startOffset": 1.53,
              "endOffset": 1.68
            },
            {
              "word": "Karena",
              "startOffset": 1.68,
              "endOffset": 1.84
            },
            {
              "word": "lagi",
              "startOffset": 1.84,
              "endOffset": 1.99
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-116079-7",
          "startSeconds": 116.08,
          "endSeconds": 118.55,
          "text": "tahu ada Yansin, Guys. Karena lagi missing Yansinnya. Oke, Sansin ulti",
          "words": [
            {
              "word": "tahu",
              "startOffset": 0,
              "endOffset": 0.22
            },
            {
              "word": "ada",
              "startOffset": 0.22,
              "endOffset": 0.45
            },
            {
              "word": "Yansin,",
              "startOffset": 0.45,
              "endOffset": 0.67
            },
            {
              "word": "Guys.",
              "startOffset": 0.67,
              "endOffset": 0.9
            },
            {
              "word": "Karena",
              "startOffset": 0.9,
              "endOffset": 1.12
            },
            {
              "word": "lagi",
              "startOffset": 1.12,
              "endOffset": 1.35
            },
            {
              "word": "missing",
              "startOffset": 1.35,
              "endOffset": 1.57
            },
            {
              "word": "Yansinnya.",
              "startOffset": 1.57,
              "endOffset": 1.8
            },
            {
              "word": "Oke,",
              "startOffset": 1.8,
              "endOffset": 2.02
            },
            {
              "word": "Sansin",
              "startOffset": 2.02,
              "endOffset": 2.25
            },
            {
              "word": "ulti",
              "startOffset": 2.25,
              "endOffset": 2.47
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-118560-8",
          "startSeconds": 118.56,
          "endSeconds": 120.15,
          "text": "missing Yansinnya. Oke, Sansin ulti Grandeng-gir ngcil kita. Kita balas",
          "words": [
            {
              "word": "missing",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "Yansinnya.",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "Oke,",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "Sansin",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "ulti",
              "startOffset": 0.64,
              "endOffset": 0.79
            },
            {
              "word": "Grandeng-gir",
              "startOffset": 0.79,
              "endOffset": 0.95
            },
            {
              "word": "ngcil",
              "startOffset": 0.95,
              "endOffset": 1.11
            },
            {
              "word": "kita.",
              "startOffset": 1.11,
              "endOffset": 1.27
            },
            {
              "word": "Kita",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "balas",
              "startOffset": 1.43,
              "endOffset": 1.59
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-120159-9",
          "startSeconds": 120.16,
          "endSeconds": 122.19,
          "text": "Grandeng-gir ngcil kita. Kita balas dikit. Oke, kita kasih dia clear dulu",
          "words": [
            {
              "word": "Grandeng-gir",
              "startOffset": 0,
              "endOffset": 0.17
            },
            {
              "word": "ngcil",
              "startOffset": 0.17,
              "endOffset": 0.34
            },
            {
              "word": "kita.",
              "startOffset": 0.34,
              "endOffset": 0.51
            },
            {
              "word": "Kita",
              "startOffset": 0.51,
              "endOffset": 0.68
            },
            {
              "word": "balas",
              "startOffset": 0.68,
              "endOffset": 0.85
            },
            {
              "word": "dikit.",
              "startOffset": 0.85,
              "endOffset": 1.02
            },
            {
              "word": "Oke,",
              "startOffset": 1.02,
              "endOffset": 1.18
            },
            {
              "word": "kita",
              "startOffset": 1.18,
              "endOffset": 1.35
            },
            {
              "word": "kasih",
              "startOffset": 1.35,
              "endOffset": 1.52
            },
            {
              "word": "dia",
              "startOffset": 1.52,
              "endOffset": 1.69
            },
            {
              "word": "clear",
              "startOffset": 1.69,
              "endOffset": 1.86
            },
            {
              "word": "dulu",
              "startOffset": 1.86,
              "endOffset": 2.03
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-122200-10",
          "startSeconds": 122.2,
          "endSeconds": 124.23,
          "text": "dikit. Oke, kita kasih dia clear dulu aja, Guys. Karena energi dia masih",
          "words": [
            {
              "word": "dikit.",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "Oke,",
              "startOffset": 0.16,
              "endOffset": 0.31
            },
            {
              "word": "kita",
              "startOffset": 0.31,
              "endOffset": 0.47
            },
            {
              "word": "kasih",
              "startOffset": 0.47,
              "endOffset": 0.62
            },
            {
              "word": "dia",
              "startOffset": 0.62,
              "endOffset": 0.78
            },
            {
              "word": "clear",
              "startOffset": 0.78,
              "endOffset": 0.94
            },
            {
              "word": "dulu",
              "startOffset": 0.94,
              "endOffset": 1.09
            },
            {
              "word": "aja,",
              "startOffset": 1.09,
              "endOffset": 1.25
            },
            {
              "word": "Guys.",
              "startOffset": 1.25,
              "endOffset": 1.41
            },
            {
              "word": "Karena",
              "startOffset": 1.41,
              "endOffset": 1.56
            },
            {
              "word": "energi",
              "startOffset": 1.56,
              "endOffset": 1.72
            },
            {
              "word": "dia",
              "startOffset": 1.72,
              "endOffset": 1.87
            },
            {
              "word": "masih",
              "startOffset": 1.87,
              "endOffset": 2.03
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-124240-11",
          "startSeconds": 124.24,
          "endSeconds": 125.83,
          "text": "aja, Guys. Karena energi dia masih banyak. Kalau lawan Grenger itu kalian",
          "words": [
            {
              "word": "aja,",
              "startOffset": 0,
              "endOffset": 0.13
            },
            {
              "word": "Guys.",
              "startOffset": 0.13,
              "endOffset": 0.27
            },
            {
              "word": "Karena",
              "startOffset": 0.27,
              "endOffset": 0.4
            },
            {
              "word": "energi",
              "startOffset": 0.4,
              "endOffset": 0.53
            },
            {
              "word": "dia",
              "startOffset": 0.53,
              "endOffset": 0.66
            },
            {
              "word": "masih",
              "startOffset": 0.66,
              "endOffset": 0.8
            },
            {
              "word": "banyak.",
              "startOffset": 0.8,
              "endOffset": 0.93
            },
            {
              "word": "Kalau",
              "startOffset": 0.93,
              "endOffset": 1.06
            },
            {
              "word": "lawan",
              "startOffset": 1.06,
              "endOffset": 1.19
            },
            {
              "word": "Grenger",
              "startOffset": 1.19,
              "endOffset": 1.33
            },
            {
              "word": "itu",
              "startOffset": 1.33,
              "endOffset": 1.46
            },
            {
              "word": "kalian",
              "startOffset": 1.46,
              "endOffset": 1.59
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-125840-12",
          "startSeconds": 125.84,
          "endSeconds": 128.39,
          "text": "banyak. Kalau lawan Grenger itu kalian lihat energi grangernya, ya. Apakah dia",
          "words": [
            {
              "word": "banyak.",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "Kalau",
              "startOffset": 0.21,
              "endOffset": 0.42
            },
            {
              "word": "lawan",
              "startOffset": 0.42,
              "endOffset": 0.64
            },
            {
              "word": "Grenger",
              "startOffset": 0.64,
              "endOffset": 0.85
            },
            {
              "word": "itu",
              "startOffset": 0.85,
              "endOffset": 1.06
            },
            {
              "word": "kalian",
              "startOffset": 1.06,
              "endOffset": 1.27
            },
            {
              "word": "lihat",
              "startOffset": 1.27,
              "endOffset": 1.49
            },
            {
              "word": "energi",
              "startOffset": 1.49,
              "endOffset": 1.7
            },
            {
              "word": "grangernya,",
              "startOffset": 1.7,
              "endOffset": 1.91
            },
            {
              "word": "ya.",
              "startOffset": 1.91,
              "endOffset": 2.12
            },
            {
              "word": "Apakah",
              "startOffset": 2.12,
              "endOffset": 2.34
            },
            {
              "word": "dia",
              "startOffset": 2.34,
              "endOffset": 2.55
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-xGnq6uL4FSU-3-128399-13",
          "startSeconds": 128.4,
          "endSeconds": 130,
          "text": "lihat energi grangernya, ya. Apakah dia energinya masih banyak atau udah habis,",
          "words": [
            {
              "word": "lihat",
              "startOffset": 0,
              "endOffset": 0.13
            },
            {
              "word": "energi",
              "startOffset": 0.13,
              "endOffset": 0.27
            },
            {
              "word": "grangernya,",
              "startOffset": 0.27,
              "endOffset": 0.4
            },
            {
              "word": "ya.",
              "startOffset": 0.4,
              "endOffset": 0.53
            },
            {
              "word": "Apakah",
              "startOffset": 0.53,
              "endOffset": 0.67
            },
            {
              "word": "dia",
              "startOffset": 0.67,
              "endOffset": 0.8
            },
            {
              "word": "energinya",
              "startOffset": 0.8,
              "endOffset": 0.93
            },
            {
              "word": "masih",
              "startOffset": 0.93,
              "endOffset": 1.07
            },
            {
              "word": "banyak",
              "startOffset": 1.07,
              "endOffset": 1.2
            },
            {
              "word": "atau",
              "startOffset": 1.2,
              "endOffset": 1.33
            },
            {
              "word": "udah",
              "startOffset": 1.33,
              "endOffset": 1.47
            },
            {
              "word": "habis,",
              "startOffset": 1.47,
              "endOffset": 1.6
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ]
    }
  },
  {
    "video": {
      "id": "video-3",
      "platform": "youtube",
      "sourceUrl": "https://www.youtube.com/watch?v=R44Gmp3c6Nw",
      "externalId": "R44Gmp3c6Nw",
      "title": "BILLIARD DAN SODOR BARU! - Bowling Alley Simulator #5",
      "channelName": "TAMPAN GAMING",
      "durationSeconds": 1428,
      "thumbnailUrl": "https://i.ytimg.com/vi_webp/R44Gmp3c6Nw/maxresdefault.webp",
      "viewsCount": "849 views",
      "status": "ready",
      "audioWaveform": [
        80,
        80,
        39,
        22,
        33,
        80,
        37,
        80,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12,
        12
      ],
      "chatVelocity": [
        37,
        34,
        34,
        44,
        46,
        42,
        45,
        24,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    "highlights": [
      {
        "id": "hl-video-3-1",
        "sourceVideoId": "video-3",
        "title": "Puncak reaksi Gila, sisa 1.000 dan tamat guys",
        "startSeconds": 80,
        "endSeconds": 110,
        "duration": 30,
        "audioScore": 78,
        "chatScore": 76,
        "totalScore": 82,
        "tags": [
          "ANJIR",
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"Gila, sisa 1.000 dan tamat guys, tamat ya teman-teman ya. Alhamdulillah. Jangan ya teman-teman ya. Alhamdulillah. Jangan\" â 1 slang terdeteksi di window ini.",
        "chatSpikeReason": "Audio peak 55/100 â¢ 37 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-3-2",
        "sourceVideoId": "video-3",
        "title": "Puncak reaksi Kita kejar 6.000, ya. Harusnya...",
        "startSeconds": 140,
        "endSeconds": 170,
        "duration": 30,
        "audioScore": 76,
        "chatScore": 74,
        "totalScore": 81,
        "tags": [
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"Kita kejar 6.000, ya. Harusnya kejar sih, Teman-teman. sih, Teman-teman.\" â Momen dengan intensitas chat tertinggi.",
        "chatSpikeReason": "Audio peak 52/100 â¢ 49 aktivitas/tdk pada momen ini"
      },
      {
        "id": "hl-video-3-3",
        "sourceVideoId": "video-3",
        "title": "Puncak reaksi kurengnya ya teman-teman ya. Ja...",
        "startSeconds": 220,
        "endSeconds": 250,
        "duration": 30,
        "audioScore": 76,
        "chatScore": 74,
        "totalScore": 81,
        "tags": [
          "Chat Hype"
        ],
        "description": "Rangkuman dari transcript: \"kurengnya ya teman-teman ya. Jadi kayaknya yang paling benar kita nambah kayaknya yang paling benar kita nambah\" â Momen dengan intensitas chat tertinggi.",
        "chatSpikeReason": "Audio peak 44/100 â¢ 47 aktivitas/tdk pada momen ini"
      }
    ],
    "captionsMap": {
      "hl-video-3-1": [
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-80000-0",
          "startSeconds": 80,
          "endSeconds": 80.99,
          "text": "Gila, sisa 1.000 dan tamat guys, tamat ya teman-teman ya. Alhamdulillah. Jangan",
          "words": [
            {
              "word": "Gila,",
              "startOffset": 0,
              "endOffset": 0.08
            },
            {
              "word": "sisa",
              "startOffset": 0.08,
              "endOffset": 0.16
            },
            {
              "word": "1.000",
              "startOffset": 0.16,
              "endOffset": 0.25
            },
            {
              "word": "dan",
              "startOffset": 0.25,
              "endOffset": 0.33
            },
            {
              "word": "tamat",
              "startOffset": 0.33,
              "endOffset": 0.41
            },
            {
              "word": "guys,",
              "startOffset": 0.41,
              "endOffset": 0.49
            },
            {
              "word": "tamat",
              "startOffset": 0.49,
              "endOffset": 0.58
            },
            {
              "word": "ya",
              "startOffset": 0.58,
              "endOffset": 0.66
            },
            {
              "word": "teman-teman",
              "startOffset": 0.66,
              "endOffset": 0.74
            },
            {
              "word": "ya.",
              "startOffset": 0.74,
              "endOffset": 0.82
            },
            {
              "word": "Alhamdulillah.",
              "startOffset": 0.82,
              "endOffset": 0.91
            },
            {
              "word": "Jangan",
              "startOffset": 0.91,
              "endOffset": 0.99
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-81000-1",
          "startSeconds": 81,
          "endSeconds": 82.71,
          "text": "ya teman-teman ya. Alhamdulillah. Jangan ngutang ya, Guys, ya. Kerja sambil",
          "words": [
            {
              "word": "ya",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "teman-teman",
              "startOffset": 0.16,
              "endOffset": 0.31
            },
            {
              "word": "ya.",
              "startOffset": 0.31,
              "endOffset": 0.47
            },
            {
              "word": "Alhamdulillah.",
              "startOffset": 0.47,
              "endOffset": 0.62
            },
            {
              "word": "Jangan",
              "startOffset": 0.62,
              "endOffset": 0.78
            },
            {
              "word": "ngutang",
              "startOffset": 0.78,
              "endOffset": 0.93
            },
            {
              "word": "ya,",
              "startOffset": 0.93,
              "endOffset": 1.09
            },
            {
              "word": "Guys,",
              "startOffset": 1.09,
              "endOffset": 1.24
            },
            {
              "word": "ya.",
              "startOffset": 1.24,
              "endOffset": 1.4
            },
            {
              "word": "Kerja",
              "startOffset": 1.4,
              "endOffset": 1.55
            },
            {
              "word": "sambil",
              "startOffset": 1.55,
              "endOffset": 1.71
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-82720-2",
          "startSeconds": 82.72,
          "endSeconds": 85.95,
          "text": "ngutang ya, Guys, ya. Kerja sambil pusing. Jujur, jujur asli. Kalau kalian",
          "words": [
            {
              "word": "ngutang",
              "startOffset": 0,
              "endOffset": 0.27
            },
            {
              "word": "ya,",
              "startOffset": 0.27,
              "endOffset": 0.54
            },
            {
              "word": "Guys,",
              "startOffset": 0.54,
              "endOffset": 0.81
            },
            {
              "word": "ya.",
              "startOffset": 0.81,
              "endOffset": 1.08
            },
            {
              "word": "Kerja",
              "startOffset": 1.08,
              "endOffset": 1.35
            },
            {
              "word": "sambil",
              "startOffset": 1.35,
              "endOffset": 1.62
            },
            {
              "word": "pusing.",
              "startOffset": 1.62,
              "endOffset": 1.88
            },
            {
              "word": "Jujur,",
              "startOffset": 1.88,
              "endOffset": 2.15
            },
            {
              "word": "jujur",
              "startOffset": 2.15,
              "endOffset": 2.42
            },
            {
              "word": "asli.",
              "startOffset": 2.42,
              "endOffset": 2.69
            },
            {
              "word": "Kalau",
              "startOffset": 2.69,
              "endOffset": 2.96
            },
            {
              "word": "kalian",
              "startOffset": 2.96,
              "endOffset": 3.23
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-85960-3",
          "startSeconds": 85.96,
          "endSeconds": 88.23,
          "text": "pusing. Jujur, jujur asli. Kalau kalian kebanyakan ngutang, kerja sambil pusing,",
          "words": [
            {
              "word": "pusing.",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "Jujur,",
              "startOffset": 0.21,
              "endOffset": 0.41
            },
            {
              "word": "jujur",
              "startOffset": 0.41,
              "endOffset": 0.62
            },
            {
              "word": "asli.",
              "startOffset": 0.62,
              "endOffset": 0.83
            },
            {
              "word": "Kalau",
              "startOffset": 0.83,
              "endOffset": 1.03
            },
            {
              "word": "kalian",
              "startOffset": 1.03,
              "endOffset": 1.24
            },
            {
              "word": "kebanyakan",
              "startOffset": 1.24,
              "endOffset": 1.44
            },
            {
              "word": "ngutang,",
              "startOffset": 1.44,
              "endOffset": 1.65
            },
            {
              "word": "kerja",
              "startOffset": 1.65,
              "endOffset": 1.86
            },
            {
              "word": "sambil",
              "startOffset": 1.86,
              "endOffset": 2.06
            },
            {
              "word": "pusing,",
              "startOffset": 2.06,
              "endOffset": 2.27
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-88240-4",
          "startSeconds": 88.24,
          "endSeconds": 90.91,
          "text": "kebanyakan ngutang, kerja sambil pusing, anjir. Kayak kurang menikmati pekerjaan",
          "words": [
            {
              "word": "kebanyakan",
              "startOffset": 0,
              "endOffset": 0.27
            },
            {
              "word": "ngutang,",
              "startOffset": 0.27,
              "endOffset": 0.53
            },
            {
              "word": "kerja",
              "startOffset": 0.53,
              "endOffset": 0.8
            },
            {
              "word": "sambil",
              "startOffset": 0.8,
              "endOffset": 1.07
            },
            {
              "word": "pusing,",
              "startOffset": 1.07,
              "endOffset": 1.34
            },
            {
              "word": "anjir.",
              "startOffset": 1.34,
              "endOffset": 1.6,
              "isSlang": true,
              "normalizedFrom": "anjir"
            },
            {
              "word": "Kayak",
              "startOffset": 1.6,
              "endOffset": 1.87
            },
            {
              "word": "kurang",
              "startOffset": 1.87,
              "endOffset": 2.14
            },
            {
              "word": "menikmati",
              "startOffset": 2.14,
              "endOffset": 2.4
            },
            {
              "word": "pekerjaan",
              "startOffset": 2.4,
              "endOffset": 2.67
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-90920-5",
          "startSeconds": 90.92,
          "endSeconds": 94.11,
          "text": "anjir. Kayak kurang menikmati pekerjaan aja gitu, Teman-teman. So, ya kita punya",
          "words": [
            {
              "word": "anjir.",
              "startOffset": 0,
              "endOffset": 0.27,
              "isSlang": true,
              "normalizedFrom": "anjir"
            },
            {
              "word": "Kayak",
              "startOffset": 0.27,
              "endOffset": 0.53
            },
            {
              "word": "kurang",
              "startOffset": 0.53,
              "endOffset": 0.8
            },
            {
              "word": "menikmati",
              "startOffset": 0.8,
              "endOffset": 1.06
            },
            {
              "word": "pekerjaan",
              "startOffset": 1.06,
              "endOffset": 1.33
            },
            {
              "word": "aja",
              "startOffset": 1.33,
              "endOffset": 1.59
            },
            {
              "word": "gitu,",
              "startOffset": 1.59,
              "endOffset": 1.86
            },
            {
              "word": "Teman-teman.",
              "startOffset": 1.86,
              "endOffset": 2.13
            },
            {
              "word": "So,",
              "startOffset": 2.13,
              "endOffset": 2.39
            },
            {
              "word": "ya",
              "startOffset": 2.39,
              "endOffset": 2.66
            },
            {
              "word": "kita",
              "startOffset": 2.66,
              "endOffset": 2.92
            },
            {
              "word": "punya",
              "startOffset": 2.92,
              "endOffset": 3.19
            }
          ],
          "confidence": 88,
          "hasSlang": true
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-94119-6",
          "startSeconds": 94.12,
          "endSeconds": 96.99,
          "text": "aja gitu, Teman-teman. So, ya kita punya uang 4.000",
          "words": [
            {
              "word": "aja",
              "startOffset": 0,
              "endOffset": 0.32
            },
            {
              "word": "gitu,",
              "startOffset": 0.32,
              "endOffset": 0.64
            },
            {
              "word": "Teman-teman.",
              "startOffset": 0.64,
              "endOffset": 0.96
            },
            {
              "word": "So,",
              "startOffset": 0.96,
              "endOffset": 1.28
            },
            {
              "word": "ya",
              "startOffset": 1.28,
              "endOffset": 1.59
            },
            {
              "word": "kita",
              "startOffset": 1.59,
              "endOffset": 1.91
            },
            {
              "word": "punya",
              "startOffset": 1.91,
              "endOffset": 2.23
            },
            {
              "word": "uang",
              "startOffset": 2.23,
              "endOffset": 2.55
            },
            {
              "word": "4.000",
              "startOffset": 2.55,
              "endOffset": 2.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-97000-7",
          "startSeconds": 97,
          "endSeconds": 100.03,
          "text": "uang 4.000 di sini ya, Teman-teman, ya. 4.000 ini",
          "words": [
            {
              "word": "uang",
              "startOffset": 0,
              "endOffset": 0.34
            },
            {
              "word": "4.000",
              "startOffset": 0.34,
              "endOffset": 0.67
            },
            {
              "word": "di",
              "startOffset": 0.67,
              "endOffset": 1.01
            },
            {
              "word": "sini",
              "startOffset": 1.01,
              "endOffset": 1.35
            },
            {
              "word": "ya,",
              "startOffset": 1.35,
              "endOffset": 1.68
            },
            {
              "word": "Teman-teman,",
              "startOffset": 1.68,
              "endOffset": 2.02
            },
            {
              "word": "ya.",
              "startOffset": 2.02,
              "endOffset": 2.36
            },
            {
              "word": "4.000",
              "startOffset": 2.36,
              "endOffset": 2.69
            },
            {
              "word": "ini",
              "startOffset": 2.69,
              "endOffset": 3.03
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-100040-8",
          "startSeconds": 100.04,
          "endSeconds": 104.27,
          "text": "di sini ya, Teman-teman, ya. 4.000 ini jujur gua bingung mau buat apa lagi ya.",
          "words": [
            {
              "word": "di",
              "startOffset": 0,
              "endOffset": 0.28
            },
            {
              "word": "sini",
              "startOffset": 0.28,
              "endOffset": 0.56
            },
            {
              "word": "ya,",
              "startOffset": 0.56,
              "endOffset": 0.85
            },
            {
              "word": "Teman-teman,",
              "startOffset": 0.85,
              "endOffset": 1.13
            },
            {
              "word": "ya.",
              "startOffset": 1.13,
              "endOffset": 1.41
            },
            {
              "word": "4.000",
              "startOffset": 1.41,
              "endOffset": 1.69
            },
            {
              "word": "ini",
              "startOffset": 1.69,
              "endOffset": 1.97
            },
            {
              "word": "jujur",
              "startOffset": 1.97,
              "endOffset": 2.26
            },
            {
              "word": "gua",
              "startOffset": 2.26,
              "endOffset": 2.54
            },
            {
              "word": "bingung",
              "startOffset": 2.54,
              "endOffset": 2.82
            },
            {
              "word": "mau",
              "startOffset": 2.82,
              "endOffset": 3.1
            },
            {
              "word": "buat",
              "startOffset": 3.1,
              "endOffset": 3.38
            },
            {
              "word": "apa",
              "startOffset": 3.38,
              "endOffset": 3.67
            },
            {
              "word": "lagi",
              "startOffset": 3.67,
              "endOffset": 3.95
            },
            {
              "word": "ya.",
              "startOffset": 3.95,
              "endOffset": 4.23
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-104280-9",
          "startSeconds": 104.28,
          "endSeconds": 107.41,
          "text": "jujur gua bingung mau buat apa lagi ya. Yang jelas coba kita cek ya untuk",
          "words": [
            {
              "word": "jujur",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "gua",
              "startOffset": 0.21,
              "endOffset": 0.42
            },
            {
              "word": "bingung",
              "startOffset": 0.42,
              "endOffset": 0.63
            },
            {
              "word": "mau",
              "startOffset": 0.63,
              "endOffset": 0.83
            },
            {
              "word": "buat",
              "startOffset": 0.83,
              "endOffset": 1.04
            },
            {
              "word": "apa",
              "startOffset": 1.04,
              "endOffset": 1.25
            },
            {
              "word": "lagi",
              "startOffset": 1.25,
              "endOffset": 1.46
            },
            {
              "word": "ya.",
              "startOffset": 1.46,
              "endOffset": 1.67
            },
            {
              "word": "Yang",
              "startOffset": 1.67,
              "endOffset": 1.88
            },
            {
              "word": "jelas",
              "startOffset": 1.88,
              "endOffset": 2.09
            },
            {
              "word": "coba",
              "startOffset": 2.09,
              "endOffset": 2.3
            },
            {
              "word": "kita",
              "startOffset": 2.3,
              "endOffset": 2.5
            },
            {
              "word": "cek",
              "startOffset": 2.5,
              "endOffset": 2.71
            },
            {
              "word": "ya",
              "startOffset": 2.71,
              "endOffset": 2.92
            },
            {
              "word": "untuk",
              "startOffset": 2.92,
              "endOffset": 3.13
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-1-107421-10",
          "startSeconds": 107.42,
          "endSeconds": 110,
          "text": "Yang jelas coba kita cek ya untuk [mendengus] emm PC di belakang.",
          "words": [
            {
              "word": "Yang",
              "startOffset": 0,
              "endOffset": 0.21
            },
            {
              "word": "jelas",
              "startOffset": 0.21,
              "endOffset": 0.43
            },
            {
              "word": "coba",
              "startOffset": 0.43,
              "endOffset": 0.64
            },
            {
              "word": "kita",
              "startOffset": 0.64,
              "endOffset": 0.86
            },
            {
              "word": "cek",
              "startOffset": 0.86,
              "endOffset": 1.07
            },
            {
              "word": "ya",
              "startOffset": 1.07,
              "endOffset": 1.29
            },
            {
              "word": "untuk",
              "startOffset": 1.29,
              "endOffset": 1.5
            },
            {
              "word": "[mendengus]",
              "startOffset": 1.5,
              "endOffset": 1.72
            },
            {
              "word": "emm",
              "startOffset": 1.72,
              "endOffset": 1.93
            },
            {
              "word": "PC",
              "startOffset": 1.93,
              "endOffset": 2.15
            },
            {
              "word": "di",
              "startOffset": 2.15,
              "endOffset": 2.36
            },
            {
              "word": "belakang.",
              "startOffset": 2.36,
              "endOffset": 2.58
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-3-2": [
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-140000-0",
          "startSeconds": 140,
          "endSeconds": 141.87,
          "text": "Kita kejar 6.000, ya. Harusnya kejar sih, Teman-teman.",
          "words": [
            {
              "word": "Kita",
              "startOffset": 0,
              "endOffset": 0.23
            },
            {
              "word": "kejar",
              "startOffset": 0.23,
              "endOffset": 0.47
            },
            {
              "word": "6.000,",
              "startOffset": 0.47,
              "endOffset": 0.7
            },
            {
              "word": "ya.",
              "startOffset": 0.7,
              "endOffset": 0.93
            },
            {
              "word": "Harusnya",
              "startOffset": 0.93,
              "endOffset": 1.17
            },
            {
              "word": "kejar",
              "startOffset": 1.17,
              "endOffset": 1.4
            },
            {
              "word": "sih,",
              "startOffset": 1.4,
              "endOffset": 1.64
            },
            {
              "word": "Teman-teman.",
              "startOffset": 1.64,
              "endOffset": 1.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-141879-1",
          "startSeconds": 141.88,
          "endSeconds": 144.27,
          "text": "sih, Teman-teman. Oke ya. Pada marah-marah. Enggak apa-apa",
          "words": [
            {
              "word": "sih,",
              "startOffset": 0,
              "endOffset": 0.3
            },
            {
              "word": "Teman-teman.",
              "startOffset": 0.3,
              "endOffset": 0.6
            },
            {
              "word": "Oke",
              "startOffset": 0.6,
              "endOffset": 0.9
            },
            {
              "word": "ya.",
              "startOffset": 0.9,
              "endOffset": 1.2
            },
            {
              "word": "Pada",
              "startOffset": 1.2,
              "endOffset": 1.49
            },
            {
              "word": "marah-marah.",
              "startOffset": 1.49,
              "endOffset": 1.79
            },
            {
              "word": "Enggak",
              "startOffset": 1.79,
              "endOffset": 2.09
            },
            {
              "word": "apa-apa",
              "startOffset": 2.09,
              "endOffset": 2.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-144280-2",
          "startSeconds": 144.28,
          "endSeconds": 146.67,
          "text": "Oke ya. Pada marah-marah. Enggak apa-apa harga masakan mahal dan lain-lain itu",
          "words": [
            {
              "word": "Oke",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "ya.",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "Pada",
              "startOffset": 0.4,
              "endOffset": 0.6
            },
            {
              "word": "marah-marah.",
              "startOffset": 0.6,
              "endOffset": 0.8
            },
            {
              "word": "Enggak",
              "startOffset": 0.8,
              "endOffset": 1
            },
            {
              "word": "apa-apa",
              "startOffset": 1,
              "endOffset": 1.19
            },
            {
              "word": "harga",
              "startOffset": 1.19,
              "endOffset": 1.39
            },
            {
              "word": "masakan",
              "startOffset": 1.39,
              "endOffset": 1.59
            },
            {
              "word": "mahal",
              "startOffset": 1.59,
              "endOffset": 1.79
            },
            {
              "word": "dan",
              "startOffset": 1.79,
              "endOffset": 1.99
            },
            {
              "word": "lain-lain",
              "startOffset": 1.99,
              "endOffset": 2.19
            },
            {
              "word": "itu",
              "startOffset": 2.19,
              "endOffset": 2.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-146680-3",
          "startSeconds": 146.68,
          "endSeconds": 148.75,
          "text": "harga masakan mahal dan lain-lain itu enggak apa-apa, Guys. Itu udah udah hal",
          "words": [
            {
              "word": "harga",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "masakan",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "mahal",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "dan",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "lain-lain",
              "startOffset": 0.64,
              "endOffset": 0.8
            },
            {
              "word": "itu",
              "startOffset": 0.8,
              "endOffset": 0.96
            },
            {
              "word": "enggak",
              "startOffset": 0.96,
              "endOffset": 1.11
            },
            {
              "word": "apa-apa,",
              "startOffset": 1.11,
              "endOffset": 1.27
            },
            {
              "word": "Guys.",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "Itu",
              "startOffset": 1.43,
              "endOffset": 1.59
            },
            {
              "word": "udah",
              "startOffset": 1.59,
              "endOffset": 1.75
            },
            {
              "word": "udah",
              "startOffset": 1.75,
              "endOffset": 1.91
            },
            {
              "word": "hal",
              "startOffset": 1.91,
              "endOffset": 2.07
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-148760-4",
          "startSeconds": 148.76,
          "endSeconds": 151.59,
          "text": "enggak apa-apa, Guys. Itu udah udah hal yang wajar benar dah. Itu hal wajar,",
          "words": [
            {
              "word": "enggak",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "apa-apa,",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "Guys.",
              "startOffset": 0.4,
              "endOffset": 0.61
            },
            {
              "word": "Itu",
              "startOffset": 0.61,
              "endOffset": 0.81
            },
            {
              "word": "udah",
              "startOffset": 0.81,
              "endOffset": 1.01
            },
            {
              "word": "udah",
              "startOffset": 1.01,
              "endOffset": 1.21
            },
            {
              "word": "hal",
              "startOffset": 1.21,
              "endOffset": 1.41
            },
            {
              "word": "yang",
              "startOffset": 1.41,
              "endOffset": 1.62
            },
            {
              "word": "wajar",
              "startOffset": 1.62,
              "endOffset": 1.82
            },
            {
              "word": "benar",
              "startOffset": 1.82,
              "endOffset": 2.02
            },
            {
              "word": "dah.",
              "startOffset": 2.02,
              "endOffset": 2.22
            },
            {
              "word": "Itu",
              "startOffset": 2.22,
              "endOffset": 2.42
            },
            {
              "word": "hal",
              "startOffset": 2.42,
              "endOffset": 2.63
            },
            {
              "word": "wajar,",
              "startOffset": 2.63,
              "endOffset": 2.83
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-151599-5",
          "startSeconds": 151.6,
          "endSeconds": 153.93,
          "text": "yang wajar benar dah. Itu hal wajar, Guys, di tempat kita. Yang penting",
          "words": [
            {
              "word": "yang",
              "startOffset": 0,
              "endOffset": 0.18
            },
            {
              "word": "wajar",
              "startOffset": 0.18,
              "endOffset": 0.36
            },
            {
              "word": "benar",
              "startOffset": 0.36,
              "endOffset": 0.54
            },
            {
              "word": "dah.",
              "startOffset": 0.54,
              "endOffset": 0.72
            },
            {
              "word": "Itu",
              "startOffset": 0.72,
              "endOffset": 0.9
            },
            {
              "word": "hal",
              "startOffset": 0.9,
              "endOffset": 1.08
            },
            {
              "word": "wajar,",
              "startOffset": 1.08,
              "endOffset": 1.26
            },
            {
              "word": "Guys,",
              "startOffset": 1.26,
              "endOffset": 1.43
            },
            {
              "word": "di",
              "startOffset": 1.43,
              "endOffset": 1.61
            },
            {
              "word": "tempat",
              "startOffset": 1.61,
              "endOffset": 1.79
            },
            {
              "word": "kita.",
              "startOffset": 1.79,
              "endOffset": 1.97
            },
            {
              "word": "Yang",
              "startOffset": 1.97,
              "endOffset": 2.15
            },
            {
              "word": "penting",
              "startOffset": 2.15,
              "endOffset": 2.33
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-153940-6",
          "startSeconds": 153.94,
          "endSeconds": 154.67,
          "text": "Guys, di tempat kita. Yang penting [mendengus]",
          "words": [
            {
              "word": "Guys,",
              "startOffset": 0,
              "endOffset": 0.1
            },
            {
              "word": "di",
              "startOffset": 0.1,
              "endOffset": 0.21
            },
            {
              "word": "tempat",
              "startOffset": 0.21,
              "endOffset": 0.31
            },
            {
              "word": "kita.",
              "startOffset": 0.31,
              "endOffset": 0.42
            },
            {
              "word": "Yang",
              "startOffset": 0.42,
              "endOffset": 0.52
            },
            {
              "word": "penting",
              "startOffset": 0.52,
              "endOffset": 0.63
            },
            {
              "word": "[mendengus]",
              "startOffset": 0.63,
              "endOffset": 0.73
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-154680-7",
          "startSeconds": 154.68,
          "endSeconds": 156.67,
          "text": "[mendengus] kita tetap cuan, cuan, cuan ggak usah",
          "words": [
            {
              "word": "[mendengus]",
              "startOffset": 0,
              "endOffset": 0.25
            },
            {
              "word": "kita",
              "startOffset": 0.25,
              "endOffset": 0.5
            },
            {
              "word": "tetap",
              "startOffset": 0.5,
              "endOffset": 0.75
            },
            {
              "word": "cuan,",
              "startOffset": 0.75,
              "endOffset": 0.99
            },
            {
              "word": "cuan,",
              "startOffset": 0.99,
              "endOffset": 1.24
            },
            {
              "word": "cuan",
              "startOffset": 1.24,
              "endOffset": 1.49
            },
            {
              "word": "ggak",
              "startOffset": 1.49,
              "endOffset": 1.74
            },
            {
              "word": "usah",
              "startOffset": 1.74,
              "endOffset": 1.99
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-156680-8",
          "startSeconds": 156.68,
          "endSeconds": 158.39,
          "text": "kita tetap cuan, cuan, cuan ggak usah mikirin orang yang ada di sini karena",
          "words": [
            {
              "word": "kita",
              "startOffset": 0,
              "endOffset": 0.12
            },
            {
              "word": "tetap",
              "startOffset": 0.12,
              "endOffset": 0.24
            },
            {
              "word": "cuan,",
              "startOffset": 0.24,
              "endOffset": 0.37
            },
            {
              "word": "cuan,",
              "startOffset": 0.37,
              "endOffset": 0.49
            },
            {
              "word": "cuan",
              "startOffset": 0.49,
              "endOffset": 0.61
            },
            {
              "word": "ggak",
              "startOffset": 0.61,
              "endOffset": 0.73
            },
            {
              "word": "usah",
              "startOffset": 0.73,
              "endOffset": 0.85
            },
            {
              "word": "mikirin",
              "startOffset": 0.85,
              "endOffset": 0.98
            },
            {
              "word": "orang",
              "startOffset": 0.98,
              "endOffset": 1.1
            },
            {
              "word": "yang",
              "startOffset": 1.1,
              "endOffset": 1.22
            },
            {
              "word": "ada",
              "startOffset": 1.22,
              "endOffset": 1.34
            },
            {
              "word": "di",
              "startOffset": 1.34,
              "endOffset": 1.47
            },
            {
              "word": "sini",
              "startOffset": 1.47,
              "endOffset": 1.59
            },
            {
              "word": "karena",
              "startOffset": 1.59,
              "endOffset": 1.71
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-158400-9",
          "startSeconds": 158.4,
          "endSeconds": 160.27,
          "text": "mikirin orang yang ada di sini karena mereka juga enggak mikirin kita, Bro. Ya",
          "words": [
            {
              "word": "mikirin",
              "startOffset": 0,
              "endOffset": 0.13
            },
            {
              "word": "orang",
              "startOffset": 0.13,
              "endOffset": 0.27
            },
            {
              "word": "yang",
              "startOffset": 0.27,
              "endOffset": 0.4
            },
            {
              "word": "ada",
              "startOffset": 0.4,
              "endOffset": 0.53
            },
            {
              "word": "di",
              "startOffset": 0.53,
              "endOffset": 0.67
            },
            {
              "word": "sini",
              "startOffset": 0.67,
              "endOffset": 0.8
            },
            {
              "word": "karena",
              "startOffset": 0.8,
              "endOffset": 0.94
            },
            {
              "word": "mereka",
              "startOffset": 0.94,
              "endOffset": 1.07
            },
            {
              "word": "juga",
              "startOffset": 1.07,
              "endOffset": 1.2
            },
            {
              "word": "enggak",
              "startOffset": 1.2,
              "endOffset": 1.34
            },
            {
              "word": "mikirin",
              "startOffset": 1.34,
              "endOffset": 1.47
            },
            {
              "word": "kita,",
              "startOffset": 1.47,
              "endOffset": 1.6
            },
            {
              "word": "Bro.",
              "startOffset": 1.6,
              "endOffset": 1.74
            },
            {
              "word": "Ya",
              "startOffset": 1.74,
              "endOffset": 1.87
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-160280-10",
          "startSeconds": 160.28,
          "endSeconds": 162.71,
          "text": "mereka juga enggak mikirin kita, Bro. Ya kan? Mereka enggak mikirin kita, Bro.",
          "words": [
            {
              "word": "mereka",
              "startOffset": 0,
              "endOffset": 0.19
            },
            {
              "word": "juga",
              "startOffset": 0.19,
              "endOffset": 0.37
            },
            {
              "word": "enggak",
              "startOffset": 0.37,
              "endOffset": 0.56
            },
            {
              "word": "mikirin",
              "startOffset": 0.56,
              "endOffset": 0.75
            },
            {
              "word": "kita,",
              "startOffset": 0.75,
              "endOffset": 0.93
            },
            {
              "word": "Bro.",
              "startOffset": 0.93,
              "endOffset": 1.12
            },
            {
              "word": "Ya",
              "startOffset": 1.12,
              "endOffset": 1.31
            },
            {
              "word": "kan?",
              "startOffset": 1.31,
              "endOffset": 1.5
            },
            {
              "word": "Mereka",
              "startOffset": 1.5,
              "endOffset": 1.68
            },
            {
              "word": "enggak",
              "startOffset": 1.68,
              "endOffset": 1.87
            },
            {
              "word": "mikirin",
              "startOffset": 1.87,
              "endOffset": 2.06
            },
            {
              "word": "kita,",
              "startOffset": 2.06,
              "endOffset": 2.24
            },
            {
              "word": "Bro.",
              "startOffset": 2.24,
              "endOffset": 2.43
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-162720-11",
          "startSeconds": 162.72,
          "endSeconds": 165.11,
          "text": "kan? Mereka enggak mikirin kita, Bro. Jadi, ya udahlah gas pol aja lah",
          "words": [
            {
              "word": "kan?",
              "startOffset": 0,
              "endOffset": 0.18
            },
            {
              "word": "Mereka",
              "startOffset": 0.18,
              "endOffset": 0.37
            },
            {
              "word": "enggak",
              "startOffset": 0.37,
              "endOffset": 0.55
            },
            {
              "word": "mikirin",
              "startOffset": 0.55,
              "endOffset": 0.74
            },
            {
              "word": "kita,",
              "startOffset": 0.74,
              "endOffset": 0.92
            },
            {
              "word": "Bro.",
              "startOffset": 0.92,
              "endOffset": 1.1
            },
            {
              "word": "Jadi,",
              "startOffset": 1.1,
              "endOffset": 1.29
            },
            {
              "word": "ya",
              "startOffset": 1.29,
              "endOffset": 1.47
            },
            {
              "word": "udahlah",
              "startOffset": 1.47,
              "endOffset": 1.65
            },
            {
              "word": "gas",
              "startOffset": 1.65,
              "endOffset": 1.84
            },
            {
              "word": "pol",
              "startOffset": 1.84,
              "endOffset": 2.02
            },
            {
              "word": "aja",
              "startOffset": 2.02,
              "endOffset": 2.21
            },
            {
              "word": "lah",
              "startOffset": 2.21,
              "endOffset": 2.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-165120-12",
          "startSeconds": 165.12,
          "endSeconds": 167.03,
          "text": "Jadi, ya udahlah gas pol aja lah pokoknya ya kan. Kita sambil",
          "words": [
            {
              "word": "Jadi,",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "ya",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "udahlah",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "gas",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "pol",
              "startOffset": 0.64,
              "endOffset": 0.8
            },
            {
              "word": "aja",
              "startOffset": 0.8,
              "endOffset": 0.95
            },
            {
              "word": "lah",
              "startOffset": 0.95,
              "endOffset": 1.11
            },
            {
              "word": "pokoknya",
              "startOffset": 1.11,
              "endOffset": 1.27
            },
            {
              "word": "ya",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "kan.",
              "startOffset": 1.43,
              "endOffset": 1.59
            },
            {
              "word": "Kita",
              "startOffset": 1.59,
              "endOffset": 1.75
            },
            {
              "word": "sambil",
              "startOffset": 1.75,
              "endOffset": 1.91
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-2-167040-13",
          "startSeconds": 167.04,
          "endSeconds": 169.99,
          "text": "pokoknya ya kan. Kita sambil restock-restok dulu karena baru bukaan",
          "words": [
            {
              "word": "pokoknya",
              "startOffset": 0,
              "endOffset": 0.3
            },
            {
              "word": "ya",
              "startOffset": 0.3,
              "endOffset": 0.59
            },
            {
              "word": "kan.",
              "startOffset": 0.59,
              "endOffset": 0.89
            },
            {
              "word": "Kita",
              "startOffset": 0.89,
              "endOffset": 1.18
            },
            {
              "word": "sambil",
              "startOffset": 1.18,
              "endOffset": 1.48
            },
            {
              "word": "restock-restok",
              "startOffset": 1.48,
              "endOffset": 1.77
            },
            {
              "word": "dulu",
              "startOffset": 1.77,
              "endOffset": 2.07
            },
            {
              "word": "karena",
              "startOffset": 2.07,
              "endOffset": 2.36
            },
            {
              "word": "baru",
              "startOffset": 2.36,
              "endOffset": 2.66
            },
            {
              "word": "bukaan",
              "startOffset": 2.66,
              "endOffset": 2.95
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ],
      "hl-video-3-3": [
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-220239-0",
          "startSeconds": 220.24,
          "endSeconds": 225.67,
          "text": "kayaknya yang paling benar kita nambah line lagi agar eh apa namanya? Agar si",
          "words": [
            {
              "word": "kayaknya",
              "startOffset": 0,
              "endOffset": 0.39
            },
            {
              "word": "yang",
              "startOffset": 0.39,
              "endOffset": 0.78
            },
            {
              "word": "paling",
              "startOffset": 0.78,
              "endOffset": 1.16
            },
            {
              "word": "benar",
              "startOffset": 1.16,
              "endOffset": 1.55
            },
            {
              "word": "kita",
              "startOffset": 1.55,
              "endOffset": 1.94
            },
            {
              "word": "nambah",
              "startOffset": 1.94,
              "endOffset": 2.33
            },
            {
              "word": "line",
              "startOffset": 2.33,
              "endOffset": 2.72
            },
            {
              "word": "lagi",
              "startOffset": 2.72,
              "endOffset": 3.1
            },
            {
              "word": "agar",
              "startOffset": 3.1,
              "endOffset": 3.49
            },
            {
              "word": "eh",
              "startOffset": 3.49,
              "endOffset": 3.88
            },
            {
              "word": "apa",
              "startOffset": 3.88,
              "endOffset": 4.27
            },
            {
              "word": "namanya?",
              "startOffset": 4.27,
              "endOffset": 4.66
            },
            {
              "word": "Agar",
              "startOffset": 4.66,
              "endOffset": 5.04
            },
            {
              "word": "si",
              "startOffset": 5.04,
              "endOffset": 5.43
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-225680-1",
          "startSeconds": 225.68,
          "endSeconds": 227.71,
          "text": "line lagi agar eh apa namanya? Agar si land kita nih makin banyak. Berarti kan",
          "words": [
            {
              "word": "line",
              "startOffset": 0,
              "endOffset": 0.14
            },
            {
              "word": "lagi",
              "startOffset": 0.14,
              "endOffset": 0.27
            },
            {
              "word": "agar",
              "startOffset": 0.27,
              "endOffset": 0.41
            },
            {
              "word": "eh",
              "startOffset": 0.41,
              "endOffset": 0.54
            },
            {
              "word": "apa",
              "startOffset": 0.54,
              "endOffset": 0.68
            },
            {
              "word": "namanya?",
              "startOffset": 0.68,
              "endOffset": 0.81
            },
            {
              "word": "Agar",
              "startOffset": 0.81,
              "endOffset": 0.95
            },
            {
              "word": "si",
              "startOffset": 0.95,
              "endOffset": 1.08
            },
            {
              "word": "land",
              "startOffset": 1.08,
              "endOffset": 1.22
            },
            {
              "word": "kita",
              "startOffset": 1.22,
              "endOffset": 1.35
            },
            {
              "word": "nih",
              "startOffset": 1.35,
              "endOffset": 1.49
            },
            {
              "word": "makin",
              "startOffset": 1.49,
              "endOffset": 1.62
            },
            {
              "word": "banyak.",
              "startOffset": 1.62,
              "endOffset": 1.76
            },
            {
              "word": "Berarti",
              "startOffset": 1.76,
              "endOffset": 1.89
            },
            {
              "word": "kan",
              "startOffset": 1.89,
              "endOffset": 2.03
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-227720-2",
          "startSeconds": 227.72,
          "endSeconds": 232.03,
          "text": "land kita nih makin banyak. Berarti kan kalau makin banyak em uang kita pun juga",
          "words": [
            {
              "word": "land",
              "startOffset": 0,
              "endOffset": 0.29
            },
            {
              "word": "kita",
              "startOffset": 0.29,
              "endOffset": 0.57
            },
            {
              "word": "nih",
              "startOffset": 0.57,
              "endOffset": 0.86
            },
            {
              "word": "makin",
              "startOffset": 0.86,
              "endOffset": 1.15
            },
            {
              "word": "banyak.",
              "startOffset": 1.15,
              "endOffset": 1.44
            },
            {
              "word": "Berarti",
              "startOffset": 1.44,
              "endOffset": 1.72
            },
            {
              "word": "kan",
              "startOffset": 1.72,
              "endOffset": 2.01
            },
            {
              "word": "kalau",
              "startOffset": 2.01,
              "endOffset": 2.3
            },
            {
              "word": "makin",
              "startOffset": 2.3,
              "endOffset": 2.59
            },
            {
              "word": "banyak",
              "startOffset": 2.59,
              "endOffset": 2.87
            },
            {
              "word": "em",
              "startOffset": 2.87,
              "endOffset": 3.16
            },
            {
              "word": "uang",
              "startOffset": 3.16,
              "endOffset": 3.45
            },
            {
              "word": "kita",
              "startOffset": 3.45,
              "endOffset": 3.74
            },
            {
              "word": "pun",
              "startOffset": 3.74,
              "endOffset": 4.02
            },
            {
              "word": "juga",
              "startOffset": 4.02,
              "endOffset": 4.31
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-232040-3",
          "startSeconds": 232.04,
          "endSeconds": 234.27,
          "text": "kalau makin banyak em uang kita pun juga nerima orangnya juga makin banyak kan.",
          "words": [
            {
              "word": "kalau",
              "startOffset": 0,
              "endOffset": 0.16
            },
            {
              "word": "makin",
              "startOffset": 0.16,
              "endOffset": 0.32
            },
            {
              "word": "banyak",
              "startOffset": 0.32,
              "endOffset": 0.48
            },
            {
              "word": "em",
              "startOffset": 0.48,
              "endOffset": 0.64
            },
            {
              "word": "uang",
              "startOffset": 0.64,
              "endOffset": 0.8
            },
            {
              "word": "kita",
              "startOffset": 0.8,
              "endOffset": 0.96
            },
            {
              "word": "pun",
              "startOffset": 0.96,
              "endOffset": 1.12
            },
            {
              "word": "juga",
              "startOffset": 1.12,
              "endOffset": 1.27
            },
            {
              "word": "nerima",
              "startOffset": 1.27,
              "endOffset": 1.43
            },
            {
              "word": "orangnya",
              "startOffset": 1.43,
              "endOffset": 1.59
            },
            {
              "word": "juga",
              "startOffset": 1.59,
              "endOffset": 1.75
            },
            {
              "word": "makin",
              "startOffset": 1.75,
              "endOffset": 1.91
            },
            {
              "word": "banyak",
              "startOffset": 1.91,
              "endOffset": 2.07
            },
            {
              "word": "kan.",
              "startOffset": 2.07,
              "endOffset": 2.23
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-234280-4",
          "startSeconds": 234.28,
          "endSeconds": 235.95,
          "text": "nerima orangnya juga makin banyak kan. Lebih ke sana sih teman-teman. Yang",
          "words": [
            {
              "word": "nerima",
              "startOffset": 0,
              "endOffset": 0.14
            },
            {
              "word": "orangnya",
              "startOffset": 0.14,
              "endOffset": 0.28
            },
            {
              "word": "juga",
              "startOffset": 0.28,
              "endOffset": 0.42
            },
            {
              "word": "makin",
              "startOffset": 0.42,
              "endOffset": 0.56
            },
            {
              "word": "banyak",
              "startOffset": 0.56,
              "endOffset": 0.7
            },
            {
              "word": "kan.",
              "startOffset": 0.7,
              "endOffset": 0.83
            },
            {
              "word": "Lebih",
              "startOffset": 0.83,
              "endOffset": 0.97
            },
            {
              "word": "ke",
              "startOffset": 0.97,
              "endOffset": 1.11
            },
            {
              "word": "sana",
              "startOffset": 1.11,
              "endOffset": 1.25
            },
            {
              "word": "sih",
              "startOffset": 1.25,
              "endOffset": 1.39
            },
            {
              "word": "teman-teman.",
              "startOffset": 1.39,
              "endOffset": 1.53
            },
            {
              "word": "Yang",
              "startOffset": 1.53,
              "endOffset": 1.67
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-235959-5",
          "startSeconds": 235.96,
          "endSeconds": 238.79,
          "text": "Lebih ke sana sih teman-teman. Yang dikejar sih sebenarnya lebih ke sana ya.",
          "words": [
            {
              "word": "Lebih",
              "startOffset": 0,
              "endOffset": 0.22
            },
            {
              "word": "ke",
              "startOffset": 0.22,
              "endOffset": 0.44
            },
            {
              "word": "sana",
              "startOffset": 0.44,
              "endOffset": 0.65
            },
            {
              "word": "sih",
              "startOffset": 0.65,
              "endOffset": 0.87
            },
            {
              "word": "teman-teman.",
              "startOffset": 0.87,
              "endOffset": 1.09
            },
            {
              "word": "Yang",
              "startOffset": 1.09,
              "endOffset": 1.31
            },
            {
              "word": "dikejar",
              "startOffset": 1.31,
              "endOffset": 1.52
            },
            {
              "word": "sih",
              "startOffset": 1.52,
              "endOffset": 1.74
            },
            {
              "word": "sebenarnya",
              "startOffset": 1.74,
              "endOffset": 1.96
            },
            {
              "word": "lebih",
              "startOffset": 1.96,
              "endOffset": 2.18
            },
            {
              "word": "ke",
              "startOffset": 2.18,
              "endOffset": 2.39
            },
            {
              "word": "sana",
              "startOffset": 2.39,
              "endOffset": 2.61
            },
            {
              "word": "ya.",
              "startOffset": 2.61,
              "endOffset": 2.83
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-238799-6",
          "startSeconds": 238.8,
          "endSeconds": 241.55,
          "text": "dikejar sih sebenarnya lebih ke sana ya. Jadi ya let's see aja lah. selebihnya",
          "words": [
            {
              "word": "dikejar",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "sih",
              "startOffset": 0.2,
              "endOffset": 0.39
            },
            {
              "word": "sebenarnya",
              "startOffset": 0.39,
              "endOffset": 0.59
            },
            {
              "word": "lebih",
              "startOffset": 0.59,
              "endOffset": 0.79
            },
            {
              "word": "ke",
              "startOffset": 0.79,
              "endOffset": 0.98
            },
            {
              "word": "sana",
              "startOffset": 0.98,
              "endOffset": 1.18
            },
            {
              "word": "ya.",
              "startOffset": 1.18,
              "endOffset": 1.38
            },
            {
              "word": "Jadi",
              "startOffset": 1.38,
              "endOffset": 1.57
            },
            {
              "word": "ya",
              "startOffset": 1.57,
              "endOffset": 1.77
            },
            {
              "word": "let's",
              "startOffset": 1.77,
              "endOffset": 1.97
            },
            {
              "word": "see",
              "startOffset": 1.97,
              "endOffset": 2.16
            },
            {
              "word": "aja",
              "startOffset": 2.16,
              "endOffset": 2.36
            },
            {
              "word": "lah.",
              "startOffset": 2.36,
              "endOffset": 2.55
            },
            {
              "word": "selebihnya",
              "startOffset": 2.55,
              "endOffset": 2.75
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-241560-7",
          "startSeconds": 241.56,
          "endSeconds": 243.95,
          "text": "Jadi ya let's see aja lah. selebihnya yang bisa kita coba-coba mungkin",
          "words": [
            {
              "word": "Jadi",
              "startOffset": 0,
              "endOffset": 0.2
            },
            {
              "word": "ya",
              "startOffset": 0.2,
              "endOffset": 0.4
            },
            {
              "word": "let's",
              "startOffset": 0.4,
              "endOffset": 0.6
            },
            {
              "word": "see",
              "startOffset": 0.6,
              "endOffset": 0.8
            },
            {
              "word": "aja",
              "startOffset": 0.8,
              "endOffset": 1
            },
            {
              "word": "lah.",
              "startOffset": 1,
              "endOffset": 1.19
            },
            {
              "word": "selebihnya",
              "startOffset": 1.19,
              "endOffset": 1.39
            },
            {
              "word": "yang",
              "startOffset": 1.39,
              "endOffset": 1.59
            },
            {
              "word": "bisa",
              "startOffset": 1.59,
              "endOffset": 1.79
            },
            {
              "word": "kita",
              "startOffset": 1.79,
              "endOffset": 1.99
            },
            {
              "word": "coba-coba",
              "startOffset": 1.99,
              "endOffset": 2.19
            },
            {
              "word": "mungkin",
              "startOffset": 2.19,
              "endOffset": 2.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-243959-8",
          "startSeconds": 243.96,
          "endSeconds": 246.35,
          "text": "yang bisa kita coba-coba mungkin equipment kali ya. Equipment dekor. Ini",
          "words": [
            {
              "word": "yang",
              "startOffset": 0,
              "endOffset": 0.22
            },
            {
              "word": "bisa",
              "startOffset": 0.22,
              "endOffset": 0.43
            },
            {
              "word": "kita",
              "startOffset": 0.43,
              "endOffset": 0.65
            },
            {
              "word": "coba-coba",
              "startOffset": 0.65,
              "endOffset": 0.87
            },
            {
              "word": "mungkin",
              "startOffset": 0.87,
              "endOffset": 1.09
            },
            {
              "word": "equipment",
              "startOffset": 1.09,
              "endOffset": 1.3
            },
            {
              "word": "kali",
              "startOffset": 1.3,
              "endOffset": 1.52
            },
            {
              "word": "ya.",
              "startOffset": 1.52,
              "endOffset": 1.74
            },
            {
              "word": "Equipment",
              "startOffset": 1.74,
              "endOffset": 1.96
            },
            {
              "word": "dekor.",
              "startOffset": 1.96,
              "endOffset": 2.17
            },
            {
              "word": "Ini",
              "startOffset": 2.17,
              "endOffset": 2.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-246360-9",
          "startSeconds": 246.36,
          "endSeconds": 247.75,
          "text": "equipment kali ya. Equipment dekor. Ini kan dekor baru-baru juga nih",
          "words": [
            {
              "word": "equipment",
              "startOffset": 0,
              "endOffset": 0.13
            },
            {
              "word": "kali",
              "startOffset": 0.13,
              "endOffset": 0.25
            },
            {
              "word": "ya.",
              "startOffset": 0.25,
              "endOffset": 0.38
            },
            {
              "word": "Equipment",
              "startOffset": 0.38,
              "endOffset": 0.51
            },
            {
              "word": "dekor.",
              "startOffset": 0.51,
              "endOffset": 0.63
            },
            {
              "word": "Ini",
              "startOffset": 0.63,
              "endOffset": 0.76
            },
            {
              "word": "kan",
              "startOffset": 0.76,
              "endOffset": 0.88
            },
            {
              "word": "dekor",
              "startOffset": 0.88,
              "endOffset": 1.01
            },
            {
              "word": "baru-baru",
              "startOffset": 1.01,
              "endOffset": 1.14
            },
            {
              "word": "juga",
              "startOffset": 1.14,
              "endOffset": 1.26
            },
            {
              "word": "nih",
              "startOffset": 1.26,
              "endOffset": 1.39
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-247760-10",
          "startSeconds": 247.76,
          "endSeconds": 249.07,
          "text": "kan dekor baru-baru juga nih teman-teman. Mungkin kita bisa",
          "words": [
            {
              "word": "kan",
              "startOffset": 0,
              "endOffset": 0.15
            },
            {
              "word": "dekor",
              "startOffset": 0.15,
              "endOffset": 0.29
            },
            {
              "word": "baru-baru",
              "startOffset": 0.29,
              "endOffset": 0.44
            },
            {
              "word": "juga",
              "startOffset": 0.44,
              "endOffset": 0.58
            },
            {
              "word": "nih",
              "startOffset": 0.58,
              "endOffset": 0.73
            },
            {
              "word": "teman-teman.",
              "startOffset": 0.73,
              "endOffset": 0.87
            },
            {
              "word": "Mungkin",
              "startOffset": 0.87,
              "endOffset": 1.02
            },
            {
              "word": "kita",
              "startOffset": 1.02,
              "endOffset": 1.16
            },
            {
              "word": "bisa",
              "startOffset": 1.16,
              "endOffset": 1.31
            }
          ],
          "confidence": 88,
          "hasSlang": false
        },
        {
          "id": "cap-hl-R44Gmp3c6Nw-3-249079-11",
          "startSeconds": 249.08,
          "endSeconds": 250,
          "text": "teman-teman. Mungkin kita bisa cicil-cicil dulu buat sekarang ya kan.",
          "words": [
            {
              "word": "teman-teman.",
              "startOffset": 0,
              "endOffset": 0.09
            },
            {
              "word": "Mungkin",
              "startOffset": 0.09,
              "endOffset": 0.18
            },
            {
              "word": "kita",
              "startOffset": 0.18,
              "endOffset": 0.28
            },
            {
              "word": "bisa",
              "startOffset": 0.28,
              "endOffset": 0.37
            },
            {
              "word": "cicil-cicil",
              "startOffset": 0.37,
              "endOffset": 0.46
            },
            {
              "word": "dulu",
              "startOffset": 0.46,
              "endOffset": 0.55
            },
            {
              "word": "buat",
              "startOffset": 0.55,
              "endOffset": 0.64
            },
            {
              "word": "sekarang",
              "startOffset": 0.64,
              "endOffset": 0.74
            },
            {
              "word": "ya",
              "startOffset": 0.74,
              "endOffset": 0.83
            },
            {
              "word": "kan.",
              "startOffset": 0.83,
              "endOffset": 0.92
            }
          ],
          "confidence": 88,
          "hasSlang": false
        }
      ]
    }
  }
];
