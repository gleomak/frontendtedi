import axios, {AxiosError, AxiosResponse} from "axios";
import {store} from "../../store/configureStore";
import {PaginatedResponse} from "../models/metadata";
import {toast} from "react-toastify";


const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5000/api/';
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response =>{
    await sleep();
    const pagination =  response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        // console.log(response);
        return response;
    }
    return response
}, (error: AxiosError) => {
    const{data, status} = error.response as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors){
                const modelStateErrors: string[] = [];
                for (const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 403:
            toast.error('You are not allowed to do that!');
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

function createFormData(item: any) {
    let formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    // formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    // });
    return formData;
}

const requests = {
    get:(url:string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    get2:(url:string, body: {}) => axios.get(url, body).then(responseBody),
    post:(url:string, body: {}) => axios.post(url, body).then(responseBody),
    put:(url:string, body: {}) => axios.put(url, body).then(responseBody),
    delete:(url:string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),
}

const Account ={
    login: (values:any) => requests.post('Account/login', values),
    register: (values: FormData) => requests.postForm('Account/register', values),
    currentUser: () => requests.get('Account/currentUser'),
    getUserDetails:(values : URLSearchParams ) => requests.get('Account/getUserDetails', values),
    editUserProfile:(values: FormData) => requests.postForm('Account/editUserProfile', values),
    getUserResidences:(values: URLSearchParams) => requests.get('Account/getHostResidences', values),
}

const Catalog={
    list: (params: URLSearchParams) => requests.get('Residence', params),
    details: (id: number) => requests.get(`Residence/${id}`),
    postReservation: (values: any) => requests.post('Reservation/postReservation', values),
    getReservations: (params: URLSearchParams) => requests.get('/Reservation/getReservationsForResidence', params),
    updateHostResidence:(values: FormData) => requests.postForm('Residence/updateResidence', values),
}


const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorized'),
    get404Error: () => requests.get('buggy/not-found'),
    getValidationError: () => requests.get('buggy/validation-error'),
}

const Admin = {
    getUsers:(params: URLSearchParams) => requests.get('Account/retrieveUserList', params),
    authorizeUser:(values : any) => requests.post('Account/authorizeUser', values),
}


const agent = {
    Catalog,
    TestErrors,
    Account,
    Admin
}

export default agent;