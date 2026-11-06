# SE Primer — Veri Sözlüğü ve Protokolü (`data/SOZLUK.md`)

Bu doküman, **Software Engineer Adaptive Primer** simülasyonunda toplanan oturum ve karar telemetrisi verilerinin şemasını, hesaplama formüllerini, anonimleştirme ilkelerini ve etiketleme metodolojisini tanımlar.

---

## 1. Veri Gizliliği ve KVKK Uyumluluk İlkeleri

Veri toplama sürecinde Türk Kişisel Verilerin Korunması Kanunu (KVKK 6698) ve GDPR ilkelerine tam uyum gözetilir:
- **Kişisel Veri Yasağı:** Ad, soyad, e-posta, telefon numarası, IP adresi, coğrafi konum, tarayıcı/cihaz parmak izi (fingerprint) veya donanım kimliği KESİNLİKLE toplanmaz ve saklanmaz.
- **Rastgele Tanımlayıcı:** Her oturum (`oturum_id`) için istemci tarafında kriptografik olarak rastgele `UUID v4` üretilir.
- **Sağlık Verisi İzolasyonu:** Senaryoda geçen hastane, hasta sayısı ve klinik kayıtlar tamamen kurgusal olup hiçbir gerçek hasta veya kurum verisi içermez.

---

## 2. CSV Sütun Şeması ve Tanımları (`oturumlar.csv`)

Her satır, bir kullanıcının tek bir karar aşamasındaki (Sahne 1, 2 veya 3) operasyonel davranışını temsil eder.

| Sütun Adı | Veri Tipi | İzin Verilen Değerler | Açıklama |
|---|---|---|---|
| `oturum_id` | string (UUID) | örn: `3fa85f64-5717-4562-b3fc-2c963f66afa6` | Oturuma ait tekil, anonim kimlik. |
| `sahne_no` | integer | `1`, `2`, `3` | Kararın ait olduğu sahne (1: Mimari, 2: Test, 3: KVKK). |
| `seviye` | integer | `0` (beginner), `1` (intermediate), `2` (experienced) | Oyuncunun onboarding aşamasında beyan ettiği teknik yetkinlik düzeyi. |
| `karar_suresi_sn` | float | `0.0` - `300.0` | Sahne yüklendiği andan kararın onaylandığı (commit) ana kadar geçen süre (saniye). |
| `onceki_yanlis_sayisi` | integer | `0`, `1`, `2` | Bu karardan önceki sahnelerde yapılan suboptimal/hatalı seçim sayısı. Sahne 1 için her zaman `0`'dır. |
| `ipucu_sayisi` | integer | `0` - `50` | Oyuncunun bu karardan önce veya karar anında talep ettiği ipucu veya Sokratik soru sayısı. |
| `karar_degistirme_sayisi` | integer | `0` - `20` | Oyuncunun A ve B seçenek kartları arasında yaptığı inceleme ve geçiş sayısı (toggle/switch). |
| `tereddut_orani` | float | `0.0` - `10.0` | Karar süresinin referans süreye oranı: `karar_suresi_sn / referans_sure` (Referans süre: Beginner=35s, Intermediate=25s, Experienced=20s). |
| `teknik_hata_orani` | float | `0.0` - `1.0` | Önceki kararlardaki kümülatif hata oranı: `onceki_yanlis_sayisi / max(1, sahne_no - 1)`. Sahne 1 için `0.0`'dır. |
| `karar_turu` | string | `mimari`, `test`, `kvkk` | Sahnenin teknik karar kategorisi. |
| `ipucu_ihtiyaci` | integer | `0` veya `1` | **HEDEF DEĞİŞKEN:** Oyuncunun bu sahnede ek ipucu/yönlendirmeye ihtiyaç duyup duymadığı (`0`: İhtiyaç yok, `1`: İhtiyaç var). |
| `kaynak` | string | `gercek` veya `sentetik` | Satırın gerçek bir kullanıcı oturumundan mı yoksa kural tabanlı sentetik üreticiden mi geldiğini belirtir. |

---

## 3. Etiketleme Metodolojisi (`ipucu_ihtiyaci`)

Hedef değişken olan `ipucu_ihtiyaci`, karar aşamasında oyuncunun bilişsel zorlanmasını (cognitive load) ve yardım ihtiyacını modellemektedir:
1. **Veri Toplama Modunda Öz-Bildirim (Ground Truth):**
   - Karar verildikten hemen sonra oyuncuya "Bu kararı verirken ek teknik rehberliğe / ipucuna ihtiyaç duydunuz mu?" sorusu yöneltilir.
   - Cevap `Evet` ise `ipucu_ihtiyaci = 1`, `Hayır` ise `ipucu_ihtiyaci = 0` olarak etiketlenir.
2. **Kural Tabanlı Davranışsal Doğrulama (Sentetik Üretim):**
   - Sentetik veride etiket; yüksek tereddüt (`tereddut_orani > 1.25`), karar değiştirme (`karar_degistirme_sayisi >= 2`), önceki hatalar (`onceki_yanlis_sayisi > 0`) ve seviye ters orantısı ile deterministik lojistik fonksiyon üzerinden türetilir.

---

## 4. Veri Sızıntısını Önleme (Anti-Leakage Protocol)

- Girdi öznitelikleri (`X`), yalnızca karar verilmeden **önce** veya karar **anında** ölçülebilen metrikleri içerir.
- Karar sonrasında oluşan sağlık puanı değişimi (`healthDelta`), sistemin son durumu (`ending`), KVKK ihlali bayrağı (`isKvkkBreach`) gibi bilgiler modele girdi olarak verilemez.
- Model eğitiminde aynı oturuma ait 3 sahne satırının hem eğitim hem test kümesine dağılmasını önlemek amacıyla `oturum_id` bazlı `GroupShuffleSplit` uygulanır.

