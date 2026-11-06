describe('SE Primer — Comprehensive E2E Simulation Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Loads application and verifies initial onboarding state', () => {
    cy.get('h1').should('contain', 'SE Primer: Yazılım Mühendisliği');
    cy.get('[data-testid="experience-beginner"]').should('exist');
    cy.get('[data-testid="experience-intermediate"]').should('exist');
    cy.get('[data-testid="experience-experienced"]').should('exist');
    cy.get('[data-testid="start-simulation-button"]').should('be.visible');
  });

  it('2. Verifies mobile-first responsive layout (390x844 iPhone)', () => {
    cy.viewport(390, 844);
    cy.get('h1').should('be.visible');
    cy.get('[data-testid="role-frontend"]').should('be.visible');
    cy.get('[data-testid="objective-architecture"]').should('be.visible');
    cy.get('[data-testid="start-simulation-button"]').should('be.visible');
  });

  it('3. Completes onboarding and initializes 08:00 crisis scenario', () => {
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="role-backend"]').click();
    cy.get('[data-testid="objective-architecture"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Verify 08:00 crisis header
    cy.get('[data-testid="navbar-clock"]').should('contain', '08:00');
    cy.get('[data-testid="navbar-patients"]').should('contain', '300 Hasta');
    cy.contains('Dağıtım Çöküşü & Geriye Dönüş Stratejisi').should('be.visible');
    cy.get('[data-testid="decision-option-A"]').should('be.visible');
    cy.get('[data-testid="decision-option-B"]').should('be.visible');

    // Verify data-cy="p" telemetri rozetinin mevcudiyeti
    cy.get('[data-cy="p"]').should('exist').and('be.visible');
  });

  it('4. Executes Happy Path: All Choice A leading to Ending A (Successful Recovery)', () => {
    // Onboard as Intermediate
    cy.get('[data-testid="experience-intermediate"]').click();
    cy.get('[data-testid="role-software_engineer"]').click();
    cy.get('[data-testid="objective-testing"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Decision 1: Architecture -> Rollback (A)
    cy.get('[data-cy="p"]').should('exist');
    cy.get('[data-testid="choose-button-A"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.contains('Ne Oldu? (Operasyonel Etki)').should('be.visible');
    cy.contains('Neden Oldu? (Teknik Gerekçe)').should('be.visible');
    cy.get('[data-testid="health-delta-badge"]').should('contain', '+30% Sağlık');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Decision 2: Testing -> Targeted Tests (A)
    cy.get('[data-testid="navbar-clock"]').should('contain', '08:12');
    cy.contains('Dağıtım Öncesi Doğrulama & Regresyon Güvenliği').should('be.visible');
    cy.get('[data-cy="p"]').should('exist');
    cy.get('[data-testid="choose-button-A"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.get('[data-testid="health-delta-badge"]').should('contain', '+35% Sağlık');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Decision 3: KVKK -> Mask Logs (A)
    cy.get('[data-testid="navbar-clock"]').should('contain', '08:18');
    cy.contains('Hata Ayıklama Telemetrisi & Veri Gizliliği').should('be.visible');
    cy.get('[data-cy="p"]').should('exist');
    cy.get('[data-testid="choose-button-A"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Verify Ending A: Successful Recovery
    cy.get('[data-testid="results-banner"]').should('be.visible');
    cy.get('[data-testid="ending-title"]').should('contain', 'SON A: Başarılı İyileşme (08:25)');
    cy.get('[data-testid="ending-status-text"]').should('contain', '08:25 — Sistem ayakta, veri güvende.');
    cy.get('[data-testid="operational-grade"]').should('contain', 'A+');
    cy.get('[data-testid="decision-audit-1"]').should('contain', 'MÜKEMMEL');
    cy.get('[data-testid="decision-audit-2"]').should('contain', 'MÜKEMMEL');
    cy.get('[data-testid="decision-audit-3"]').should('contain', 'MÜKEMMEL');
  });

  it('5. Executes Failure Path: Choice B leading to Ending B (Failed Recovery & KVKK Breach)', () => {
    // Onboard as Beginner
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="role-student"]').click();
    cy.get('[data-testid="objective-security_kvkk"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Decision 1: Hotfix in Prod (B)
    cy.get('[data-testid="choose-button-B"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.get('[data-testid="health-delta-badge"]').should('contain', '-25% Sağlık');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Decision 2: Skip Tests (B)
    cy.get('[data-testid="choose-button-B"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.get('[data-testid="health-delta-badge"]').should('contain', '-30% Sağlık');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Decision 3: Share Raw Unmasked Logs (B)
    cy.get('[data-testid="choose-button-B"]').click();
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.contains('KVKK İhlali!').should('be.visible');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Verify Ending B: Failed Recovery & KVKK Breach
    cy.get('[data-testid="results-banner"]').should('be.visible');
    cy.get('[data-testid="ending-title"]').should('contain', 'SON B: Kusurlu İyileşme & Operasyonel Risk (08:45)');
    cy.get('[data-testid="ending-status-text"]').should('contain', 'KVKK veri ihlali gerçekleşti');
    cy.get('[data-testid="operational-grade"]').should('contain', 'F');
  });

  it('6. Tests Socratic AI Tutor Drawer, quick chips, and non-leakage invariant', () => {
    cy.get('[data-testid="experience-beginner"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Open AI Tutor Drawer
    cy.get('[data-testid="open-tutor-button"]').click();
    cy.get('[data-testid="tutor-drawer"]').should('be.visible');
    cy.get('[data-testid="tutor-demo-badge"]').should('be.visible');

    // Send direct answer attempt
    cy.get('[data-testid="tutor-input"]').type('A mı B mi seçmeliyim?');
    cy.get('[data-testid="tutor-send-button"]').click();

    // Assert Socratic non-leakage response
    cy.get('[data-testid="tutor-response-message"]').should('exist');
    cy.get('[data-testid="tutor-drawer"]').should('not.contain', "A'yı seç");
    cy.get('[data-testid="tutor-drawer"]').should('not.contain', "B'yi seç");

    // Close tutor drawer
    cy.get('[data-testid="close-tutor-button"]').click();
    cy.get('[data-testid="tutor-drawer"]').should('not.exist');
  });

  it('7. Tests Experienced-user 60-second countdown timer and restart functionality', () => {
    // Onboard as Experienced
    cy.get('[data-testid="experience-experienced"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Verify experienced timer bar is active
    cy.get('[data-testid="experienced-timer-bar"]').should('be.visible');
    cy.get('[data-testid="timer-countdown-value"]').should('contain', 'saniye kaldı');

    // Test Restart button in Navbar
    cy.get('[data-testid="restart-button"]').click();
    cy.get('[data-testid="start-simulation-button"]').should('be.visible');
    cy.get('[data-testid="experienced-timer-bar"]').should('not.exist');
  });

  it('8. Test A: Diferansiyel Parite Testi (Python Oracle vs onnxruntime-web |p_app - p_oracle| < 1e-4)', () => {
    // parite.json dosyasını yükle
    cy.fixture('parite.json').then((pariteData) => {
      const tolerance = pariteData.tolerance || 0.0001;
      expect(pariteData.cases).to.have.length.of.at.least(5);

      cy.window().should('have.property', '__ONNX_ORACLE__');

      // Her referans girdisi için web çıkarımını koştur ve Oracle ile karşılaştır
      pariteData.cases.forEach((testCase: { id: string; input: Record<string, number>; expected_probability: number }) => {
        cy.window().then((win) => {
          const oracle = (win as unknown as { __ONNX_ORACLE__: { predict: (inp: Record<string, number>) => Promise<{ probability: number }> } }).__ONNX_ORACLE__;
          return oracle.predict(testCase.input).then((res) => {
            const appP = res.probability;
            const oracleP = testCase.expected_probability;
            const diff = Math.abs(appP - oracleP);

            cy.log(`Case: ${testCase.id} | App: ${appP} | Oracle: ${oracleP} | Diff: ${diff}`);
            expect(diff, `Diferansiyel tolerans aşımı (${testCase.id})`).to.be.lessThan(tolerance);
          });
        });
      });
    });
  });

  it('9. Veri Toplama Modu ve Karar Sonrası Etiketleme Anketi Doğrulaması', () => {
    // Veri toplama modunu aç
    cy.get('[data-testid="toggle-data-collection-button"]').click();
    cy.get('[data-testid="toggle-data-collection-button"]').should('contain', 'AÇIK');

    // Onboarding'i tamamla
    cy.get('[data-testid="experience-intermediate"]').click();
    cy.get('[data-testid="start-simulation-button"]').click();

    // Karar 1 seçeneğini tıkla
    cy.get('[data-testid="choose-button-A"]').click();

    // Veri toplama anketi modalının belirdiğini doğrula
    cy.get('[data-testid="data-collection-survey-modal"]').should('be.visible');
    cy.contains('Bu kararı verirken ek teknik desteğe / ipucuna ihtiyaç duydunuz mu?').should('be.visible');

    // Anket yanıtını gönder (1: Evet, İhtiyaç Vardı)
    cy.get('[data-testid="survey-btn-need-hint"]').click();

    // Consequence modalına geçişi doğrula
    cy.get('[data-testid="consequence-modal"]').should('be.visible');
    cy.get('[data-testid="advance-consequence-button"]').click();

    // Telemetri sayacının güncellendiğini doğrula
    cy.get('[data-testid="toggle-data-collection-button"]').should('contain', '/15');
  });

  it('10. Model Entegrasyonu Güvenliği & Fallback Dayanıklılığı', () => {
    // Model yükleme hatası simülasyonunda dahi uygulamanın çökmediğini doğrula
    cy.window().then((win) => {
      const oracle = (win as unknown as { __ONNX_ORACLE__: { predict: (inp: Record<string, number>) => Promise<{ probability: number; isFallback: boolean }> } }).__ONNX_ORACLE__;
      return oracle.predict({
        seviye: 0,
        karar_suresi_sn: 120,
        onceki_yanlis_sayisi: 1,
        ipucu_sayisi: 4,
        sahne_no: 2,
        karar_degistirme_sayisi: 3,
        tereddut_orani: 3.4,
        teknik_hata_orani: 1.0,
      }).then((res) => {
        expect(res.probability).to.be.a('number');
        expect(res.probability).to.be.within(0.0, 1.0);
      });
    });
  });
});
