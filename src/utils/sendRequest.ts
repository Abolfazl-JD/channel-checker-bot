import axios, { AxiosRequestConfig } from "axios";
import crypto from "crypto";
import { consts } from "./consts";

/**
 * Configuration object for the API client
 */
interface Config {
  baseURL: string;
  apiKey: string;
  secretKey: string;
  signMethod: "RSA" | "HmacSHA256";
}

const config = {
  baseURL: consts.baseUrl,
  apiKey: consts.apiKey,
  secretKey: consts.apiSecret,
  signMethod: "HmacSHA256",
} satisfies Config;

/**
 * Parameters for the API request
 */
interface RequestParams {
  [key: string]: string | number | boolean | undefined;
  sign?: string; // Explicitly declare the 'sign' property
}

/**
 * Utility function to generate a random string (echostr)
 * @param length - The length of the string
 * @returns A random alphanumeric string
 */
function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Utility function to sort parameters and create a parameter string
 * @param params - The request parameters
 * @returns The sorted parameter string
 */
function createParameterString(params: RequestParams): string {
  return Object.keys(params)
    .sort() // Step 1: Sort keys alphabetically
    .map((key) => `${key}=${params[key]}`) // Step 2: Format each key-value pair as key=value
    .join("&"); // Step 3: Join with '&'
}

/**
 * Utility function to generate a signature
 * @param paramString - The parameter string (already sorted and formatted)
 * @param secretKey - The secret key for signing
 * @param signMethod - The signing method (RSA or HmacSHA256)
 * @returns The generated signature
 */
function generateSignature(
  paramString: string,
  secretKey: string,
  signMethod: "RSA" | "HmacSHA256",
): string {
  // Step 3: Generate MD5 digest and convert it to uppercase
  const md5Digest = crypto
    .createHash("md5")
    .update(paramString)
    .digest("hex")
    .toUpperCase();

  // Step 4: Sign the MD5 digest
  if (signMethod === "HmacSHA256") {
    // HmacSHA256 signing
    return crypto
      .createHmac("sha256", secretKey)
      .update(md5Digest)
      .digest("hex");
  } else if (signMethod === "RSA") {
    // RSA signing
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(md5Digest);
    return sign.sign(secretKey, "base64");
  } else {
    throw new Error(`Unsupported signature method: ${signMethod}`);
  }
}

/**
 * Sends a signed request to the API
 * @param endpoint - The API endpoint
 * @param method - HTTP method (GET or POST)
 * @param params - The request parameters
 * @returns The response data
 */
export async function sendRequest(
  endpoint: string,
  method: "GET" | "POST",
  params: RequestParams = {},
): Promise<any> {
  try {
    // Step 1: Retrieve timestamp
    const timestamp = Date.now(); // Replace with API-based timestamp retrieval if needed
    const echostr = generateRandomString(32); // Generate random string for echostr

    // Step 2: Add required authentication fields to parameters
    const fullParams: RequestParams = {
      ...params,
      api_key: config.apiKey,
      timestamp,
      echostr,
      signature_method: config.signMethod,
    };

    // Step 3: Create parameter string
    const paramString = createParameterString(fullParams);

    // Step 4: Generate the signature
    const signature = generateSignature(
      paramString,
      config.secretKey,
      config.signMethod,
    );

    // Step 5: Add the signature to the parameters
    fullParams.sign = signature;

    // Step 6: Configure the request
    const axiosConfig: AxiosRequestConfig = {
      baseURL: config.baseURL,
      url: endpoint,
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: method === "GET" ? fullParams : undefined,
      data:
        method === "POST"
          ? new URLSearchParams(fullParams as Record<string, string>).toString()
          : undefined,
    };

    // Step 7: Send the request
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error: any) {
    console.error(new Date().toString(), `Error in sendRequest: ${error.message}`);
    throw error;
  }
}
