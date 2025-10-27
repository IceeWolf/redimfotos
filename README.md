# RedimFotos - Otimizador de Imagens

Aplicativo web moderno para otimização e redimensionamento de imagens. Desenvolvido com Node.js, Express e Sharp para processamento rápido e eficiente de imagens.

## 🚀 Funcionalidades

- ✅ Upload de múltiplas imagens com drag-and-drop
- ✅ Redimensionamento inteligente (tamanhos pré-definidos ou customizado)
- ✅ Otimização de tamanho de ficheiro com compressão ajustável
- ✅ Conversão de formatos (JPG, PNG, WebP)
- ✅ Processamento em lote
- ✅ Download de ZIP com todas as imagens otimizadas
- ✅ Preview das imagens antes do processamento
- ✅ Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Clone ou baixe este repositório

2. Instale as dependências:
```bash
npm install
```

## ▶️ Como Usar

1. Inicie o servidor:
```bash
npm start
```

2. Abra o navegador e acesse:
```
http://localhost:3002
```

3. Use o aplicativo:
   - Arraste e solte suas imagens na área de upload
   - Escolha o tamanho desejado (pré-definido ou customizado)
   - Selecione o formato de saída (Original, JPG, PNG, WebP)
   - Ajuste a qualidade de compressão (1-100)
   - Clique em "Processar Imagens"
   - As imagens otimizadas serão baixadas em um arquivo ZIP

## ⚙️ Opções de Configuração

### Tamanhos Pré-definidos:
- **Thumbnail**: 150x150 pixels
- **Pequeno**: 400x400 pixels  
- **Médio**: 800x800 pixels
- **Grande**: 1200x1200 pixels
- **Personalizado**: Digite largura e altura desejadas

### Formatos de Saída:
- **Original**: Mantém o formato original
- **JPG**: Maior compatibilidade, boa compressão
- **PNG**: Melhor qualidade, sem perdas
- **WebP**: Melhor compressão (até 30% menor), formato moderno

### Qualidade:
- Controla a compressão da imagem (1-100)
- Valores menores = ficheiros menores, mas com perda de qualidade
- Valores maiores = melhor qualidade, mas ficheiros maiores

## 📁 Estrutura do Projeto

```
redimfotos/
├── server.js          # Servidor Express e lógica de API
├── package.json       # Dependências do projeto
├── public/            # Arquivos frontend
│   ├── index.html     # Interface principal
│   ├── styles.css     # Estilos da interface
│   └── app.js         # Lógica do cliente
└── uploads/           # Pasta temporária (criada automaticamente)
```

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js, Express, Multer, Sharp, Archiver
- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Bibliotecas**: CORS, Sharp (processamento de imagens)

## 📝 Notas

- As imagens processadas são enviadas diretamente para download
- Arquivos temporários são limpos automaticamente após o processamento
- Suporte para processar até 50 imagens por vez
- Mantém proporção original por padrão (pode ser desabilitado)
- Processamento em memória (serverless ready)

## 🌐 Deploy

Este aplicativo está configurado para deploy no [Vercel](https://vercel.com).

### Deploy Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IceeWolf/redimfotos)

Ou siga as instruções detalhadas em [DEPLOY.md](./DEPLOY.md)

## 🏗️ Arquitetura

- **Backend**: Node.js + Express + Sharp
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Deployment**: Vercel (serverless)
- **Processing**: In-memory com Sharp (sem armazenamento local)

## 🤝 Contribuindo

Sinta-se livre para enviar sugestões e melhorias via Pull Requests!

## 📄 Licença

MIT

## 🔗 Links

- **Repositório GitHub**: https://github.com/IceeWolf/redimfotos
- **Deploy Automático**: Vercel detecta mudanças no repositório automaticamente

