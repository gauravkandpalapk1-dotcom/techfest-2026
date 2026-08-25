#TEAM : AQUILA

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## QR Check-in / Check-out Demo

This version adds a frontend attendance workflow:

- Registration generates a unique PULSE ticket ID and QR code.
- Ticket data is stored in browser `localStorage` for the demo.
- Email, SMS and WhatsApp buttons open the user's installed/default messaging channel with a prefilled confirmation.
- Staff check-in is available at `/?admin=1`.
- The staff console scans QR codes using the device camera and supports manual ticket-ID lookup.
- Duplicate check-ins and invalid check-outs are blocked.
- Check-in/check-out timestamps and dashboard counters are persisted locally.

### Dependencies

The QR workflow uses:

- `qrcode.react` for QR rendering.
- `html5-qrcode` for camera-based scanning.

Run `npm install` after extracting the project, then `npm run dev`.

### Production note

Because the project is frontend-only, attendance is stored locally in the browser. Real multi-device attendance, automated email delivery, and automated WhatsApp/SMS messaging require a secure backend/database and server-side notification providers. API credentials should never be placed in frontend code.

AUTHORS: 
1) GAURAV KANDPAL
2) CHANDRA PRAKASH SHARMA
3) GAURAV DUMKA
4) AMIT BHATT
   
