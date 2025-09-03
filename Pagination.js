import { useEffect, useState } from "react";
import "./App.css";

const Lists = ({ title, imageUrl }) => {
  return (
    <div className="product-card">
      <h1>{title}</h1>
      <img className="product-image" src={imageUrl} alt={title}></img>
    </div>
  );
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);      
  const [currentPage, setCurrentPage] = useState(0);

  const PAGE_SIZE = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dummyjson.com/products?limit=500");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data?.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const TOTAL_PAGE_NO = Math.ceil(products.length / PAGE_SIZE);
  const START = currentPage * PAGE_SIZE;
  const END = START + PAGE_SIZE;

  const handlePagination = (pageNo) => {
    setCurrentPage(pageNo);
  };

  if (loading) return <h1>Loading products...</h1>;   // 👈 show loader
  if (error) return <h1>Error: {error}</h1>;          // 👈 show error message
  if (!products.length) return <h1>No products found</h1>; // 👈 fallback

  return (
    <div className="App">
      <div className="pagination-container">
        <button
          disabled={currentPage === 0}
          className="page-number"
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ⏪
        </button>
        {[...Array(TOTAL_PAGE_NO).keys()].map((n) => (
          <span
            key={n}
            className={`page-number ${n === currentPage ? "active" : ""}`}
            onClick={() => handlePagination(n)}
          >
            {n + 1}
          </span>
        ))}
        <button
          disabled={currentPage === TOTAL_PAGE_NO - 1}
          className="page-number"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          ⏩
        </button>
      </div>

      <div className="product-container">
        {products.slice(START, END).map((product) => (
          <Lists key={product.id} title={product.title} imageUrl={product.thumbnail} />
        ))}
      </div>
    </div>
  );
}


/* App.css */

.App {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Pagination */
.pagination-container {
  margin: 20px 0;
}

.page-number {
  display: inline-block;
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s ease;
}

.page-number:hover {
  background-color: #f1f1f1;
}

.page-number.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.page-number:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Product Grid */
.product-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Product Card */
.product-card {
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card h1 {
  font-size: 16px;
  margin: 10px 0;
  color: #333;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
}


