-- Contagem por estado (UF) com processos, quilombos federais, POLO, sentenças e tempo total
SELECT 
    l.uf AS ESTADO, 
    COUNT(DISTINCT p.id) AS TOTAL_PROCESSO, 
    COUNT(DISTINCT q.id) AS TOTAL_QUILOMBO,
 
    -- Processos federais separados por TRF
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF1' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF1,
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF2' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF2, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF3' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF3, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF4' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF4, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF5' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF5, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF6' AND p.competencia = 'Federal' THEN p.id END) AS PROCESSO_TRF6,
 
    -- Quilombos federais separados por TRF
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF1' THEN q.id END) AS QUILOMBO_TRF1, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF2' THEN q.id END) AS QUILOMBO_TRF2, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF3' THEN q.id END) AS QUILOMBO_TRF3, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF4' THEN q.id END) AS QUILOMBO_TRF4, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF5' THEN q.id END) AS QUILOMBO_TRF5, 
    COUNT(DISTINCT CASE WHEN p.jurisdicao = 'TRF6' THEN q.id END) AS QUILOMBO_TRF6,
 
    -- Contagem de POLO
    COUNT(DISTINCT CASE WHEN p.polo = 'Ativo' THEN p.id END) AS POLO_ATIVO, 
    COUNT(DISTINCT CASE WHEN p.polo = 'Passivo' THEN p.id END) AS POLO_PASSIVO, 
    COUNT(DISTINCT CASE WHEN p.polo = 'Neutro' THEN p.id END) AS POLO_NEUTRO,
 
    -- Contagem de sentenças
    COUNT(DISTINCT CASE WHEN p.sentenca_id IS NULL THEN p.id END) AS SENTENCA_NULL, 
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 1 THEN p.id END) AS SENTENCA_1, 
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 2 THEN p.id END) AS SENTENCA_2, 
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 3 THEN p.id END) AS SENTENCA_3, 
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 4 THEN p.id END) AS SENTENCA_4, 
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 5 THEN p.id END) AS SENTENCA_5,
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 6 THEN p.id END) AS SENTENCA_6,
    COUNT(DISTINCT CASE WHEN p.sentenca_id = 7 THEN p.id END) AS SENTENCA_7,
 
    -- Cálculo do tempo total (em dias)
    IFNULL(SUM(CASE WHEN p.data_sentenca IS NOT NULL THEN DATEDIFF(p.data_sentenca, p.data_distribuicao) ELSE DATEDIFF(CURDATE(), p.data_distribuicao) END), 0) AS TEMPO_TOTAL
FROM 
    tb_localidade l
LEFT JOIN 
    tb_processo p ON l.id = p.localidade_id
LEFT JOIN 
    tb_quilombo q ON l.id = q.localidade_id
GROUP BY 
    l.uf

UNION ALL

-- Contagem total (BR) separada para processos, quilombos, jurisdições federais, POLO, sentenças e tempo total
SELECT 
    'BR' AS ESTADO,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p) AS TOTAL_PROCESSO,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q) AS TOTAL_QUILOMBO,
 
    -- Processos federais para todo o Brasil
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF1' AND p.competencia = 'Federal') AS PROCESSO_TRF1,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF2' AND p.competencia = 'Federal') AS PROCESSO_TRF2,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF3' AND p.competencia = 'Federal') AS PROCESSO_TRF3,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF4' AND p.competencia = 'Federal') AS PROCESSO_TRF4,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF5' AND p.competencia = 'Federal') AS PROCESSO_TRF5,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.jurisdicao = 'TRF6' AND p.competencia = 'Federal') AS PROCESSO_TRF6,
 
    -- Quilombos federais para todo o Brasil
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF1') AS QUILOMBO_TRF1,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF2') AS QUILOMBO_TRF2,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF3') AS QUILOMBO_TRF3,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF4') AS QUILOMBO_TRF4,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF5') AS QUILOMBO_TRF5,
    (SELECT COUNT(DISTINCT q.id) FROM tb_quilombo q LEFT JOIN tb_processo p ON q.localidade_id = p.localidade_id WHERE p.jurisdicao = 'TRF6') AS QUILOMBO_TRF6,
 
    -- Contagem de POLO para todo o Brasil
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.polo = 'Ativo') AS POLO_ATIVO,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.polo = 'Passivo') AS POLO_PASSIVO,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.polo = 'Neutro') AS POLO_NEUTRO,
 
    -- Contagem de sentenças para todo o Brasil
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id IS NULL) AS SENTENCA_NULL,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 1) AS SENTENCA_1,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 2) AS SENTENCA_2,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 3) AS SENTENCA_3,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 4) AS SENTENCA_4,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 5) AS SENTENCA_5,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 6) AS SENTENCA_6,
    (SELECT COUNT(DISTINCT p.id) FROM tb_processo p WHERE p.sentenca_id = 7) AS SENTENCA_7,
 
    -- Cálculo do tempo total (em dias) para todo o Brasil com retorno 0 se não houver valores
    IFNULL(
        (SELECT SUM(
            CASE 
                WHEN p.data_sentenca IS NOT NULL THEN DATEDIFF(p.data_sentenca, p.data_distribuicao)
                ELSE DATEDIFF(CURDATE(), p.data_distribuicao)
            END
        ) FROM tb_processo p), 0
    ) AS TEMPO_TOTAL
