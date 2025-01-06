import * as XLSX from "xlsx";

// Função para extrair valor de campos aninhados
function extractFieldValue(obj, fieldRef) {
    return fieldRef.includes('.') 
        ? fieldRef.split('.').reduce((o, i) => o[i], obj) 
        : obj[fieldRef];
}

// Função para mapear os dados e processar a hierarquia
function mapDataToSheet(data, cols, colunaTabulada) {
    const sheetData = [];
    const setaUnicode = "|_"; // Símbolo para hierarquia

    function processObject(obj, nivel = 0) {
        const rowData = cols.map(col => {
            const fieldValue = extractFieldValue(obj, col[1]);
            const fieldFilter = col[2]; // Filtro de campo, se existir
            const filteredValue = fieldFilter ? fieldFilter(fieldValue) : fieldValue;

            // Adiciona seta unicode para indicar nível de hierarquia
            const valueWithIndentation = col[1] === colunaTabulada && nivel > 0 
                ? setaUnicode + ' ' + filteredValue 
                : filteredValue;

            return valueWithIndentation;
        });

        // Adiciona indentação proporcional ao nível hierárquico
        if (colunaTabulada) {
            const indiceColunaTabulada = cols.findIndex(col => col[1] === colunaTabulada);
            if (indiceColunaTabulada !== -1) {
                rowData[indiceColunaTabulada] = Array.from({ length: nivel }, () => '_').join('') + rowData[indiceColunaTabulada];
            }
        }

        // Adiciona a linha processada aos dados da planilha
        sheetData.push(rowData);

        // Se existirem filhos, processa recursivamente
        if (obj.children && obj.children.length > 0) {
            obj.children.forEach(child => processObject(child, nivel + 1));
        }
    }

    // Processa todos os objetos na raiz dos dados
    data.forEach(obj => processObject(obj));

    return sheetData;
}

// Função principal para criar e baixar o Excel
export function createExcel(title, data, cols, colunaTabulada = null) {
    // Mapeia os dados para o formato de planilha
    const sheetData = mapDataToSheet(data, cols, colunaTabulada);

    // Adiciona cabeçalhos às colunas
    const headerRow = cols.map(col => col[0]);
    sheetData.unshift(headerRow); // Coloca os cabeçalhos no início dos dados

    // Cria a planilha e o arquivo Excel
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData); // Converte os dados para uma planilha
    const workbook = XLSX.utils.book_new(); // Cria um novo workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, title); // Adiciona a planilha ao workbook

    // Formata o nome do arquivo com a data atual
    const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
    const fileName = `${title}_${currentDate}.xlsx`;

    // Faz o download do arquivo Excel
    XLSX.writeFile(workbook, fileName);
}
