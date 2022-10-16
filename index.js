import app from './src/app.js';
const PORT = process.env.PORT || 5400;

/**
 * Run server
 */

app.listen(PORT, (err) => {
  console.log(`Server listening on http://127.0.0.1:${PORT} `);
  console.log('\n');

  if (err) {
    console.log(err);
    process.exit(1);
  }
});
