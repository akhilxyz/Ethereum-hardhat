import axios from 'axios'

const fetcher = async (data) => {

    try {
        let RequestData = {
            method: data.method,
            url: data.url,
            data: data.data,
            // headers: { "x-access-token": token }
        }

        let rs = await axios(RequestData).catch(function (error) {
            if (error.response) {
                return error.response.data
            } else if (error.request) {
                return error.request
            } else {
                return error.message
            }
        });

        if (rs.data) {
            rs = rs.data
            return rs;
        }
        else {
            return rs;
        }
    }
    catch (e) {
        return new Error(e.request.response.message);
    }
}


export default fetcher;
