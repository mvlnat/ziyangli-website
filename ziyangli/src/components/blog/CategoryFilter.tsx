import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onChange
}) => {
  return (
    <div className="category-filter">
      <button
        className={selected === null ? 'active' : ''}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={selected === category ? 'active' : ''}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
