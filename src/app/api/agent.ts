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
    get:(url:string) => axios.get(url).then(responseBody),
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
    list: () => requests.get('Residences'),
    details: (id: number) => requests.get(`Residences/${id}`)
}



const agent = {
    Catalog,
    Account
}

export default agent;