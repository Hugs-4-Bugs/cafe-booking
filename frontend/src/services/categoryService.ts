import api from './api';

export interface ICategory {
  id: number;
  name: string;
}

export interface ICategoryRequest {
  id?: number;
  name: string;
}

const categoryService = {
  getAllCategories: (filterValue?: string) => {
    const params = filterValue ? { filterValue } : {};
    return api.get<ICategory[]>('/category/get', { params });
  },

  addCategory: (data: ICategoryRequest) => {
    return api.post<string>('/category/add', data);
  },

  updateCategory: (data: ICategoryRequest) => {
    return api.post<string>('/category/update', data);
  }
};

export default categoryService;
