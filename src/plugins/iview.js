import { Table, Login, UserName, Password, Submit } from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css'
export default (app) => {
  app.component('Table', Table);
  app.component('Login', Login);
  app.component('UserName', UserName);
  app.component('Password', Password);
  app.component('Submit', Submit);
}
