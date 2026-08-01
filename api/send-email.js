import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  const { email, codigo, tipo } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const asunto = tipo === 'registro' ? 'Código de Verificación - Smart Hauss' : 'Recuperación de Contraseña - Smart Hauss';
  const mensaje = tipo === 'registro' 
    ? `Tu código de verificación para Smart Hauss es: ${codigo}` 
    : `Tu código para restablecer tu contraseña es: ${codigo}`;

  try {
    await transporter.sendMail({
      from: '"Smart Hauss" <no-reply@smarthauss.com>',
      to: email,
      subject: asunto,
      text: mensaje
    });

    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
