import { Link } from 'react-router-dom';
import './NotFound.css';
export default function NotFound() {
  return (
    <section className="section nf">
      <div className="container">
        <h1>404</h1><h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </section>
  );
}
