import CategoryItem from "../category-item/category-item.component";
import "./categories.styles.scss";

const Categories = ({ categories }) => {
  return (
    <div className="categories-list">
      {categories.map((category) => {
        return <CategoryItem key={category.id} category={category} />;
      })}
    </div>
  );
};

export default Categories;
