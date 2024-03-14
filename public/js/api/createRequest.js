/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";

  const method = options.method;
  let url = options.url;
  let data = options.data;
  callback = options.callback;

  const formData = new FormData();

  if (method === "GET") {
    let params = "";
    for (let key in data) {
      params += key + "=" + data[key] + "&";
    }

    if (params.endsWith("&")) {
      params = params.slice(0, -1);
    }

    url += "?" + params;
  } else {
    for (let key in data) {
      formData.append(key, data[key]);
    }
  }

  try {
    xhr.open(method, url);
    xhr.send(formData);
  } catch (err) {
    options.callback(err);
  }

  xhr.onload = function () {
    options.callback(null, xhr.response);
  };
};
