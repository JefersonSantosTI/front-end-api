/* eslint-env serviceworker */

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  
  // 1. Tratamento de erro de conversão (Se falhar o JSON, ele pega o texto)
  try {
    data = event.data.json();
  } catch (err) {
    console.error("Erro ao fazer parse do JSON do push:", err);
    data = {
      title: "💧 Lembrete Treino Fit",
      body: event.data.text() || "Hora de beber água!"
    };
  }
  
  const options = {
    body: data.body,
    // 2. IMPORTANTE: Verifique se /logo192.png realmente existe na pasta public do front-end!
    icon: '/logo192.png',
    badge: '/logo192.png', 
    vibrate: [200, 100, 200],
    requireInteraction: false, // Faz a notificação sumir sozinha após um tempo no Android
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ação de fechar ou clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // ✅ CORREÇÃO AQUI: Usando self.clients ao invés de apenas clients
  event.waitUntil(self.clients.openWindow('https://treinofit.app.br'));
});