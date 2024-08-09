import * as Crypto from "expo-crypto";

export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const md5 = async (str: string): Promise<string> => {
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, str);
};

export async function fetchWithDigestAuth(
  url: string,
  username: string,
  password: string
): Promise<string> {
  const authHeader = (
    method: any,
    uri: any,
    nonce: any,
    realm: any,
    qop: any,
    nc: any,
    cnonce: any,
    response: any
  ): string => {
    return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`;
  };

  /**
   * Calculates the Digest Response for Digest Authentication.
   *
   * @param {any} nonce - The nonce value from the server.
   * @param {any} realm - The realm value from the server.
   * @param {any} qop - The qop value from the server.
   * @param {any} method - The HTTP method of the request.
   * @param {any} uri - The URI of the request.
   * @param {any} nc - The nonce count value.
   * @param {any} cnonce - The client nonce value.
   * @return {Promise<string>} A promise that resolves to the digest response.
   */
  const makeDigestResponse = async (
    nonce: any,
    realm: any,
    qop: any,
    method: any,
    uri: any,
    nc: any,
    cnonce: any
  ): Promise<string> => {
    const ha1 = await md5(`${username}:${realm}:${password}`);
    const ha2 = await md5(`${method}:${uri}`);
    return await md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
  };

  const initialResponse = await fetch(url);
  if (!initialResponse.headers.has("www-authenticate")) {
    throw new Error("No www-authenticate header in the response");
  }

  const authHeaderStr: any = initialResponse.headers.get("www-authenticate");
  const authParams = authHeaderStr
    .substring(7)
    .split(", ")
    .reduce((acc: any, current: any) => {
      const [key, value] = current.split("=");
      acc[key] = value.replace(/"/g, "");
      return acc;
    }, {});

  const method = "GET";
  const uri = url.replace(/^.*\/\/[^\/]+/, ""); // Extrai o URI do URL
  const nonce = authParams["nonce"];
  const realm = authParams["realm"];
  const qop = "auth";
  const nc = "00000001";
  const cnonce = Math.random().toString(36).substring(2, 15);

  const responseHash = await makeDigestResponse(
    nonce,
    realm,
    qop,
    method,
    uri,
    nc,
    cnonce
  );
  const authorization = authHeader(
    method,
    uri,
    nonce,
    realm,
    qop,
    nc,
    cnonce,
    responseHash
  );

  const finalResponse = await fetch(url, {
    headers: {
      Authorization: authorization,
    },
  });

  if (!finalResponse.ok) {
    throw new Error(`HTTP error! status: ${finalResponse.status}`);
  }

  const buffer = await finalResponse.arrayBuffer();
  const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64String;
}
