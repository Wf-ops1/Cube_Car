export interface CRLVExtractedData {
    licensePlate?: string;
    renavam?: string;
    make?: string;
    model?: string;
    year?: number; // Fabricação
    modelYear?: number; // Modelo
    color?: string;
    fuel?: string;
    chassi?: string;
}

/**
 * Pré-processa a imagem para OCR usando Canvas:
 * 1. Converte para Escala de Cinza
 * 2. Aumenta o Contraste
 * 3. Faz o crop da metade superior caso seja uma imagem em modo retrato (onde fica o cabeçalho)
 */
export const processImageForOCR = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageUrl); // Fallback to original
                return;
            }

            // Heurística de Crop: Se a imagem é muito alta (retrato de uma folha A4)
            // Os dados da placa ficam no terço superior. Vamos cropar o topo 50%.
            let targetHeight = img.height;
            if (img.height > img.width * 1.2) {
                targetHeight = Math.floor(img.height * 0.55); // Top 55%
            }

            canvas.width = img.width;
            canvas.height = targetHeight;

            // Desenha apenas a parte superior
            ctx.drawImage(img, 0, 0, img.width, targetHeight, 0, 0, canvas.width, canvas.height);

            // Filtro de contraste e grayscale manual para máxima compatibilidade
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            const contrast = 50; // Aumentar contraste
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

            for (let i = 0; i < data.length; i += 4) {
                // Grayscale
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                // Aplicar contraste
                let newColor = factor * (lum - 128) + 128;
                newColor = Math.min(Math.max(newColor, 0), 255); // Clamp

                data[i] = newColor;     // R
                data[i + 1] = newColor; // G
                data[i + 2] = newColor; // B
                // Index 3 is Alpha, keep unchanged
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = imageUrl;
    });
};

export const extractCRLVData = (rawText: string): CRLVExtractedData => {
    const data: CRLVExtractedData = {};

    // Normaliza para maiúsculas e remove acentos para não quebrar a Regex
    const text = rawText.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Placa (Regex para Mercosul ou Padrão Antigo)
    // Ex: ABC1234 ou ABC1D23
    const placaMatch = text.match(/[A-Z]{3}[0-9][A-Z0-9][0-9]{2}/);
    if (placaMatch) {
        data.licensePlate = placaMatch[0];
    }

    // 2. Renavam (9 a 11 dígitos, evitando CPFs)
    // Procura número isolado de 9 a 11 digitos
    const renavamMatches = [...text.matchAll(/\b\d{9,11}\b/g)];
    if (renavamMatches.length > 0) {
        // Pega o primeiro que aparecer (geralmente fica no topo do CRLV)
        data.renavam = renavamMatches[0][0];
    }

    // 3. Marca / Modelo
    // Removido conforme instrucao do usuario: "não é pra ler nada em marca e modelo"

    // NOTA: Ao removermos o `let flatText = text.replace(/\n/g, ' ').toUpperCase();`,
    // evitamos corromper a leitura natural com '\n' que prejudicava outras extrações 
    // com base de regex posicional ou substrings adiante.

    // 4. Anos (Fabricação e Modelo)
    // Procura números que comecem com 19 ou 20
    const anosMatches = [...text.matchAll(/\b(19[8-9]\d|20[0-2]\d)\b/g)];
    if (anosMatches.length >= 2) {
        const anos = anosMatches.map(m => parseInt(m[0], 10));
        // O menor é fabricação, o maior é modelo (na imensa maioria dos casos)
        data.year = Math.min(anos[0], anos[1]);
        data.modelYear = Math.max(anos[0], anos[1]);
    } else if (anosMatches.length === 1) {
        data.year = parseInt(anosMatches[0][0], 10);
        data.modelYear = data.year;
    }

    // 5. Cor
    const cores = ['PRETA', 'BRANCA', 'PRATA', 'CINZA', 'VERMELHA', 'AZUL', 'VERDE', 'AMARELA', 'MARROM', 'BEGE'];

    // Flatten text agressivo para pegar cores que o OCR separou com espaços ou quebras (ex: "C I N Z A" ou "CIN\nZA")
    const flatTextForColor = text.replace(/[\n\s]+/g, '');

    for (const cor of cores) {
        // Tenta achar a cor exata no texto normal ou na versão colada
        if (text.includes(cor) || flatTextForColor.includes(cor)) {
            data.color = cor;
            break;
        }
    }

    // Fallback heurístico para cores mal lidas pelo OCR
    if (!data.color) {
        if (text.includes('PRE7A') || text.includes('PRFTA') || flatTextForColor.includes('PRE7A')) data.color = 'PRETA';
        if (text.includes('BRANC') || flatTextForColor.includes('BRANC')) data.color = 'BRANCA';
    }

    return data;
};
