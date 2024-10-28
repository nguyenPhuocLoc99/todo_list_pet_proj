function getAccessToken() {
  const accessTokenRegex = /accessToken=[\w\.-]+/;
  const getToken = accessTokenRegex.exec(document.cookie);

  if (getToken) {
    return getToken[0].split("=")[1].trim();
  } else return "";
}

export default getAccessToken;
