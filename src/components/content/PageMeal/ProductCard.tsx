"use client";
import React, { useState } from 'react';
import { CartItem } from '@/types/cart';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  slug?: string;
  onOrder?: () => void;
  variant?: 'square' | 'mobile';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  title,
  price,
  slug,
  onOrder,
  variant = 'square'
}) => {
  const [showAddedPopup, setShowAddedPopup] = useState(false);

  // Hàm xử lý lưu vào localStorage và hiện pop-up
  const handleOrder = (product: { image: string; name: string; price: string }) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const numericPrice = Number(product.price.replace(/[^\d]/g, '')) || 0;
    const existing = cart.find((item: CartItem) => item.name === product.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ 
        ...product, 
        price: numericPrice, // Store as number
        quantity: 1 
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setShowAddedPopup(true);
    setTimeout(() => setShowAddedPopup(false), 1500);
  };

  const handleCardClick = () => {
    if (slug) {
      window.location.href = `/menu/${slug}`;
    }
  };


  if (variant === 'mobile') {
    return (
      <div className="flex flex-col sm:flex-row items-center bg-gray-50 gap-3 w-full rounded-[12px] border border-gray-200 shadow-sm hover:shadow transition p-4 cursor-pointer">
      <div
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="w-full aspect-[16/10] overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-lg font-bold text-orange-500 mb-4">
            {price}
          </p>
          <div className="flex justify-end">
          <button
            className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]"
            onClick={e => { 
              e.stopPropagation(); 
              if (onOrder) {
                onOrder();
              } else {
                handleOrder({ image: imageSrc, name: title, price });
              }
            }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/3262cfa1a5e84abee65d00d1af984c4d09c90038?placeholderIfAbsent=true"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
              alt="Order icon"
            />
            <span className="self-stretch my-auto text-[#3B2219] font-medium">Đặt</span>
          </button>
          </div>
        </div>
        {showAddedPopup && (
          <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
            Đã thêm vào giỏ hàng!
          </div>
        )}
      </div>
      </div>
    );
  }
  return (
    <article className="overflow-hidden self-stretch my-auto bg-white rounded-xl min-w-60 w-[340px] cursor-pointer">
      <img
        src={imageSrc}
        className="object-contain w-full aspect-square" 
        onClick={handleCardClick}
        alt={title}
      />
      <div className="flex flex-col justify-center px-4 py-3">
        <div className="w-full text-lg font-medium leading-none">
          <h3 className="gap-2.5 self-stretch w-full text-black leading-tight break-words overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word'
              }}>
            {title}
          </h3>
          <p className="gap-2.5 self-stretch mt-3 w-full text-pink-800 whitespace-nowrap leading-tight">
            {price}
          </p>
        </div>
        <div className="flex flex-col justify-center items-end mt-3 w-full text-base whitespace-nowrap text-stone-800">
          <button
            className="flex gap-2 justify-center items-center rounded-[8px] border border-solid border-stone-800 min-h-8 w-[68px]"
            onClick={e => { 
              e.stopPropagation(); 
              if (onOrder) {
                onOrder();
              } else {
                handleOrder({ image: imageSrc, name: title, price });
              }
            }}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a20586ce4c1b41ce81ab28e7c7b82866/3262cfa1a5e84abee65d00d1af984c4d09c90038?placeholderIfAbsent=true"
              className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
              alt="Order icon"
            />
            <span className="self-stretch my-auto">Đặt</span>
          </button>
        </div>
      </div>
      {showAddedPopup && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in">
          Đã thêm vào giỏ hàng!
        </div>
      )}
    </article>
  );
};
