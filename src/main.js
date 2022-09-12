import { createApp } from 'vue'
import App from './App.vue'


import '../node_modules/primeflex/primeflex.css'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Rating from 'primevue/rating';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FileUpload from 'primevue/fileupload';
import ToolBar from 'primevue/toolbar';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';


import 'primevue/resources/themes/saga-orange/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons

const app = createApp(App);
app.use(PrimeVue);


app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('Rating', Rating)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('FileUpload', FileUpload)
app.component('ToolBar', ToolBar)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)

app.mount("#app")