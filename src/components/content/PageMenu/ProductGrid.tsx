"use client";

import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { IProductProps } from '@/types/product';
import apiClient from '@/lib/apiClient';

interface ProductGridProps {
  name: string;
  variant?: 'square' | 'horizontal' | 'mobile';
  products?: IProductProps[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ name, variant = 'square', products }) => {
  const [localProducts, setLocalProducts] = useState<IProductProps[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!products) {
      const fetchProducts = async () => {
        try {
          const res = await apiClient.get('/users/product');
          const rawData = Array.isArray(res.data) ? res.data : res.data|| [];
          
          const mappedProducts = rawData.map((product: { id: number; name: string; price: number; image: string; slug: string; description?: string; meta_description?: string; id_category: number; status: boolean; quantity_sold?: number }) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.image || '',
            slug: product.slug,
            description: product.description || product.meta_description,
            category: product.id_category,
            status: product.status,
            quantity_sold: product.quantity_sold
          }));
          
          setLocalProducts(mappedProducts);
        } catch (error) {
          console.error('Lỗi lấy sản phẩm:', error);
          setLocalProducts([]);
        }
      };
      fetchProducts();
    }
  }, [products]);

  const data = (products && products.length > 0 ? products : localProducts).map(product => ({
    ...product,
    imageUrl: product.imageUrl || ''
  }));

  if (data.length === 0) {
    return null;
  }

  // Trên mobile, sử dụng variant mobile
  const displayVariant = isMobile ? 'mobile' : variant;

  return (
    <section className="flex flex-col justify-center self-center w-full max-w-[1420px] max-md:max-w-full">
      <h2 className="gap-2.5 self-stretch pt-10 text-3xl font-bold leading-6 text-black whitespace-nowrap h-[70px] max-md:max-w-full">
        {name}
      </h2>

      {displayVariant === 'mobile' ? (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mt-5 w-full">
          {data.map((product, index) => (
            <ProductCard
              key={product.id || index}
              imageUrl={product.imageUrl}
              name={product.name}
              price={`${Number(product.price).toLocaleString()} đ`}
              variant="mobile"
              slug={product.slug}
            />
          ))}
        </div>
      ) : displayVariant === 'square' ? (
        <div className="flex flex-wrap gap-5 items-center mt-5 ml-10 w-full text-center max-md:max-w-full">
          {data.map((product, index) => (
            <ProductCard
              key={product.id || index}
              imageUrl={product.imageUrl}
              name={product.name}
              price={`${Number(product.price).toLocaleString()} đ`}
              variant="square"
              slug={product.slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-5 items-center mt-5 w-full text-center max-md:max-w-full">
          {data.map((product, index) => (
            <ProductCard
              key={product.id || index}
              imageUrl={product.imageUrl}
              name={product.name}
              price={`${Number(product.price).toLocaleString()} đ`}
              variant="horizontal"
              slug={product.slug}
            />  
          ))}
        </div>
      )}
    </section>
  );
};
