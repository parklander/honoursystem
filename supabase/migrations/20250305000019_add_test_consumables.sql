-- Insert test consumables
INSERT INTO consumables (name, description, price, unit, category, stock_quantity, reorder_point) VALUES
-- Filament
('PLA Filament - Black', '1.75mm PLA filament, 1kg spool', 25.00, 'spool', 'filament', 10, 3),
('PLA Filament - White', '1.75mm PLA filament, 1kg spool', 25.00, 'spool', 'filament', 8, 3),
('PETG Filament - Black', '1.75mm PETG filament, 1kg spool', 30.00, 'spool', 'filament', 5, 2),
('TPU Filament - Black', '1.75mm TPU filament, 1kg spool', 35.00, 'spool', 'filament', 3, 2),

-- Resin
('Standard Resin - Gray', 'Standard UV-cure resin, 1kg bottle', 40.00, 'bottle', 'resin', 5, 2),
('Water Washable Resin - Gray', 'Water washable UV-cure resin, 1kg bottle', 45.00, 'bottle', 'resin', 3, 2),
('Tough Resin - Black', 'Tough UV-cure resin, 1kg bottle', 50.00, 'bottle', 'resin', 2, 1),

-- Vinyl
('Vinyl Sheet - Black', '12" x 12" vinyl sheet', 2.50, 'sheet', 'vinyl', 50, 10),
('Vinyl Sheet - White', '12" x 12" vinyl sheet', 2.50, 'sheet', 'vinyl', 45, 10),
('Vinyl Sheet - Red', '12" x 12" vinyl sheet', 2.50, 'sheet', 'vinyl', 30, 10),
('Vinyl Sheet - Blue', '12" x 12" vinyl sheet', 2.50, 'sheet', 'vinyl', 35, 10),

-- Blanks
('Acrylic Sheet - Clear', '12" x 12" x 3mm acrylic sheet', 15.00, 'sheet', 'blanks', 20, 5),
('Acrylic Sheet - Black', '12" x 12" x 3mm acrylic sheet', 15.00, 'sheet', 'blanks', 15, 5),
('Plywood Sheet', '12" x 12" x 3mm plywood sheet', 8.00, 'sheet', 'blanks', 25, 8),
('MDF Sheet', '12" x 12" x 3mm MDF sheet', 6.00, 'sheet', 'blanks', 30, 10),

-- Wood
('Pine Board', '1" x 4" x 8" pine board', 12.00, 'board', 'wood', 15, 5),
('Oak Board', '1" x 4" x 8" oak board', 25.00, 'board', 'wood', 8, 3),
('Plywood Sheet', '4" x 8" x 1/2" plywood sheet', 35.00, 'sheet', 'wood', 10, 3),

-- Metal
('Aluminum Sheet', '12" x 12" x 1/8" aluminum sheet', 20.00, 'sheet', 'metal', 15, 5),
('Steel Sheet', '12" x 12" x 1/8" steel sheet', 25.00, 'sheet', 'metal', 10, 3),
('Copper Sheet', '12" x 12" x 1/8" copper sheet', 30.00, 'sheet', 'metal', 8, 3),

-- Electronics
('Arduino Uno', 'Arduino Uno R3 board', 25.00, 'piece', 'electronics', 10, 3),
('Raspberry Pi 4', 'Raspberry Pi 4 Model B', 45.00, 'piece', 'electronics', 5, 2),
('LED Strip', '5V RGB LED strip, 1m', 15.00, 'meter', 'electronics', 20, 5),

-- Fasteners
('M3 Screws', 'M3 x 20mm screws, pack of 100', 8.00, 'pack', 'fasteners', 30, 10),
('M4 Screws', 'M4 x 25mm screws, pack of 100', 10.00, 'pack', 'fasteners', 25, 8),
('Wood Screws', '1" wood screws, pack of 100', 12.00, 'pack', 'fasteners', 20, 8),

-- Adhesives
('Super Glue', '5g tube of super glue', 5.00, 'tube', 'adhesives', 40, 10),
('Wood Glue', '8oz bottle of wood glue', 8.00, 'bottle', 'adhesives', 25, 8),
('Epoxy', '2-part epoxy, 50ml', 15.00, 'kit', 'adhesives', 15, 5),

-- Finishing
('Sandpaper - 120', '120 grit sandpaper, pack of 10', 8.00, 'pack', 'finishing', 30, 10),
('Sandpaper - 220', '220 grit sandpaper, pack of 10', 8.00, 'pack', 'finishing', 25, 8),
('Polyurethane', '8oz can of polyurethane', 15.00, 'can', 'finishing', 20, 5),

-- Other
('Safety Glasses', 'ANSI-rated safety glasses', 15.00, 'pair', 'other', 30, 10),
('Dust Mask', 'N95 dust mask, pack of 10', 12.00, 'pack', 'other', 40, 15),
('Work Gloves', 'Pair of work gloves', 12.00, 'pair', 'other', 25, 8); 