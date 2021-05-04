import React, { useState } from 'react';
import PropTypes from 'prop-types';
const ProductFilter = ({ submitCategory, clearAll, categorize }) => {
  const { category, gender, sortOrder } = categorize;
  const [clickFilter, setClickFilter] = useState(false);
  const handleClickFilter = () => setClickFilter(!clickFilter);
  const [clickSort, setClickSort] = useState(false);
  const handleClickSort = () => setClickSort(!clickSort);
  const [clickGender, setClickGender] = useState(false);
  const handleClickGender = () => setClickGender(!clickGender);
  return (
    <div className='product-filter'>
      <div className='product-filter__button'>
        <button
          className={
            !clickFilter
              ? 'btn-collapsible'
              : 'btn-collapsible btn-collapsible__active'
          }
          onClick={handleClickFilter}
        >
          {' '}
          Filter By:
        </button>
      </div>
      <div
        className={
          clickFilter
            ? 'product-filter__content display'
            : 'product-filter__content hidden'
        }
      >
        <button
          value='Clothing'
          name='category'
          onClick={submitCategory}
          className={category === 'Clothing' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Clothing
        </button>
        <button
          value='Shoes'
          name='category'
          onClick={submitCategory}
          className={category === 'Shoes' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Shoes
        </button>
        <button
          value='Accessories'
          name='category'
          onClick={submitCategory}
          className={
            category === 'Accessories' ? 'btn btn-light-silver' : 'btn'
          }
        >
          {' '}
          Accessories
        </button>
      </div>
      <div className='product-filter__button'>
        <button
          className={
            !clickGender
              ? 'btn-collapsible'
              : 'btn-collapsible btn-collapsible__active'
          }
          onClick={handleClickGender}
        >
          {' '}
          Gender
        </button>
      </div>
      <div
        className={
          clickGender
            ? 'product-filter__content display'
            : 'product-filter__content hidden'
        }
      >
        <button
          value='Male'
          name='gender'
          onClick={submitCategory}
          className={gender === 'Male' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Male
        </button>
        <button
          value='Female'
          name='gender'
          onClick={submitCategory}
          className={gender === 'Female' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Female
        </button>
      </div>

      <div className='product-filter__button'>
        <button
          className={
            !clickSort
              ? 'btn-collapsible'
              : 'btn-collapsible btn-collapsible__active'
          }
          onClick={handleClickSort}
        >
          {' '}
          Sort By:{' '}
        </button>
      </div>
      <div
        className={
          clickSort
            ? 'product-filter__content display'
            : 'product-filter__content hidden'
        }
      >
        <button
          value='Lowest'
          name='sortOrder'
          onClick={submitCategory}
          className={sortOrder === 'Lowest' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Price: Low to High
        </button>
        <button
          value='Highest'
          name='sortOrder'
          onClick={submitCategory}
          className={sortOrder === 'Highest' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Price: High to Low
        </button>
        <button
          value=''
          name='sortOrder'
          onClick={submitCategory}
          className={sortOrder === '' ? 'btn btn-light-silver' : 'btn'}
        >
          {' '}
          Newest Arrivals
        </button>
      </div>

      <button className='btn width-all' onClick={clearAll}>
        {' '}
        Clear All
      </button>
    </div>
  );
};

ProductFilter.propTypes = {
  submitCategory: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  categorize: PropTypes.object.isRequired,
};

export default ProductFilter;
