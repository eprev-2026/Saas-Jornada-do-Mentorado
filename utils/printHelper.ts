
declare global {
    interface Window {
        marked: {
            parse: (markdown: string) => string;
        };
    }
}

/**
 * Helper to generate a clean print layout for documents.
 * It opens a new window, converts Markdown to HTML using 'marked', adds print styles (including tables), and adds a print button.
 */
export const generatePrintLayout = (title: string, content: string | undefined, studentName: string) => {
    if (!content) return;

    let htmlContent = '';
    
    // Use marked library if available for robust parsing (tables, etc)
    if (window.marked) {
        htmlContent = window.marked.parse(content);
    } else {
        // Fallback simple parser if library fails to load
        htmlContent = content
        .split('\n')
        .map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '<br />';
            if (trimmed.startsWith('# ')) return `<h1>${trimmed.replace('# ', '')}</h1>`;
            if (trimmed.startsWith('## ')) return `<h2>${trimmed.replace('## ', '')}</h2>`;
            if (trimmed.startsWith('### ')) return `<h3>${trimmed.replace('### ', '')}</h3>`;
            if (trimmed.startsWith('- ')) return `<li>${trimmed.replace('- ', '')}</li>`;
            const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            if (!trimmed.startsWith('- ') && !trimmed.startsWith('#')) {
                return `<p>${withBold}</p>`;
            }
            return withBold;
        })
        .join('');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('O navegador bloqueou a janela de impressão. Por favor, permita pop-ups para este site.');
        return;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title} - ${studentName}</title>
            <meta charset="UTF-8">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
                
                body { 
                    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif; 
                    padding: 40px; 
                    color: #1a1a1a; 
                    line-height: 1.5; 
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                }

                /* Header Styling */
                .header-container {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 2px solid #F59E0B;
                    padding-bottom: 20px;
                }
                .logo-text {
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #666;
                    margin-bottom: 10px;
                }
                .doc-title {
                    font-size: 26px;
                    font-weight: 700;
                    color: #000;
                    margin: 0;
                    text-transform: uppercase;
                }
                .meta-info {
                    margin-top: 15px;
                    font-size: 14px;
                    color: #444;
                    background: #f3f4f6;
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 20px;
                }

                /* Content Styling */
                h1 { font-size: 24px; color: #F59E0B; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 5px; page-break-after: avoid; }
                h2 { font-size: 20px; color: #1F2937; margin-top: 25px; font-weight: 700; page-break-after: avoid; }
                h3 { font-size: 18px; color: #374151; margin-top: 20px; page-break-after: avoid; }
                p { margin-bottom: 10px; text-align: justify; }
                li { margin-bottom: 5px; }
                strong { color: #000; font-weight: 700; }
                
                /* Table Styling for Print */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 14px;
                    page-break-inside: avoid;
                }
                th {
                    background-color: #f3f4f6;
                    color: #000;
                    font-weight: bold;
                    padding: 8px;
                    border: 1px solid #999;
                    text-align: left;
                }
                td {
                    padding: 8px;
                    border: 1px solid #999;
                }
                tr:nth-child(even) {
                    background-color: #fafafa;
                }

                /* Action Button */
                .print-btn-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .print-btn {
                    background: #F59E0B;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .print-btn:hover { background: #d97706; }

                /* Footer */
                .footer {
                    margin-top: 60px;
                    text-align: center;
                    font-size: 10px;
                    color: #999;
                    border-top: 1px solid #eee;
                    padding-top: 20px;
                    page-break-before: avoid;
                }

                @media print {
                    .print-btn-container { display: none; }
                    body { padding: 0; max-width: 100%; }
                    .header-container { border-bottom: 2px solid #000; }
                    h1 { color: #000; border-bottom: 1px solid #000; }
                    th { background-color: #ddd !important; -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="print-btn-container">
                <button class="print-btn" onclick="window.print()">
                    <svg style="width:20px;height:20px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    IMPRIMIR / SALVAR PDF
                </button>
            </div>

            <div class="header-container">
                <div class="logo-text">Mentoria Império Previdenciário</div>
                <h1 class="doc-title">${title}</h1>
                <div class="meta-info">
                    <strong>Mentorado:</strong> ${studentName} &nbsp;|&nbsp; 
                    <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}
                </div>
            </div>

            <div class="content">
                ${htmlContent}
            </div>

            <div class="footer">
                Documento gerado automaticamente pela plataforma Império Previdenciário. Uso confidencial.
            </div>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};
