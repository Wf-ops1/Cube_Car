import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('O Funil de Conversão Seguro', () => {

  test('Deve garantir que um usuário anônimo seja forçado a logar e verificar a conta antes de confirmar a reserva', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds since there are many wait steps

    // 1. Descoberta: Acessar a Home
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    await page.goto('/');
    
    // 2. Interesse: Clicar no primeiro carro da lista (selecionando pelo h3 que contém a marca/modelo)
    await page.waitForSelector('h3'); // Espera os carros carregarem
    await page.locator('h3').first().click();

    // 3. Trava de Autenticação: Clicar em Reservar
    // Precisamos selecionar as datas primeiro para habilitar o botão
    // Expandir o calendário
    await page.locator('.date-picker-container .cursor-pointer').first().click();
    
    const availableDates = page.locator('.date-picker-container button.w-9.h-9:not([disabled])');
    // Espera os botões ficarem visíveis (a animação do Framer Motion pode demorar)
    await availableDates.first().waitFor({ state: 'visible' });
    await availableDates.nth(0).click(); // Start
    await availableDates.nth(3).click(); // End (3 days later)
    await page.locator('button', { hasText: 'Concluir' }).click();

    const reserveButton = page.locator('button', { hasText: 'Reservar' }).first();
    await expect(reserveButton).toBeEnabled();
    await reserveButton.click();

    // 4. Garantir que o Modal de Login apareceu
    await page.screenshot({ path: 'screenshot-before-login.png' });
    const localStorageAuth = await page.evaluate(() => window.localStorage.getItem('cube-car-auth-storage'));
    console.log('LOCAL STORAGE AUTH:', localStorageAuth);
    const html = await page.content();
    fs.writeFileSync('debug.html', html);
    const loginModalHeader = page.locator('h1', { hasText: 'Acessar conta' });
    await expect(loginModalHeader).toBeVisible();

    // 5. Login: Usar o atalho de desenvolvedor "Dev: Traveler"
    const devTravelerBtn = page.locator('button', { hasText: 'Dev: Traveler' });
    await expect(devTravelerBtn).toBeVisible();
    await devTravelerBtn.click();
    // O LoginModal vai fechar. Agora o botão "Reservar" está liberado!
    const reserveButtonAfterLogin = page.locator('button', { hasText: 'Reservar' }).first();
    await expect(reserveButtonAfterLogin).toBeVisible();
    await reserveButtonAfterLogin.click();

    // 6. Acesso Condicional: Verificar se a aplicação redirecionou para o Checkout
    // Com o novo UX, usuários não verificados veem a seção de Verificação no Checkout.
    const startVerificationBtn = page.locator('button', { hasText: 'Iniciar verificação' });
    await expect(startVerificationBtn).toBeVisible();
    await startVerificationBtn.click();

    // 7. Garantir que o Wizard de Verificação apareceu na página após clicar
    const wizardHeader = page.locator('h2', { hasText: 'Foto da CNH' }).or(page.locator('h2', { hasText: 'Verificação de Segurança' }));
    await expect(wizardHeader).toBeVisible();

    // Passo 1 do Wizard: Enviar CNH
    const fileInput = page.locator('input[type="file"]');
    
    // Cria um arquivo falso em memória para upload
    await fileInput.setInputFiles({
      name: 'cnh-falsa.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('imagem-falsa')
    });

    // Clicar em Continuar no Wizard
    const continueBtn = page.locator('button', { hasText: 'Continuar' }).first();
    await expect(continueBtn).toBeEnabled({ timeout: 10000 });
    await continueBtn.click();

    // Passo 2 do Wizard: Reconhecimento Facial
    const bypassFacial = page.locator('#e2e-bypass-facial');
    await bypassFacial.evaluate((b) => (b as HTMLElement).click());

    const continueBtn2 = page.locator('button', { hasText: 'Verificar' }).first();
    await expect(continueBtn2).toBeEnabled({ timeout: 10000 });
    await continueBtn2.click();

    // Passo 3 do Wizard: Conclusão
    // Esperamos o texto de sucesso
    const successHeader = page.locator('h2', { hasText: 'Documentos recebidos!' });
    await expect(successHeader).toBeVisible({ timeout: 10000 });

    // 9. De volta ao Checkout: A trava de segurança impede o pagamento imediato.
    // O usuário é redirecionado para a tela de "Verificação enviada!"
    const sentVerificationHeader = page.locator('h2', { hasText: 'Verificação enviada!' });
    await expect(sentVerificationHeader).toBeVisible({ timeout: 10000 });

    // 10. Sucesso da Jornada: O usuário anônimo foi forçado a logar, forçado a iniciar a verificação e 
    // agora aguarda a aprovação, não podendo finalizar a reserva.
    const trackButton = page.locator('button', { hasText: 'Acompanhar verificação' });
    await expect(trackButton).toBeVisible();
  });

});
