import { createHmac, timingSafeEqual } from 'crypto';
import type { IDataObject } from 'n8n-workflow';

/** Deliveries older or newer than this are rejected, so a captured request cannot be replayed later. */
export const SIGNATURE_MAX_AGE_MS = 5 * 60 * 1000;

export type SignatureVerdict = 'ok' | 'no-key' | 'missing-headers' | 'stale' | 'bad-signature';

/** The key Xentral signs with. The key stored at registration wins, a key of at least 20 characters from the node is next. */
export function resolveSigningKey(parameterKey: string, webhookData: IDataObject): string {
	const stored = typeof webhookData.signatureKey === 'string' ? webhookData.signatureKey : '';
	if (stored.length >= 20) return stored;
	const fromNode = (parameterKey || '').trim();
	return fromNode.length >= 20 ? fromNode : '';
}

function parseTimestampMs(raw: string): number {
	const value = raw.trim();
	if (/^\d+(\.\d+)?$/.test(value)) {
		const n = Number(value);
		return n > 1e12 ? n : n * 1000;
	}
	return Date.parse(value);
}

/** HMAC-SHA256 over raw body plus timestamp, constant-time compare, and a freshness window. */
export function verifyXentralSignature(
	signatureKey: string,
	rawBody: string,
	xentralSignature: string,
	xentralTimestamp: string,
	nowMs: number,
): SignatureVerdict {
	if (!signatureKey) return 'no-key';
	if (!xentralSignature || !xentralTimestamp) return 'missing-headers';

	const sentAt = parseTimestampMs(xentralTimestamp);
	if (!Number.isFinite(sentAt) || Math.abs(nowMs - sentAt) > SIGNATURE_MAX_AGE_MS) return 'stale';

	const message = rawBody + xentralTimestamp;
	const expected = createHmac('sha256', signatureKey).update(message).digest('hex');
	try {
		const sigBuffer = Buffer.from(xentralSignature, 'hex');
		const expectedBuffer = Buffer.from(expected, 'hex');
		if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
			return 'bad-signature';
		}
	} catch {
		return 'bad-signature';
	}
	return 'ok';
}
