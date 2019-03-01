export function getStrategies() {
    return fetch("/api/strategies", {
        credentials: "include"
    }).then(data => data.json())
        .then(({data}) => data)
}