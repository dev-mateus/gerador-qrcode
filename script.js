// Elementos DOM
const urlInput = document.getElementById('url-input');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const qrcodeSection = document.getElementById('qrcode-section');
const qrcodeDisplay = document.getElementById('qrcode');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');

let qrCodeInstance = null;

// Função para alternar tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Carregar tema salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Função para validar URL
function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// Função para limpar mensagem de erro
function clearError() {
    errorMessage.textContent = '';
}

// Função para exibir mensagem de erro
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Função para gerar QR Code
function generateQRCode() {
    let url = urlInput.value.trim();
    
    // Limpar erro anterior
    clearError();
    
    // Validar URL
    if (!url) {
        showError('Por favor, digite uma URL.');
        return;
    }
    
    // Adicionar https:// se não tiver protocolo
    if (!url.match(/^https?:\/\//i)) {
        url = 'https://' + url;
        urlInput.value = url; // Atualizar o campo visual
    }
    
    if (!isValidURL(url)) {
        showError('URL inválida. Por favor, verifique o endereço digitado.');
        return;
    }
    
    // Limpar QR Code anterior se existir
    if (qrCodeInstance) {
        qrcodeDisplay.innerHTML = '';
    }
    
    // Gerar novo QR Code
    try {
        qrCodeInstance = new QRCode(qrcodeDisplay, {
            text: url,
            width: 256,
            height: 256,
            colorDark: '#1e293b',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Exibir seção do QR Code com animação
        setTimeout(() => {
            qrcodeSection.classList.remove('hidden');
            qrcodeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        showError('Erro ao gerar QR Code. Tente novamente.');
        console.error('Erro ao gerar QR Code:', error);
    }
}

// Função para fazer download do QR Code
function downloadQRCode() {
    const canvas = qrcodeDisplay.querySelector('canvas');
    
    if (!canvas) {
        showError('Nenhum QR Code para baixar.');
        return;
    }
    
    try {
        // Converter canvas para blob
        canvas.toBlob((blob) => {
            // Criar URL temporário
            const url = URL.createObjectURL(blob);
            
            // Criar link temporário para download
            const link = document.createElement('a');
            link.href = url;
            link.download = `qrcode-${Date.now()}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Limpar
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        showError('Erro ao baixar QR Code. Tente novamente.');
        console.error('Erro ao baixar QR Code:', error);
    }
}

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);

downloadBtn.addEventListener('click', downloadQRCode);

themeToggle.addEventListener('click', toggleTheme);

// Carregar tema ao iniciar
loadTheme();

// Permitir gerar QR Code pressionando Enter
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQRCode();
    }
});

// Limpar erro ao digitar
urlInput.addEventListener('input', () => {
    if (errorMessage.textContent) {
        clearError();
    }
});

// Melhorar UX: limpar input após gerar
urlInput.addEventListener('focus', () => {
    urlInput.select();
});
