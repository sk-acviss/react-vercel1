import axios from "axios";
import { enqueueSnackbar } from "notistack";
// import { clearToken } from "./loginHelper";

interface location {
  [key: string]: string | number;
}
const token = localStorage.getItem("acvissToken");
export const attachDefaultContentType = (header: {
  [key: string]: string | number;
}) => {
  if (header["Content-Type"] === null || header["Content-Type"] === undefined) {
    header["Content-Type"] = "application/json";
    // header["Access-Control-Allow-Origin"] = "*";
  }
  return header;
};
export const upload = async (api: string, body: FormData, headers = {}) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await axios.post(api, body, {
      headers: {
        "Content-Type": `multipart/form-data`,
        AUTHORIZATION: `Bearer ${token}`,
      },
    });

    const data = await response.data;
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }
    return { data, status: response.status };
  } catch (error) {
    //console.log(error);
  }
};

export const del = async (api: string, headers = {}) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      method: "DELETE",
      headers: {
        ...headers,
        AUTHORIZATION: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }

    return { status: response.status };
  } catch (error) {
    throw error;
  }
};
export const put = async (
  api: string,
  body:
    | FormData
    | {
        [key: string]:
          | string
          | number
          | location
          | null
          | string[]
          | { [key: string]: string }
          | { [key: string]: string }[];
      },
  headers = {}
) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      method: "PUT",
      headers: {
        ...headers,
        AUTHORIZATION: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }
    return { data, status: response.status };
  } catch (error) {
    //console.error(error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
};
export const patch = async (
  api: string,
  body: { [key: string]: string | number | location | null | string[] },
  headers = {}
) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      method: "PATCH",
      headers: {
        ...headers,
        AUTHORIZATION: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }
    const data = await response.json();

    return { data, status: response.status };
  } catch (error) {
    //console.error(error);
    throw error; // Rethrow the error to handle it further up the call stack
  }
};
export const get = async (api: string, headers = {}) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      cache: "no-store",
      method: "GET",
      headers: {
        ...headers,
        AUTHORIZATION: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }
    // if (response.status === 401) {
    //   clearToken();
    // }
    return {
      data: data,
      status: response.status,
    };
  } catch (error) {
    //console.log(error);
  }
};
export const post = async (
  api: string,
  body:
    | FormData
    | {
        [key: string]:
          | string
          | number
          | location
          | null
          | string[]
          | { [key: string]: string }
          | { [key: string]: string }[];
      },
  headers = {},
  login?: boolean
) => {
  headers = attachDefaultContentType(headers);

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: login
        ? { ...headers }
        : {
            ...headers,
            AUTHORIZATION: `Bearer ${token}`,
          },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
    if (response.status === 401) {
      enqueueSnackbar({
        message: "Token Expired Plese Login Again",
        variant: "error",
      });
      localStorage.clear();
      window.location.reload();
    }
    return { data, status: response.status };
  } catch (error) {
    //console.log(error);
  }
};
