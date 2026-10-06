"""Wrapper worker untuk QA F3: identik clip_worker.py tapi menyimpan salinan .ass
(sebelum worker menghapusnya pasca-burn) sebagai <ass>.snapshot."""
import os
import shutil
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import clip_worker  # noqa: E402

_orig = clip_worker.build_ass_file


def _snap(captions, config, clip_start, clip_end, ass_path, translations=None):
    _orig(captions, config, clip_start, clip_end, ass_path, translations)
    try:
        shutil.copyfile(ass_path, ass_path + '.snapshot')
    except Exception as e:
        print(f"[QA] snapshot gagal: {e}")


clip_worker.build_ass_file = _snap

if __name__ == '__main__':
    a = sys.argv
    clip_worker.process_clip(
        a[1], float(a[2]), float(a[3]), a[4],
        a[5] if len(a) > 5 and a[5] else None,
        a[6] if len(a) > 6 and a[6] else None,
    )
