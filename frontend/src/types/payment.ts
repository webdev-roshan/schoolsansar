export interface RegisterOrganizationPayload {
    organization_name: string;
    subdomain: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
}

export interface RegisterOrganizationResponse {
    message: string;
    domain_url: string;
    organization_name: string;
}

export interface InitPaymentPayload {
    organization_name: string;
    subdomain: string;
    username: string;
    email: string;
    password: string;
    phone: string;
}

export interface InitPaymentResponse {
    signature: string;
    transaction_uuid: string;
    product_code: string;
    amount: string;
    url: string;
    verified_url: string;
}
