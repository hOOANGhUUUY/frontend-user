"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { SearchBar } from '@/components/content/PageMenu/SearchNav';
import { CategoryNav } from '@/components/content/PageMenu/CategoryNav';
import { ProductGrid } from '@/components/content/PageMenu/ProductGrid';
import { CartActionButton } from '@/components/content/PageCart/CartActionButton';
import apiClient from '@/lib/apiClient';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  description?: string;
  meta_description?: string;
  id_category: number;
  status: boolean;
  quantity_sold?: number;
}

export const Menu = () => {
  const [hasCart, setHasCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number|null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState(''); // Chỉ thay đổi khi submit search
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hàm kiểm tra giỏ hàng trong localStorage
    const checkCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setHasCart(cart.length > 0);
    };

    checkCart(); // Kiểm tra lần đầu khi component mount

    // Lắng nghe sự kiện để cập nhật nút giỏ hàng ngay lập tức
    window.addEventListener('storage', checkCart);
    window.addEventListener('cartUpdated', checkCart); // Sự kiện tùy chỉnh khi thêm món

    return () => {
      window.removeEventListener('storage', checkCart);
      window.removeEventListener('cartUpdated', checkCart);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        if (activeSearchTerm.trim()) {
          // Tìm kiếm sản phẩm
          res = await apiClient.get(`/users/product/search?query=${encodeURIComponent(activeSearchTerm.trim())}`);
        } else if (selectedCategory) {
          // Lấy sản phẩm theo danh mục
          res = await apiClient.get(`/users/products/category/${selectedCategory}`);
        } else {
          // Lấy tất cả sản phẩm
          res = await apiClient.get('/users/product');
        } 
        const rawProducts = res.data?.data || res.data || [];
        const mappedProducts = rawProducts.map((product: { image?: string; [key: string]: any }) => ({
          ...product,
          imageUrl: product.image || ''
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, activeSearchTerm]);

  const handleSearch = useCallback((query: string) => {
    setActiveSearchTerm(query); // Chỉ cập nhật khi submit search
    // Reset category khi tìm kiếm
    if (query.trim()) {
      setSelectedCategory(null);
    }
  }, []);

  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    // Reset search khi chọn category
    setSearchTerm('');
    setActiveSearchTerm('');
  }, []);

  const comboProducts = products.filter(p => p.id_category === 6);
  const limitedComboProducts = comboProducts.slice(0, 8);

  return (
    <div className="flex overflow-hidden flex-col bg-stone-100">
      <section className="flex ml-[210px] mr-[250px] z-10 px-8 pt-6 pb-4 w-full bg-zinc-100 min-h-[142px] max-md:px-3 max-md:flex-col max-md:gap-3 max-sm:ml-4 max-sm:mr-4">
        <div className="flex-1 min-w-0">
          <div className="rounded p-2 h-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#D4AF37] uppercase">
              Menu
            </h1>
            <p className="mt-1 text-sm sm:text-base lg:text-lg font-light text-black">
              Thăng hoa vị giác với ....
            </p>
          </div>
        </div>
        <div className="flex-1 max-md:justify-start max-md:mt-1">
          <div className="rounded mx-[20px] w-full max-w-md max-sm:mx-0">
            <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </section>

      <CategoryNav onCategorySelect={handleCategorySelect} />

      <main className="flex flex-col items-center justify-center">
        {loading ? (
          <div className="text-center py-10">
            <div className="text-lg mb-2">
              {activeSearchTerm.trim() ? 'Đang tìm kiếm...' : 'Đang tải sản phẩm...'}
            </div>
            <div className="animate-spin w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : activeSearchTerm.trim() ? (
          // Hiển thị kết quả tìm kiếm
          <>
            {products.length > 0 ? (
              <ProductGrid 
                name={`Kết quả tìm kiếm cho "${activeSearchTerm}" (${products.length} sản phẩm)`} 
                variant="horizontal" 
                products={products}
              />
            ) : (
              <div className="text-center py-10">
                <div className="text-lg text-black mb-4">
                  Không tìm thấy sản phẩm phù hợp với từ khóa &quot;{activeSearchTerm}&quot;
                </div>
                <div className="text-sm text-gray-600">
                  Vui lòng thử với từ khóa khác hoặc xem menu đầy đủ
                </div>
              </div>
            )}
          </>
        ) : (
          <>  
          <div className="flex flex-col items-center justify-center">
            {!selectedCategory && (
              <ProductGrid name="Combo" variant="square" products={limitedComboProducts} />
            )}
            {products.length > 0 && (
              <ProductGrid 
                name={selectedCategory ? `Danh mục (${products.length} sản phẩm)` : "Menu"} 
                variant="horizontal" 
                products={products}
              />
            )}
            </div>
          </>
        )}
      </main>

      {/* Nút giỏ hàng nổi - chỉ hiện khi có sản phẩm */}
      {hasCart && (
        <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
          <CartActionButton />
        </div>
      )}

    </div>
  );
};

export default Menu;
