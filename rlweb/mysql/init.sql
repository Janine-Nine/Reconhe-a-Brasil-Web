-- ============================================================
-- Reconheça Brasil Web — schema inicial do banco de dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS reconheca_brasil_web
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE reconheca_brasil_web;

-- ---------- Tabela de contatos (formulário do site) ----------
CREATE TABLE IF NOT EXISTS contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- Tabela de projetos em destaque ----------
CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    imagem VARCHAR(255),
    categoria VARCHAR(100),
    destaque BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- Tabela de pacotes de serviço ----------
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    destaque BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- ---------- Itens/benefícios de cada pacote de serviço ----------
CREATE TABLE IF NOT EXISTS servico_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servico_id INT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Dados iniciais (seed)
-- ============================================================

INSERT INTO projetos (titulo, descricao, imagem, categoria, destaque) VALUES
('Educação para Todos', 'Projeto voltado para reforço escolar gratuito em comunidades carentes.', 'img/projeto1.jpg', 'social', TRUE),
('Sustentabilidade Verde', 'Incentivo à reciclagem e preservação ambiental em bairros locais.', 'img/projeto2.jpg', 'meio-ambiente', TRUE),
('Tecnologia Comunitária', 'Inclusão digital gratuita para jovens e adultos.', 'img/projeto3.jpg', 'tecnologia', TRUE);

INSERT INTO servicos (nome, preco, descricao, destaque) VALUES
('Pacote Iniciante', 299.00, 'Ideal para quem está começando sua presença online.', FALSE),
('Pacote Essencial', 499.00, 'O pacote mais contratado, equilíbrio entre recursos e custo.', TRUE),
('Pacote Profissional', 799.00, 'Para negócios que querem uma presença digital completa.', FALSE);

INSERT INTO servico_itens (servico_id, descricao) VALUES
(1, '1 Página'),
(1, 'Design Responsivo'),
(1, 'Formulário de Contato'),
(1, 'Redes Sociais'),
(2, 'Até 3 Páginas'),
(2, 'Design Personalizado'),
(2, 'Galeria de Imagens'),
(2, 'Formulário Completo'),
(2, 'Integração WhatsApp'),
(3, 'Até 5 Páginas'),
(3, 'Google Maps'),
(3, 'Blog'),
(3, 'SEO Básico'),
(3, 'Suporte Técnico');

-- ---------- Usuário de aplicação com permissões restritas ----------
CREATE USER IF NOT EXISTS 'rbweb_user'@'%' IDENTIFIED BY 'rbweb_pass';
GRANT SELECT, INSERT, UPDATE, DELETE ON reconheca_brasil_web.* TO 'rbweb_user'@'%';
FLUSH PRIVILEGES;
