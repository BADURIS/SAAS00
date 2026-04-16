-- Supabase Data Seed for Casa de Carnes

-- Limpar produtos antigos (Opcional: comente se não quiser apagar)
-- DELETE FROM public.products;

INSERT INTO public.products (name, price, category, stock, min_stock, description, image)
VALUES 
    -- MARMITAS TRADICIONAIS
    ('Marmita Tradicional - Bife acebolado', 26.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Isca de frango', 24.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Filé de tilápia empanado', 26.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Bisteca acebolada', 24.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Filé de frango grelhado', 24.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Omelete recheada', 22.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),
    ('Marmita Tradicional - Calabresa acebolada', 22.00, 'Marmita', 100, 10, 'Opção: Marmita Tradicional', '/images/fallback.png'),

    -- MARMITAS ESPECIAIS
    ('Marmita Especial - Parmegiana de frango', 26.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Parmegiana de carne', 28.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Feijoada', 30.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Feijoada a la carte', 58.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Carne Assada', 30.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Costela com mandioca', 28.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),
    ('Marmita Especial - Churrasco', 35.00, 'Marmita', 100, 10, 'Opção: Marmita Especial', '/images/fallback.png'),

    -- ASSADOS (CARNES & FRANGO)
    ('Carnes Assadas (KG)', 97.90, 'Assados', 100, 10, 'Cupim, Fraldinha, Linguiça Toscana, Costela Suína, Costela Bovina, Lagarto', '/images/fallback.png'),
    ('Frango Assado Completo', 55.00, 'Assados', 50, 5, 'Frango assado na brasa', '/images/fallback.png'),

    -- ACOMPANHAMENTOS & ADICIONAIS
    ('Arroz Branco', 16.00, 'Acompanhamentos', 100, 10, 'Porção', '/images/fallback.png'),
    ('Maionese da Casa', 20.00, 'Acompanhamentos', 50, 10, 'Porção', '/images/fallback.png'),
    ('Feijão Tropeiro', 25.00, 'Acompanhamentos', 50, 10, 'Porção', '/images/fallback.png'),
    ('Salada à parte', 3.00, 'Acompanhamentos', 100, 10, 'Porção extra', '/images/fallback.png'),
    ('Marmita com divisória', 5.00, 'Acompanhamentos', 200, 50, 'Embalagem', '/images/fallback.png'),
    ('Ovo Frito', 3.00, 'Acompanhamentos', 100, 10, 'Adicional', '/images/fallback.png'),
    ('Porção de Batata Frita', 12.00, 'Acompanhamentos', 100, 10, 'Porção de 200g', '/images/fallback.png'),

    -- BEBIDAS 2L E 600ml
    ('Coca 2L', 18.00, 'Bebidas', 30, 5, 'Refrigerante 2L', '/images/fallback.png'),
    ('Fanta 2L', 16.00, 'Bebidas', 20, 5, 'Refrigerante 2L', '/images/fallback.png'),
    ('Guaraná 2L', 16.00, 'Bebidas', 20, 5, 'Refrigerante 2L', '/images/fallback.png'),
    ('Sprite 2L', 16.00, 'Bebidas', 20, 5, 'Refrigerante 2L', '/images/fallback.png'),
    ('Itubaina 2L', 12.00, 'Bebidas', 20, 5, 'Refrigerante 2L', '/images/fallback.png'),
    
    ('Coca 600ml', 9.00, 'Bebidas', 30, 5, 'Refrigerante 600ml', '/images/fallback.png'),
    ('Fanta 600ml', 9.00, 'Bebidas', 30, 5, 'Refrigerante 600ml', '/images/fallback.png'),
    ('Sprite 600ml', 9.00, 'Bebidas', 30, 5, 'Refrigerante 600ml', '/images/fallback.png'),
    ('Guaraná 600ml', 9.00, 'Bebidas', 30, 5, 'Refrigerante 600ml', '/images/fallback.png'),

    -- BEBIDAS LATA E SUCOS
    ('Coca Lata', 7.00, 'Bebidas', 50, 10, 'Refrigerante lata 350ml', '/images/fallback.png'),
    ('Fanta Lata', 7.00, 'Bebidas', 50, 10, 'Refrigerante lata 350ml', '/images/fallback.png'),
    ('Guaraná Lata', 7.00, 'Bebidas', 50, 10, 'Refrigerante lata 350ml', '/images/fallback.png'),
    ('Sprite Lata', 7.00, 'Bebidas', 50, 10, 'Refrigerante lata 350ml', '/images/fallback.png'),
    ('Itubaina Lata', 6.00, 'Bebidas', 50, 10, 'Refrigerante lata 350ml', '/images/fallback.png'),

    ('Suco Lata UVA', 9.00, 'Bebidas', 30, 5, 'Suco de fruta 330ml', '/images/fallback.png'),
    ('Suco Lata MARACUJÁ', 9.00, 'Bebidas', 30, 5, 'Suco de fruta 330ml', '/images/fallback.png'),
    ('Suco Lata MANGA', 9.00, 'Bebidas', 30, 5, 'Suco de fruta 330ml', '/images/fallback.png'),
    ('Suco Lata PÊSSEGO', 9.00, 'Bebidas', 30, 5, 'Suco de fruta 330ml', '/images/fallback.png');
