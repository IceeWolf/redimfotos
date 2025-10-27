// Variáveis globais
let selectedFiles = [];
let presets = [];

// Elementos DOM
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewSection = document.getElementById('previewSection');
const imagePreview = document.getElementById('imagePreview');
const clearBtn = document.getElementById('clearBtn');
const sizePreset = document.getElementById('sizePreset');
const customWidth = document.getElementById('customWidth');
const customHeight = document.getElementById('customHeight');
const format = document.getElementById('format');
const quality = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const maintainAspectRatio = document.getElementById('maintainAspectRatio');
const processBtn = document.getElementById('processBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Event Listeners
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
clearBtn.addEventListener('click', clearSelection);
sizePreset.addEventListener('change', handlePresetChange);
quality.addEventListener('input', updateQualityDisplay);
processBtn.addEventListener('click', processImages);

// Funções de Drag and Drop
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    addFiles(files);
}

function addFiles(files) {
    selectedFiles = [...selectedFiles, ...files];
    displayPreviews();
}

function displayPreviews() {
    if (selectedFiles.length === 0) {
        previewSection.style.display = 'none';
        return;
    }

    previewSection.style.display = 'block';
    imagePreview.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            
            const previewInfo = document.createElement('div');
            previewInfo.className = 'preview-info';
            previewInfo.textContent = formatFileSize(file.size);
            
            previewItem.appendChild(img);
            previewItem.appendChild(previewInfo);
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function clearSelection() {
    selectedFiles = [];
    fileInput.value = '';
    displayPreviews();
}

function handlePresetChange() {
    const presetValue = sizePreset.value;
    if (presetValue !== 'custom') {
        const [width, height] = presetValue.split('x');
        customWidth.value = width;
        customHeight.value = height;
    }
}

function updateQualityDisplay() {
    qualityValue.textContent = quality.value;
}

function processImages() {
    if (selectedFiles.length === 0) {
        alert('Por favor, selecione pelo menos uma imagem');
        return;
    }

    // Mostrar seção de progresso
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    // Comprimir imagens antes de enviar
    compressAndSend();
}

async function compressAndSend() {
    const formData = new FormData();
    
    // Comprimir cada imagem
    for (const file of selectedFiles) {
        try {
            const compressedFile = await compressImage(file);
            formData.append('images', compressedFile, file.name);
        } catch (error) {
            console.error('Erro ao comprimir:', file.name, error);
            formData.append('images', file); // Usar original se falhar
        }
    }
    
    addOptionsAndSend(formData);
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                // Calcular novas dimensões (máximo 1920px)
                let { width, height } = img;
                const maxDim = 1920;
                if (width > maxDim || height > maxDim) {
                    const ratio = Math.min(maxDim / width, maxDim / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Falha ao comprimir'));
                    }
                }, 'image/jpeg', 0.85);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

function addOptionsAndSend(formData) {
    // Adicionar opções
    const width = sizePreset.value === 'custom' ? customWidth.value : sizePreset.value.split('x')[0];
    const height = sizePreset.value === 'custom' ? customHeight.value : sizePreset.value.split('x')[1];
    
    formData.append('width', width);
    formData.append('height', height);
    formData.append('quality', quality.value);
    formData.append('format', format.value);
    formData.append('maintainAspectRatio', maintainAspectRatio.checked);

    // Simular progresso
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) progress = 90;
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 200);

    // Enviar para o servidor
    fetch('/api/process-batch', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Erro ao processar imagens');
    })
    .then(blob => {
        // Criar link de download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'imagens_otimizadas.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Reset após 2 segundos
        setTimeout(() => {
            progressSection.style.display = 'none';
            clearSelection();
            alert('Imagens processadas com sucesso!');
        }, 2000);
    })
    .catch(error => {
        console.error('Erro:', error);
        progressSection.style.display = 'none';
        alert('Erro ao processar imagens. Tente novamente.');
    });
}

