
class ApiObj {
    static field = "";
    static path = this.field;
}
class Strategy extends ApiObj {
    static field = "strategies";
}
class Trader extends ApiObj {
    static field = "traders";
}
class Assignment extends ApiObj {
    static field = "assignments";
}
class Pair extends ApiObj {
    static field = "pairs";
}
class Evaluation extends ApiObj {
    static field = "evaluations";
}


export const TYPE_STRATEGY = {
    path: "strategies",
    field: "strategies"
};

export const TYPE_TRADER = {
    path: "traders",
    field: "traders"
};

export const TYPE_ASSIGNMENT = {
    path : "assignments",
    field : "assignments",
};

export const TYPE_PAIR = {
    path: "pairs",
    field: "pairs"
};

export const TYPE_EVALUATIONS = {
    path: "evaluations",
    field: "evaluations",
};


export default class Api {
    static getAll(type) {
        return fetch(`/api/${type.path}`).then(response => {
            if(response.status == 401) {
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
            if(response.status == 401) {
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
            if(response.status == 401) {
                throw response
            }
            return response.json();
        })
    }
}
