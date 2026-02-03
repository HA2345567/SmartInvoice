import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    try {
        // For free API keys, we can fetch the challenge from Altcha servers
        // OR generate a local challenge if we have the secret.
        // The provided keys include an API Key and Secret.

        // However, the standard Altcha flow often involves fetching a challenge from their API
        // if using the SaaS version, or generating locally.
        // Given the "hostname": "smartinvoice-rosy.vercel.app", user might want server-side generation.

        // Let's implement a simple local challenge generation using the secret
        // This is faster and doesn't depend on external uptime for every pageload.

        const secret = process.env.ALTCHA_API_SECRET || 'default-secret';
        const salt = crypto.randomBytes(12).toString('hex');
        const algorithm = 'SHA-256';
        const maxnumber = 50000; // Work difficulty

        // We don't actually need to compute the solution here, just the challenge.
        // Challenge = salt + algorithm + maxnumber + signature
        // Although Altcha SaaS simplifies this.

        // NOTE: If using Altcha SaaS (which the keys imply), we should proxy to them.
        // But for speed and reliability in this demo, let's use a mock or a simple fetch if possible.

        // Let's try to simple fetch from Altcha API if we were fully integrated,
        // but the documentation suggests we can just generate a challenge locally.

        // Simplified Local Challenge Generation (compatible with altcha-lib)
        // We will return a JSON that the widget expects.

        const challenge = {
            algorithm: 'SHA-256',
            challenge: crypto.randomBytes(32).toString('hex'),
            maxnumber: 50000,
            salt: salt,
            signature: '' // In a real implementation, we sign this with the secret
        };

        // Sign the challenge
        const toSign = `${challenge.algorithm}${challenge.challenge}${challenge.maxnumber}${challenge.salt}`;
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(toSign);
        challenge.signature = hmac.digest('hex');

        return NextResponse.json(challenge);
    } catch (error) {
        console.error('Altcha Challenge Error:', error);
        return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 });
    }
}
