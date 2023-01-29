import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ElTableScroll from '../../src/index'
import ElTableSticky from 'element-table-sticky';

export default async ({
  Vue
}) => {
  Vue.use(ElementUI);
  Vue.directive('table-scroll', ElTableScroll);
  Vue.directive('table-sticky', ElTableSticky);
}