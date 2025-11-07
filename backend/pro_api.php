<!DOCTYPE html>
<html>
<head>
    <title>Product API Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f5f5; }
        .box { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; }
        .success { color: green; font-weight: bold; }
        .error { color: red; font-weight: bold; }
        pre { background: #f9f9f9; padding: 10px; overflow-x: auto; max-height: 400px; }
        .product { border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .product img { max-width: 100px; }
        button { padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; margin: 5px; }
    </style>
</head>
<body>
    <h1>🧪 Product API Test</h1>
    
    <div class="box">
        <button onclick="testAPI()">Test API</button>
        <button onclick="testWithShopLogic()">Test with Shop Logic</button>
        <div id="status">Click button to test...</div>
    </div>

    <div id="results"></div>

    <script>
        const API_BASE = 'http://localhost:8000';

        async function testAPI() {
            document.getElementById('status').innerHTML = '<p>⏳ Fetching...</p>';
            document.getElementById('results').innerHTML = '';
            
            try {
                const res = await fetch(`${API_BASE}/api/products.php`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                console.log('Status:', res.status);
                const data = await res.json();
                console.log('Data:', data);
                
                if (!data.success) {
                    document.getElementById('status').innerHTML = 
                        `<p class="error">❌ API Error: ${data.message}</p>`;
                    return;
                }
                
                document.getElementById('status').innerHTML = 
                    `<p class="success">✅ API Working! Found ${data.data.length} products</p>`;
                
                let html = '<div class="box"><h2>Raw API Response:</h2><pre>' + 
                    JSON.stringify(data, null, 2) + '</pre></div>';
                
                html += '<div class="box"><h2>Products:</h2>';
                data.data.forEach(p => {
                    html += `<div class="product">
                        <h3>${p.name} (#${p.id})</h3>
                        <p>Price: $${p.price} | Category: ${p.category} | Stock: ${p.stock}</p>
                        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/100'" />
                    </div>`;
                });
                html += '</div>';
                
                document.getElementById('results').innerHTML = html;
                
            } catch (e) {
                document.getElementById('status').innerHTML = 
                    `<p class="error">❌ Connection Failed: ${e.message}</p>`;
                document.getElementById('results').innerHTML = 
                    '<p>Make sure PHP backend is running on port 8000</p>';
            }
        }

        async function testWithShopLogic() {
            document.getElementById('status').innerHTML = '<p>⏳ Testing Shop logic...</p>';
            document.getElementById('results').innerHTML = '';
            
            try {
                const res = await fetch(`${API_BASE}/api/products.php`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await res.json();
                
                if (!data.success) throw new Error(data.message || 'API error');
                if (!data.data || data.data.length === 0) throw new Error('No products');
                
                // Map like Shop.js does
                const mapped = data.data.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    originalPrice: p.originalPrice ?? p.price,
                    image: p.image || 'https://via.placeholder.com/300',
                    category: (p.category || 'others').toLowerCase(),
                    rating: p.rating || 4.5,
                    inStock: p.inStock !== false,
                    discount: p.discount || 0,
                    brand: p.category || 'Fresh'
                }));
                
                // Apply price filter (0-10000)
                const priceRange = [0, 10000];
                const filtered = mapped.filter(product => 
                    product.price >= priceRange[0] && product.price <= priceRange[1]
                );
                
                document.getElementById('status').innerHTML = 
                    `<p class="success">✅ Shop Logic: ${mapped.length} products loaded, ${filtered.length} after filter</p>`;
                
                let html = '<div class="box"><h2>After Shop.js Mapping & Filter:</h2>';
                filtered.slice(0, 9).forEach(p => {
                    html += `<div class="product">
                        <h3>${p.name}</h3>
                        <p>$${p.price} | ${p.category} | Discount: ${p.discount}%</p>
                        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/100'" />
                    </div>`;
                });
                html += '</div>';
                
                document.getElementById('results').innerHTML = html;
                
            } catch (e) {
                document.getElementById('status').innerHTML = 
                    `<p class="error">❌ Error: ${e.message}</p>`;
            }
        }
    </script>
</body>
</html>