import axios, {AxiosResponse} from "axios";
import {store} from "../../store/configureStore";

axios.defaults.baseURL = 'http://localhost:5000/api/';
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const requests = {
    get:(url:string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post:(url:string, body: {}) => axios.post(url, body).then(responseBody),
    put:(url:string, body: {}) => axios.put(url, body).then(responseBody),
    delete:(url:string) => axios.delete(url).then(responseBody),
}

const Account ={
    login: (values:any) => requests.post('Account/login', values),
    register: (values:any) => requests.post('Account/register', values),
    currentUser: () => requests.get('Account/currentUser')
}

const Catalog={
    list: (params: URLSearchParams) => requests.get('Residence', params),
    details: (id: number) => requests.get(`Residence/${id}`)
}


const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    getValidationError: () => requests.get('buggy/validation-error'),
}



const agent = {
    Catalog,
    TestErrors,
    Account
}

export default agent;