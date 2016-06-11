export const IS_NODE          = (typeof window === 'undefined');
export const API_BASE         = 'https://api.temp-mail.ru/request/';
export const API_FORMAT       = '/format/' + (IS_NODE ? 'json' : 'jsonp?callback=messages');
export const ENDPOINT_INBOX   = 'mail/id';
export const ENDPOINT_DOMAINS = 'domains';
export const ENDPOINT_DELETE  = 'delete/id';
