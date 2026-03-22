import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Firebase config to get project ID
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Vite middleware for development
  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
  }

  // API routes or special handlers
  app.get('/post/:slug', async (req, res, next) => {
    const { slug } = req.params;
    const url = req.originalUrl;

    try {
      let template = '';
      if (process.env.NODE_ENV !== 'production') {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist', 'index.html'), 'utf-8');
      }

      // Fetch post data from Firestore REST API
      const projectId = firebaseConfig.projectId;
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/posts`;
      
      const response = await axios.get(firestoreUrl);
      const posts = response.data.documents || [];
      
      const postDoc = posts.find((doc: any) => {
        const fields = doc.fields;
        return fields.slug?.stringValue === slug;
      });

      if (postDoc) {
        const fields = postDoc.fields;
        const title = fields.title?.stringValue || 'اربح';
        const summary = fields.summary?.stringValue || '';
        const image = fields.image?.stringValue || `https://picsum.photos/seed/${slug}/1200/630`;

        // Replace meta tags
        template = template
          .replace(/<title>.*?<\/title>/, `<title>${title} | اربح</title>`)
          .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
          .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${summary}" />`)
          .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`)
          .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
          .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${summary}" />`)
          .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${image}" />`)
          .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${summary}" />`);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  // Default SPA handler
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template = '';
      if (process.env.NODE_ENV !== 'production') {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
        return;
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
