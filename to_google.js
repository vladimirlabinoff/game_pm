const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAC9cboSla_00tfRRPcbAaFRU0mqRZ0-gt6eQGQ7-ZR5hBCWHgTR4I32ugV7pgrZ32/exec';

async function sendData() {
  const data = {
    name: "Иван Иванов",
    email: "ivan@example.com",
    message: "Привет из JavaScript!"
  };

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Важно для Apps Script, чтобы избежать CORS-ошибок
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('Данные успешно отправлены!');
  } catch (error) {
    console.error('Ошибка при отправке:', error);
  }
}