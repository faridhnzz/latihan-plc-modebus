import express from 'express';

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('etag', 'strong');

/**
 * Routes
 */

app.get('/', (req, res) => {
  res.status(200).json({ hello: 'there' });
});

/** */
export default app;
