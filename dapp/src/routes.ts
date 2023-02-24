import { RouteType } from '@multiversx/sdk-dapp/types';
import { dAppName } from 'config/config';
import { withPageTitle } from './components/PageTitle';

import { Dashboard, Home } from './pages';

export const routeNames = {
  home: '/',
  dashboard: '/dashboard',
  unlock: '/unlock',
  mainScreen: '/main'
};

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home,
    authenticatedRoute: false
  },
  {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  }
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • MultiversX ${dAppName}`
    : `MultiversX ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});
