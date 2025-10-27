# Deploy do RedimFotos

Este guia explica como fazer deploy do aplicativo RedimFotos no Vercel.

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Vercel (pode criar gratuitamente em https://vercel.com)

## 🚀 Passo 1: Push para GitHub

1. Inicialize o repositório Git (se ainda não foi feito):
```bash
git init
```

2. Adicione os arquivos:
```bash
git add .
```

3. Faça o commit:
```bash
git commit -m "Initial commit: Aplicativo RedimFotos"
```

4. Adicione o repositório remoto:
```bash
git remote add origin https://github.com/IceeWolf/redimfotos.git
```

5. Push para o GitHub:
```bash
git branch -M main
git push -u origin main
```

## 🌐 Passo 2: Deploy no Vercel

### Opção A: Via Dashboard (Recomendado)

1. Acesse https://vercel.com e faça login com sua conta do GitHub
2. Clique em "Add New Project"
3. Selecione o repositório `IceeWolf/redimfotos`
4. O Vercel detectará automaticamente as configurações:
   - **Framework Preset**: Other
   - **Build Command**: (deixe em branco)
   - **Output Directory**: (deixe em branco)
   - **Install Command**: `npm install`
5. Clique em "Deploy"
6. Aguarde o deploy concluir

### Opção B: Via CLI Vercel

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. No diretório do projeto, execute:
```bash
vercel
```

3. Siga as instruções:
   - "Set up and deploy?" → Y
   - "Which scope?" → Selecione sua conta
   - "Link to existing project?" → N
   - "Project name?" → redimfotos
   - "Directory?" → ./
   - "Override settings?" → N

4. Para deploy em produção:
```bash
vercel --prod
```

## ✅ Verificação

Após o deploy, você receberá uma URL do tipo:
```
https://redimfotos-xxxxx.vercel.app
```

Acesse a URL e teste o aplicativo!

## 🔧 Estrutura de Deploy

O Vercel usa o arquivo `vercel.json` para configurar:
- **Builds**: Servidor Node.js usando `@vercel/node`
- **Routes**: API routes em `/api/*` e arquivos estáticos em `/public/*`
- **Environment**: Porta configurada automaticamente

## 📝 Notas Importantes

- O aplicativo funciona em modo serverless no Vercel
- Não é necessário configurar pasta `uploads` (usa memória)
- Limite de 10MB por arquivo (configurável em `server.js`)
- Processamento em lote de até 50 imagens
- Sharp está incluído nas dependências nativas do Vercel

## 🔄 Deploy Automático

Com o deploy via GitHub, o Vercel irá:
- Automatically fazer novo deploy a cada push na branch `main`
- Gerar preview URLs para Pull Requests
- Manter histórico de versões

## 📊 Monitoramento

- Acesse o dashboard do Vercel para ver logs e performance
- Metricas disponíveis: tempo de resposta, uso de memória, erros

## 🛠️ Troubleshooting

Se encontrar problemas:
1. Verifique os logs no dashboard do Vercel
2. Certifique-se que todas as dependências estão no `package.json`
3. O arquivo `vercel.json` está configurado corretamente
4. Teste localmente com `vercel dev` antes de deploy em produção

---

**Repositório GitHub**: https://github.com/IceeWolf/redimfotos

