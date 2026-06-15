import crypto from 'crypto';

// Midtrans configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_ENV = process.env.MIDTRANS_ENV || 'sandbox'; // 'sandbox' or 'production'

const MIDTRANS_API_BASE =
    MIDTRANS_ENV === 'production'
        ? 'https://app.midtrans.com/snap/v1'
        : 'https://app.sandbox.midtrans.com/snap/v1';

const MIDTRANS_CORE_API =
    MIDTRANS_ENV === 'production'
        ? 'https://api.midtrans.com/v2'
        : 'https://api.sandbox.midtrans.com/v2';

/**
 * Interface for Snap transaction parameters
 */
export interface SnapTransactionParams {
    orderId: string;
    amount: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    items?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
    }>;
}

/**
 * Generate a Snap token for Midtrans popup payment
 * This handles the down payment (DP) for online reservations
 */
export async function createSnapTransaction(params: SnapTransactionParams): Promise<{
    token: string;
    redirect_url: string;
}> {
    const { orderId, amount, customerName, customerEmail, customerPhone, items } = params;

    const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

    const payload: any = {
        transaction_details: {
            order_id: orderId,
            gross_amount: amount,
        },
        credit_card: {
            secure: true,
        },
        customer_details: {
            first_name: customerName || 'Pelanggan',
            email: customerEmail || 'pelanggan@ruangkopi.site',
            phone: customerPhone || '08123456789',
        },
        // Enable all payment methods
        enabled_payments: [
            'qris',
            'gopay',
            'shopeepay',
            'bca_va',
            'bni_va',
            'bri_va',
            'mandiri_va',
            'permata_va',
            'other_va',
            'cstore',
        ],
        callbacks: {
            finish: `${process.env.FRONTEND_URL || 'https://ruangkopi.site'}/reservation/success`,
            error: `${process.env.FRONTEND_URL || 'https://ruangkopi.site'}/reservation/error`,
            pending: `${process.env.FRONTEND_URL || 'https://ruangkopi.site'}/reservation/pending`,
        },
    };

    if (items && items.length > 0) {
        payload.item_details = items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            name: item.name.substring(0, 50), // Midtrans limit
        }));
    }

    const response = await fetch(`${MIDTRANS_API_BASE}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('[Midtrans] Snap token creation failed:', errorBody);
        throw new Error(`Midtrans Snap API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return {
        token: data.token,
        redirect_url: data.redirect_url,
    };
}

/**
 * Verify Midtrans webhook signature for security
 */
export function verifyWebhookSignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
): boolean {
    if (!MIDTRANS_SERVER_KEY) {
        console.warn('[Midtrans] Server key not configured, skipping signature verification');
        return true; // Allow in development without key
    }

    const raw = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
    const computed = crypto.createHash('sha512').update(raw).digest('hex');

    const isValid = computed === signatureKey;
    if (!isValid) {
        console.error('[Midtrans] Invalid webhook signature!');
        console.error(`  Expected: ${computed}`);
        console.error(`  Received: ${signatureKey}`);
    }

    return isValid;
}

/**
 * Check transaction status directly from Midtrans (for manual verification)
 */
export async function getTransactionStatus(orderId: string): Promise<{
    status: string;
    paymentType: string;
    transactionTime: string;
    grossAmount: string;
}> {
    const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

    const response = await fetch(`${MIDTRANS_CORE_API}/${orderId}/status`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Basic ${authString}`,
        },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Midtrans status check error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return {
        status: data.transaction_status,
        paymentType: data.payment_type,
        transactionTime: data.transaction_time,
        grossAmount: data.gross_amount,
    };
}

/**
 * Map Midtrans transaction status to our internal status
 */
export function mapMidtransStatus(midtransStatus: string): 'pending' | 'settlement' | 'expire' | 'cancel' {
    switch (midtransStatus) {
        case 'capture':
        case 'settlement':
            return 'settlement';
        case 'pending':
            return 'pending';
        case 'deny':
        case 'cancel':
        case 'failure':
            return 'cancel';
        case 'expire':
            return 'expire';
        default:
            return 'pending';
    }
}
