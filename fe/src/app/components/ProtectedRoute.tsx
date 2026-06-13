import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { identityApi } from '../lib/api';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

/**
 * ProtectedRoute: Check xem user đã login và token còn hiệu lực chưa
 * Nếu chưa có token hoặc token hết hiệu lực, redirect đến login page
 */
export function ProtectedRoute({ element }: ProtectedRouteProps) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const result = await identityApi.introspect({ token });
        if (result.valid) {
          setIsValid(true);
        } else {
          // Token không còn hiệu lực
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          setIsValid(false);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token]);

  // Still checking token
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8D6E63]/30 border-t-[#5D4037] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5D4037]">Đang kiểm tra phiên...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

/**
 * PublicRoute: Check xem user đã login rồi
 * Nếu đã có token hợp lệ, redirect đến dashboard
 */
export function PublicRoute({ element }: ProtectedRouteProps) {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const result = await identityApi.introspect({ token });
        if (result.valid) {
          setIsValid(true);
        } else {
          // Token không còn hiệu lực
          localStorage.removeItem('token');
          localStorage.removeItem('accessToken');
          setIsValid(false);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        setIsValid(false);
      }
    };

    verifyToken();
  }, [token]);

  // Still checking token
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8D6E63]/30 border-t-[#5D4037] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5D4037]">Đang kiểm tra phiên...</p>
        </div>
      </div>
    );
  }

  if (isValid) {
    return <Navigate to="/" replace />;
  }

  return element;
}
