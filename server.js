const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configurar multer para armazenar em memória (melhor para serverless)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB por arquivo
  }
});

// Endpoint para processar uma única imagem
app.post('/api/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const { width, height, quality, format, maintainAspectRatio } = req.body;
    const originalSize = req.file.size;

    // Detectar extensão baseada no formato
    let outputFormat = format || 'original';
    if (outputFormat === 'original') {
      outputFormat = path.extname(req.file.originalname).slice(1).toLowerCase();
    }

    // Configurar opções do Sharp - usar buffer em memória
    let transform = sharp(req.file.buffer);

    // Redimensionar se especificado
    if (width || height) {
      const resizeOptions = {};
      if (maintainAspectRatio === 'true') {
        resizeOptions.fit = 'inside';
      }
      transform = transform.resize(parseInt(width) || null, parseInt(height) || null, resizeOptions);
    }

    // Processar e converter
    let buffer;
    switch (outputFormat.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        buffer = await transform.jpeg({ quality: parseInt(quality) || 80 }).toBuffer();
        break;
      case 'png':
        buffer = await transform.png({ quality: parseInt(quality) || 80 }).toBuffer();
        break;
      case 'webp':
        buffer = await transform.webp({ quality: parseInt(quality) || 80 }).toBuffer();
        break;
      default:
        buffer = await transform.toBuffer();
    }

    // Calcular tamanho otimizado
    const optimizedSize = buffer.length;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

    // Enviar imagem processada
    const filename = path.parse(req.file.originalname).name + '.' + outputFormat;
    res.set({
      'Content-Type': `image/${outputFormat === 'jpg' ? 'jpeg' : outputFormat}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Original-Size': originalSize,
      'Optimized-Size': optimizedSize,
      'Reduction': reduction
    });

    res.send(buffer);

  } catch (error) {
    console.error('Erro ao processar imagem:', error);
    res.status(500).json({ error: 'Erro ao processar imagem' });
  }
});

// Endpoint para processar múltiplas imagens
app.post('/api/process-batch', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const { width, height, quality, format, maintainAspectRatio } = req.body;
    
    // Processar cada imagem
    const zip = archiver('zip', { zlib: { level: 9 } });
    
    res.attachment('imagens_otimizadas.zip');
    zip.pipe(res);

    for (const file of req.files) {
      try {
        // Usar buffer em memória
        let transform = sharp(file.buffer);

        // Redimensionar se especificado
        if (width || height) {
          const resizeOptions = {};
          if (maintainAspectRatio === 'true') {
            resizeOptions.fit = 'inside';
          }
          transform = transform.resize(parseInt(width) || null, parseInt(height) || null, resizeOptions);
        }

        // Determinar formato de saída
        let outputFormat = format || 'original';
        if (outputFormat === 'original') {
          outputFormat = path.extname(file.originalname).slice(1).toLowerCase();
        }

        // Converter
        let buffer;
        switch (outputFormat.toLowerCase()) {
          case 'jpg':
          case 'jpeg':
            buffer = await transform.jpeg({ quality: parseInt(quality) || 80 }).toBuffer();
            break;
          case 'png':
            buffer = await transform.png({ quality: parseInt(quality) || 80 }).toBuffer();
            break;
          case 'webp':
            buffer = await transform.webp({ quality: parseInt(quality) || 80 }).toBuffer();
            break;
          default:
            buffer = await transform.toBuffer();
        }

        // Adicionar ao ZIP
        const filename = path.parse(file.originalname).name + '.' + outputFormat;
        zip.append(buffer, { name: filename });

      } catch (error) {
        console.error(`Erro ao processar ${file.originalname}:`, error);
      }
    }

    // Finalizar ZIP
    zip.finalize();

  } catch (error) {
    console.error('Erro ao processar lotes:', error);
    res.status(500).json({ error: 'Erro ao processar imagens' });
  }
});

// Endpoint para obter tamanhos pré-definidos
app.get('/api/presets', (req, res) => {
  res.json({
    presets: [
      { name: 'Thumbnail', width: 150, height: 150 },
      { name: 'Pequeno', width: 400, height: 400 },
      { name: 'Médio', width: 800, height: 800 },
      { name: 'Grande', width: 1200, height: 1200 }
    ]
  });
});

// Iniciar servidor apenas se não estiver rodando no Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
    console.log(`✓ Abra o navegador em http://localhost:${PORT} para usar o aplicativo`);
  });
}

// Exportar app para Vercel
module.exports = app;

