// fetch api calls

export const callApi = (path, method = 'GET', body = null, credentials = null) => {
    const url = `http://localhost:5000/api${path}`;
    const getOptions = {
        method, headers: {}
    }

    // if body truthy -> add it to options
    if(body){
        getOptions.body = JSON.stringify(body);
        getOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    // if credentials truthy -> add auth to options
    if(credentials){
        const encodedCredential = btoa(`${credentials.username}:${credentials.password}`);
        getOptions.headers.Authorization = `Basic ${encodedCredential}`;
    }
    return fetch(url, getOptions)
}