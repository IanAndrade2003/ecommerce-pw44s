-- Inserção de usuarios(tb_user)
INSERT INTO tb_user (display_name, username, password) VALUES ('Administrador', 'admin', '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.');
INSERT INTO tb_user (display_name, username, password) VALUES ('João da Silva', 'joao.silva', '$2a$10$XURPShQNCsLjp1ESc2laoObo9QZDhxz73hJPaEv7/cBha4pk0AgP.');

-- Inserção de Categorias (tb_category)
INSERT INTO tb_category (name) VALUES ('Alucinogenos');
INSERT INTO tb_category (name) VALUES ('Estimulantes');
INSERT INTO tb_category (name) VALUES ('Calmantes');

-- Inserção de Produtos (tb_product)
-- A coluna category_id faz referência ao ID gerado na inserção das categorias acima

INSERT INTO tb_products (name, description, price, category_id, image) VALUES ('Prensadao do jaca', 'Esse bate forte 1g', 3.50, 3, 'blabla.com');
INSERT INTO tb_products (name, description, price, category_id, image) VALUES ('lsd', 'Pra se sentir nas nuvens 1mg', 22.90, 1, 'blabla.com');
INSERT INTO tb_products (name, description, price, category_id, image) VALUES ('Cocaína', 'Trava noia 1g', 8.00, 2, 'blabla.com');
INSERT INTO tb_products (name, description, price, category_id, image) VALUES ('Psylosibensis', 'Destruicao do ego 1g', 15.50, 1, 'blabla.com');
INSERT INTO tb_products (name, description, price, category_id, image) VALUES ('MDMA', 'Balinha da abacaxi 1g', 23.00, 2, 'blabla.com');


-- Inserção de Endereços (tb_address)
-- O user_id '2' vincula este endereço ao usuário 'João da Silva'
INSERT INTO tb_address (street, complement, number, zip_code, user_id) VALUES ('Rua das Araucárias', 'Apt 101', 1234, '85501-000', 2);
INSERT INTO tb_address (street, complement, number, zip_code, user_id) VALUES ('Avenida Tupi', 'Casa dos fundos', 500, '85502-000', 2);

-- Inserção de Pedidos (tb_order)
-- Simulando um pedido feito pelo 'João da Silva' (user_id = 2)
INSERT INTO tb_order (date, total_value, user_id) VALUES ('2023-11-10 14:30:00', 38.40, 2);
INSERT INTO tb_order (date, total_value, user_id) VALUES ('2023-11-15 09:15:00', 89.90, 2);

-- Inserção de Itens do Pedido (tb_order_item)
-- Itens do Pedido 1 (Total: 38.40) -> Paracetamol (1x 15.50) + Ibuprofeno (1x 22.90)
INSERT INTO tb_order_item (quantity, price, order_id, product_id) VALUES (1, 15.50, 1, 1);
INSERT INTO tb_order_item (quantity, price, order_id, product_id) VALUES (1, 22.90, 1, 2);

-- Itens do Pedido 2 (Total: 89.90) -> Protetor Solar (1x 89.90)
INSERT INTO tb_order_item (quantity, price, order_id, product_id) VALUES (1, 89.90, 2, 5);