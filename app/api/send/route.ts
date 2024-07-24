const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export async function POST(request: Request) {
    const { recipient, fileUrl } = await request.json()

    try {
        let emailHTML = '<p>Your file has been uploaded and the processing has begun. You may access the file here:</p>'
        emailHTML += '<p>' + fileUrl + '</p>'

        const msg = {
            to: recipient,
            from: process.env.SENDGRID_SENDER_EMAIL,
            subject: 'Audie File Upload',
            html: emailHTML,
          }
        
        const data = await sgMail.send(msg)

        return Response.json({ data });
    } catch (error) {
        return Response.json({ error });
    }
}
