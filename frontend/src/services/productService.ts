import api from './api';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  categoryId: number;
  categoryName: string;
}

export interface IProductRequest {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  status?: string;
}

const productService = {
  getAllProducts: () => {
    return api.get<IProduct[]>('/product/get');
  },

  getProductsByCategory: (categoryId: number) => {
    return api.get<IProduct[]>(`/product/getByCategory/${categoryId}`);
  },

  getProductById: (productId: number) => {
    return api.get<IProduct>(`/product/getById/${productId}`);
  },

  addProduct: (data: IProductRequest) => {
    return api.post<string>('/product/add', data);
  },

  updateProduct: (data: IProductRequest) => {
    return api.post<string>('/product/update', data);
  },

  deleteProduct: (productId: number) => {
    return api.post<string>(`/product/delete/${productId}`);
  },

  updateProductStatus: (productId: number, status: string) => {
    return api.post<string>('/product/updateStatus', { id: productId, status });
  },

  uploadExcel: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<string>('/product/uploadExcel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getPaginatedProducts: (page: number = 0, size: number = 5) => {
    return api.get('/product/productList', {
      params: { page, size }
    });
  }
};

export default productService;
