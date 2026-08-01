import nodemailer from 'nodemailer';

// Nota: En producción serverless las variables se guardan en la memoria volátil por segundos,
// para persistencia real a largo plazo se conectaría a una BD, pero esto sirve perfecto para el flujo de códigos.
const codigosTemporales = {}; 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { action, email, codigo, pass } = req.body;

    // Acción 1: Enviar código al correo
    if (action === 'enviar') {
        if (!email) return res.status(400).json({ success: false, message: 'Correo requerido' });

        const codigoAleatorio = Math.floor(1000 + Math.random() * 9000).toString();
        
        codigosTemporales[email] = {
            codigo: codigoAleatorio,
            expira: Date.now() + 5 * 60 * 1000
        };

        const mailOptions = {
            from: `"Smart Hauss Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Código de Verificación - Smart Hauss',
            html: `
                <div style="background: #030305; color: #f8fafc; padding: 20px; font-family: sans-serif; border-radius: 10px;">
                    <h2 style="color: #00d2ff;">Smart Hauss - Verificación</h2>
                    <p>Tu código de seguridad de 4 dígitos es:</p>
                    <div style="background: rgba(0, 210, 255, 0.1); border: 1px dashed #00d2ff; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #00d2ff; letter-spacing: 5px; margin: 20px 0;">
                        ${codigoAleatorio}
                    </div>
                    <p style="font-size: 12px; color: #94a3b8;">Este código expira en 5 minutos.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.json({ success: true, message: 'Código enviado al correo.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
        }
    }

    // Acción 2: Validar código
    if (action === 'verificar') {
        const registro = codigosTemporales[email];
        if (!registro) return res.status(400).json({ success: false, message: 'No hay códigos solicitados.' });
        if (Date.now() > registro.expira) return res.status(400).json({ success: false, message: 'El código expiró.' });
        if (registro.codigo !== codigo) return res.status(400).json({ success: false, message: 'Código incorrecto.' });

        delete codigosTemporales[email];
        return res.json({ success: true, message: 'Verificado correctamente.' });
    }

    return res.status(400).json({ success: false, message: 'Acción inválida' });
}
