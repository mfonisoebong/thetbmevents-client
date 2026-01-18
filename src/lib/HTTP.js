import {getCookie} from "./utils";
import axios from "./axios";

export default async function HTTP({url, method = 'post', data, headers}) {
    let resp = {
        ok: true,
        data: null,
        error: null,
    }
    let config = {
        url,
        method,
        headers: {
            Authorization: `Bearer ${getCookie('token')}`,
            ...headers,
        }
    }

    if (data) {
        config.data = data
    }

    try {
        const response = await axios(config)

        resp.data = response.data
    } catch (err) {
        resp.ok = false
        resp.error = err
    }

    return resp;

}
