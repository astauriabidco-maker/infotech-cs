const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques du build Angular
app.use(express.static(path.join(__dirname, 'dist/infotech/browser')));

// Toutes les routes redirigent vers index.html (SPA)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/infotech/browser/index.html'));
});

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`✅ Frontend running on port ${PORT}`);
});
