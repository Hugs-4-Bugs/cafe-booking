import api from './api';

export interface ICategory {
  id: number;
  name: string;
}

export interface ICategoryRequest {
  name: string;
}

const categoryService = {
  getAllCategories: () => {
    return api.get<ICategory[]>('/category/get');
  },

  getCategoryById: (id: number) => {
    return api.get<ICategory>(`/category/get/${id}`);
  },

  addCategory: (data: ICategoryRequest) => {
    return api.post<string>('/category/add', data);
  },

  updateCategory: (id: number, data: ICategoryRequest) => {
    return api.post<string>('/category/update', { id, ...data });
  },

  deleteCategory: (id: number) => {
    return api.post<string>('/category/delete', { id });
  }
};

export default categoryService;
