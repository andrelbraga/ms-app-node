import { init } from '@somosphi/logger';

export const { AxiosLogger, ExpressLogger, Logger, Redact } = init({
  PROJECT_NAME: 'backoffice-bff',
  OMIT_ROUTES: ['/status', '/info'],
});

Redact.addKey(/^payment_slip_html$/);
Redact.addKey(/^payment_slip_pdf$/);
Redact.addKey(/^content$/);
Redact.addKey(/^password$/);
Redact.addKey(/^User-info$/i);
Redact.addValue(/password=/);
