// src/app/lib/utils/signature.ts
import { createHash, createHmac } from "crypto";

export interface SignParams {
  secretKey: string;
  region: string;
  timestamp: string;
  payload: string;
  service?: string;
  path?: string;
  target?: string;
}

export function sign({
  secretKey,
  region,
  timestamp,
  payload,
  service = 'paapi5',
  path = 'GetItems',
  target = `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems`
}: SignParams): string {
  const dateStamp = timestamp.split('T')[0].replace(/-/g, '');
  const canonicalUri = `/paapi5/${path}`;

  const canonicalHeaders = [
    'content-type:application/json; charset=utf-8',
    'host:webservices.amazon.co.jp',
    `x-amz-date:${timestamp}`,
    `x-amz-target:${target}`
  ].join('\n');

  const canonicalRequest = [
    'POST',
    canonicalUri,
    '',
    canonicalHeaders,
    '',
    'content-type;host;x-amz-date;x-amz-target',
    createHash('sha256').update(payload).digest('hex')
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    credentialScope,
    createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n');

  const kDate = createHmac('sha256', `AWS4${secretKey}`).update(dateStamp).digest();
  const kRegion = createHmac('sha256', kDate).update(region).digest();
  const kService = createHmac('sha256', kRegion).update(service).digest();
  const kSigning = createHmac('sha256', kService).update('aws4_request').digest();

  return createHmac('sha256', kSigning).update(stringToSign).digest('hex');
}