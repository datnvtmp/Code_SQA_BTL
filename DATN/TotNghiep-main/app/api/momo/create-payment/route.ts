import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface MomoPaymentRequest {
  amount: number;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  cancelUrl: string;
  ipnUrl: string;
  extraData: string;
  requestType: string;
  lang: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MomoPaymentRequest = await request.json();
    
    // Cấu hình MoMo Sandbox
    const MOMO_PARTNER_CODE = 'MOMO';
    const MOMO_ACCESS_KEY = 'F8BBA842ECF85';
    const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const MOMO_ENDPOINT = 'https://test-payment.momo.vn/v2/gateway/api/create';
    
    // Tạo các tham số cần thiết
    const requestId = body.orderId;
    const orderGroupId = '';
    const autoCapture = true;
    
    // Tạo raw signature theo đúng format MoMo yêu cầu
    // KHÔNG mã hóa URL trong raw signature
    const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${body.amount}&extraData=${body.extraData}&ipnUrl=${body.ipnUrl}&orderId=${body.orderId}&orderInfo=${body.orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${body.redirectUrl}&requestId=${requestId}&requestType=${body.requestType}`;
    
    console.log('Raw signature string:', rawSignature);
    
    // Tạo signature HMAC SHA256
    const signature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');
    
    console.log('Generated signature:', signature);
    
    // Dữ liệu gửi đến MoMo
    const requestBody = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: body.amount,
      orderId: body.orderId,
      orderInfo: body.orderInfo,
      redirectUrl: body.redirectUrl,
      ipnUrl: body.ipnUrl,
      lang: body.lang,
      requestType: body.requestType,
      autoCapture: autoCapture,
      extraData: body.extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    };

    console.log('Sending to MoMo:', JSON.stringify(requestBody, null, 2));

    // Gọi API MoMo sandbox
    const response = await fetch(MOMO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const momoResponse = await response.json();
    console.log('MoMo response:', momoResponse);

    if (momoResponse.resultCode === 0) {
      return NextResponse.json({
        payUrl: momoResponse.payUrl,
        orderId: body.orderId,
        deeplink: momoResponse.deeplink,
      });
    } else {
      // Log chi tiết lỗi để debug
      console.error('MoMo error details:', {
        message: momoResponse.message,
        resultCode: momoResponse.resultCode,
        rawSignature: rawSignature,
      });
      
      return NextResponse.json(
        { 
          errorMessage: momoResponse.message || 'MoMo payment creation failed',
          resultCode: momoResponse.resultCode,
          rawSignature: rawSignature, // Gửi để debug
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Momo payment error:', error);
    return NextResponse.json(
      { 
        errorMessage: error instanceof Error ? error.message : 'Internal server error',
        resultCode: 99,
      },
      { status: 500 }
    );
  }
}