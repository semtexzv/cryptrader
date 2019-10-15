export const TYPE_STRATEGY = {
    path: "strategies",
    field: "strategies",
    modelName: "Strategy",
    id: (e) => {
        return e.id
    }
};

export const TYPE_TRADER = {
    path: "traders",
    field: "traders",
    modelName: "Trader",
    id: (e) => {
        return e.id
    }
};

export const TYPE_ASSIGNMENT = {
    path: "assignments",
    field: "assignments",
    modelName: "Assignment",
    id: (e) => {
        return `/${e.pair_id}/${e.period}`
    },

};

export const TYPE_PAIR = {
    path: "pairs",
    field: "pairs",
    modelName: "Pair",
    id: (e) => {
        return e.id
    }
};

export const TYPE_PERIOD = {
    path: "periods",
    field: "periods",
    modelName: "Period",
    id: (e) => {
        return e.text;
    }
};

export const TYPE_EVALUATION = {
    path: "evaluations",
    field: "evaluations",
    modelName: "Evaluation",
    id: (e) => {
        return e.id
    },
};

export const TYPE_TRADE = {
    path: "trades",
    field: "trades",
    modelName: "Trade",
    id: (e) => e.id,
};


export default class Api {
    static getOne(type, id) {
        return fetch(`/api/${type.path}/${id}`).then(response => {
            if (response.status == 401) {
                throw response
            }
            return response.json();
        })
    }

    static getAll(type) {
        return fetch(`/api/${type.path}`).then(response => {
            if (response.status == 401) {
                throw response
            }
            return response.json();
        })
    }

    static postOne(type, v) {
        let url = v.hasOwnProperty('id') && v['id'] != null ? `/api/${type.path}/${v.id}` : `/api/${type.path}`;
        return fetch(url, {
            credentials: 'include',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(v),
        }).then(response => {
            if (response.status == 401) {
                throw response
            }
            return response.json();
        })
    }

    static deleteOne(type, id) {
        let url = `/api/${type.path}/${id}`;
        return fetch(url, {
            credentials: 'include',
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status == 401) {
                throw response
            }
            return response.json();
        })
    }

    static signin(data) {
        return fetch("/api/signin/", {
            credentials: 'include',
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status >= 400) {
                throw response
            }
            return {}; //response.json();
        })
    }

    static signup(data) {
        return fetch("/api/signup/", {
            credentials: 'include',
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status >= 400) {
                throw response
            }
            return {};
            //return response.json();
        })
    }

    static logout() {
        return fetch("/api/logout/", {
            credentials: 'include',
            method: 'post',

        }).then(response => {
            if (response.status >= 400) {
                throw response
            }
            return {};
        })
    }
}
