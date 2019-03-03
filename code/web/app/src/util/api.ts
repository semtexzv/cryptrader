export class Strategy {
    id: Number;

    name: String;
    body: String;
}

export class Assignment {
    exchange: String = null;
    pair: String = null;

    period: String = null;

    strategy_id: Number = null;
    trader_id: Number = null;
}

export class Trader {
    id: Number = null;
    name: String = null;

    exchange: String = null;

    api_key: String = null;
    api_secret: String = null;
}

export async function getAll(base: String): Promise<any[]> {

    let data = await fetch(`/api/${base}`, {
        credentials: "include",
        headers: {
            'Accept': 'application/json'
        }
    });

    if(data.status == 401) {
        window.location.href = "/app/login";
        return [];
    }

    return await data.json();
}

export async function getOne(base: String, id: Number): Promise<any> {
    let data = await fetch(`/api/${base}/${id}`, {
        credentials: "include",
        headers: {
            'Accept': 'application/json'
        }

    });

    if(data.status == 401) {
        window.location.href = "/app/login";
        return {};
    }

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

    try {
        return await data.json();
    } catch (e) {
        return null
    }
}