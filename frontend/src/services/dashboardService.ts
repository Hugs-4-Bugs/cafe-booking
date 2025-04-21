import api from './api';

export interface IDashboardCount {
  category: number;
  product: number;
  bill: number;
  user?: number;
}

const dashboardService = {
  getCount: () => {
    return api.get<IDashboardCount>('/dashboard/details');
  }
};

export default dashboardService;
