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
        credentials: "include"
    });

    return await data.json();
}

export async function getOne(base: String, id: Number): Promise<any> {
    let data = await fetch(`/api/${base}/${id}`, {
        credentials: "include"
    });
    return await data.json();
}

export async function postOne(base: String, v: any): Promise<any> {
    let data = await fetch(`/api/${base}/${v.id}`, {
        credentials: 'include',
        method: 'post',
        body : JSON.stringify(v),
    });

    return await data.json();

}