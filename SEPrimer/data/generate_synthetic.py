#!/usr/bin/env python3
"""
SE Primer — Sentetik Veri Üretici (`data/generate_synthetic.py`)
YZM301 - Ödev 2 gereksinimlerine uygun olarak tekrarlanabilir,
sınıf dengeli ve oturum bazlı sentetik eğitim verisi üretir.

Rastgele Tohum (Random Seed): 42
"""

import os
import uuid
import random
import numpy as np
import pandas as pd

SEED = 42
random.seed(SEED)
np.random.seed(SEED)

STAGE_TYPES = {
    1: 'mimari',
    2: 'test',
    3: 'kvkk',
}

REFERENCE_DURATIONS = {
    0: 35.0,  # Beginner
    1: 25.0,  # Intermediate
    2: 20.0,  # Experienced
}

def generate_session(session_id: str, archetype: str) -> list[dict]:
    """
    Belirli bir kullanıcı arketipine göre 3 sahneli tutarlı bir oturum üretir.
    Arketipler:
      - 'fast_expert': Hızlı, deneyimli, sıfır/az hata, düşük ipucu ihtiyacı
      - 'hesitant_beginner': Yavaş, acemi, yüksek hata, yüksek ipucu ihtiyacı
      - 'intermediate_balanced': Orta karar, duruma göre tereddüt eden
      - 'struggling_expert': Deneyimli ama KVKK veya Mimaride takılan, çok karar değiştiren
      - 'cautious_beginner': Acemi ama dikkatli, ipucu isteyip doğru karar veren
    """
    if archetype == 'fast_expert':
        seviye = 2
    elif archetype == 'hesitant_beginner':
        seviye = 0
    elif archetype == 'intermediate_balanced':
        seviye = 1
    elif archetype == 'struggling_expert':
        seviye = random.choice([1, 2])
    else:  # cautious_beginner
        seviye = 0

    ref_duration = REFERENCE_DURATIONS[seviye]
    rows = []
    cumulative_wrong = 0
    cumulative_hints = 0

    for stage_no in [1, 2, 3]:
        karar_turu = STAGE_TYPES[stage_no]

        if archetype == 'fast_expert':
            duration = max(3.0, np.random.normal(loc=ref_duration * 0.45, scale=2.5))
            switches = int(np.random.poisson(lam=0.2))
            hints_in_stage = int(np.random.poisson(lam=0.1))
            error_probability = 0.08

        elif archetype == 'hesitant_beginner':
            duration = max(15.0, np.random.normal(loc=ref_duration * 1.8, scale=8.0))
            switches = int(np.random.poisson(lam=2.5))
            hints_in_stage = int(np.random.poisson(lam=2.0)) + 1
            error_probability = 0.65

        elif archetype == 'intermediate_balanced':
            duration = max(8.0, np.random.normal(loc=ref_duration * 1.05, scale=4.5))
            switches = int(np.random.poisson(lam=1.0))
            hints_in_stage = int(np.random.poisson(lam=0.7))
            error_probability = 0.30

        elif archetype == 'struggling_expert':
            # Expert who struggles on architecture or KVKK
            multiplier = 2.0 if stage_no in [1, 3] else 0.8
            duration = max(10.0, np.random.normal(loc=ref_duration * multiplier, scale=6.0))
            switches = int(np.random.poisson(lam=2.8 if stage_no in [1, 3] else 0.5))
            hints_in_stage = int(np.random.poisson(lam=1.2 if stage_no in [1, 3] else 0.2))
            error_probability = 0.55 if stage_no in [1, 3] else 0.15

        else:  # cautious_beginner
            duration = max(18.0, np.random.normal(loc=ref_duration * 1.3, scale=5.0))
            switches = int(np.random.poisson(lam=1.2))
            hints_in_stage = int(np.random.poisson(lam=1.5))
            error_probability = 0.25

        tereddut_orani = round(float(duration / ref_duration), 3)
        teknik_hata_orani = round(float(cumulative_wrong / max(1, stage_no - 1)), 3)

        # Lojistik formülasyon ile ipucu_ihtiyaci (z skoru)
        # Bilişsel yük faktörleri:
        # Seviye (-): deneyimli daha az ihtiyaç duyar
        # Tereddüt (+): yüksek tereddüt ipucu ihtiyacını artırır
        # Karar değiştirme (+): kararsızlık ihtiyacı artırır
        # Önceki yanlış sayısı (+): hatalar yönlendirme ihtiyacını artırır
        # İpucu sayısı (+): zaten ipucu arayan kullanıcı
        z = (
            -1.1 * seviye
            + 1.45 * (tereddut_orani - 1.0)
            + 0.55 * switches
            + 0.75 * cumulative_wrong
            + 0.40 * hints_in_stage
            + np.random.normal(0, 0.25)
        )
        prob = 1.0 / (1.0 + np.exp(-z))
        ipucu_ihtiyaci = 1 if prob >= 0.50 else 0

        # Karar sonucu ve sonraki sahneye yansıması
        stage_is_wrong = 1 if (np.random.rand() < error_probability) else 0

        row = {
            'oturum_id': session_id,
            'sahne_no': int(stage_no),
            'seviye': int(seviye),
            'karar_suresi_sn': round(float(duration), 2),
            'onceki_yanlis_sayisi': int(cumulative_wrong),
            'ipucu_sayisi': int(cumulative_hints),
            'karar_degistirme_sayisi': int(switches),
            'tereddut_orani': tereddut_orani,
            'teknik_hata_orani': teknik_hata_orani,
            'karar_turu': karar_turu,
            'ipucu_ihtiyaci': int(ipucu_ihtiyaci),
            'kaynak': 'sentetik',
        }
        rows.append(row)

        cumulative_wrong += stage_is_wrong
        cumulative_hints += hints_in_stage

    return rows

def generate_synthetic_dataset(num_sessions: int = 80, output_path: str = 'data/oturumlar.csv') -> pd.DataFrame:
    """
    Dengeli arketip dağılımıyla sentetik oturumlar üretir.
    Var olan gerçek oturumlar varsa korur ve sentetikleri yanına ekler.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    existing_real_rows = []
    if os.path.exists(output_path):
        try:
            existing_df = pd.read_csv(output_path)
            if 'kaynak' in existing_df.columns:
                real_df = existing_df[existing_df['kaynak'] == 'gercek']
                if not real_df.empty:
                    existing_real_rows = real_df.to_dict('records')
                    print(f"[*] Korunan gercek oturum satiri sayisi: {len(existing_real_rows)}")
        except Exception as e:
            print(f"[!] Mevcut dosya okuma uyarisi: {e}")

    archetypes = [
        'fast_expert',
        'hesitant_beginner',
        'intermediate_balanced',
        'struggling_expert',
        'cautious_beginner',
    ]

    all_rows = []
    for i in range(num_sessions):
        session_id = str(uuid.UUID(int=SEED * 100000 + i))
        archetype = archetypes[i % len(archetypes)]
        session_rows = generate_session(session_id, archetype)
        all_rows.extend(session_rows)

    synthetic_df = pd.DataFrame(all_rows)

    if existing_real_rows:
        real_df = pd.DataFrame(existing_real_rows)
        combined_df = pd.concat([synthetic_df, real_df], ignore_index=True)
    else:
        combined_df = synthetic_df

    combined_df.to_csv(output_path, index=False)
    print(f"[+] Uretim tamamlandi. Toplam satir: {len(combined_df)}")
    print(f"    - Sentetik satir: {len(synthetic_df)} ({num_sessions} oturum)")
    print(f"    - Gercek satir: {len(existing_real_rows)}")
    print(f"    - Sinif dagilimi (ipucu_ihtiyaci):\n{combined_df['ipucu_ihtiyaci'].value_counts().to_dict()}")

    return combined_df

if __name__ == '__main__':
    generate_synthetic_dataset(num_sessions=80)

