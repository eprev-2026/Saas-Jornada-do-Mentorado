
declare global {
    interface Window {
        mammoth: any;
        pdfjsLib: any;
    }
}

export const extractTextFromFile = async (file: File): Promise<string> => {
    const fileNameParts = file.name.split('.');
    const fileType = fileNameParts[fileNameParts.length - 1]?.toLowerCase();

    if (fileType === 'txt' || fileType === 'md') {
        return await readTextFile(file);
    } else if (fileType === 'docx') {
        return await readDocxFile(file);
    } else if (fileType === 'doc') {
        throw new Error("Arquivos .doc (Word 97-2003) não são suportados pelo navegador. Por favor, converta para .docx ou .pdf antes de enviar.");
    } else if (fileType === 'pdf') {
        return await readPdfFile(file);
    } else {
        throw new Error(`Formato de arquivo não suportado: .${fileType}. Use .docx, .pdf, .txt ou .md`);
    }
};

const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(new Error("Erro ao ler arquivo de texto."));
        reader.readAsText(file);
    });
};

const readDocxFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target?.result;
            if (window.mammoth) {
                window.mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                    .then((result: any) => resolve(result.value))
                    .catch((err: any) => reject(new Error("Erro ao processar arquivo DOCX: " + err.message)));
            } else {
                console.error("Mammoth.js not found in window object.");
                reject(new Error("Biblioteca de leitura de Word não carregada. Tente recarregar a página."));
            }
        };
        reader.onerror = (error) => reject(new Error("Erro ao ler arquivo."));
        reader.readAsArrayBuffer(file);
    });
};

const readPdfFile = async (file: File): Promise<string> => {
    if (!window.pdfjsLib) {
        throw new Error("Biblioteca PDF.js não carregada. Verifique sua conexão.");
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';
        }

        return fullText;
    } catch (e: any) {
        throw new Error("Erro ao ler PDF: " + e.message);
    }
};
