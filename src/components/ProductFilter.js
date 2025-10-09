import { Form } from 'react-bootstrap';

function ProductFilter({ categories, onFilterChange }) {
  return (
    <Form>
      <Form.Group controlId="categoryFilter">
        <Form.Label>Filtrer par catégorie</Form.Label>
        <Form.Control as="select" onChange={e => onFilterChange(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
    </Form>
  );
}

export default ProductFilter;
