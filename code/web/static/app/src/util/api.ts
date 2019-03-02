class ApiObj {
    static NAME() {
        return ""
    }
}

class Strategy extends ApiObj {

    id: Number;
    name: String;
    body: String;

}

class Api {

}

export async function getAll(base: String): Promise<any[]> {

    let data = await fetch(`/api/${base}`, {
        credentials: "include",
        headers: {
            'Accept': 'application/json'
        }
    });

    return await data.json();
}

export async function getOne(base: String, id: Number): Promise<any> {
    let data = await fetch(`/api/${base}/${id}`, {
        credentials: "include",
        headers: {
            'Accept': 'application/json'
        }

    });
    return await data.json();
}

export async function postOne(base: String, v: any): Promise<any> {

    let url = v.hasOwnProperty('id') ? `/api/${base}/${v.id}` :
        `/api/${base}`;

    let data = await fetch(url, {
        credentials: 'include',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(v),
    });

    return await data.json();

}