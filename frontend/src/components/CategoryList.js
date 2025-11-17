import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CategoryList.css"; // pour les styles

function CategoryList({ categories }) {
  return (
    <div className="text-center my-5">
      <h2 className="fw-bold mb-4">Toutes les Catégories</h2>
      <Stack
        direction="horizontal"
        gap={4}
        className="justify-content-center flex-wrap"
      >
        {categories.map((cat) => (
          <div key={cat.id} className="category-item text-center">
            <Link to={`/category/${cat.id}`} className="category-link">
              <div className="category-circle">
                <img src={cat.image} alt={cat.name} />
              </div>
              <p className="category-name">{cat.name}</p>
            </Link>
          </div>
        ))}
      </Stack>
    </div>
  );
}

export default CategoryList;
