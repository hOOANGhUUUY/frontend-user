"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerLoginSuccess, triggerRegisterSuccess } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const isNewUser = searchParams.get('new_user'); // Backend có thể gửi flag này
    console.log('1');
    if (token && userData) {
      console.log('2');

      try {
        console.log('3');

        // Lưu token và user vào cookie
        // Cookies.set('token', token);
        // Cookies.set('user', userData);
        Cookies.set('token', token, { path: '/', sameSite: 'Lax' });
        Cookies.set('user', userData, { path: '/', sameSite: 'Lax' });

        // Parse user data
        const userInfo = JSON.parse(userData);

        // Phân biệt đăng ký mới hay đăng nhập
        if (isNewUser === 'true') {
          console.log('4');

          triggerRegisterSuccess(userInfo);
        } else {
          console.log('5');

          console.log('đã vào nhập');

          triggerLoginSuccess(userInfo);
        }

        // Redirect về trang chủ
        // router.push('/');
        router.replace('/');

      } catch (error) {
          console.log('6');

        console.error('Error processing auth callback:', error);
        router.push('/login?error=auth_failed');
      }
    } else {
          console.log('7');

      // Nếu không có token, redirect về trang đăng nhập
      router.push('/login?error=no_token');
    }
  }, [searchParams, router, triggerLoginSuccess, triggerRegisterSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44291a] mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
} 