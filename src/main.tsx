import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthProvider';
import './index.css';
import { router } from './router'; 
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const queryClient = new QueryClient(); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);