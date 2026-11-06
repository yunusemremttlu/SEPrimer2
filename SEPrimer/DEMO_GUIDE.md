# SE Primer — 60–90 Saniyelik Video Demo Çekim Senaryosu (`DEMO_GUIDE.md`)

> **Önemli Bilgilendirme:** Bir AI kodlama asistanı olarak ekran kaydı oluşturma veya harici video dosyası yükleme yeteneğim bulunmamaktadır. Otomatik E2E testlerinin ürettiği video kaydı `cypress/videos/simulation.cy.ts.mp4` adresinde mevcuttur. Kendi sunumunuz veya ödev tesliminiz için aşağıdaki senaryoyu kullanarak 60–90 saniyede ekran kaydı alabilirsiniz.

---

## Demo Çekim Planı ve Zaman Çizelgesi (60–90 Saniye)

### [00:00 - 00:15] Giriş & Sistem Tanıtımı
- **Görüntü:** Tarayıcıda `http://localhost:5173` açık.
- **Konuşma / Vurgu:**  
  *"Merhaba, SE Primer — Software Engineer Adaptive Primer projesini sunuyorum. Bu projede kriz senaryosu, oyuncunun karar süresi, tereddüt ve hata telemetrisini doğrudan tarayıcı içinde çalışan bir ONNX makine öğrenmesi modeliyle analiz ederek kişiselleştirilmiş rehberlik sağlıyor."*
- **Eylem:** Sağ üstteki `Veri Modu` butonunu ve `Adaptive v2.0` rozetini gösterin.

---

### [00:15 - 00:45] Profil 1: Oyuncu A (Hızlı, Kararlı ve Deneyimli Mühendis)
- **Giriş Tercihleri:**
  - Seviye: `Experienced` (Deneyimli)
  - Rol: `Software Engineer`
  - Hedef: `Mimari Kararlar` -> *"Krize Başla"* butonuna tıklayın.
- **Eylem ve Davranış:**
  - 08:00 kriz ekranında sadece 5-6 saniye bekleyin.
  - Seçenekleri değiştirmeden doğrudan **Seçenek A'yı (Rollback to v2.3.9)** seçin.
- **Model Çıktısı (Ekranda Gösterilecek Gerçek Değer):**
  - Model Telemetrisi: `p: 0.000099` (Yeşil renk, $p \ll 0.50$).
  - Tutor Davranışı: Tutor araya girmez, ekran sakindir, oyuncunun özerkliğine saygı gösterilir.
- **Vurgu:**  
  *"Gördüğünüz gibi model p değerini 0.000099 olarak hesapladı. İpucu ihtiyacı 0 olduğu için sistem oyuncunun konsantrasyonunu bölmüyor."*

---

### [00:45 - 01:15] Profil 2: Oyuncu B (Tereddütlü ve Zorlanan Öğrenci)
- **Eylem:** Sağ üstten *"Baştan Başlat"* butonuna tıklayın.
- **Giriş Tercihleri:**
  - Seviye: `Beginner` (Öğrenci)
  - Rol: `Student`
  - Hedef: `Teknik Problem Çözme` -> *"Krize Başla"* butonuna tıklayın.
- **Eylem ve Davranış:**
  - Sahne 1'de bilinçli olarak **Seçenek B'yi (Hotfix)** seçin (hata geçmişi oluşturun).
  - Sahne 2'ye (08:12 Test Aşaması) geçin.
  - Bu sahnede 25-30 saniye bekleyin, fareyi Seçenek A ve B arasında 3-4 kez gezdirin (karar değiştirme sayacı artsın).
- **Model Çıktısı (Ekranda Gösterilecek Gerçek Değer):**
  - Model Telemetrisi: `p: 1.000000` (Sarı/Amber renk, $p \ge 0.50$).
  - **Adaptif Davranış Değişimi:**
    - Ekranda *"Adaptif Tutor: Karar sürtünmesi tespit edildi (p=1.000000)"* mavi-cyan uyarısı belirir.
    - Mühendislik İpucu kutusu otomatik olarak genişletilir.
    - AI Rehber butonu vurgulanır.
- **Vurgu:**  
  *"Aynı sahnede uzun süre tereddüt eden ve önceki aşamada hata yapan Oyuncu B için model olasılığı 1.000000'a yükseltti. Sistem otomatik olarak ipucu akordiyonunu açtı ve yönlendirici Sokratik rehberliği öne çıkardı."*

---

### [01:15 - 01:30] Kapanış & Test/Mimari Özeti
- **Eylem:** Terminali veya Cypress test raporunu (`10 passing`) gösterin.
- **Konuşma / Vurgu:**  
  *"Model istemci tarafında onnxruntime-web ile sıfır sunucu maliyeti ve tam KVKK gizliliğiyle çalışmaktadır. Python Oracle ile web çıkarımı arasındaki parite farkı 1e-4 sınırının çok altındadır (1.19e-7). Teşekkür ederim."*

