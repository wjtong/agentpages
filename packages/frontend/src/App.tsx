import { useState } from 'react';
import axios from 'axios';
import './App.css';

// Define a type for our product data for type safety
interface Product {
  id: number;
  Name: string;
  SKU: string;
  Price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The backend is running on port 3000, so we make the request there.
      // This calls the GET /api/proxy/master-data/Products endpoint we created.
      const response = await axios.get('http://localhost:3000/api/proxy/master-data/Products');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Is the backend running? Is NocoDB accessible?');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AgentPages NocoDB Integration Test</h1>
        <p>Click the button to fetch master data ('Products') from the backend.</p>
        <button onClick={fetchProducts} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Products from NocoDB'}
        </button>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {products.length > 0 && (
          <div>
            <h2>Products Data:</h2>
            <pre style={{ textAlign: 'left', backgroundColor: '#f0f0f0', padding: '1rem' }}>
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
